import { useState } from "react";

const asset = (name: string) => `/assets/${name}`;

const faqs = [
  {
    question: "What is KSEFinServe?",
    answer:
      "KSEFinServe is a mission-driven service focused on helping individuals and aspiring advisors make better decisions for their future. It represents a commitment to clarity, purpose, and long-term growth, serving both individuals and professionals through wealth guidance and leadership development.",
  },
  {
    question: "What is the long-term vision?",
    answer:
      "The long-term vision is to establish KSEFinServe as a trusted partner for individuals and professionals seeking clarity, purpose, and growth. We aim to empower people to build resilient financial foundations and meaningful careers through clear guidance, mentorship, and a commitment to long-term impact.",
  },
  {
    question: "How does the mentorship work?",
    answer:
      "Mentorship is a core part of the Financial Services Business Development path. Kayode works closely with aspiring advisors to develop their leadership skills, business acumen, and client service standards, ensuring they are equipped to succeed in their careers. This mentorship is grounded in his own experience helping develop more than 1,000 advisors and building a multi-million-dollar organisation across North America.",
  },
  {
    question: "Who is wealth guidance for?",
    answer:
      "This path is for professionals and families thinking about retirement, growing their wealth, or making clearer financial decisions. The starting point is your goals and the future you want to build, rather than a one-size-fits-all answer.",
  },
  {
    question: "Can I explore financial services from another career?",
    answer:
      "Yes. Kayode’s own career began in engineering and data before transitioning into financial services. The opportunity is designed for purpose-driven professionals ready to learn, develop their leadership, and build a meaningful business with mentorship and proven systems.",
  },
];

