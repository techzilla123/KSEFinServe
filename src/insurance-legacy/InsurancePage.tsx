import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { useBookings, type BookingInput } from "./admin/bookingsDirectory"

/* ==================================================================
   KSEFinServe — Wealth Protection (insurance) page
   Loaded only at /insurance.
   ================================================================== */

const ASSETS = "/assets"
const POSTER = `${ASSETS}/kayode-poster.png`

/* ---------------- Icons (stroke, 48x48) ---------------- */
type IcoProps = { size?: number; className?: string }
const Svg = ({ size = 24, className, children, viewBox = "0 0 48 48" }: IcoProps & { children: ReactNode; viewBox?: string }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{children}</svg>
)

const IcoFamily = (p: IcoProps) => (<Svg {...p}><circle cx="17" cy="16" r="5" /><circle cx="32" cy="16" r="5" /><path d="M8 38c0-6 4-10 9-10s9 4 9 10" /><path d="M25 38c0-6 4-10 9-10s8 4 8 10" /></Svg>)
const IcoHome = (p: IcoProps) => (<Svg {...p}><path d="M8 22 24 9l16 13" /><path d="M12 20v18h24V20" /><path d="M20 38V27h8v11" /></Svg>)
const IcoGlobe = (p: IcoProps) => (<Svg {...p}><circle cx="24" cy="24" r="16" /><path d="M8 24h32" /><path d="M24 8c5 5 5 27 0 32c-5-5-5-27 0-32z" /></Svg>)
const IcoCap = (p: IcoProps) => (<Svg {...p}><path d="M6 18 24 10l18 8-18 8z" /><path d="M14 22v10c0 3 4.5 6 10 6s10-3 10-6V22" /><path d="M42 20v12" /></Svg>)
const IcoBriefcase = (p: IcoProps) => (<Svg {...p}><rect x="7" y="15" width="34" height="24" rx="4" /><path d="M18 15v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4" /><path d="M7 25h34" /></Svg>)
const IcoCompass = (p: IcoProps) => (<Svg {...p}><circle cx="24" cy="24" r="16" /><path d="m30 18-4 10-10 4 4-10z" /></Svg>)
const IcoShield = (p: IcoProps) => (<Svg {...p}><path d="M24 6l14 5v11c0 9-6 16-14 20-8-4-14-11-14-20V11z" /><path d="m17 24 5 5 9-10" /></Svg>)
const IcoIUL = (p: IcoProps) => (<Svg {...p}><path d="M8 38V22" /><path d="M18 38V14" /><path d="M28 38V26" /><path d="M38 38V10" /><path d="M6 14c6-6 12 4 18-2s12 2 18-4" /></Svg>)
const IcoFinal = (p: IcoProps) => (<Svg {...p}><path d="M24 8s-9 8-9 15a9 9 0 0 0 18 0c0-7-9-15-9-15z" /><path d="M24 23v6" /></Svg>)
const IcoAnalysis = (p: IcoProps) => (<Svg {...p}><circle cx="21" cy="21" r="12" /><path d="m30 30 10 10" /><path d="M15 21h12" /><path d="M21 15v12" /></Svg>)
const IcoReview = (p: IcoProps) => (<Svg {...p}><path d="M10 8h22a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3z" /><path d="M14 18h20" /><path d="M14 26h20" /><path d="M14 34h10" /></Svg>)
const IcoIncome = (p: IcoProps) => (<Svg {...p}><path d="M10 40h28" /><path d="M14 40V28" /><path d="M24 40V18" /><path d="M34 40V10" /><path d="M8 16l10-6 8 5 14-8" /></Svg>)
const IcoCritical = (p: IcoProps) => (<Svg {...p}><path d="M24 6v8" /><path d="M14 42h20" /><path d="M18 42V24a6 6 0 0 1 12 0v18" /><path d="M24 18v6" /><circle cx="24" cy="14" r="3" /></Svg>)
const IcoChronic = (p: IcoProps) => (<Svg {...p}><circle cx="20" cy="13" r="5" /><path d="M12 40V26a4 4 0 0 1 4-4h8" /><path d="M30 22v8" /><path d="M30 30l6 4 4 8" /><path d="M34 16l6 6" /></Svg>)
const IcoTerminal = (p: IcoProps) => (<Svg {...p}><path d="M24 6c8 0 14 6 14 14s-6 14-14 14S10 29 10 20 16 6 24 6z" /><path d="M24 14v6l5 4" /><path d="M12 42h24" /></Svg>)
const IcoCheck = (p: IcoProps) => (<Svg {...p} viewBox="0 0 24 24"><path d="m5 13 5 5L20 7" strokeWidth="3" /></Svg>)
const IcoArrow = (p: IcoProps) => (<Svg {...p} viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></Svg>)
const IcoPlay = (p: IcoProps) => (<Svg {...p} viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" stroke="none" /></Svg>)
const IcoClock = (p: IcoProps) => (<Svg {...p}><circle cx="24" cy="24" r="16" /><path d="M24 14v10l7 4" /></Svg>)
const IcoVideo = (p: IcoProps) => (<Svg {...p}><rect x="6" y="11" width="26" height="26" rx="5" /><path d="m32 20 10-5v18l-10-5" /></Svg>)
const IcoDoc = (p: IcoProps) => (<Svg {...p}><path d="M13 7h15a3 3 0 0 1 3 3v28a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3z" /><path d="M17 19h14" /><path d="M17 27h14" /><path d="M17 35h8" /></Svg>)

/* ---------------- Feature illustrations ---------------- */
function ArtTerm() {
  return (
    <svg viewBox="0 0 320 220" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="at-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e9bd55" /><stop offset="1" stopColor="#a9884f" /></linearGradient>
      </defs>
      <circle cx="160" cy="112" r="86" fill="#c9a963" fillOpacity="0.12" />
      <path d="M160 44l56 21v44c0 37-24 63-56 79c-32-16-56-42-56-79V65z" fill="url(#at-g)" />
      <path d="m135 112 17 17 33-34" stroke="#0d2b42" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <g stroke="#0d2b42" strokeWidth="3" strokeLinecap="round">
        <path d="M62 176h24" /><path d="M62 188h40" /><path d="M234 176h24" /><path d="M218 188h40" />
      </g>
      <g fill="#0d2b42" fillOpacity="0.14">
        <circle cx="70" cy="60" r="5" /><circle cx="252" cy="52" r="4" /><circle cx="262" cy="150" r="5" />
      </g>
    </svg>
  )
}
function ArtIUL() {
  return (
    <svg viewBox="0 0 320 220" fill="none" aria-hidden="true">
      <path d="M24 190V110" stroke="#0d2b42" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.25" />
      <path d="M70 190V80" stroke="#0d2b42" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M116 190V126" stroke="#0d2b42" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.55" />
      <path d="M162 190V58" stroke="#0d2b42" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M208 190V94" stroke="#0d2b42" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.85" />
      <path d="M254 190V40" stroke="#c9a963" strokeWidth="8" strokeLinecap="round" />
      <path d="M20 96c26-34 52 22 78-12s52 14 78-10 52 10 78-14 30-2 30-2" stroke="#c9a963" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="288" cy="72" r="7" fill="#c9a963" />
      <circle cx="162" cy="58" r="6" fill="#fff" stroke="#c9a963" strokeWidth="3" />
    </svg>
  )
}
function ArtIncome() {
  return (
    <svg viewBox="0 0 320 220" fill="none" aria-hidden="true">
      <rect x="34" y="20" width="252" height="180" rx="16" fill="#fff" stroke="#0d2b42" strokeOpacity="0.16" strokeWidth="2" />
      <path d="M54 156h36v24H54z" fill="#c9a963" fillOpacity="0.4" />
      <path d="M104 132h36v48h-36z" fill="#c9a963" fillOpacity="0.6" />
      <path d="M154 108h36v72h-36z" fill="#c9a963" fillOpacity="0.8" />
      <path d="M204 82h36v98h-36z" fill="#c9a963" />
      <path d="M48 108l42-24 38 18 44-26 46 20" stroke="#0d2b42" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M224 74l14-16 10 22" stroke="#0d2b42" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="108" r="6" fill="#0d2b42" />
    </svg>
  )
}

/* ---------------- Content ---------------- */
const STATS = [
  { to: 4500, suffix: "+", label: "Families & professionals served" },
  { to: 1000, suffix: "+", label: "Advisors developed & mentored" },
  { to: 50, suffix: "", label: "U.S. states licensed to serve" },
  { to: 2, suffix: "", label: "Countries — United States & Canada" },
]

const MARQUEE = [
  "Term life with living benefits", "Indexed universal life", "Final expense coverage",
  "Financial Needs Analysis", "DIME method", "A-rated carriers", "No-exam options",
  "Coverage reviews", "Free-look period", "Independent advice",
]

const WHO_I_HELP = [
  { ico: IcoFamily, title: "Families building a future", body: "You came here to give your family more. Let's make sure their future never depends on nothing going wrong." },
  { ico: IcoGlobe, title: "Those supporting family back home", body: "If parents or siblings rely on what you send, a plan can keep that support going even if something happens to you." },
  { ico: IcoHome, title: "Homeowners & first-time buyers", body: "You worked hard for that home. Make sure the mortgage never becomes your family's burden." },
  { ico: IcoCap, title: "Parents planning education", body: "Protect your children's education and future, and leave them a legacy to build on." },
  { ico: IcoBriefcase, title: "Professionals & business owners", body: "Your income keeps everything running. Protect it if a serious illness ever forces you to stop working." },
  { ico: IcoCompass, title: "New to the U.S. or Canada", body: "Insurance works differently here. I'll explain it in plain language, with no judgment and no pressure." },
]

const FEATURES = [
  {
    tag: "Core cover", ico: IcoShield, art: <ArtTerm />,
    title: "Term life insurance with living benefits",
    body: "Affordable coverage for 10-30 years that protects your family, and can also give you access to part of your benefit if you face a qualifying critical, chronic or terminal illness.",
    list: ["Death benefit for your family", "Accelerated riders for qualifying illness", "Level premiums you can plan around"],
  },
  {
    tag: "Long-term value", ico: IcoIUL, art: <ArtIUL />,
    title: "Indexed universal life (IUL)",
    body: "Permanent coverage that can build cash value over time, for people thinking long term and want flexibility as their life changes.",
    list: ["Permanent protection, not a countdown", "Cash value that can grow with the market", "Flexible premiums and death benefit"],
  },
  {
    tag: "Dignity at the end", ico: IcoFinal, art: <ArtIncome />,
    title: "Final expense coverage",
    body: "Smaller policies designed to help cover funeral and end-of-life costs so loved ones aren't left with the bill at the worst possible moment.",
    list: ["Typically easier to qualify for", "Clears funeral and immediate costs", "Protects the family's savings"],
  },
]

const EXTRA_SERVICES = [
  { ico: IcoAnalysis, title: "Financial Needs Analysis", body: "A free, personalized look at exactly how much protection your family needs - never too much, never too little." },
  { ico: IcoReview, title: "Coverage reviews", body: "Already have a policy, or coverage through work? I'll review it and show you any gaps, in plain English." },
  { ico: IcoIncome, title: "Income & investment protection", body: "Retirement and investment income strategies from KSEFinServe, coordinated with your protection plan." },
]

const HOW_I_HELP = [
  { title: "I educate, not sell", body: "I explain your options in plain English so you can make a confident decision." },
  { title: "I tailor it to you", body: "Your Financial Needs Analysis shapes every recommendation. No cookie-cutter plans." },
  { title: "I shop multiple carriers", body: "As an independent registered representative, I compare companies to find the right fit for your health and budget." },
  { title: "I stay with you", body: "New baby, new home, new job? I'll review your coverage as your life changes." },
]

const BENEFITS = [
  { ico: IcoCritical, title: "Critical illness", body: "A qualifying diagnosis - such as a heart attack, stroke or invasive cancer - may let you accelerate part of your death benefit.", foot: "Covers costs insurance won't" },
  { ico: IcoChronic, title: "Chronic illness", body: "If you become unable to perform basic daily activities (like bathing or dressing) long-term, benefits may help pay for care.", foot: "Help with long-term care costs" },
  { ico: IcoTerminal, title: "Terminal illness", body: "With a qualifying terminal diagnosis, you may access a portion of your benefit to spend meaningful time with family and settle affairs.", foot: "Peace of mind when it matters most" },
]

const STEPS = [
  { title: "Answer a few questions", body: "Tell me who you want to protect and roughly how much coverage you need. It takes about a minute." },
  { title: "Your Financial Needs Analysis", body: "We talk one-on-one, figure out exactly how much protection your family needs, and I compare carriers to fit your budget. No pressure." },
  { title: "Apply & get protected", body: "Pick the plan you like. Many applicants can qualify with no medical exam, and some get a decision quickly." },
]

const FAQS = [
  { q: "What is term life insurance with living benefits?", a: "It's a term life policy - coverage for a set period like 10, 20 or 30 years - that includes accelerated benefit riders. Those riders can let you access part of your death benefit early if you're diagnosed with a qualifying critical, chronic or terminal illness." },
  { q: "Do living benefits cost extra?", a: "On many policies the accelerated benefit riders are included at no additional premium. Some carriers may charge a fee or reduce the payout when the benefit is used. I'll show you exactly how it works for each option." },
  { q: "Will I need a medical exam?", a: "Not always. Many carriers offer no-exam options based on your health history and age. Whether you qualify depends on underwriting." },
  { q: "How much coverage do I need?", a: "A common starting point is enough to replace several years of income plus pay off your mortgage and major debts. We'll help you find a number that fits your family and your budget." },
  { q: "Am I obligated to buy anything?", a: "No. Your quote and consultation are completely free, and you're never under any obligation to purchase." },
  { q: "Can I get coverage if I'm not a U.S. citizen?", a: "Often, yes. Many carriers offer coverage to permanent residents (green card holders), and some will consider certain visa holders. Eligibility depends on the carrier, your immigration status and how long you've lived in the U.S. I'll check which options are open to you before you apply." },
  { q: "Can I name family back home as my beneficiaries?", a: "In most cases you can name loved ones who live outside the U.S. Each carrier has its own rules and paperwork for this, and I'll walk you through them." },
  { q: "Which states do you serve?", a: "KSEFinServe is licensed across the United States and Canada, so wherever you live I can help. Product availability can still vary by carrier and state or province, and I'll confirm your options when we talk." },
]

const QUESTIONS = [
  { key: "coverage", label: "How much coverage are you looking for?", options: ["$100k - $250k", "$250k - $500k", "$500k - $1M", "$1M+"] },
  { key: "exam", label: "Would you like options with no medical exam?", options: ["Yes, prefer no-exam", "Open to either", "No, happy to do a medical exam"] },
  { key: "health", label: "How would you describe your health today?", options: ["Excellent", "Good", "Fair", "I'd rather discuss it"] },
  { key: "term", label: "What coverage length suits you best?", options: ["10 - 20 years", "20 - 30 years", "Lifetime coverage"] },
]
const COUNTRIES = ["United States", "Canada", "Nigeria", "United Kingdom", "Other"]

/* ---------------- Reveal hook ---------------- */
function useScrollReveal() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".insurance-page")
    const els = Array.from(document.querySelectorAll<HTMLElement>(".insurance-page [data-reveal]"))
    if (!els.length) return
    root?.classList.add("js-anim")
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"))
      return
    }
    const show = (el: HTMLElement) => el.classList.add("is-visible")
    let io: IntersectionObserver | null = null
    try {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { show(e.target as HTMLElement); io?.unobserve(e.target) } }),
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
      )
      els.forEach((el) => io!.observe(el))
    } catch { els.forEach(show) }

    const revealInView = () => {
      const vh = window.innerHeight
      els.forEach((el) => {
        if (el.classList.contains("is-visible")) return
        const r = el.getBoundingClientRect()
        if (r.top < vh * 0.92 && r.bottom > 0) show(el)
      })
    }
    let ticking = false
    const onScroll = () => {
      revealInView()
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => { revealInView(); ticking = false })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    revealInView()
    return () => {
      io?.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
}

