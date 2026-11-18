import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { useBookings, type BookingInput } from "./admin/bookingsDirectory"
import { submitContactMessage } from "./admin/contactDirectory"

/* ==========================================================================
   /insurance — ported 1:1 from the Bloomingvine reference page.
   Layout, sections and class names follow the reference; the booking form
   keeps writing to the same `bookings` pipeline as /book-now.
   ========================================================================== */

const ASSETS = "/assets"

const IMG = {
  poster: `${ASSETS}/ins-poster.jpg`,
  portrait: `${ASSETS}/ins-portrait.jpg`,
  fna: `${ASSETS}/ins-fna.jpg`,
  agent: `${ASSETS}/pix-removebg-preview.png`,
}

const AGENT_NAME = "Kayode Samson Elepe"
const AGENT_CREDS = ", RR"
const CONTACT_EMAIL = "info@ksefinserve.com"
const CONTACT_PHONE = "+1 281-944-7306"

/* ------------------------------- content ------------------------------- */

const STRIP = [
  "Licensed financial professional",
  "Licensed across the U.S. & Canada",
  "I compare multiple carriers for you",
  "Many options with no medical exam",
  "Free consultation",
  "Serving African immigrant families in the U.S.",
]

const WHO_I_HELP = [
  {
    title: "Families building a life in America",
    body: "You came here to give your family more. Let's make sure their future never depends on nothing going wrong.",
    icon: (
      <>
        <path d="M9 7a3 3 0 106 0 3 3 0 00-6 0z" />
        <path d="M4 21v-1a6 6 0 0112 0v1" />
        <circle cx="18.5" cy="11.5" r="2" />
        <path d="M16.5 21v-.5a3 3 0 015-2.2" />
      </>
    ),
  },
  {
    title: "Those supporting family back home",
    body: "If parents or siblings rely on what you send, a plan can keep that support going even if something happens to you.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.500 5.600 12 3z" />
      </>
    ),
  },
  {
    title: "Homeowners & first-time buyers",
    body: "You worked hard for that home. Make sure the mortgage never becomes your family's burden.",
    icon: (
      <>
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </>
    ),
  },
  {
    title: "Parents raising the next generation",
    body: "Protect your children's education and future, and leave them a legacy to build on.",
    icon: (
      <>
        <path d="M3 9l9-5 9 5-9 5-9-5z" />
        <path d="M7 11.500V16c1.500 1.300 3.200 2 5 2s3.500-.700 5-2v-4.500" />
        <path d="M21 9v5" />
      </>
    ),
  },
  {
    title: "Professionals & business owners",
    body: "Your income keeps everything running. Protect it if a serious illness ever forces you to stop working.",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
        <path d="M3 13h18" />
      </>
    ),
  },
  {
    title: "New to the U.S. financial system",
    body: "Insurance works differently here. I'll explain it in plain language, with no judgment and no pressure.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.500 9.300a2.600 2.600 0 115 .900c0 1.700-2.500 2.200-2.500 3.800" />
        <path d="M12 17.500v.01" />
      </>
    ),
  },
]

const DO_ITEMS = [
  {
    main: true,
    pill: "My specialty",
    title: "Term life insurance with living benefits",
    body: "Affordable coverage for 10-30 years that protects your family, and can also give you access to part of your benefit if you face a qualifying critical, chronic or terminal illness.",
  },
  {
    title: "Indexed universal life (IUL)",
    body: "Permanent coverage that can build cash value over time, for people thinking long term.",
  },
  {
    title: "Final expense coverage",
    body: "Smaller policies designed to help cover funeral and end-of-life costs so loved ones aren't left with the bill.",
  },
  {
    title: "Financial Needs Analysis",
    body: "A free, personalized look at exactly how much protection your family needs.",
  },
  {
    title: "Coverage reviews",
    body: "Already have a policy, or coverage through work? I'll review it and show you any gaps.",
  },
]

const HOW_I_HELP = [
  {
    title: "I educate, not sell",
    body: "I explain your options in plain English so you can make a confident decision.",
  },
  {
    title: "I tailor it to you",
    body: "Your Financial Needs Analysis shapes every recommendation. No cookie-cutter plans.",
  },
  {
    title: "I shop multiple carriers",
    body: "As an independent registered representative, I compare companies to find the right fit for your health and budget.",
  },
  {
    title: "I stay with you",
    body: "New baby, new home, new job? I'll review your coverage as your life changes.",
  },
]

const BENEFITS = [
  {
    title: "Critical illness",
    body: "A qualifying diagnosis - such as a heart attack, stroke or invasive cancer - may let you accelerate part of your death benefit.",
    ex: "Covers costs insurance won't",
    icon: (
      <path d="M12 21s-7-4.4-9.3-9C1 8.4 3.3 4.5 7 4.5c2 0 3.3 1 5 3 1.7-2 3-3 5-3 3.7 0 6 3.9 4.3 7.5C19 16.6 12 21 12 21z" />
    ),
  },
  {
    title: "Chronic illness",
    body: "If you become unable to perform basic daily activities (like bathing or dressing) long-term, benefits may help pay for care.",
    ex: "Help with long-term care costs",
    icon: (
      <>
        <circle cx="12" cy="7" r="3.5" />
        <path d="M5 21v-2a7 7 0 0114 0v2" />
      </>
    ),
  },
  {
    title: "Terminal illness",
    body: "With a qualifying terminal diagnosis, you may access a portion of your benefit to spend meaningful time with family and settle affairs.",
    ex: "Peace of mind when it matters most",
    icon: (
      <>
        <path d="M4 20h16M6 20V10l6-5 6 5v10" />
        <path d="M10 20v-5h4v5" />
      </>
    ),
  },
]

