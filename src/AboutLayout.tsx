import { useState } from "react"

const assetPathPrefix = "/assets"

function Art({ src, className }: { src: string; className?: string }) {
  return <img src={src} alt="" className={className} />
}

const artwork = {
  logo: `${assetPathPrefix}/logo-ksefinserve.webp`,
  footerLogo: `${assetPathPrefix}/14b9a.webp`,
  chevron: `${assetPathPrefix}/32174.svg`,
  linkedin: `${assetPathPrefix}/d6da3.svg`,
}

const calculators = [
  "Compound Interest",
  "Retirement Planning",
  "Mortgage",
  "Investment Growth",
  "Savings Goal",
  "Debt Paydown",
]

interface LayoutProps {
  children: React.ReactNode
  navigate: (path: string) => void
  setPanel: (panel: any) => void
  setMobileMenu: (open: boolean) => void
  mobileMenu: boolean
  eventsMenuOpen: boolean
  setEventsMenuOpen: (fn: boolean | ((v: boolean) => boolean)) => void
  calcMenuOpen: boolean
  setCalcMenuOpen: (fn: boolean | ((v: boolean) => boolean)) => void
  eventsMenuRef: React.RefObject<HTMLDivElement | null>
  calcMenuRef: React.RefObject<HTMLDivElement | null>
  growing: number | null
  setGrowing: (i: number) => void
  socials: { label: string; href: string; icon: string }[]
}

export function AboutLayout({
  children,
  navigate,
  setPanel,
  setMobileMenu,
  mobileMenu,
  eventsMenuOpen,
  setEventsMenuOpen,
  calcMenuOpen,
  setCalcMenuOpen,
  eventsMenuRef,
  calcMenuRef,
  growing,
  setGrowing,
  socials,
}: LayoutProps) {
  return (
    <>
      <header className="site-header">
        <div className="header-inner container flex items-center justify-between">
          <a href="/" aria-label="Home" className="logo-link" onClick={(e) => { e.preventDefault(); navigate("/") }}>
            <img src={artwork.logo} alt="Kayode Samson Elepe" />
          </a>
          <nav aria-label="Main navigation" className="desktop-nav flex items-center">
            <a href="/" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/") }}>Service</a>
            <a href="/" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/") }}>Testimonial</a>
            <a href="/contact" className="nav-item" onClick={(e) => { e.preventDefault(); navigate("/contact") }}>Contact</a>
            <div className="nav-calculator-wrap" ref={eventsMenuRef}>
              <button className="nav-item nav-events" aria-haspopup="true" aria-expanded={eventsMenuOpen} onClick={() => setEventsMenuOpen(!eventsMenuOpen)}>
                Updates <Art src={artwork.chevron} />
              </button>
              {eventsMenuOpen && (
                <div className="nav-calculator-menu" role="menu">
                  <a href="/" role="menuitem" className="nav-calculator-item" onClick={(e) => { e.preventDefault(); setEventsMenuOpen(false); navigate("/") }}>Events</a>
                  <a href="/" role="menuitem" className="nav-calculator-item" onClick={(e) => { e.preventDefault(); setEventsMenuOpen(false); navigate("/") }}>Insights</a>
                </div>
              )}
            </div>
            <div className="nav-calculator-wrap" ref={calcMenuRef}>
              <button className="nav-calculator" aria-haspopup="true" aria-expanded={calcMenuOpen} onClick={() => setCalcMenuOpen(!calcMenuOpen)}>
                Calculators <Art src={artwork.chevron} />
              </button>
              {calcMenuOpen && (
                <div className="nav-calculator-menu" role="menu">
                  {calculators.map((calculator) => (
                    <button key={calculator} type="button" role="menuitem" className="nav-calculator-item" onClick={() => { setCalcMenuOpen(false); setPanel({ kind: "calculator", calculator }) }}>
                      {calculator}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <div className="flex items-center gap-3">
            <a href="https://calendly.com/kay-business360/discovery_call" className="button button-navy header-book">Book a Session</a>
            <button className="menu-toggle" aria-label={mobileMenu ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenu} aria-controls="mobile-navigation" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? "×" : "☰"}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-nav">
            {[["Service", "/"], ["Testimonial", "/#testimonials"]].map(([label, id]) => (
              <a key={label} href={id} onClick={(e) => { e.preventDefault(); setMobileMenu(false); navigate("/") }}>{label}</a>
            ))}
            <a href="/contact" onClick={(e) => { e.preventDefault(); setMobileMenu(false); navigate("/contact") }}>Contact</a>
            <div className="mobile-dropdown">
              <button className="mobile-nav-btn" aria-haspopup="true" aria-expanded={eventsMenuOpen} onClick={(e) => { e.stopPropagation(); setEventsMenuOpen(!eventsMenuOpen) }} onPointerDown={(e) => e.stopPropagation()}>
                Updates <Art src={artwork.chevron} className="mobile-chevron" />
              </button>
              {eventsMenuOpen && (
                <div className="mobile-dropdown-menu" role="menu">
                  <a href="/" role="menuitem" onClick={(e) => { e.preventDefault(); setEventsMenuOpen(false); setMobileMenu(false); navigate("/") }}>Events</a>
                  <a href="/" role="menuitem" onClick={(e) => { e.preventDefault(); setEventsMenuOpen(false); setMobileMenu(false); navigate("/") }}>Insights</a>
                </div>
              )}
            </div>
            <div className="mobile-dropdown">
              <button className="mobile-nav-btn" aria-haspopup="true" aria-expanded={calcMenuOpen} onClick={(e) => { e.stopPropagation(); setCalcMenuOpen(!calcMenuOpen) }} onPointerDown={(e) => e.stopPropagation()}>
                Calculators <Art src={artwork.chevron} className="mobile-chevron" />
              </button>
              {calcMenuOpen && (
                <div className="mobile-dropdown-menu" role="menu">
                  {calculators.map((calculator) => (
                    <button key={calculator} type="button" role="menuitem" onClick={() => { setCalcMenuOpen(false); setMobileMenu(false); setPanel({ kind: "calculator", calculator }) }}>
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
          <h2>Build Wealth with Clarity.</h2>
          <p>Compounding decisions. Compounding results. One clear path upward.</p>
        </div>
        <div className="container footer-bottom">
          <div className="footer-nav flex items-center justify-between">
            <a href="/" aria-label="Home" onClick={(e) => { e.preventDefault(); navigate("/") }}><img src={artwork.footerLogo} alt="Kayode Samson Elepe" className="footer-logo" /></a>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-6">
              <a href="/about" onClick={(e) => { e.preventDefault(); navigate("/about") }}>About</a>
              <a href="/" onClick={(e) => { e.preventDefault(); navigate("/service") }}>How I Can Help</a>
              <a href="/" onClick={(e) => { e.preventDefault(); navigate("/#testimonials") }}>Testimonial</a>
              <a href="/" onClick={(e) => { e.preventDefault(); navigate("/") }}>Events</a>
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
            <span className="footer-calculators-title">Financial Calculators</span>
            <div className="flex flex-wrap gap-6">
              {calculators.map((calculator) => (
                <button key={calculator} type="button" onClick={() => setPanel({ kind: "calculator", calculator })}>{calculator}</button>
              ))}
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
