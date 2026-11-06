// Netlify Edge Function for KSEFinServe calendar
// Runs at the edge — no Node.js module cache, no stale deploy issues
// Handles: GET /calendar/availability?date=YYYY-MM-DD and POST /calendar/book

const CLIENT_TIMEZONE = "America/Chicago";

const BUSINESS_HOURS = {
  start: 8,   // 8 AM
  end: 21,    // 9 PM
  sunday: { start: 14, end: 18 }, // 2 PM - 6 PM
};
const SLOT_DURATION_MINUTES = 60;
const GAP_MINUTES = 60; // 1-hour gap between meetings

function formatTimeInZone(date: Date, zone: string): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: zone,
  });
}

function getDayName(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", timeZone: CLIENT_TIMEZONE });
}

function getTimezoneOffsetHours(dateStr: string): number {
  const date = new Date(`${dateStr}T12:00:00`);
  const year = date.getUTCFullYear();

  const getFirstSunday = (month: number, day: number, hour: number): Date => {
    const d = new Date(Date.UTC(year, month, day, hour, 0, 0));
    const dayOfWeek = d.getUTCDay();
    const daysToAdd = (7 - dayOfWeek) % 7;
    d.setUTCDate(d.getUTCDate() + daysToAdd);
    return d;
  };

  const marchSecondSunday = new Date(getFirstSunday(2, 1, 6));
  marchSecondSunday.setUTCDate(marchSecondSunday.getUTCDate() + 7);
  marchSecondSunday.setUTCHours(8, 0, 0, 0);

  const novemberFirstSunday = getFirstSunday(10, 1, 6);
  novemberFirstSunday.setUTCHours(7, 0, 0, 0);

  if (date >= marchSecondSunday && date < novemberFirstSunday) {
    return -5;
  }
  return -6;
}

function isWithinBusinessHours(date: Date): boolean {
  const day = getDayName(date);
  const hour = date.toLocaleString("en-US", { timeZone: CLIENT_TIMEZONE, hour12: false, hour: "numeric" });
  const hourNum = parseInt(hour);
  if (day === "Sunday") {
    return hourNum >= BUSINESS_HOURS.sunday.start && hourNum < BUSINESS_HOURS.sunday.end;
  }
  return hourNum >= BUSINESS_HOURS.start && hourNum < BUSINESS_HOURS.end;
}