const GALLERY = [
  {
    title: "I listen first",
    body: "Your family, your goals, your budget - before any numbers.",
    art: (
      <svg viewBox="0 0 400 500" className="g-art" role="img" aria-label="I listen first" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="500" fill="#f4ecd9" />
        <circle cx="200" cy="240" r="126" fill="#ffffff" opacity="0.8" />
        <circle cx="200" cy="240" r="126" fill="none" stroke="#c9a963" strokeWidth="3" />
        <rect x="72" y="96" width="112" height="52" rx="18" fill="#0d2b42" />
        <path d="M104 148l-6 22 26-22z" fill="#0d2b42" />
        <circle cx="100" cy="122" r="6" fill="#f5f1e8" />
        <circle cx="128" cy="122" r="6" fill="#f5f1e8" />
        <circle cx="156" cy="122" r="6" fill="#f5f1e8" />
        <circle cx="196" cy="258" r="58" fill="#0d2b42" />
        <path d="M244 236c14 4 22 18 22 34 0 18-10 30-22 36" fill="none" stroke="#dbab47" strokeWidth="11" strokeLinecap="round" />
        <path d="M286 214a70 70 0 0 1 0 88" fill="none" stroke="#c9a963" strokeWidth="11" strokeLinecap="round" />
        <path d="M320 188a108 108 0 0 1 0 140" fill="none" stroke="#c9a963" strokeWidth="11" strokeLinecap="round" opacity="0.55" />
        <rect x="60" y="392" width="280" height="14" rx="7" fill="#0d2b42" />
      </svg>
    ),
  },
  {
    title: "I do the homework",
    body: "I compare carriers and read the fine print so you don't have to.",
    art: (
      <svg viewBox="0 0 400 500" className="g-art" role="img" aria-label="I do the homework" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="500" fill="#f4ecd9" />
        <circle cx="200" cy="240" r="126" fill="#ffffff" opacity="0.8" />
        <circle cx="200" cy="240" r="126" fill="none" stroke="#c9a963" strokeWidth="3" />
        <rect x="106" y="120" width="188" height="252" rx="16" fill="#ffffff" stroke="#0d2b42" strokeWidth="6" />
        <rect x="164" y="104" width="72" height="36" rx="12" fill="#c9a963" />
        <rect x="132" y="168" width="26" height="26" rx="7" fill="none" stroke="#0d2b42" strokeWidth="6" />
        <path d="M136 181l7 8 13-16" fill="none" stroke="#c9a963" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="172" y="174" width="98" height="12" rx="6" fill="#0d2b42" opacity="0.85" />
        <rect x="132" y="216" width="26" height="26" rx="7" fill="none" stroke="#0d2b42" strokeWidth="6" />
        <path d="M136 229l7 8 13-16" fill="none" stroke="#c9a963" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="172" y="222" width="98" height="12" rx="6" fill="#0d2b42" opacity="0.85" />
        <rect x="132" y="264" width="26" height="26" rx="7" fill="none" stroke="#0d2b42" strokeWidth="6" />
        <path d="M136 277l7 8 13-16" fill="none" stroke="#c9a963" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="172" y="270" width="72" height="12" rx="6" fill="#0d2b42" opacity="0.55" />
        <circle cx="252" cy="316" r="42" fill="#dbab47" opacity="0.28" />
        <circle cx="252" cy="316" r="30" fill="none" stroke="#0d2b42" strokeWidth="9" />
        <path d="M274 338l34 34" stroke="#0d2b42" strokeWidth="13" strokeLinecap="round" />
        <rect x="60" y="392" width="280" height="14" rx="7" fill="#0d2b42" />
      </svg>
    ),
  },
  {
    title: "I explain it simply",
    body: "Plain English, every question answered, no jargon.",
    art: (
      <svg viewBox="0 0 400 500" className="g-art" role="img" aria-label="I explain it simply" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="500" fill="#f4ecd9" />
        <circle cx="200" cy="240" r="126" fill="#ffffff" opacity="0.8" />
        <circle cx="200" cy="240" r="126" fill="none" stroke="#c9a963" strokeWidth="3" />
        <rect x="92" y="128" width="216" height="170" rx="16" fill="#ffffff" stroke="#0d2b42" strokeWidth="6" />
        <path d="M112 262l44-42 34 28 52-58" fill="none" stroke="#0d2b42" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="156" cy="220" r="9" fill="#c9a963" />
        <circle cx="242" cy="198" r="9" fill="#c9a963" />
        <rect x="112" y="276" width="120" height="10" rx="5" fill="#0d2b42" opacity="0.4" />
        <rect x="284" y="160" width="16" height="150" rx="8" fill="#dbab47" transform="rotate(24 292 235)" />
        <circle cx="292" cy="160" r="13" fill="#0d2b42" />
        <rect x="60" y="392" width="280" height="14" rx="7" fill="#0d2b42" />
      </svg>
    ),
  },
  {
    title: "I guide the application",
    body: "Step by step, so nothing gets missed.",
    art: (
      <svg viewBox="0 0 400 500" className="g-art" role="img" aria-label="I guide the application" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="500" fill="#f4ecd9" />
        <circle cx="200" cy="240" r="126" fill="#ffffff" opacity="0.8" />
        <circle cx="200" cy="240" r="126" fill="none" stroke="#c9a963" strokeWidth="3" />
        <path d="M126 118h120l34 34v212a14 14 0 0 1-14 14h-140a14 14 0 0 1-14-14v-232a14 14 0 0 1 14-14z" fill="#ffffff" stroke="#0d2b42" strokeWidth="6" strokeLinejoin="round" />
        <path d="M246 118v34h34" fill="none" stroke="#0d2b42" strokeWidth="6" strokeLinejoin="round" />
        <rect x="148" y="186" width="22" height="22" rx="6" fill="none" stroke="#0d2b42" strokeWidth="6" />
        <path d="M152 197l6 6 11-12" fill="none" stroke="#c9a963" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="182" y="191" width="86" height="11" rx="5.5" fill="#0d2b42" opacity="0.8" />
        <rect x="148" y="232" width="22" height="22" rx="6" fill="none" stroke="#0d2b42" strokeWidth="6" />
        <path d="M152 243l6 6 11-12" fill="none" stroke="#c9a963" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="182" y="237" width="86" height="11" rx="5.5" fill="#0d2b42" opacity="0.8" />
        <rect x="148" y="278" width="22" height="22" rx="6" fill="none" stroke="#0d2b42" strokeWidth="6" />
        <rect x="182" y="283" width="64" height="11" rx="5.5" fill="#0d2b42" opacity="0.5" />
        <rect x="250" y="150" width="20" height="170" rx="10" fill="#dbab47" transform="rotate(32 260 235)" />
        <path d="M292 330l16 16-14 14-16-16z" fill="#0d2b42" transform="rotate(32 300 338)" />
        <rect x="60" y="392" width="280" height="14" rx="7" fill="#0d2b42" />
      </svg>
    ),
  },
  {
    title: "I'm here for the long run",
    body: "Life changes - I'll still be a call or text away.",
    art: (
      <svg viewBox="0 0 400 500" className="g-art" role="img" aria-label="I'm here for the long run" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="500" fill="#f4ecd9" />
        <circle cx="200" cy="240" r="126" fill="#ffffff" opacity="0.8" />
        <circle cx="200" cy="240" r="126" fill="none" stroke="#c9a963" strokeWidth="3" />
        <circle cx="292" cy="156" r="34" fill="#dbab47" />
        <path d="M96 400c60-70 46-128 96-168 42-34 96-40 112-96" fill="none" stroke="#ffffff" strokeWidth="46" strokeLinecap="round" />
        <path d="M96 400c60-70 46-128 96-168 42-34 96-40 112-96" fill="none" stroke="#c9a963" strokeWidth="46" strokeLinecap="round" strokeDasharray="4 26" />
        <rect x="238" y="262" width="16" height="62" rx="8" fill="#0d2b42" />
        <circle cx="246" cy="238" r="46" fill="#0d2b42" />
        <circle cx="216" cy="256" r="30" fill="#0d2b42" />
        <circle cx="276" cy="256" r="30" fill="#0d2b42" />
        <circle cx="112" cy="364" r="15" fill="#0d2b42" />
        <path d="M96 424c0-18 8-30 16-30s16 12 16 30z" fill="#0d2b42" />
        <rect x="60" y="392" width="280" height="14" rx="7" fill="#0d2b42" />
      </svg>
    ),
  },
]

