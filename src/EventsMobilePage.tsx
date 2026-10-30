import { useState } from "react";
import {
  eventWhen,
  upcomingEvents,
  useEvents,
  type KseEvent,
} from "./admin/eventsDirectory";
const assetPathPrefix = "/assets";
const FALLBACK_HERO = [
  `${assetPathPrefix}/8e421.png`,
  `${assetPathPrefix}/d0f2a.png`,
  `${assetPathPrefix}/ce1b2.png`,
  `${assetPathPrefix}/d1795.png`,
];
const imgVariant9 = `${assetPathPrefix}/37c0a.svg`;
const imgCoralSculpture = `${assetPathPrefix}/ced68.png`;
const imgBlueSculpture = `${assetPathPrefix}/10be3.png`;
const imgSummerFestVideoCover = `${assetPathPrefix}/8e421.png`;
const imgRoundtableExperience = `${assetPathPrefix}/d0f2a.png`;
const imgStoryPhotograph = `${assetPathPrefix}/81163.png`;
const imgStoryPhotograph1 = `${assetPathPrefix}/6d708.png`;
const imgStoryPhotograph2 = `${assetPathPrefix}/9896c.png`;
const imgStoryPhotograph3 = `${assetPathPrefix}/bfdda.png`;
const imgStoryPhotograph4 = `${assetPathPrefix}/30267.png`;
const imgStoryPhotograph5 = `${assetPathPrefix}/19bbe.png`;
const imgStoryPhotograph6 = `${assetPathPrefix}/264fb.png`;
const imgCommunityConversation = `${assetPathPrefix}/ce1b2.png`;
const imgStoryPhotograph7 = `${assetPathPrefix}/cedac.png`;
const imgReflectiveMoment = `${assetPathPrefix}/d1795.png`;
const imgStoryPhotograph8 = `${assetPathPrefix}/dc38b.png`;
const imgKayodeSamsonElepePortrait = `${assetPathPrefix}/eab0f.png`;
const imgConnectionLandmark = `${assetPathPrefix}/b5153.png`;
const imgComponent2 = `${assetPathPrefix}/00e25.svg`;
const imgPreviousEvent = `${assetPathPrefix}/a9864.svg`;
const imgNextEvent = `${assetPathPrefix}/585ad.svg`;
const imgSpark = `${assetPathPrefix}/3c71a.svg`;
const imgPortraitHalo = `${assetPathPrefix}/d2ec5.svg`;
const imgUsers = `${assetPathPrefix}/d04b8.svg`;
const imgCalendarDays = `${assetPathPrefix}/2309d.svg`;
const imgNotebookPen = `${assetPathPrefix}/02636.svg`;
const imgAccessibility = `${assetPathPrefix}/78cf4.svg`;
const imgEmail = `${assetPathPrefix}/f69e2.svg`;
const imgAtmosphericLight = `${assetPathPrefix}/46fb3.svg`;

type Component1Props = {
  className?: string;
  variant?: "9";
};

function Component1({ className, variant = "9" }: Component1Props) {
  return (
    <div className={className || "h-[93.25px] relative w-[1170px]"} data-node-id="1:519">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVariant9} />
    </div>
  );
}

type EventsPageProps = {
  onShowInsights: () => void;
};

