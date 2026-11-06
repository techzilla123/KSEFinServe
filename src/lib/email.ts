/**
 * KSEFinServe Email Template System
 * Beautiful, professionally designed email templates with KSEFinServe branding
 * Colors: Navy #081d2b, Gold #c9a963, Cream #f0ede6, White #ffffff
 * Fonts: Georgia for headings, system fonts for body
 */

const BRAND = {
  colors: {
    navy: "#081d2b",
    gold: "#c9a963",
    goldLight: "#e8d5a3",
    cream: "#f0ede6",
    white: "#ffffff",
    gray: "#6b7280",
    grayLight: "#e5e7eb",
    textDark: "#1f2937",
    textLight: "#6b7280",
  },
  fonts: {
    heading: "Georgia, Times New Roman, serif",
    body: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
  },
};

// Format ISO date/time to human-readable in USER'S LOCAL TIMEZONE (e.g., "Nov 11, 2026 at 8:00 AM WAT")
function formatDateTime(dateStr: string, timeStr: string): string {
  if (!dateStr && !timeStr) return "Not set";
  if (!dateStr) return `Time ${timeStr}`;
  if (!timeStr) return dateStr;

  try {
    let date: Date;
    if (timeStr.includes('T') || timeStr.includes('Z') || timeStr.includes('.')) {
      date = new Date(timeStr);
    } else {
      date = new Date(`${dateStr}T${timeStr}`);
    }
    if (isNaN(date.getTime())) return `${dateStr} at ${timeStr}`;

    const day = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const tz = date.toLocaleTimeString("en-US", {
      timeZoneName: "short",
    }).split(" ").pop() || "";

    return `${day} at ${time} ${tz}`;
  } catch {
    return `${dateStr} at ${timeStr}`;
  }
}

// Format ISO date/time to human-readable in CDT (America/Chicago) timezone for admin emails/dashboard
function formatDateTimeCDT(dateStr: string, timeStr: string): string {
  if (!dateStr && !timeStr) return "Not set";
  if (!dateStr) return `Time ${timeStr}`;
  if (!timeStr) return dateStr;

  try {
    let date: Date;
    if (timeStr.includes('T') || timeStr.includes('Z') || timeStr.includes('.')) {
      date = new Date(timeStr);
    } else {
      date = new Date(`${dateStr}T${timeStr}`);
    }
    if (isNaN(date.getTime())) return `${dateStr} at ${timeStr}`;

    const day = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Chicago",
    });
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Chicago",
    });
    const tz = date.toLocaleTimeString("en-US", {
      timeZone: "America/Chicago",
      timeZoneName: "short",
    }).split(" ").pop() || "";

    return `${day} at ${time} ${tz}`;
  } catch {
    return `${dateStr} at ${timeStr}`;
  }
}

function css(styles) {
  return Object.entries(styles)
    .map(([k, v]) => k.replace(/([A-Z])/g, "-$1").toLowerCase() + ": " + v)
    .join("; ");
}

function preheader(text) {
  return `<div style="display: none; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all;">${text}</div>`;
}

function wrapper(children) {
  return `<!--[if mso]>
    <table role="presentation" width="100%" cellpadding='0' cellspacing='0' border='0' style='background-color: #f0ede6;'><tr><td align='center'>
    <table role="presentation" width='600' cellpadding='0' cellspacing='0' border='0'><tr><td>
    <![endif]-->
    <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif; color: #1f2937; line-height: 1.6;'>
      ${children}
    </div>
    <!--[if mso]>
    </td></tr></table></td></tr></table>
    <![endif]-->`;
}

function heroSection(title, subtitle, bgColor, textColor) {
  return `<div style="background-color: ${bgColor}; padding: 48px 32px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 32px; font-weight: 600; line-height: 1.3; color: ${textColor};">${title}</h1>
      <p style="margin: 0; font-size: 18px; line-height: 1.5; opacity: 0.9; color: ${textColor};">${subtitle}</p>
    </div>`;
}

function contentSection(title, content, bgColor) {
  return `<div style="background-color: ${bgColor}; padding: 32px;">
      <h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 24px; font-weight: 600; color: #081d2b;">${title}</h2>
      <div style="color: #1f2937; line-height: 1.7;">${content}</div>
    </div>`;
}

function cardSection(items, bgColor) {
  return `<div style="background-color: ${bgColor}; padding: 32px; border-radius: 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        ${items.map(item => `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
              <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #c9a963; margin-bottom: 4px;">${item.label}</span>
              <span style="font-size: 16px; color: #1f2937; line-height: 1.5;">${item.value}</span>
            </td>
          </tr>
        `).join("")}
      </table>
    </div>`;
}

function button(text, href, bgColor, textColor) {
  return `<div style="text-align: center; margin: 32px 0;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="8%" stroke="f" fillcolor="${bgColor}">
        <w:anchorlock/>
        <center style="color:${textColor};font-family:Arial,sans-serif;font-size:16px;font-weight:600;">${text}</center>
      </v:roundrect>
      <![endif]-->
      <a href="${href}" style="display: inline-block; background-color: ${bgColor}; color: ${textColor}; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;">${text}</a>
    </div>`;
}

