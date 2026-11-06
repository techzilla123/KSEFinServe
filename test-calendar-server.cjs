// Local test server for calendar function
// Run: node test-calendar-server.js
// Then: curl "http://localhost:3456/.netlify/functions/calendar?date=2026-11-06"

const { createServer } = require('http');
const { parse } = require('url');

// Import the calendar handler logic
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const CLIENT_TIMEZONE = "America/Chicago";
const BUSINESS_HOURS = {
  start: 8,
  end: 21,
  sunday: { start: 14, end: 18 },
};
const SLOT_DURATION_MINUTES = 60;
const GAP_MINUTES = 60;

function formatTimeInZone(date, zone) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: zone,
  });
}

function getDayName(date) {
  return date.toLocaleDateString("en-US", { weekday: "long", timeZone: CLIENT_TIMEZONE });
}

function getTimezoneOffsetHours(dateStr) {
  const date = new Date(`${dateStr}T12:00:00`);
  const year = date.getUTCFullYear();

  const getFirstSunday = (month, day, hour) => {
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

function isWithinBusinessHours(date) {
  const day = getDayName(date);
  const hour = date.toLocaleString("en-US", { timeZone: CLIENT_TIMEZONE, hour12: false, hour: "numeric" });
  const hourNum = parseInt(hour);
  if (day === "Sunday") {
    return hourNum >= BUSINESS_HOURS.sunday.start && hourNum < BUSINESS_HOURS.sunday.end;
  }
  return hourNum >= BUSINESS_HOURS.start && hourNum < BUSINESS_HOURS.end;
}

function generateSlotsForDate(dateStr) {
  const slots = [];
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

// Handle GET /calendar?date=YYYY-MM-DD
function handleCalendarGet(dateStr) {
  const allSlots = generateSlotsForDate(dateStr);

  return JSON.stringify({
    date: dateStr,
    timezone: CLIENT_TIMEZONE,
    slots: allSlots.map((s) => ({
      label: s.label,
      value: s.value,
      start: s.start.toISOString(),
      end: s.end.toISOString(),
    })),
  });
}

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url || '/', true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (path === '/.netlify/functions/calendar' && req.method === 'GET') {
    const date = query.date;
    if (!date) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'date parameter required' }));
      return;
    }
    res.writeHead(200);
    res.end(handleCalendarGet(date));
    return;
  }

  // Health check
  if (path === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 3456;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Calendar test server running at http://localhost:${PORT}`);
  console.log(`Try: curl "http://localhost:${PORT}/.netlify/functions/calendar?date=2026-11-06"`);
  console.log(`Try: curl "http://localhost:${PORT}/.netlify/functions/calendar?date=2026-11-07"`);
});
