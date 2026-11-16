import { FormEvent, useEffect, useRef, useState } from "react"
import { useBookings } from "./admin/bookingsDirectory"
import "./insurance.css"

const assets = "/assets"

export default function InsurancePage() {
  const { submitBooking } = useBookings()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle")
  const [currentStep, setCurrentStep] = useState(1)
  const formRef = useRef<HTMLFormElement>(null)
  const [vslPlaying, setVslPlaying] = useState(false)
  const vslVideoRef = useRef<HTMLVideoElement>(null)
  const vslPlayRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const root = document.querySelector('.insurance-page')
    if (!root || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )
    root.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formStatus === "sending") return

    const form = event.currentTarget
    const data = new FormData(form)
    const firstName = String(data.get("firstName") ?? "")
    const lastName = String(data.get("lastName") ?? "")
    const email = String(data.get("email") ?? "")
    const phone = String(data.get("phone") ?? "")
    const city = String(data.get("city") ?? "")
    const province = String(data.get("province") ?? "")
    const country = String(data.get("country") ?? "")

    setFormStatus("sending")

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      province: province.trim(),
      country: country.trim() || "United States",
      contactMethod: "Email",
      source: "Insurance Page",
      route: "Short form",
      path: "Wealth Protection",
      topic: "Wealth Protection Review",
      note: "",
      availableDate: "",
      availableTime: "",
      consentContact: true,
      consentUpdates: false,
    }

    try {
      const result = await submitBooking(payload)
      if (result.error) throw new Error(result.error)
      setFormStatus("sent")
      setTimeout(() => {
        setFormStatus("idle")
        setIsFormOpen(false)
        setCurrentStep(1)
        formRef.current?.reset()
      }, 2000)
    } catch {
      setFormStatus("failed")
    }
  }

  const playVsl = () => {
    setVslPlaying(true)
    if (vslPlayRef.current) vslPlayRef.current.hidden = true
    if (vslVideoRef.current) {
      vslVideoRef.current.controls = true
      vslVideoRef.current.play().catch(() => {})
    }
  }

  const handleVideoEnded = () => {
    setVslPlaying(false)
    if (vslVideoRef.current) {
      vslVideoRef.current.controls = false
      vslVideoRef.current.load()
    }
    if (vslPlayRef.current) vslPlayRef.current.hidden = false
  }

  const nextStep = () => {
    const stepEl = formRef.current?.querySelector(`.step[data-step="${currentStep}"]`)
    if (!stepEl) return
    const radios = stepEl.querySelectorAll('input[type="radio"]')
    const names = new Set([...radios].map(r => r.name))
    let valid = true
    names.forEach(name => {
      if (!stepEl.querySelector(`input[name="${name}"]:checked`)) valid = false
    })
    if (!valid) return
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleRadioChange = (name: string) => {
    const stepEl = formRef.current?.querySelector(`.step[data-step="${currentStep}"]`)
    if (!stepEl) return
    const radios = stepEl.querySelectorAll('input[type="radio"]')
    const names = new Set([...radios].map(r => r.name))
    if ([...names].every(n => stepEl.querySelector(`input[name="${n}"]:checked`))) {
      setTimeout(() => nextStep(), 200)
    }
  }

  return (
    <main className="insurance-page">
      {/* HERO */}
      <section className="insurance-hero" aria-labelledby="insurance-hero-title">
        <div className="gold-field" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">WEALTH PROTECTION</p>
            <h1 id="insurance-hero-title">
              Find Out Exactly How Much <span>Wealth Protection</span> Your Family Needs
            </h1>
            <p className="hero-subtitle">Get Your Free Wealth Protection Analysis</p>
            <p className="hero-description">
              Built with you on one short 1:1 call. Your coverage number, side-by-side options from A-rated carriers, and your rate-lock timeline — all tailored to your budget.
            </p>
            <div className="hero-actions">
              <button className="button button-strategy" onClick={() => setIsFormOpen(true)} type="button">
                Get My Free Analysis
              </button>
              <button className="button button-insights" onClick={() => document.getElementById("insurance-how")?.scrollIntoView({ behavior: "smooth" })} type="button">
                How It Works
              </button>
            </div>
            <p className="hero-topics">WEALTH&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;PROTECTION&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;LEGACY</p>
          </div>
          <div className="hero-portrait">
            <div className="vsl" id="vsl" className={vslPlaying ? "playing" : ""}>
              <div className="vsl-player">
                <video
                  ref={vslVideoRef}
                  id="vslVideo"
                  playsInline
                  preload="none"
                  poster={`${assets}/kayode-poster.png`}
                  onEnded={handleVideoEnded}
                >
                  <source src={`${assets}/kayode-story.mp4`} type="video/mp4" />
                </video>
                <button
                  ref={vslPlayRef}
                  type="button"
                  className="vsl-play"
                  id="vslPlay"
                  aria-label="Play video: Why I do what I do"
                  onClick={playVsl}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86A1 1 0 008 5.140z"/></svg>
                </button>
              </div>
              <div className="vsl-text">
                <p className="vsl-kicker">Watch · 1 minute</p>
                <h2>Why I do what I do</h2>
                <p>Hi, I am <span className="agent-name">Kayode Samson Elepe</span><span className="creds-suffix">, RR</span>. Before you look at any numbers, hear why this work matters to me.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STRIP */}
      <div className="impact" data-reveal>
        <div className="impact-item">
          <div className="impact-number">1,000+</div>
          <div className="impact-label">Advisors Developed</div>
        </div>
        <div className="impact-item">
          <div className="impact-number">4,500+</div>
          <div className="impact-label">Families & Professionals Served</div>
        </div>
        <div className="impact-item">
          <div className="impact-number">North America</div>
          <div className="impact-label">A Long-Term Perspective</div>
        </div>
      </div>

      {/* TRUST STRIP */}
      <div className="trust-strip">
        <div className="container wrap">
          <span>✦ Registered Representative, Financial Services</span>
          <span>✦ 1,000+ Advisors Developed Across North America</span>
          <span>✦ Engineering & Data Background (Shell, ExxonMobil, CMHC)</span>
          <span>✦ I compare multiple carriers for you</span>
          <span>✦ Many options with no medical exam</span>
          <span>✦ Free consultation</span>
          <span>✦ Serving professionals & business owners across North America</span>
        </div>
      </div>

      {/* WHO THIS IS FOR */}
      <section id="insurance-who" className="section" aria-labelledby="insurance-who-title">
        <div className="container">
          <div className="section-header" data-reveal>
            <p className="eyebrow">WHO THIS IS FOR</p>
            <h2 id="insurance-who-title">I Help People Who've Built Something Worth Protecting</h2>
            <p className="lead">You've worked hard to build your career, your business, your wealth. Let's make sure a serious illness or the unexpected never undoes it — for your family here and the loved ones who count on you.</p>
          </div>
          <div className="audience-grid" data-reveal>
            <article className="audience-card">
              <span className="card-number">01 →</span>
              <h3>Professionals & Business Owners</h3>
              <p>Your income keeps everything running. Protect it if a serious illness ever forces you to stop working.</p>
            </article>
            <article className="audience-card">
              <span className="card-number">02 →</span>
              <h3>Families Building a Life</h3>
              <p>You came here to give your family more. Let's make sure their future never depends on nothing going wrong.</p>
            </article>
            <article className="audience-card">
              <span className="card-number">03 →</span>
              <h3>Those Supporting Loved Ones Abroad</h3>
              <p>If parents or siblings rely on what you send, a plan can keep that support going even if something happens to you.</p>
            </article>
            <article className="audience-card">
              <span className="card-number">04 →</span>
              <h3>Homeowners & First-Time Buyers</h3>
              <p>You worked hard for that home. Make sure the mortgage never becomes your family's burden.</p>
            </article>
            <article className="audience-card">
              <span className="card-number">05 →</span>
              <h3>Parents Raising the Next Generation</h3>
              <p>Protect your children's education and future, and leave them a legacy to build on.</p>
            </article>
            <article className="audience-card">
              <span className="card-number">06 →</span>
              <h3>New to Wealth Planning</h3>
              <p>Financial protection works differently at scale. I'll explain it in plain language — no judgment, no pressure.</p>
            </article>
          </div>
        </div>
      </section>

      {/* WAYS I CAN HELP */}
      <section id="insurance-services" className="section section-slate" aria-labelledby="insurance-services-title">
        <div className="container">
          <div className="section-header light" data-reveal>
            <p className="eyebrow">WAYS I CAN HELP</p>
            <h2 id="insurance-services-title">Protection That Fits Your Life and Your Budget</h2>
          </div>
          <div className="path-grid" data-reveal>
            <article className="path-card">
              <p className="eyebrow">YOUR WEALTH PROTECTION</p>
              <h3>Wealth Protection Analysis</h3>
              <p className="path-copy">Get your personalized analysis — your coverage number, side-by-side options from A-rated carriers, and your rate-lock timeline. Free, no obligation.</p>
              <p className="path-details">Term life with living benefits  /  IUL  /  Disability protection</p>
              <button className="text-link" onClick={() => setIsFormOpen(true)} type="button">Get my free analysis <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            </article>
            <article className="path-card">
              <p className="eyebrow">YOUR EXISTING COVERAGE</p>
              <h3>Coverage Review</h3>
              <p className="path-copy">Already have policies? I'll review them to make sure they still match your goals, family situation, and budget — no obligation to change.</p>
              <p className="path-details">Gap analysis  /  Carrier comparison  /  Budget optimization</p>
              <button className="text-link" onClick={() => setIsFormOpen(true)} type="button">Review my coverage <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            </article>
            <article className="path-card">
              <p className="eyebrow">LIVING BENEFITS</p>
              <h3>Term Life with Living Benefits</h3>
              <p className="path-copy">Affordable coverage for 10–30 years that protects your family, and can give you access to part of your benefit if you face a qualifying critical, chronic, or terminal illness.</p>
              <p className="path-details">Critical illness  /  Chronic illness  /  Terminal illness</p>
              <button className="text-link" onClick={() => setIsFormOpen(true)} type="button">Learn more <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            </article>
            <article className="path-card">
              <p className="eyebrow">INCOME PROTECTION</p>
              <h3>Disability Income Protection</h3>
              <p className="path-copy">Protects your greatest asset — your ability to earn. Replaces a portion of your income if illness or injury prevents you from working.</p>
              <p className="path-details">Short-term  /  Long-term  /  Own-occupation</p>
              <button className="text-link" onClick={() => setIsFormOpen(true)} type="button">Learn more <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            </article>
            <article className="path-card">
              <p className="eyebrow">CRITICAL ILLNESS</p>
              <h3>Critical Illness Coverage</h3>
              <p className="path-copy">Lump-sum benefit upon diagnosis of covered conditions (cancer, heart attack, stroke, etc.) — use it for treatment, recovery, or anything you need.</p>
              <p className="path-details">Cancer  /  Heart attack  /  Stroke  /  More</p>
              <button className="text-link" onClick={() => setIsFormOpen(true)} type="button">Learn more <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            </article>
            <article className="path-card">
              <p className="eyebrow">PERMANENT COVERAGE</p>
              <h3>Indexed Universal Life (IUL)</h3>
              <p className="path-copy">Permanent coverage that can build cash value over time, for people thinking long-term about legacy and tax-advantaged growth.</p>
              <p className="path-details">Cash value growth  /  Tax advantages  /  Legacy planning</p>
              <button className="text-link" onClick={() => setIsFormOpen(true)} type="button">Learn more <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
            </article>
          </div>
          <p className="section-note" style={{textAlign: "center", marginTop: "32px", color: "var(--muted)", fontSize: "16px", lineHeight: 1.7}}>Every journey is different. We'll begin with a conversation about the path that is right for you.</p>
        </div>
      </section>

      {/* WHY LIVING BENEFITS MATTER */}
      <section className="section" style={{paddingTop: 0}} aria-labelledby="insurance-compare-title">
        <div className="container">
          <div className="section-header" data-reveal>
            <p className="eyebrow">WHY LIVING BENEFITS MATTER</p>
            <h2 id="insurance-compare-title">Not All Term Policies Are Built the Same</h2>
            <p className="lead">A heart attack, cancer diagnosis or stroke can stop your paycheck long before it threatens your life. The right policy is designed for both.</p>
          </div>
          <div className="compare-grid" data-reveal style={{textAlign: "left"}}>
            <article className="compare-card">
              <h3>Basic Term Life</h3>
              <ul>
                <li>Pays your beneficiaries only after you pass away</li>
                <li>No help if you get seriously sick and can't work</li>
                <li>Medical bills and lost income can drain your savings</li>
              </ul>
            </article>
            <article className="compare-card good">
              <h3>Term Life with Living Benefits</h3>
              <ul>
                <li>Still pays a death benefit to protect your family</li>
                <li>Can let you access part of your coverage early for a qualifying illness</li>
                <li>Use the money how you need it — bills, treatment, mortgage, time off</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section" style={{paddingTop: 0}} aria-labelledby="insurance-benefits-title">
        <div className="container">
          <div className="section-header" data-reveal>
            <p className="eyebrow">WHAT LIVING BENEFITS CAN COVER</p>
            <h2 id="insurance-benefits-title">Three Ways Your Policy Can Work for You While You're Alive</h2>
          </div>
          <div className="benefits-grid" data-reveal style={{textAlign: "left"}}>
            <article className="benefit-card">
              <div className="icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21s-7-4.4-9.3-9C1 8.4 3.3 4.5 7 4.5c2 0 3.3 1 5 3 1.7-2 3-3 5-3 3.7 0 6 3.9 4.3 7.5C19 16.6 12 21 12 21z" stroke="var(--color-navy)" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Critical Illness</h3>
              <p>A qualifying diagnosis — such as a heart attack, stroke or invasive cancer — may let you accelerate part of your death benefit.</p>
              <p className="ex">Covers costs insurance won't <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></p>
            </article>
            <article className="benefit-card">
              <div className="icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="7" r="3.5" stroke="var(--color-navy)" strokeWidth="2"/>
                  <path d="M5 21v-2a7 7 0 0114 0v2" stroke="var(--color-navy)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Chronic Illness</h3>
              <p>If you become unable to perform basic daily activities (like bathing or dressing) long-term, benefits may help pay for care.</p>
              <p className="ex">Help with long-term care costs <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></p>
            </article>
            <article className="benefit-card">
              <div className="icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M4 20h16M6 20V10l6-5 6 5v10" stroke="var(--color-navy)" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M10 20v-5h4v5" stroke="var(--color-navy)" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Terminal Illness</h3>
              <p>With a qualifying terminal diagnosis, you may access a portion of your benefit to spend meaningful time with family and settle affairs.</p>
              <p className="ex">Peace of mind when it matters most <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></p>
            </article>
          </div>
          <p className="fine" style={{fontSize: "14px", color: "var(--muted)", marginTop: "24px", textAlign: "center"}}>Living benefits are provided through accelerated benefit riders. Availability, qualifying conditions and amounts vary by carrier, product and state, and any amount accelerated reduces the death benefit.</p>
        </div>
      </section>

      {/* MY APPROACH - FINANCIAL NEEDS ANALYSIS */}
      <section className="section section-white" id="insurance-approach" aria-labelledby="insurance-approach-title">
        <div className="container">
          <div className="fna-grid" data-reveal>
            <div className="fna-photo">
              <img src={`${assets}/kayode-poster.png`} alt="Kayode Samson Elepe with a planning notebook" loading="lazy" />
              <div className="note"><strong>No guesswork. No one-size-fits-all.</strong>Your recommendation comes from your numbers and your goals, not a sales script.</div>
            </div>
            <div>
              <p className="eyebrow">MY APPROACH</p>
              <h2 id="insurance-approach-title">How I Find the Solution That Actually Fits You</h2>
              <p className="lead">Before I recommend anything, we do a <strong>Wealth Protection Analysis</strong> together. It's a simple, judgment-free look at your family's finances that shows how much protection you really need and what fits your budget, so you never buy too much or too little. It's the same careful, evidence-based approach I learned in my engineering and data career.</p>
              <ol className="fna-steps">
                <li>
                  <h3>We get to know your story</h3>
                  <p>Who depends on you, your income, your goals, any coverage you already have through work, and what keeps you up at night.</p>
                </li>
                <li>
                  <h3>We calculate your real need</h3>
                  <p>I use the DIME method to put a real number on what your family would need if something happened to you:</p>
                  <div className="dime-grid">
                    <div className="dime-item"><b>D</b><span>Debts</span></div>
                    <div className="dime-item"><b>I</b><span>Income to replace</span></div>
                    <div className="dime-item"><b>M</b><span>Mortgage</span></div>
                    <div className="dime-item"><b>E</b><span>Education</span></div>
                  </div>
                </li>
                <li>
                  <h3>We match it to your budget</h3>
                  <p>I compare carriers, term lengths and living benefit riders side by side and find the strongest protection for a premium you're comfortable with.</p>
                </li>
                <li>
                  <h3>You get a clear, written plan</h3>
                  <p>Plain-English recommendations and the reasons behind them. You decide, with no pressure. Then I check in as your life changes — new baby, new home, a raise.</p>
                </li>
              </ol>
              <a href="/book-now" className="button button-strategy" style={{marginTop: "32px", display: "inline-flex"}}>Book a 1:1 call →</a>
            </div>
          </div>
        </div>
      </section>

      {/* MEET KAYODE */}
      <section className="section" style={{background: "var(--color-cream)", color: "var(--color-navy)"}} aria-labelledby="insurance-meet-title">
        <div className="container">
          <div className="meet-grid" data-reveal>
            <div className="meet-portrait">
              <img src={`${assets}/kayode-poster.png`} alt="Kayode Samson Elepe, RR" loading="lazy" />
            </div>
            <div className="meet-copy">
              <p className="eyebrow">MEET KAYODE</p>
              <h2 id="insurance-meet-title">Analytical thinking.<br/>Human understanding.</h2>
              <h3>Kayode Samson Elepe, RR</h3>
              <p>My career began in engineering and data, working with organisations including Shell, ExxonMobil, Imperial Oil, and the Canada Mortgage and Housing Corporation.</p>
              <p>Today, I apply that same analytical thinking and long-term perspective to helping professionals build wealth and mentoring future financial advisors.</p>
              <blockquote>"What matters most is helping people make better decisions for themselves, their families, and the future they're creating."</blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* BOOK A 1:1 */}
      <section className="section section-slate" id="insurance-book" aria-labelledby="insurance-book-title">
        <div className="container">
          <div className="book-grid" data-reveal>
            <div>
              <p className="eyebrow">YOUR FREE WEALTH PROTECTION ANALYSIS</p>
              <h2 id="insurance-book-title">Get Your Number, Your Options and Your Rate-Lock Date.</h2>
              <p style={{marginTop: "24px", color: "var(--muted)", fontSize: "18px", lineHeight: 1.7}}>Answer four quick questions, then pick a time. On a relaxed, one-on-one call we'll build your Wealth Protection Analysis together. It's free, with no obligation, and you keep the analysis either way.</p>
              <ul className="book-points" style={{listStyle: "none", display: "grid", gap: "20px", marginTop: "32px"}}>
                <li className="book-point" style={{display: "flex", gap: "16px", alignItems: "flex-start"}}>
                  <span className="icon" style={{flexShrink: 0, width: "48px", height: "48px", borderRadius: "12px", background: "#f0f4ef", display: "grid", placeItems: "center"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--color-navy)" strokeWidth="2"/><path d="M12 7v5l3 2" stroke="var(--color-navy)" strokeWidth="2" strokeLinecap="round"/></svg></span>
                  <div><strong>About 30 minutes</strong><span style={{display: "block", color: "var(--muted)", marginTop: "4px", lineHeight: 1.6}}>Enough time for real answers, short enough for a lunch break.</span></div>
                </li>
                <li className="book-point" style={{display: "flex", gap: "16px", alignItems: "flex-start"}}>
                  <span className="icon" style={{flexShrink: 0, width: "48px", height: "48px", borderRadius: "12px", background: "#f0f4ef", display: "grid", placeItems: "center"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="13" height="12" rx="2" stroke="var(--color-navy)" strokeWidth="2"/><path d="M16 10l5-3v10l-5-3" stroke="var(--color-navy)" strokeWidth="2" strokeLinejoin="round"/></svg></span>
                  <div><strong>By video call, from anywhere</strong><span style={{display: "block", color: "var(--muted)", marginTop: "4px", lineHeight: 1.6}}>Join from your phone or computer. The link arrives as soon as you book.</span></div>
                </li>
                <li className="book-point" style={{display: "flex", gap: "16px", alignItems: "flex-start"}}>
                  <span className="icon" style={{flexShrink: 0, width: "48px", height: "48px", borderRadius: "12px", background: "#f0f4ef", display: "grid", placeItems: "center"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="var(--color-navy)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div><strong>Walk away with your analysis</strong><span style={{display: "block", color: "var(--muted)", marginTop: "4px", lineHeight: 1.6}}>Your coverage number, side-by-side options, your rate-lock date, and how living benefits work for you.</span></div>
                </li>
              </ul>
              <div className="book-agent" style={{display: "flex", alignItems: "center", gap: "16px", marginTop: "32px", padding: "20px", borderRadius: "16px", background: "white", border: "1px solid var(--line)"}}>
                <img src={`${assets}/kayode-poster.png`} alt="Kayode Samson Elepe" loading="lazy" style={{width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--color-gold)"}} />
                <p>"I'll come prepared, listen first, and never pressure you. You'll be talking with me, not a call center."<br/><strong style={{color: "var(--color-navy)"}}><span className="agent-name">Kayode Samson Elepe</span><span className="creds-suffix">, RR</span></strong></p>
              </div>
            </div>

            <div>
              <div className="quote-card" id="quote">
                <div id="formBody">
                  <h2>Get my free analysis</h2>
                  <p className="small" style={{color: "var(--muted)", fontSize: "15px", marginTop: "8px"}}>Answer 4 quick questions, then pick a time for your 1:1 call. Free, no obligation.</p>
                  <div className="progress-bar" aria-hidden="true"><i className="active"></i><i></i><i></i><i></i><i></i></div>

                  <form className="insurance-form" onSubmit={handleSubmit} ref={formRef} noValidate>
                    <input type="hidden" name="form-name" value="wealth-protection-leads"/>
                    <p hidden><label>Leave blank <input name="bot-field"/></label></p>

                    {/* Step 1: need */}
                    <div className={`step ${currentStep === 1 ? "active" : ""}`} data-step="1">
                      <span className="q-label">Who would struggle financially if your income stopped tomorrow?</span>
                      <div className="choices one">
                        <label className="choice"><input type="radio" name="protect" value="Spouse/partner and children" onChange={() => handleRadioChange("protect")}/><span>My spouse/partner and children</span></label>
                        <label className="choice"><input type="radio" name="protect" value="My children (single parent)" onChange={() => handleRadioChange("protect")}/><span>My children (I'm a single parent)</span></label>
                        <label className="choice"><input type="radio" name="protect" value="Family I support here and abroad" onChange={() => handleRadioChange("protect")}/><span>Family I support here and abroad</span></label>
                        <label className="choice"><input type="radio" name="protect" value="Mainly debts (mortgage, loans)" onChange={() => handleRadioChange("protect")}/><span>Mainly debts I don't want to leave behind</span></label>
                        <label className="choice"><input type="radio" name="protect" value="No one depends on my income" onChange={() => handleRadioChange("protect")}/><span>No one depends on my income</span></label>
                      </div>
                    </div>

                    {/* Step 2: basics */}
                    <div className={`step ${currentStep === 2 ? "active" : ""}`} data-step="2">
                      <span className="q-label">What's your age range?</span>
                      <div className="choices">
                        <label className="choice"><input type="radio" name="age" value="18-29" onChange={() => handleRadioChange("age")}/><span>18–29</span></label>
                        <label className="choice"><input type="radio" name="age" value="30-39" onChange={() => handleRadioChange("age")}/><span>30–39</span></label>
                        <label className="choice"><input type="radio" name="age" value="40-49" onChange={() => handleRadioChange("age")}/><span>40–49</span></label>
                        <label className="choice"><input type="radio" name="age" value="50-59" onChange={() => handleRadioChange("age")}/><span>50–59</span></label>
                        <label className="choice"><input type="radio" name="age" value="60-70" onChange={() => handleRadioChange("age")}/><span>60–70</span></label>
                        <label className="choice"><input type="radio" name="age" value="70+" onChange={() => handleRadioChange("age")}/><span>70+</span></label>
                      </div>
                      <span className="q-label" style={{marginTop: "24px"}}>Do you use tobacco or nicotine?</span>
                      <div className="choices">
                        <label className="choice"><input type="radio" name="tobacco" value="No" onChange={() => handleRadioChange("tobacco")}/><span>No</span></label>
                        <label className="choice"><input type="radio" name="tobacco" value="Yes" onChange={() => handleRadioChange("tobacco")}/><span>Yes</span></label>
                      </div>
                    </div>

                    {/* Step 3: urgency + budget */}
                    <div className={`step ${currentStep === 3 ? "active" : ""}`} data-step="3">
                      <span className="q-label">When do you want your coverage in place?</span>
                      <div className="choices one">
                        <label className="choice"><input type="radio" name="timeline" value="Within 2 weeks" onChange={() => handleRadioChange("timeline")}/><span>Within the next 2 weeks</span></label>
                        <label className="choice"><input type="radio" name="timeline" value="Within 30 days" onChange={() => handleRadioChange("timeline")}/><span>Within 30 days</span></label>
                        <label className="choice"><input type="radio" name="timeline" value="In 1-3 months" onChange={() => handleRadioChange("timeline")}/><span>In 1–3 months</span></label>
                        <label className="choice"><input type="radio" name="timeline" value="Just researching" onChange={() => handleRadioChange("timeline")}/><span>Just researching for now</span></label>
                      </div>
                      <span className="q-label" style={{marginTop: "24px"}}>What monthly amount could you set aside to protect your family?</span>
                      <div className="choices">
                        <label className="choice"><input type="radio" name="budget" value="Under $50" onChange={() => handleRadioChange("budget")}/><span>Under $50</span></label>
                        <label className="choice"><input type="radio" name="budget" value="$50-$100" onChange={() => handleRadioChange("budget")}/><span>$50–$100</span></label>
                        <label className="choice"><input type="radio" name="budget" value="$100-$200" onChange={() => handleRadioChange("budget")}/><span>$100–$200</span></label>
                        <label className="choice"><input type="radio" name="budget" value="$200+" onChange={() => handleRadioChange("budget")}/><span>$200+</span></label>
                        <label className="choice" style={{gridColumn: "1/-1"}}><input type="radio" name="budget" value="Not sure - show me what fits" onChange={() => handleRadioChange("budget")}/><span>Not sure. Show me what fits my budget</span></label>
                      </div>
                    </div>

                    {/* Step 4: decision */}
                    <div className={`step ${currentStep === 4 ? "active" : ""}`} data-step="4">
                      <span className="q-label">If the right plan fits your needs and budget, who makes the final decision?</span>
                      <div className="choices one">
                        <label className="choice"><input type="radio" name="decision" value="Me - ready to move forward on the call" onChange={() => handleRadioChange("decision")}/><span>I do, and I'm ready to move forward on the call</span></label>
                        <label className="choice"><input type="radio" name="decision" value="Spouse and I - spouse will join the call" onChange={() => handleRadioChange("decision")}/><span>My spouse and I, and they'll join the call</span></label>
                        <label className="choice"><input type="radio" name="decision" value="Spouse and I - spouse won't be on the call" onChange={() => handleRadioChange("decision")}/><span>My spouse and I, but they won't be on the call</span></label>
                        <label className="choice"><input type="radio" name="decision" value="Only gathering information" onChange={() => handleRadioChange("decision")}/><span>I'm only gathering information</span></label>
                      </div>
                    </div>

                    {/* Step 5: contact details */}
                    <div className={`step ${currentStep === 5 ? "active" : ""}`} data-step="5">
                      <span className="q-label">Who will I be meeting with?</span>
                      <div className="row2">
                        <div className="field"><label htmlFor="fn">First name</label><input id="fn" name="firstName" autoComplete="given-name" required/></div>
                        <div className="field"><label htmlFor="ln">Last name</label><input id="ln" name="lastName" autoComplete="family-name" required/></div>
                      </div>
                      <div className="field"><label htmlFor="em">Email</label><input id="em" type="email" name="email" autoComplete="email" required/></div>
                      <div className="row2">
                        <div className="field"><label htmlFor="ph">Phone</label><input id="ph" type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="(555) 555-5555" required/></div>
                        <div className="field"><label htmlFor="st">State/Province</label>
                          <select id="st" name="province" required>
                            <option value="">Select…</option>
                            <option value="Alabama">Alabama</option><option value="Alaska">Alaska</option><option value="Arizona">Arizona</option><option value="Arkansas">Arkansas</option><option value="California">California</option><option value="Colorado">Colorado</option><option value="Connecticut">Connecticut</option><option value="Delaware">Delaware</option><option value="Florida">Florida</option><option value="Georgia">Georgia</option><option value="Hawaii">Hawaii</option><option value="Idaho">Idaho</option><option value="Illinois">Illinois</option><option value="Indiana">Indiana</option><option value="Iowa">Iowa</option><option value="Kansas">Kansas</option><option value="Kentucky">Kentucky</option><option value="Louisiana">Louisiana</option><option value="Maine">Maine</option><option value="Maryland">Maryland</option><option value="Massachusetts">Massachusetts</option><option value="Michigan">Michigan</option><option value="Minnesota">Minnesota</option><option value="Mississippi">Mississippi</option><option value="Missouri">Missouri</option><option value="Montana">Montana</option><option value="Nebraska">Nebraska</option><option value="Nevada">Nevada</option><option value="New Hampshire">New Hampshire</option><option value="New Jersey">New Jersey</option><option value="New Mexico">New Mexico</option><option value="New York">New York</option><option value="North Carolina">North Carolina</option><option value="North Dakota">North Dakota</option><option value="Ohio">Ohio</option><option value="Oklahoma">Oklahoma</option><option value="Oregon">Oregon</option><option value="Pennsylvania">Pennsylvania</option><option value="Rhode Island">Rhode Island</option><option value="South Carolina">South Carolina</option><option value="South Dakota">South Dakota</option><option value="Tennessee">Tennessee</option><option value="Texas">Texas</option><option value="Utah">Utah</option><option value="Vermont">Vermont</option><option value="Virginia">Virginia</option><option value="Washington">Washington</option><option value="West Virginia">West Virginia</option><option value="Wisconsin">Wisconsin</option><option value="Wyoming">Wyoming</option>
                            <option value="Alberta">Alberta</option><option value="British Columbia">British Columbia</option><option value="Manitoba">Manitoba</option><option value="New Brunswick">New Brunswick</option><option value="Newfoundland">Newfoundland</option><option value="Nova Scotia">Nova Scotia</option><option value="Ontario">Ontario</option><option value="Prince Edward Island">Prince Edward Island</option><option value="Quebec">Quebec</option><option value="Saskatchewan">Saskatchewan</option>
                          </select>
                        </div>
                      </div>
                      <div className="field"><label htmlFor="ct">City</label><input id="ct" name="city" autoComplete="address-level2"/></div>
                      <div className="field"><label htmlFor="cn">Country</label>
                        <select id="cn" name="country" required>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <input type="hidden" name="best_time" value="Picks a time in the calendar"/>
                      <label className="consent" id="consentWrap">
                        <input type="checkbox" name="consent" value="yes" id="consent" required/>
                        <span>By checking this box and submitting, I agree that KSEFinServe may contact me about wealth protection at the phone number and email provided, including by call, text, and automated technology. Consent is not a condition of purchase. Message & data rates may apply. Reply STOP to opt out. See our <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a>.</span>
                      </label>
                    </div>

                    <p className="err-msg" id="err" role="alert"></p>
                    <div className="nav-row">
                      <button type="button" className="button button-outline" onClick={prevStep} hidden={currentStep === 1}>← Back</button>
                      <button type="button" className="button button-gold" onClick={nextStep}>{currentStep === 5 ? "Continue to pick a time →" : "Continue →"}</button>
                    </div>
                    <p className="secure"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2" stroke="var(--muted)" strokeWidth="2"/><path d="M8 10V7a4 4 0 018 0v3" stroke="var(--muted)" strokeWidth="2"/></svg>Your information is private and never sold.</p>
                  </form>
                </div>

                <div className="cal-step" id="thanks" hidden>
                  <h2>Thank you, <span id="thanksName">friend</span>! Now pick a time.</h2>
                  <p className="small" style={{color: "var(--muted)", marginTop: "8px", marginBottom: "24px"}}>Choose any open slot below. Your name and email are already filled in.</p>
                  <iframe className="book-embed" id="calEmbed" title="Pick a time for your free 1:1 call"></iframe>
                  <p style={{marginTop: "16px", fontSize: "15px"}} id="callWrap">Prefer to call? <a href="#" id="callLink" style={{color: "var(--color-navy)", fontWeight: 600}}></a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKING WITH ME */}
      <section className="section" aria-labelledby="insurance-gallery-title">
        <div className="container">
          <div className="section-header" data-reveal>
            <p className="eyebrow">WHAT WORKING WITH ME LOOKS LIKE</p>
            <h2 id="insurance-gallery-title">Personal, Patient and Always in Your Corner</h2>
            <p className="lead">You'll never be a policy number to me. Here's what you can expect from the first conversation to years down the road.</p>
          </div>
          <div className="gallery-grid" data-reveal>
            <figure><img src={`${assets}/g-listen.jpg`} alt="Agent listening to a client over coffee" loading="lazy"/><figcaption><strong>I listen first</strong>Your family, your goals, your budget — before any numbers.</figcaption></figure>
            <figure><img src={`${assets}/g-review.jpg`} alt="Agent reviewing paperwork" loading="lazy"/><figcaption><strong>I do the homework</strong>I compare carriers and read the fine print so you don't have to.</figcaption></figure>
            <figure><img src={`${assets}/g-teach.jpg`} alt="Agent speaking to a group" loading="lazy"/><figcaption><strong>I explain it simply</strong>Plain English, every question answered, no jargon.</figcaption></figure>
            <figure><img src={`${assets}/g-sign.jpg`} alt="Agent at desk with documents" loading="lazy"/><figcaption><strong>I guide the application</strong>Step by step, so nothing gets missed.</figcaption></figure>
            <figure><img src={`${assets}/g-home.jpg`} alt="Agent smiling at home with coffee" loading="lazy"/><figcaption><strong>I'm here for the long run</strong>Life changes — I'll still be a call or text away.</figcaption></figure>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" aria-labelledby="insurance-how-title">
        <div className="container">
          <div className="section-header" data-reveal>
            <p className="eyebrow">HOW IT WORKS</p>
            <h2 id="insurance-how-title">Covered in Three Simple Steps</h2>
          </div>
          <div className="how-steps" data-reveal style={{textAlign: "left"}}>
            <article className="how-step"><h3>Answer a few questions</h3><p>Tell me who you want to protect and roughly how much coverage you need. It takes about a minute.</p></article>
            <article className="how-step"><h3>Your Wealth Protection Analysis</h3><p>We talk one-on-one, figure out exactly how much protection your family needs, and I compare carriers to fit your budget. No pressure.</p></article>
            <article className="how-step"><h3>Apply & get protected</h3><p>Pick the plan you like. Many applicants can qualify with no medical exam, and some get a decision quickly.</p></article>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-white" aria-labelledby="insurance-faq-title">
        <div className="container">
          <div className="faq-grid" data-reveal>
            <div className="faq-copy">
              <p className="eyebrow">QUESTIONS</p>
              <h2 id="insurance-faq-title">Good questions.<br/>Clearer answers.</h2>
              <p className="lead">A better decision starts with<br/>a better understanding.</p>
            </div>
            <div className="faq-list">
              <details className="faq-item"><summary>What is term life insurance with living benefits?</summary><p>It's a term life policy — coverage for a set period like 10, 20 or 30 years — that includes accelerated benefit riders. Those riders can let you access part of your death benefit early if you're diagnosed with a qualifying critical, chronic or terminal illness.</p></details>
              <details className="faq-item"><summary>Do living benefits cost extra?</summary><p>On many policies the accelerated benefit riders are included at no additional premium. Some carriers may charge a fee or reduce the payout when the benefit is used. I'll show you exactly how it works for each option.</p></details>
              <details className="faq-item"><summary>Will I need a medical exam?</summary><p>Not always. Many carriers offer no-exam options based on your health history and age. Whether you qualify depends on underwriting.</p></details>
              <details className="faq-item"><summary>How much coverage do I need?</summary><p>A common starting point is enough to replace several years of income plus pay off your mortgage and major debts. We'll help you find a number that fits your family and your budget.</p></details>
              <details className="faq-item"><summary>Am I obligated to buy anything?</summary><p>No. Your analysis and consultation are completely free, and you're never under any obligation to purchase.</p></details>
              <details className="faq-item"><summary>Can I get coverage if I'm not a U.S. citizen?</summary><p>Often, yes. Many carriers offer coverage to permanent residents (green card holders), and some will consider certain visa holders. Eligibility depends on the carrier, your immigration status and how long you've lived in the U.S. I'll check which options are open to you before you apply.</p></details>
              <details className="faq-item"><summary>Can I name family abroad as my beneficiaries?</summary><p>In most cases you can name loved ones who live outside the U.S. Each carrier has its own rules and paperwork for this, and I'll walk you through them.</p></details>
              <details className="faq-item"><summary>Which states/jurisdictions do you serve?</summary><p>I'm licensed across the U.S. and Canada. Wherever you live, I can help. Product availability can still vary by carrier and jurisdiction, and I'll confirm your options when we talk.</p></details>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="footer-cta" aria-labelledby="insurance-final-title">
        <div className="container">
          <div className="portrait-wrap">
            <img src={`${assets}/kayode-poster.png`} alt="Kayode Samson Elepe" loading="lazy" />
          </div>
          <h2 id="insurance-final-title">Let's Protect What You've Built — Together.</h2>
          <p>Rates are based on your age and health today, so the best time to look is now. Tell me a little about your family and I'll personally reach out with your options.</p>
          <div style={{display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center"}}>
            <a href="/book-now" className="button button-strategy">Book a 1:1 consultation</a>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="mobile-cta" id="mobileCta">
        <a href="/book-now" className="button button-strategy btn-float">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="2.2"/>
            <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          Get Analysis
        </a>
      </div>
    </main>
  )
}