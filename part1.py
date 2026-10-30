
with open("src/lib/email.ts", "w") as out:
    out.write("""/**
 * KSEFinServe Email Template System
 * Beautiful, professionally designed email templates with KSEFinServe branding
 * Colors: Navy #081d2b, Gold #c9a963, Cream #f0ede6, White #ffffff
 * Fonts: System fonts (works in all email clients)
 *""
")
    out.write("""
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
  spacing: {
    xs: "8px",
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "48px",
  },
  borderRadius: "8px",
  containerWidth: "600px",
};
""")

    out.write("""
function css(styles) {
  return Object.entries(styles)
    .map(([k, v]) => k.replace(/([A-Z])/g, "-").toLowerCase() + ": " + v)
    .join("; ");
}

function preheader(text) {
  return "<div style="display: none; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all;">" + text + "</div>";
}

function wrapper(children) {
  return "<!--[if mso]>" +
    "<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0ede6;"><tr><td align="center">" +
    "<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td>" +
    "<![endif]-->" +
    "<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif; color: #1f2937; line-height: 1.6;">" +
    children +
    "</div>" +
    "<!--[if mso]>" +
    "</td></tr></table></td></tr></table>" +
    "<![endif]-->";
}

function heroSection(title, subtitle, bgColor, textColor) {
  return "<div style="background-color: " + bgColor + "; padding: 48px 32px; text-align: center; border-radius: 16px 16px 0 0;">" +
    "<h1 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 32px; font-weight: 600; line-height: 1.3; color: " + textColor + ";">" + title + "</h1>" +
    "<p style="margin: 0; font-size: 18px; line-height: 1.5; opacity: 0.9; color: " + textColor + ";">" + subtitle + "</p>" +
    "</div>";
}

function contentSection(title, content, bgColor) {
  return "<div style="background-color: " + bgColor + "; padding: 32px;">" +
    "<h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 24px; font-weight: 600; color: #081d2b;">" + title + "</h2>" +
    "<div style="color: #1f2937; line-height: 1.7;">" + content + "</div>" +
    "</div>";
}

function cardSection(items, bgColor) {
  return "<div style="background-color: " + bgColor + "; padding: 32px; border-radius: 12px;">" +
    "<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">" +
    items.map(function(item) {
      return "<tr>" +
        "<td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; vertical-align: top;">" +
          "<span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #c9a963; margin-bottom: 4px;">" + item.label + "</span>" +
          "<span style="font-size: 16px; color: #1f2937; line-height: 1.5;">" + item.value + "</span>" +
        "</td></tr>";
    }).join("") +
    "</table></div>";
}

function button(text, href, bgColor, textColor) {
  return "<div style="text-align: center; margin: 32px 0;">" +
    "<!--[if mso]>" +
    "<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" + href + "" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="8%" stroke="f" fillcolor="" + bgColor + "">" +
    "<w:anchorlock/>\ " +
    "<center style="color:" + textColor + ";font-family:Arial,sans-serif;font-size:16px;font-weight:600;">" + text + "</center>" +
    "</v:roundrect>" +
    "<![endif]-->" +
    "<a href="" + href + "" style="display: inline-block; background-color: " + bgColor + "; color: " + textColor + "; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;">" + text + "</a>" +
    "</div>";
}

function footer() {
  return "<div style="background-color: #081d2b; padding: 32px; text-align: center; border-radius: 0 0 16px 16px;">" +
    "<div style="margin-bottom: 16px;">" +
      "<a href="https://ksefinserve.com" style="display: inline-block; margin: 0 8px;">" +
        "<img src="https://ksefinserve.com/assets/logo-ksefin.webp" alt="KSEFinServe" width="120" style="display: block; border: 0; outline: none; text-decoration: none;" />" +
      "</a>" +
    "</div>" +
    "<p style="margin: 8px 0; font-size: 14px; color: rgba(255,255,255,0.7);">Clarity · Growth · Impact</p>" +
    "<p style="margin: 16px 0 0; font-size: 12px; color: rgba(255,255,255,0.5);">" +
      "© 2026 KSEFinServe. All rights reserved.<br>" +
      "363 N Sam Houston Pkwy E, Suite 200, Houston, TX 77060" +
    "</p>" +
    "<div style="margin-top: 24px;">" +
      "<a href="https://linkedin.com/in/kayode-samson-elepe" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">LinkedIn</a>" +
      "<span style="color: rgba(255,255,255,0.3);">|" + "</span>" +
      "<a href="mailto:info@ksefinserve.com" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Contact</a>" +
      "<span style="color: rgba(255,255,255,0.3);">|" + "</span>" +
      "<a href="https://ksefinserve.com/unsubscribe" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Unsubscribe</a>" +
    "</div>" +
    "</div>";
}
""")