const FAQS = [
  {
    q: "What is term life insurance with living benefits?",
    a: "It's a term life policy - coverage for a set period like 10, 20 or 30 years - that includes accelerated benefit riders. Those riders can let you access part of your death benefit early if you're diagnosed with a qualifying critical, chronic or terminal illness.",
  },
  {
    q: "Do living benefits cost extra?",
    a: "On many policies the accelerated benefit riders are included at no additional premium. Some carriers may charge a fee or reduce the payout when the benefit is used. I'll show you exactly how it works for each option.",
  },
  {
    q: "Will I need a medical exam?",
    a: "Not always. Many carriers offer no-exam options based on your health history and age. Whether you qualify depends on underwriting.",
  },
  {
    q: "How much coverage do I need?",
    a: "A common starting point is enough to replace several years of income plus pay off your mortgage and major debts. We'll help you find a number that fits your family and your budget.",
  },
  {
    q: "Am I obligated to buy anything?",
    a: "No. Your quote and consultation are completely free, and you're never under any obligation to purchase.",
  },
  {
    q: "Can I get coverage if I'm not a U.S. citizen?",
    a: "Often, yes. Many carriers offer coverage to permanent residents (green card holders), and some will consider certain visa holders. Eligibility depends on the carrier, your immigration status and how long you've lived in the U.S. I'll check which options are open to you before you apply.",
  },
  {
    q: "Can I name family back home as my beneficiaries?",
    a: "In most cases you can name loved ones who live outside the U.S. Each carrier has its own rules and paperwork for this, and I'll walk you through them.",
  },
  {
    q: "Which states do you serve?",
    a: "I'm licensed across the United States and Canada, so wherever you live I can help. Product availability can still vary by carrier and state, and I'll confirm your options when we talk.",
  },
]

const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
  CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky",
  LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia",
  WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
}

const CA_PROVINCES: Record<string, string> = {
  AB: "Alberta", BC: "British Columbia", MB: "Manitoba", NB: "New Brunswick",
  NL: "Newfoundland and Labrador", NS: "Nova Scotia", ON: "Ontario",
  PE: "Prince Edward Island", QC: "Quebec", SK: "Saskatchewan",
}

/* ------------------------------ form model ------------------------------ */

interface RadioOption {
  name: string
  value: string
  label: string
  wide?: boolean
}

interface Step {
  /** Questions on this step; every one must be answered before continuing. */
  groups: { name: string; label?: string; options: RadioOption[]; one?: boolean }[]
  /** Optional contact fields shown after the questions. */
  contact?: boolean
  /** Optional slot picker shown after the questions. */
  slots?: boolean
}

const STEPS: Step[] = [
  {
    groups: [
      {
        name: "protect",
        label: "Who would struggle financially if your income stopped tomorrow?",
        one: true,
        options: [
          { name: "protect", value: "Spouse/partner and children", label: "My spouse/partner and children" },
          { name: "protect", value: "My children (single parent)", label: "My children (I'm a single parent)" },
          { name: "protect", value: "Family I support here and back home", label: "Family I support here and back home" },
          { name: "protect", value: "Mainly debts (mortgage, loans)", label: "Mainly debts I don't want to leave behind" },
          { name: "protect", value: "No one depends on my income", label: "No one depends on my income" },
        ],
      },
    ],
  },
  {
    groups: [
      {
        name: "age",
        label: "What's your age range?",
        options: [
          { name: "age", value: "18-29", label: "18-29" },
          { name: "age", value: "30-39", label: "30-39" },
          { name: "age", value: "40-49", label: "40-49" },
          { name: "age", value: "50-59", label: "50-59" },
          { name: "age", value: "60-70", label: "60-70" },
          { name: "age", value: "70+", label: "70+" },
        ],
      },
      {
        name: "tobacco",
        label: "Do you use tobacco or nicotine?",
        options: [
          { name: "tobacco", value: "No", label: "No" },
          { name: "tobacco", value: "Yes", label: "Yes" },
        ],
      },
    ],
  },
  {
    groups: [
      {
        name: "timeline",
        label: "When do you want your coverage in place?",
        one: true,
        options: [
          { name: "timeline", value: "Within 2 weeks", label: "Within the next 2 weeks" },
          { name: "timeline", value: "Within 30 days", label: "Within 30 days" },
          { name: "timeline", value: "In 1-3 months", label: "In 1-3 months" },
          { name: "timeline", value: "Just researching", label: "Just researching for now" },
        ],
      },
      {
        name: "budget",
        label: "What monthly amount could you set aside to protect your family?",
        options: [
          { name: "budget", value: "Under $50", label: "Under $50" },
          { name: "budget", value: "$50-$100", label: "$50-$100" },
          { name: "budget", value: "$100-$200", label: "$100-$200" },
          { name: "budget", value: "$200+", label: "$200+" },
          { name: "budget", value: "Not sure - show me what fits", label: "Not sure. Show me what fits my budget", wide: true },
        ],
      },
    ],
  },
  {
    groups: [
      {
        name: "decision",
        label: "If the right plan fits your needs and budget, who makes the final decision?",
        one: true,
        options: [
          { name: "decision", value: "Me - ready to move forward on the call", label: "I do, and I'm ready to move forward on the call" },
          { name: "decision", value: "Spouse and I - spouse will join the call", label: "My spouse and I, and they'll join the call" },
          { name: "decision", value: "Spouse and I - spouse won't be on the call", label: "My spouse and I, but they won't be on the call" },
          { name: "decision", value: "Only gathering information", label: "I'm only gathering information" },
        ],
      },
    ],
  },
  { groups: [], contact: true },
  { groups: [], slots: true },
]

const EMPTY_ANSWERS: Record<string, string> = {}

const EMPTY_DETAILS = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  state: "",
  consent: false,
}

/* ------------------------ availability slot picker ------------------------ */

type Slot = { label: string; value: string; start: string; end: string }

/**
 * Timezone abbreviations that are correct for the visitor and for the season.
 * `Intl`'s short name is only trustworthy for a handful of zones (Chrome gives
 * "GMT+1" for Lagos), so the abbreviation is worked out from the zone's real
 * UTC offset at that moment.
 */
