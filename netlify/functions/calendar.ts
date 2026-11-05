import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { google, calendar_v3 } from "googleapis";

// ===== CONFIG =====
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const CLIENT_TIMEZONE = "America/Chicago"; // CDT = America/Chicago
const BUSINESS_HOURS = {
  start: 8,  // 8 AM
  end: 21,   // 9 PM
  sunday: { start: 14, end: 18 }, // 2 PM - 6 PM
};
const SLOT_DURATION_MINUTES = 60; // 1-hour slots
const GAP_MINUTES = 60; // 1-hour gap between meetings

// ===== GOOGLE AUTH =====
function getAuth() {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!json) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");
  // Trim whitespace/BOM that can break JSON.parse
  const cleaned = json.trim().replace(/^\uFEFF/, "");
  const credentials = JSON.parse(cleaned);
  
  // Ensure private_key has actual newlines (not escaped \n)
  if (credentials.private_key && credentials.private_key.includes("\\n") && !credentials.private_key.includes("\n")) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
  }
  
  return new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
}

function getCalendar() {
  const auth = getAuth();
  return google.calendar({ version: "v3", auth });
}

// ===== HELPERS =====
function parseDateInZone(dateStr: string, zone: string): Date {
  // dateStr is YYYY-MM-DD, treat as local date in zone at midnight
  return new Date(`${dateStr}T00:00:00`);
}

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
  // For America/Chicago, calculate DST manually (reliable in Netlify)
  const date = new Date(`${dateStr}T12:00:00`);
  const year = date.getUTCFullYear();
  // DST starts 2nd Sunday March at 2 AM local (8 AM UTC)
  // DST ends 1st Sunday November at 2 AM local (7 AM UTC)

  // Helper: get first Sunday on or after a given date
  const getFirstSunday = (month: number, day: number, hour: number): Date => {
    const d = new Date(Date.UTC(year, month, day, hour, 0, 0));
    const dayOfWeek = d.getUTCDay(); // 0 = Sunday
    const daysToAdd = (7 - dayOfWeek) % 7;
    d.setUTCDate(d.getUTCDate() + daysToAdd);
    return d;
  };

  const marchSecondSunday = new Date(getFirstSunday(2, 1, 6)); // March 1, 6 AM UTC
  marchSecondSunday.setUTCDate(marchSecondSunday.getUTCDate() + 7);
  marchSecondSunday.setUTCHours(8, 0, 0, 0); // 2 AM CDT = 8 AM UTC

  const novemberFirstSunday = getFirstSunday(10, 1, 6); // Nov 1, 6 AM UTC
  novemberFirstSunday.setUTCHours(7, 0, 0, 0); // 2 AM CDT = 7 AM UTC (CDT is UTC-5)

  // In DST period: CDT (UTC-5), else CST (UTC-6)
  if (date >= marchSecondSunday && date < novemberFirstSunday) {
    return -5; // CDT
  }
  return -6; // CST
}

function isWithinBusinessHours(date: Date): boolean {
  // Check business hours in the target timezone (America/Chicago)
  const day = getDayName(date);
  // Get hour in the target timezone
  const hour = date.toLocaleString("en-US", { timeZone: CLIENT_TIMEZONE, hour12: false, hour: "numeric" });
  const hourNum = parseInt(hour);
  if (day === "Sunday") {
    return hourNum >= BUSINESS_HOURS.sunday.start && hourNum < BUSINESS_HOURS.sunday.end;
  }
  return hourNum >= BUSINESS_HOURS.start && hourNum < BUSINESS_HOURS.end;
}