function footer() {
  return `<div style="background-color: #081d2b; padding: 32px; text-align: center; border-radius: 0 0 16px 16px;">
      <div style="margin-bottom: 16px;">
        <a href="https://ksefinserve.com" style="display: inline-block; margin: 0 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="44" viewBox="0 0 120 44" fill="none"><rect width="120" height="44" fill="#081d2b"/><text x="60" y="30" font-family="Georgia,serif" font-size="16" font-weight="600" fill="#c9a963" text-anchor="middle" alignment-baseline="middle">KSEFinServe</text></svg>
        </a>
      </div>
      <p style="margin: 8px 0; font-size: 14px; color: rgba(255,255,255,0.7);">Clarity · Growth · Impact</p>
      <p style="margin: 16px 0 0; font-size: 12px; color: rgba(255,255,255,0.5);">
        © 2026 KSEFinServe. All rights reserved.<br>
        363 N Sam Houston Pkwy E, Suite 200, Houston, TX 77060
      </p>
      <div style="margin-top: 24px;">
        <a href="https://www.linkedin.com/company/ksefinserve" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">LinkedIn</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="mailto:info@ksefinserve.com" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Contact</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="https://ksefinserve.com/unsubscribe" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Unsubscribe</a>
      </div>
    </div>`;
}