const ZONE_ABBRS: Record<string, { std: string; dst?: string; stdOffset: number }> = {
  "Africa/Lagos": { std: "WAT", stdOffset: 60 },
  "Africa/Cairo": { std: "EET", dst: "EEST", stdOffset: 120 },
  "Africa/Johannesburg": { std: "SAST", stdOffset: 120 },
  "America/Chicago": { std: "CST", dst: "CDT", stdOffset: -360 },
  "America/New_York": { std: "EST", dst: "EDT", stdOffset: -300 },
  "America/Los_Angeles": { std: "PST", dst: "PDT", stdOffset: -480 },
  "America/Sao_Paulo": { std: "BRT", dst: "BRST", stdOffset: -180 },
  "Europe/London": { std: "GMT", dst: "BST", stdOffset: 0 },
  "Europe/Paris": { std: "CET", dst: "CEST", stdOffset: 60 },
  "Asia/Dubai": { std: "GST", stdOffset: 240 },
  "Asia/Kolkata": { std: "IST", stdOffset: 330 },
  "Asia/Singapore": { std: "SGT", stdOffset: 480 },
  "Asia/Tokyo": { std: "JST", stdOffset: 540 },
  "Australia/Sydney": { std: "AEST", dst: "AEDT", stdOffset: 600 },
  "Pacific/Auckland": { std: "NZST", dst: "NZDT", stdOffset: 720 },
}

function tzOffsetMinutes(tz: string, at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(at)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0)
  const asUtc = Date.UTC(
    get("year"), get("month") - 1, get("day"),
    get("hour") % 24, get("minute"), get("second"),
  )
  return Math.round((asUtc - at.getTime()) / 60000)
}