/** Detail modal for the mobile events page. */
function MobileEventModal({ event, onClose }: { event: KseEvent; onClose: () => void }) {
  const { registerInterest } = useEvents();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (busy) return;
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please add your name, email and phone number.");
      return;
    }
    setBusy(true);
    const result = await registerInterest(event.id, { name, email, phone });
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    
    // Send admin notification and user confirmation (non-blocking)
    try {
      const { sendContactNotification, sendEventInterestConfirmation } = await import('@/lib/email')
      const reference = `EVT-${Date.now().toString(36).toUpperCase()}`
      await Promise.all([
        sendContactNotification({
          name: name,
          email: email,
          subjectPrefix: "Event Form",
          subject: `Event Interest: ${event.title || event.name}`,
          message: `A user has expressed interest in the event: ${event.title || event.name}\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`,
        }),
        sendEventInterestConfirmation({
          userEmail: email,
          userName: name,
          eventTitle: event.title || event.name,
          eventDate: event.startDate || 'TBA',
          eventTime: event.startTime || 'TBA',
          eventLocation: event.location || 'Online / TBD',
          eventDescription: event.description || '',
          reference,
        }),
      ])
    } catch (err) {
      console.error('Event interest email failed to send:', err)
    }
    setDone(true);
  };

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="mobile-event-title">
      <button className="modal-scrim" aria-label="Close" onClick={onClose} />
      <section className="event-modal">
        <button className="event-modal-close" onClick={onClose} aria-label="Close">
          <svg className="size-[16px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="#081d2b" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div className="event-modal-media">
          {event.videoUrl && !event.imageUrl ? (
            <video className="absolute inset-0 size-full object-cover" src={event.videoUrl} controls />
          ) : (
            <img
              className="absolute inset-0 size-full object-cover"
              src={event.imageUrl || event.videoUrl || `${assetPathPrefix}/d0f2a.png`}
              alt={event.imageAlt || event.title}
            />
          )}
        </div>
        <div className="event-modal-body">
          <p className="text-[11px] font-semibold text-[#876728]">{event.category || "KSEFinServe event"}</p>
          <h2 id="mobile-event-title" className="mt-2 text-[26px] font-semibold leading-tight">{event.title}</h2>
          {event.tagline && <p className="mt-3 text-[14px] leading-[1.6] text-[#56646c]">{event.tagline}</p>}

          <dl className="mt-5 grid grid-cols-2 gap-4 text-[13px]">
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
            <div className="mt-5">
              <h3 className="text-[13px] font-semibold">About this gathering</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#404040]">{event.description}</p>
            </div>
          )}
          {event.whoFor && (
            <div className="mt-4">
              <h3 className="text-[13px] font-semibold">Who this is for</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#404040]">{event.whoFor}</p>
            </div>
          )}
          {event.preparation && (
            <div className="mt-4">
              <h3 className="text-[13px] font-semibold">Preparation & accessibility</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#404040]">{event.preparation}</p>
            </div>
          )}
          {event.howToApply && (
            <div className="mt-4">
              <h3 className="text-[13px] font-semibold">How to apply</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#404040]">{event.howToApply}</p>
            </div>
          )}

          <hr className="my-5 border-[#e5e1d8]" />
          <h3 className="text-[14px] font-semibold">Register your interest</h3>
          {done ? (
            <p className="interest-success">
              Thank you, {name.trim() || "there"}. Your interest has been recorded.
            </p>
          ) : (
            <div className="interest-form">
              <label>
                Your name
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Amara Okafor" />
              </label>
              <label>
                Email address
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </label>
              <label>
                Phone number
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 416 555 0142" />
              </label>
              {error && <p className="interest-error">{error}</p>}
              <button type="button" className="gold-button" onClick={submit} disabled={busy}>
                {busy ? "Sending…" : "Register interest →"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function KseEventsMobile({ onShowInsights }: EventsPageProps) {
  const { events } = useEvents();
  // Programme concepts carousel: one session is shown at a time, navigated
  // with the arrows below it.
  const [activeSession, setActiveSession] = useState(0);
  // Hero carousel: steps through the published events.
  const [activeHero, setActiveHero] = useState(0);
  // Upcoming events carousel: one event concept at a time, same pattern.
  const [activeEvent, setActiveEvent] = useState(0);
  const [openEvent, setOpenEvent] = useState<KseEvent | null>(null);

  // Only published events that have not happened yet are public, soonest
  // first, so the hero and the cards always lead with what is next.
  const published = upcomingEvents(events);
  const hero = published[activeHero] ?? null;
  // The featured concept is the one the admin marked as featured.
  const featured = published.find((e) => e.featured) ?? published[0] ?? null;

  const stepHero = (delta: number) => {
    if (published.length === 0) return;
    setActiveHero((i) => (i + delta + published.length) % published.length);
  };

  return (
    <div className="bg-[#f6f3ec] content-stretch flex flex-col items-start relative size-full" data-node-id="1:760" data-name="KSE Events — Mobile">
      <div className="bg-[#f4f4f4] content-stretch flex flex-col gap-[28px] items-center overflow-clip pb-[48px] pt-[32px] px-[24px] relative shrink-0 w-full" data-node-id="1:761" data-name="Events hero">
        <div className="absolute h-[265px] left-[-27px] top-0 w-[92px]" data-node-id="1:762" data-name="Coral sculpture">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-full left-[-28.63%] max-w-none top-0 w-[128.63%]" src={imgCoralSculpture} />
          </div>
        </div>
        <div className="absolute h-[265px] left-[325px] top-0 w-[92px]" data-node-id="1:763" data-name="Blue sculpture">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-full left-0 max-w-none top-0 w-[128.63%]" src={imgBlueSculpture} />
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.6)] border border-[rgba(211,176,106,0.4)] border-solid content-stretch flex gap-[4px] items-start overflow-clip p-[5px] relative rounded-[999px] shrink-0" data-node-id="1:764" data-name="Event / Insight toggle">
          <button aria-pressed="true" className="bg-[#f8ccdc] content-stretch flex h-[44px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[118px]" data-node-id="1:765" data-name="Active topic" type="button">
            <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap" data-node-id="I1:765;33:286">
              Event
            </p>
          </button>
          <button className="bg-[rgba(255,255,255,0)] border border-[#c9d1d4] border-solid content-stretch flex h-[44px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[118px] cursor-pointer" data-node-id="1:766" data-name="Topic filter" onClick={onShowInsights} type="button">
            <p className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[13px] whitespace-nowrap" data-node-id="I1:766;33:293">
              Insight
            </p>
          </button>
        </div>
        <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#24182c] text-[58px] text-center tracking-[-2.32px] w-[min-content]" data-node-id="1:767">
          Events
        </p>
        <div className="content-stretch flex flex-col gap-[18px] items-center overflow-clip relative shrink-0 w-full" data-node-id="1:768" data-name="Featured event">
          <div className="content-stretch flex flex-col h-[193px] items-start overflow-clip relative rounded-[16px] shrink-0 w-full" data-node-id="1:769" data-name="Summer Fest video">
            <div className="h-[193px] relative rounded-[16px] shrink-0 w-full" data-node-id="1:770" data-name="Summer Fest video cover">
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[16px]">
                <img alt="" className="absolute left-0 max-w-none size-full top-0" src={hero?.imageUrl || hero?.videoUrl || FALLBACK_HERO[activeHero % FALLBACK_HERO.length]} />
              </div>
            </div>
            <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col items-start justify-center left-[calc(50%-12.6px)] size-[46.8px] top-[calc(50%-12.6px)]" data-node-id="1:771" data-name="Play video">
              <div className="h-[46.8px] relative shrink-0 w-full" data-node-id="I1:771;2001:2043" data-name="Component 2">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComponent2} />
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.2] relative shrink-0 text-[#24182c] text-[23px] text-center w-full" data-node-id="1:772" style={{ fontVariationSettings: '"wdth" 100' }}>
            {hero?.title || "KSEFinServe Summer Fest 2026"}
          </p>
          <div className="content-stretch flex items-center justify-between overflow-clip px-[100px] relative shrink-0 w-full" data-node-id="1:773" data-name="Event carousel navigation">
            <button type="button" aria-label="Previous event" onClick={() => stepHero(-1)} className="relative shrink-0 size-[44px] cursor-pointer bg-transparent border-0 p-0" data-node-id="1:774" data-name="Previous event">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPreviousEvent} />
            </button>
            <button type="button" aria-label="Next event" onClick={() => stepHero(1)} className="relative shrink-0 size-[44px] cursor-pointer bg-transparent border-0 p-0" data-node-id="1:776" data-name="Next event">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNextEvent} />
            </button>
          </div>
        </div>
        <div className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:778" data-name="Hero actions">
          <button type="button" onClick={() => hero && setOpenEvent(hero)} className="bg-[#6e8add] content-stretch flex flex-[1_0_0] h-[48px] items-center justify-center min-w-px pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[24px] hero-action" data-node-id="1:779" data-name="Hero action">
            <div className="[word-break:break-word] flex flex-col font-['Mona_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-black text-center whitespace-nowrap" data-node-id="I1:779;30:2205" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">View Details</p>
            </div>
          </button>
          <button type="button" className="bg-[#ee647b] content-stretch flex flex-[1_0_0] h-[48px] items-center justify-center min-w-px pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[24px] hero-action" data-node-id="1:780" data-name="Hero action">
            <div className="[word-break:break-word] flex flex-col font-['Mona_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-black text-center whitespace-nowrap" data-node-id="I1:780;30:2205" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">See Schedule</p>
            </div>
          </button>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:781" data-name="Featured experience">
        <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] relative shrink-0 text-[#081d2b] text-[11px] w-full" data-node-id="1:782" style={{ fontVariationSettings: '"wdth" 100' }}>
          THE EXPERIENCE / FEATURED CONCEPT
        </p>
        <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-full" data-node-id="1:783" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[1.06] mb-0">More than an event.</p>
          <p className="leading-[1.06]">A turning point.</p>
        </div>
        <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:784" style={{ fontVariationSettings: '"wdth" 100' }}>
          A space to pause, ask better questions and leave with a clearer sense of what comes next.
        </p>
        <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0 w-full" data-node-id="1:785" data-name="Clarity room feature">
          <div className="content-stretch flex flex-col h-[275px] items-start justify-end overflow-clip p-[16px] relative shrink-0 w-full" data-node-id="1:786" data-name="Experience image">
            <div className="absolute h-[275px] left-0 top-0 w-[342px]" data-node-id="1:787" data-name="Roundtable experience">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={featured?.imageUrl || imgRoundtableExperience} />
            </div>
            <div className="bg-[#fffdfa] content-stretch flex items-start overflow-clip px-[12px] py-[8px] relative rounded-[999px] shrink-0" data-node-id="1:788" data-name="Programme label">
              <p className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap" data-node-id="1:789" style={{ fontVariationSettings: '"wdth" 100' }}>
                A gathering imagined for you
              </p>
            </div>
          </div>
          <div className="bg-[#dfeff8] content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[24px] relative shrink-0 w-full" data-node-id="1:790" data-name="Experience details">
            <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="1:791" data-name="Concept status">
              <div className="bg-[#42b9fa] content-stretch flex items-start overflow-clip px-[12px] py-[7px] relative rounded-[999px] shrink-0" data-node-id="1:792" data-name="Programme label">
                <p className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[11px] whitespace-nowrap" data-node-id="1:793" style={{ fontVariationSettings: '"wdth" 100' }}>
                  FEATURED CONCEPT
                </p>
              </div>
              <div className="relative shrink-0 size-[26px]" data-node-id="1:794" data-name="Spark">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSpark} />
              </div>
            </div>
            <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[38px] tracking-[-1.52px] w-full" data-node-id="1:795" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[1.06] mb-0">{(featured?.title || "The Clarity Room").split(" ").slice(0, 1).join(" ")}</p>
              <p className="leading-[1.06]">{(featured?.title || "The Clarity Room").split(" ").slice(1).join(" ")}</p>
            </div>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:796" style={{ fontVariationSettings: '"wdth" 100' }}>
              {featured?.description || "A thoughtfully guided gathering connecting financial perspective, purposeful work and the life you want to create."}
            </p>
            <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] w-full" data-node-id="1:797" style={{ fontVariationSettings: '"wdth" 100' }}>
              Guided conversation · Practical reflection · Connection
            </p>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#56646c] text-[14px] w-full" data-node-id="1:798" style={{ fontVariationSettings: '"wdth" 100' }}>
              {featured ? eventWhen(featured) : "Dates to be announced"}
            </p>
            <button type="button" onClick={() => featured && setOpenEvent(featured)} className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" data-node-id="1:799" data-name="Page action">
              <div className="[word-break:break-word] flex flex-col font-['Mona_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" data-node-id="I1:799;30:2199" style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[20px]">{`Join the interest list `}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[28px] items-start overflow-clip pb-[56px] pt-[8px] px-[24px] relative shrink-0 w-full" data-node-id="1:800" data-name="Programme preview">
        <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] min-w-full relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:801" style={{ fontVariationSettings: '"wdth" 100' }}>
          EXPLORE WHAT’S TAKING SHAPE
        </p>
        <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-[min-content]" data-node-id="1:802" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[1.06] mb-0">Three paths.</p>
          <p className="leading-[1.06]">One meaningful future.</p>
        </div>
        <div className="bg-[#e6ba65] content-stretch flex items-start overflow-clip px-[14px] py-[8px] relative rounded-[999px] shrink-0" data-node-id="1:803" data-name="Programme label">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#081d2b] text-[11px] whitespace-nowrap" data-node-id="1:804">
            PROGRAMME PREVIEW
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[44px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:805" data-name="Session collection">
          <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:806" data-name="Session preview" data-session-index={0} hidden={activeSession !== 0}>
            <div className="bg-[#42b9fa] content-stretch flex flex-col gap-[8px] items-start overflow-clip p-[20px] relative rounded-[20px] shrink-0 w-full" data-node-id="1:807" data-name="Session artwork">
              <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap" data-node-id="1:808" style={{ fontVariationSettings: '"wdth" 100' }}>{`Workshop concept `}</p>
              <div className="h-[220px] relative shrink-0 w-full" data-node-id="1:809" data-name="Story photograph">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgStoryPhotograph} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] min-w-full relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:810" style={{ fontVariationSettings: '"wdth" 100' }}>
              WEALTH CLARITY
            </p>
            <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[32px] tracking-[-1.28px] w-[min-content]" data-node-id="1:811" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[1.06] mb-0">Your wealth.</p>
              <p className="leading-[1.06]">Your next chapter.</p>
            </div>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:812" style={{ fontVariationSettings: '"wdth" 100' }}>
              Connect your financial decisions to what matters most. Explore priorities, planning and a more intentional path forward.
            </p>
            <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#56646c] text-[14px] whitespace-nowrap" data-node-id="1:813" style={{ fontVariationSettings: '"wdth" 100' }}>
              Dates to be announced
            </p>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:814" data-name="Session preview" data-session-index={1} hidden={activeSession !== 1}>
            <div className="bg-[#ff806f] content-stretch flex flex-col gap-[8px] items-start overflow-clip p-[20px] relative rounded-[20px] shrink-0 w-full" data-node-id="1:815" data-name="Session artwork">
              <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap" data-node-id="1:816" style={{ fontVariationSettings: '"wdth" 100' }}>{`Conversation concept `}</p>
              <div className="h-[220px] relative shrink-0 w-full" data-node-id="1:817" data-name="Story photograph">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgStoryPhotograph1} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] min-w-full relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:818" style={{ fontVariationSettings: '"wdth" 100' }}>
              PURPOSEFUL LEADERSHIP
            </p>
            <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[32px] tracking-[-1.28px] w-[min-content]" data-node-id="1:819" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[1.06] mb-0">Lead with</p>
              <p className="leading-[1.06]">more purpose.</p>
            </div>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:820" style={{ fontVariationSettings: '"wdth" 100' }}>
              For aspiring advisors and purpose-driven professionals. Explore the mindset, service and relationships behind meaningful leadership.
            </p>
            <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#56646c] text-[14px] whitespace-nowrap" data-node-id="1:821" style={{ fontVariationSettings: '"wdth" 100' }}>
              Dates to be announced
            </p>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:822" data-name="Session preview" data-session-index={2} hidden={activeSession !== 2}>
            <div className="bg-[#d4bcfa] content-stretch flex flex-col gap-[8px] items-start overflow-clip p-[20px] relative rounded-[20px] shrink-0 w-full" data-node-id="1:823" data-name="Session artwork">
              <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap" data-node-id="1:824" style={{ fontVariationSettings: '"wdth" 100' }}>{`Roundtable concept `}</p>
              <div className="h-[220px] relative shrink-0 w-full" data-node-id="1:825" data-name="Story photograph">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgStoryPhotograph2} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] min-w-full relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:826" style={{ fontVariationSettings: '"wdth" 100' }}>
              LEGACY
            </p>
            <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[32px] tracking-[-1.28px] w-[min-content]" data-node-id="1:827" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[1.06] mb-0">Think beyond</p>
              <p className="leading-[1.06]">the now.</p>
            </div>
            <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:828" style={{ fontVariationSettings: '"wdth" 100' }}>
              Bring family, contribution and the next generation into the conversation. Make room for the future you want to help create.
            </p>
            <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#56646c] text-[14px] whitespace-nowrap" data-node-id="1:829" style={{ fontVariationSettings: '"wdth" 100' }}>
              Dates to be announced
            </p>
          </div>
        </div>
        <div className="content-stretch flex items-center justify-between overflow-clip px-[100px] relative shrink-0 w-full" data-node-id="1:805b" data-name="Session carousel navigation">
          <button
            type="button"
            aria-label="Previous programme concept"
            onClick={() => setActiveSession((i) => (i - 1 + 3) % 3)}
            className="relative shrink-0 size-[44px] cursor-pointer session-nav"
            data-node-id="1:805c"
            data-name="Previous session"
          >
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPreviousEvent} />
          </button>
          <button
            type="button"
            aria-label="Next programme concept"
            onClick={() => setActiveSession((i) => (i + 1) % 3)}
            className="relative shrink-0 size-[44px] cursor-pointer session-nav"
            data-node-id="1:805d"
            data-name="Next session"
          >
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNextEvent} />
          </button>
        </div>
        <div className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[24px] items-start overflow-clip pt-[24px] relative shrink-0 w-full" data-node-id="1:830" data-name="Programme note">
          <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[15px] w-full" data-node-id="1:831" style={{ fontVariationSettings: '"wdth" 100' }}>
            These are programme concepts, not a confirmed schedule. Join the interest list to hear when dates, formats and registration are announced.
          </p>
          <button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" data-node-id="1:832" data-name="Page action">
            <div className="[word-break:break-word] flex flex-col font-['Mona_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" data-node-id="I1:832;30:2199" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">{`Find your next conversation `}</p>
            </div>
          </button>
        </div>
      </div>
      <div className="bg-[#ad7de3] content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:833" data-name="Upcoming events">
        <p className="[word-break:break-word] font-['Coiny:Regular'] leading-[1.2] not-italic relative shrink-0 text-[#0c0a09] text-[30px] text-center w-full" data-node-id="1:834">
          Upcoming Events
        </p>
        <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.55] not-italic relative shrink-0 text-[#404040] text-[15px] text-center w-full" data-node-id="1:835">
          Explore the programme concepts shaping the KSEFinServe community. These gatherings connect wealth guidance, purposeful work, leadership and legacy with the clarity you need to move forward with confidence.
        </p>
        <div className="[word-break:break-word] bg-[#0c0a09] content-stretch flex flex-col font-normal gap-[14px] items-start overflow-clip p-[24px] relative rounded-[16px] shrink-0 text-white w-full" data-node-id="1:836" data-name="Calendar introduction">
          <p className="font-['Coiny:Regular'] leading-[normal] relative shrink-0 text-[23px] whitespace-pre" data-node-id="1:837" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>{`▣  Calendar`}</p>
          <p className="font-['Inter:Regular'] leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] w-[min-content]" data-node-id="1:838">
            January - December 2026
          </p>
          <p className="font-['Inter:Regular'] leading-[1.4] min-w-full not-italic relative shrink-0 text-[15px] w-[min-content]" data-node-id="1:839">
            Programme concepts and interest list
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:840" data-name="Event collection">
          <button type="button" onClick={() => published[0] && setOpenEvent(published[0]!)} className="bg-[#ffedd5] content-stretch flex flex-col gap-[18px] items-start overflow-clip p-[20px] relative rounded-[16px] shrink-0 w-full text-left cursor-pointer" data-node-id="1:841" data-name="Event concept" data-event-index={0} hidden={activeEvent !== 0}>
            <div className="h-[190px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:842" data-name="Story photograph">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={published[0]?.imageUrl || published[0]?.videoUrl || FALLBACK_HERO[0 % FALLBACK_HERO.length]} />
            </div>
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[1.2] not-italic relative shrink-0 text-[#0c0a09] text-[21px] w-full" data-node-id="1:843">
                          {published[0]?.title || "The Clarity Room"}
                        </p>
            <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic relative shrink-0 text-[#403d39] text-[14px] w-full" data-node-id="1:844">
                          {published[0] ? eventWhen(published[0]) : "To be announced"}
                        </p>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#514f4b] text-[11px] uppercase w-full" data-node-id="1:845">
                          {published[0]?.category || "Programme concept"}
                        </p>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.55] not-italic relative shrink-0 text-[#404040] text-[15px] w-full" data-node-id="1:846">
                          {published[0]?.introduction || "A thoughtfully guided gathering connecting financial perspective, purposeful work and the life you want to create."}
                        </p>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0c0a09] text-[13px] w-full" data-node-id="1:847">
                          {published[0]?.format || "Format to be announced"}
                        </p>
          </button>
          <button type="button" onClick={() => published[1] && setOpenEvent(published[1]!)} className="bg-[#f3e8ff] content-stretch flex flex-col gap-[18px] items-start overflow-clip p-[20px] relative rounded-[16px] shrink-0 w-full text-left cursor-pointer" data-node-id="1:848" data-name="Event concept" data-event-index={1} hidden={activeEvent !== 1}>
            <div className="h-[190px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:849" data-name="Story photograph">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={published[1]?.imageUrl || published[1]?.videoUrl || FALLBACK_HERO[1 % FALLBACK_HERO.length]} />
            </div>
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[1.2] not-italic relative shrink-0 text-[#0c0a09] text-[21px] w-full" data-node-id="1:850">
              {published[1]?.title || "Your wealth. Your next chapter."}
            </p>
            <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic relative shrink-0 text-[#403d39] text-[14px] w-full" data-node-id="1:851">
              {published[1] ? eventWhen(published[1]) : "To be announced"}
            </p>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#514f4b] text-[11px] uppercase w-full" data-node-id="1:852">
              {published[1]?.category || "Programme concept"}
            </p>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.55] not-italic relative shrink-0 text-[#404040] text-[15px] w-full" data-node-id="1:853">
              {published[1]?.introduction || "Connect your financial decisions to what matters most."}
            </p>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0c0a09] text-[13px] w-full" data-node-id="1:854">
              {published[1]?.format || "Format to be announced"}
              </p>
              </button>
              <button type="button" onClick={() => published[2] && setOpenEvent(published[2]!)} className="bg-[#dbeafe] content-stretch flex flex-col gap-[18px] items-start overflow-clip p-[20px] relative rounded-[16px] shrink-0 w-full text-left cursor-pointer" data-node-id="1:855" data-name="Event concept" data-event-index={2} hidden={activeEvent !== 2}>
            <div className="h-[190px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:856" data-name="Story photograph">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={published[2]?.imageUrl || published[2]?.videoUrl || FALLBACK_HERO[2 % FALLBACK_HERO.length]} />
            </div>
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[1.2] not-italic relative shrink-0 text-[#0c0a09] text-[21px] w-full" data-node-id="1:857">
              {published[2]?.title || "Lead with more purpose."}
            </p>
            <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic relative shrink-0 text-[#403d39] text-[14px] w-full" data-node-id="1:858">
              {published[2] ? eventWhen(published[2]) : "To be announced"}
            </p>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#514f4b] text-[11px] uppercase w-full" data-node-id="1:859">
              {published[2]?.category || "Programme concept"}
            </p>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.55] not-italic relative shrink-0 text-[#404040] text-[15px] w-full" data-node-id="1:860">
              {published[2]?.introduction || "For aspiring advisors and purpose-driven professionals."}
            </p>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0c0a09] text-[13px] w-full" data-node-id="1:861">
              {published[2]?.format || "Format to be announced"}
              </p>
              </button>
              <button type="button" onClick={() => published[3] && setOpenEvent(published[3]!)} className="bg-[#fce7f3] content-stretch flex flex-col gap-[18px] items-start overflow-clip p-[20px] relative rounded-[16px] shrink-0 w-full text-left cursor-pointer" data-node-id="1:862" data-name="Event concept" data-event-index={3} hidden={activeEvent !== 3}>
            <div className="h-[190px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:863" data-name="Story photograph">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={published[3]?.imageUrl || published[3]?.videoUrl || FALLBACK_HERO[3 % FALLBACK_HERO.length]} />
            </div>
            <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[1.2] not-italic relative shrink-0 text-[#0c0a09] text-[21px] w-full" data-node-id="1:864">
              {published[3]?.title || "Think beyond the now."}
            </p>
            <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic relative shrink-0 text-[#403d39] text-[14px] w-full" data-node-id="1:865">
              {published[3] ? eventWhen(published[3]) : "To be announced"}
            </p>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#514f4b] text-[11px] uppercase w-full" data-node-id="1:866">
              {published[3]?.category || "Programme concept"}
            </p>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.55] not-italic relative shrink-0 text-[#404040] text-[15px] w-full" data-node-id="1:867">
              {published[3]?.introduction || "Bring family, contribution and the next generation into the conversation."}
            </p>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0c0a09] text-[13px] w-full" data-node-id="1:868">
              {published[3]?.format || "Format to be announced"}
            </p>
          </button>
        </div>
        <div className="content-stretch flex h-[64px] items-start justify-end overflow-clip relative shrink-0 w-full" data-node-id="1:870" data-name="Programme flourish">
          <Component1 className="flex-[1_0_0] h-[64px] min-w-px relative" />
        </div>
        <div className="content-stretch flex items-center justify-between overflow-clip px-[100px] relative shrink-0 w-full" data-node-id="1:840b" data-name="Event carousel navigation bottom">
          <button
            type="button"
            aria-label="Previous upcoming event"
            onClick={() => setActiveEvent((i) => (i - 1 + 4) % 4)}
            className="relative shrink-0 size-[44px] cursor-pointer session-nav"
            data-node-id="1:840c"
            data-name="Previous event concept"
          >
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPreviousEvent} />
          </button>
          <button
            type="button"
            aria-label="Next upcoming event"
            onClick={() => setActiveEvent((i) => (i + 1) % 4)}
            className="relative shrink-0 size-[44px] cursor-pointer session-nav"
            data-node-id="1:840d"
            data-name="Next event concept"
          >
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNextEvent} />
          </button>
        </div>
      </div>
      <div className="bg-[#fffdfa] content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:872" data-name="Community photo story">
        <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] relative shrink-0 text-[#081d2b] text-[11px] w-full" data-node-id="1:873" style={{ fontVariationSettings: '"wdth" 100' }}>
          THE HUMAN SIDE OF GROWTH
        </p>
        <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-full" data-node-id="1:874" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[1.06] mb-0">Good energy.</p>
          <p className="leading-[1.06]">Meaningful connection.</p>
        </div>
        <p className="[word-break:break-word] font-['Lora:Italic'] font-normal italic leading-[1.3] relative shrink-0 text-[#56646c] text-[22px] w-full" data-node-id="1:875">
          The conversations between the sessions.
        </p>
        <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:876" data-name="Photo mosaic">
          <div className="content-stretch flex flex-col h-[375px] items-start justify-end overflow-clip p-[18px] relative rounded-bl-[20px] rounded-br-[20px] rounded-tl-[20px] rounded-tr-[100px] shrink-0 w-full" data-node-id="1:877" data-name="Shared conversation">
            <div className="absolute h-[375px] left-0 top-0 w-[342px]" data-node-id="1:878" data-name="Community conversation">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgCommunityConversation} />
            </div>
            <div className="bg-[#e6ba65] content-stretch flex items-start overflow-clip px-[14px] py-[10px] relative rounded-[999px] shrink-0" data-node-id="1:879" data-name="Photo annotation">
              <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[normal] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap" data-node-id="1:880" style={{ fontVariationSettings: '"wdth" 100' }}>{`Connection is the starting point. `}</p>
            </div>
          </div>
          <div className="h-[210px] relative rounded-[20px] shrink-0 w-full" data-node-id="1:881" data-name="Story photograph">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" src={imgStoryPhotograph7} />
          </div>
          <div className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:882" data-name="Intimate moments">
            <div className="flex-[1_0_0] h-[240px] min-w-px relative rounded-[20px]" data-node-id="1:883" data-name="Reflective moment">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" src={imgReflectiveMoment} />
            </div>
            <div className="bg-[#d4bcfa] content-stretch flex flex-[1_0_0] flex-col gap-[14px] h-[240px] items-start min-w-px overflow-clip p-[14px] relative rounded-[20px]" data-node-id="1:884" data-name="Notes and possibilities">
              <div className="[word-break:break-word] font-['Lora:Italic'] font-normal italic leading-[0] relative shrink-0 text-[#081d2b] text-[19px] w-full" data-node-id="1:885">
                <p className="leading-[1.3] mb-0">Small moments.</p>
                <p className="leading-[1.3]">Lasting ideas.</p>
              </div>
              <div className="h-[120px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:886" data-name="Story photograph">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgStoryPhotograph8} />
              </div>
            </div>
          </div>
        </div>
        <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] w-full" data-node-id="1:887" style={{ fontVariationSettings: '"wdth" 100' }}>
          A vision of gathering, the KSE way.
        </p>
        <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[13px] w-full" data-node-id="1:888" style={{ fontVariationSettings: '"wdth" 100' }}>
          Illustrative imagery of the experience we’re shaping, not a record of past KSE events.
        </p>
      </div>
      <div className="content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:889" data-name="Meet your host">
        <div className="bg-[#e6ba65] content-stretch flex flex-col h-[397px] items-start overflow-clip relative rounded-bl-[20px] rounded-br-[20px] rounded-tl-[170px] rounded-tr-[170px] shrink-0 w-full" data-node-id="1:890" data-name="Authentic host portrait">
          <div className="absolute left-[28px] size-[286px] top-[37px]" data-node-id="1:891" data-name="Portrait halo">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPortraitHalo} />
          </div>
          <div className="absolute h-[387px] left-0 top-[10px] w-[342px]" data-node-id="1:892" data-name="Kayode Samson Elepe portrait">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-full left-[7.87%] max-w-none top-[-0.52%] w-[84.03%]" src={imgKayodeSamsonElepePortrait} />
            </div>
          </div>
          <div className="[word-break:break-word] absolute bg-[#0d2b42] content-stretch flex flex-col gap-[6px] items-start leading-[normal] left-[16px] overflow-clip p-[16px] rounded-[12px] top-[308px] w-[310px]" data-node-id="1:893" data-name="Host identity">
            <p className="font-['Mona_Sans:SemiBold'] font-semibold relative shrink-0 text-[19px] text-white w-full" data-node-id="1:894" style={{ fontVariationSettings: '"wdth" 100' }}>
              Kayode Samson Elepe, RR
            </p>
            <p className="font-['Mona_Sans:Regular'] font-normal relative shrink-0 text-[12px] text-[rgba(255,255,255,0.8)] w-full" data-node-id="1:895" style={{ fontVariationSettings: '"wdth" 100' }}>{`KSEFinServe · Wealth & leadership`}</p>
          </div>
        </div>
        <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] relative shrink-0 text-[#081d2b] text-[11px] w-full" data-node-id="1:896" style={{ fontVariationSettings: '"wdth" 100' }}>
          YOUR HOST / KSE
        </p>
        <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-full" data-node-id="1:897" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[1.06] mb-0">An analytical mind.</p>
          <p className="leading-[1.06] mb-0">A people-first</p>
          <p className="leading-[1.06]">gathering.</p>
        </div>
        <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:898" style={{ fontVariationSettings: '"wdth" 100' }}>
          Kayode brings a background in engineering and data to wealth guidance and advisor leadership development — with a belief that better decisions begin with clearer understanding.
        </p>
        <div className="[word-break:break-word] font-['Lora:Italic'] font-normal italic leading-[0] relative shrink-0 text-[#081d2b] text-[24px] w-full" data-node-id="1:899">
          <p className="leading-[1.3] mb-0">Build Wealth with Clarity.</p>
          <p className="leading-[1.3]">Build Leaders with Purpose.</p>
        </div>
        <button type="button" onClick={() => { window.location.href = "/about" }} className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" data-node-id="1:900" data-name="Page action">
          <div className="[word-break:break-word] flex flex-col font-['Mona_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" data-node-id="I1:900;30:2199" style={{ fontVariationSettings: '"wdth" 100' }}>
            <p className="leading-[20px]">{`Meet Kayode `}</p>
          </div>
        </button>
      </div>
      <div className="bg-[#dfeff8] content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:901" data-name="Attendee essentials">
        <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] min-w-full relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:902" style={{ fontVariationSettings: '"wdth" 100' }}>
          A LITTLE BEFORE YOU ARRIVE
        </p>
        <p className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.06] min-w-full relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-[min-content]" data-node-id="1:903" style={{ fontVariationSettings: '"wdth" 100' }}>
          Come as you are. Come curious.
        </p>
        <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap" data-node-id="1:904" style={{ fontVariationSettings: '"wdth" 100' }}>
          Details are taking shape ↗
        </p>
        <div className="content-stretch flex flex-col gap-[28px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:905" data-name="Attendee guidance">
          <div className="content-stretch flex gap-[18px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:906" data-name="Essential">
            <div className="relative shrink-0 size-[28px]" data-node-id="1:907" data-name="users">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUsers} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px overflow-clip relative" data-node-id="1:909" data-name="Guidance">
              <p className="font-['Mona_Sans:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#081d2b] text-[21px] w-full" data-node-id="1:910" style={{ fontVariationSettings: '"wdth" 100' }}>
                Find your room
              </p>
              <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:911" style={{ fontVariationSettings: '"wdth" 100' }}>
                For professionals, families, aspiring advisors and anyone curious about a more intentional future.
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[18px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:912" data-name="Essential">
            <div className="relative shrink-0 size-[28px]" data-node-id="1:913" data-name="calendar-days">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCalendarDays} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px overflow-clip relative" data-node-id="1:915" data-name="Guidance">
              <p className="font-['Mona_Sans:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#081d2b] text-[21px] w-full" data-node-id="1:916" style={{ fontVariationSettings: '"wdth" 100' }}>
                Be the first to know
              </p>
              <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:917" style={{ fontVariationSettings: '"wdth" 100' }}>
                Dates, locations, formats and any attendance costs will be shared when each event is announced.
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[18px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:918" data-name="Essential">
            <div className="relative shrink-0 size-[28px]" data-node-id="1:919" data-name="notebook-pen">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNotebookPen} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px overflow-clip relative" data-node-id="1:921" data-name="Guidance">
              <p className="font-['Mona_Sans:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#081d2b] text-[21px] w-full" data-node-id="1:922" style={{ fontVariationSettings: '"wdth" 100' }}>
                Bring your curiosity
              </p>
              <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:923" style={{ fontVariationSettings: '"wdth" 100' }}>
                No financial background needed. A notebook, an open mind and your questions are a good place to start.
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[18px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:924" data-name="Essential">
            <div className="relative shrink-0 size-[28px]" data-node-id="1:925" data-name="accessibility">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAccessibility} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px overflow-clip relative" data-node-id="1:927" data-name="Guidance">
              <p className="font-['Mona_Sans:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#081d2b] text-[21px] w-full" data-node-id="1:928" style={{ fontVariationSettings: '"wdth" 100' }}>
                Plan for a good experience
              </p>
              <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:929" style={{ fontVariationSettings: '"wdth" 100' }}>
                Accessibility and practical arrival information will accompany each confirmed event. Share your needs when you register.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] bg-[#fffdfa] content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:930" data-name="Event questions">
        <p className="font-['Mona_Sans:Medium'] font-medium leading-[1.5] relative shrink-0 text-[#081d2b] text-[11px] w-full" data-node-id="1:931" style={{ fontVariationSettings: '"wdth" 100' }}>
          THE PRACTICAL THINGS
        </p>
        <div className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-full" data-node-id="1:932" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[1.06] mb-0">A few good</p>
          <p className="leading-[1.06]">questions.</p>
        </div>
        <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:933" style={{ fontVariationSettings: '"wdth" 100' }}>
          Here’s what to know while our next chapter of gatherings takes shape.
        </p>
        <p className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] w-full" data-node-id="1:934" style={{ fontVariationSettings: '"wdth" 100' }}>
          Stay in the loop for the full details ↗
        </p>
        <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="1:935" data-name="Answered questions">
          <div className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[14px] items-start overflow-clip py-[24px] relative shrink-0 w-full" data-node-id="1:936" data-name="Question and answer">
            <div className="content-stretch flex gap-[18px] items-center overflow-clip relative shrink-0 text-[#081d2b] text-[20px] w-full" data-node-id="1:937" data-name="Question">
              <p className="flex-[1_0_0] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.25] min-w-px relative" data-node-id="1:938" style={{ fontVariationSettings: '"wdth" 100' }}>
                When and where are the events?
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="1:939">
                −
              </p>
            </div>
            <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:940" style={{ fontVariationSettings: '"wdth" 100' }}>
              Dates and locations are not confirmed yet. Join the interest list and we’ll share the details when each gathering is ready.
            </p>
          </div>
          <div className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[14px] items-start overflow-clip py-[24px] relative shrink-0 w-full" data-node-id="1:941" data-name="Question and answer">
            <div className="content-stretch flex gap-[18px] items-center overflow-clip relative shrink-0 text-[#081d2b] text-[20px] w-full" data-node-id="1:942" data-name="Question">
              <p className="flex-[1_0_0] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.25] min-w-px relative" data-node-id="1:943" style={{ fontVariationSettings: '"wdth" 100' }}>
                Who can attend?
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="1:944">
                −
              </p>
            </div>
            <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:945" style={{ fontVariationSettings: '"wdth" 100' }}>
              People curious about wealth, purposeful leadership and legacy. Each announcement will explain who the session is designed for.
            </p>
          </div>
          <div className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[14px] items-start overflow-clip py-[24px] relative shrink-0 w-full" data-node-id="1:946" data-name="Question and answer">
            <div className="content-stretch flex gap-[18px] items-center overflow-clip relative shrink-0 text-[#081d2b] text-[20px] w-full" data-node-id="1:947" data-name="Question">
              <p className="flex-[1_0_0] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.25] min-w-px relative" data-node-id="1:948" style={{ fontVariationSettings: '"wdth" 100' }}>
                Does joining the list reserve a place?
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="1:949">
                −
              </p>
            </div>
            <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:950" style={{ fontVariationSettings: '"wdth" 100' }}>
              No. It keeps you informed. Registration, availability and any attendance costs will be shared separately for each event.
            </p>
          </div>
          <div className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[14px] items-start overflow-clip py-[24px] relative shrink-0 w-full" data-node-id="1:951" data-name="Question and answer">
            <div className="content-stretch flex gap-[18px] items-center overflow-clip relative shrink-0 text-[#081d2b] text-[20px] w-full" data-node-id="1:952" data-name="Question">
              <p className="flex-[1_0_0] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.25] min-w-px relative" data-node-id="1:953" style={{ fontVariationSettings: '"wdth" 100' }}>
                Will there be online sessions?
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="1:954">
                −
              </p>
            </div>
            <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:955" style={{ fontVariationSettings: '"wdth" 100' }}>
              Formats are still being shaped. Each event announcement will confirm whether it is in person, online or a combination of both.
            </p>
          </div>
          <div className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[14px] items-start overflow-clip py-[24px] relative shrink-0 w-full" data-node-id="1:956" data-name="Question and answer">
            <div className="content-stretch flex gap-[18px] items-center overflow-clip relative shrink-0 text-[#081d2b] text-[20px] w-full" data-node-id="1:957" data-name="Question">
              <p className="flex-[1_0_0] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.25] min-w-px relative" data-node-id="1:958" style={{ fontVariationSettings: '"wdth" 100' }}>
                Is this personalised financial advice?
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="1:959">
                −
              </p>
            </div>
            <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:960" style={{ fontVariationSettings: '"wdth" 100' }}>
              Sessions are educational and conversational. Personal financial guidance is a separate discussion tailored to your circumstances.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#d4bcfa] content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:961" data-name="Event updates signup">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[18px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:962" data-name="Signup invitation">
          <p className="font-['Mona_Sans:Medium'] font-medium leading-[1.5] relative shrink-0 text-[#081d2b] text-[11px] w-full" data-node-id="1:963" style={{ fontVariationSettings: '"wdth" 100' }}>
            YOUR NEXT CHAPTER STARTS HERE
          </p>
          <div className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-full" data-node-id="1:964" style={{ fontVariationSettings: '"wdth" 100' }}>
            <p className="leading-[1.06] mb-0">Good things</p>
            <p className="leading-[1.06]">are gathering.</p>
          </div>
          <p className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full" data-node-id="1:965" style={{ fontVariationSettings: '"wdth" 100' }}>
            Be first to hear about new event dates, programme details and opportunities to connect with KSE.
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:966" data-name="Subscription form">
          <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap" data-node-id="1:967" style={{ fontVariationSettings: '"wdth" 100' }}>
            Your email address
          </p>
          <div className="bg-[#fffdfa] content-stretch flex gap-[12px] h-[58px] items-center overflow-clip p-[18px] relative rounded-[12px] shrink-0 w-full" data-node-id="1:968" data-name="Email field">
            <div className="h-[16px] relative shrink-0 w-[20px]" data-node-id="1:969" data-name="Email">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEmail} />
            </div>
            <input
              type="email"
              placeholder="you@example.com"
              aria-label="Your email address"
              className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#56646c] text-[14px] bg-transparent border-0 outline-0 w-full min-w-0"
              style={{ fontVariationSettings: '"wdth" 100' }}
            />
          </div>
          <div className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="1:971" data-name="Subscription consent">
            <input
              type="checkbox"
              aria-label="I’d like to receive KSE event updates by email"
              className="border border-[#081d2b] border-solid relative rounded-[4px] shrink-0 size-[18px] accent-[#081d2b] cursor-pointer"
              data-node-id="1:972"
              data-name="Consent checkbox"
            />
            <p className="[word-break:break-word] flex-[1_0_0] font-['Mona_Sans:Regular'] font-normal leading-[20px] min-w-px relative text-[#081d2b] text-[14px]" data-node-id="1:973" style={{ fontVariationSettings: '"wdth" 100' }}>
              I’d like to receive KSE event updates by email. I can unsubscribe at any time.
            </p>
          </div>
          <button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" data-node-id="1:974" data-name="Page action">
            <div className="[word-break:break-word] flex flex-col font-['Mona_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" data-node-id="I1:974;30:2199" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">{`Join the interest list `}</p>
            </div>
          </button>
          <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]" data-node-id="1:975" style={{ fontVariationSettings: '"wdth" 100' }}>
            A little inspiration. Useful updates. No reservation required.
          </p>
        </div>
      </div>
      <div className="bg-[#42b9fa] content-stretch flex flex-col gap-[28px] items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="1:976" data-name="Your next conversation">
        <div className="absolute left-[160px] size-[420px] top-[410px]" data-node-id="1:977" data-name="Atmospheric light">
          <div className="absolute inset-[-23.81%]">
            <img alt="" className="block max-w-none size-full" src={imgAtmosphericLight} />
          </div>
        </div>
        <p className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[1.5] min-w-full relative shrink-0 text-[#081d2b] text-[11px] w-[min-content]" data-node-id="1:978" style={{ fontVariationSettings: '"wdth" 100' }}>
          MAKE ROOM FOR WHAT COMES NEXT
        </p>
        <div className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[44px] tracking-[-1.76px] w-[min-content]" data-node-id="1:979" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[1.06] mb-0">Your next</p>
          <p className="leading-[1.06] mb-0">chapter needs</p>
          <p className="leading-[1.06]">a conversation.</p>
        </div>
        <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]" data-node-id="1:980" style={{ fontVariationSettings: '"wdth" 100' }}>
          Start with curiosity. Stay for the connection. Be part of what we’re building at KSE Events.
        </p>
        <button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-full page-action" data-node-id="1:981" data-name="Page action">
          <div className="[word-break:break-word] flex flex-col font-['Mona_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" data-node-id="I1:981;30:2199" style={{ fontVariationSettings: '"wdth" 100' }}>
            <p className="leading-[20px]">{`Join the interest list `}</p>
          </div>
        </button>
        <div className="content-stretch flex flex-col gap-[16px] items-center overflow-clip relative shrink-0 w-full" data-node-id="1:982" data-name="Possibility sculpture">
          <div className="h-[261px] relative shrink-0 w-[310px]" data-node-id="1:983" data-name="Connection landmark">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgConnectionLandmark} />
          </div>
          <p className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[normal] min-w-full relative shrink-0 text-[#081d2b] text-[11px] text-center w-[min-content]" data-node-id="1:984" style={{ fontVariationSettings: '"wdth" 100' }}>
            CLARITY IS ONLY THE BEGINNING.
          </p>
        </div>
      </div>
      {openEvent && <MobileEventModal event={openEvent} onClose={() => setOpenEvent(null)} />}
    </div>
  );
}
