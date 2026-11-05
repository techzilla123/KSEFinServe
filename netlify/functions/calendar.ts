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
  // dateStr is YYYY-MM-DD, treat as local date in zone
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

function isWithinBusinessHours(date: Date): boolean {
  const day = getDayName(date);
  const hour = date.getHours();
  if (day === "Sunday") {
    return hour >= BUSINESS_HOURS.sunday.start && hour < BUSINESS_HOURS.sunday.end;
  }
  return hour >= BUSINESS_HOURS.start && hour < BUSINESS_HOURS.end;
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
  
  for (let hour = startHour; hour < endHour; hour += SLOT_DURATION_MINUTES / 60) {
    const start = new Date(baseDate);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + SLOT_DURATION_MINUTES / 60, 0, 0, 0);
    
    if (isWithinBusinessHours(start)) {
      slots.push({
        start,
        end,
        label: formatTimeInZone(start, CLIENT_TIMEZONE), // e.g., "8:00 AM"
        value: start.toISOString(), // ISO for submission
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