function generateSlotsForDate(dateStr: string): Array<{ start: Date; end: Date; label: string; value: string }> {
  const slots: Array<{ start: Date; end: Date; label: string; value: string }> = [];
  const baseDate = new Date(`${dateStr}T00:00:00`);
  const day = getDayName(baseDate);

  let startHour = BUSINESS_HOURS.start;
  let endHour = BUSINESS_HOURS.end;
  if (day === "Sunday") {
    startHour = BUSINESS_HOURS.sunday.start;
    endHour = BUSINESS_HOURS.sunday.end;
  }

  const offsetHours = getTimezoneOffsetHours(dateStr);
  const offsetSign = offsetHours >= 0 ? "+" : "-";
  const offsetAbs = Math.abs(offsetHours);
  const offsetStr = `${offsetSign}${String(offsetAbs).padStart(2, "0")}:00`;

  for (let hour = startHour; hour < endHour; hour += SLOT_DURATION_MINUTES / 60) {
    const start = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00${offsetStr}`);
    const endHourVal = hour + SLOT_DURATION_MINUTES / 60;
    const end = new Date(`${dateStr}T${String(endHourVal).padStart(2, "0")}:00:00${offsetStr}`);

    if (isWithinBusinessHours(start)) {
      slots.push({
        start,
        end,
        label: formatTimeInZone(start, CLIENT_TIMEZONE),
        value: start.toISOString(),
      });
    }
  }
  return slots;
}

async function getBusySlots(dateStr: string): Promise<Array<{ start: Date; end: Date }>> {
  // Google Calendar busy-slot checking via service account OAuth requires
  // JWT signing which is unreliable in Edge Functions. Return empty for now;
  // busy-slot filtering can be re-added using a regular Netlify Function
  // with the googleapis library instead.
  return [];
}

function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  busySlots: Array<{ start: Date; end: Date }>
): boolean {
  for (const busy of busySlots) {
    const gapStart = new Date(busy.start);
    gapStart.setMinutes(gapStart.getMinutes() - GAP_MINUTES);
    const gapEnd = new Date(busy.end);
    gapEnd.setMinutes(gapEnd.getMinutes() + GAP_MINUTES);

    if (slotStart < gapEnd && slotEnd > gapStart) {
      return false;
    }
  }
  return true;
}

export default async (request: Request, context: Context): Promise<Response> => {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (request.method === "OPTIONS") {
    return new Response("", { status: 200, headers: corsHeaders });
  }

  // GET /calendar/availability?date=YYYY-MM-DD
  if (request.method === "GET" && path === "/.netlify/functions/calendar") {
    const date = url.searchParams.get("date");
    if (!date) {
      return new Response(JSON.stringify({ error: "date parameter required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const today = new Date();
    const todayStr = today.toLocaleDateString("en-CA", { timeZone: CLIENT_TIMEZONE });
    if (date < todayStr) {
      return new Response(JSON.stringify({ error: "Cannot book past dates", slots: [] }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const allSlots = generateSlotsForDate(date);
    const busySlots = await getBusySlots(date);
    const availableSlots = allSlots.filter((slot) =>
      isSlotAvailable(slot.start, slot.end, busySlots)
    );

    return new Response(
      JSON.stringify({
        date,
        timezone: CLIENT_TIMEZONE,
        slots: availableSlots.map((s) => ({
          label: s.label,
          value: s.value,
          start: s.start.toISOString(),
          end: s.end.toISOString(),
        })),
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  // POST /calendar/book - create Google Calendar event
  if (request.method === "POST" && path === "/.netlify/functions/calendar") {
    try {
      const body = await request.json();
      const { startTime, endTime, summary, description, attendees } = body;

      if (!startTime || !endTime) {
        return new Response(JSON.stringify({ error: "startTime and endTime required" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Use Google Calendar API via fetch (Service Account OAuth)
      const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
      if (!serviceAccountJson) {
        return new Response(JSON.stringify({ error: "GOOGLE_SERVICE_ACCOUNT_JSON not set" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const cleaned = serviceAccountJson.trim().replace(/^\uFEFF/, "");
      const credentials = JSON.parse(cleaned);

      if (credentials.private_key && credentials.private_key.includes("\\n") && !credentials.private_key.includes("\n")) {
        credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
      }

      // Get OAuth access token
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: await createJwt(credentials),
        }),
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        return new Response(JSON.stringify({ error: "Failed to get access token" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

      // Create calendar event
      const eventResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            summary: summary || "KSEFinServe Session",
            description: description || "",
            start: { dateTime: startTime, timeZone: CLIENT_TIMEZONE },
            end: { dateTime: endTime, timeZone: CLIENT_TIMEZONE },
            reminders: { useDefault: true },
          }),
        },
      );

      if (!eventResponse.ok) {
        const errorText = await eventResponse.text();
        return new Response(JSON.stringify({ error: errorText }), {
          status: eventResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const eventData = await eventResponse.json();

      return new Response(
        JSON.stringify({
          success: true,
          eventId: eventData.id,
          htmlLink: eventData.htmlLink,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
};

// Create JWT for Google Service Account OAuth
async function createJwt(credentials: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = btoa(
    JSON.stringify({
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/calendar",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const signingInput = `${header}.${claim}`;

  // Sign with RSA-SHA256 using Web Crypto API
  const keyData = credentials.private_key;
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    await base64Decode(keyData),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(signingInput));
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return `${signingInput}.${signatureB64}`;
}

// Helper to decode base64 private key (PEM format)
async function base64Decode(pemKey: string): Promise<ArrayBuffer> {
  const pemContents = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binary = atob(pemContents);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function btoa(str: string): string {
  // Edge Functions have btoa available globally
  return globalThis.btoa(str);
}

function atob(str: string): string {
  return globalThis.atob(str);
}