/* ---------------- Animated counter ---------------- */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let started = false
    let raf = 0
    const run = () => {
      if (started) return
      started = true
      const start = performance.now()
      const dur = 1700
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur)
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    let io: IntersectionObserver | null = null
    try {
      io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(); io?.disconnect() } }), { threshold: 0.35 })
      io.observe(el)
    } catch { run() }
    const fallback = window.setTimeout(run, 900)
    return () => { io?.disconnect(); window.clearTimeout(fallback); cancelAnimationFrame(raf) }
  }, [to])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

/* ---------------- Form state ---------------- */
interface Details {
  firstName: string; lastName: string; email: string; phone: string
  city: string; province: string; country: string; contact: string
  availableDate: string; availableTime: string
  consentContact: boolean
}
const EMPTY_DETAILS: Details = {
  firstName: "", lastName: "", email: "", phone: "", city: "", province: "",
  country: "United States", contact: "Email",
  availableDate: "", availableTime: "", consentContact: true,
}

const stagger = (i: number) => ({ ["--i" as string]: i }) as CSSProperties


/* ---------------- Availability slot picker (same source as /book-now) ---------------- */
type Slot = { label: string; value: string; start: string; end: string }

/**
 * Timezone abbreviations that are correct for the visitor and for the season.
 *
 * `Intl`'s short name is only trustworthy for a handful of zones (Chrome gives
 * "GMT+1" for Lagos, "GMT+1" for Paris, "GMT+11" for Sydney, ...), so the
 * abbreviation is worked out from the zone's real UTC offset at that moment:
 * standard offset -> standard abbreviation, anything else -> DST abbreviation.
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

/** Offset of `tz` from UTC at `at`, in minutes. */
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

