/* Public /events page.
   Reads live events from Supabase and renders the hero carousel, the featured
   preview, the three programme concepts and the upcoming list.

   Rebuilt as a real component (the previous version was a static Figma export)
   so the carousel, modals and live data can work properly. */

import { useEffect, useState } from "react";
import {
  eventWhen,
  useEvents,
  type KseEvent,
} from "./admin/eventsDirectory";
const A = "/assets";
const FALLBACK_IMAGE = `${A}/d0f2a.png`;
const FALLBACK_COVER = `${A}/8e421.png`;

type EventPageProps = {
  onModeChange: (mode: "event" | "insight") => void;
};

/** The three programme concepts shown as cards. */
const CONCEPTS = [
  {
    key: "wealth",
    eyebrow: "WEALTH CLARITY",
    title: "Your wealth.\nYour next chapter.",
    body: "Connect your financial decisions to what matters most. Explore priorities, planning and a more intentional path forward.",
    tag: "Conversation concept",
    match: (e: KseEvent) => /wealth/i.test(`${e.category} ${e.title}`),
  },
  {
    key: "leadership",
    eyebrow: "PURPOSEFUL LEADERSHIP",
    title: "Lead with\nmore purpose.",
    body: "For aspiring advisors and purpose-driven professionals. Explore the mindset, service and relationships behind meaningful leadership.",
    tag: "Roundtable concept",
    match: (e: KseEvent) => /leadership|advisor/i.test(`${e.category} ${e.title}`),
  },
  {
    key: "legacy",
    eyebrow: "LEGACY",
    title: "Think beyond\nthe now.",
    body: "Bring family, contribution and the next generation into the conversation. Make room for the future you want to help create.",
    tag: "Conversation concept",
    match: (e: KseEvent) => /legacy|family/i.test(`${e.category} ${e.title}`),
  },
];

function EventImage({ event, className }: { event: KseEvent | null; className?: string }) {
  const src = event?.imageUrl || event?.videoUrl || FALLBACK_IMAGE;
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {event?.videoUrl && !event?.imageUrl ? (
        <video className="absolute inset-0 size-full object-cover" src={event.videoUrl} muted loop playsInline autoPlay />
      ) : (
        <img className="absolute inset-0 size-full object-cover" src={src} alt={event?.imageAlt || event?.title || ""} />
      )}
    </div>
  );
}

