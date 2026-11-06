import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useBookings, type BookingInput } from "./admin/bookingsDirectory";

const A = "/assets";

const CLIENT_TIMEZONE = "America/Chicago"; // CDT timezone for booking

// Format ISO date/time to human-readable in USER'S LOCAL TIMEZONE (e.g., "Nov 11, 2026 at 8:00 AM WAT")
function formatDateTime(dateStr: string, timeStr: string): string {
  if (!dateStr && !timeStr) return "Not set";
  if (!dateStr) return `Time ${timeStr}`;
  if (!timeStr) return dateStr;

  try {
    // Handle both ISO strings (2026-11-24T14:00:00.000Z) and time-only strings (14:00)
    let date: Date;
    if (timeStr.includes('T') || timeStr.includes('Z') || timeStr.includes('.')) {
      // timeStr is already an ISO datetime string
      date = new Date(timeStr);
    } else {
      // timeStr is time-only, combine with dateStr
      date = new Date(`${dateStr}T${timeStr}`);
    }
    if (isNaN(date.getTime())) return `${dateStr} at ${timeStr}`;

    // Use USER'S LOCAL timezone for display
    const day = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const tz = date.toLocaleTimeString("en-US", {
      timeZoneName: "short",
    }).split(" ").pop() || "";

    return `${day} at ${time} ${tz}`;
  } catch {
    return `${dateStr} at ${timeStr}`;
  }
}

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
  consentContact: boolean;
  consentUpdates: boolean;
};

const initialDetails: Details = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  province: "",
  country: "United States",
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
  consentContact: true,
  consentUpdates: false,
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

// Time slot types
type TimeSlot = {
  label: string;      // e.g., "8:00 AM"
  value: string;      // ISO string for submission
  start: string;      // ISO start
  end: string;        // ISO end
};

