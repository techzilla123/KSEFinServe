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

const assetPathPrefix = "/assets"
const artwork = {
  logo: `${assetPathPrefix}/logo-ksefin.webp`,
  footerLogo: `${assetPathPrefix}/14b9a.webp`,
  portrait: `${assetPathPrefix}/eab0f.webp`,
  story: `${assetPathPrefix}/72dcc.webp`,
  macPhini: `${assetPathPrefix}/83ae0.webp`,
  cifp: `${assetPathPrefix}/1cf6f.webp`,
  rrc: `${assetPathPrefix}/8b8a5.webp`,
  million: `${assetPathPrefix}/a1806.webp`,
  forest: `${assetPathPrefix}/bee26.webp`,
  wave: `${assetPathPrefix}/acbaa.webp`,
  land: `${assetPathPrefix}/22153.webp`,
  anna: `${assetPathPrefix}/994e3.webp`,
  roopam: `${assetPathPrefix}/de2e6.webp`,
  jared: `${assetPathPrefix}/34b30.webp`,
  wealth: `${assetPathPrefix}/99851.webp`,
  advisors: `${assetPathPrefix}/ee9ac.webp`,
  building: `${assetPathPrefix}/3ec07.webp`,
  wealthCard: `${assetPathPrefix}/e9615.webp`,
  guideCard: `${assetPathPrefix}/1a476.webp`,
  careerCard: `${assetPathPrefix}/5ae3f.webp`,
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
  ...props
}: Omit<ComponentProps<"a">, "href"> & {
  variant?: "navy" | "gold" | "white" | "text"
}) {
  return (
    <Link
      {...props}
      href="https://calendly.com/kay-business360/discovery_call"
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
    lines: ["ELVIS", "PRESLEY"],
    footer: "ALL STAR SHOW",
    size: 56.6,
  },
  {
    background: "#a78b54",
    color: "#44251c",
    lines: ["HANK SNOW", "DICK CURLESS"],
    footer: "AND RAINBOW RANCH BOYS",
    size: 56.6,
  },
  {
    background: "#793e28",
    color: "#c89b48",
    lines: ["MUSIC CITY", "USA"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#a65b30",
    color: "#301b16",
    lines: ["NASHVILLE", "TENNESSEE"],
    footer: "GRAND OLE OPRY",
    size: 56.6,
  },
  {
    background: "#493523",
    color: "#bd8632",
    lines: ["W", "GOOD", "OLD"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#793e28",
    color: "#c89b48",
    lines: ["ELVIS PRESLEY"],
    footer: "STARRING IN PERSON",
    size: 56.6,
  },
  {
    background: "#ae7a41",
    color: "#572819",
    lines: ["COUNTRY", "HEART", "SOUL"],
    footer: "",
    size: 79.3,
  },
  {
    background: "#a65b30",
    color: "#301b16",
    lines: ["NASHVILLE", "TENNESSEE"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#793e28",
    color: "#c89b48",
    lines: ["WELCOME", "TO ME"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#493523",
    color: "#bd8632",
    lines: ["OPRY"],
    footer: "",
    size: 128.7,
  },
  {
    background: "#ae7a41",
    color: "#572819",
    lines: ["ELVIS", "PRESLEY"],
    footer: "MATINEE AND NIGHT SHOWS",
    size: 56.6,
  },
  {
    background: "#a65b30",
    color: "#301b16",
    lines: ["$20", "LIVE MUSIC"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#ae7a41",
    color: "#572819",
    lines: ["NASHVILLE", "TENNESSEE"],
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
    lines: ["TENNESSEE", "★ ★ ★"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#a65b30",
    color: "#301b16",
    lines: ["COUNTRY", "MUSIC"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#ae7a41",
    color: "#572819",
    lines: ["THE", "SOUTH"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#793e28",
    color: "#c89b48",
    lines: ["MUSIC", "CITY USA"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#ae7a41",
    color: "#572819",
    lines: ["GRAND OLE", "OPRY"],
    footer: "",
    size: 56.6,
  },
  {
    background: "#493523",
    color: "#bd8632",
    lines: ["NASHVILLE"],
    footer: "",
    size: 56.6,
  },
]
const calculators = [
  "Tax Calculator",
  "College Savings",
  "Debt Repayment",
  "Retirement Planning",
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
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
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
  const dialog = useRef<HTMLDialogElement>(null)
  useScrollReveal()
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

  return (
    <>
      <Link href="#main" className="skip-link">
        Skip to content
      </Link>
      <header className="site-header">
        <div className="header-inner container flex items-center justify-between">
          <Link
            href="#home"
            aria-label="Home"
            className="logo-link"
          >
            <img src={artwork.logo} alt="Kayode Samson Elepe" />
          </Link>
          <nav
            aria-label="Main navigation"
            className="desktop-nav flex items-center"
          >
            <Link href="#about" className="nav-item">
              About
            </Link>
            <Link href="#work" className="nav-item">
              Work
            </Link>
            <Link href="#testimonials" className="nav-item">
              Testimonial
            </Link>
            <Link href="#insights" className="nav-item">
              Events
            </Link>
            <Button
              className="nav-calculator"
              onClick={() =>
                setPanel({
                  kind: "calculator",
                  calculator: "Retirement Planning",
                })
              }
            >
              Calculators <Art src={artwork.chevron} />
            </Button>
          </nav>
          <div className="flex items-center gap-3">
            <BookingLink className="header-book">Book a Session</BookingLink>
            <Button
              variant="text"
              className="menu-toggle"
              aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileMenu}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? "×" : "☰"}
            </Button>
          </div>
        </div>
        {mobileMenu && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mobile-nav"
          >
            {[
              ["About", "about"],
              ["Work", "work"],
              ["Testimonial", "testimonials"],
              ["Events", "insights"],
            ].map(([label, id]) => (
              <Link
                key={id}
                href={`#${id}`}
                onClick={() => setMobileMenu(false)}
              >
                {label}
              </Link>
            ))}
            <Button
              variant="text"
              onClick={() => {
                setMobileMenu(false)
                setPanel({
                  kind: "calculator",
                  calculator: "Retirement Planning",
                })
              }}
            >
              Calculators
            </Button>
          </nav>
        )}
      </header>

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
                    text={["Clarity.", "Purpose.", "Legacy."]}
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
                Kayode S.
                <br />
                Elepe, RR
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
            <div className="trusted-logos grid">
              {[
                ["MacPhini Foundation", artwork.macPhini],
                ["The Canadian Institute of Financial Planning", artwork.cifp],
                ["Registered Retirement Consultant", artwork.rrc],
                ["1Mfor1T", artwork.million],
                ["MacPhini Foundation", artwork.macPhini],
              ].map(([label, src], i) => (
                <div key={`${label}-${i}`}>
                  <img src={src} alt={label} />
                </div>
              ))}
            </div>
            <div className="trusted-marquee" aria-hidden="true">
              <div className="trusted-marquee-track">
                {[
                  ["MacPhini Foundation", artwork.macPhini],
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
                    <img src={src} alt="" />
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
                  onClick={() => setPanel({ kind: "story" })}
                >
                  Watch My Story
                </Button>
                <Link href="#contact" className="button button-contact">
                  Get in Touch
                </Link>
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
                MEET{" "}
                <br />
                KAYODE S.{" "}
                <br />
                <span>ELEPE,</span>{" "}
                <br />
                RR
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
                <BookingLink variant="text" className="work-card career-work">
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
              <BookingLink
                variant="text"
                className="session-seal"
                aria-label="Book a session"
              >
                <Art src={artwork.seal} />
                <span>BOOK SESSION</span>
                <Art src={artwork.arrow} />
              </BookingLink>
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
              onClick={() => {
                const isMobile = window.matchMedia("(max-width: 599px)").matches
                if (isMobile) setInsightsModal(true)
                else setShowInsights(!showInsights)
              }}
              aria-expanded={showInsights}
            >
              {showInsights ? "Back to collage" : "View all insights"}
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
                    <Link className="button button-navy" href="#about">
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

      <footer className="site-footer">
        <div className="container footer-top text-center">
          <div className="skyline flex items-end justify-center">
            {Array.from({ length: 32 }, (_, i) => (
              <button
                type="button"
                className={`building building-${i % 8}`}
                key={i}
                onClick={(e) => {
                  const el = e.currentTarget
                  el.classList.remove("is-growing")
                  // force reflow so the animation can restart
                  void el.offsetWidth
                  el.classList.add("is-growing")
                  window.setTimeout(() => el.classList.remove("is-growing"), 900)
                }}
                aria-label="Grow the skyline"
              >
                {i === 14 && (
                  <svg
                    width="52"
                    height="148"
                    viewBox="0 0 52 148"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 4C0 1.79086 1.79086 0 4 0H48C50.2091 0 52 1.79086 52 4V8H0V4Z"
                      fill="#0099E6"
                    />
                    <g clipPath="url(#clip0_220_860)">
                      <rect
                        width="52"
                        height="140"
                        transform="translate(0 8)"
                        fill="#1A6A9A"
                      />
                      <rect opacity="0.9" x="6" y="16" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.9" x="24" y="16" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.8" x="42" y="16" width="12" height="6" fill="#00AADD" />
                      <rect opacity="0.7" x="6" y="28" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.9" x="24" y="28" width="12" height="6" fill="#00AADD" />
                      <rect opacity="0.7" x="42" y="28" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.8" x="6" y="40" width="12" height="6" fill="#00AADD" />
                      <rect opacity="0.9" x="24" y="40" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.7" x="42" y="40" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.9" x="6" y="52" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.7" x="24" y="52" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.9" x="42" y="52" width="12" height="6" fill="#00AADD" />
                      <rect opacity="0.7" x="6" y="64" width="12" height="6" fill="#00AADD" />
                      <rect opacity="0.9" x="24" y="64" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.8" x="42" y="64" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.8" x="6" y="76" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.8" x="24" y="76" width="12" height="6" fill="#00AADD" />
                      <rect opacity="0.9" x="42" y="76" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.9" x="6" y="88" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.7" x="24" y="88" width="12" height="6" fill="#0077B5" />
                      <rect opacity="0.8" x="42" y="88" width="12" height="6" fill="#00AADD" />
                    </g>
                    <defs>
                      <clipPath id="clip0_220_860">
                        <rect
                          width="52"
                          height="140"
                          fill="white"
                          transform="translate(0 8)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                )}
              </button>
            ))}
          </div>
          <Heading>Build Wealth with Clarity.</Heading>
          <p>
            Compounding decisions. Compounding results. One clear path upward.
          </p>
        </div>
        <div className="container footer-bottom">
          <div className="footer-nav flex items-center justify-between">
            <Link href="#home" aria-label="Home">
              <img
                src={artwork.footerLogo}
                alt="Kayode Samson Elepe"
                className="footer-logo"
              />
            </Link>
            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap gap-6"
            >
              <Link href="#about">About</Link>
              <Link href="#work">How I Can Help</Link>
              <Link href="#testimonials">Testimonial</Link>
              <Link href="#insights">Events</Link>
              <Link href="#contact">Contact Us</Link>
            </nav>
            <Link
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit LinkedIn"
              className="linkedin-link"
            >
              <Art src={artwork.linkedin} />
            </Link>
          </div>
          <div className="footer-calculators flex items-center justify-between">
            <Eyebrow>Financial Calculators</Eyebrow>
            <div className="flex flex-wrap gap-6">
              {calculators.map((calculator) => (
                <Button
                  key={calculator}
                  variant="text"
                  onClick={() => setPanel({ kind: "calculator", calculator })}
                >
                  {calculator}
                </Button>
              ))}
            </div>
          </div>
          <div className="footer-copyright flex flex-wrap items-center justify-between gap-3">
            <p>© 2026 Kayode Samson Elepe. All rights reserved.</p>
            <p>Clarity · Growth · Impact</p>
          </div>
        </div>
      </footer>

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
                <div className="calculator-switch flex flex-wrap gap-2">
                  {calculators.map((calculator) => (
                    <Button
                      key={calculator}
                      variant={
                        calculator === panel.calculator ? "navy" : "white"
                      }
                      aria-pressed={calculator === panel.calculator}
                      onClick={() =>
                        setPanel({ kind: "calculator", calculator })
                      }
                    >
                      {calculator}
                    </Button>
                  ))}
                </div>
                <div className="calculator-fields grid">
                  {panel.calculator === "Tax Calculator" ? (
                    <>
                      <label>
                        Annual income (CAD)
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
                          ? "Current balance (CAD)"
                          : "Starting savings (CAD)"}
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
                          Monthly contribution (CAD)
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
                <small>
                  Illustrative estimates in Canadian dollars, not financial or
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
    </>
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