function offsetLabel(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-"
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`
}

function tzAbbrev(tz: string, at?: Date): string {
  const instant = at ?? new Date()
  const meta = ZONE_ABBRS[tz]
  if (meta) {
    return meta.dst && tzOffsetMinutes(tz, instant) !== meta.stdOffset ? meta.dst : meta.std
  }
  try {
    const name = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" })
      .formatToParts(instant)
      .find((part) => part.type === "timeZoneName")?.value
    if (name && !/^GMT[+-]/.test(name)) return name
  } catch { /* fall through */ }
  return offsetLabel(tzOffsetMinutes(tz, instant))
}

function todayInTz(tz: string): string {
  try { return new Date().toLocaleDateString("en-CA", { timeZone: tz }) } catch { return new Date().toISOString().split("T")[0] }
}

function SlotPicker({
  date, time, onDate, onTime,
}: {
  date: string
  time: string
  onDate: (value: string) => void
  onTime: (value: string) => void
}) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userTz = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/Chicago"

  // Same endpoint and conversion the booking short form uses, so the stored
  // value lands in the admin console and calendar exactly as a normal booking.
  useEffect(() => {
    if (!date) { setSlots([]); return }
    let cancelled = false
    setLoading(true); setError(null)
    fetch(`/.netlify/functions/calendar?date=${date}`)
      .then((r) => { if (!r.ok) throw new Error("Could not load availability"); return r.json() })
      .then((data) => {
        if (cancelled) return
        const selectedDay = new Date(`${date}T00:00:00`).toLocaleDateString("en-CA", { timeZone: userTz })
        const converted = (data.slots || [])
          .map((raw: Slot) => {
            const start = new Date(raw.start)
            if (start.toLocaleDateString("en-CA", { timeZone: userTz }) !== selectedDay) return null
            return {
              ...raw,
              label: start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: userTz }),
            }
          })
          .filter((x: Slot | null): x is Slot => x !== null)
        setSlots(converted)
        if (time && !(data.slots || []).some((raw: Slot) => raw.value === time)) onTime("")
      })
      .catch((e: unknown) => {
        if (!cancelled) { setError(e instanceof Error ? e.message : "Could not load availability"); setSlots([]) }
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <div>
      <div className="field">
        <label htmlFor="ins-date">Preferred date</label>
        <input
          id="ins-date"
          type="date"
          required
          min={todayInTz(userTz)}
          value={date}
          onChange={(e) => { onDate(e.target.value); onTime("") }}
        />
      </div>
      <div className="field">
        <label id="ins-time-label">Preferred time</label>
        {loading && <p className="slot-loading">Loading available times…</p>}
        {!loading && !date && <p className="slot-loading">Pick a date first</p>}
        {!loading && date && slots.length === 0 && <p className="slot-loading">No slots on that day - try another date.</p>}
        {!loading && date && slots.length > 0 && (
          <div className="slot-grid" role="group" aria-labelledby="ins-time-label">
            {slots.map((slot) => (
              <button
                type="button"
                key={slot.value}
                className="slot"
                aria-pressed={time === slot.value}
                onClick={() => onTime(slot.value)}
              >
                {slot.label}
              </button>
            ))}
          </div>
        )}
        <small className="slot-meta">Time zone: {tzAbbrev(userTz)} ({offsetLabel(tzOffsetMinutes(userTz, new Date()))})</small>
      </div>
      {error && <p className="err-msg">{error}</p>}
    </div>
  )
}

/* --------------------------------- icons --------------------------------- */

const Ico = ({ children }: { children: ReactNode }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

const IcoCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

const CalIco = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="2.2" />
    <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)

/* --------------------------------- page ---------------------------------- */

export default function InsurancePage() {
  const { submitBooking } = useBookings()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(EMPTY_ANSWERS)
  const [details, setDetails] = useState(EMPTY_DETAILS)
  const [slotDate, setSlotDate] = useState("")
  const [slotTime, setSlotTime] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  const [formInvalid, setFormInvalid] = useState<Record<string, boolean>>({})

  const [popOpen, setPopOpen] = useState(false)
  const [popDone, setPopDone] = useState(false)
  const [popSending, setPopSending] = useState(false)
  const [popError, setPopError] = useState<string | null>(null)
  const [popInvalid, setPopInvalid] = useState<Record<string, boolean>>({})

  const [playing, setPlaying] = useState(false)
  const [ctaHidden, setCtaHidden] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)
  const popRef = useRef<HTMLDivElement>(null)

  const totalSteps = STEPS.length
  const isContact = STEPS[step].contact === true
  const isSlot = STEPS[step].slots === true

  /* Hide the floating CTA while the quote card is on screen (as in the reference). */
  useEffect(() => {
    const target = quoteRef.current
    if (!target) return
    const io = new IntersectionObserver(([entry]) => setCtaHidden(entry.isIntersecting), { threshold: 0.15 })
    io.observe(target)
    return () => io.disconnect()
  }, [])

  /* Lead popup: once per load, after 8s, on 50% scroll or on exit intent. */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("popup")) {
      const t = window.setTimeout(() => setPopOpen(true), 400)
      return () => window.clearTimeout(t)
    }
    let shown = false
    const loadedAt = Date.now()
    const open = () => {
      if (shown || step > 0) return
      if (Date.now() - loadedAt < 6000) return
      shown = true
      setPopOpen(true)
    }
    const onOut = (e: MouseEvent) => { if (!e.relatedTarget && e.clientY <= 0) open() }
    const onScroll = () => {
      if (window.scrollY + window.innerHeight > document.documentElement.scrollHeight * 0.5) open()
    }
    const timer = window.setTimeout(open, 8000)
    document.addEventListener("mouseout", onOut)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener("mouseout", onOut)
      window.removeEventListener("scroll", onScroll)
    }
  }, [step])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPopOpen(false) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  const closePop = useCallback(() => setPopOpen(false), [])

  const scrollToQuote = useCallback(() => {
    quoteRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const answer = (name: string, value: string) => {
    // Keep the updater pure: React may invoke it twice in StrictMode, and a
    // side effect in there would skip a whole question.
    const next = { ...answers, [name]: value }
    setAnswers(next)
    const groups = STEPS[step].groups
    if (groups.length && groups.every((g) => next[g.name])) {
      window.setTimeout(() => setStep((s) => Math.min(s + 1, totalSteps - 1)), 240)
    }
  }

  const validateStep = (): string => {
    const groups = STEPS[step].groups
    for (const g of groups) if (!answers[g.name]) return "Please choose an option to continue."

    if (isContact) {
      const bad: Record<string, boolean> = {}
      const need = ["firstName", "lastName", "email", "phone", "state"] as const
      need.forEach((k) => { if (!details[k].trim()) bad[k] = true })
      if (!/^\S+@\S+\.\S+$/.test(details.email.trim())) bad.email = true
      if (details.phone.replace(/\D/g, "").length < 10) bad.phone = true
      if (!details.consent) bad.consent = true
      setFormInvalid(bad)
      if (Object.keys(bad).length) return "Please complete the highlighted fields."
    }

    if (isSlot && !slotTime) return "Please pick a time for your call."
    return ""
  }

  const next = () => {
    const msg = validateStep()
    setError(msg || null)
    if (!msg) setStep((s) => Math.min(s + 1, totalSteps - 1))
  }

  const back = () => { setError(null); setStep((s) => Math.max(0, s - 1)) }

  const send = async () => {
    const msg = validateStep()
    if (msg) { setError(msg); return }
    setSubmitting(true)
    setError(null)

    const answered = STEPS.flatMap((s) => s.groups)
      .map((g) => `${(g.label ?? g.name).replace(/\?$/, "")}: ${answers[g.name] ?? "-"}`)
      .join("  |  ")

    const payload: BookingInput = {
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      phone: details.phone,
      city: "",
      province: details.state,
      country: US_STATES[details.state] ? "United States" : "Canada",
      contactMethod: "Email",
      source: "Wealth protection page (insurance)",
      route: "Wealth protection",
      path: "Insurance enquiry",
      topic: "Family Protection Report - free 1:1 call",
      priorities: STEPS.flatMap((s) => s.groups).map((g) => `${(g.label ?? g.name).replace(/\?$/, "")}: ${answers[g.name] ?? "-"}`),
      outcome: "Attend a free 1:1 call and receive their Family Protection Report",
      context: answered,
      question: "",
      availableDate: slotDate,
      availableTime: slotTime,
      consentContact: details.consent,
      consentUpdates: details.consent,
      userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    const result = await submitBooking(payload)
    setSubmitting(false)
    if (result.error) { setError(result.error); return }
    setReference(result.reference ?? null)
  }

  const sendPopLead = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    const bad: Record<string, boolean> = {}
    if (!data.name?.trim()) bad.name = true
    if ((data.phone ?? "").replace(/\D/g, "").length < 10) bad.phone = true
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) bad.email = true
    if (data.consent !== "yes") bad.consent = true
    setPopInvalid(bad)
    if (Object.keys(bad).length) { setPopError("Please complete the highlighted fields."); return }

    setPopSending(true)
    setPopError(null)
    const result = await submitContactMessage({
      name: (data.name ?? "").trim(),
      email: (data.email ?? "").trim(),
      subject: "Insurance page - Family Protection Report",
      message:
        `Phone: ${(data.phone ?? "").trim()}\n` +
        `Source: insurance page popup ("Before you go - can I help?")\n` +
        `Consent: ${data.consent === "yes" ? "agreed" : "not given"}\n\n` +
        `I'd like free, no-pressure term life options for my family.`,
    })
    setPopSending(false)
    if (!result.ok) { setPopError(result.error ?? "Something went wrong. Please try again."); return }
    setPopDone(true)
  }

  const prefillFromPop = () => {
    const form = popRef.current?.querySelector("form")
    if (!(form instanceof HTMLFormElement)) return
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    const [first = "", ...rest] = (data.name ?? "").trim().split(/\s+/)
    setDetails((d) => ({
      ...d,
      firstName: d.firstName || first,
      lastName: d.lastName || rest.join(" "),
      email: d.email || data.email || "",
      phone: d.phone || data.phone || "",
    }))
    closePop()
    scrollToQuote()
  }

  return (
    <div className="insurance-page">
      {/* ============ HERO + FORM ============ */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-intro pitch">
            <p className="pitch-who">
              African Immigrant Families in the U.S. <span>(Parents, Homeowners &amp; Breadwinners)</span>
            </p>
            <h1>
              Find Out Exactly How Much Life Insurance <span className="hl">Your Family Needs!</span>
            </h1>
            <p className="pitch-sub">
              Get your free <strong>Family Protection Report</strong>, built with you on one short 1:1 call:
            </p>
            <ul className="pitch-report">
              <li><b>1</b><span><strong>Your coverage number:</strong> how much your family would need if your income stopped</span></li>
              <li><b>2</b><span><strong>Side-by-side quotes</strong> from multiple A-rated carriers, built around your budget</span></li>
              <li><b>3</b><span><strong>Your rate-lock date:</strong> when your price is likely to go up because of your age</span></li>
            </ul>
            <p className="pitch-promise">
              <strong>My No-Pressure Promise:</strong> if nothing fits, I'll tell you, and you keep the report.
              <br />
              If you do apply, every policy has a free-look period, so you can cancel for a full refund.
            </p>
            <a href="#book" className="pitch-btn">Get My Free Report</a>
          </div>

          <div className={`vsl${playing ? " playing" : ""}`}>
            <div className="vsl-player">
              <video
                ref={videoRef}
                playsInline
                preload="none"
                poster={IMG.poster}
                controls={playing}
                src={`${ASSETS}/kayode-story.mp4`}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => { setPlaying(false); videoRef.current?.load() }}
              />
              {!playing && (
                <button type="button" className="vsl-play" onClick={() => void videoRef.current?.play().catch(() => {})} aria-label="Play video: Why I do what I do">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86A1 1 0 008 5.140z" />
                  </svg>
                </button>
              )}
            </div>
            <div className="vsl-text">
              <p className="vsl-kicker">Watch · 1 minute</p>
              <h2>Why I do what I do</h2>
              <p>
                Hi, I am {AGENT_NAME}{AGENT_CREDS}. Before you look at any numbers, hear why this work matters to me.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="strip">
        <div className="wrap">
          {STRIP.map((item) => <span key={item}>✦ {item}</span>)}
        </div>
      </div>

      {/* ============ WHO I HELP / WHAT I DO / HOW I HELP ============ */}
      <section className="section" id="who">
        <div className="wrap center">
          <p className="eyebrow">Who I help</p>
          <h2 style={{ marginTop: 10 }}>I help African immigrant families in the U.S. protect what they've worked so hard to build</h2>
          <p className="lede">
            You left home, started over and built a life here. I help make sure a serious illness or the unexpected never
            undoes that, for your family here and the loved ones who count on you back home.
          </p>

          <div className="who-grid">
            {WHO_I_HELP.map((card) => (
              <div className="who-card" key={card.title}>
                <span className="ic"><Ico>{card.icon}</Ico></span>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="who-note">
            Not from the African community? You're welcome here too.{" "}
            <strong>If anyone would struggle financially without you, we should talk.</strong>
          </p>

          <div className="do-wrap">
            <div className="do-col">
              <p className="eyebrow">What I do</p>
              <h2 style={{ marginTop: 8 }}>Protection that fits your life and your budget</h2>
              <div className="do-list">
                {DO_ITEMS.map((item) => (
                  <div className={`do-item${item.main ? " main" : ""}`} key={item.title}>
                    {item.pill && <span className="pill">{item.pill}</span>}
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="how-col">
              <p className="eyebrow">How I help</p>
              <h2 style={{ marginTop: 8 }}>I make it simple, personal and pressure-free</h2>
              <ul className="how-list">
                {HOW_I_HELP.map((item, i) => (
                  <li key={item.title}>
                    <span className="n">{i + 1}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.body}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <a href="#book" className="btn btn-bloom">Book a 1:1 call →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COMPARE ============ */}
      <section className="section">
        <div className="wrap center">
          <p className="eyebrow">Why living benefits matter</p>
          <h2 style={{ marginTop: 10 }}>Not all term policies are built the same</h2>
          <p className="lede">
            A heart attack, cancer diagnosis or stroke can stop your paycheck long before it threatens your life. The
            right policy is designed for both.
          </p>
          <div className="compare" style={{ textAlign: "left" }}>
            <div className="cmp">
              <h3>Basic term life</h3>
              <ul>
                <li>Pays your beneficiaries only after you pass away</li>
                <li>No help if you get seriously sick and can't work</li>
                <li>Medical bills and lost income can drain your savings</li>
              </ul>
            </div>
            <div className="cmp good">
              <h3>Term life with living benefits</h3>
              <ul>
                <li>Still pays a death benefit to protect your family</li>
                <li>Can let you access part of your coverage early for a qualifying illness</li>
                <li>Use the money how you need it - bills, treatment, mortgage, time off</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BENEFITS ============ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap center">
          <p className="eyebrow">What living benefits can cover</p>
          <h2 style={{ marginTop: 10 }}>Three ways your policy can work for you while you're alive</h2>
          <div className="benefits" style={{ textAlign: "left" }}>
            {BENEFITS.map((card) => (
              <div className="card" key={card.title}>
                <div className="ic">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {card.icon}
                  </svg>
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <p className="ex">{card.ex}</p>
              </div>
            ))}
          </div>
          <p className="fine">
            Living benefits are provided through accelerated benefit riders. Availability, qualifying conditions and
            amounts vary by carrier, product and state, and any amount accelerated reduces the death benefit.
          </p>
        </div>
      </section>

      {/* ============ FINANCIAL NEEDS ANALYSIS ============ */}
      <section className="section fna" id="approach" style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div className="fna-photo">
            <img src={IMG.fna} alt="Your adviser with a planning notebook" loading="lazy" />
            <div className="note">
              <strong>No guesswork. No one-size-fits-all.</strong>
              Your recommendation comes from your numbers and your goals, not a sales script.
            </div>
          </div>
          <div>
            <p className="eyebrow">My approach</p>
            <h2 style={{ marginTop: 10 }}>How I find the solution that actually fits you</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Before I recommend anything, we do a <strong>Financial Needs Analysis</strong> together. It's a simple,
              judgment-free look at your family's finances that shows how much protection you really need and what fits
              your budget, so you never buy too much or too little.
            </p>
            <ol className="fna-steps">
              <li>
                <h3>We get to know your story</h3>
                <p>Who depends on you, your income, your goals, any coverage you already have through work, and what keeps you up at night.</p>
              </li>
              <li>
                <h3>We calculate your real need</h3>
                <p>I use the DIME method to put a real number on what your family would need if something happened to you:</p>
                <div className="dime">
                  <span><b>D</b>Debts</span>
                  <span><b>I</b>Income to replace</span>
                  <span><b>M</b>Mortgage</span>
                  <span><b>E</b>Education</span>
                </div>
              </li>
              <li>
                <h3>We match it to your budget</h3>
                <p>I compare carriers, term lengths and living benefit riders side by side and find the strongest protection for a premium you're comfortable with.</p>
              </li>
              <li>
                <h3>You get a clear, written plan</h3>
                <p>Plain-English recommendations and the reasons behind them. You decide, with no pressure. Then I check in as your life changes, like a new baby, a new home or a raise.</p>
              </li>
            </ol>
            <a href="#book" className="btn btn-bloom" style={{ marginTop: 6 }}>Book a 1:1 call →</a>
          </div>
        </div>
      </section>

      {/* ============ MEET YOUR AGENT ============ */}
      <section className="section meet" style={{ background: "var(--white)" }}>
        <div className="wrap">
          <div className="portrait">
            <img src={IMG.portrait} alt={`${AGENT_NAME}, RR`} loading="lazy" />
            <span className="tag">
              Licensed Financial Professional
              <small>RR · KSEFinServe</small>
            </span>
          </div>
          <div className="letter">
            <p className="eyebrow">Meet {AGENT_NAME}, RR</p>
            <h2 style={{ marginTop: 10 }}>A real person who'll walk this road with you</h2>
            <p>
              Hi, I am <strong>{AGENT_NAME}{AGENT_CREDS}</strong>. I started KSEFinServe because I saw too many families
              find out the hard way that a serious illness can hurt just as much as a loss - the bills pile up, the
              paycheck stops, and the savings disappear.
            </p>
            <p>
              I'm an independent registered representative, which means I don't work for one insurance company. I work
              for <em>you</em>. I compare options across carriers, explain everything in plain English, and only recommend
              what truly fits your family and your budget.
            </p>
            <p>
              I work closely with African immigrant families across the communities I serve. I know how much it took to
              build your life here, and how many people may be counting on you, both here and back home.
            </p>
            <p>
              If you've been putting this off because it feels confusing or salesy - I understand. Let's just talk. No
              pressure, ever.
            </p>
            <p className="sig">
              {AGENT_NAME}{AGENT_CREDS}
              <small>Founder, KSEFinServe</small>
            </p>
          </div>
        </div>
      </section>

      {/* ============ BOOK A 1:1 ============ */}
      <section className="section book" id="book" style={{ background: "var(--sand)" }}>
        <div className="wrap">
          <div>
            <p className="eyebrow">Your free Family Protection Report</p>
            <h2 style={{ marginTop: 10 }}>Get your number, your quotes and your rate-lock date.</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Answer four quick questions, then pick a time. On a relaxed, one-on-one call we'll build your Family
              Protection Report together. It's free, with no obligation, and you keep the report either way.
            </p>
            <ul className="book-points">
              <li>
                <span className="ic"><Ico><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ico></span>
                <div><strong>About 30 minutes</strong><span>Enough time for real answers, short enough for a lunch break.</span></div>
              </li>
              <li>
                <span className="ic"><Ico><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3" /></Ico></span>
                <div><strong>By video call, from anywhere</strong><span>Join from your phone or computer. The link arrives as soon as you book.</span></div>
              </li>
              <li>
                <span className="ic"><Ico><path d="M5 12.5l4.5 4.5L19 7.5" /></Ico></span>
                <div><strong>Walk away with your report</strong><span>Your coverage number, side-by-side quotes, your rate-lock date, and how living benefits work for you.</span></div>
              </li>
            </ul>
            <div className="book-agent">
              <img src={IMG.agent} alt="" />
              <p>
                "I'll come prepared, listen first, and never pressure you. You'll be talking with me, not a call center."
                <br />
                <strong style={{ color: "var(--vine)" }}>{AGENT_NAME}{AGENT_CREDS}</strong>
              </p>
            </div>
          </div>

          <div>
            <div className="quote-card" id="quote" ref={quoteRef}>
              {reference ? (
                <div className="thanks">
                  <div className="badge"><IcoCheck /></div>
                  <h2>You're booked, {details.firstName || "friend"}!</h2>
                  <p>
                    Reference <strong>{reference}</strong>. We'll email {details.email} your confirmation and the video
                    link for {slotDate} at the time you picked.
                  </p>
                  <p className="small" style={{ marginTop: 12 }}>
                    Add it to your calendar and come with any policy you already have - that's all you need.
                  </p>
                </div>
              ) : (
                <div id="formBody">
                  <h2>Get my free report</h2>
                  <p className="small">Answer 4 quick questions, then pick a time for your 1:1 call. Free, no obligation.</p>
                  <div className="progress" aria-hidden="true">
                    {STEPS.map((_, i) => <i key={i} className={i <= step ? "on" : ""} />)}
                  </div>

                  <form id="leadForm" noValidate onSubmit={(e) => e.preventDefault()}>
                    {STEPS.map((s, index) => (
                      <div key={index} className={`step${index === step ? " active" : ""}`} data-step={index + 1}>
                        {s.groups.map((g) => (
                          <div key={g.name} style={{ marginTop: g.label && s.groups.indexOf(g) > 0 ? 18 : 0 }}>
                            {g.label && <span className="q-label">{g.label}</span>}
                            <div className={`choices${g.one ? " one" : ""}`}>
                              {g.options.map((opt) => (
                                <label
                                  key={opt.value}
                                  className="choice"
                                  style={opt.wide ? { gridColumn: "1 / -1" } : undefined}
                                >
                                  <input
                                    type="radio"
                                    name={g.name}
                                    value={opt.value}
                                    checked={answers[g.name] === opt.value}
                                    onChange={() => answer(g.name, opt.value)}
                                  />
                                  <span>{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}

                        {s.contact && (
                          <>
                            <span className="q-label">Who will I be meeting with?</span>
                            <div className="row2">
                              <div className={`field${formInvalid.firstName ? " invalid" : ""}`}>
                                <label htmlFor="fn">First name</label>
                                <input
                                  id="fn"
                                  name="first_name"
                                  autoComplete="given-name"
                                  required
                                  value={details.firstName}
                                  onChange={(e) => setDetails((d) => ({ ...d, firstName: e.target.value }))}
                                />
                              </div>
                              <div className={`field${formInvalid.lastName ? " invalid" : ""}`}>
                                <label htmlFor="ln">Last name</label>
                                <input
                                  id="ln"
                                  name="last_name"
                                  autoComplete="family-name"
                                  required
                                  value={details.lastName}
                                  onChange={(e) => setDetails((d) => ({ ...d, lastName: e.target.value }))}
                                />
                              </div>
                            </div>
                            <div className={`field${formInvalid.email ? " invalid" : ""}`}>
                              <label htmlFor="em">Email</label>
                              <input
                                id="em"
                                type="email"
                                name="email"
                                autoComplete="email"
                                required
                                value={details.email}
                                onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                              />
                            </div>
                            <div className="row2">
                              <div className={`field${formInvalid.phone ? " invalid" : ""}`}>
                                <label htmlFor="ph">Phone</label>
                                <input
                                  id="ph"
                                  type="tel"
                                  name="phone"
                                  autoComplete="tel"
                                  inputMode="tel"
                                  placeholder="(555) 555-5555"
                                  required
                                  value={details.phone}
                                  onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))}
                                />
                              </div>
                              <div className={`field${formInvalid.state ? " invalid" : ""}`}>
                                <label htmlFor="st">State / Province</label>
                                <select
                                  id="st"
                                  name="state"
                                  required
                                  value={details.state}
                                  onChange={(e) => setDetails((d) => ({ ...d, state: e.target.value }))}
                                >
                                  <option value="">Select…</option>
                                  <optgroup label="United States">
                                    {Object.entries(US_STATES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                                  </optgroup>
                                  <optgroup label="Canada">
                                    {Object.entries(CA_PROVINCES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                                  </optgroup>
                                </select>
                              </div>
                            </div>
                            <label className={`consent${formInvalid.consent ? " invalid" : ""}`}>
                              <input
                                type="checkbox"
                                name="consent"
                                value="yes"
                                checked={details.consent}
                                onChange={(e) => setDetails((d) => ({ ...d, consent: e.target.checked }))}
                              />
                              <span>
                                By checking this box and submitting, I agree that KSEFinServe and its licensed agents may
                                contact me about life insurance at the phone number and email provided, including by call,
                                text, and automated technology. Consent is not a condition of purchase. Message &amp; data
                                rates may apply. Reply STOP to opt out.
                              </span>
                            </label>
                          </>
                        )}

                        {s.slots && (
                          <>
                            <span className="q-label">Pick a time for your 1:1 call</span>
                            <SlotPicker date={slotDate} time={slotTime} onDate={setSlotDate} onTime={setSlotTime} />
                          </>
                        )}
                      </div>
                    ))}

                    <p className="err-msg" role="alert">{error}</p>
                    <div className="nav-row">
                      <button type="button" className="btn btn-ghost" onClick={back} hidden={step === 0}>← Back</button>
                      {step < totalSteps - 1 ? (
                        <button type="button" className="btn btn-bloom" onClick={next}>
                          {step === totalSteps - 2 ? "Continue to pick a time →" : "Continue →"}
                        </button>
                      ) : (
                        <button type="button" className="btn btn-bloom" onClick={send} disabled={submitting}>
                          {submitting ? "Sending…" : "Request my free report"}
                        </button>
                      )}
                    </div>
                    <p className="secure">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      Your information is private and never sold.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ WORKING WITH ME ============ */}
      <section className="section">
        <div className="wrap center">
          <p className="eyebrow">What working with me looks like</p>
          <h2 style={{ marginTop: 10 }}>Personal, patient and always in your corner</h2>
          <p className="lede">You'll never be a policy number to me. Here's what you can expect from the first conversation to years down the road.</p>
          <div className="gallery">
            {GALLERY.map((g) => (
              <figure key={g.title}>
                <div className="g-art-frame">{g.art}</div>
                <figcaption><strong>{g.title}</strong>{g.body}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section">
        <div className="wrap center">
          <p className="eyebrow">How it works</p>
          <h2 style={{ marginTop: 10 }}>Covered in three simple steps</h2>
          <div className="steps" style={{ textAlign: "left" }}>
            <div className="card">
              <div className="num">01</div>
              <h3>Answer a few questions</h3>
              <p>Tell me who you want to protect and roughly how much coverage you need. It takes about a minute.</p>
            </div>
            <div className="card">
              <div className="num">02</div>
              <h3>Your Financial Needs Analysis</h3>
              <p>We talk one-on-one, figure out exactly how much protection your family needs, and I compare carriers to fit your budget. No pressure.</p>
            </div>
            <div className="card">
              <div className="num">03</div>
              <h3>Apply &amp; get protected</h3>
              <p>Pick the plan you like. Many applicants can qualify with no medical exam, and some get a decision quickly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section" style={{ background: "var(--sand)" }}>
        <div className="wrap">
          <div className="center">
            <p className="eyebrow">Questions</p>
            <h2 style={{ marginTop: 10 }}>Frequently asked questions</h2>
          </div>
          <div className="faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section cta">
        <div className="wrap">
          <img src={IMG.portrait} alt={AGENT_NAME} loading="lazy" />
          <div>
            <h2>Let's protect the people you love - together.</h2>
            <p>
              Rates are based on your age and health today, so the best time to look is now. Tell me a little about your
              family and I'll personally reach out with your options.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }} className="cta-btns">
              <a href="#book" className="btn btn-book light">
                <CalIco />
                Book a 1:1 consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="ins-legal">
        <div className="wrap">
          <p>
            <strong>KSEFinServe</strong> · <a href="https://ksefinserve.com/">ksefinserve.com</a> ·{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ·{" "}
            <a href="tel:+12819447306">{CONTACT_PHONE}</a>
          </p>
          <p>
            This is a solicitation for insurance. KSEFinServe is an independent insurance agency; agents are licensed only
            in the states and provinces where they hold an active license (currently across the United States and
            Canada). Coverage is underwritten by the issuing insurance carrier, and all policies are subject to
            underwriting approval, terms, conditions and exclusions. Not all products, riders or features are available
            in every state or province.
          </p>
          <p>
            Living benefits are provided through accelerated death benefit riders. Qualifying conditions, benefit
            amounts and any associated fees vary by carrier and product. Accelerated benefits reduce the death benefit
            payable to beneficiaries, may be taxable, and may affect eligibility for public assistance programs. Consult
            a tax advisor regarding your situation.
          </p>
          <p>
            Indexed universal life (IUL) is a life insurance product, not an investment in the stock market or any index.
            Interest credited is subject to caps, participation rates and policy charges; past index performance does not
            guarantee future results; and cash value accumulation is not guaranteed beyond the policy's minimum
            guarantees. Policy loans and withdrawals reduce cash value and the death benefit.
          </p>
          <p><a href="#book">Book a 1:1 consultation</a></p>
          <p>
            Submitting your information does not obligate you to purchase. We do not sell your personal information. ©{" "}
            {new Date().getFullYear()} KSEFinServe. All rights reserved.
          </p>
        </div>
      </section>

      {/* ============ LEAD POPUP ============ */}
      <div
        className={`pop${popOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!popOpen}
        onClick={(e) => { if (e.target === e.currentTarget) closePop() }}
      >
        <div className="pop-box" ref={popRef}>
          <button type="button" className="pop-close" onClick={closePop} aria-label="Close">×</button>
          {!popDone ? (
            <div>
              <img className="avatar" src={IMG.agent} alt="" />
              <h2>Before you go - can I help?</h2>
              <p className="small">Leave your info and I'll personally reach out with free, no-pressure term life options for your family.</p>
              <form noValidate onSubmit={sendPopLead}>
                <div className={`field${popInvalid.name ? " invalid" : ""}`}>
                  <label htmlFor="pName">Full name</label>
                  <input id="pName" name="name" autoComplete="name" required />
                </div>
                <div className={`field${popInvalid.phone ? " invalid" : ""}`}>
                  <label htmlFor="pPhone">Phone</label>
                  <input id="pPhone" type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="(555) 555-5555" required />
                </div>
                <div className={`field${popInvalid.email ? " invalid" : ""}`}>
                  <label htmlFor="pEmail">Email</label>
                  <input id="pEmail" type="email" name="email" autoComplete="email" required />
                </div>
                <label className={`consent${popInvalid.consent ? " invalid" : ""}`}>
                  <input type="checkbox" name="consent" value="yes" />
                  <span>
                    By checking this box and submitting, I agree that KSEFinServe and its licensed agents may contact me
                    about life insurance at the phone number and email provided. Consent is not a condition of purchase.
                  </span>
                </label>
                <p className="err-msg" role="alert">{popError}</p>
                <button type="submit" className="btn btn-bloom" disabled={popSending}>
                  {popSending ? "Sending…" : "Yes, contact me"}
                </button>
              </form>
              <a href="#book" className="pop-book" onClick={(e) => { e.preventDefault(); closePop(); scrollToQuote() }}>
                Rather pick a time? Book a 1:1 consultation →
              </a>
              <button type="button" className="pop-no" onClick={closePop}>No thanks, I'm just browsing</button>
            </div>
          ) : (
            <div className="thanks">
              <img className="avatar" src={IMG.agent} alt="" />
              <h2>You're in! One last step.</h2>
              <p>Skip the phone tag: pick a time for your free 1:1 call now. It takes about a minute, and your details are already filled in.</p>
              <button type="button" className="btn btn-bloom" style={{ marginTop: 18 }} onClick={prefillFromPop}>
                Pick my call time →
              </button>
              <button type="button" className="pop-no" onClick={closePop}>I'll wait for your call</button>
            </div>
          )}
        </div>
      </div>

      {/* ============ FLOATING CTA ============ */}
      <div className={`mobile-cta${ctaHidden ? " hide" : ""}`}>
        <a href="#book" className="btn btn-bloom btn-float">
          <CalIco />
          Book a 1:1 call
        </a>
      </div>
    </div>
  )
}