/** e.g. 60 -> "UTC+1", -330 -> "UTC-5:30" */
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
  // Unknown zone: take a real Intl abbreviation if there is one, else the offset.
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

function InsSlotPicker({
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
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const userTz = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/Chicago"

  // Same endpoint and conversion the booking short form uses, so the stored
  // value lands in the admin console and calendar exactly as a normal booking.
  useEffect(() => {
    if (!date) { setSlots([]); setOpen(false); return }
    let cancelled = false
    setLoading(true); setError(null); setOpen(false)
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
      .catch((e: unknown) => { if (!cancelled) { setError(e instanceof Error ? e.message : "Could not load availability"); setSlots([]) } })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  const selected = slots.find((s) => s.value === time)

  return (
    <div className="ins-slot">
      <p className="ins-slot-label">Pick a time for your 1:1 call</p>
      <div className="ins-row-2">
        <div className="ins-field">
          <label htmlFor="ins-date">Preferred date</label>
          <input id="ins-date" type="date" required min={todayInTz(userTz)} value={date}
            onChange={(e) => { onDate(e.target.value); onTime("") }} />
        </div>
        <div className="ins-field">
          <label htmlFor="ins-time">Preferred time</label>
          <div className="ins-slot-field">
            {loading && <span className="ins-slot-hint">Loading…</span>}
            {!loading && !date && <span className="ins-slot-hint">Pick a date first</span>}
            {!loading && date && slots.length === 0 && <span className="ins-slot-hint">No slots — try another date</span>}
            {!loading && date && slots.length > 0 && (
              <div className="ins-select">
                <button type="button" ref={triggerRef} className={`ins-select-trigger${time ? " has-value" : ""}`}
                  onClick={() => setOpen((v) => !v)} aria-haspopup="listbox" aria-expanded={open} aria-label="Select time">
                  <span className="ins-select-value">{time ? selected?.label || time : "Select a time"}</span>
                  <span className="ins-select-chevron">▾</span>
                </button>
                {open && (
                  <div ref={menuRef} className="ins-select-menu" role="listbox" aria-label="Available time slots">
                    {slots.map((slot) => (
                      <button type="button" key={slot.value} role="option" aria-selected={time === slot.value}
                        className={`ins-select-option${time === slot.value ? " selected" : ""}`}
                        onClick={() => { onTime(slot.value); setOpen(false) }}>
                        {slot.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <small className="ins-slot-tz">Time zone: {tzAbbrev(userTz)} ({offsetLabel(tzOffsetMinutes(userTz, new Date()))})</small>
          </div>
        </div>
      </div>
      {error && <p className="ins-error">{error}</p>}
      <small className="ins-slot-note">Pick a slot that suits you. We'll confirm the exact time when we get in touch.</small>
    </div>
  )
}

export default function InsurancePage() {
  useScrollReveal()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const { submitBooking } = useBookings()
  const [showSticky, setShowSticky] = useState(false)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleVideo = useCallback(() => {
    if (!playing) {
      setPlaying(true)
      window.setTimeout(() => { void videoRef.current?.play().catch(() => {}) }, 30)
    } else {
      videoRef.current?.pause()
      setPlaying(false)
    }
  }, [playing])

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 520)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const totalSteps = QUESTIONS.length + 1
  const isContactStep = step === QUESTIONS.length

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const pick = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    window.setTimeout(() => setStep((s) => Math.min(s + 1, QUESTIONS.length)), 240)
  }

  const send = async () => {
    setSubmitting(true)
    setSubmitError(null)
    const answered = QUESTIONS.map((q) => `${q.label.replace(/\?$/, "")}: ${answers[q.key] ?? "-"}`).join("  |  ")
    const payload: BookingInput = {
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      phone: details.phone,
      city: details.city,
      province: details.province,
      country: details.country,
      contactMethod: details.contact,
      source: "Wealth protection page (insurance)",
      route: "Wealth protection",
      path: "Insurance enquiry",
      topic: `Family Protection Report - ${answers.coverage ?? "coverage enquiry"}`,
      priorities: QUESTIONS.map((q) => `${q.label.replace(/\?$/, "")}: ${answers[q.key] ?? "-"}`),
      outcome: "Attend a free 1:1 call and receive their Family Protection Report",
      context: answered,
      question: answers.term ? `Coverage length: ${answers.term}` : "",
      availableDate: details.availableDate,
      availableTime: details.availableTime,
      consentContact: details.consentContact,
      consentUpdates: details.consentContact,
      userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
    const result = await submitBooking(payload)
    setSubmitting(false)
    if (result.error) { setSubmitError(result.error); return }
    setReference(result.reference ?? null)
  }

  const restart = () => {
    setStep(0); setAnswers({}); setDetails(EMPTY_DETAILS); setReference(null); setSubmitError(null)
  }

  return (
    <div className="insurance-page">
      {/* ============ HERO ============ */}
      <section className="ins-hero">
        <div className="ins-aurora a" />
        <div className="ins-aurora b" />
        <div className="ins-container ins-hero-grid">
          <div className="ins-hero-copy">
            <p className="ins-hero-eyebrow">KSEFinServe Wealth Protection</p>
            <h1 className="ins-hero-title">Protect the people who <span className="grad">depend on you.</span></h1>
            <p className="ins-hero-lead">
              Get a free <strong>Family Protection Report</strong>, built with you on one 1:1 call. You'll come away
              knowing exactly how much cover your family needs, what it should cost, and which A-rated carriers fit
              your budget.
            </p>
            <ul className="ins-hero-checks">
              <li><IcoCheck size={16} /> Your coverage number</li>
              <li><IcoCheck size={16} /> Side-by-side quotes</li>
              <li><IcoCheck size={16} /> Your rate-lock date</li>
            </ul>
            <div className="ins-hero-actions">
              <button type="button" className="ins-btn ins-btn-gold" onClick={scrollToForm}>
                Get My Free Report <IcoArrow size={18} />
              </button>
              <button type="button" className="ins-btn ins-btn-ghost-light" onClick={toggleVideo}>
                <IcoPlay size={16} /> Watch · 1 minute
              </button>
            </div>
            <p className="ins-hero-note">Free · No obligation · You keep the report either way</p>
          </div>

          <div className="ins-hero-visual">
            <div className={`ins-video-card${playing ? " is-playing" : ""}`}>
              <img className="ins-video-poster" src={POSTER} alt="Kayode Samson Elepe, RR - Founder of KSEFinServe" />
              <video ref={videoRef} className="ins-video-el" src={`${ASSETS}/kayode-story.mp4`} poster={POSTER}
                controls={playing} preload="metadata" onEnded={() => setPlaying(false)} />
              <button type="button" className="ins-video-play" onClick={toggleVideo}
                aria-label={playing ? "Close video" : "Play Kayode's story"}>
                <span className="ins-video-play-circle"><IcoPlay size={26} /></span>
                <span className="ins-video-play-label">Watch · 1 minute</span>
              </button>
            </div>
            <p className="ins-video-caption"><strong>Kayode Samson Elepe, RR</strong> · Founder, KSEFinServe</p>
          </div>
        </div>

        <div className="ins-stats">
          <div className="ins-container ins-stats-grid">
            {STATS.map((s, i) => (
              <div className="ins-stat" key={s.label} data-reveal style={stagger(i)}>
                <b><Counter to={s.to} suffix={s.suffix} /></b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="ins-marquee" aria-hidden="true">
        <div className="ins-marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy}>
              {MARQUEE.map((m) => (<span key={m}>{m} <i>✦</i></span>))}
            </span>
          ))}
        </div>
      </div>

      {/* ============ WHO I HELP ============ */}
      <section className="ins-section" id="ins-who">
        <div className="ins-container">
          <div className="ins-section-head center" data-reveal>
            <p className="ins-eyebrow">Who I help</p>
            <h2 className="ins-section-title">I help families protect what they've <span className="grad">worked so hard to build</span></h2>
            <p className="ins-section-sub">
              You left home, started over and built a life. I help make sure a serious illness or the unexpected
              never undoes that - for your family here and the loved ones who count on you back home.
            </p>
          </div>
          <div className="ins-grid ins-grid-3">
            {WHO_I_HELP.map((item, i) => (
              <article className="ins-card" key={item.title} data-reveal style={stagger(i)}>
                <div className="ins-card-index">{String(i + 1).padStart(2, "0")}</div>
                <span className="ins-card-ico"><item.ico size={24} /></span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <p className="ins-section-sub ins-center">
            Not from the African community? You're welcome here too.{" "}
            <strong>If anyone would struggle financially without you, we should talk.</strong>
          </p>
        </div>
      </section>

      {/* ============ WHAT I DO ============ */}
      <section className="ins-section ins-section-tint" id="ins-services">
        <div className="ins-container">
          <div className="ins-section-head center" data-reveal>
            <p className="ins-eyebrow">What I do</p>
            <h2 className="ins-section-title">Protection that fits your life <span className="grad">and your budget</span></h2>
            <p className="ins-section-sub">My specialty - three ways to protect what matters, plus the analysis that ties them together.</p>
          </div>

          {FEATURES.map((f, i) => (
            <div className={`ins-feature${i % 2 === 1 ? " flip" : ""}`} key={f.title} data-reveal>
              <div className="ins-feature-art">{f.art}</div>
              <div className="ins-feature-body">
                <span className="ins-tag">{f.tag}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                <ul className="ins-feature-list">
                  {f.list.map((li) => (<li key={li}><IcoCheck size={16} />{li}</li>))}
                </ul>
              </div>
            </div>
          ))}

          <div className="ins-grid ins-grid-3" style={{ marginTop: 22 }}>
            {EXTRA_SERVICES.map((item, i) => (
              <article className="ins-card" key={item.title} data-reveal style={stagger(i)}>
                <span className="ins-card-ico"><item.ico size={24} /></span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW I HELP ============ */}
      <section className="ins-section ins-section-navy">
        <div className="ins-aurora a" style={{ opacity: 0.25 }} />
        <div className="ins-container">
          <div className="ins-section-head" data-reveal>
            <p className="ins-eyebrow">How I help</p>
            <h2 className="ins-section-title">I make it simple, personal <span className="grad">and pressure-free</span></h2>
          </div>
          <div className="ins-steps">
            {HOW_I_HELP.map((item, i) => (
              <div className="ins-step" key={item.title} data-reveal style={stagger(i)}>
                <div className="ins-step-no">{i + 1}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36 }}>
            <button type="button" className="ins-btn ins-btn-gold" onClick={scrollToForm}>Book a 1:1 call <IcoArrow size={18} /></button>
          </div>
        </div>
      </section>

      {/* ============ WHY LIVING BENEFITS ============ */}
      <section className="ins-section">
        <div className="ins-container">
          <div className="ins-section-head center" data-reveal>
            <p className="ins-eyebrow">Why living benefits matter</p>
            <h2 className="ins-section-title">Not all term policies <span className="grad">are built the same</span></h2>
            <p className="ins-section-sub">
              A heart attack, cancer diagnosis or stroke can stop your paycheck long before it threatens your life.
              The right policy is designed for both.
            </p>
          </div>
          <div className="ins-compare">
            <div className="ins-compare-card" data-reveal>
              <span className="ins-pill">Basic term life</span>
              <h3>The old way</h3>
              <ul>
                <li>Pays your beneficiaries only after you pass away.</li>
                <li>No help if you get seriously sick and can't work.</li>
                <li>Medical bills and lost income can drain your savings.</li>
              </ul>
            </div>
            <div className="ins-compare-card good" data-reveal style={stagger(1)}>
              <span className="ins-pill">Term life + living benefits</span>
              <h3>The better way</h3>
              <ul>
                <li>Still pays a death benefit to protect your family.</li>
                <li>Can let you access part of your coverage early for a qualifying illness.</li>
                <li>Use the money how you need it - bills, treatment, mortgage, time off.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LIVING BENEFITS ============ */}
      <section className="ins-section ins-section-tint">
        <div className="ins-container">
          <div className="ins-section-head center" data-reveal>
            <p className="ins-eyebrow">What living benefits can cover</p>
            <h2 className="ins-section-title">Three ways your policy can work for you <span className="grad">while you're alive</span></h2>
          </div>
          <div className="ins-grid ins-grid-3">
            {BENEFITS.map((item, i) => (
              <article className="ins-card" key={item.title} data-reveal style={stagger(i)}>
                <div className="ins-card-index">{String(i + 1).padStart(2, "0")}</div>
                <span className="ins-card-ico"><item.ico size={24} /></span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <p className="ins-card-foot">{item.foot}</p>
              </article>
            ))}
          </div>
          <p className="ins-section-sub" style={{ marginTop: 28, fontSize: 13.5 }}>
            Living benefits are provided through accelerated benefit riders. Availability, qualifying conditions and
            amounts vary by carrier, product and state, and any amount accelerated reduces the death benefit.
          </p>
        </div>
      </section>

      {/* ============ APPROACH ============ */}
      <section className="ins-section">
        <div className="ins-container ins-approach">
          <figure className="ins-photo-card" data-reveal>
            <img src={POSTER} alt="Kayode Samson Elepe with a planning notebook" loading="lazy" />
            <figcaption>
              <b>Kayode Samson Elepe, RR</b>
              <span>Registered Representative · Financial Services</span>
            </figcaption>
          </figure>
          <div>
            <p className="ins-eyebrow">My approach</p>
            <h2 className="ins-section-title">How I find the solution that <span className="grad">actually fits you</span></h2>
            <p className="ins-section-sub">
              Before I recommend anything, we do a <strong>Financial Needs Analysis</strong> together. It's a simple,
              judgment-free look at your family's finances that shows how much protection you really need and what fits
              your budget, so you never buy too much or too little.
            </p>
            <ol>
              <li data-reveal>
                <div>
                  <h3>We get to know your story</h3>
                  <p>Who depends on you, your income, your goals, any coverage you already have through work, and what keeps you up at night.</p>
                </div>
              </li>
              <li data-reveal>
                <div>
                  <h3>We calculate your real need</h3>
                  <p>I use the DIME method to put a real number on what your family would need if something happened to you:</p>
                  <div className="ins-dime">
                    <div><b>D</b><span>Debts</span></div>
                    <div><b>I</b><span>Income to replace</span></div>
                    <div><b>M</b><span>Mortgage</span></div>
                    <div><b>E</b><span>Education</span></div>
                  </div>
                </div>
              </li>
              <li data-reveal>
                <div>
                  <h3>We match it to your budget</h3>
                  <p>I compare carriers, term lengths and living benefit riders side by side and find the strongest protection for a premium you're comfortable with.</p>
                </div>
              </li>
              <li data-reveal>
                <div>
                  <h3>You get a clear, written plan</h3>
                  <p>Plain-English recommendations and the reasons behind them. You decide, with no pressure. Then I check in as your life changes.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ============ MEET ============ */}
      <section className="ins-section ins-section-tint">
        <div className="ins-container ins-meet">
          <figure className="ins-photo-card" data-reveal>
            <img src={POSTER} alt="Kayode Samson Elepe, RR - Founder, KSEFinServe" loading="lazy" />
            <figcaption>
              <b>Kayode Samson Elepe, RR</b>
              <span>Founder, KSEFinServe</span>
            </figcaption>
          </figure>
          <div>
            <p className="ins-eyebrow">Meet your advisor</p>
            <h2 className="ins-section-title">A real person who'll <span className="grad">walk this road with you</span></h2>
            <p className="ins-section-sub" style={{ marginTop: 18 }}>
              Hi, I am <strong>Kayode Samson Elepe, RR</strong>. I started KSEFinServe because I saw too many families
              find out the hard way that a serious illness can hurt just as much as a loss - the bills pile up, the
              paycheck stops, and the savings disappear.
            </p>
            <p className="ins-section-sub" style={{ marginTop: 14 }}>
              I'm an independent registered representative, which means I don't work for one insurance company. I work
              for <em>you</em>. I compare options across carriers, explain everything in plain English, and only
              recommend what truly fits your family and your budget.
            </p>
            <p className="ins-section-sub" style={{ marginTop: 14 }}>
              My background is engineering and data - Shell, ExxonMobil, Imperial Oil and the Canada Mortgage and
              Housing Corporation - and I've spent years developing advisors and serving over 4,500 families and
              professionals. For you, that means a careful, research-minded look at your numbers and a practical plan
              you can actually afford, without the jargon.
            </p>
            <blockquote data-reveal>
              If you've been putting this off because it feels confusing or salesy - I understand. Let's just talk. No pressure, ever.
            </blockquote>
            <p className="ins-meet-name">Kayode Samson Elepe, RR</p>
            <p className="ins-meet-role">Founder &amp; Registered Representative, KSEFinServe</p>
            <div className="ins-cred">
              <span><IcoCheck size={14} /> Registered Representative</span>
              <span><IcoCheck size={14} /> Licensed across the U.S.</span>
              <span><IcoCheck size={14} /> Serving Canada</span>
              <span><IcoCheck size={14} /> Independent advice</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BOOK ============ */}
      <section className="ins-section" id="ins-book" ref={formRef}>
        <div className="ins-container ins-book">
          <div>
            <p className="ins-eyebrow">Book a 1:1 call</p>
            <h2 className="ins-section-title">Your free <span className="grad">Family Protection Report</span></h2>
            <p className="ins-section-sub">
              Get your number, your quotes and your rate-lock date. Answer four quick questions, then pick a time.
              On a relaxed, one-on-one call we'll build your Family Protection Report together. It's free, with no
              obligation, and you keep the report either way.
            </p>
            <ul className="ins-book-points">
              <li>
                <span className="ins-ico"><IcoClock size={22} /></span>
                <div><strong>About 30 minutes</strong><span>Enough time for real answers, short enough for a lunch break.</span></div>
              </li>
              <li>
                <span className="ins-ico"><IcoVideo size={22} /></span>
                <div><strong>By video call, from anywhere</strong><span>Join from your phone or computer. The link arrives as soon as you book.</span></div>
              </li>
              <li>
                <span className="ins-ico"><IcoDoc size={22} /></span>
                <div><strong>Walk away with your report</strong><span>Your coverage number, side-by-side quotes, your rate-lock date, and how living benefits work for you.</span></div>
              </li>
            </ul>
          </div>

          <div className="ins-quote">
            {reference ? (
              <div className="ins-success">
                <span className="ins-success-ico"><IcoCheck size={26} /></span>
                <h3>Thank you - you're booked in.</h3>
                <p>
                  Your reference is <strong>{reference}</strong>. A confirmation email is on its way to {details.email}.
                  I'll come prepared and we'll build your Family Protection Report together.
                </p>
                <div className="ins-nav-row">
                  <button type="button" className="ins-btn ins-btn-outline" onClick={restart}>Start again</button>
                </div>
              </div>
            ) : (
              <>
                <h3>Get my free report</h3>
                <p>Answer {QUESTIONS.length} quick questions, then pick a time for your 1:1 call. Free, no obligation.</p>
                <div className="ins-progress" aria-hidden="true">
                  {Array.from({ length: totalSteps }).map((_, i) => (<i key={i} className={i <= step ? "active" : ""} />))}
                </div>

                {!isContactStep ? (
                  <>
                    <p className="ins-q-label">{QUESTIONS[step].label}</p>
                    <div className="ins-choices">
                      {QUESTIONS[step].options.map((opt) => (
                        <label key={opt} className={`ins-choice${answers[QUESTIONS[step].key] === opt ? " selected" : ""}`}>
                          <input type="radio" name={QUESTIONS[step].key} value={opt}
                            checked={answers[QUESTIONS[step].key] === opt}
                            onChange={() => pick(QUESTIONS[step].key, opt)} />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    <div className="ins-nav-row">
                      <button type="button" className="ins-btn ins-btn-outline" onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={step === 0}>Back</button>
                      <button type="button" className="ins-btn ins-btn-navy"
                        onClick={() => setStep((s) => Math.min(s + 1, QUESTIONS.length))}
                        disabled={!answers[QUESTIONS[step].key]}>Continue <IcoArrow size={18} /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ins-row-2">
                      <div className="ins-field">
                        <label htmlFor="ins-first">First name</label>
                        <input id="ins-first" value={details.firstName} onChange={(e) => setDetails({ ...details, firstName: e.target.value })} autoComplete="given-name" />
                      </div>
                      <div className="ins-field">
                        <label htmlFor="ins-last">Last name</label>
                        <input id="ins-last" value={details.lastName} onChange={(e) => setDetails({ ...details, lastName: e.target.value })} autoComplete="family-name" />
                      </div>
                    </div>
                    <div className="ins-field">
                      <label htmlFor="ins-email">Email</label>
                      <input id="ins-email" type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} autoComplete="email" />
                    </div>
                    <div className="ins-field">
                      <label htmlFor="ins-phone">Phone</label>
                      <input id="ins-phone" type="tel" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} autoComplete="tel" />
                    </div>
                    <div className="ins-row-2">
                      <div className="ins-field">
                        <label htmlFor="ins-city">City</label>
                        <input id="ins-city" value={details.city} onChange={(e) => setDetails({ ...details, city: e.target.value })} autoComplete="address-level2" />
                      </div>
                      <div className="ins-field">
                        <label htmlFor="ins-province">State / Province</label>
                        <input id="ins-province" value={details.province} onChange={(e) => setDetails({ ...details, province: e.target.value })} autoComplete="address-level1" />
                      </div>
                    </div>
                    <div className="ins-row-2">
                      <div className="ins-field">
                        <label htmlFor="ins-country">Country</label>
                        <select id="ins-country" value={details.country} onChange={(e) => setDetails({ ...details, country: e.target.value })}>
                          {COUNTRIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                        </select>
                      </div>
                      <div className="ins-field">
                        <label htmlFor="ins-contact">Preferred contact</label>
                        <select id="ins-contact" value={details.contact} onChange={(e) => setDetails({ ...details, contact: e.target.value })}>
                          <option>Email</option><option>Phone</option><option>WhatsApp</option>
                        </select>
                      </div>
                    </div>
                    <InsSlotPicker
                      date={details.availableDate}
                      time={details.availableTime}
                      onDate={(v) => setDetails((d) => ({ ...d, availableDate: v }))}
                      onTime={(v) => setDetails((d) => ({ ...d, availableTime: v }))}
                    />

                    <label className="ins-consent">
                      <input type="checkbox" checked={details.consentContact}
                        onChange={(e) => setDetails({ ...details, consentContact: e.target.checked })} />
                      <span>I agree to be contacted by KSEFinServe about my enquiry and the Family Protection Report.</span>
                    </label>
                    {submitError && <p className="ins-error">{submitError}</p>}
                    <div className="ins-nav-row">
                      <button type="button" className="ins-btn ins-btn-outline" onClick={() => setStep(QUESTIONS.length - 1)}>Back</button>
                      <button type="button" className="ins-btn ins-btn-gold" onClick={() => void send()}
                        disabled={submitting || !details.firstName.trim() || !details.email.trim() || !details.phone.trim() || !details.availableDate || !details.availableTime || !details.consentContact}>
                        {submitting ? "Sending..." : "Request my free report"}
                      </button>
                    </div>
                    <p className="ins-form-status">Prefer email? Write to <a href="mailto:info@ksefinserve.com">info@ksefinserve.com</a></p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="ins-section ins-section-tint">
        <div className="ins-container">
          <div className="ins-section-head center" data-reveal>
            <p className="ins-eyebrow">How it works</p>
            <h2 className="ins-section-title">Covered in <span className="grad">three simple steps</span></h2>
          </div>
          <div className="ins-grid ins-grid-3">
            {STEPS.map((s, i) => (
              <article className="ins-card" key={s.title} data-reveal style={stagger(i)}>
                <div className="ins-card-index">{String(i + 1).padStart(2, "0")}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="ins-section">
        <div className="ins-container ins-faq">
          <div data-reveal>
            <p className="ins-eyebrow">Questions</p>
            <h2 className="ins-section-title">Frequently asked questions</h2>
            <p className="ins-section-sub">
              Anything else? Email <a href="mailto:info@ksefinserve.com"><strong>info@ksefinserve.com</strong></a> and I'll answer it directly.
            </p>
          </div>
          <div>
            {FAQS.map((f, i) => (
              <details className="ins-faq-item" key={f.q} data-reveal style={stagger(i)}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL ============ */}
      <section className="ins-final">
        <div className="ins-container">
          <img src={POSTER} alt="Kayode Samson Elepe, RR" data-reveal />
          <h2 data-reveal style={stagger(1)}>Let's protect the people you love, <span className="grad">together.</span></h2>
          <p data-reveal style={stagger(2)}>
            Rates are based on your age and health today, so the best time to look is now. Tell me a little about your
            family and I'll personally reach out with your options.
          </p>
          <div data-reveal style={stagger(3)}>
            <button type="button" className="ins-btn ins-btn-gold" onClick={scrollToForm}>
              Get my free report <IcoArrow size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ============ STICKY ============ */}
      <div className={`ins-sticky${showSticky ? " is-visible" : ""}`}>
        <button type="button" className="ins-btn ins-btn-gold" onClick={scrollToForm}>Get My Free Report</button>
      </div>
    </div>
  )
}
