import type { Config, Context } from "@netlify/functions";

import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Brand colors (matching email.ts)
const NAVY = "#081d2b";
const GOLD = "#c9a963";
const CREAM = "#f0ede6";
const WHITE = "#ffffff";
const GRAY = "#6b7280";

// Timezone mapping for common countries
const COUNTRY_TIMEZONES: Record<string, string> = {
  "Nigeria": "Africa/Lagos",
  "United States": "America/Chicago",
  "United Kingdom": "Europe/London",
  "Canada": "America/Toronto",
  "Ghana": "Africa/Accra",
  "South Africa": "Africa/Johannesburg",
  "Kenya": "Africa/Nairobi",
  "United Arab Emirates": "Asia/Dubai",
  "Singapore": "Asia/Singapore",
  "Australia": "Australia/Sydney",
};

function getTimezoneAbbreviation(date: Date, timeZone: string): string {
  try {
    return date.toLocaleTimeString("en-US", { timeZone, timeZoneName: "short" }).split(" ").pop() || timeZone;
  } catch {
    return timeZone;
  }
}

function formatDateTimeInTimezone(isoTime: string, timeZone: string): string {
  const date = new Date(isoTime);
  if (isNaN(date.getTime())) return isoTime;

  const day = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone,
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  });
  const tz = getTimezoneAbbreviation(date, timeZone);
  return `${day} at ${time} ${tz}`;
}

// Inline SVG logo (base64 encoded)
const LOGO_SVG_BASE64 = "PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyOCIgZm9udC1mYW1pbHk9Ikdlb3JnaWEsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiMwODFkMmIiPktTRUZJTlNFUlZFPHRleHQgeD0iNzAiIHk9IjI4IiBmb250LWZhbWlseT0iR2VvcmdpYSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iI2M5YTk2MyI+PC90ZXh0Pjwvc3ZnPg==";

function buildReminderEmail({
  firstName,
  meetingTime,
  meetingTimeUserTZ,
  userTimezone,
  reference,
  reminderType,
}: {
  firstName: string;
  meetingTime: string; // CST time for admin reference
  meetingTimeUserTZ: string; // User's local time
  userTimezone: string;
  reference: string;
  reminderType: "24h" | "morning";
}) {
  const subject = reminderType === "24h"
    ? `Reminder: Your KSEFinServe session tomorrow (${reference})`
    : `Today's session with KSEFinServe (${reference})`;

  const preheader = reminderType === "24h"
    ? `Your session is in 24 hours — ${meetingTimeUserTZ}`
    : `Your session is today at ${meetingTimeUserTZ}`;

  const title = reminderType === "24h"
    ? "Your session is tomorrow"
    : "Your session is today";

  const message = reminderType === "24h"
    ? "This is a friendly reminder that your session with Kayode Samson Elepe, RR is scheduled for tomorrow."
    : "This is a friendly reminder that your session with Kayode Samson Elepe, RR is scheduled for today.";

  const adminNote = reminderType === "24h"
    ? "We'll reach out if any adjustments are needed. Please check your email for the meeting link."
    : "We'll be connecting at the scheduled time. Please check your email for the meeting link.";

  return {
    subject,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:${WHITE};border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
    <!-- Header -->
    <tr>
      <td style="background:${NAVY};padding:32px 24px;text-align:center;">
        <img src="data:image/svg+xml;base64,${LOGO_SVG_BASE64}" alt="KSEFinServe" width="120" style="display:block;margin:0 auto;" />
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:40px 32px;">
        <p style="margin:0 0 8px;font-size:14px;color:${GOLD};font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">Session Reminder</p>
        <h1 style="margin:0 0 24px;font-size:28px;line-height:1.3;color:${NAVY};">${title}</h1>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1f2937;">Hi ${firstName || "there"},</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1f2937;">${message}</p>
        
        <!-- Meeting Details Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};border-radius:8px;margin:24px 0;">
          <tr>
            <td style="padding:24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:12px;color:${GRAY};text-transform:uppercase;letter-spacing:0.5px;padding-bottom:4px;">YOUR TIME (${userTimezone})</td>
                </tr>
                <tr>
                  <td style="font-size:22px;font-weight:600;color:${NAVY};padding-bottom:16px;">${meetingTimeUserTZ}</td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:${GRAY};text-transform:uppercase;letter-spacing:0.5px;padding-bottom:4px;">ADMIN TIME (CST/CDT)</td>
                </tr>
                <tr>
                  <td style="font-size:16px;color:#1f2937;">${meetingTime}</td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:${GRAY};text-transform:uppercase;letter-spacing:0.5px;padding-top:16px;padding-bottom:4px;">REFERENCE</td>
                </tr>
                <tr>
                  <td style="font-family:monospace;font-size:14px;color:#1f2937;">${reference}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="margin:24px 0 16px;font-size:16px;line-height:1.6;color:#1f2937;">${adminNote}</p>
        
        <!-- Add to Calendar Button -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
          <tr>
            <td align="center">
              <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=KSEFinServe+Session&details=${encodeURIComponent("Session with Kayode Samson Elepe, RR")}&dates=${encodeURIComponent(meetingTimeUserTZ.replace(" at ", "T").replace(" ", "T"))}&sf=true" target="_blank" style="display:inline-block;background:${GOLD};color:${NAVY};padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">Add to Google Calendar</a>
            </td>
          </tr>
        </table>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
        <p style="margin:0;font-size:13px;line-height:1.6;color:${GRAY};">If you need to reschedule or have questions, reply to this email or contact us at info@ksefinserve.com</p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background:${NAVY};padding:24px;text-align:center;">
        <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.7);">KSEFinServe &bull; Clarity starts with a conversation</p>
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.5);">You received this because you booked a session. <a href="https://ksefinserve.netlify.app" style="color:${GOLD};">Manage preferences</a></p>
      </td>
    </tr>
  </table>
