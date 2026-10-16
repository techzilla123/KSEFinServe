import {
  createElement,
  useEffect,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactNode,
} from "react"

const assetPathPrefix = "/assets"
const artwork = {
  logo: `${assetPathPrefix}/logo-ksefin.webp`,
  footerLogo: `${assetPathPrefix}/14b9a.webp`,
  chevron: `${assetPathPrefix}/32174.svg`,
}

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
interface ArtProps {
  src: string
  className?: string
}
function Art({ src, className = "" }: ArtProps) {
  return (
    <img src={src} alt="" aria-hidden="true" className={`art ${className}`} />
  )
}
function Eyebrow({
  className = "",
  ...props
}: ComponentProps<"p">) {
  return createElement("p", {
    ...props,
    className: `eyebrow ${className}`,
  })
}

interface SiteLayoutProps {
  children: ReactNode
  navigate: (path: string) => void
  setPanel: (panel: Panel | null) => void
  setMobileMenu: (open: boolean | ((v: boolean) => boolean)) => void
  mobileMenu: boolean
  eventsMenuOpen: boolean
  setEventsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  calcMenuOpen: boolean
  setCalcMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  workMenuOpen: boolean
  setWorkMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  eventsMenuRef: React.RefObject<HTMLDivElement | null>
  calcMenuRef: React.RefObject<HTMLDivElement | null>
  workMenuRef: React.RefObject<HTMLDivElement | null>
  growing: number | null
  setGrowing: (v: number | null) => void
  socials: Array<{ label: string; href: string; icon: string }>
  hideAboutNav?: boolean
  hideContactNav?: boolean
  hideServiceNav?: boolean
  hideCareerNav?: boolean
  isLanding?: boolean
  hideCareerNavOnly?: boolean
}

