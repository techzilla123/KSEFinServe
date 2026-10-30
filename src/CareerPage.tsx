import { FormEvent, useEffect, useRef, useState } from "react";
import { submitCareerApplication } from "./admin/careerDirectory";

const A = "/assets/";

const benefits = [
  ["ba549.svg", "Knowledge that compounds", "Build financial fluency, communication skills and a deeper understanding of client needs."],
  ["d09f6.svg", "Guidance, not guesswork", "Explore mentoring and practical learning support available for your role and stage."],
  ["ab817.svg", "Room to develop", "Build confidence through experience, feedback and progressively greater responsibility."],
  ["b7372.svg", "People around your ambition", "Connect with others who value professional growth, thoughtful service and shared learning."],
  ["c18e5.svg", "Leadership with substance", "Strengthen the habits that make a good leader: accountability, clarity and care for others."],
  ["3e293.svg", "A path that fits your life", "Discuss time commitments, work arrangements and expectations before deciding what is right for you."],
];

const journey = [
  ["Discover", "Understand the opportunity", "Explore the work, your goals and the expectations. Start with questions, not assumptions."],
  ["Prepare", "Build your foundation", "Identify relevant learning, onboarding and licensing requirements where applicable."],
  ["Practice", "Develop real capability", "Grow your communication, service and relationship skills through disciplined work."],
  ["Lead", "Grow your contribution", "Explore greater responsibility as your readiness, performance and opportunities align."],
];

const backgrounds = [
  ["45973.svg", "Starting your career", "Bring your curiosity and willingness to learn. Explore the foundations and requirements of financial-services work."],
  ["734dd.svg", "Ready for a new direction", "Your experience in service, sales, education or business may bring a valuable perspective to a new profession."],
  ["5e789.svg", "Already in financial services", "Explore how your knowledge, credentials and leadership ambitions could align with the opportunities available."],
];

const factors = [
  ["Your role & arrangement", "Responsibilities and employment or independent arrangements shape how compensation works."],
  ["Compensation structure", "Understand any salary, commission or other applicable terms, including payment conditions."],
  ["Licensing & readiness", "Some activities require licensing or registration. Requirements vary by role and jurisdiction."],
  ["Performance & consistency", "Skills, activity, client outcomes and business conditions can influence results over time."],
];

const faqs = [
  ["Do I need financial-services experience?", "Not necessarily. Relevant experience can help, but curiosity, communication and a willingness to learn matter too. Eligibility depends on the role and its requirements."],
  ["Will I need a licence or registration?", "Some financial-services activities require licensing or registration. We will clarify the requirements for your role and location before you begin regulated work."],
  ["Is this a salaried or commission-based opportunity?", "Compensation varies by role and arrangement. Ask about the structure, payment conditions and any relevant costs. No income level is guaranteed."],
  ["Can I explore this alongside my current work?", "Discuss your availability in the application. Time commitments, work arrangements and any restrictions need to be agreed for the specific opportunity."],
  ["What happens after I apply?", "Your information is reviewed for potential fit. If a conversation is appropriate, you may be contacted through your preferred channel to discuss the opportunity and next steps."],
];

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <div className={`eyebrow ${dark ? "eyebrow-dark" : ""}`}><span />{children}</div>;
}

function Sculpture() {
  return (
    <div className="sculpture" aria-hidden="true">
      <img className="halo" src={`${A}2949b.svg`} alt="" />
      <img className="orbit" src={`${A}98b8b.svg`} alt="" />
      <img className="shadow" src={`${A}7582f.svg`} alt="" />
      <img className="plinth p1" src={`${A}5cebd.svg`} alt="" />
      <img className="plinth p2" src={`${A}5e145.svg`} alt="" />
      <img className="plinth p3" src={`${A}d042b.svg`} alt="" />
      <img className="pearl" src={`${A}4ded9.svg`} alt="" />
      <img className="gold-sphere" src={`${A}45244.svg`} alt="" />
      <img className="ring" src={`${A}324f8.svg`} alt="" />
      <div className="plaque"><span /><div><b>Your next chapter, elevated.</b><small>Knowledge. Confidence. Impact.</small></div></div>
    </div>
  );
}