</body>
</html>`,
    text: `${title}\n\nHi ${firstName || "there"},\n\n${message}\n\nYour time (${userTimezone}): ${meetingTimeUserTZ}\nAdmin time (CST/CDT): ${meetingTime}\nReference: ${reference}\n\n${adminNote}\n\nAdd to calendar: https://www.google.com/calendar/render?action=TEMPLATE&text=KSEFinServe+Session\n\n---\nKSEFinServe\nClarity starts with a conversation\nhttps://ksefinserve.netlify.app`,
  };
}

async function sendEmail(to: string, subject: string, html: string, text: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"KSEFinServe" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    text,
  });
}

export default async function handler(req: Request, context: Context) {
  // Verify this is a scheduled invocation (optional: add secret check)
  const cronSecret = req.headers.get("x-cron-secret");
  if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();
  const results = { sent24h: 0, sentMorning: 0, errors: [] as string[] };

  try {
    // ========== 24-HOUR REMINDERS ==========
    // Find bookings where meeting is in ~24 hours (23-25h window)
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twentyThreeHoursLater = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const twentyFiveHoursLater = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // Query bookings with upcoming meetings in the 24h window
    const { data: bookings24h, error: err24h } = await supabase
      .from("bookings")
      .select("*")
      .eq("reminder_24h_sent", false)
      .neq("status", "Cancelled")
      .neq("status", "Completed")
      .gte("available_time", twentyThreeHoursLater.toISOString())
      .lte("available_time", twentyFiveHoursLater.toISOString());

    if (err24h) throw err24h;

    for (const booking of bookings24h || []) {
      try {
        // Parse meeting time (stored as UTC ISO)
        const meetingUtc = new Date(booking.available_time);
        if (isNaN(meetingUtc.getTime())) continue;

        // Get user's timezone
        const userTz = booking.user_timezone || COUNTRY_TIMEZONES[booking.country || ""] || "UTC";

        // Format times
        const meetingTimeCST = formatDateTimeInTimezone(booking.available_time, "America/Chicago");
        const meetingTimeUser = formatDateTimeInTimezone(booking.available_time, userTz);

        const email = buildReminderEmail({
          firstName: booking.first_name,
          meetingTime: meetingTimeCST,
          meetingTimeUserTZ: meetingTimeUser,
          userTimezone: userTz,
          reference: booking.reference,
          reminderType: "24h",
        });

        await sendEmail(booking.email, email.subject, email.html, email.text);

        // Mark as sent
        await supabase
          .from("bookings")
          .update({ reminder_24h_sent: true })
          .eq("id", booking.id);

        results.sent24h++;
      } catch (e) {
        results.errors.push(`24h reminder for ${booking.id}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // ========== MORNING REMINDERS (8 AM user's timezone) ==========
    // Find bookings where meeting is TODAY in user's timezone
    // We check all upcoming bookings and filter by date in user's TZ
    const { data: bookingsMorning, error: errMorning } = await supabase
      .from("bookings")
      .select("*")
      .eq("reminder_morning_sent", false)
      .neq("status", "Cancelled")
      .neq("status", "Completed")
      .gte("available_time", now.toISOString()); // Meeting hasn't happened yet

    if (errMorning) throw errMorning;

    for (const booking of bookingsMorning || []) {
      try {
        const meetingUtc = new Date(booking.available_time);
        if (isNaN(meetingUtc.getTime())) continue;

        const userTz = booking.user_timezone || COUNTRY_TIMEZONES[booking.country || ""] || "UTC";

        // Check if meeting is TODAY in user's timezone
        const todayInUserTz = now.toLocaleDateString("en-CA", { timeZone: userTz }); // YYYY-MM-DD
        const meetingDateInUserTz = meetingUtc.toLocaleDateString("en-CA", { timeZone: userTz });

        if (meetingDateInUserTz !== todayInUserTz) continue; // Not today in user's TZ

        // Check if it's after 8 AM in user's timezone (don't send before 8 AM)
        const currentHourInUserTz = parseInt(now.toLocaleTimeString("en-US", { hour: "numeric", hour12: false, timeZone: userTz }), 10);
        if (currentHourInUserTz < 8) continue; // Too early, will catch on next run

        const meetingTimeCST = formatDateTimeInTimezone(booking.available_time, "America/Chicago");
        const meetingTimeUser = formatDateTimeInTimezone(booking.available_time, userTz);

        const email = buildReminderEmail({
          firstName: booking.first_name,
          meetingTime: meetingTimeCST,
          meetingTimeUserTZ: meetingTimeUser,
          userTimezone: userTz,
          reference: booking.reference,
          reminderType: "morning",
        });

        await sendEmail(booking.email, email.subject, email.html, email.text);

        await supabase
          .from("bookings")
          .update({ reminder_morning_sent: true })
          .eq("id", booking.id);

        results.sentMorning++;
      } catch (e) {
        results.errors.push(`Morning reminder for ${booking.id}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    return new Response(JSON.stringify({ success: true, ...results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Reminder function error:", e);
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : String(e), ...results }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const config: Config = {
  schedule: "0 */6 * * *", // Every 6 hours: 00:00, 06:00, 12:00, 18:00 UTC
};