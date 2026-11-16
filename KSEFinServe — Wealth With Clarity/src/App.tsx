import { FormEvent, useEffect, useRef, useState } from "react";

const asset = (name: string) => `/assets/${name}`;

const audiences = [
  {
    title: "Individuals & families",
    text: "Connect your financial decisions to your family, your priorities, and the future you want to create.",
  },
  {
    title: "Professionals & business owners",
    text: "Bring a long-term perspective to your wealth, career ambitions, and the choices ahead.",
  },
  {
    title: "Aspiring financial advisors",
    text: "Explore a purpose-driven path in financial services, with learning, mentorship, and leadership.",
  },
];

const paths = [
  {
    eyebrow: "YOUR FINANCIAL FUTURE",
    title: "Wealth strategy",
    text: "Make confident financial decisions today while preparing for tomorrow. Start with what matters to you—not a one-size-fits-all answer.",
    details: "Retirement planning  /  Family priorities  /  Long-term goals",
    link: "Explore your wealth strategy",
  },
  {
    eyebrow: "YOUR NEXT CHAPTER",
    title: "Leadership & opportunity",
    text: "Build a meaningful financial services business through purposeful leadership, mentorship, and a commitment to helping others.",
    details: "Financial fluency  /  Mentorship  /  Leadership development",
    link: "Explore a career in financial services",
  },
];

const principles = [
  ["Clarity", "Understand your priorities and the decisions in front of you."],
  ["Purpose", "Connect your strategy to the life you want to lead."],
  ["Legacy", "Keep family, contribution, and the next generation in view."],
];

const steps = [
  [
    "A conversation",
    "Share your priorities, questions, and the future you have in mind. We begin by listening.",
  ],
  [
    "A clearer direction",
    "Explore your options and connect your goals to a considered path forward.",
  ],
  [
    "Your next step",
    "Leave with greater understanding of your choices and the next steps to discuss together.",
  ],
];