function CareerDetails() {
  const [benefitIdx, setBenefitIdx] = useState(0)
  const [journeyIdx, setJourneyIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const journeyStartRef = useRef(Date.now())

  // Mobile: auto-rotate benefits every 20s
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)")
    if (!mq.matches) return
    const t = setInterval(() => {
      setBenefitIdx(i => (i + 1) % benefits.length)
    }, 20000)
    return () => clearInterval(t)
  }, [])

  // Mobile: journey progress bar + auto-advance every 10s
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)")
    if (!mq.matches) return
    const iv = setInterval(() => {
      const elapsed = Date.now() - journeyStartRef.current
      if (elapsed >= 10000) {
        journeyStartRef.current = Date.now()
        setProgress(0)
        setJourneyIdx(i => (i + 1) % journey.length)
      } else {
        setProgress(elapsed / 10000)
      }
    }, 50)
    return () => clearInterval(iv)
  }, [])

  return (
    <div id="career-details">
      <section className="section dark journey">
        <div className="container">
          <div className="narrow">
            <Eyebrow>The career journey</Eyebrow>
            <h2>From curious to capable.<br />From capable to confident.</h2>
            <p>Progress is built, not promised. Your starting point and pace will be individual.</p>
          </div>
          {/* Mobile: journey carousel with progress + dots */}
          <div className="journey-mobile">
            <div className="journey-mobile-card">
              <div className="stage-marker"><span>{String(journeyIdx + 1).padStart(2, "0")}</span><i /></div>
              <h3>{journey[journeyIdx][0]}</h3>
              <b>{journey[journeyIdx][1]}</b>
              <p>{journey[journeyIdx][2]}</p>
            </div>
            <div className="journey-progress"><span style={{ width: `${progress * 100}%` }} /></div>
            <div className="journey-dots">
              {journey.map((_, i) => (
                <button key={i} className={`dot${i === journeyIdx ? " active" : ""}`} onClick={() => { journeyStartRef.current = Date.now(); setJourneyIdx(i); setProgress(0) }} aria-label={`Step ${i + 1}`} />
              ))}
            </div>
          </div>
          {/* Desktop: original grid */}
          <div className="journey-grid">
            {journey.map(([title, subtitle, text], i) => (
              <article key={title} className="journey-card">
                <div className="stage-marker"><span>{String(i + 1).padStart(2, "0")}</span><i /></div>
                <h3>{title}</h3><b>{subtitle}</b><p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split-heading fit-heading">
            <div><Eyebrow dark>Your ambition belongs here</Eyebrow><h2>Different starting points.<br />A shared sense of purpose.</h2></div>
            <p>You do not need to have your whole future figured out. You do need integrity, initiative and a genuine interest in helping people.</p>
          </div>
          <div className="background-grid">
            {backgrounds.map(([icon, title, text]) => <article className="soft-card" key={title}><img src={`${A}${icon}`} alt="" /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
          <div className="traits"><b>What matters most</b>{["Ethical judgment", "Consistent effort", "Openness to feedback", "People-first thinking"].map(x => <span key={x}><i />{x}</span>)}</div>
        </div>
      </section>

      <section className="section sand">
        <div className="container earnings">
          <div>
            <Eyebrow dark>Potential, with perspective</Eyebrow>
            <h2>A bigger future.<br />An honest conversation.</h2>
            <p>It is natural to want meaningful work and stronger financial possibilities. A financial-services career can offer room to grow, but income is not automatic or guaranteed.</p>
            <p>Earnings depend on your role, compensation structure, licensing where applicable, and performance. We will discuss the relevant terms so you can make an informed decision.</p>
            <a className="button gold" href="#application">Start a conversation</a>
          </div>
          <div className="factor-card">
            <h3>What shapes earning potential?</h3>
            {factors.map(([title, text], i) => <div className="factor" key={title}><b>{String(i + 1).padStart(2, "0")}</b><div><h4>{title}</h4><p>{text}</p></div></div>)}
            <p className="disclosure">No earnings figures or results are promised. This page is an invitation to explore a career, not a guarantee of stable income or financial success.</p>
          </div>
        </div>
      </section>

      <section className="standard">
        <div className="container standard-inner">
          <div className="integrity"><img src={`${A}af670.svg`} alt="" /><b>KSE</b></div>
          <div><Eyebrow>Our standard</Eyebrow><h2>Trust is the real currency.</h2></div>
          <div><p>Professionalism comes before persuasion. Put people first, respect their privacy and work within the permissions and requirements of your role.</p><b>SERVICE&nbsp; / &nbsp;INTEGRITY&nbsp; / &nbsp;ACCOUNTABILITY</b></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="narrow"><Eyebrow dark>A simple first step</Eyebrow><h2>Start with a conversation.<br />Decide with clarity.</h2><p>Exploring the opportunity does not mean you have to commit to it.</p></div>
          <div className="steps">
            {[
              ["Tell us about yourself", "Share your background, interests and availability using the form below."],
              ["Have a real conversation", "If there is a potential fit, discuss the role, requirements, support and compensation terms."],
              ["Choose your next step", "Review the details together. If both sides are aligned, clarify any next steps before you commit."],
            ].map(([title, text], i) => <article key={title}><b>{String(i + 1).padStart(2, "0")}</b><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section sand">
        <div className="container faq-layout">
          <div><Eyebrow dark>Clarity before commitment</Eyebrow><h2>Good questions.<br />Straight answers.</h2><p>Every career decision deserves a clear understanding of the opportunity. Here are a few things you may be wondering.</p><b>Bring your other questions to the conversation.</b></div>
          <div><CareerFaqs /></div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={full ? "field full" : "field"}><span>{label}</span>{children}</label>;
}

function CareerFaqs() {
  const [open, setOpen] = useState(0)
  return (
    <div>{faqs.map(([q, a], i) => (
      <article className={`faq${open === i ? " is-open" : ""}`} key={q}>
        <h3>
          <button type="button" className="faq-toggle" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{q}</span>
            <span className="faq-icon" aria-hidden="true">{open === i ? "−" : "+"}</span>
          </button>
        </h3>
        {open === i && <p>{a}</p>}
      </article>
    ))}</div>
  )
}

function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState("WhatsApp");
  const [interests, setInterests] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Controlled step-1 fields: keeps the values when the user goes back, and
  // stops the browser from autofilling one field with another's value.
  const [details, setDetails] = useState({ name: "", email: "", phone: "", location: "" });
  const setDetail = (key: keyof typeof details) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDetails((d) => ({ ...d, [key]: e.target.value }));

  // Controlled step-2 fields: same reason - values survive a back/next round trip.
  const [background, setBackground] = useState({ experience: "", role: "", availability: "", commitment: "", licences: "", motivation: "" });
  const setBg = (key: keyof typeof background) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setBackground((b) => ({ ...b, [key]: e.target.value }));

  const scrollToFormTop = () => {
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const next = (e: FormEvent) => {
    e.preventDefault();
    setStep(2);
    scrollToFormTop();
  };

  const back = () => {
    setStep(1);
    scrollToFormTop();
  };

  // Save the completed application to Supabase. The consent checkboxes are
  // read straight from the form so the stored record reflects what was ticked.
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const boxes = Array.from(form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    const result = await submitCareerApplication({
      name: details.name,
      email: details.email,
      phone: details.phone,
      location: details.location,
      preferredContact: contact,
      role: background.role,
      background: [
        background.experience,
        background.availability ? `Available: ${background.availability}` : '',
        background.commitment ? `Commitment: ${background.commitment}` : '',
        background.motivation,
      ].filter(Boolean).join('\n\n'),
      interests,
      licences: background.licences,
      consentContact: boxes[0]?.checked ?? false,
      consentData: boxes[1]?.checked ?? false,
    });
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    setSent(true);
  };

  return (
    <section className="application dark" id="application">
      <div className="container application-grid">
        <div className="invitation">
          <Eyebrow>Your next chapter</Eyebrow>
          <h2>Let’s explore<br />what’s possible.</h2>
          <p>Tell us a little about yourself and the future you want to build. We are interested in your story—not just your résumé.</p>
          <div className="know"><h3>A few things to know</h3>{["Share accurate contact details.", "Include your WhatsApp country code.", "No financial documents are needed.", "Applying is not a commitment."].map(x => <p key={x}><b>✓</b>{x}</p>)}</div>
          <div className="privacy"><img src={`${A}e613d.svg`} alt="" /><p>Your information is shared for career enquiries. Please do not include account numbers or sensitive financial information.</p></div>
          <b className="motto">WEALTH • LEADERSHIP • LEGACY</b>
        </div>

        <div className="form-card" ref={formRef}>
          <h2>Express your interest</h2><p>Fields marked * are required.</p>
          {sent ? <div className="success"><h3>Thank you for your interest.</h3><p>Your details have been received. If there is a potential fit, the KSEFinServe team may contact you through your preferred channel.</p></div> :
          <form onSubmit={step === 1 ? next : submit}>
            <div className="form-step-row">
              {step === 2 && (
                <button type="button" className="back-btn" onClick={back}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Back
                </button>
              )}
              <p className="form-step">{step === 1 ? "01 / YOUR DETAILS" : "02 / YOUR BACKGROUND & GOALS"}</p>
            </div>
            {step === 1 ? <>
              <div className="field-grid">
                <Field label="Full name *"><input required name="name" autoComplete="name" placeholder="Your full name" value={details.name} onChange={setDetail("name")} /></Field>
                <Field label="Email address *"><input required name="email" type="email" autoComplete="email" placeholder="you@example.com" value={details.email} onChange={setDetail("email")} /></Field>
                <Field label="WhatsApp number *"><input required name="phone" type="tel" autoComplete="tel" placeholder="+234 800 000 0000" value={details.phone} onChange={setDetail("phone")} /><small>Include your country code.</small></Field>
                <Field label="Location *"><input required name="location" autoComplete="address-level2" placeholder="City, state / province, country" value={details.location} onChange={setDetail("location")} /></Field>
              </div>
              <div className="choice-block"><b>Preferred contact method</b><div>{["WhatsApp", "Email"].map(x => <button type="button" className={contact === x ? "chip selected" : "chip"} onClick={() => setContact(x)} key={x}>{x}</button>)}</div></div>
              <hr /><button className="submit" type="submit">Next</button>
            </> : <div key="step-2">
              <div className="field-grid">
                <Field label="Relevant experience *"><select required name="experience" value={background.experience} onChange={setBg("experience")}><option value="" disabled>Select your experience</option><option>Starting my career</option><option>Changing direction</option><option>Financial-services experience</option></select></Field>
                <Field label="Current role or field"><input name="role" autoComplete="off" value={background.role} onChange={setBg("role")} placeholder="e.g. Customer service, graduate" /></Field>
              </div>
              <div className="choice-block interests"><b>Career interests *</b><p>Choose the areas you would like to explore. Select all that apply.</p><div>{["Client relationships", "Financial education", "Business development", "Leadership", "Still exploring"].map(x => <button type="button" key={x} onClick={() => setInterests(v => v.includes(x) ? v.filter(i => i !== x) : [...v, x])} className={interests.includes(x) ? "chip selected" : "chip"}>{x}</button>)}</div></div>
              <div className="field-grid">
                <Field label="Availability *"><select required name="availability" value={background.availability} onChange={setBg("availability")}><option value="" disabled>When could you start?</option><option>Immediately</option><option>Within one month</option><option>Exploring for later</option></select></Field>
                <Field label="Weekly time commitment *"><select required name="commitment" value={background.commitment} onChange={setBg("commitment")}><option value="" disabled>Select your availability</option><option>Under 10 hours</option><option>10–20 hours</option><option>Full-time</option></select></Field>
                <Field label="Licences or registrations (if any)" full><input name="licences" autoComplete="off" value={background.licences} onChange={setBg("licences")} placeholder="List relevant credentials, or enter “None”" /></Field>
                <Field label="What motivates you to explore this career? *" full><textarea required name="motivation" value={background.motivation} onChange={setBg("motivation")} placeholder="Tell us about your goals, strengths and what meaningful work looks like to you…" /><small>A short, thoughtful response is enough.</small></Field>
              </div>
              <hr />
              {submitError && <p className="form-error" role="alert">{submitError}</p>}
              <div className="consents"><label><input type="checkbox" required /><span>I agree that KSEFinServe may contact me by email, phone or WhatsApp about my career enquiry. *</span></label><label><input type="checkbox" required /><span>I consent to the collection and use of the information in this form to review my career enquiry and arrange relevant follow-up. *</span></label></div>
              <button className="submit form-nav-submit" type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send my career interest"}</button>
            </div>}
          </form>}
          <p className="form-note">Submitting interest does not guarantee a role, an offer or income.</p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [expanded, setExpanded] = useState(false)
  const [benefitIdx, setBenefitIdx] = useState(0)

  // Mobile: auto-rotate benefits every 20s
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)")
    if (!mq.matches) return
    const t = setInterval(() => {
      setBenefitIdx(i => (i + 1) % benefits.length)
    }, 20000)
    return () => clearInterval(t)
  }, [])

  return (
    <main>
      <section className="hero dark">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <Eyebrow>Careers at KSEFinServe</Eyebrow>
              <h1>Build a career.<br />Grow your <em>possibilities.</em></h1>
              <h3>Build Leaders with Purpose.</h3>
              <p>Turn your ambition into meaningful work in financial services. Develop the knowledge, relationships and leadership skills to help others move forward—and shape your own next chapter.</p>
              <div className="hero-actions"><a className="button gold" href="#application">Explore your future</a><a className="button white" href="#purpose">Discover the path</a></div>
              <small>A thoughtful first conversation. No pressure to commit.</small>
            </div>
            <Sculpture />
          </div>
          <div className="philosophy"><span>Helping You Multiply What Matters</span><b>WEALTH • LEADERSHIP • LEGACY</b><span>Discover a meaningful path ↓</span></div>
        </div>
      </section>

      <section className="section" id="purpose">
        <div className="container purpose">
          <figure><img src={`${A}fae2a.png`} alt="Two financial professionals having a conversation" /><figcaption>A people-first profession. A long-term perspective.</figcaption></figure>
          <div><Eyebrow dark>A future with purpose</Eyebrow><h2>Make progress.<br />Make a difference.</h2><p>Financial decisions shape real lives. A career in this field is about listening carefully, explaining clearly and helping people understand the choices in front of them.</p><p>At KSEFinServe, wealth and leadership belong in the same conversation. Explore a path where your professional growth is connected to service, trust and the value you bring to others.</p><div className="principles"><span>Listen with care</span><span>Lead with integrity</span><span>Think long term</span></div></div>
        </div>
      </section>

      <section className="section sand support">
        <div className="container">
          <div className="split-heading"><div><Eyebrow dark>Grow with intention</Eyebrow><h2>Ambition is a start.<br />Support makes it a path.</h2></div><p>The right environment helps you build the skills behind lasting progress. Here is what to explore in your career conversation.</p></div>
          {/* Mobile: benefits carousel */}
          <div className="benefit-mobile">
            <button className="benefit-arrow left" onClick={() => setBenefitIdx(i => (i - 1 + benefits.length) % benefits.length)} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="benefit-mobile-card">
              <img src={`${A}${benefits[benefitIdx][0]}`} alt="" />
              <h3>{benefits[benefitIdx][1]}</h3>
              <p>{benefits[benefitIdx][2]}</p>
            </div>
            <button className="benefit-arrow right" onClick={() => setBenefitIdx(i => (i + 1) % benefits.length)} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          {/* Desktop: original grid */}
          <div className="benefit-grid">{benefits.map(([icon, title, text]) => <article key={title}><img src={`${A}${icon}`} alt="" /><h3>{title}</h3><p>{text}</p></article>)}</div>
          <p className="fine-print">Specific support, training and benefits vary by role and arrangement. We will clarify what applies before you make a commitment.</p>
          {!expanded && <button className="see-more" onClick={() => setExpanded(true)}>See More</button>}
        </div>
      </section>

      {expanded && <><CareerDetails /><div className="less-wrap"><button className="see-more" onClick={() => { setExpanded(false); document.querySelector(".support")?.scrollIntoView({ behavior: "smooth", block: "end" }); }}>See Less</button></div></>}
      <ApplicationForm />
    </main>
  );
}