function generateSlotsForDate(dateStr: string): Array<{ start: Date; end: Date; label: string; value: string }> {
  const slots: Array<{ start: Date; end: Date; label: string; value: string }> = [];
  const baseDate = parseDateInZone(dateStr, CLIENT_TIMEZONE);
  const day = getDayName(baseDate);

  let startHour = BUSINESS_HOURS.start;
  let endHour = BUSINESS_HOURS.end;
  if (day === "Sunday") {
    startHour = BUSINESS_HOURS.sunday.start;
    endHour = BUSINESS_HOURS.sunday.end;
  }

  // Get the timezone offset for this date in America/Chicago (handles DST)
    const offsetHours = getTimezoneOffsetHours(dateStr);
    const offsetSign = offsetHours >= 0 ? "+" : "-";
    const offsetAbs = Math.abs(offsetHours);
    const offsetStr = `${offsetSign}${String(offsetAbs).padStart(2, "0")}:00`;

  for (let hour = startHour; hour < endHour; hour += SLOT_DURATION_MINUTES / 60) {
    // Create date in the target timezone by constructing ISO string with explicit offset
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

async function getBusySlots(calendar: calendar_v3.Calendar, calendarId: string, dateStr: string): Promise<Array<{ start: Date; end: Date }>> {
  const dayStart = parseDateInZone(dateStr, CLIENT_TIMEZONE);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);
  
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      timeZone: CLIENT_TIMEZONE,
      items: [{ id: calendarId }],
    },
  });
  
  const busy = res.data.calendars?.[calendarId]?.busy ?? [];
  return busy.map((b) => ({
    start: new Date(b.start!),
    end: new Date(b.end!),
  }));
}

function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  busySlots: Array<{ start: Date; end: Date }>
): boolean {
  // Check if slot overlaps with any busy period (including 1-hour gap)
  for (const busy of busySlots) {
    const gapStart = new Date(busy.start);
    gapStart.setMinutes(gapStart.getMinutes() - GAP_MINUTES);
    const gapEnd = new Date(busy.end);
    gapEnd.setMinutes(gapEnd.getMinutes() + GAP_MINUTES);
    
    // Check overlap: slotStart < gapEnd && slotEnd > gapStart
    if (slotStart < gapEnd && slotEnd > gapStart) {
      return false;
    }
  }
  return true;
}

// ===== NETLIFY FUNCTION =====
export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
  const calendar = getCalendar();
  
  // CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };
  
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  
  try {
      if (event.httpMethod === "GET") {
        // GET /calendar/availability?date=YYYY-MM-DD
        const date = event.queryStringParameters?.date;
        if (!date) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: "date parameter required" }) };
        }
      
        // Validate date is not in the past (in client timezone)
        const today = new Date();
        const todayStr = today.toLocaleDateString("en-CA", { timeZone: CLIENT_TIMEZONE }); // YYYY-MM-DD
        if (date < todayStr) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: "Cannot book past dates", slots: [] }) };
        }
     
        // Generate all possible slots for the date
        const allSlots = generateSlotsForDate(date);
      
        // Get busy slots from Google Calendar
        const busySlots = await getBusySlots(calendar, calendarId, date);
      
        // Filter available slots
        const availableSlots = allSlots.filter((slot) => 
          isSlotAvailable(slot.start, slot.end, busySlots)
        );
      
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            date,
            timezone: CLIENT_TIMEZONE,
            slots: availableSlots.map((s) => ({
              label: s.label,
              value: s.value, // ISO string
              start: s.start.toISOString(),
              end: s.end.toISOString(),
            })),
          }),
        };
      }
    
    if (event.httpMethod === "POST") {
      // POST /calendar/book - create event
      const body = JSON.parse(event.body || "{}");
      const { startTime, endTime, summary, description, attendees } = body;
      
      if (!startTime || !endTime) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "startTime and endTime required" }) };
      }
      
      const eventRes = await calendar.events.insert({
        calendarId,
        requestBody: {
          summary: summary || "KSEFinServe Session",
          description: description || "",
          start: { dateTime: startTime, timeZone: CLIENT_TIMEZONE },
          end: { dateTime: endTime, timeZone: CLIENT_TIMEZONE },
          attendees: attendees?.map((email: string) => ({ email })) || [],
          reminders: { useDefault: true },
        },
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          eventId: eventRes.data.id,
          htmlLink: eventRes.data.htmlLink,
        }),
      };
    }
    
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (err: any) {
    console.error("Calendar API error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || "Internal server error" }),
    };
  }
};