const moneyArt = [
  ["e1c15.svg", "money-one"],
  ["6c1d2.svg", "money-two"],
  ["35afe.svg", "money-three"],
  ["fc32b.svg", "money-four"],
  ["ffa10.svg", "money-five"],
  ["82b1f.svg", "money-six"],
  ["b6237.svg", "money-seven"],
  ["43358.svg", "money-eight"],
  ["def28.svg", "money-nine"],
  ["57c5c.svg", "money-ten"],
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      <p>{children}</p>
    </div>
  );
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <main>
      <section className="hero">
        <img className="hero-glow hero-glow-gold" src={asset("b234a.svg")} alt="" />
        <img className="hero-glow hero-glow-blue" src={asset("828b7.svg")} alt="" />
        <img className="hero-glow hero-glow-purple" src={asset("3a4cb.svg")} alt="" />
        <div className="hero-wordmark">KSEFinServe</div>

        <div className="hero-inner page-pad">
          <div className="hero-copy">
            <Eyebrow>About Kayode · KSEFinServe</Eyebrow>
            <h1>
              An analytical
              <br />
              mind. A <em>people-first</em> mission.
            </h1>
            <p className="hero-description">
              From engineering and data science to wealth guidance and advisor leadership — Kayode Samson
              Elepe, RR, brings rigour, clarity and long-term thinking to every conversation.
            </p>
            <div className="button-row">
              <a className="button button-gold" href="#contact">
                Book a Strategy Session
              </a>
              <a className="button button-outline" href="#paths">
                Explore our process ↓
              </a>
            </div>
            <div className="stats">
              <div>
                <strong>1,000+</strong>
                <span>Advisors developed</span>
              </div>
              <i />
              <div>
                <strong>15 Yrs</strong>
                <span>Industry experience</span>
              </div>
              <i />
              <div>
                <strong>$9M+</strong>
                <span>Annual team production</span>
              </div>
            </div>
          </div>

          <div className="portrait-stack">
            <div className="portrait-arch">
              <img className="portrait-halo" src={asset("a5202.svg")} alt="" />
              <img className="portrait" src={asset("951b0.png")} alt="Kayode Samson Elepe" />
            </div>
            <div className="identity-card">
              <strong>Kayode Samson Elepe, RR</strong>
              <span>KSEFinServe · Wealth &amp; Leadership Development</span>
            </div>
            <div className="float-card">
              <strong>7-fig</strong>
              <span>Personal annual production</span>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip page-pad">
        <div className="trust-label">
          <img src={asset("90719.svg")} alt="" />
          <span>Trusted organisations</span>
        </div>
        <div className="logos" aria-label="Trusted organisations">
          <img src={asset("83ae0.png")} alt="Shell" />
          <img src={asset("1cf6f.png")} alt="ExxonMobil" />
          <img src={asset("8b8a5.png")} alt="Imperial Oil" />
          <img src={asset("a1806.png")} alt="CMHC" />
        </div>
        <p>Shell · ExxonMobil · Imperial Oil · CMHC</p>
      </section>

      <section className="paths page-pad" id="paths">
        <div className="paths-header">
          <div>
            <Eyebrow>02 · How We Can Work Together</Eyebrow>
            <h2>Two paths.<br />Both lead to clarity.</h2>
          </div>
          <p>
            Whether you are growing your own wealth or building a business helping others, the foundation is
            the same: clarity, purpose, and a plan.
          </p>
        </div>
        <div className="service-grid">
          <article className="service-card wealth-card">
            <img src={asset("99851.png")} alt="People discussing wealth strategy" />
            <div className="service-overlay" />
            <div className="service-content">
              <span className="service-tag">Wealth Guidance</span>
              <h3>BUILD<br />WEALTH<br />WITH<br />CLARITY.</h3>
              <p>
                For individuals, professionals and families planning for retirement, growing their assets and
                making more confident financial decisions.
              </p>
              <a className="button service-button-light" href="#contact">Book a Strategy Session</a>
            </div>
          </article>
          <article className="service-card business-card">
            <img src={asset("ee9ac.png")} alt="Professionals developing a business strategy" />
            <div className="service-overlay" />
            <div className="service-content">
              <span className="service-tag">Business Development</span>
              <h3>BUILD<br />LEADERS<br />WITH<br />PURPOSE.</h3>
              <p>
                For purpose-driven professionals ready to launch or grow a financial services career.
                Mentorship, systems and the support of someone who has done it.
              </p>
              <a className="button service-button-blue" href="#contact">Explore the opportunity</a>
            </div>
          </article>
        </div>
      </section>

      <section className="story page-pad">
        <div className="story-copy">
          <p className="section-number">01. THE ARC</p>
          <h2>A Career Defined by Transition</h2>
          <div className="story-body">
            <p>
              My career began in engineering and data, working with organisations including Shell,
              ExxonMobil, Imperial Oil, and the Canada Mortgage and Housing Corporation. That background
              remains part of how I approach financial guidance: examine the information, understand the
              relationships, and look beyond the immediate decision.
            </p>
            <p>
              Today, I apply that same analytical thinking and long-term perspective to helping professionals
              build wealth and mentoring future financial advisors. Financial choices are personal. They sit
              alongside family priorities, career ambitions, and the opportunities people want to create for
              the next generation. Clear thinking matters most when it helps people act with greater
              understanding.
            </p>
            <p>
              Over the past decade, I have helped develop more than 1,000 advisors and build a
              multi-million-dollar organisation across North America. My work brings together two connected
              commitments: helping people make better financial decisions, and helping future advisors grow
              into purposeful leaders.
            </p>
            <p>
              KSEFinServe brings those commitments together. It is a place to explore both the financial
              future you want to build and the contribution you want to make through your work.
            </p>
          </div>
        </div>
        <aside className="story-aside">
          <div className="philosophy-card">
            <h2>Philosophy</h2>
            <p>“Our goal is helping people make better decisions for their families and futures.”</p>
            <p>“Wealth means freedom: to protect family, support causes, and build legacies.”</p>
          </div>
          <div className="video-card">
            <img src={asset("97742.png")} alt="Kayode sharing his career story" />
            <div className="video-shade" />
            <div className="video-meta">
              <span>Video Story</span>
              <strong>A Career Defined by Transition</strong>
            </div>
            <span className="duration">04:18</span>
            <button
              className="play-button"
              type="button"
              onClick={() => setIsPlaying((playing) => !playing)}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              <img src={asset(isPlaying ? "ac793.svg" : "190a4.svg")} alt="" />
            </button>
            <div className="video-controls">
              <span><i style={{ width: isPlaying ? "58%" : "34%" }} /></span>
              <button type="button" onClick={() => setIsPlaying((playing) => !playing)}>
                <img src={asset(isPlaying ? "ac793.svg" : "a3943.svg")} alt="" />
              </button>
              <button type="button"><img src={asset("127cd.svg")} alt="" /></button>
            </div>
          </div>
        </aside>
      </section>

      <section className="values">
        <img className="value-accent value-accent-one" src={asset("efc36.svg")} alt="" />
        <img className="value-accent value-accent-two" src={asset("cf336.svg")} alt="" />
        <img className="value-accent value-accent-three" src={asset("7fde6.svg")} alt="" />
        <img className="value-accent value-accent-four" src={asset("d2a0f.svg")} alt="" />
        {moneyArt.map(([file, className]) => (
          <img key={file} className={`money-art ${className}`} src={asset(file)} alt="" />
        ))}
        <div className="values-inner page-pad">
          <div className="values-header">
            <p className="section-number">02. CORE VALUES</p>
            <h2>The Principles that Guide Us</h2>
            <p>
              At KSEFinServe, we believe that wealth and leadership are intertwined. Our core values ensure
              that every decision we make is rooted in transparency, purpose, and a commitment to the future.
            </p>
          </div>
          <div className="values-composition">
            <div className="value-side value-side-left">
              <small>CORE VALUES</small>
              <h3>Intentional<br />clarity</h3>
              <p>Build Wealth with Clarity.<br />Build Leaders with Purpose.</p>
            </div>
            <div className="clarity-stack">
              <div className="stack-sheet stack-sheet-one" />
              <div className="stack-sheet stack-sheet-two" />
              <img src={asset("d8215.svg")} alt="A framework for making clear financial decisions" />
              <div className="carousel-dots"><i /><i /><i /></div>
            </div>
            <div className="value-side value-side-right">
              <p>
                Clarity, Purpose, and Legacy guide how we help people make better decisions for themselves,
                their families, and the future they are creating.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="faq page-pad">
        <div className="faq-header">
          <p className="section-number">04. FREQUENTLY ASKED QUESTIONS</p>
          <h2>Your questions, answered.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.question} open>
              <summary>{item.question}<span>−</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="closing page-pad" id="contact">
        <img className="closing-glow" src={asset("8641d.svg")} alt="" />
        <div className="closing-copy">
          <Eyebrow>Your next chapter starts here</Eyebrow>
          <h2>A clearer<br />future begins<br />with clarity.</h2>
          <p>
            Whether you are planning your financial future or exploring your next career chapter — let&apos;s
            have a conversation.
          </p>
          <div className="button-row">
            <a className="button button-gold" href="mailto:hello@ksefinserve.com">Book a Session</a>
            <a className="button button-dark" href="/service">Explore our process →</a>
          </div>
        </div>
        <div className="closing-art">
          <img src={asset("b5153.png")} alt="Abstract arches representing clarity and growth" />
          <span>Clarity is only the beginning.</span>
        </div>
      </section>
    </main>
  );
}

export default App;