/** Full detail modal — everything the admin saved for one event. */
function EventModal({ event, onClose }: { event: KseEvent; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="event-modal-title">
      <button className="modal-scrim" aria-label="Close" onClick={onClose} />
      <section className="event-modal">
        <button className="event-modal-close" onClick={onClose} aria-label="Close">
          <img className="size-[18px]" src={`${A}/490c7.svg`} alt="" />
        </button>
        <div className="event-modal-media">
          <EventImage event={event} className="absolute inset-0" />
        </div>
        <div className="event-modal-body">
          <p className="text-[11px] font-semibold text-[#876728]">
            {event.category || "KSEFinServe event"}
          </p>
          <h2 id="event-modal-title" className="mt-2 text-[30px] font-semibold leading-tight">
            {event.title}
          </h2>
          {event.tagline && <p className="mt-3 text-[15px] leading-[1.6] text-[#56646c]">{event.tagline}</p>}

          <dl className="mt-6 grid grid-cols-2 gap-4 text-[13px]">
            <div>
              <dt className="text-[11px] text-[#66757d]">When</dt>
              <dd className="mt-1">{eventWhen(event)}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-[#66757d]">Format</dt>
              <dd className="mt-1">{event.format || "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-[#66757d]">Where</dt>
              <dd className="mt-1">
                {[event.venueName, event.city, event.country].filter(Boolean).join(", ") || "To be announced"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-[#66757d]">Cost</dt>
              <dd className="mt-1">{event.cost || "Free"}</dd>
            </div>
          </dl>

          {event.description && (
            <div className="mt-6">
              <h3 className="text-[13px] font-semibold">About this gathering</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#404040]">{event.description}</p>
            </div>
          )}
          {event.whoFor && (
            <div className="mt-5">
              <h3 className="text-[13px] font-semibold">Who this is for</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#404040]">{event.whoFor}</p>
            </div>
          )}
          {event.preparation && (
            <div className="mt-5">
              <h3 className="text-[13px] font-semibold">Preparation & accessibility</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#404040]">{event.preparation}</p>
            </div>
          )}
          {event.howToApply && (
            <div className="mt-5">
              <h3 className="text-[13px] font-semibold">How to apply</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#404040]">{event.howToApply}</p>
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            {event.onlineUrl && (
              <a className="gold-button" href={event.onlineUrl} target="_blank" rel="noreferrer">
                Join online →
              </a>
            )}
            {event.registrationStatus === "Open" ? (
              <a className="gold-button" href={`/book-now?event=${encodeURIComponent(event.reference)}`}>
                Register interest →
              </a>
            ) : (
              <a className="white-button" href={`/book-now?event=${encodeURIComponent(event.reference)}`}>
                Join the interest list
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/** One modal listing every event. */
function AllEventsModal({ events, onClose }: { events: KseEvent[]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="all-events-title">
      <button className="modal-scrim" aria-label="Close" onClick={onClose} />
      <section className="event-modal">
        <button className="event-modal-close" onClick={onClose} aria-label="Close">
          <img className="size-[18px]" src={`${A}/490c7.svg`} alt="" />
        </button>
        <div className="event-modal-body">
          <h2 id="all-events-title" className="text-[28px] font-semibold">
            Every gathering
          </h2>
          <p className="mt-2 text-[14px] text-[#66757d]">
            {events.length} event{events.length === 1 ? "" : "s"} in the programme.
          </p>
          <div className="mt-6 space-y-4">
            {events.map((e) => (
              <div key={e.id} className="flex gap-4 rounded-[12px] border border-[#e5e1d8] p-4">
                <EventImage event={e} className="h-[84px] w-[112px] shrink-0 rounded-[8px]" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-[#876728]">{e.category || "Event"}</p>
                  <h3 className="mt-1 text-[16px] font-semibold">{e.title}</h3>
                  <p className="mt-1 text-[12px] text-[#66757d]">{eventWhen(e)}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-[14px] text-[#66757d]">No events have been published yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function EventPage({ onModeChange }: EventPageProps) {
  const { events, loading } = useEvents();
  const [heroIndex, setHeroIndex] = useState(0);
  const [openEvent, setOpenEvent] = useState<KseEvent | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Only published events are public.
  const published = events.filter((e) => e.status === "Published");
  const upcoming = published.filter((e) => e.status === "Published");
  const featured = published.find((e) => e.featured) ?? upcoming[0] ?? null;

  // Keep the carousel index valid as events load or change.
  useEffect(() => {
    if (heroIndex >= published.length) setHeroIndex(0);
  }, [published.length, heroIndex]);

  const hero = published[heroIndex] ?? null;
  const step = (delta: number) => {
    if (published.length === 0) return;
    setHeroIndex((i) => (i + delta + published.length) % published.length);
  };

  return (
    <div className="events-page">
      {/* Hero */}
      <section className="events-hero">
        <div className="events-hero-inner">
          <h1 className="events-hero-title">Events</h1>

          <div className="events-carousel">
            <EventImage event={hero} className="events-carousel-media" />
            <p className="events-carousel-title">{hero?.title || "KSEFinServe Summer Fest 2026"}</p>
            <div className="events-carousel-nav">
              <button type="button" aria-label="Previous event" onClick={() => step(-1)}>
                <img src={`${A}/a9864.svg`} alt="" />
              </button>
              <button type="button" aria-label="Next event" onClick={() => step(1)}>
                <img src={`${A}/585ad.svg`} alt="" />
              </button>
            </div>
          </div>

          <div className="events-hero-actions">
            <button type="button" className="hero-action hero-action--blue" onClick={() => hero && setOpenEvent(hero)}>
              View Details
            </button>
            <button
              type="button"
              className="hero-action hero-action--coral"
              onClick={() => document.querySelector(".events-upcoming")?.scrollIntoView({ behavior: "smooth" })}
            >
              See Schedule
            </button>
          </div>
        </div>
      </section>

      {/* Featured preview */}
      <section className="events-featured">
        <div className="events-featured-head">
          <div>
            <p className="eyebrow">THE EXPERIENCE / FEATURED CONCEPT</p>
            <h2>More than an event.<br />A turning point.</h2>
          </div>
          <p className="events-featured-lede">
            A space to pause, ask better questions and leave with a clearer sense of what comes next.
          </p>
        </div>

        <div className="events-featured-card">
          <div className="events-featured-media">
            <EventImage event={featured} className="absolute inset-0" />
            <span className="events-pill">A gathering imagined for you</span>
          </div>
          <div className="events-featured-body">
            <div className="events-featured-status">
              <span className="events-pill events-pill--blue">FEATURED PREVIEW</span>
              <img className="size-[26px]" src={`${A}/3c71a.svg`} alt="" />
            </div>
            <h3 className="events-featured-title">{featured?.title || "The Clarity Room"}</h3>
            <p className="mt-3 text-[15px] leading-[1.6] text-[#56646c]">
              {featured?.introduction || "A thoughtfully guided gathering connecting financial perspective, purposeful work and the life you want to create."}
            </p>
            <p className="mt-3 text-[13px] text-[#081d2b]">
              {featured ? eventWhen(featured) : "Guided conversation · Practical reflection · Connection"}
            </p>
            <div className="mt-5">
              <p className="text-[13px] text-[#56646c]">
                {featured?.startDate ? eventWhen(featured) : "Dates to be announced"}
              </p>
              <button type="button" className="events-button" onClick={() => featured && setOpenEvent(featured)}>
                Join the interest list
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Programme concepts */}
      <section className="events-concepts">
        <h2 className="events-section-title">The programme</h2>
        <div className="events-concept-grid">
          {CONCEPTS.map((c) => {
            const match = published.find(c.match) ?? null;
            return (
              <article className="events-concept" key={c.key}>
                <p className="eyebrow">{c.eyebrow}</p>
                <h3 className="events-concept-title">
                  {c.title.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-[#56646c]">{c.body}</p>
                <p className="mt-4 text-[13px] text-[#081d2b]">
                  {match?.startDate ? eventWhen(match) : "Dates to be announced"}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[#66757d]">{c.tag}</p>
                <button type="button" className="events-button events-button--ghost" onClick={() => match && setOpenEvent(match)}>
                  View details
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* Upcoming */}
      <section className="events-upcoming">
        <h2 className="events-section-title events-section-title--light">Upcoming Events</h2>
        <p className="events-upcoming-lede">
          Explore the programme concepts shaping the KSEFinServe community. These gatherings connect wealth
          guidance, purposeful work, leadership and legacy with the clarity you need to move forward with confidence.
        </p>

        <div className="events-upcoming-list">
          {loading && <p className="text-[14px] text-[#404040]">Loading events…</p>}
          {!loading && upcoming.length === 0 && (
            <p className="text-[14px] text-[#404040]">No upcoming events have been published yet.</p>
          )}
          {upcoming.map((e) => (
            <article className="events-row" key={e.id}>
              <EventImage event={e} className="events-row-media" />
              <div className="events-row-body">
                <h3>{e.title}</h3>
                <p className="events-row-when">{eventWhen(e)}</p>
                <p className="events-row-tag">{e.category || "Programme concept"}</p>
                <p className="mt-2 text-[14px] leading-[1.6] text-[#404040]">{e.introduction}</p>
                <button type="button" className="events-button events-button--ghost" onClick={() => setOpenEvent(e)}>
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>

        {upcoming.length > 0 && (
          <div className="mt-8 text-center">
            <button type="button" className="events-button" onClick={() => setShowAll(true)}>
              See more
            </button>
          </div>
        )}
      </section>

      {/* Mode toggle */}
      <div className="events-mode-toggle">
        <button type="button" aria-pressed="true" onClick={() => onModeChange("event")}>
          Event
        </button>
        <button type="button" aria-pressed="false" onClick={() => onModeChange("insight")}>
          Insight
        </button>
      </div>

      {openEvent && <EventModal event={openEvent} onClose={() => setOpenEvent(null)} />}
      {showAll && <AllEventsModal events={upcoming} onClose={() => setShowAll(false)} />}
    </div>
  );
}
