import {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactNode,
} from "react"
import "./contact.css"
import ContactPage from "./ContactPage"
import SiteLayout from "./SiteLayout"

const assetPathPrefix = "/assets"
const artwork = {
  logo: `${assetPathPrefix}/logo-ksefin.webp`,
  footerLogo: `${assetPathPrefix}/14b9a.webp`,
  portrait: `${assetPathPrefix}/eab0f.webp`,
  story: `${assetPathPrefix}/profile pix-5.jpg`,
  macPhini: `${assetPathPrefix}/83ae0.webp`,
  cifp: `${assetPathPrefix}/1cf6f.webp`,
  rrc: `${assetPathPrefix}/8b8a5.webp`,
  million: `${assetPathPrefix}/a1806.webp`,
  clarity: `${assetPathPrefix}/clarity-logo.png`,
  forest: `${assetPathPrefix}/bee26.webp`,
  wave: `${assetPathPrefix}/acbaa.webp`,
  land: `${assetPathPrefix}/22153.webp`,
  testimonialBg: `${assetPathPrefix}/testimonial-bg.webp`,
  anna: `${assetPathPrefix}/994e3.webp`,
  roopam: `${assetPathPrefix}/de2e6.webp`,
  jared: `${assetPathPrefix}/34b30.webp`,
  wealth: `${assetPathPrefix}/99851.webp`,
  advisors: `${assetPathPrefix}/ee9ac.webp`,
  building: `${assetPathPrefix}/3ec07.webp`,
  wealthCard: `${assetPathPrefix}/wealthCard.webp`,
  guideCard: `${assetPathPrefix}/guideCard.webp`,
  careerCard: `${assetPathPrefix}/careerCard.webp`,
  nextChapter: `${assetPathPrefix}/fb1d4.webp`,
  conversation: `${assetPathPrefix}/0f1eb.webp`,
  chevron: `${assetPathPrefix}/32174.svg`,
  halo: `${assetPathPrefix}/d59b6.svg`,
  ring: `${assetPathPrefix}/b0288.svg`,
  dotsTop: `${assetPathPrefix}/28371.svg`,
  dotsBottom: `${assetPathPrefix}/9d509.svg`,
  chart: `${assetPathPrefix}/43a3c.svg`,
  orbit: `${assetPathPrefix}/06395.svg`,
  play: `${assetPathPrefix}/04910.svg`,
  glow: `${assetPathPrefix}/9bd82.svg`,
  trustedDot: `${assetPathPrefix}/835a8.svg`,
  quote: `${assetPathPrefix}/24704.svg`,
  quoteMask: `${assetPathPrefix}/3e8df.svg`,
  insightFrame: `${assetPathPrefix}/6d158.svg`,
  arch: `${assetPathPrefix}/a02ed.svg`,
  shieldMask: `${assetPathPrefix}/1a426.svg`,
  shield: `${assetPathPrefix}/4678f.svg`,
  lineLeft: `${assetPathPrefix}/c0ae9.svg`,
  lineRight: `${assetPathPrefix}/3f107.svg`,
  seal: `${assetPathPrefix}/f2877.svg`,
  arrow: `${assetPathPrefix}/cee92.svg`,
  underline: `${assetPathPrefix}/bd43b.svg`,
  upArrow: `${assetPathPrefix}/05bd5.svg`,
  chapterGlow: `${assetPathPrefix}/57665.svg`,
  chapterGlowBottom: `${assetPathPrefix}/828e2.svg`,
  conversationGlow: `${assetPathPrefix}/b75ae.svg`,
  conversationPlay: `${assetPathPrefix}/5eea3.svg`,
  linkedin: `${assetPathPrefix}/d6da3.svg`,
  linkedinMask: `${assetPathPrefix}/90239.svg`,
}

// No component library is installed; these small native primitives share the page's tokens.
function Button({
  variant = "navy",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "navy" | "gold" | "white" | "text"
}) {
  return createElement("button", {
    type: "button",
    ...props,
    className: `button button-${variant} ${className}`,
  })
}
function Link(props: ComponentProps<"a">) {
  return createElement("a", props)
}
function BookingLink({
  variant = "navy",
  className = "",
  href = "/book-now",
  ...props
}: Omit<ComponentProps<"a">, "href"> & {
  variant?: "navy" | "gold" | "white" | "text";
  href?: string;
}) {
  // Every booking call-to-action lands on the site's own booking page rather
  // than an external scheduler.
  return (
    <Link
      {...props}
      href={href}
      onClick={(e) => {
        if (href.startsWith("/")) {
          e.preventDefault()
          window.location.href = href
        }
      }}
      className={`button button-${variant} ${className}`}
    />
  )
}
function Heading({
  level = 2,
  ...props
}: ComponentProps<"h2"> & { level?: 1 | 2 | 3 }) {
  return createElement(`h${level}`, props)
}
function Input(props: ComponentProps<"input">) {
  return createElement("input", props)
}
interface ArtProps {
  src: string
  className?: string
}
function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    )
    if (!els.length) return

    // Respect reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function Art({ src, className = "" }: ArtProps) {
  return (
    <img src={src} alt="" aria-hidden="true" className={`art ${className}`} />
  )
}
function CountUp({
  value,
  duration = 1800,
  className = "",
}: {
  value: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [display, setDisplay] = useState(value)
  const started = useRef(false)

  // Parse "1,000+", "$9M+", "4,500+", "7 Figures" into parts
  const parsed = useMemo(() => {
    const match = value.match(/^([^0-9]*)([0-9][0-9,]*)(.*)$/)
    if (!match) return null
    const [, prefix, numStr, suffix] = match
    const target = parseInt(numStr.replace(/,/g, ""), 10)
    const hasComma = numStr.includes(",")
    return { prefix, target, suffix, hasComma }
  }, [value])

  useEffect(() => {
    if (!parsed) return
    const el = ref.current
    if (!el) return

    const run = () => {
      if (started.current) return
      started.current = true
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(eased * parsed.target)
        const formatted = parsed.hasComma
          ? current.toLocaleString("en-US")
          : String(current)
        setDisplay(`${parsed.prefix}${formatted}${parsed.suffix}`)
        if (progress < 1) requestAnimationFrame(tick)
        else setDisplay(value)
      }
      requestAnimationFrame(tick)
    }

    // If already in view on mount, start after a short delay
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const t = setTimeout(run, 200)
      return () => clearTimeout(t)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) run()
        })
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [parsed, duration, value])

  return (
    <strong ref={ref} className={className}>
      {display}
    </strong>
  )
}
function TextType({
  text,
  typingSpeed = 75,
  deletingSpeed = 40,
  pauseDuration = 1500,
  cursorCharacter = "|",
  className = "",
  showCursor = true,
}: {
  text: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  cursorCharacter?: string
  className?: string
  showCursor?: boolean
}) {
  const [displayed, setDisplayed] = useState("")
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    const current = text[textIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (deleting) {
      if (displayed === "") {
        setDeleting(false)
        setTextIndex((prev) => (prev + 1) % text.length)
        setCharIndex(0)
      } else {
        timeout = setTimeout(
          () => setDisplayed((prev) => prev.slice(0, -1)),
          deletingSpeed,
        )
      }
    } else if (charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayed((prev) => prev + current[charIndex])
        setCharIndex((prev) => prev + 1)
      }, typingSpeed)
    } else {
      timeout = setTimeout(() => setDeleting(true), pauseDuration)
    }

    return () => clearTimeout(timeout)
  }, [
    displayed,
    charIndex,
    deleting,
    textIndex,
    text,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ])

  return (
    <span className={`text-type ${className}`}>
      {displayed}
      {showCursor && (
        <span className="text-type__cursor" aria-hidden="true">
          {cursorCharacter}
        </span>
      )}
    </span>
  )
}
function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>
}