function buildEmail(opts) {
  const preheaderText = opts.preheaderText || "";
  const hero = opts.hero;
  const sections = opts.sections || [];
  const cards = opts.cards || [];
  const buttonConfig = opts.button;
  const showFooter = opts.footer !== false;

  const heroHtml = hero ? `<div style="background-color: ${hero.bgColor || "#081d2b"}; padding: 48px 32px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 32px; font-weight: 600; line-height: 1.3; color: ${hero.textColor || "#ffffff"};">${hero.title}</h1>
      <p style="margin: 0; font-size: 18px; line-height: 1.5; opacity: 0.9; color: ${hero.textColor || "#ffffff"};">${hero.subtitle}</p>
    </div>` : "";
  const sectionsHtml = (opts.sections || []).map(s => `
      <div style="background-color: ${s.bgColor || "#ffffff"}; padding: 32px;">
        <h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 24px; font-weight: 600; color: #081d2b;">${s.title}</h2>
        <div style="color: #1f2937; line-height: 1.7;">${s.content}</div>
      </div>`).join("");
  const cardsHtml = (opts.cards && opts.cards.length) ? `<div style="background-color: #f0ede6; padding: 32px; border-radius: 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        ${opts.cards.map(item => `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
              <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #c9a963; margin-bottom: 4px;">${item.label}</span>
              <span style="font-size: 16px; color: #1f2937; line-height: 1.5;">${item.value}</span>
            </td>
          </tr>
        `).join("")}
      </table>
    </div>` : "";
  const buttonHtml = opts.button ? `<div style="text-align: center; margin: 32px 0;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${opts.button.href}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="8%" stroke="f" fillcolor="${opts.button.bgColor || "#c9a963"}">
        <w:anchorlock/>
        <center style="color:${opts.button.textColor || "#081d2b"};font-family:Arial,sans-serif;font-size:16px;font-weight:600;">${opts.button.text}</center>
      </v:roundrect>
      <![endif]-->
      <a href="${opts.button.href}" style="display: inline-block; background-color: ${opts.button.bgColor || "#c9a963"}; color: ${opts.button.textColor || "#081d2b"}; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;">${opts.button.text}</a>
    </div>` : "";
  const footerHtml = opts.footer !== false ? `<div style="background-color: #081d2b; padding: 32px; text-align: center; border-radius: 0 0 16px 16px;">
      <div style="margin-bottom: 16px;">
        <a href="https://ksefinserve.com" style="display: inline-block; margin: 0 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="44" viewBox="0 0 120 44" fill="none"><rect width="120" height="44" fill="#081d2b"/><text x="60" y="30" font-family="Georgia,serif" font-size="16" font-weight="600" fill="#c9a963" text-anchor="middle" alignment-baseline="middle">KSEFinServe</text></svg>
        </a>
      </div>
      <p style="margin: 8px 0; font-size: 14px; color: rgba(255,255,255,0.7);">Clarity · Growth · Impact</p>
      <p style="margin: 16px 0 0; font-size: 12px; color: rgba(255,255,255,0.5);">
        © 2026 KSEFinServe. All rights reserved.<br>
        363 N Sam Houston Pkwy E, Suite 200, Houston, TX 77060
      </p>
      <div style="margin-top: 24px;">
        <a href="https://www.linkedin.com/company/ksefinserve" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">LinkedIn</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="mailto:info@ksefinserve.com" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Contact</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="https://ksefinserve.com/unsubscribe" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Unsubscribe</a>
      </div>
    </div>` : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${opts.hero?.title || "KSEFinServe"}</title>
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .padding { padding: 24px !important; }
      h1 { font-size: 28px !important; }
      h2 { font-size: 22px !important; }
    }
    @media screen and (prefers-color-scheme: dark) {
      .dark-mode-bg { background-color: #081d2b !important; }
      .dark-mode-text { color: #ffffff !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f0ede6; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all;">${opts.preheaderText || ""}</div>
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif; color: #1f2937; line-height: 1.6;">
    ${opts.hero ? `<div style="background-color: ${opts.hero.bgColor || "#081d2b"}; padding: 48px 32px; text-align: center; border-radius: 16px 16px 0 0;">
        <h1 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 32px; font-weight: 600; line-height: 1.3; color: ${opts.hero.textColor || "#ffffff"};">${opts.hero.title}</h1>
        <p style="margin: 0; font-size: 18px; line-height: 1.5; opacity: 0.9; color: ${opts.hero.textColor || "#ffffff"};">${opts.hero.subtitle}</p>
      </div>` : ""}
    ${(opts.sections || []).map(s => `
      <div style="background-color: ${s.bgColor || "#ffffff"}; padding: 32px;">
        <h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 24px; font-weight: 600; color: #081d2b;">${s.title}</h2>
        <div style="color: #1f2937; line-height: 1.7;">${s.content}</div>
      </div>`).join("")}
    ${(opts.cards && opts.cards.length) ? `<div style="background-color: #f0ede6; padding: 32px; border-radius: 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        ${opts.cards.map(item => `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
              <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #c9a963; margin-bottom: 4px;">${item.label}</span>
              <span style="font-size: 16px; color: #1f2937; line-height: 1.5;">${item.value}</span>
            </td>
          </tr>
        `).join("")}
      </table>
    </div>` : ""}
    ${opts.button ? `<div style="text-align: center; margin: 32px 0;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${opts.button.href}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="8%" stroke="f" fillcolor="${opts.button.bgColor || "#c9a963"}">
        <w:anchorlock/>
        <center style="color:${opts.button.textColor || "#081d2b"};font-family:Arial,sans-serif;font-size:16px;font-weight:600;">${opts.button.text}</center>
      </v:roundrect>
      <![endif]-->
      <a href="${opts.button.href}" style="display: inline-block; background-color: ${opts.button.bgColor || "#c9a963"}; color: ${opts.button.textColor || "#081d2b"}; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;">${opts.button.text}</a>
    </div>` : ""}
    <div style="background-color: #081d2b; padding: 32px; text-align: center; border-radius: 0 0 16px 16px;">
      <div style="margin-bottom: 16px;">
        <a href="https://ksefinserve.com" style="display: inline-block; margin: 0 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="44" viewBox="0 0 120 44" fill="none"><rect width="120" height="44" fill="#081d2b"/><text x="60" y="30" font-family="Georgia,serif" font-size="16" font-weight="600" fill="#c9a963" text-anchor="middle" alignment-baseline="middle">KSEFinServe</text></svg>
        </a>
      </div>
      <p style="margin: 8px 0; font-size: 14px; color: rgba(255,255,255,0.7);">Clarity · Growth · Impact</p>
      <p style="margin: 16px 0 0; font-size: 12px; color: rgba(255,255,255,0.5);">
        © 2026 KSEFinServe. All rights reserved.<br>
        363 N Sam Houston Pkwy E, Suite 200, Houston, TX 77060
      </p>
      <div style="margin-top: 24px;">
        <a href="https://www.linkedin.com/company/ksefinserve" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">LinkedIn</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="mailto:info@ksefinserve.com" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Contact</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="https://ksefinserve.com/unsubscribe" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const ADMIN_BASE = "https://ksefinserve.netlify.app";
function adminLink(path) {
  return ADMIN_BASE + "/admin/auth/login?redirect=" + encodeURIComponent("/admin" + path);
}

// Template functions
function contactNotificationTemplate(params) {
  return buildEmail({
    preheaderText: `New contact from ${params.name}`,
    hero: {
      title: "New Contact Form Submission",
      subtitle: "A new message has been received via the website contact form",
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Contact Details",
        content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Name:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.name}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Email:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${params.email}" style="color: #081d2b;">${params.email}</a></td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Subject:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.subject}</td></tr>
          </table>`,
      },
      {
        title: "Message",
        content: `<div style="white-space: pre-wrap; line-height: 1.7; background: #f0ede6; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a963;">${params.message.split("\n").join("<br>")}</div>`,
      },
    ],
    button: {
      text: "View in Admin Dashboard",
      href: adminLink("/admin/enquiries"),
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function bookingConfirmationUserTemplate(params) {
  // Build Google Calendar URL
  const calendarUrl = params.calendarUrl || `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(params.serviceType + ' Session')}&dates=${encodeURIComponent(params.bookingDate + ' ' + params.bookingTime)}/&details=${encodeURIComponent('Your KSEFinServe session with Kayode Samson Elepe, RR. Reference: ' + params.reference)}`
  
  return buildEmail({
    preheaderText: `Booking confirmed: ${params.serviceType} on ${params.bookingDate} at ${params.bookingTime}`,
    hero: {
      title: "Booking Confirmed ✓",
      subtitle: `Your ${params.serviceType} session has been scheduled successfully`,
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Booking Summary",
        content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>${params.userName}</strong>,</p>
          <p style="margin: 0 0 24px;">Thank you for booking a session with KSEFinServe. We've received your request and confirmed the following details:</p>`,
      },
    ],
    cards: [
      { label: "Service", value: params.serviceType },
      { label: "Date", value: params.bookingDate },
      { label: "Time", value: params.bookingTime },
      { label: "Discussion Path", value: params.path || 'Wealth planning' },
      { label: "Topic", value: params.topic || 'General' },
      { label: "Reference", value: params.reference },
    ],
    sections: [
      {
        title: "What Happens Next",
        content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;">
            <li>Kayode Samson Elepe, RR will reach out 24 hours before to confirm</li>
            <li>Prepare any questions or documents you'd like to discuss</li>
            <li>If you need to reschedule, reply to this email at least 24 hours in advance</li>
          </ul>`,
      },
      {
        title: "Your Selected Details",
        content: `<div style="background: #f0ede6; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a963; white-space: pre-wrap; font-size: 14px;">${params.question || 'No additional notes provided.'}</div>`,
      },
    ],
    button: {
      text: "Add to Calendar",
      href: calendarUrl,
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function bookingNotificationAdminTemplate(params) {
  const sections = [
    {
      title: "Client Information",
      content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Name:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.userName}</td></tr>
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Email:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${params.userEmail}" style="color: #081d2b;">${params.userEmail}</a></td></tr>
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Phone:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.userPhone}</td></tr>
          ${params.city ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">City:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.city}</td></tr>` : ''}
          ${params.province ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Province/State:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.province}</td></tr>` : ''}
          ${params.country ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Country:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.country}</td></tr>` : ''}
          <tr><td style="padding: 12px 0;"><strong style="color: #c9a963;">Service:</strong></td><td style="padding: 12px 0;">${params.serviceType}</td></tr>
        </table>`,
    },
    {
      title: "Booking Details",
      content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Date:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.bookingDate}</td></tr>
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Time:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.bookingTime}</td></tr>
          ${params.path ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Discussion Path:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.path}</td></tr>` : ''}
          ${params.topic ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Topic:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.topic}</td></tr>` : ''}
          ${params.contactMethod ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Preferred Contact:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.contactMethod}</td></tr>` : ''}
          ${params.source ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Source:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.source}</td></tr>` : ''}
          <tr><td style="padding: 12px 0;"><strong style="color: #c9a963;">Reference:</strong></td><td style="padding: 12px 0;">${params.reference}</td></tr>
        </table>`,
    },
    {
      title: "Consent & Permissions",
      content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Session Contact:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.consentContact ? 'Agreed ✓' : 'Not provided'}</td></tr>
          <tr><td style="padding: 12px 0;"><strong style="color: #c9a963;">Email Updates:</strong></td><td style="padding: 12px 0;">${params.consentUpdates ? 'Opted in ✓' : 'Not opted in'}</td></tr>
        </table>`,
    },
  ]

  if (params.priorities && params.priorities.length > 0) {
    sections.push({
      title: "Client Priorities",
      content: `<ul style="margin: 0; padding-left: 20px;">${params.priorities.map(p => `<li>${p}</li>`).join("")}</ul>`,
    })
  }
  if (params.outcome) {
    sections.push({
      title: "Desired Outcome",
      content: `<div style="background: #f0ede6; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a963; white-space: pre-wrap;">${params.outcome}</div>`,
    })
  }
  if (params.context) {
    sections.push({
      title: "Relevant Context",
      content: `<div style="background: #f0ede6; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a963; white-space: pre-wrap;">${params.context}</div>`,
    })
  }
  if (params.question) {
    sections.push({
      title: "Questions",
      content: `<div style="background: #f0ede6; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a963; white-space: pre-wrap;">${params.question}</div>`,
    })
  }

  return buildEmail({
    preheaderText: `New booking: ${params.userName} - ${params.serviceType}`,
    hero: {
      title: "New Booking Received",
      subtitle: `Reference: ${params.reference}`,
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections,
    button: {
      text: "View Booking in Admin",
      href: adminLink("/admin/bookings"),
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function careerApplicationNotificationTemplate(params) {
  return buildEmail({
    preheaderText: `New career application: ${params.name}`,
    hero: {
      title: "New Career Application",
      subtitle: `Reference: ${params.reference}`,
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Applicant Information",
        content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Name:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.name}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Email:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${params.email}" style="color: #081d2b;">${params.email}</a></td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Phone:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.phone}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Location:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.location}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Current role or field:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.role}</td></tr>
            <tr><td style="padding: 12px 0;"><strong style="color: #c9a963;">Licences:</strong></td><td style="padding: 12px 0;">${params.licences || "Not specified"}</td></tr>
          </table>`,
      },
      {
        title: "Areas of Interest",
        content: `<ul style="margin: 0; padding-left: 20px;">${params.interests.map(i => `<li>${i}</li>`).join("")}</ul>`,
      },
      {
        title: "Background & Motivation",
        content: `<div style="background: #f0ede6; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a963; white-space: pre-wrap;">${params.background}</div>`,
      },
    ],
    button: {
      text: "Review Application",
      href: adminLink("/admin/careers"),
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function careerApplicationConfirmationTemplate(params) {
  return buildEmail({
    preheaderText: `Application received: ${params.role} - ${params.reference}`,
    hero: {
      title: "Application Received ✓",
      subtitle: "Thank you for your interest in joining KSEFinServe",
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Application Summary",
        content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>${params.userName}</strong>,</p>
          <p style="margin: 0 0 24px;">We've received your application for the <strong>${params.role}</strong> position. Your reference number is <strong>${params.reference}</strong>.</p>`,
      },
      {
        title: "Your Application Details",
        content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Name:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.name}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Email:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${params.email}" style="color: #081d2b;">${params.email}</a></td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Phone:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.phone}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Location:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.location}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Current role or field:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.role}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Licences:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.licences || "Not specified"}</td></tr>
            <tr><td style="padding: 12px 0;"><strong style="color: #c9a963;">Preferred Contact:</strong></td><td style="padding: 12px 0;">${params.preferredContact || 'Email'}</td></tr>
          </table>`,
      },
      {
        title: "Areas of Interest",
        content: `<ul style="margin: 0; padding-left: 20px;">${params.interests && params.interests.length > 0 ? params.interests.map(i => `<li>${i}</li>`).join("") : '<li>Not specified</li>'}</ul>`,
      },
      {
        title: "Background & Motivation",
        content: `<div style="background: #f0ede6; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a963; white-space: pre-wrap;">${params.background || 'Not provided'}</div>`,
      },
      {
        title: "What Happens Next",
        content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;">
            <li>Our team will review your application within 5-7 business days</li>
            <li>If there's a potential fit, we'll reach out to schedule a conversation</li>
            <li>You'll hear from us either way - we value every application</li>
          </ul>`,
      },
      {
        title: "In the Meantime",
        content: `<p>Explore our <a href="https://ksefinserve.com/insights" style="color: #c9a963;">Insights</a> to learn more about our approach to wealth, leadership, and legacy.</p>`,
      },
    ],
    button: {
      text: "Read Our Insights",
      href: "https://ksefinserve.com/insights",
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function eventInterestConfirmationTemplate(params) {
  // Build Google Calendar URL for event
  const calendarUrl = params.calendarUrl || `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(params.eventTitle)}&dates=${encodeURIComponent(params.eventDate + '/' + params.eventDate)}&details=${encodeURIComponent('Event: ' + params.eventTitle + '\n' + params.eventDescription + '\n\nYou expressed interest in this KSEFinServe event.')}`
  
  return buildEmail({
    preheaderText: `Event interest confirmed: ${params.eventTitle}`,
    hero: {
      title: "Interest Confirmed ✓",
      subtitle: `Thank you for your interest in ${params.eventTitle}`,
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Event Details",
        content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>${params.userName}</strong>,</p>
          <p style="margin: 0 0 24px;">We've received your interest in the following event. Here are the details:</p>`,
      },
    ],
    cards: [
      { label: "Event", value: params.eventTitle },
      { label: "Date", value: params.eventDate },
      { label: "Time", value: params.eventTime || 'TBA' },
      { label: "Location", value: params.eventLocation || 'Online / TBD' },
      { label: "Reference", value: params.reference },
    ],
    sections: [
      {
        title: "About This Event",
        content: `<div style="background: #f0ede6; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a963; white-space: pre-wrap;">${params.eventDescription || 'No description provided.'}</div>`,
      },
      {
        title: "What Happens Next",
        content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;">
            <li>We'll keep you updated on event details and any changes</li>
            <li>You'll receive a confirmation with final logistics closer to the date</li>
            <li>Feel free to reach out with any questions at <a href="mailto:info@ksefinserve.com" style="color: #c9a963;">info@ksefinserve.com</a></li>
          </ul>`,
      },
    ],
    button: {
      text: "Add to Calendar",
      href: calendarUrl,
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function adminNotificationTemplate(params) {
  return buildEmail({
    preheaderText: params.title,
    hero: {
      title: params.title,
      subtitle: params.subtitle,
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    cards: params.items,
    button: params.actionUrl && params.actionText ? {
      text: params.actionText,
      href: adminLink(params.actionUrl),
      bgColor: "#c9a963",
      textColor: "#081d2b",
    } : undefined,
  });
}


/* ------------------------------------------------------------------ */
/* Financial Tool Report Templates                                   */
/* ------------------------------------------------------------------ */

function taxReportTemplate(params) {
  return buildEmail({
    preheaderText: `Your Tax Clarity Report - \${params.reference}`,
    hero: {
      title: "Your Tax Clarity Report",
      subtitle: `Reference: \${params.reference} · \${params.currency}`,
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Report Overview",
        content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>\${params.userName}</strong>,</p>
          <p style="margin: 0 0 24px;">Thank you for using the KSEFinServe Tax Calculator. Your personalized tax clarity report is ready. This report summarizes your estimated tax breakdown based on the inputs you provided.</p>`,
      },
    ],
    cards: [
      { label: "Annual Employment Income", value: params.income },
      { label: "State", value: params.state },
      { label: "Tax Year", value: params.taxYear },
      { label: "Federal Income Tax", value: params.federalTax },
      { label: "State Income Tax", value: params.stateTax },
      { label: "FICA (Social Security + Medicare)", value: params.ficaTax },
      { label: "Total Estimated Tax", value: params.totalTax },
      { label: "After-Tax Income", value: params.afterTaxIncome },
      { label: "Average Tax Rate", value: params.avgRate },
      { label: "Assumed Marginal Rate", value: params.marginalRate },
      { label: "Income You Keep", value: params.keepPct },
    ],
    sections: [
      {
        title: "Important Notes",
        content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;">
            <li>This is an illustrative estimate based on simplified 2025 tax brackets for single filers</li>
            <li>Excludes CPP/QPP, EI, payroll contributions, credits, and individual circumstances</li>
            <li>Not personalized tax advice - consult a qualified tax professional for filing decisions</li>
            <li>Tax brackets apply progressively; your marginal rate applies only to your next dollar of income</li>
          </ul>`,
      },
      {
        title: "Your PDF Report",
        content: `<p style="margin: 0 0 16px;">A detailed PDF version of this report is attached to this email, including the full tax breakdown chart and assumptions.</p>
          <p style="margin: 0;">You can also access this report anytime by logging into your KSEFinServe account.</p>`,
      },
    ],
    button: {
      text: "View in Dashboard",
      href: "https://ksefinserve.netlify.app/tax-calculator",
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function collegeSavingsReportTemplate(params) {
  return buildEmail({
    preheaderText: `Your Education Savings Plan - \${params.reference}`,
    hero: {
      title: "Your Education Savings Plan",
      subtitle: `Reference: \${params.reference} · \${params.currency}`,
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Report Overview",
        content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>\${params.userName}</strong>,</p>
          <p style="margin: 0 0 24px;">Thank you for using the KSEFinServe College Savings Calculator. Your personalized education savings plan is ready, showing how your contributions could help fund your child's future education.</p>`,
      },
    ],
    cards: [
      { label: "Child's Current Age", value: params.childAge + " years" },
      { label: "Education Start Age", value: params.startAge + " years" },
      { label: "Years Until College", value: params.yearsToCollege + " years" },
      { label: "Country", value: params.country },
      { label: "State/Province", value: params.state },
      { label: "Already Saved", value: params.alreadySaved },
      { label: "Monthly Contribution", value: params.monthlyContribution },
      { label: "Investment Scenario", value: params.scenario },
      { label: "Assumed Annual Return", value: params.annualReturn },
      { label: "Projected Savings at Age " + params.startAge, value: params.projectedSavings },
      { label: "Education Funding Goal (4 years)", value: params.fundingGoal },
      { label: "Estimated Funding Gap", value: params.fundingGap },
      { label: "Contribution to Close Gap", value: params.contributionToCloseGap },
      { label: "Percentage of Goal Funded", value: params.percentFunded },
    ],
    sections: [
      {
        title: "Key Assumptions",
        content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;">
            <li>4 years of education at $18,000/year (today's dollars), rising 3% annually</li>
            <li>Contributions made monthly at period-end; returns compound monthly</li>
            <li>Covers 100% of costs; no grants or other funding included</li>
            <li>Household income $100k-$150k assumed for context</li>
            <li>\${params.country === "Canada" ? "Canadian" : "US"} scenario in \${params.currency}</li>
          </ul>`,
      },
      {
        title: "Your PDF Report",
        content: `<p style="margin: 0 0 16px;">A detailed PDF version of this plan is attached, including the age-by-age savings timeline, savings vs. goal chart, and full assumptions.</p>
          <p style="margin: 0;">Revisit this plan annually as costs, contributions, and grant eligibility change.</p>`,
      },
    ],
    button: {
      text: "View in Dashboard",
      href: "https://ksefinserve.netlify.app/college-savings",
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function debtRepaymentReportTemplate(params) {
  return buildEmail({
    preheaderText: `Your Payoff Blueprint - \${params.reference}`,
    hero: {
      title: "Your Payoff Blueprint",
      subtitle: `Reference: \${params.reference} · \${params.currency}`,
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Report Overview",
        content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>\${params.userName}</strong>,</p>
          <p style="margin: 0 0 24px;">Thank you for using the KSEFinServe Debt Repayment Calculator. Your personalized payoff blueprint compares two strategies so you can choose the path that fits your goals.</p>`,
      },
    ],
    cards: [
      { label: "Selected Strategy", value: params.strategy },
      { label: "Total Monthly Payment", value: params.totalMonthlyPayment },
      { label: "Debt-Free Timeline", value: params.debtFreeMonths + " months" },
      { label: "Total Interest (Selected)", value: params.totalInterest },
      { label: "Other Strategy", value: params.otherStrategy },
      { label: "Other Strategy Timeline", value: params.otherStrategyMonths + " months" },
      { label: "Other Strategy Interest", value: params.otherStrategyInterest },
      { label: "Interest Savings with Selected", value: params.interestSavings },
      { label: "Time Saved with Selected", value: params.timeSaved + " months" },
    ],
    sections: [
      {
        title: "Your Debts",
        content: params.debtsHtml,
      },
      {
        title: "Strategy Comparison",
        content: `<p style="margin: 0 0 16px;">\${params.strategy === "Avalanche" ? "Avalanche targets the highest APR first and usually costs less overall." : "Snowball targets the smallest balance first for earlier psychological wins."}</p>
          <p style="margin: 0;">Your selected strategy saves \${params.interestSavings} in interest and \${params.timeSaved} months vs. the alternative.</p>`,
      },
      {
        title: "Important Notes",
        content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;">
            <li>Illustrative, not personalized advice. Fixed APRs assumed; interest added monthly</li>
            <li>Fixed minimums and fixed extra payment roll over as debts are cleared</li>
            <li>Actual payoff may vary with rate changes, fees, or additional borrowing</li>
            <li>Consider consulting a financial advisor for a comprehensive debt plan</li>
          </ul>`,
      },
      {
        title: "Your PDF Report",
        content: `<p style="margin: 0 0 16px;">A detailed PDF version of this blueprint is attached, including the month-by-month payoff timeline for both strategies and the remaining debt chart.</p>
          <p style="margin: 0;">A little extra each month can change your debt-free date significantly.</p>`,
      },
    ],
    button: {
      text: "View in Dashboard",
      href: "https://ksefinserve.netlify.app/debt-repayment",
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function retirementReportTemplate(params) {
  return buildEmail({
    preheaderText: `Your Retirement Roadmap - \${params.reference}`,
    hero: {
      title: "Your Retirement Roadmap",
      subtitle: `Reference: \${params.reference} · \${params.currency}`,
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Report Overview",
        content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>\${params.userName}</strong>,</p>
          <p style="margin: 0 0 24px;">Thank you for using the KSEFinServe Retirement Planning Calculator. Your personalized retirement roadmap shows how today's savings could support tomorrow's income.</p>`,
      },
    ],
    cards: [
      { label: "Age Today", value: params.ageToday + " years" },
      { label: "Retirement Age", value: params.retireAge + " years" },
      { label: "Years to Retirement", value: params.yearsToRetirement + " years" },
      { label: "Monthly Contribution", value: params.monthlyContribution },
      { label: "Investment Scenario", value: params.scenario },
      { label: "Assumed Growth Return", value: params.growthReturn },
      { label: "Projected Savings at Age " + params.retireAge, value: params.projectedSavings },
      { label: "Estimated Annual Income (4% draw + CPP/OAS)", value: params.estimatedAnnualIncome },
      { label: "Annual Income Goal", value: params.annualIncomeGoal },
      { label: "Annual Funding Gap", value: params.fundingGap },
      { label: "Assumed Inflation", value: "2%" },
      { label: "Retirement Return Assumption", value: "3%" },
    ],
    sections: [
      {
        title: "Key Assumptions",
        content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;">
            <li>Starting assets: RRSP $80,000 · TFSA $30,000 · Other $10,000</li>
            <li>CPP/OAS: $1,500/month at age 65 (approx. $18,000/year)</li>
            <li>Plan through age 95 · Inflation 2% · Growth return \${params.growthReturn}</li>
            <li>Retirement draw: 4% initial annual withdrawal, rising 2% yearly</li>
            <li>All amounts in future nominal \${params.currency}</li>
          </ul>`,
      },
      {
        title: "Your PDF Report",
        content: `<p style="margin: 0 0 16px;">A detailed PDF version of this roadmap is attached, including the age-by-age savings buildup chart, withdrawal timeline, and income gap analysis.</p>
          <p style="margin: 0;">Use this as a conversation starter for your next financial planning review.</p>`,
      },
    ],
    button: {
      text: "View in Dashboard",
      href: "https://ksefinserve.netlify.app/retirement-planning",
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function compoundInterestReportTemplate(params) {
  return buildEmail({
    preheaderText: `Your Growth Report - \${params.reference}`,
    hero: {
      title: "Your Growth Report",
      subtitle: `Reference: \${params.reference} · \${params.currency}`,
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Report Overview",
        content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>\${params.userName}</strong>,</p>
          <p style="margin: 0 0 24px;">Thank you for using the KSEFinServe Compound Interest Calculator. Your personalized growth report shows how time and consistency can make your money work harder.</p>`,
      },
    ],
    cards: [
      { label: "Initial Deposit", value: params.initialDeposit },
      { label: "Years of Growth", value: params.years + " years" },
      { label: "Estimated Annual Rate", value: params.annualRate + "%" },
      { label: "Compounding Frequency", value: params.compoundFreq },
      { label: "Recurring Contribution", value: params.contribution },
      { label: "Contribution Frequency", value: params.contributionFreq },
      { label: "Total Balance After " + params.years + " Years", value: params.totalBalance },
      { label: "Total Deposits", value: params.totalDeposits },
      { label: "Interest Earned", value: params.interestEarned },
      { label: "Interest as % of Ending Balance", value: params.interestPct },
      { label: "Without Contributions (Same Rate)", value: params.withoutContributions },
      { label: "Effective Annual Yield (APY)", value: params.apy },
    ],
    sections: [
      {
        title: "Key Assumptions",
        content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;">
            <li>Contributions at period-end · Constant annual rate · \${params.compoundFreq.toLowerCase()} compounding</li>
            <li>No taxes, fees, or withdrawals · All values in \${params.currency}</li>
            <li>\${params.annualRate}% is the annual rate before compounding, not APY</li>
            <li>\${params.compoundFreq.toLowerCase()} compounding gives an effective annual yield of about \${params.apy}</li>
          </ul>`,
      },
      {
        title: "The Power of Time",
        content: `<p style="margin: 0 0 16px;">The space between your deposits and your total balance is the interest earned—and the interest on that interest. Time and consistency do the heavy lifting.</p>
          <p style="margin: 0;">Staying invested lets compounding accelerate your growth in the later years.</p>`,
      },
      {
        title: "Your PDF Report",
        content: `<p style="margin: 0 0 16px;">A detailed PDF version of this report is attached, including the deposits vs. balance chart, year-by-year breakdown, and interest timeline.</p>
          <p style="margin: 0;">Keep this projection as a reminder that small, steady steps build significant wealth over time.</p>`,
      },
    ],
    button: {
      text: "View in Dashboard",
      href: "https://ksefinserve.netlify.app/compound-interest",
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function passwordResetTemplate(params) {
  return buildEmail({
    preheaderText: "Reset your KSEFinServe password",
    hero: {
      title: "Reset Your Password",
      subtitle: "You requested a password reset for your KSEFinServe account",
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Reset Your Password",
        content: `<p style="margin: 0 0 16px;">Hi <strong>${params.userName}</strong>,</p>
          <p style="margin: 0 0 24px;">Click the button below to create a new password. This link expires in <strong>${params.expiresIn}</strong>.</p>`,
      },
      {
        title: "Security Note",
        content: `<div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; color: #92400e;">
            <strong>Warning:</strong> If you didn't request this reset, please ignore this email. Your password will remain unchanged.
          </div>`,
      },
    ],
    button: {
      text: "Reset Password",
      href: params.resetUrl,
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  ok: boolean;
  messageId?: string;
  error?: string;
  code?: string;
}

const FUNCTION_URL = "/.netlify/functions/send-email";

export async function sendEmail(params) {
  try {
    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data.error ?? "Failed to send", code: data.code };
    }

    return { ok: true, messageId: data.messageId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function sendBookingConfirmation(params) {
  const adminEmail = params.adminEmail ?? "admin@ksefinserve.com";
  const reference = params.reference ?? `SES-${Date.now().toString(36).toUpperCase()}`;

  // Format date/time for display in USER'S LOCAL timezone (for user email)
  const formattedDateTime = formatDateTime(params.bookingDate, params.bookingTime);
  const [formattedDate, formattedTime] = formattedDateTime.split(" at ");

  // Format date/time for CDT (admin email/dashboard)
  const formattedDateTimeCDT = formatDateTimeCDT(params.bookingDate, params.bookingTime);
  const [formattedDateCDT, formattedTimeCDT] = formattedDateTimeCDT.split(" at ");

  // Build Google Calendar URL for user
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(params.serviceType + ' Session')}&dates=${encodeURIComponent(params.bookingDate + ' ' + params.bookingTime)}/&details=${encodeURIComponent('Your KSEFinServe session with Kayode Samson Elepe, RR. Reference: ' + reference)}`;

  const userHtml = bookingConfirmationUserTemplate({
    userName: params.userName,
    bookingDate: formattedDate,
    bookingTime: formattedTime,
    serviceType: params.serviceType,
    reference,
    path: params.path,
    topic: params.topic,
    question: params.question,
    calendarUrl,
  });

  const adminHtml = bookingNotificationAdminTemplate({
    userName: params.userName,
    userEmail: params.userEmail,
    userPhone: params.userPhone ?? "",
    bookingDate: formattedDateCDT,
    bookingTime: formattedTimeCDT,
    serviceType: params.serviceType,
    reference,
    priorities: params.priorities,
    notes: params.notes,
    city: params.city,
    province: params.province,
    country: params.country,
    path: params.path,
    topic: params.topic,
    outcome: params.outcome,
    context: params.context,
    question: params.question,
    consentContact: params.consentContact,
    consentUpdates: params.consentUpdates,
    contactMethod: params.contactMethod,
    source: params.source,
  });

  const [user, admin] = await Promise.all([
    sendEmail({ to: params.userEmail, subject: "Booking Confirmed — KSEFinServe", html: userHtml, text: `Booking Confirmed - ${params.serviceType} on ${formattedDate} at ${formattedTime}. Reference: ${reference}` }),
    sendEmail({ to: adminEmail, subject: `New Booking Received — KSEFinServe (${reference})`, html: adminHtml, text: `New booking from ${params.userName} (${params.userEmail}) - ${params.serviceType} on ${formattedDateCDT} at ${formattedTimeCDT}. Reference: ${reference}` }),
  ]);
  return { user, admin };
}

export async function sendContactNotification(params) {
  const adminEmail = params.adminEmail ?? "admin@ksefinserve.com";
  const html = contactNotificationTemplate(params);
  const subjectPrefix = params.subjectPrefix || "Contact Form";
  return sendEmail({
    to: adminEmail,
    subject: `${subjectPrefix}: ${params.subject}`,
    html,
    replyTo: params.email,
  });
}

export async function sendCareerNotification(params) {
  const adminEmail = params.adminEmail ?? "admin@ksefinserve.com";
  const html = careerApplicationNotificationTemplate(params);
  return sendEmail({
    to: adminEmail,
    subject: `Career Application: ${params.name} - ${params.role}`,
    html,
  });
}

export async function sendCareerConfirmation(params) {
  const html = careerApplicationConfirmationTemplate({
    userName: params.userName,
    name: params.name,
    email: params.email,
    phone: params.phone,
    location: params.location,
    role: params.role,
    licences: params.licences,
    interests: params.interests,
    background: params.background,
    preferredContact: params.preferredContact,
    reference: params.reference,
  });
  const result = await sendEmail({
    to: params.userEmail,
    subject: `Application Received — KSEFinServe (${params.reference})`,
    html,
    text: `Application Received for ${params.role}. Reference: ${params.reference}. We'll review within 5-7 business days.`,
  });
  return result;
}

export async function sendEventInterestConfirmation(params) {
  // Build Google Calendar URL
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(params.eventTitle)}&dates=${encodeURIComponent(params.eventDate + '/' + params.eventDate)}&details=${encodeURIComponent('Event: ' + params.eventTitle + '\n' + params.eventDescription + '\n\nYou expressed interest in this KSEFinServe event.')}`
  
  const html = eventInterestConfirmationTemplate({
    userName: params.userName,
    eventTitle: params.eventTitle,
    eventDate: params.eventDate,
    eventTime: params.eventTime,
    eventLocation: params.eventLocation,
    eventDescription: params.eventDescription,
    reference: params.reference,
    calendarUrl,
  });
  const result = await sendEmail({
    to: params.userEmail,
    subject: `Interest Confirmed: ${params.eventTitle} — KSEFinServe (${params.reference})`,
    html,
    text: `Interest confirmed for ${params.eventTitle} on ${params.eventDate}. Reference: ${params.reference}. We'll keep you updated.`,
  });
  return result;
  }

  export async function sendTaxReport(params) {
  const html = taxReportTemplate(params);
  const result = await sendEmail({
    to: params.userEmail,
    subject: `Your Tax Clarity Report — KSEFinServe (\${params.reference})`,
    html,
    text: `Your tax clarity report for \${params.income} income in \${params.state}. Reference: \${params.reference}.`,
  });
  return result;
}

export async function sendCollegeSavingsReport(params) {
  const html = collegeSavingsReportTemplate(params);
  const result = await sendEmail({
    to: params.userEmail,
    subject: `Your Education Savings Plan — KSEFinServe (\${params.reference})`,
    html,
    text: `Your education savings plan for child age \${params.childAge}, starting at \${params.startAge}. Reference: \${params.reference}.`,
  });
  return result;
}

export async function sendDebtRepaymentReport(params) {
  const html = debtRepaymentReportTemplate(params);
  const result = await sendEmail({
    to: params.userEmail,
    subject: `Your Payoff Blueprint — KSEFinServe (\${params.reference})`,
    html,
    text: `Your debt repayment blueprint using \${params.strategy} strategy. Debt-free in \${params.debtFreeMonths} months. Reference: \${params.reference}.`,
  });
  return result;
}

export async function sendRetirementReport(params) {
  const html = retirementReportTemplate(params);
  const result = await sendEmail({
    to: params.userEmail,
    subject: `Your Retirement Roadmap — KSEFinServe (\${params.reference})`,
    html,
    text: `Your retirement roadmap: \${params.yearsToRetirement} years to retirement, projected savings \${params.projectedSavings}. Reference: \${params.reference}.`,
  });
  return result;
}

export async function sendCompoundInterestReport(params) {
  const html = compoundInterestReportTemplate(params);
  const result = await sendEmail({
    to: params.userEmail,
    subject: `Your Growth Report — KSEFinServe (\${params.reference})`,
    html,
    text: `Your compound interest growth report: \${params.years} years, total balance \${params.totalBalance}. Reference: \${params.reference}.`,
  });
  return result;
}

export async function sendPasswordReset(params) {
  const html = passwordResetTemplate(params);
  return sendEmail({
    to: params.userEmail,
    subject: "Reset Your Password — KSEFinServe",
    html,
  });
}

// Export template functions for use in Netlify functions
export {
  taxReportTemplate,
  collegeSavingsReportTemplate,
  debtRepaymentReportTemplate,
  retirementReportTemplate,
  compoundInterestReportTemplate,
  buildEmail,
  BRAND,
  css,
  preheader,
  heroSection,
  contentSection,
  cardSection,
  button,
  footer,
  adminLink,
};