export default function SiteLayout({
  children,
  navigate,
  setPanel,
  setMobileMenu,
  mobileMenu,
  eventsMenuOpen,
  setEventsMenuOpen,
  calcMenuOpen,
  setCalcMenuOpen,
  workMenuOpen,
  setWorkMenuOpen,
  eventsMenuRef,
  calcMenuRef,
  workMenuRef,
  growing,
  setGrowing,
  socials,
  hideAboutNav = false,
  hideContactNav = false,
  hideServiceNav = false,
  hideCareerNav = false,
  isLanding = false,
  hideCareerNavOnly = false,
}: SiteLayoutProps) {
  useEffect(() => {
    if (!calcMenuOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (calcMenuRef.current?.contains(event.target as Node)) return
      if ((event.target as HTMLElement).closest("dialog")) return
      setCalcMenuOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [calcMenuOpen, calcMenuRef, setCalcMenuOpen])

  useEffect(() => {
    if (!eventsMenuOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (eventsMenuRef.current?.contains(event.target as Node)) return
      if ((event.target as HTMLElement).closest("dialog")) return
      setEventsMenuOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [eventsMenuOpen, eventsMenuRef, setEventsMenuOpen])

  useEffect(() => {
    if (!workMenuOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (workMenuRef.current?.contains(event.target as Node)) return
      if ((event.target as HTMLElement).closest("dialog")) return
      setWorkMenuOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [workMenuOpen, workMenuRef, setWorkMenuOpen])

  return (
    <>
      <header className="site-header">
        <div className="header-inner container flex items-center justify-between">
          <Link
            href="/"
            aria-label="Home"
            className="logo-link"
            onClick={(e) => { e.preventDefault(); navigate("/") }}
          >
            <img src={artwork.logo} alt="Kayode Samson Elepe" />
          </Link>
          <nav
            aria-label="Main navigation"
            className="desktop-nav flex items-center"
          >
            {!hideAboutNav && (
              <Link href="/about" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/about") }}>
                About
              </Link>
            )}
            {!hideServiceNav && (
              <Link href="/service" className="nav-item">
                Service
              </Link>
            )}
            {!hideCareerNav && !hideCareerNavOnly && (
              <Link href="/career" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/career") }}>
                Career
              </Link>
            )}
            {isLanding && (
              <div className="nav-calculator-wrap" ref={workMenuRef}>
                <Button
                  className="nav-item nav-work"
                  aria-haspopup="true"
                  aria-expanded={workMenuOpen}
                  onClick={() => setWorkMenuOpen((v) => !v)}
                >
                  Work <Art src={artwork.chevron} />
                </Button>
                {workMenuOpen && (
                  <div className="nav-calculator-menu" role="menu">
                    <Link
                      href="/career"
                      role="menuitem"
                      className="nav-calculator-item"
                      onClick={(e) => {
                        e.preventDefault()
                        setWorkMenuOpen(false)
                        navigate("/career")
                      }}
                    >
                      Career
                    </Link>
                    <Link
                      href="/#testimonials"
                      role="menuitem"
                      className="nav-calculator-item"
                      onClick={(e) => {
                        e.preventDefault()
                        setWorkMenuOpen(false)
                        navigate("/#testimonials")
                      }}
                    >
                      Testimonial
                    </Link>
                  </div>
                )}
              </div>
            )}
            {!isLanding && (
              <Link href="/#testimonials" className="nav-item">
                Testimonial
              </Link>
            )}
            {!hideContactNav && (
              <button
                className="nav-item"
                onClick={() => navigate("/contact")}
              >
                Contact
              </button>
            )}
            <div className="nav-calculator-wrap" ref={eventsMenuRef}>
              <Button
                className="nav-item nav-events"
                aria-haspopup="true"
                aria-expanded={eventsMenuOpen}
                onClick={() => setEventsMenuOpen((v) => !v)}
              >
                Updates <Art src={artwork.chevron} />
              </Button>
              {eventsMenuOpen && (
                <div className="nav-calculator-menu" role="menu">
                  <Link
                    href="/events"
                    role="menuitem"
                    className="nav-calculator-item"
                    onClick={() => setEventsMenuOpen(false)}
                  >
                    Events
                  </Link>
                  <Link
                    href="/insights"
                    role="menuitem"
                    className="nav-calculator-item"
                    onClick={() => setEventsMenuOpen(false)}
                  >
                    Insights
                  </Link>
                </div>
              )}
            </div>
            <div className="nav-calculator-wrap" ref={calcMenuRef}>
              <Button
                className="nav-calculator"
                aria-haspopup="true"
                aria-expanded={calcMenuOpen}
                onClick={() => setCalcMenuOpen((v) => !v)}
              >
                Calculators <Art src={artwork.chevron} />
              </Button>
              {calcMenuOpen && (
                <div className="nav-calculator-menu" role="menu">
                  {calculators.map((calculator) => (
                    <button
                      key={calculator}
                      type="button"
                      role="menuitem"
                      className="nav-calculator-item"
                      onClick={() => {
                        setCalcMenuOpen(false)
                        setPanel({ kind: "calculator", calculator })
                      }}
                    >
                      {calculator}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
              ...(hideAboutNav ? [] : [["About", "/about"]] as const),
              ...(hideServiceNav ? [] : [["Service", "/service"]] as const),
              ...(hideCareerNav ? [] : [["Career", "/career"]] as const),
              ["Testimonial", "/#testimonials"],
              ...(hideContactNav ? [] : [["Contact", "/contact"]] as const),
            ].map(([label, id]) => (
              <Link
                key={id}
                href={id}
                onClick={(e) => { e.preventDefault(); setMobileMenu(false); navigate(id) }}
              >
                {label}
              </Link>
            ))}
            <div className="mobile-dropdown">
              <Button
                variant="text"
                aria-haspopup="true"
                aria-expanded={eventsMenuOpen}
                onClick={(e) => {
                  e.stopPropagation()
                  setEventsMenuOpen((v) => !v)
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                Updates <Art src={artwork.chevron} className="mobile-chevron" />
              </Button>
              {eventsMenuOpen && (
                <div className="mobile-dropdown-menu" role="menu">
                  <Link
                    href="/events"
                    role="menuitem"
                    onClick={() => {
                      setEventsMenuOpen(false)
                      setMobileMenu(false)
                    }}
                  >
                    Events
                  </Link>
                  <Link
                    href="/insights"
                    role="menuitem"
                    onClick={() => {
                      setEventsMenuOpen(false)
                      setMobileMenu(false)
                    }}
                  >
                    Insights
                  </Link>
                </div>
              )}
            </div>
            <div className="mobile-dropdown">
              <Button
                variant="text"
                aria-haspopup="true"
                aria-expanded={calcMenuOpen}
                onClick={(e) => {
                  e.stopPropagation()
                  setCalcMenuOpen((v) => !v)
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                Calculators <Art src={artwork.chevron} className="mobile-chevron" />
              </Button>
              {calcMenuOpen && (
                <div className="mobile-dropdown-menu" role="menu">
                  {calculators.map((calculator) => (
                    <button
                      key={calculator}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setCalcMenuOpen(false)
                        setMobileMenu(false)
                        setPanel({ kind: "calculator", calculator })
                      }}
                    >
                      {calculator}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        )}
      </header>
      {children}
      <footer className="site-footer">
        <div className="container footer-top text-center">
          <div className="skyline flex items-end justify-center">
            {Array.from({ length: 32 }, (_, i) => (
              <button type="button" className={`building building-${i % 8}`} key={i} onClick={(e) => { const el = e.currentTarget; el.classList.remove("is-growing"); void el.offsetWidth; el.classList.add("is-growing"); window.setTimeout(() => el.classList.remove("is-growing"), 900) }} aria-label="Grow the skyline">
                {i === 14 && (<svg width="52" height="148" viewBox="0 0 52 148" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 4C0 1.79086 1.79086 0 4 0H48C50.2091 0 52 1.79086 52 4V8H0V4Z" fill="#0099E6" /><g clipPath="url(#clip0_220_860)"><rect width="52" height="140" transform="translate(0 8)" fill="#1A6A9A" /><rect opacity="0.9" x="6" y="16" width="12" height="6" fill="#0077B5" /><rect opacity="0.9" x="24" y="16" width="12" height="6" fill="#0077B5" /><rect opacity="0.8" x="42" y="16" width="12" height="6" fill="#00AADD" /><rect opacity="0.7" x="6" y="28" width="12" height="6" fill="#0077B5" /><rect opacity="0.9" x="24" y="28" width="12" height="6" fill="#00AADD" /><rect opacity="0.7" x="42" y="28" width="12" height="6" fill="#0077B5" /><rect opacity="0.8" x="6" y="40" width="12" height="6" fill="#00AADD" /><rect opacity="0.9" x="24" y="40" width="12" height="6" fill="#0077B5" /><rect opacity="0.7" x="42" y="40" width="12" height="6" fill="#0077B5" /><rect opacity="0.9" x="6" y="52" width="12" height="6" fill="#0077B5" /><rect opacity="0.7" x="24" y="52" width="12" height="6" fill="#0077B5" /><rect opacity="0.9" x="42" y="52" width="12" height="6" fill="#00AADD" /><rect opacity="0.7" x="6" y="64" width="12" height="6" fill="#00AADD" /><rect opacity="0.9" x="24" y="64" width="12" height="6" fill="#0077B5" /><rect opacity="0.8" x="42" y="64" width="12" height="6" fill="#0077B5" /><rect opacity="0.8" x="6" y="76" width="12" height="6" fill="#0077B5" /><rect opacity="0.8" x="24" y="76" width="12" height="6" fill="#00AADD" /><rect opacity="0.9" x="42" y="76" width="12" height="6" fill="#0077B5" /><rect opacity="0.9" x="6" y="88" width="12" height="6" fill="#0077B5" /><rect opacity="0.7" x="24" y="88" width="12" height="6" fill="#0077B5" /><rect opacity="0.8" x="42" y="88" width="12" height="6" fill="#00AADD" /></g><defs><clipPath id="clip0_220_860"><rect width="52" height="140" fill="white" transform="translate(0 8)" /></clipPath></defs></svg>)}
              </button>
            ))}
          </div>
          <Heading>Build Wealth with Clarity.</Heading>
          <p>Compounding decisions. Compounding results. One clear path upward.</p>
        </div>
        <div className="container footer-bottom">
          <div className="footer-nav flex items-center justify-between">
            <Link href="/" aria-label="Home" onClick={(e) => { e.preventDefault(); navigate("/") }}><img src={artwork.footerLogo} alt="Kayode Samson Elepe" className="footer-logo" /></Link>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-6">
              <Link href="/about" onClick={(e) => { e.preventDefault(); navigate("/about") }}>About</Link>
              <Link href="/service" onClick={(e) => { e.preventDefault(); navigate("/service") }}>How I Can Help</Link>
              <Link href="/career" onClick={(e) => { e.preventDefault(); navigate("/career") }}>Career</Link>
              <Link href="/#testimonials" onClick={(e) => { e.preventDefault(); navigate("/#testimonials") }}>Testimonial</Link>
              <Link href="/" onClick={(e) => { e.preventDefault(); navigate("/") }}>Events</Link>
              <a href="/contact" onClick={(e) => { e.preventDefault(); navigate("/contact") }}>Contact Us</a>
            </nav>
            <div className="footer-socials">
              <a href="https://www.linkedin.com/company/ksefinserve" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg></a>
              <a href="https://www.instagram.com/ksefinserve/" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
              <a href="https://www.facebook.com/profile.php?id=61594901164606" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-social"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
              <a href="https://www.youtube.com/@KSEFinServe" target="_blank" rel="noreferrer" aria-label="YouTube" className="footer-social"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg></a>
              <a href="https://www.tiktok.com/@ksefinserve" target="_blank" rel="noreferrer" aria-label="TikTok" className="footer-social"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg></a>
            </div>
          </div>
          <div className="footer-calculators flex items-center justify-between">
            <Eyebrow className="footer-calculators-title">Financial Calculators</Eyebrow>
            <div className="flex flex-wrap gap-6">
              {calculators.map((calculator) => (<Button key={calculator} variant="text" onClick={() => setPanel({ kind: "calculator", calculator })}>{calculator}</Button>))}
            </div>
          </div>
          <div className="footer-copyright flex flex-wrap items-center justify-between gap-3">
            <p>© 2026 KSEFinServe. All rights reserved.</p>
            <p>Clarity · Growth · Impact</p>
          </div>
        </div>
      </footer>
    </>
  )
}
