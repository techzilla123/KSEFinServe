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
        <a href="https://linkedin.com/in/kayode-samson-elepe" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">LinkedIn</a>
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
        <a href="https://linkedin.com/in/kayode-samson-elepe" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">LinkedIn</a>
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
        <a href="https://linkedin.com/in/kayode-samson-elepe" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">LinkedIn</a>
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
  return ADMIN_BASE + "/admin/auth/login?redirect=" + encodeURIComponent(path);
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
  return buildEmail({
    preheaderText: `Booking confirmed: ${params.serviceType}`,
    hero: {
      title: "Booking Confirmed ✓",
      subtitle: "Your session has been scheduled successfully",
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
      {
        title: "Booking Summary",
        content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>${params.userName}</strong>,</p>
          <p style="margin: 0 0 24px;">Your <strong>${params.serviceType}</strong> session has been confirmed. Here are the details:</p>`,
      },
    ],
    cards: [
      { label: "Service", value: params.serviceType },
      { label: "Date", value: params.bookingDate },
      { label: "Time", value: params.bookingTime },
      { label: "Reference", value: params.reference },
    ],
    sections: [
      {
        title: "What Happens Next",
        content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;">
            <li>We'll send a calendar invite with meeting details</li>
            <li>Kayode will reach out 24 hours before to confirm</li>
            <li>Prepare any questions or documents you'd like to discuss</li>
          </ul>`,
      },
      {
        title: "Need to Reschedule?",
        content: `<p>Life happens. If you need to adjust your appointment, simply reply to this email or contact us at <a href="mailto:info@ksefinserve.com" style="color: #c9a963;">info@ksefinserve.com</a> at least 24 hours in advance.</p>`,
      },
    ],
    button: {
      text: "Add to Calendar",
      href: "#",
      bgColor: "#c9a963",
      textColor: "#081d2b",
    },
  });
}

function bookingNotificationAdminTemplate(params) {
  const hasDetailedData = params.path || params.topic || params.priorities || params.outcome || params.context || params.question || params.city || params.province || params.country || params.contactMethod || params.source;
  
  return buildEmail({
    preheaderText: `New booking: ${params.userName} - ${params.serviceType}`,
    hero: {
      title: "New Booking Received",
      subtitle: `Reference: ${params.reference}`,
      bgColor: "#081d2b",
      textColor: "#ffffff",
    },
    sections: [
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
    ],
    sections: params.priorities && params.priorities.length > 0 ? [{
      title: "Client Priorities",
      content: `<ul style="margin: 0; padding-left: 20px;">${params.priorities.map(p => `<li>${p}</li>`).join("")}</ul>`,
    }] : [],
    sections: params.outcome ? [{
      title: "Desired Outcome",
      content: `<div style="background: #f0ede6; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a963; white-space: pre-wrap;">${params.outcome}</div>`,
    }] : [],
    sections: params.context ? [{
      title: "Relevant Context",
      content: `<div style="background: #f0ede6; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a963; white-space: pre-wrap;">${params.context}</div>`,
    }] : [],
    sections: params.question ? [{
      title: "Questions",
      content: `<div style="background: #f0ede6; padding: 20px; border-radius: 8px; border-left: 4px solid #c9a963; white-space: pre-wrap;">${params.question}</div>`,
    }] : [],
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
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #c9a963;">Preferred Role:</strong></td><td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${params.role}</td></tr>
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
    preheaderText: `Application received: ${params.role}`,
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

  const userHtml = bookingConfirmationUserTemplate({
    userName: params.userName,
    bookingDate: params.bookingDate,
    bookingTime: params.bookingTime,
    serviceType: params.serviceType,
    reference,
  });

  const adminHtml = bookingNotificationAdminTemplate({
    userName: params.userName,
    userEmail: params.userEmail,
    userPhone: "",
    bookingDate: params.bookingDate,
    bookingTime: params.bookingTime,
    serviceType: params.serviceType,
    reference,
    priorities: params.priorities,
    notes: params.notes,
  });

  const [user, admin] = await Promise.all([
    sendEmail({ to: params.userEmail, subject: "Booking Confirmed &mdash; KSEFinServe", html: userHtml }),
        sendEmail({ to: adminEmail, subject: `New Booking Received — KSEFinServe (${reference})`, html: adminHtml }),
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
    reference: params.reference,
    role: params.role,
  });
  return sendEmail({
    to: params.userEmail,
    subject: `Application Received &mdash; KSEFinServe (${params.reference})`,
    html,
  });
}

export async function sendPasswordReset(params) {
  const html = passwordResetTemplate(params);
  return sendEmail({
    to: params.userEmail,
    subject: "Reset Your Password &mdash; KSEFinServe",
    html,
  });
}