function TimeSlotPicker({
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
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timezone, setTimezone] = useState(() => 
    typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/Chicago"
  );
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Get today's date in USER'S timezone for min date validation
    const getTodayInTimezone = (tz: string): string => {
      try {
        return new Date().toLocaleDateString("en-CA", { timeZone: tz }); // YYYY-MM-DD
      } catch {
        return new Date().toISOString().split("T")[0];
      }
    };

  // Fetch available slots when date changes
  useEffect(() => {
    if (!date) {
      setSlots([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    setError(null);
    setIsOpen(false);
    fetch(`/.netlify/functions/calendar?date=${date}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load availability");
        return res.json();
      })
      .then((data) => {
                    // Convert slot times to user's local timezone for display
                    const userTz = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/Chicago";

                    const convertedSlots = (data.slots || []).map((s: TimeSlot) => {
                      const start = new Date(s.start);
                      const time12 = start.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: userTz,
                      });
                      return {
                        ...s,
                        label: time12,
                      };
                    });

                    setSlots(convertedSlots);
                    setTimezone(data.timezone || "America/Chicago");
                    // If previously selected time is no longer available, clear it
                    if (time && !data.slots?.some((s: TimeSlot) => s.value === time)) {
                      onTime("");
                    }
                  })
      .catch((err) => {
        setError(err.message);
        setSlots([]);
      })
      .finally(() => setLoading(false));
  }, [date]);

  const handleDate = (value: string) => {
    onDate(value);
    onTime(""); // Clear time when date changes
    setIsOpen(false);
  };

  // Format timezone for display (e.g., "America/Chicago" → "CDT", "Africa/Lagos" → "WAT")
    const getTimezoneLabel = (tz: string) => {
      // Known timezone abbreviations for common zones
      const tzMap: Record<string, string> = {
        "Africa/Lagos": "WAT",
        "Africa/Cairo": "EET",
        "Africa/Johannesburg": "SAST",
        "America/Chicago": "CDT", // Will be CST/CDT depending on DST
        "America/New_York": "EDT", // Will be EST/EDT depending on DST
        "America/Los_Angeles": "PDT", // Will be PST/PDT depending on DST
        "Europe/London": "BST", // Will be GMT/BST depending on DST
        "Europe/Paris": "CEST", // Will be CET/CEST depending on DST
        "Asia/Dubai": "GST",
        "Asia/Singapore": "SGT",
        "Asia/Tokyo": "JST",
        "Australia/Sydney": "AEDT", // Will be AEST/AEDT depending on DST
        "Pacific/Auckland": "NZDT", // Will be NZST/NZDT depending on DST
      };

      // Try to get from map first
      if (tzMap[tz]) {
        // For US zones, try to get actual DST-aware abbreviation
        if (tz.startsWith("America/")) {
          try {
            return new Date().toLocaleTimeString("en-US", { timeZone: tz, timeZoneName: "short" }).split(" ").pop() || tzMap[tz];
          } catch {
            return tzMap[tz];
          }
        }
        return tzMap[tz];
      }

      // Fallback to browser's built-in
      try {
        return new Date().toLocaleTimeString("en-US", { timeZone: tz, timeZoneName: "short" }).split(" ").pop() || tz;
      } catch {
        return tz;
      }
    };

  // User's actual timezone for display
  const userTimezone = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/Chicago";
  const userTimezoneLabel = getTimezoneLabel(userTimezone);

  const selectedSlot = slots.find((s) => s.value === time);

  // Clock icon SVG
  const clockIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  // Chevron down icon SVG
  const chevronIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  return (
    <div className="field-group">
      <p className="label">Available time{required ? " *" : ""}</p>
      <div className="two-col">
        <label className="field">
          <span>Preferred date{required ? " *": ""}</span>
          <input
            type="date"
            required={required}
            min={getTodayInTimezone(userTimezone)}
            value={date}
            onChange={(event) => handleDate(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Preferred time{required ? " *": ""}</span>
          <div className="time-field-wrapper">
            {loading && <span className="loading-slots">Loading…</span>}
            {!loading && slots.length === 0 && date && (
              <span className="no-slots">No slots — pick another date</span>
            )}
            {!loading && slots.length > 0 && (
              <div className="time-dropdown">
                <button
                  ref={triggerRef}
                  type="button"
                  className={`time-dropdown-trigger ${time ? "has-value" : ""}`}
                  onClick={() => setIsOpen(!isOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  aria-label="Select time"
                >
                  <span className="time-dropdown-icon">{clockIcon}</span>
                  <span className="time-dropdown-value">
                    {time ? selectedSlot?.label || time : "Select a time"}
                  </span>
                  <span className="time-dropdown-chevron">{chevronIcon}</span>
                </button>
                {isOpen && (
                  <div
                    ref={menuRef}
                    className="time-dropdown-menu"
                    role="listbox"
                    aria-label="Available time slots"
                  >
                    {slots.map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        className={`time-dropdown-option ${time === slot.value ? "selected" : ""}`}
                        onClick={() => {
                          onTime(slot.value);
                          setIsOpen(false);
                        }}
                        role="option"
                        aria-selected={time === slot.value}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <small className="timezone-note">Time zone: {userTimezoneLabel}</small>
          </div>
        </label>
      </div>
      {error && <p className="slot-error">{error}</p>}
      <small>
        Pick a slot that suits you. We'll confirm the exact time when we get in touch.
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
            <img src={`${A}/pix-removebg-preview.png`} alt="Kayode Samson Elepe" />
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
  path,
  onQuickSubmit,
  submitting,
  error,
}: {
  path?: string;
  onDetailed: () => void;
  onQuickSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    topic: string;
    note: string;
    availableDate: string;
    availableTime: string;
    city?: string;
    province?: string;
    country?: string;
    route?: string;
    path?: string;
  }) => void;
  submitting?: boolean;
  error?: string | null;
}) {
  const currentPath = path ?? "Wealth planning";
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
    // Derive route from path: if path is the default "Wealth planning", it's short form; otherwise detailed
    const derivedRoute = currentPath !== "Wealth planning" && currentPath !== "Share the full picture" ? "Detailed form" : "Short form";
    onQuickSubmit({
      ...quick,
      city: "",
      province: "",
      country: "",
      route: derivedRoute,
      path: currentPath,
    });
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
          <TextArea label="Anything you'd like us to know?" value={quick.note} onChange={updateQuick("note")} />
                    <TimeSlotPicker
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
          {error && (
            <p className="submit-error">
              We could not save your request. {error} Please try again.
            </p>
          )}
          <button className="primary wide" type="submit" disabled={submitting}>
            {submitting ? "Sending your request…" : "Request a session →"}
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
                  <Input label="City · Optional" value={details.city} onChange={update("city")} placeholder="New York" />
                  <Input label="Province / state / region · Optional" value={details.province} onChange={update("province")} placeholder="New York" />
                </div>
                <SelectField label="Country" value={details.country} onChange={update("country")} required>
                  <option>United States</option>
                  <option>Canada</option>
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
                      <option>Social Media (Instagram, Twitter, Facebook)</option>
                      <option>Email Newsletter</option>
                      <option>Event / Webinar</option>
                      <option>Podcast</option>
                      <option>Article / Blog Post</option>
                      <option>Word of Mouth</option>
                      <option>Other</option>
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

function Actions({ back, submit = "Continue →", disabled }: { back: () => void; submit?: string; disabled?: boolean }) {
  return (
    <div className="actions">
      <button type="button" className="secondary" onClick={back} disabled={disabled}>
        ← Back
      </button>
      <button type="submit" className="primary" disabled={disabled}>
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
        setDetails((prev: Details) => ({ ...prev, [key]: value }));
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
        <TextArea label="Questions you'd like to ask" value={details.question} onChange={update("question")} placeholder="How can I balance retirement saving with other family goals?" />
                <TimeSlotPicker
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
  setDetails,
  back,
  submit,
  edit,
  submitting,
  error,
}: {
  details: Details;
  setDetails: (details: Details) => void;
  back: () => void;
  submit: () => void;
  edit: (step: Step) => void;
  submitting?: boolean;
  error?: string | null;
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
                      {formatDateTime(details.availableDate, details.availableTime)}
                    </ReviewDetail>
        </ReviewSection>
        <div className="permissions">
          <h3>Your permissions</h3>
          <label className="check-row">
            <input
              type="checkbox"
              required
              checked={details.consentContact}
              onChange={(event) => setDetails({ ...details, consentContact: event.target.checked })}
            />
            <span>I agree that KSEFinServe may contact me using the details provided to discuss and arrange this session. Required *</span>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={details.consentUpdates}
              onChange={(event) => setDetails({ ...details, consentUpdates: event.target.checked })}
            />
            <span>I’d also like KSE insights and updates by email. Optional — I can unsubscribe at any time.</span>
          </label>
          <small>Your information is provided for this enquiry. Newsletter sign-up is separate and isn’t needed to request a session.</small>
        </div>
        {error && (
          <p className="submit-error">
            We could not save your request. {error} Please try again.
          </p>
        )}
        <Actions back={back} submit={submitting ? "Sending your request…" : "Request a session →"} disabled={submitting} />
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

function ReceivedPage({ details, reference, restart }: { details: Details; reference?: string | null; restart: () => void }) {
  const contactDetail = details.contact === "Phone" ? details.phone : details.email;
  const when = formatDateTime(details.availableDate, details.availableTime);
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
            <small>Record reference: {reference ?? "—"}<br />Preferred time: {when}<br />No appointment is booked yet. We’ll agree on a suitable time when we get in touch.</small>
          </div>
          <div className="confirmation-actions">
            <button className="primary" type="button" onClick={restart}>Return to KSEFinServe</button>
            <button className="secondary" type="button" onClick={() => window.open(`https://www.google.com/calendar/render?text=KSEFinServe+Session+&details=${encodeURIComponent(details.topic || details.path || 'Wealth planning')}&dates=${when}&sf=true`, '_blank')}>Add to calendar</button>
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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const { submitBooking } = useBookings();

  const top = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Send the completed enquiry to Supabase. */
  const send = async (data: Details) => {
    setSubmitting(true);
    setSubmitError(null);
    const payload: BookingInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      province: data.province,
      country: data.country,
      contactMethod: data.contact,
      source: data.source,
      route: data.route,
      path: data.path,
      topic: data.topic,
      priorities: data.priorities,
      outcome: data.outcome,
      context: data.context,
      question: data.question,
      availableDate: data.availableDate,
      availableTime: data.availableTime,
      consentContact: data.consentContact,
      consentUpdates: data.consentUpdates,
    };
    const result = await submitBooking(payload);
    setSubmitting(false);
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    setReference(result.reference ?? null);
    top("received");
  };

  let content;
  if (step === "received") {
    content = <ReceivedPage details={details} reference={reference} restart={() => top("book")} />;
  } else if (step === "review") {
    content = <ReviewPage details={details} setDetails={setDetails} back={() => top("interests")} submit={() => void send(details)} edit={top} submitting={submitting} error={submitError} />;
  } else if (step === "interests") {
    content = <InterestsPage details={details} setDetails={setDetails} next={() => top("review")} back={() => top("about")} />;
  } else if (step === "about") {
    content = <AboutPage details={details} setDetails={setDetails} next={() => top("interests")} back={() => top("book")} />;
  } else {
    content = (
      <BookPage
        path="Wealth planning"
        onDetailed={() => top("about")}
        onQuickSubmit={(data) => {
          const [firstName, ...rest] = data.name.trim().split(" ");
          const next: Details = {
            ...details,
            firstName: firstName || "",
            lastName: rest.join(" "),
            email: data.email,
            phone: data.phone,
            topic: data.topic,
            route: data.route ?? "Short form",
            path: data.path ?? (data.topic || "Wealth planning"),
            question: data.note,
            availableDate: data.availableDate,
            availableTime: data.availableTime,
            // The short form has no "how did you hear about us" field, so it
            // stays empty rather than inheriting a default.
            source: "",
            city: data.city ?? "",
            province: data.province ?? "",
            country: data.country ?? "",
            consentContact: true,
            consentUpdates: false,
          };
          setDetails(next);
          void send(next);
        }}
        submitting={submitting}
        error={submitError}
      />
    );
  }

  return <div className="book-now-page">{content}</div>;
}