const questions = [
  [
    "Where do we begin?",
    "With a conversation about your priorities, questions, and goals. The first step is understanding what matters to you.",
  ],
  [
    "Can I explore both wealth and career goals?",
    "Yes. KSEFinServe brings together wealth guidance and leadership development. Start with the path that matters most to you.",
  ],
  [
    "Do I need a financial services background?",
    "Kayode has worked with advisors from different professions. A career conversation can help you explore the skills and expectations involved.",
  ],
  [
    "What guides your approach?",
    "Clarity, purpose, and legacy: helping people make better decisions for themselves, their families, and the future they are creating.",
  ],
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function LegacyIllustration() {
  return (
    <div className="legacy-art" aria-label="A home and tree on an ascending path">
      <img className="legacy-sun" src={asset("4b696.svg")} alt="" />
      <img className="legacy-lower" src={asset("2c36e.svg")} alt="" />
      <img className="legacy-middle" src={asset("8e6fe.svg")} alt="" />
      <img className="legacy-upper" src={asset("e2970.svg")} alt="" />
      <img className="legacy-home" src={asset("f259e.svg")} alt="" />
      <img className="legacy-tree" src={asset("16df4.svg")} alt="" />
    </div>
  );
}

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    root.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <div ref={rootRef} className="site-shell">
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy reveal is-visible">
            <p className="eyebrow">HELPING YOU MULTIPLY WHAT MATTERS</p>
            <h1 id="hero-title">
              Your future.
              <br />
              With a clearer
              <br />
              way forward.
            </h1>
            <h2>Build wealth with clarity. Build leaders with purpose.</h2>
            <p className="hero-intro">
              Practical financial guidance for the life you want to build.
              <br />
              A thoughtful partner for your wealth, your family, and
              <br />
              your next chapter.
            </p>
            <div className="hero-actions">
              <button className="button button-gold" onClick={() => scrollTo("conversation")}>
                Book a strategy session
              </button>
              <button className="text-link light" onClick={() => scrollTo("who-i-help")}>
                Explore how I can help <span>→</span>
              </button>
            </div>
            <p className="hero-topics">
              WEALTH&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;LEADERSHIP&nbsp;&nbsp;&nbsp; /
              &nbsp;&nbsp;&nbsp;LEGACY
            </p>
          </div>

          <div className="hero-portrait" aria-label="Portrait of Kayode Samson Elepe">
            <div className="portrait-halo">
              <img src={asset("c2da8.svg")} alt="" />
            </div>
            <img className="portrait-person" src={asset("eab0f.png")} alt="Kayode Samson Elepe" />
            <div className="portrait-caption">
              <strong>Kayode Samson Elepe, RR</strong>
              <span>KSEFinServe&nbsp; · &nbsp;Clarity. Growth. Impact.</span>
            </div>
          </div>
        </section>

        <section className="impact" aria-label="Impact">
          <div>
            <strong>1,000+</strong>
            <span>Advisors developed</span>
          </div>
          <div>
            <strong>4,500+</strong>
            <span>Families &amp; professionals served</span>
          </div>
          <div>
            <strong>North America</strong>
            <span>A long-term perspective</span>
          </div>
        </section>

        <section id="who-i-help" className="section dark">
          <div className="section-inner reveal">
            <p className="eyebrow">01 / WHO I HELP</p>
            <h2>For the life you’re building.</h2>
            <div className="audience-grid">
              {audiences.map((item, index) => (
                <article className="audience-card interactive-card" key={item.title}>
                  <div className="card-top">
                    <span>0{index + 1}</span>
                    <span>→</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="section slate">
          <div className="section-inner reveal">
            <p className="eyebrow">02 / WAYS I CAN HELP</p>
            <h2>Two paths. One meaningful future.</h2>
            <div className="path-grid">
              {paths.map((item) => (
                <article className="path-card interactive-card" key={item.title}>
                  <p className="eyebrow">{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <p className="path-copy">{item.text}</p>
                  <p className="path-details">{item.details}</p>
                  <button className="text-link gold" onClick={() => scrollTo("conversation")}>
                    {item.link} <span>→</span>
                  </button>
                </article>
              ))}
            </div>
            <p className="section-note">
              Every journey is different. We’ll begin with a conversation about the path that is
              right for you.
            </p>
          </div>
        </section>

        <section className="section approach dark">
          <div className="section-inner approach-grid reveal">
            <div>
              <p className="eyebrow">03 / THE KSE APPROACH</p>
              <h2>
                Not just a plan.
                <br />A clearer perspective.
              </h2>
              <p className="lead">
                Wealth should create choices: to care for your family,
                <br className="desktop-only" /> support causes that matter, and build a lasting
                legacy.
              </p>
              <dl className="principles">
                {principles.map(([term, description]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{description}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="illustration-wrap">
              <LegacyIllustration />
              <p className="eyebrow">A FUTURE BUILT WITH INTENTION</p>
            </div>
          </div>
        </section>

        <section className="section meet light-section">
          <div className="section-inner meet-grid reveal">
            <div className="meet-portrait">
              <img src={asset("eab0f.png")} alt="Kayode Samson Elepe" />
            </div>
            <div className="meet-copy">
              <p className="eyebrow ink">04 / MEET KAYODE</p>
              <h2>
                Analytical thinking.
                <br />
                Human understanding.
              </h2>
              <h3>Kayode Samson Elepe, RR</h3>
              <p>
                My career began in engineering and data, working with organisations including Shell,
                ExxonMobil, Imperial Oil, and the Canada Mortgage and Housing Corporation.
              </p>
              <p>
                Today, I apply that same analytical thinking and long-term perspective to helping
                professionals build wealth and mentoring future financial advisors.
              </p>
              <blockquote>
                “What matters most is helping people make better decisions for themselves, their
                families, and the future they’re creating.”
              </blockquote>
            </div>
          </div>
        </section>

        <section className="section process dark">
          <div className="section-inner reveal">
            <p className="eyebrow">05 / A THOUGHTFUL WAY FORWARD</p>
            <h2>Start with you. Move with purpose.</h2>
            <div className="steps-grid">
              {steps.map(([title, text], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="conversation" className="section conversation slate">
          <div className="section-inner conversation-grid reveal">
            <div className="conversation-copy">
              <p className="eyebrow">06 / YOUR NEXT CHAPTER</p>
              <h2>
                Let’s start with
                <br />a conversation.
              </h2>
              <p className="lead">
                Whether you’re planning your financial future or exploring a career in financial
                services, I’d be honoured to learn more about your goals.
              </p>
              <h3>
                Your goals. Your questions.
                <br />A thoughtful first step.
              </h3>
            </div>
            <form className="contact-form" onSubmit={submit}>
              <h3>What would you like to explore?</h3>
              <div className="field-row">
                <label>
                  Your name
                  <input name="name" autoComplete="name" placeholder="Full name" required />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>
              </div>
              <label>
                I’m interested in
                <select name="interest" defaultValue="" required>
                  <option value="" disabled>
                    Wealth strategy or a career conversation
                  </option>
                  <option>Wealth strategy</option>
                  <option>Financial services career</option>
                  <option>Both wealth and career goals</option>
                </select>
              </label>
              <label>
                What’s on your mind?
                <textarea
                  name="message"
                  placeholder="Tell me a little about your goals…"
                  required
                />
              </label>
              <button className="button button-gold" type="submit">
                {sent ? "Request received" : "Request a conversation"}
              </button>
              <p className="form-note" role="status">
                {sent
                  ? "Thank you. Kayode will be in touch."
                  : "Share only what you’re comfortable discussing."}
              </p>
            </form>
          </div>
        </section>

        <section className="section faq dark">
          <div className="section-inner faq-grid reveal">
            <div>
              <p className="eyebrow">07 / A LITTLE MORE CLARITY</p>
              <h2>
                Good questions.
                <br />
                Clearer answers.
              </h2>
              <p className="lead">
                A better decision starts with
                <br />a better understanding.
              </p>
            </div>
            <div className="questions">
              {questions.map(([question, answer]) => (
                <article key={question}>
                  <h3>{question}</h3>
                  <p>{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
