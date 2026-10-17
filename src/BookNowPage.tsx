import { FormEvent, ReactNode, useState } from "react";

const A = "/assets";

type Step = "book" | "about" | "interests" | "review" | "received";

type Details = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  country: string;
  contact: string;
  source: string;
  outcome: string;
  context: string;
  question: string;
  availableDate: string;
  availableTime: string;
  path: string;
  priorities: string[];
  route: string;
  topic: string;
};

const initialDetails: Details = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  province: "",
  country: "Canada",
  contact: "Email",
  source: "LinkedIn",
  outcome: "",
  context: "",
  question: "",
  availableDate: "",
  availableTime: "",
  path: "Wealth planning",
  priorities: [],
  route: "Share the full picture",
  topic: "",
};

function Input({
  label,
  value,
  onChange,
  required,
  hint,
  placeholder,
  type,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
  required,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      <span className="select-wrap">
        <select
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {children}
        </select>
        <img src={`${A}/43745.svg`} alt="" />
      </span>
      {hint && <small>{hint}</small>}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {!required && <em> · Optional</em>}
        {required && " *"}
      </span>
      <textarea
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function AvailableTime({
  date,
  time,
  onDate,
  onTime,
  required,
}: {
  date: string;
  time: string;
  onDate: (value: string) => void;
  onTime: (value: string) => void;
  required?: boolean;
}) {
  // Local (not UTC) today, so the boundary matches the user's own clock.
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const isToday = date === today;

  const handleDate = (value: string) => {
    onDate(value);
    // If the newly chosen date is today and the time already picked has passed,
    // clear it so a stale past time can't be submitted.
    if (value === today && time && time < currentTime) onTime("");
  };

  const handleTime = (value: string) => {
    if (isToday && value && value < currentTime) return;
    onTime(value);
  };

  return (
    <div className="field-group">
      <p className="label">Available time{required ? " *" : ""}</p>
      <div className="two-col">
        <label className="field">
          <span>Preferred date{required ? " *" : ""}</span>
          <input
            type="date"
            required={required}
            min={today}
            value={date}
            onChange={(event) => handleDate(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Preferred time{required ? " *" : ""}</span>
          <input
            type="time"
            required={required}
            min={isToday ? currentTime : undefined}
            value={time}
            onChange={(event) => handleTime(event.target.value)}
          />
        </label>
      </div>
      <small>
        {isToday
          ? "Times earlier than now aren’t available today. Pick a later slot, or choose another date."
          : "Pick a slot that suits you. We’ll confirm the exact time when we get in touch."}
      </small>
    </div>
  );
}

function Progress({ active }: { active: 1 | 2 | 3 }) {
  const labels = ["About you", "Your interests", "Review & consent"];
  return (
    <div className="progress" aria-label={`Step ${active} of 3`}>
      {labels.map((label, index) => {
        const number = index + 1;
        const done = number < active;
        return (
          <div className={number <= active ? "active" : ""} key={label}>
            <i />
            <span className={number === active ? "current" : ""}>
              {done ? "✓" : `0${number}`} &nbsp;{label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const sidebarCopy = {
  about: "First, your story.",
  interests: "What matters to you?",
  review: "A thoughtful beginning.",
};

function Companion({ step }: { step: "about" | "interests" | "review" }) {
  return (
    <aside className="companion">
      <div className="companion-main">
        <p className="eyebrow gold">BOOK A SESSION / THE DETAILED ROUTE</p>
        <div className="companion-head">
          <h2>{sidebarCopy[step]}</h2>
          <img
            className="companion-art"
            src={`${A}/6d2cd.png`}
            alt="Two sculptural forms connected by a gold arc"
          />
        </div>
        <p className="muted-light">
          You don’t need a perfect plan. Just a starting point we can explore together.
        </p>
      </div>
      <div className="companion-tail">
        <div className="advisor">
          <span className="portrait">
            <img src={`${A}/eab0f.png`} alt="Kayode Samson Elepe" />
          </span>
          <span>
            <strong>Kayode Samson Elepe, RR</strong>
            <small>A people-first conversation.</small>
          </span>
        </div>
        <hr />
        <p className="privacy">
          Please don’t share account numbers, passwords or sensitive identifiers.
        </p>
        <button
          type="button"
          className="switch-link"
          onClick={() => { window.location.href = "/book-now" }}
        >
          Prefer the short form? Switch route
        </button>
      </div>
    </aside>
  );
}

function DetailedShell({
  active,
  children,
}: {
  active: 1 | 2 | 3;
  children: ReactNode;
}) {
  const names = ["about", "interests", "review"] as const;
  return (
    <main className="detailed-page">
      <header className="flow-head">
        <p className="eyebrow">SHARE THE FULL PICTURE / BOOK A SESSION</p>
        {active === 1 && <p>A little context. A more focused conversation.</p>}
      </header>
      <Progress active={active} />
      <div className="detailed-layout">
        <Companion step={names[active - 1]} />
        {children}
      </div>
    </main>
  );
}

function BookPage({
  onDetailed,
  onQuickSubmit,
}: {
  onDetailed: () => void;
  onQuickSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    topic: string;
    note: string;
    availableDate: string;
    availableTime: string;
  }) => void;
}) {
  const [quick, setQuick] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    note: "",
    availableDate: "",
    availableTime: "",
  });
  const updateQuick = (key: keyof typeof quick) => (value: string) =>
    setQuick((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onQuickSubmit(quick);
  };
  return (
    <main className="book-page">
      <aside className="book-intro">
        <div className="book-intro-main">
          <p className="eyebrow gold">KSEFINSERVE / BOOK A SESSION</p>
          <div className="book-intro-head">
            <h1>
              Your next chapter.
              <span>Let’s talk.</span>
            </h1>
            <img
              className="book-art"
              src={`${A}/e4cfd.png`}
              alt="Two sculptural forms connected by a gold arc"
            />
          </div>
          <p className="muted-light">
            Your wealth. Your ambitions. Your questions. A considered conversation with
            Kayode Samson Elepe, RR — starting wherever you are.
          </p>
        </div>
        <div className="book-intro-tail">
          <p className="art-caption">ONE CONVERSATION. YOUR POSSIBILITIES.</p>
          <p className="muted-light">
            You don’t need to have it all figured out. We’ll begin with what matters to
            you.
          </p>
        </div>
      </aside>
      <section className="surface booking-surface">
        <div>
          <p className="eyebrow">YOUR CONVERSATION, YOUR WAY</p>
          <p className="intro-line">Choose how much you’d like to share now.</p>
        </div>
        <div className="route-options">
          <button className="route selected" type="button">
            <span>
              <b>SHORT FORM / ONE PAGE</b>
              <img src={`${A}/dd38f.svg`} alt="" />
            </span>
            <strong>Let’s talk first</strong>
            <small>Just the essentials. We’ll explore the rest together.</small>
          </button>
          <button className="route" type="button" onClick={onDetailed}>
            <span>
              <b>DETAILED FORM / THREE STEPS</b>
              <img src={`${A}/efe10.svg`} alt="" />
            </span>
            <strong>Share the full picture</strong>
            <small>A little more context for a more focused conversation.</small>
          </button>
        </div>
        <hr />
        <form className="quick-form" onSubmit={submit}>
          <div className="step-heading">
            <h2>A simple hello is enough.</h2>
            <p>
              Leave your details. We’ll contact you to arrange a session and discuss the
              rest on the call.
            </p>
            <small>Fields marked * are required.</small>
          </div>
          <Input label="Your name" value={quick.name} onChange={updateQuick("name")} required />
          <div className="two-col">
            <Input label="Email address" value={quick.email} onChange={updateQuick("email")} required />
            <Input
              label="Phone number"
              value={quick.phone}
              onChange={updateQuick("phone")}
              required
              hint="Include your country code."
            />
          </div>
          <SelectField label="What would you like to talk about?" value={quick.topic} onChange={updateQuick("topic")} required>
            <option value="" disabled>
              Choose a topic
            </option>
            <option>Wealth planning</option>
            <option>Advisor opportunities</option>
            <option>Speaking & partnerships</option>
          </SelectField>
          <TextArea label="Anything you’d like us to know?" value={quick.note} onChange={updateQuick("note")} />
          <AvailableTime
            date={quick.availableDate}
            time={quick.availableTime}
            onDate={updateQuick("availableDate")}
            onTime={updateQuick("availableTime")}
            required
          />
          <label className="check-row">
            <input type="checkbox" required />
            <span>I agree that KSEFinServe may contact me about this session request. *</span>
          </label>
          <button className="primary wide" type="submit">
            Request a session →
          </button>
          <small className="footnote">
            This is a request, not a confirmed appointment. We’ll agree on a time
            together.
          </small>
        </form>
      </section>
    </main>
  );
}

function AboutPage({
  details,
  setDetails,
  next,
  back,
}: {
  details: Details;
  setDetails: (details: Details) => void;
  next: () => void;
  back: () => void;
}) {
  const update = (key: keyof Details) => (value: string) =>
    setDetails({ ...details, [key]: value });
  return (
    <DetailedShell active={1}>
      <form
        className="surface detailed-form"
        onSubmit={(event) => {
          event.preventDefault();
          next();
        }}
      >
        <div className="step-heading">
          <p className="eyebrow">STEP 01 / ABOUT YOU</p>
          <h1>Let’s start with you.</h1>
          <p>Tell us how to reach you and where you’re based. Fields marked * are required.</p>
        </div>
        <SelectField label="Discussion path" value="Wealth planning" onChange={() => {}} required>
          <option>Wealth planning</option>
          <option>Advisor opportunities</option>
          <option>Speaking & partnerships</option>
        </SelectField>
        <div className="two-col">
          <Input label="First name" value={details.firstName} onChange={update("firstName")} required placeholder="Amara" />
          <Input label="Last name" value={details.lastName} onChange={update("lastName")} required placeholder="Okafor" />
        </div>
        <div className="two-col">
          <Input label="Email address" value={details.email} onChange={update("email")} required placeholder="amara.okafor@example.com" />
          <Input label="Phone number" value={details.phone} onChange={update("phone")} required placeholder="+1 416 555 0142" hint="Include your country code." />
        </div>
        <hr />
        <div className="section-heading">
          <h3>Where are you based?</h3>
          <p>Your location helps us understand your enquiry. No street address needed.</p>
        </div>
        <div className="two-col">
          <Input label="City · Optional" value={details.city} onChange={update("city")} placeholder="Toronto" />
          <Input label="Province / state / region · Optional" value={details.province} onChange={update("province")} placeholder="Ontario" />
        </div>
        <SelectField label="Country" value={details.country} onChange={update("country")} required>
          <option>Canada</option>
          <option>United States</option>
          <option>United Kingdom</option>
        </SelectField>
        <div className="two-col">
          <SelectField label="Preferred contact method" value={details.contact} onChange={update("contact")} required>
            <option>Email</option>
            <option>Phone</option>
          </SelectField>
          <SelectField label="How did you hear about KSE? · Optional" value={details.source} onChange={update("source")}>
            <option>LinkedIn</option>
            <option>Referral</option>
            <option>Search</option>
          </SelectField>
        </div>
        <p className="footnote">
          We’ll use these details to follow up on your request. You’ll review your
          information and permissions before sending.
        </p>
        <Actions back={back} />
      </form>
    </DetailedShell>
  );
}

function Actions({ back, submit = "Continue →" }: { back: () => void; submit?: string }) {
  return (
    <div className="actions">
      <button type="button" className="secondary" onClick={back}>
        ← Back
      </button>
      <button type="submit" className="primary">
        {submit}
      </button>
    </div>
  );
}

function InterestsPage({
  details,
  setDetails,
  next,
  back,
}: {
  details: Details;
  setDetails: (details: Details) => void;
  next: () => void;
  back: () => void;
}) {
  const [priorities, setPriorities] = useState<string[]>(details.priorities ?? []);
  const [path, setPath] = useState(details.path || "Wealth planning");
  const toggle = (priority: string) => {
    const next = priorities.includes(priority)
      ? priorities.filter((item) => item !== priority)
      : [...priorities, priority];
    setPriorities(next);
    setDetails({ ...details, priorities: next });
  };
  const choosePath = (next: string) => {
    setPath(next);
    setDetails({ ...details, path: next });
  };
  const update = (key: keyof Details) => (value: string) =>
    setDetails({ ...details, [key]: value });
  const choices = [
    "Retirement planning",
    "Growing my wealth",
    "Family protection",
    "Financial foundations",
    "Education & family",
    "Legacy planning",
  ];
  return (
    <DetailedShell active={2}>
      <form
        className="surface detailed-form interests-form"
        onSubmit={(event) => {
          event.preventDefault();
          next();
        }}
      >
        <div className="step-heading">
          <p className="eyebrow">STEP 02 / YOUR INTERESTS</p>
          <h1>What would you like<br />to make possible?</h1>
          <p>A few thoughtful details help us prepare. Broad strokes are enough. Fields marked * are required.</p>
        </div>
        <div className="field-group">
          <p className="label">Choose your discussion path *</p>
          <div className="topic-choices">
            {[
              ["Wealth planning", "Your goals & financial priorities"],
              ["Advisor opportunities", "Your career stage & ambitions"],
              ["Speaking & partnerships", "Your event, audience & ideas"],
            ].map(([title, copy]) => {
              const selected = path === title;
              return (
                <button
                  type="button"
                  className={`topic ${selected ? "selected" : ""}`}
                  key={title}
                  onClick={() => choosePath(title)}
                >
                  <img src={`${A}/${selected ? "dd38f" : "efe10"}.svg`} alt="" />
                  <strong>{title}</strong>
                  <small>{copy}</small>
                </button>
              );
            })}
          </div>
          <small>Questions follow your chosen path. Career and partnership enquiries won’t be asked for wealth-planning details.</small>
        </div>
        <hr />
        <p className="eyebrow">YOUR WEALTH-PLANNING CONVERSATION</p>
        <div className="field-group">
          <p className="label">What matters most right now? *</p>
          <small>Choose the priorities you’d like to explore.</small>
          <div className="priority-list">
            {choices.map((choice) => {
              const selected = priorities.includes(choice);
              return (
                <button type="button" className={selected ? "selected" : ""} onClick={() => toggle(choice)} key={choice}>
                  <img src={`${A}/${selected ? "b4a00" : "e316c"}.svg`} alt="" />
                  {choice}
                </button>
              );
            })}
          </div>
        </div>
        <TextArea label="What would a good outcome look like?" value={details.outcome} onChange={update("outcome")} required placeholder="I’d like a clearer retirement plan and a more intentional approach to growing my savings." />
        <div className="two-col">
          <SelectField label="Where are you in your planning?" value="Building on an existing plan" onChange={() => {}} required>
            <option>Building on an existing plan</option>
            <option>Starting from scratch</option>
          </SelectField>
          <SelectField label="When would you like to take a next step?" value="Within the next 3–6 months" onChange={() => {}} required>
            <option>Within the next 3–6 months</option>
            <option>As soon as possible</option>
          </SelectField>
        </div>
        <TextArea label="Relevant context" value={details.context} onChange={update("context")} placeholder="I’m balancing long-term savings with family responsibilities and would like to review my priorities." hint="Life changes, responsibilities or a general starting point — no balances or account details needed." />
        <TextArea label="Questions you’d like to ask" value={details.question} onChange={update("question")} placeholder="How can I balance retirement saving with other family goals?" />
        <AvailableTime
          date={details.availableDate}
          time={details.availableTime}
          onDate={update("availableDate")}
          onTime={update("availableTime")}
          required
        />
        <div className="notice">
          <img src={`${A}/b803f.svg`} alt="" />
          <span>Keep it general. Do not share identification numbers, account numbers, passwords or financial documents.</span>
        </div>
        <Actions back={back} />
      </form>
    </DetailedShell>
  );
}

function ReviewDetail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="review-detail">
      <small>{label}</small>
      <span>{children}</span>
    </div>
  );
}

function ReviewPage({
  details,
  back,
  submit,
  edit,
}: {
  details: Details;
  back: () => void;
  submit: () => void;
  edit: (step: Step) => void;
}) {
  return (
    <DetailedShell active={3}>
      <form
        className="surface detailed-form review-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="step-heading">
          <p className="eyebrow">STEP 03 / REVIEW & CONSENT</p>
          <h1>A final look, then hello.</h1>
          <p>Check your details and give us permission to follow up. Nothing is sent until you request your session.</p>
        </div>
        <ReviewSection title="Your conversation" edit={() => edit("about")}>
          <div className="review-grid">
            <ReviewDetail label="Booking route">Share the full picture</ReviewDetail>
            <ReviewDetail label="Discussion path">{details.path || "Wealth planning"}</ReviewDetail>
          </div>
        </ReviewSection>
        <ReviewSection title="About you" edit={() => edit("about")}>
          <div className="review-grid">
            <div>
              <ReviewDetail label="Name">{details.firstName} {details.lastName}</ReviewDetail>
              <ReviewDetail label="Email">{details.email}</ReviewDetail>
              <ReviewDetail label="Phone">{details.phone}</ReviewDetail>
            </div>
            <div>
              <ReviewDetail label="Location">{details.city}, {details.province}, {details.country}</ReviewDetail>
              <ReviewDetail label="Preferred contact">{details.contact}</ReviewDetail>
              <ReviewDetail label="Heard about KSE through">{details.source}</ReviewDetail>
            </div>
          </div>
        </ReviewSection>
        <ReviewSection title="Your interests" edit={() => edit("interests")}>
          <ReviewDetail label="Priorities">{details.priorities?.length ? details.priorities.join(" · ") : "None selected"}</ReviewDetail>
          <ReviewDetail label="A good outcome">{details.outcome}</ReviewDetail>
          <div className="review-grid">
            <ReviewDetail label="Current stage">Building on an existing plan</ReviewDetail>
            <ReviewDetail label="Timeframe">Within the next 3–6 months</ReviewDetail>
          </div>
          <ReviewDetail label="Relevant context">{details.context}</ReviewDetail>
          <ReviewDetail label="Your question">{details.question}</ReviewDetail>
          <ReviewDetail label="Available time">
            {details.availableDate || details.availableTime
              ? `${details.availableDate || "Date not set"}${details.availableTime ? ` at ${details.availableTime}` : ""}`
              : "Not set"}
          </ReviewDetail>
        </ReviewSection>
        <div className="permissions">
          <h3>Your permissions</h3>
          <label className="check-row">
            <input type="checkbox" defaultChecked required />
            <span>I agree that KSEFinServe may contact me using the details provided to discuss and arrange this session. Required *</span>
          </label>
          <label className="check-row">
            <input type="checkbox" />
            <span>I’d also like KSE insights and updates by email. Optional — I can unsubscribe at any time.</span>
          </label>
          <small>Your information is provided for this enquiry. Newsletter sign-up is separate and isn’t needed to request a session.</small>
        </div>
        <Actions back={back} submit="Request a session →" />
        <small className="footnote">Submitting sends a request. KSE will contact you to arrange the session; no appointment is booked yet.</small>
      </form>
    </DetailedShell>
  );
}

function ReviewSection({
  title,
  edit,
  children,
}: {
  title: string;
  edit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="review-section">
      <header>
        <h3>{title}</h3>
        <button type="button" onClick={edit}>Edit</button>
      </header>
      {children}
    </section>
  );
}

function ReceivedPage({ details, restart }: { details: Details; restart: () => void }) {
  const contactDetail = details.contact === "Phone" ? details.phone : details.email;
  const when =
    details.availableDate || details.availableTime
      ? `${details.availableDate || "Date not set"}${details.availableTime ? ` at ${details.availableTime}` : ""}`
      : "To be arranged";
  return (
    <main className="received-page">
      <div className="confirmation">
        <section className="confirmation-copy">
          <p className="received-status">
            <img src={`${A}/1f793.svg`} alt="" />
            YOUR REQUEST HAS BEEN RECEIVED
          </p>
          <h1>
            Thank you, {details.firstName || "there"}.
            <span>A good beginning.</span>
          </h1>
          <p className="lead">KSEFinServe will contact you to arrange your session. We look forward to hearing more about what matters to you.</p>
          <div className="summary">
            <p className="eyebrow">YOUR ENQUIRY</p>
            <h3>{details.topic || details.path || "Wealth planning"}</h3>
            <p>{details.route || "Share the full picture"} · Preferred contact: {details.contact}<br />{contactDetail}</p>
            <hr />
            <small>Preferred time: {when}<br />No appointment is booked yet. We’ll agree on a suitable time when we get in touch.</small>
          </div>
          <div className="confirmation-actions">
            <button className="primary" type="button" onClick={restart}>Return to KSEFinServe</button>
            <button className="secondary" type="button">Explore insights →</button>
          </div>
        </section>
        <figure>
          <img src={`${A}/cdc33.png`} alt="Two sculptural forms facing each other" />
          <figcaption>CLARITY STARTS WITH A CONVERSATION.</figcaption>
        </figure>
      </div>
      <section className="while-wait">
        <div>
          <p className="eyebrow">WHAT HAPPENS NEXT</p>
          <h2>We’ll reach out.<br />Then we’ll arrange the session.</h2>
          <p>Your preferred contact method helps guide our follow-up. The session details will be agreed with you directly.</p>
        </div>
        <div>
          <p className="eyebrow">IN THE MEANTIME</p>
          <h2>Keep one question in mind.</h2>
          <p>What would greater clarity make possible for you? There’s no need to send documents or sensitive financial information.</p>
        </div>
      </section>
    </main>
  );
}

export default function BookNowPage() {
  const [step, setStep] = useState<Step>("book");
  const [details, setDetails] = useState(initialDetails);

  const top = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let content;
  if (step === "received") {
    content = <ReceivedPage details={details} restart={() => top("book")} />;
  } else if (step === "review") {
    content = <ReviewPage details={details} back={() => top("interests")} submit={() => top("received")} edit={top} />;
  } else if (step === "interests") {
    content = <InterestsPage details={details} setDetails={setDetails} next={() => top("review")} back={() => top("about")} />;
  } else if (step === "about") {
    content = <AboutPage details={details} setDetails={setDetails} next={() => top("interests")} back={() => top("book")} />;
  } else {
    content = (
      <BookPage
        onDetailed={() => top("about")}
        onQuickSubmit={(data) => {
          const [firstName, ...rest] = data.name.trim().split(" ");
          setDetails((current) => ({
            ...current,
            firstName: firstName || "",
            lastName: rest.join(" "),
            email: data.email,
            phone: data.phone,
            topic: data.topic,
            route: "Short form",
            question: data.note,
            availableDate: data.availableDate,
            availableTime: data.availableTime,
          }));
          top("received");
        }}
      />
    );
  }

  return <div className="book-now-page">{content}</div>;
}