const aboutCopy = [
  "My career began in engineering and data: working with organisations including Shell, ExxonMobil, Imperial Oil, and the Canada Mortgage and Housing Corporation.",
  "Today, I apply that same analytical thinking and long-term perspective to helping professionals build wealth and mentoring future financial advisors.",
  "Over the past decade, I've helped develop more than 1,000 advisors and build a multi-million-dollar organisation across North America.",
]
const testimonials = [
  {
    name: "Anna Groat",
    role: "Wealth strategy client",
    image: artwork.anna,
    quote:
      "Kayode helped us turn years of scattered accounts, insurance policies, and good intentions into one clear financial strategy. He took the time to understand our family, explain every recommendation in plain language, and show us how each decision supported the life we wanted to build. We left every conversation feeling informed rather than overwhelmed, with practical next steps and renewed confidence about our long-term wealth.",
  },
  {
    name: "Jared Bell",
    role: "Independent financial advisor",
    image: artwork.jared,
    quote:
      "Kayode’s mentorship changed the way I approach both financial planning and building an advisory practice. He combines the discipline of an engineer with the perspective of a leader who has developed advisors across North America. His guidance was always specific, honest, and focused on sustainable growth. I gained stronger systems, greater confidence in client conversations, and a clearer understanding of how to create meaningful impact while building a successful business.",
  },
  {
    name: "Roopam Mishra",
    role: "Entrepreneur and family wealth client",
    image: artwork.roopam,
    quote:
      "What stood out immediately was Kayode’s ability to connect the details of our business, personal goals, and family responsibilities. He did not offer a generic plan; he built a thoughtful roadmap around the decisions we actually face. His calm, analytical approach made complex topics easier to understand, and his follow-through kept us accountable. We now feel better prepared to protect what we have built and grow it with purpose.",
  },
]
const insights = [
  {
    title: "WHERE ARE ALL YOUR ASSETS?",
    text: "A closer look at hidden wealth and the gaps in your current portfolio.",
    image: `${assetPathPrefix}/b8130.webp`,
  },
  {
    title: "THE CRAFT OF WEALTH",
    text: "How artisanal investing can help you build a more resilient financial future.",
    image: `${assetPathPrefix}/c9004.webp`,
  },
  {
    title: "THE RHYTHM OF RETURNS",
    text: "Timing the market is hard, but timing your financial goals doesn't have to be.",
    image: `${assetPathPrefix}/330b4.webp`,
  },
  {
    title: "THE RECIPE FOR GROWTH",
    text: "Mixing the right ingredients to turn your savings into long-term wealth.",
    image: `${assetPathPrefix}/20453.webp`,
  },
  {
    title: "THE WORKER'S EDGE",
    text: "Turning everyday income into a retirement plan that actually works.",
    image: `${assetPathPrefix}/5a155.webp`,
  },
  {
    title: "THE TASTE OF SECURITY",
    text: "Finding peace of mind in a financial plan that's built to last.",
    image: `${assetPathPrefix}/45e36.webp`,
  },
  {
    title: "THE ART OF DIVERSITY",
    text: "Why spreading your assets across different classes can protect your future.",
    image: `${assetPathPrefix}/72c82.webp`,
  },
  {
    title: "THE MENU FOR TOMORROW",
    text: "Planning for the next decade with a financial strategy that adapts.",
    image: `${assetPathPrefix}/282e8.webp`,
  },
  {
    title: "THE KITCHEN TABLE PLAN",
    text: "Turning everyday conversations into a clear path to financial freedom.",
    image: `${assetPathPrefix}/80031.webp`,
  },
  {
    title: "THE SERVICE STANDARD",
    text: "What exceptional service looks like when your money is on the line.",
    image: `${assetPathPrefix}/6241f.webp`,
  },
  {
    title: "THE COMMUNITY EFFECT",
    text: "How local relationships can strengthen your long-term financial outlook.",
    image: `${assetPathPrefix}/91b97.webp`,
  },
  {
    title: "THE FUTURE OF FINANCE",
    text: "What the next generation of wealth-building looks like in practice.",
    image: `${assetPathPrefix}/74a96.webp`,
  },
  {
    title: "THE HARMONY OF RISK",
    text: "Balancing protection and growth so your plan stays in tune.",
    image: `${assetPathPrefix}/e875f.webp`,
  },
]
const posters = [
  {
    background: "#ae7a41",
    color: "#572819",
    lines: ["WEALTH", "CLARITY"],
    footer: "BUILD WITH PURPOSE",
    size: 56.6,
  },
  {
    background: "#a78b54",
    color: "#44251c",
    lines: ["FINANCIAL", "FREEDOM"],
    footer: "AND LASTING LEGACY",
    size: 56.6,
  },
  {
    background: "#793e28",
    color: "#c89b48",
    lines: ["MONEY", "GROWTH"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#a65b30",
    color: "#301b16",
    lines: ["INVEST", "Wisely"],
    footer: "COMPOUND RETURNS",
    size: 56.6,
  },
  {
    background: "#493523",
    color: "#bd8632",
    lines: ["SAVE", "GROW"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#793e28",
    color: "#c89b48",
    lines: ["LEGACY", "PLANNING"],
    footer: "FOR GENERATIONS",
    size: 56.6,
  },
  {
    background: "#ae7a41",
    color: "#572819",
    lines: ["RETIRE", "WELL"],
    footer: "",
    size: 79.3,
  },
  {
    background: "#a65b30",
    color: "#301b16",
    lines: ["TAX", "STRATEGY"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#793e28",
    color: "#c89b48",
    lines: ["RISK", "REWARD"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#493523",
    color: "#bd8632",
    lines: ["ESTATE"],
    footer: "",
    size: 128.7,
  },
  {
    background: "#ae7a41",
    color: "#572819",
    lines: ["CASH", "FLOW"],
    footer: "MONTHLY REVIEWS",
    size: 56.6,
  },
  {
    background: "#a65b30",
    color: "#301b16",
    lines: ["ASSETS", "GROWTH"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#ae7a41",
    color: "#572819",
    lines: ["PORTFOLIO"],
    footer: "MUSIC CITY USA",
    size: 90.6,
  },
  {
    background: "#a78b54",
    color: "#44251c",
    lines: ["ALL YOU", "EVER NEEDED"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#493523",
    color: "#bd8632",
    lines: ["DIVERSIFY", "★ ★ ★"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#a65b30",
    color: "#301b16",
    lines: ["PASSIVE", "INCOME"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#ae7a41",
    color: "#572819",
    lines: ["THE", "WEALTH"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#793e28",
    color: "#c89b48",
    lines: ["MONEY", "MINDSET"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#ae7a41",
    color: "#572819",
    lines: ["LONG", "TERM"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#493523",
    color: "#bd8632",
    lines: ["FREEDOM"],
    footer: "",
    size: 56.6,
  },
]
const calculators = [
  "Tax Calculator",
  "College Savings",
  "Debt Repayment",
  "Retirement Planning",
  "Compound Interest",
] as const
type CalculatorKind = typeof calculators[number]
type Panel = { kind: "story" } | {
  kind: "insight"
  index: number
} | {
  kind: "calculator"
  calculator: CalculatorKind
}
const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)

export default function App() {
  const [panel, setPanel] = useState<Panel | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [principal, setPrincipal] = useState(10000)
  const [monthly, setMonthly] = useState(300)
  const [years, setYears] = useState(20)
  const [rate, setRate] = useState(6)
  const [income, setIncome] = useState(80000)
  const [taxRate, setTaxRate] = useState(25)
  const [workIndex, setWorkIndex] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(1)
  const [insightsModal, setInsightsModal] = useState(false)
  const [activeMetric, setActiveMetric] = useState<number | null>(null)
  const [calcMenuOpen, setCalcMenuOpen] = useState(false)
  const [eventsMenuOpen, setEventsMenuOpen] = useState(false)
  const [workMenuOpen, setWorkMenuOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const calcMenuRef = useRef<HTMLDivElement>(null)
  const eventsMenuRef = useRef<HTMLDivElement>(null)
  const workMenuRef = useRef<HTMLDivElement>(null)
  useScrollReveal()

  // Footer skyline buildings
  const buildings = [
    artwork.building,
    artwork.building,
    artwork.building,
    artwork.building,
    artwork.building,
    artwork.building,
    artwork.building,
    artwork.building,
  ]
  const [growing, setGrowing] = useState<number | null>(null)

  // Footer social links
  const socials = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kayode-samson-elepe", icon: artwork.linkedin },
    { label: "Twitter", href: "https://twitter.com/kayodesamson", icon: artwork.linkedin },
    { label: "Facebook", href: "https://facebook.com/kayode.elepe", icon: artwork.linkedin },
  ]

  // Path-based routing: /contact shows the Contact page, unknown paths show 404
  const [route, setRoute] = useState(() => window.location.pathname)

  // When the landing page loads with a hash (e.g. /#testimonials), scroll to
  // that section once it has rendered. The browser's own hash scroll fires
  // before React mounts, so it does nothing on a fresh load.
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    let attempts = 0
    const tryScroll = () => {
      const el = document.getElementById(hash)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      } else if (attempts++ < 30) {
        setTimeout(tryScroll, 100)
      }
    }
    tryScroll()
  }, [route])

  useEffect(() => {
    const onPopState = () => { setRoute(window.location.pathname); window.scrollTo(0, 0) }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])
  const navigate = (path: string) => {
    if (path === "/about") {
      window.location.href = "/about"
      return
    }
    if (path === "/service") {
      window.location.href = "/service"
      return
    }
    if (path === "/career") {
      window.location.href = "/career"
      return
    }
    // Hash links (e.g. /#testimonials) must land on the landing page and then
    // scroll to the section, even when we are already on the landing page.
    const [base, hash] = path.split("#")
    const target = base || "/"
    const scrollToHash = () => {
      if (!hash) return
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    if (window.location.pathname !== target) {
      // Different page: navigate there, then scroll once the section exists.
      window.location.href = path
      return
    }
    window.history.pushState({}, "", path)
    setRoute(target)
    // The landing page may not be rendered yet, so retry until the section
    // appears rather than scrolling once and giving up.
    let attempts = 0
    const tryScroll = () => {
      const el = document.getElementById(hash)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      } else if (attempts++ < 20) {
        setTimeout(tryScroll, 100)
      }
    }
    tryScroll()
  }

  // Close the calculators dropdown when clicking anywhere outside it
  useEffect(() => {
    if (!calcMenuOpen) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      if (calcMenuRef.current?.contains(target)) return
      // Taps inside the mobile menu must not be treated as outside clicks,
      // or the menu closes before the item's click handler runs.
      if (target.closest(".mobile-nav")) return
      if (target.closest("dialog")) return
      setCalcMenuOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [calcMenuOpen])

  // Close the updates dropdown when clicking anywhere outside it
  useEffect(() => {
    if (!eventsMenuOpen) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      if (eventsMenuRef.current?.contains(target)) return
      if (target.closest(".mobile-nav")) return
      setEventsMenuOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [eventsMenuOpen])
  useEffect(() => {
    if (!panel) {
      dialog.current?.close()
      return
    }
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialog.current?.showModal()
    return () => {
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [panel])
  const months = years * 12
  const monthlyRate = rate / 1200
  const factor = (1 + monthlyRate) ** months
  const future =
    principal * factor +
    monthly * (monthlyRate ? (factor - 1) / monthlyRate : months)
  const debtPayment = monthlyRate
    ? (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
    : principal / months
  const title =
    panel?.kind === "story"
      ? "Meet Kayode Samson Elepe, RR"
      : panel?.kind === "insight"
        ? insights[panel.index].title
        : panel?.kind === "calculator"
          ? panel.calculator
          : ""

  // Path-based routing: /contact shows Contact page, unknown paths show 404
  if (route === "/contact") {
    return (
      <SiteLayout
        navigate={navigate}
        setPanel={setPanel}
        setMobileMenu={setMobileMenu}
        mobileMenu={mobileMenu}
        eventsMenuOpen={eventsMenuOpen}
        setEventsMenuOpen={setEventsMenuOpen}
        calcMenuOpen={calcMenuOpen}
        setCalcMenuOpen={setCalcMenuOpen}
        eventsMenuRef={eventsMenuRef} workMenuOpen={workMenuOpen} setWorkMenuOpen={setWorkMenuOpen} workMenuRef={workMenuRef}
        calcMenuRef={calcMenuRef}
        growing={growing}
        setGrowing={setGrowing}
        socials={[]}
        hideAboutNav={false}
        hideContactNav={true}
      >
        <Link href="#main" className="skip-link">
          Skip to content
        </Link>
        <ContactPage />
      </SiteLayout>
    )
  }

  // 404 for unknown paths
  if (route !== "/") {
    return (
      <main className="not-found-page">
        <div className="container">
          <p className="not-found-code">404</p>
          <h1>Page not found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <button className="button-strategy" onClick={() => navigate("/")}>Back to home</button>
        </div>
      </main>
    )
  }

  return (
    <SiteLayout
      navigate={navigate}
      setPanel={setPanel}
      setMobileMenu={setMobileMenu}
      mobileMenu={mobileMenu}
      eventsMenuOpen={eventsMenuOpen}
      setEventsMenuOpen={setEventsMenuOpen}
      calcMenuOpen={calcMenuOpen}
      setCalcMenuOpen={setCalcMenuOpen}
      eventsMenuRef={eventsMenuRef} workMenuOpen={workMenuOpen} setWorkMenuOpen={setWorkMenuOpen} workMenuRef={workMenuRef}
      calcMenuRef={calcMenuRef}
      growing={growing}
      setGrowing={setGrowing}
      socials={[]}
      hideCareerNav
      isLanding
      mobileWorkDropdown
    >
      <Link href="#main" className="skip-link">
        Skip to content
      </Link>
      <main id="main">
        <section id="home" className="hero" aria-labelledby="hero-title">
          <div className="gold-field" aria-hidden="true" />
          <Art src={artwork.dotsTop} className="hero-dots-top" />
          <Art src={artwork.dotsBottom} className="hero-dots-bottom" />
          <Art src={artwork.chart} className="hero-chart" />
          <div className="container hero-grid grid">
            <div className="hero-copy">
              <Eyebrow>Helping You Multiply What Matters</Eyebrow>
              <Heading level={1} id="hero-title">
                Build Wealth with
                <br />
                <span>
                  <TextType
                    text={["Clarity.", "Purpose.", "Strategy."]}
                    typingSpeed={90}
                    deletingSpeed={45}
                    pauseDuration={1600}
                    cursorCharacter="|"
                  />
                </span>
              </Heading>
              <p className="hero-subtitle">Build Leaders with Purpose.</p>
              <p className="hero-description">
                Whether you're planning for retirement, growing your wealth, or
                exploring a meaningful career in financial services, you'll find
                practical guidance, proven strategies, and a partner committed
                to your long-term success.
              </p>
              <div className="flex flex-wrap gap-3 hero-actions">
                <BookingLink className="button-strategy">
                  Book a strategic session
                </BookingLink>
                <Link href="#insights" className="button button-insights">
                  Explore Insights
                </Link>
              </div>
            </div>
            <div className="hero-portrait">
              <Art src={artwork.halo} className="portrait-halo" />
              <Art src={artwork.ring} className="portrait-ring" />
              <img
                src={artwork.portrait}
                alt="Kayode Samson Elepe, financial services leader"
                className="portrait-photo"
                fetchPriority="high"
              />
              <div className="portrait-label">
                <span className="portrait-label-name">
                  Kayode S.
                  <br />
                  Elepe
                </span>
                <span className="portrait-label-role">Financial Coach, RR</span>
              </div>
              <div className="hero-edition">
                <strong>01</strong>
                <span>WEALTH • LEADERSHIP • LEGACY</span>
              </div>
            </div>
          </div>
        </section>
        <section className="trusted-strip" aria-label="Trusted organizations">
          <div className="container trusted-inner flex items-center" data-reveal>
            <Eyebrow>
              <Art src={artwork.trustedDot} /> TRUSTED{" "}
              <br />
              ORGANIZATIONS
            </Eyebrow>
            <div className="trusted-marquee">
              <div className="trusted-marquee-track">
                {[
                  ["Clarity", artwork.clarity],
                  ["The Canadian Institute of Financial Planning", artwork.cifp],
                  ["Registered Retirement Consultant", artwork.rrc],
                  ["1Mfor1T", artwork.million],
                  ["MacPhini Foundation", artwork.macPhini],
                  ["MacPhini Foundation", artwork.macPhini],
                  ["The Canadian Institute of Financial Planning", artwork.cifp],
                  ["Registered Retirement Consultant", artwork.rrc],
                  ["1Mfor1T", artwork.million],
                  ["MacPhini Foundation", artwork.macPhini],
                ].map(([label, src], i) => (
                  <div key={`m-${label}-${i}`}>
                    <img src={src} alt={label} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="about-section"
          aria-labelledby="about-title"
        >
          <div className="about-watermark top" aria-hidden="true">
            KAYODE S.
          </div>
          <div className="about-watermark bottom" aria-hidden="true">
            KSEFINSERVE
          </div>
          <Art src={artwork.glow} className="about-glow" />
          <div className="about-deco" aria-hidden="true">
            <span className="deco-arc-topleft" />
            <span className="deco-arc-topleft-2" />
            <span className="deco-ring-center" />
            <span className="deco-ring-center-inner" />
            <span className="deco-diamond deco-diamond-1" />
            <span className="deco-diamond deco-diamond-2" />
            <span className="deco-diamond deco-diamond-3" />
            <span className="accent-line-h1" />
            <span className="accent-line-v1" />
            <span className="accent-line-v2" />
            <span className="dot-grid-tr">
              {Array.from({ length: 20 }, (_, i) => (
                <i key={i} className={`dg-tr-${i + 1}`} />
              ))}
            </span>
            <span className="dot-grid-bl">
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} className={`dg-bl-${i + 1}`} />
              ))}
            </span>
            <span className="chart-illustration">
              <span className="chart-base" />
              <span className="chart-bar chart-bar-1" />
              <span className="chart-bar chart-bar-2" />
              <span className="chart-bar chart-bar-3" />
              <span className="chart-bar chart-bar-4" />
              <span className="chart-bar chart-bar-5" />
              <span className="chart-bar chart-bar-6" />
              <span className="chart-td chart-td-1" />
              <span className="chart-td chart-td-2" />
              <span className="chart-td chart-td-3" />
              <span className="chart-td chart-td-4" />
              <span className="chart-td chart-td-5" />
              <span className="chart-td chart-td-6" />
            </span>
            <span className="growth-lines">
              <span className="gl gl-1" />
              <span className="gl gl-2" />
              <span className="gl gl-3" />
              <span className="gl gl-4" />
              <span className="gl gl-5" />
            </span>
            <span className="sep-line sep-line-1" />
            <span className="sep-line sep-line-2" />
            <span className="bracket bracket-tl-h" />
            <span className="bracket bracket-tl-v" />
            <span className="bracket bracket-br-h" />
            <span className="bracket bracket-br-v" />
          </div>
          <div className="container about-grid grid items-center" data-reveal>
            <div className="about-copy">
              <Eyebrow>ABOUT KAYODE</Eyebrow>
              {aboutCopy.map((copy) => (
                <p key={copy}>{copy}</p>
              ))}
              <div className="about-actions flex flex-wrap gap-3">
                <Button
                  variant="gold"
                  className="button-story"
                  onClick={() => navigate("/about")}
                >
                  About
                </Button>
                <button
                  className="button button-contact"
                  onClick={() => navigate("/contact")}
                >
                  Get in Touch
                </button>
              </div>
            </div>
            <div className="story-orbit">
              <div className="orbit-track" aria-hidden="true" />
              {[0, 1, 2, 3].map((i) => (
                <Art
                  key={i}
                  src={artwork.orbit}
                  className={`orbit-dot orbit-dot-${i}`}
                />
              ))}
              <Button
                variant="text"
                className="story-photo-button"
                onClick={() => setPanel({ kind: "story" })}
                aria-label="Read Kayode's story"
              >
                <img
                  src={artwork.story}
                  alt="Kayode Samson Elepe"
                  className="story-photo"
                />
                <span className="play-circle">
                  <Art src={artwork.play} />
                </span>
                <span className="story-caption">MY STORY</span>
              </Button>
            </div>
            <div className="about-identity">
              <Heading id="about-title">
                <span className="about-meet">Meet</span>
                <br />
                KAYODE S.{" "}
                <br />
                <span>ELEPE,</span>{" "}
                <br className="about-rr-br" />
                <span className="about-rr">Registered Rep.</span>
              </Heading>
              <p>
                What matters most is helping people make better decisions for
                themselves, their families, and the future they're creating.
              </p>
              <div className="advisor-stat">
                <span className="card-ring-2" aria-hidden="true" />
                <CountUp value="1,000+" />
                <span>Advisors Developed</span>
                <small>
                  Across a multi-million-dollar organisation in North America
                </small>
              </div>
            </div>
          </div>
        </section>

        <section
          id="work"
          className="work-section"
          aria-labelledby="work-title"
        >
          <div className="container text-center">
            <Eyebrow>How Can I Help You Today?</Eyebrow>
            <Heading id="work-title">WHAT WE DO.</Heading>
            <p className="path-copy">
              Everyone's journey is different.
              <br />
              <strong>Choose the path that is right for you.</strong>
            </p>
            <div className="work-cards grid" data-reveal data-active={workIndex}>
              <div className="work-card-wrap" data-index="0">
                <Button
                  variant="text"
                  className="work-card wealth-work"
                  onClick={() =>
                    document
                      .getElementById("services")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <img
                    src={artwork.wealthCard}
                    alt="Colorful illustrated building representing wealth growth"
                  />
                  <div className="work-card-copy">
                    <Heading level={3}>BUILD WEALTH</Heading>
                    <p>
                      Financial strategies tailored to goals,
                      <br />
                      and the future you're building.
                    </p>
                  </div>
                </Button>
                <Button
                  variant="text"
                  className="card-caption-btn"
                  onClick={() =>
                    document
                      .getElementById("services")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore Wealth Strategies
                </Button>
              </div>
              <div className="work-card-wrap" data-index="1">
                <Button
                  variant="text"
                  className="work-card guide-work"
                  onClick={() => setPanel({ kind: "story" })}
                >
                  <img
                    src={artwork.guideCard}
                    alt="A guide sharing his perspective outdoors"
                  />
                  <div className="work-card-copy">
                    <Heading level={3}>Guide</Heading>
                    <p>Empowering your next step.</p>
                  </div>
                </Button>
              </div>
              <div className="work-card-wrap" data-index="2">
                <BookingLink variant="text" className="work-card career-work" href="/career" onClick={(e) => { e.preventDefault(); navigate("/career") }}>
                  <img
                    src={artwork.careerCard}
                    alt="A professional sharing an opportunity on his phone"
                  />
                  <div className="work-card-copy">
                    <Heading level={3}>Career</Heading>
                    <p>
                      Create a rewarding business
                      <br />
                      helping others financially.
                    </p>
                  </div>
                </BookingLink>
                <Button
                  variant="text"
                  className="card-caption-btn career-caption-btn"
                  onClick={() =>
                    document
                      .getElementById("services")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Become an Advisor
                </Button>
              </div>
            </div>
            <div className="carousel-nav work-carousel-nav">
              <button
                type="button"
                className="carousel-arrow"
                aria-label="Previous path"
                onClick={() =>
                  setWorkIndex((i) => (i - 1 + 3) % 3)
                }
              >
                ‹
              </button>
              <span className="carousel-dots" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <i key={i} className={i === workIndex ? "active" : ""} />
                ))}
              </span>
              <button
                type="button"
                className="carousel-arrow"
                aria-label="Next path"
                onClick={() => setWorkIndex((i) => (i + 1) % 3)}
              >
                ›
              </button>
            </div>
            <div className="work-bottom">
              <BookingLink variant="text" className="book-text">
                Book Session <span aria-hidden="true">↗</span>
              </BookingLink>
              <Art src={artwork.underline} />
            </div>
            <div className="work-paths flex flex-wrap justify-center gap-6">
              <Link href="#services">Explore Wealth Strategies</Link>
              <BookingLink variant="text">Become an Advisor</BookingLink>
            </div>
          </div>
        </section>

        <section className="impact-section" aria-labelledby="impact-title">
          <div className="container impact-inner">
            <Eyebrow>Impact at a glance</Eyebrow>
            <Heading id="impact-title">
              Growth, mentorship, and stewardship.
            </Heading>
            <div className="metrics grid" data-reveal>
              {[
                ["1,000+", "Financial Services Professionals Mentored"],
                ["$9M+", "Annual Team Production"],
                ["7 Figures", "Personal Annual Production"],
                ["4,500+", "Families & Professionals Served"],
              ].map(([value, label], i) => (
                <button
                  type="button"
                  key={value}
                  className={`metric ${activeMetric === i ? "is-active" : ""}`}
                  onClick={() => setActiveMetric(activeMetric === i ? null : i)}
                  aria-pressed={activeMetric === i}
                >
                  <CountUp value={value} />
                  <p>{label}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="testimonials-section"
          aria-labelledby="testimonials-title"
          data-reveal
        >
          <img
            src={artwork.wave}
            alt=""
            className="impact-wave"
            aria-hidden="true"
          />
          <img
            src={artwork.forest}
            alt=""
            className="forest-scene"
            aria-hidden="true"
            loading="lazy"
          />
          <div className="container testimonials-inner">
            <div className="testimonials-heading text-center">
              <Eyebrow>TESTIMONIALS</Eyebrow>
              <Heading id="testimonials-title">In their words</Heading>
            </div>
            <div className="testimonials-grid grid items-start" data-reveal data-active={testimonialIndex}>
              {testimonials.map((item, i) => (
                <figure
                  className={`testimonial testimonial-${i}`}
                  key={item.name}
                  data-index={i}
                >
                  <div className="quote-art">
                    <Art src={artwork.quote} />
                  </div>
                  <blockquote>{item.quote}</blockquote>
                  <figcaption>
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} loading="lazy" />
                      <strong>{item.name}</strong>
                    </div>
                    <p>{item.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="carousel-nav testimonial-carousel-nav">
              <button
                type="button"
                className="carousel-arrow"
                aria-label="Previous testimonial"
                onClick={() =>
                  setTestimonialIndex(
                    (i) => (i - 1 + testimonials.length) % testimonials.length,
                  )
                }
              >
                ‹
              </button>
              <span className="carousel-dots" aria-hidden="true">
                {testimonials.map((_, i) => (
                  <i key={i} className={i === testimonialIndex ? "active" : ""} />
                ))}
              </span>
              <button
                type="button"
                className="carousel-arrow"
                aria-label="Next testimonial"
                onClick={() =>
                  setTestimonialIndex((i) => (i + 1) % testimonials.length)
                }
              >
                ›
              </button>
            </div>
          </div>
          <img
            src={artwork.land}
            alt=""
            className="land-scene"
            aria-hidden="true"
            loading="lazy"
          />
        </section>

        <section
          id="services"
          className="services-section"
          aria-labelledby="services-title"
        >
          <div className="container services-inner">
            <div className="text-center">
              <Eyebrow>Ways I Can Help</Eyebrow>
              <Heading id="services-title">How We Can Work Together?</Heading>
            </div>
            <div className="services-grid grid" data-reveal>
              {[
                {
                  title: "Wealth Strategy",
                  image: artwork.wealth,
                  text: "Helping You Make Confident Financial Decisions Today While Preparing For Tomorrow.",
                  interest: "Wealth strategy",
                },
                {
                  title: "Financial Services Business Development",
                  image: artwork.advisors,
                  text: "Helping Purpose-Driven Professionals Build Meaningful Businesses Through Leadership, Mentorship, And Proven Systems.",
                  interest: "A career in financial services",
                },
              ].map((item) => (
                <article className="service-card" key={item.title}>
                  <img
                    src={item.image}
                    alt={
                      item.title === "Wealth Strategy"
                        ? "Professionals discussing financial strategy"
                        : "Advisors collaborating on a business plan"
                    }
                    loading="lazy"
                  />
                  <Heading level={3}>{item.title}</Heading>
                  <p>{item.text}</p>
                  <BookingLink>Book a Strategy Session</BookingLink>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="why-section" aria-labelledby="why-title">
          <div className="container why-inner">
            <div className="why-intro grid" data-reveal>
              <Heading id="why-title">
                Why This
                <br />
                Matters
              </Heading>
              <p>
                I believe wealth should create choices. It should give you the
                freedom to care for your family, support causes that matter, and
                create opportunities for future generations.
              </p>
            </div>
            <div className="why-diagram">
              <div className="diagram-arch">
                <Art src={artwork.arch} />
              </div>
              <div className="benefits-left">
                <Benefit
                  title="Local Experts"
                  subtitle="Local Knowledge That Matters"
                >
                  Our team has an in-depth understanding of the USA real market.
                </Benefit>
                <Benefit
                  title="Personalized Service"
                  subtitle="Tailored to Your Needs"
                >
                  We provide customized solutions to meet your unique property
                  requirements.
                </Benefit>
              </div>
              <div className="shield-art">
                <Art src={artwork.shield} />
                <img
                  src={artwork.building}
                  alt="A distinctive pink building, symbolizing opportunities for the future"
                  loading="lazy"
                />
              </div>
              <div className="benefits-right">
                <Benefit
                  title="Proven Success"
                  subtitle="Your Success is Our Priority"
                >
                  Our team has an in-depth understanding of the USA real estate
                  market.
                </Benefit>
                <Benefit
                  title="Industry Recognition"
                  subtitle="Trusted by Many"
                >
                  We are proud members of [Industry Association] and have
                  received accolades for our outstanding service
                </Benefit>
              </div>
            </div>
            <div className="diagram-bottom flex items-center justify-center">
              <Art src={artwork.lineLeft} />
              <div className="book-now">
                <span className="book-now-icon" aria-hidden="true">
                  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <path d="M9 15.5l2 2 4-4" />
                  </svg>
                </span>
                <BookingLink className="book-now-btn">
                  Book Session
                </BookingLink>
              </div>
              <Art src={artwork.lineRight} />
            </div>
          </div>
        </section>

        <section
          id="insights"
          className={`insights-section ${showInsights ? "insights-open" : ""}`}
          aria-labelledby="insights-title"
        >
          <div className="poster-wall grid" aria-hidden="true">
            {posters.map((poster, i) => (
              <div
                className="poster"
                key={i}
                style={{
                  backgroundColor: poster.background,
                  color: poster.color,
                }}
              >
                <span>★ ★ ★</span>
                <p style={{ fontSize: `${poster.size / 19.2}cqw` }}>
                  {poster.lines.map((line) => (
                    <span className="poster-title-line" key={line}>
                      {line}
                    </span>
                  ))}
                </p>
                <small>{poster.footer}</small>
                <span>★ ★ ★</span>
              </div>
            ))}
          </div>
          <div className="insight-collage grid" data-expanded={showInsights}>
            {insights.map((item, i) => (
              <Button
                variant="text"
                className={`insight-card insight-card-${i}`}
                key={item.title}
                onClick={() => setPanel({ kind: "insight", index: i })}
                aria-label={`Read ${item.title.toLowerCase()}`}
              >
                <img src={item.image} alt="" loading="lazy" />
                <div className="insight-card-overlay">
                  <Heading level={3}>{item.title}</Heading>
                  <p>{item.text}</p>
                  <span>
                    Read Article <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Button>
            ))}
          </div>
          <div className="insights-heading text-center">
            <div className="insights-badge">
              <Art src={artwork.insightFrame} />
              <div className="insights-brand">
                <img src={artwork.footerLogo} alt="Kayode Samson Elepe" />
              </div>
              <Eyebrow>LATEST</Eyebrow>
              <Heading id="insights-title">INSIGHTS</Heading>
            </div>
            <p className="insights-hint">
              Click on any image to
              <br />
              view more details
            </p>
            <Button
              variant="text"
              className="insights-view-all"
              onClick={() => { window.location.href = "/insights" }}
            >
              View all insights
            </Button>
          </div>
        </section>

        {insightsModal && (
          <div
            className="insights-modal"
            role="dialog"
            aria-modal="true"
            aria-label="All insights"
            onClick={(e) => {
              if (e.target === e.currentTarget) setInsightsModal(false)
            }}
          >
            <div className="insights-modal-inner">
              <div className="insights-modal-head">
                <Heading level={3}>All Insights</Heading>
                <button
                  type="button"
                  className="insights-modal-close"
                  aria-label="Close"
                  onClick={() => setInsightsModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="insights-modal-grid" data-expanded={showInsights}>
                {insights.map((item, i) => (
                  <Button
                    variant="text"
                    className="insights-modal-card"
                    key={item.title}
                    onClick={() => {
                      setInsightsModal(false)
                      setPanel({ kind: "insight", index: i })
                    }}
                  >
                    <img src={item.image} alt="" loading="lazy" />
                    <div className="insights-modal-card-body">
                      <Heading level={3}>{item.title}</Heading>
                      <p>{item.text}</p>
                      <span>
                        Read Article <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
              <button
                type="button"
                className="insights-modal-toggle"
                onClick={() => setShowInsights(!showInsights)}
                aria-expanded={showInsights}
              >
                {showInsights ? "Show less" : "View all insights"}
              </button>
            </div>
          </div>
        )}

        <section
          id="contact"
          className="contact-section"
          aria-label="Start a conversation"
        >
          <div className="container contact-inner">
            <article className="contact-card chapter-card" data-reveal>
              <Art src={artwork.chapterGlow} className="card-glow-top" />
              <Art
                src={artwork.chapterGlowBottom}
                className="card-glow-bottom"
              />
              <div className="contact-card-grid grid items-center">
                <div>
                  <Eyebrow>YOUR NEXT CHAPTER</Eyebrow>
                  <Heading>
                    Could Financial Services Be Your Next Chapter?
                  </Heading>
                  <p>
                    Some of the best advisors I've worked with started in
                    completely different professions.
                  </p>
                  <p>
                    If you're looking for meaningful work, continuous growth,
                    and the opportunity to help others while building your own
                    business, let's have a conversation.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <BookingLink variant="white">Book a Session</BookingLink>
                    <Link className="button button-navy" href="/about">
                      About
                    </Link>
                  </div>
                </div>
                <img
                  src={artwork.nextChapter}
                  alt="A financial services professional welcoming your next chapter"
                  loading="lazy"
                />
              </div>
            </article>
            <article className="contact-card conversation-card" data-reveal>
              <Art src={artwork.conversationGlow} className="card-glow-top" />
              <Art
                src={artwork.chapterGlowBottom}
                className="card-glow-bottom"
              />
              <div className="contact-card-grid grid items-center">
                <Button
                  variant="text"
                  className="conversation-image"
                  aria-label="Learn about working together"
                  onClick={() => setPanel({ kind: "story" })}
                >
                  <img
                    src={artwork.conversation}
                    alt="A financial professional ready for a conversation"
                    loading="lazy"
                  />
                  <span className="play-circle">
                    <Art src={artwork.conversationPlay} />
                  </span>
                </Button>
                <div>
                  <Eyebrow>REACH OUT</Eyebrow>
                  <Heading>Let's Start with a Conversation</Heading>
                  <p>
                    Whether you're planning your financial future or exploring
                    your next career chapter, I'd be honoured to learn more
                    about your goals and discuss how I can help.
                  </p>
                  <BookingLink>Book a Strategy Session</BookingLink>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <dialog
        ref={dialog}
        className="detail-dialog"
        aria-labelledby="dialog-title"
        onClose={() => setPanel(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setPanel(null)
        }}
      >
        {panel && (
          <div className="dialog-inner">
            <Button
              variant="text"
              className="dialog-close"
              aria-label="Close dialog"
              onClick={() => setPanel(null)}
            >
              ×
            </Button>
            <Eyebrow>KSEFINSERVE</Eyebrow>
            <Heading id="dialog-title">{title}</Heading>
            {panel.kind === "story" && (
              <>
                <img
                  className="story-dialog-photo"
                  src={artwork.story}
                  alt="Kayode Samson Elepe"
                />
                {aboutCopy.map((copy) => (
                  <p key={copy}>{copy}</p>
                ))}
                <p>
                  What matters most is helping people make better decisions for
                  themselves, their families, and the future they're creating.
                </p>
                <BookingLink>Let's start a conversation</BookingLink>
              </>
            )}
            {panel.kind === "insight" && (
              <>
                <img
                  className="insight-dialog-photo"
                  src={insights[panel.index].image}
                  alt={insights[panel.index].title}
                />
                <p>{insights[panel.index].text}</p>
                <small>
                  Insight overview. Discuss how this topic relates to your
                  personal goals in a strategy session.
                </small>
                <BookingLink>Discuss your strategy</BookingLink>
              </>
            )}
            {panel.kind === "calculator" && (
              <>
                <p>
                  {panel.calculator === "Tax Calculator"
                    ? "Estimate tax using your own effective tax rate."
                    : panel.calculator === "Debt Repayment"
                      ? "Estimate the monthly payment needed to pay off a balance."
                      : "Explore how consistent contributions could grow over time."}
                </p>
                <div className="calculator-switch">
                  <label className="calculator-select">
                    <span className="sr-only">Choose a calculator</span>
                    <select
                      value={panel.calculator}
                      onChange={(e) =>
                        setPanel({
                          kind: "calculator",
                          calculator: e.target.value as CalculatorKind,
                        })
                      }
                    >
                      {calculators.map((calculator) => (
                        <option key={calculator} value={calculator}>
                          {calculator}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="calculator-fields grid">
                  {panel.calculator === "Compound Interest" ? (
                    <>
                      <label>
                        Initial deposit (USD)
                        <Input
                          type="number"
                          min="0"
                          max="100000000"
                          step="100"
                          value={principal}
                          onChange={(e) =>
                            setPrincipal(
                              Math.min(
                                100000000,
                                Math.max(0, Number(e.target.value)),
                              ),
                            )
                          }
                        />
                      </label>
                      <label>
                        Monthly contribution (USD)
                        <Input
                          type="number"
                          min="0"
                          max="1000000"
                          step="25"
                          value={monthly}
                          onChange={(e) =>
                            setMonthly(
                              Math.min(
                                1000000,
                                Math.max(0, Number(e.target.value)),
                              ),
                            )
                          }
                        />
                      </label>
                      <label>
                        Annual interest rate (%)
                        <Input
                          type="number"
                          min="0"
                          max="30"
                          step="0.5"
                          value={rate}
                          onChange={(e) =>
                            setRate(
                              Math.min(30, Math.max(0, Number(e.target.value))),
                            )
                          }
                        />
                      </label>
                      <label>
                        Years to grow
                        <Input
                          type="number"
                          min="1"
                          max="60"
                          value={years}
                          onChange={(e) =>
                            setYears(
                              Math.min(60, Math.max(1, Number(e.target.value))),
                            )
                          }
                        />
                      </label>
                    </>
                  ) : panel.calculator === "Tax Calculator" ? (
                    <>
                      <label>
                        Annual income (USD)
                        <Input
                          type="number"
                          min="0"
                          max="100000000"
                          step="100"
                          value={income}
                          onChange={(e) =>
                            setIncome(
                              Math.min(
                                100000000,
                                Math.max(0, Number(e.target.value)),
                              ),
                            )
                          }
                        />
                      </label>
                      <label>
                        Effective tax rate (%)
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={taxRate}
                          onChange={(e) =>
                            setTaxRate(
                              Math.min(
                                100,
                                Math.max(0, Number(e.target.value)),
                              ),
                            )
                          }
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        {panel.calculator === "Debt Repayment"
                          ? "Current balance (USD)"
                          : "Starting savings (USD)"}
                        <Input
                          type="number"
                          min="0"
                          max="100000000"
                          step="100"
                          value={principal}
                          onChange={(e) =>
                            setPrincipal(
                              Math.min(
                                100000000,
                                Math.max(0, Number(e.target.value)),
                              ),
                            )
                          }
                        />
                      </label>
                      {panel.calculator !== "Debt Repayment" && (
                        <label>
                          Monthly contribution (USD)
                          <Input
                            type="number"
                            min="0"
                            max="1000000"
                            step="25"
                            value={monthly}
                            onChange={(e) =>
                              setMonthly(
                                Math.min(
                                  1000000,
                                  Math.max(0, Number(e.target.value)),
                                ),
                              )
                            }
                          />
                        </label>
                      )}
                      <label>
                        {panel.calculator === "Debt Repayment"
                          ? "Repayment period (years)"
                          : "Time horizon (years)"}
                        <Input
                          type="number"
                          min="1"
                          max="60"
                          value={years}
                          onChange={(e) =>
                            setYears(
                              Math.min(60, Math.max(1, Number(e.target.value))),
                            )
                          }
                        />
                      </label>
                      <label>
                        {panel.calculator === "Debt Repayment"
                          ? "Annual interest rate (%)"
                          : "Annual return (%)"}
                        <Input
                          type="number"
                          min="0"
                          max="30"
                          step="0.5"
                          value={rate}
                          onChange={(e) =>
                            setRate(
                              Math.min(30, Math.max(0, Number(e.target.value))),
                            )
                          }
                        />
                      </label>
                    </>
                  )}
                </div>
                <output className="calculator-result" aria-live="polite">
                  <span>
                    {panel.calculator === "Tax Calculator"
                      ? "Estimated annual tax"
                      : panel.calculator === "Debt Repayment"
                        ? "Estimated monthly payment"
                        : panel.calculator === "Compound Interest"
                          ? "Projected balance"
                          : "Projected future value"}
                  </span>
                  <strong>
                    {money(
                      panel.calculator === "Tax Calculator"
                        ? (income * taxRate) / 100
                        : panel.calculator === "Debt Repayment"
                          ? debtPayment
                          : future,
                    )}
                  </strong>
                  {panel.calculator === "Tax Calculator" && (
                    <small>
                      After-tax income: {money(income * (1 - taxRate / 100))}
                    </small>
                  )}
                </output>
                {panel.calculator === "Compound Interest" && (
                  <CompoundGraph
                    principal={principal}
                    monthly={monthly}
                    rate={rate}
                    years={years}
                  />
                )}
                <small>
                  Illustrative estimates in US dollars, not financial or
                  tax advice. Growth assumes constant returns and end-of-month
                  contributions; fees, inflation, and taxes are excluded. Debt
                  assumes fixed monthly payments. Tax uses your supplied
                  effective rate, not jurisdiction-specific tax brackets.
                </small>
              </>
            )}
          </div>
        )}
      </dialog>
    </SiteLayout>
  )
}

function CompoundGraph({
  principal,
  monthly,
  rate,
  years,
}: {
  principal: number
  monthly: number
  rate: number
  years: number
}) {
  const W = 560
  const H = 220
  const PAD = { top: 18, right: 14, bottom: 26, left: 14 }
  const r = rate / 100
  const monthlyRate = r / 12
  const months = Math.max(1, Math.round(years * 12))

  // Build the growth series (balance at each year mark)
  const points: { x: number; y: number; label: string }[] = []
  let balance = principal
  for (let m = 0; m <= months; m++) {
    if (m > 0) {
      balance = balance * (1 + monthlyRate) + monthly
    }
    if (m % 12 === 0 || m === months) {
      points.push({ x: m / 12, y: balance, label: `Year ${m / 12}` })
    }
  }

  const maxVal = Math.max(...points.map((p) => p.y), 1)
  const minVal = Math.min(...points.map((p) => p.y), 0)
  const range = maxVal - minVal || 1

  const toX = (yr: number) =>
    PAD.left + (yr / years) * (W - PAD.left - PAD.right)
  const toY = (val: number) =>
    PAD.top + (1 - (val - minVal) / range) * (H - PAD.top - PAD.bottom)

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.x).toFixed(1)},${toY(p.y).toFixed(1)}`)
    .join(" ")
  const areaPath = `${linePath} L${toX(points[points.length - 1].x).toFixed(1)},${toY(minVal).toFixed(1)} L${toX(0).toFixed(1)},${toY(minVal).toFixed(1)} Z`

  const [hover, setHover] = useState<number | null>(null)

  const totalContributed = principal + monthly * months
  const interestEarned = Math.max(0, balance - totalContributed)

  const hovered = hover !== null ? points[hover] : null
  const hoverX = hovered ? toX(hovered.x) : 0
  const hoverY = hovered ? toY(hovered.y) : 0

  return (
    <div className="compound-graph">
      <div className="compound-graph-stats">
        <div>
          <span>Total contributed</span>
          <strong>{money(totalContributed)}</strong>
        </div>
        <div>
          <span>Interest earned</span>
          <strong>{money(interestEarned)}</strong>
        </div>
      </div>
      <div className="compound-graph-plot">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="compound-graph-svg"
          role="img"
          aria-label={`Projected balance of ${money(balance)} after ${years} years`}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="compoundFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dbab47" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#dbab47" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {/* grid lines */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={PAD.top + f * (H - PAD.top - PAD.bottom)}
              y2={PAD.top + f * (H - PAD.top - PAD.bottom)}
              stroke="#ffffff14"
              strokeDasharray="3 4"
            />
          ))}
          <path d={areaPath} fill="url(#compoundFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#dbab47"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((p, i) => (
            <circle
              key={p.label}
              cx={toX(p.x)}
              cy={toY(p.y)}
              r={hover === i ? 5 : 3.5}
              fill="#0b2638"
              stroke="#dbab47"
              strokeWidth="2"
              style={{ transition: "r .15s ease" }}
            >
              <title>{`${p.label}: ${money(p.y)}`}</title>
            </circle>
          ))}
          {/* hover crosshair */}
          {hovered && (
            <g className="compound-graph-hover" pointerEvents="none">
              <line
                x1={hoverX}
                x2={hoverX}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="#dbab47"
                strokeOpacity="0.4"
                strokeDasharray="3 3"
              />
              <circle cx={hoverX} cy={hoverY} r="7" fill="#dbab47" fillOpacity="0.25" />
              <circle cx={hoverX} cy={hoverY} r="4" fill="#dbab47" stroke="#0b2638" strokeWidth="2" />
            </g>
          )}
          {/* x-axis labels */}
          {points.map((p) => (
            <text
              key={`t-${p.label}`}
              x={toX(p.x)}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#ffffff80"
            >
              {p.x}y
            </text>
          ))}
          {/* invisible hover targets */}
          {points.map((p, i) => (
            <rect
              key={`h-${p.label}`}
              x={toX(p.x) - (W - PAD.left - PAD.right) / years / 2}
              y={PAD.top}
              width={(W - PAD.left - PAD.right) / years}
              height={H - PAD.top - PAD.bottom}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}
        </svg>
        {hovered && (
          <div
            className="compound-graph-tooltip"
            style={{
              left: `${(hoverX / W) * 100}%`,
              top: `${(hoverY / H) * 100}%`,
            }}
          >
            <strong>{money(hovered.y)}</strong>
            <span>{hovered.label}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Benefit({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="benefit">
      <Heading level={3}>{title}</Heading>
      <p className="benefit-subtitle">{subtitle}</p>
      <p>{children}</p>
    </div>
  )
}
