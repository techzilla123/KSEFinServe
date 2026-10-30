import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  eventWhen,
  upcomingEvents,
  useEvents,
  type KseEvent,
} from "./admin/eventsDirectory";

const assetPathPrefix = "/assets"
/**
 * Placeholder artwork for events that have no image yet.
 *
 * The carousel cycles through these so the picture visibly changes as you step
 * between events — falling back to a single static image makes the arrows look
 * broken even though the state is advancing.
 */
const FALLBACK_HERO = [
  `${assetPathPrefix}/d0f2a.png`,
  `${assetPathPrefix}/8e421.png`,
  `${assetPathPrefix}/ce1b2.png`,
  `${assetPathPrefix}/d1795.png`,
]
const imgVariant8 = `${assetPathPrefix}/e9f5d.svg`
const imgVariant9 = `${assetPathPrefix}/9d30f.svg`
const imgDivEventParentGraphic = `${assetPathPrefix}/ced68.png`
const imgDivPlayerControls = `${assetPathPrefix}/1d041.png`
const imgThumbnailImage = `${assetPathPrefix}/b5f5b.png`
const imgDivPlayerControls1 = `${assetPathPrefix}/8e421.png`
const imgDivEventParentGraphic1 = `${assetPathPrefix}/10be3.png`
const imgRoundtableExperience = `${assetPathPrefix}/d0f2a.png`
const imgPillarSculpture = `${assetPathPrefix}/81163.png`
const imgPillarSculpture1 = `${assetPathPrefix}/6d708.png`
const imgPillarSculpture2 = `${assetPathPrefix}/9896c.png`
const imgEventImage = `${assetPathPrefix}/bfdda.png`
const imgEventImage1 = `${assetPathPrefix}/30267.png`
const imgEventImage2 = `${assetPathPrefix}/19bbe.png`
const imgEventImage3 = `${assetPathPrefix}/264fb.png`
const imgCommunityConversation = `${assetPathPrefix}/ce1b2.png`
const imgSharedInsight = `${assetPathPrefix}/cedac.png`
const imgReflectiveMoment = `${assetPathPrefix}/d1795.png`
const imgWorkshopNotes = `${assetPathPrefix}/dc38b.png`
const imgKayodeSamsonElepePortrait = `${assetPathPrefix}/eab0f.png`
const imgConnectionLandmark = `${assetPathPrefix}/b5153.png`
const imgAYtmVideoInfoVideoTitle = `${assetPathPrefix}/51155.svg`
const imgComponent2 = `${assetPathPrefix}/0699a.svg`
const imgComponent3 = `${assetPathPrefix}/88581.svg`
const imgComponent4 = `${assetPathPrefix}/6f69c.svg`
const imgChevronLeft = `${assetPathPrefix}/0ed00.svg`
const imgChevronRight = `${assetPathPrefix}/bf6e8.svg`
const imgSpark = `${assetPathPrefix}/e3309.svg`
const imgPortraitHalo = `${assetPathPrefix}/6af35.svg`
const imgUsers = `${assetPathPrefix}/08071.svg`
const imgCalendarDays = `${assetPathPrefix}/55d20.svg`
const imgNotebookPen = `${assetPathPrefix}/6dfa4.svg`
const imgAccessibility = `${assetPathPrefix}/b3426.svg`
const imgMinus = `${assetPathPrefix}/faabb.svg`
const imgMail = `${assetPathPrefix}/e510e.svg`
const imgAtmosphericLight = `${assetPathPrefix}/678bc.svg`

type Component1Props = {
  className?: string
  variant?: "8" | "9"
}

function Component1({ className, variant = "8" }: Component1Props) {
  const is9 = variant === "9"
  return (
    <div
      className={
        className ||
        `relative ${is9 ? "h-[93.25px] w-[1170px]" : "size-[32px]"}`
      }
      id={is9 ? "node-1_586" : "node-1_583"}
    >
      <img
        alt=""
        className="absolute block inset-0 max-w-none size-full"
        src={is9 ? imgVariant9 : imgVariant8}
      />
    </div>
  )
}

type EventPageProps = { onModeChange: (mode: "event" | "insight") => void }

/** Full detail modal — everything the admin saved for one event. */
function EventModal({ event, onClose }: { event: KseEvent; onClose: () => void }) {
  const { registerInterest } = useEvents()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const submit = async () => {
    if (busy) return
    setError(null)
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please add your name, email and phone number.")
      return
    }
    setBusy(true)
    const result = await registerInterest(event.id, { name, email, phone })
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
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
    setDone(true)
  }

  const media = event.imageUrl || event.videoUrl

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="event-modal-title">
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
              src={media || imgRoundtableExperience}
              alt={event.imageAlt || event.title}
            />
          )}
        </div>
        <div className="event-modal-body">
          <p className="text-[11px] font-semibold text-[#876728]">
            {event.category || "KSEFinServe event"}
          </p>
          <h2 id="event-modal-title" className="mt-2 text-[30px] font-semibold leading-tight">
            {event.title}
          </h2>
          {event.tagline && (
            <p className="mt-3 text-[15px] leading-[1.6] text-[#56646c]">{event.tagline}</p>
          )}

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
                {[event.venueName, event.city, event.country].filter(Boolean).join(", ") ||
                  "To be announced"}
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

          <hr className="my-6 border-[#e5e1d8]" />
          <h3 className="text-[14px] font-semibold">Register your interest</h3>
          <p className="mt-1 text-[12px] text-[#66757d]">
            Leave your details and we will be in touch about this gathering.
          </p>

          {done ? (
            <p className="interest-success">
              Thank you, {name.trim() || "there"}. Your interest has been recorded and we will be in touch.
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
  )
}

/** One modal listing every published event. */
function AllEventsModal({ events, onClose, onSelect }: { events: KseEvent[]; onClose: () => void; onSelect: (e: KseEvent) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="all-events-title">
      <button className="modal-scrim" aria-label="Close" onClick={onClose} />
      <section className="event-modal event-modal--compact">
        <button className="event-modal-close" onClick={onClose} aria-label="Close">
          <svg className="size-[16px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="#081d2b" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
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
              <button
                key={e.id}
                type="button"
                onClick={() => onSelect(e)}
                className="flex w-full gap-4 rounded-[12px] border border-[#e5e1d8] p-4 text-left transition-colors hover:border-[#c9a963] hover:bg-[#fffdfa]"
              >
                <div className="relative h-[84px] w-[112px] shrink-0 overflow-hidden rounded-[8px]">
                  <img
                    className="absolute inset-0 size-full object-cover"
                    src={e.imageUrl || e.videoUrl || imgEventImage}
                    alt={e.imageAlt || e.title}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-[#876728]">{e.category || "Event"}</p>
                  <h3 className="mt-1 text-[16px] font-semibold">{e.title}</h3>
                  <p className="mt-1 text-[12px] text-[#66757d]">{eventWhen(e)}</p>
                </div>
              </button>
            ))}
            {events.length === 0 && (
              <p className="text-[14px] text-[#66757d]">No events have been published yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function EventPage({ onModeChange }: EventPageProps) {
  const { events } = useEvents()
  const [heroIndex, setHeroIndex] = useState(0)
  const [openEvent, setOpenEvent] = useState<KseEvent | null>(null)
  const [showAll, setShowAll] = useState(false)

  // Only published events that have not happened yet are public, soonest
  // first, so the hero and the upcoming list always lead with what is next.
  const published = upcomingEvents(events)
  const featured = published.find((e) => e.featured) ?? published[0] ?? null
  const hero = published[heroIndex] ?? null

  useEffect(() => {
    if (heroIndex >= published.length) setHeroIndex(0)
  }, [published.length, heroIndex])

  const step = (delta: number) => {
    if (published.length === 0) return
    setHeroIndex((i) => (i + delta + published.length) % published.length)
  }

  return (
    <div className="contents relative size-full" data-node-id="1:894">
      <div
        className="absolute bg-[#f6f3ec] content-stretch flex flex-col items-start left-0 overflow-clip top-0 w-[1440px]"
        data-node-id="1:895"
        data-name="KSE Events — Clarity in good company"
      >
        <div
          className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
          data-node-id="1:896"
        >
          <div
            className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1"
            data-node-id="1:897"
          >
            <div
              className="bg-white col-1 h-[1075.478px] ml-0 mt-0 overflow-clip relative row-1 w-[1440px]"
              data-node-id="1:898"
              data-name="Events hero"
            >
              <div
                className="absolute bg-[#f4f4f4] content-stretch flex flex-col items-start left-0 right-0 top-0"
                data-node-id="1:899"
                data-name="Reference-matched events"
              >
                <div
                  className="content-stretch flex flex-col items-center overflow-clip pb-[85.478px] relative shrink-0 w-full"
                  data-node-id="1:900"
                  data-name="div.main-wrapper"
                >
                  <div
                    className="content-stretch flex flex-col h-[990px] items-start justify-center max-h-[1199.0400390625px] relative shrink-0 w-full"
                    data-node-id="1:901"
                    data-name="div#top"
                  >
                    <div
                      className="content-stretch flex flex-[1_0_0] gap-[24px] items-start max-h-[1199.0400390625px] min-h-px overflow-clip relative w-full"
                      data-node-id="1:902"
                      data-name="div.event-parent-hero-grid"
                    >
                      <div
                        className="h-full relative shrink-0 w-[345.6px]"
                        data-node-id="1:903"
                        data-name="div.event-parent-graphic"
                      >
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <img
                            alt=""
                            className="absolute h-full left-[-28.63%] max-w-none top-0 w-[128.63%]"
                            src={imgDivEventParentGraphic}
                          />
                        </div>
                      </div>
                      <div
                        className="content-stretch flex flex-[1_0_0] flex-col gap-[62.347px] h-full items-center justify-center min-w-px pb-[221.52px] pt-[220.77px] relative"
                        data-node-id="1:904"
                        data-name="div.event-hero-col-main"
                      >
                        <div
                          className="content-stretch flex flex-col items-start relative shrink-0"
                          data-node-id="1:905"
                          data-name="h1.events-h1"
                        >
                          <div
                            className="[word-break:break-word] flex flex-col font-['Inter:Bold'] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#24182c] text-[78.525px] whitespace-nowrap"
                            data-node-id="1:906"
                          >
                            <p className="leading-[92.25px]">Events</p>
                          </div>
                        </div>
                        <div
                          className="content-stretch flex flex-col items-center px-[62.426px] relative shrink-0 w-[700.852px]"
                          data-node-id="1:907"
                          data-name="div.grid-cell:margin"
                        >
                          <div
                            className="content-stretch flex flex-col items-start max-w-[635.4915161132812px] relative shrink-0 w-[576px]"
                            data-node-id="1:908"
                            data-name="div.grid-cell"
                          >
                            <div
                              className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full"
                              data-node-id="1:909"
                              data-name="div.w-dyn-item"
                            >
                              <div
                                className="content-stretch flex flex-col gap-[8.257px] items-start overflow-clip relative rounded-[20.985px] shrink-0 w-full"
                                data-node-id="1:910"
                                data-name="div.cms-item"
                              >
                                <div
                                  className="content-stretch flex flex-col items-start overflow-clip relative rounded-[14.985px] shrink-0 w-full"
                                  data-node-id="1:911"
                                  data-name="div.image-wrap"
                                >
                                  <div
                                    className="h-[323.745px] overflow-clip relative rounded-[17.985px] shrink-0 w-full"
                                    data-node-id="1:912"
                                    data-name="div.cms-inner-video"
                                  >
                                    <div
                                      className="absolute content-stretch flex flex-col inset-0 items-start justify-center overflow-clip"
                                      data-node-id="1:913"
                                      data-name="iframe.embedly-embed"
                                    >
                                      <div
                                        className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px overflow-auto relative w-full"
                                        data-node-id="1:914"
                                        data-name="body#__x2d_body"
                                      >
                                        <div
                                          className="bg-black content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px relative w-[576px]"
                                          data-node-id="1:915"
                                          data-name="body#__x2d_body"
                                        >
                                          <div
                                            className="bg-black flex-[1_0_0] min-h-px relative w-full"
                                            data-node-id="1:916"
                                            data-name="YouTube Video Player"
                                          />
                                          <div
                                            className="absolute inset-[0_0_-0.26px_0]"
                                            data-node-id="1:917"
                                            data-name="div#player-controls"
                                          >
                                            <img
                                              alt=""
                                              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                                              src={hero?.imageUrl || hero?.videoUrl || FALLBACK_HERO[heroIndex % FALLBACK_HERO.length]}
                                            />
                                            <div
                                              className="absolute content-stretch flex items-start left-[10.5px] right-[18px] top-0"
                                              data-node-id="1:920"
                                              data-name="div.player-controls-top"
                                            >
                                              <div
                                                className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative self-stretch"
                                                data-node-id="1:921"
                                                data-name="embedded-player-video-details"
                                              >
                                                <div
                                                  className="content-stretch flex items-start min-h-[39px] pl-[9px] relative shrink-0 w-full"
                                                  data-node-id="1:922"
                                                  data-name="div.ytmVideoInfoVideoDetailsContainer"
                                                >
                                                  <div
                                                    className="content-stretch flex flex-col items-start min-h-[27px] overflow-clip pl-[39px] relative self-stretch shrink-0 w-[529.5px]"
                                                    data-node-id="1:923"
                                                    data-name="div.ytmVideoInfoVideoTitleContainer"
                                                  >
                                                    <div
                                                      className="h-[28.5px] relative shrink-0 w-full"
                                                      data-node-id="1:924"
                                                      data-name="a.ytmVideoInfoVideoTitle:mask-group"
                                                    >
                                                      <div
                                                        className="absolute content-stretch flex flex-col items-start left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[100%_28.5px] pt-[7.5px] right-0 top-0"
                                                        data-node-id="1:926"
                                                        style={{
                                                          maskImage: `url("${imgAYtmVideoInfoVideoTitle}")`,
                                                        }}
                                                        data-name="a.ytmVideoInfoVideoTitle"
                                                      >
                                                        <div
                                                          className="content-stretch flex items-start relative shrink-0"
                                                          data-node-id="1:927"
                                                          data-name="Component 1"
                                                        >
                                                          <div
                                                            className="[word-break:break-word] flex flex-col font-['Roboto:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[15px] text-white whitespace-nowrap"
                                                            data-node-id="I1:927;2001:520"
                                                            style={{
                                                              fontVariationSettings:
                                                                '"wdth" 100',
                                                            }}
                                                          >
                                                            <p className="leading-[21px]">
                                                              KSEFinServe
                                                            </p>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="h-[9.892px] overflow-clip relative shrink-0 w-[490.5px]"
                                                      data-node-id="1:928"
                                                      data-name="Component 1"
                                                    >
                                                      <div
                                                        className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] left-0 text-[9px] text-white top-[4.5px] w-[64.795px]"
                                                        data-node-id="I1:928;2001:518"
                                                        style={{
                                                          fontVariationSettings:
                                                            '"wdth" 100',
                                                        }}
                                                      >
                                                        <p className="leading-[9.9px]">
                                                          KSEFinServe
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div
                                                    className="absolute content-stretch flex flex-col h-[39px] items-start justify-center left-[3px] max-w-[1431px] min-w-[39px] overflow-clip pl-[3px] top-[6px]"
                                                    data-node-id="1:929"
                                                    data-name="div.ytmVideoInfoChannelContainer"
                                                  >
                                                    <div
                                                      className="bg-[rgba(0,0,0,0.8)] content-stretch flex flex-[1_0_0] items-center min-h-px opacity-0 pl-[39px] pr-[1.5px] relative rounded-[7.5px]"
                                                      data-node-id="1:930"
                                                      data-name="div.ytmVideoInfoOverlay"
                                                    >
                                                      <div
                                                        className="h-[24px] relative shrink-0 w-[6px]"
                                                        data-node-id="1:931"
                                                        data-name="div.ytmVideoInfoChannelInfo"
                                                      />
                                                    </div>
                                                    <div
                                                      className="absolute content-stretch flex flex-col items-start left-0 pb-[3px] pl-[9px] pt-[6px] size-[36px] top-0"
                                                      data-node-id="1:932"
                                                      data-name="button.ytmVideoInfoLink"
                                                    >
                                                      <div
                                                        className="min-h-[0.75px] min-w-[0.75px] relative rounded-[13.5px] shrink-0 size-[27px]"
                                                        data-node-id="1:933"
                                                        data-name="thumbnail-image"
                                                      >
                                                        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[13.5px]">
                                                          <img
                                                            alt=""
                                                            className="absolute left-0 max-w-none size-full top-0"
                                                            src={
                                                              imgThumbnailImage
                                                            }
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              className="absolute bottom-[9px] content-stretch flex gap-[0.004px] h-[36px] items-center left-[22.5px] right-[22.5px]"
                                              data-node-id="1:934"
                                              data-name="div.fullscreen-action-menu"
                                            >
                                              <div
                                                className="bg-[rgba(0,0,0,0.3)] content-stretch flex items-start px-[6px] py-[3px] relative rounded-[36px] shrink-0"
                                                data-node-id="1:935"
                                                data-name="div.action-menu-engagement-buttons-wrapper"
                                              >
                                                <div
                                                  className="content-stretch flex flex-col items-start relative self-stretch shrink-0"
                                                  data-node-id="1:936"
                                                  data-name="ytm-button-renderer"
                                                >
                                                  <div
                                                    className="content-stretch flex items-center justify-center relative rounded-[15px] shrink-0 size-[30px]"
                                                    data-node-id="1:937"
                                                    data-name="Component 3"
                                                  >
                                                    <div
                                                      className="content-stretch flex flex-col items-center relative shrink-0 size-[18px]"
                                                      data-node-id="I1:937;2001:1010"
                                                      data-name="div.ytSpecButtonShapeNextIcon"
                                                    >
                                                      <div
                                                        className="content-stretch flex items-start relative shrink-0 size-[18px]"
                                                        data-node-id="I1:937;2001:1011"
                                                        data-name="c3-icon"
                                                      >
                                                        <div
                                                          className="content-stretch drop-shadow-[0px_0px_0.375px_rgba(0,0,0,0.8)] flex flex-[1_0_0] flex-col h-full items-start justify-center min-w-px overflow-clip relative"
                                                          data-node-id="I1:937;2001:1012"
                                                          data-name="svg"
                                                        >
                                                          <div
                                                            className="flex-[1_0_0] min-h-px relative w-full"
                                                            data-node-id="I1:937;2001:1013"
                                                            data-name="Component 2"
                                                          >
                                                            <img
                                                              alt=""
                                                              className="absolute block inset-0 max-w-none size-full"
                                                              src={
                                                                imgComponent2
                                                              }
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                className="content-stretch flex flex-[1_0_0] flex-col h-full items-end justify-center min-w-[163.03500366210938px] pl-[325.969px] relative"
                                                data-node-id="1:938"
                                                data-name="div.quick-actions-wrapper:margin"
                                              >
                                                <div
                                                  className="content-stretch flex flex-[1_0_0] items-center min-h-px relative"
                                                  data-node-id="1:939"
                                                  data-name="div.quick-actions-wrapper"
                                                >
                                                  <div
                                                    className="content-stretch flex flex-col items-start pl-[3px] relative shrink-0"
                                                    data-node-id="1:940"
                                                    data-name="div.watch-on-youtube-button-wrapper"
                                                  >
                                                    <div
                                                      className="bg-[rgba(0,0,0,0.3)] content-stretch flex h-[36px] items-center justify-center px-[18px] relative rounded-[18px] shrink-0"
                                                      data-node-id="1:941"
                                                      data-name="Component 4"
                                                    >
                                                      <div
                                                        className="content-stretch flex items-center overflow-clip relative shrink-0"
                                                        data-node-id="I1:941;2001:1031"
                                                        data-name="div.ytSpecButtonShapeNextButtonTextContent"
                                                      >
                                                        <div
                                                          className="[word-break:break-word] flex flex-col font-['Roboto:Thin'] font-thin justify-center leading-[0] mr-[-0.007px] relative shrink-0 text-[13.5px] text-white whitespace-nowrap"
                                                          data-node-id="I1:941;2001:1032"
                                                          style={{
                                                            fontVariationSettings:
                                                              '"wdth" 100',
                                                          }}
                                                        >
                                                          <p className="leading-[36px]">
                                                            Watch on
                                                          </p>
                                                        </div>
                                                        <div
                                                          className="content-stretch flex h-[15px] items-start relative shrink-0 w-[67.5px]"
                                                          data-node-id="I1:941;2001:1033"
                                                          data-name="c3-icon"
                                                        >
                                                          <div
                                                            className="flex-[1_0_0] h-full min-w-px relative"
                                                            data-node-id="I1:941;2001:1034"
                                                            data-name="Component 2"
                                                          >
                                                            <img
                                                              alt=""
                                                              className="absolute block inset-0 max-w-none size-full"
                                                              src={
                                                                imgComponent3
                                                              }
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            {/* The live hero image already fills this frame (see the
                                                object-cover <img> above), so no static poster is drawn
                                                on top of it — that overlay hid the carousel. */}
                                            <div
                                              className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.8)] h-[52.5px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[576px]"
                                              data-node-id="1:944"
                                              data-name="div.ytmCuedOverlayGradient"
                                            />
                                            <div
                                              className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col items-start justify-center left-1/2 size-[54px] top-1/2"
                                              data-node-id="1:945"
                                              data-name="Component 7"
                                            >
                                              <div
                                                className="h-[54px] relative shrink-0 w-full"
                                                data-node-id="I1:945;2001:2043"
                                                data-name="Component 2"
                                              >
                                                <img
                                                  alt=""
                                                  className="absolute block inset-0 max-w-none size-full"
                                                  src={imgComponent4}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="content-stretch flex flex-col items-center overflow-clip py-[14.021px] relative rounded-[14.985px] shrink-0 w-full"
                                  data-node-id="1:946"
                                  data-name="div.item-data"
                                >
                                  <div
                                    className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#24182c] text-[30.525px] text-center whitespace-nowrap"
                                    data-node-id="1:947"
                                  >
                                    <p className="leading-[31.5px]">
                                      {hero?.title || "KSEFinServe Summer Fest 2026"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="h-full relative shrink-0 w-[345.6px]"
                        data-node-id="1:948"
                        data-name="div.event-parent-graphic"
                      >
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <img
                            alt=""
                            className="absolute h-full left-0 max-w-none top-0 w-[128.63%]"
                            src={imgDivEventParentGraphic1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                aria-label="Previous event"
                onClick={() => step(-1)}
                className="absolute bg-white border-[0.75px] border-[rgba(36,24,44,0.1)] border-solid content-stretch drop-shadow-[0px_6px_9px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center left-[354px] rounded-[27px] size-[54px] top-[510px] cursor-pointer"
                data-node-id="1:949"
                data-name="Previous event"
              >
                <div
                  className="relative shrink-0 size-[18px]"
                  data-node-id="1:950"
                  data-name="chevron-left"
                >
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgChevronLeft}
                  />
                </div>
              </button>
              <button
                type="button"
                aria-label="Next event"
                onClick={() => step(1)}
                className="absolute bg-white content-stretch drop-shadow-[0px_6px_9px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center left-[1032px] rounded-[27px] size-[54px] top-[510px] cursor-pointer"
                data-node-id="1:952"
                data-name="Next event"
              >
                <div
                  className="relative shrink-0 size-[18px]"
                  data-node-id="1:953"
                  data-name="chevron-right"
                >
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgChevronRight}
                  />
                </div>
              </button>
            </div>
            <div
              className="bg-[#f6f3ec] col-1 content-stretch flex flex-col gap-[48px] items-start ml-0 mt-[1075.48px] overflow-clip px-[80px] py-[104px] relative row-1 w-[1440px]"
              data-node-id="1:955"
              data-name="Featured experience"
            >
              <div
                className="[word-break:break-word] content-stretch flex items-end justify-between overflow-clip relative shrink-0 w-full"
                data-node-id="1:956"
                data-name="Featured introduction"
              >
                <div
                  className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 text-[#081d2b] w-[700px]"
                  data-node-id="1:957"
                  data-name="Introduction"
                >
                  <p
                    className="font-['Mona_Sans:Medium'] font-medium leading-[18px] relative shrink-0 text-[12px] whitespace-nowrap"
                    data-node-id="1:958"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    THE EXPERIENCE / FEATURED CONCEPT
                  </p>
                  <div
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[64px] tracking-[-2.56px] w-[min-content]"
                    data-node-id="1:959"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    <p className="leading-[1.02] mb-0">More than an event.</p>
                    <p className="leading-[1.02]">A turning point.</p>
                  </div>
                </div>
                <p
                  className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[18px] w-[360px]"
                  data-node-id="1:960"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  A space to pause, ask better questions and leave with a
                  clearer sense of what comes next.
                </p>
              </div>
              <div
                className="content-stretch flex h-[560px] items-start overflow-clip relative shrink-0 w-full"
                data-node-id="1:961"
                data-name="Clarity room feature"
              >
                <div
                  className="content-stretch flex flex-col h-full items-start justify-end overflow-clip p-[28px] relative rounded-bl-[24px] rounded-tl-[24px] shrink-0 w-[710px]"
                  data-node-id="1:962"
                  data-name="Experience image"
                >
                  <div
                    className="absolute h-[560px] left-0 top-0 w-[710px]"
                    data-node-id="1:963"
                    data-name="Roundtable experience"
                  >
                    <img
                      alt=""
                      className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                      src={featured?.imageUrl || featured?.videoUrl || imgRoundtableExperience}
                    />
                  </div>
                  <div
                    className="bg-[#fffdfa] content-stretch flex items-start overflow-clip px-[14px] py-[8px] relative rounded-[100px] shrink-0"
                    data-node-id="1:964"
                    data-name="Programme label"
                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap"
                      data-node-id="1:965"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      A gathering imagined for you
                    </p>
                  </div>
                </div>
                <div
                  className="bg-[#dfeff8] content-stretch flex flex-[1_0_0] flex-col gap-[22px] h-full items-start min-w-px overflow-clip p-[40px] relative rounded-br-[24px] rounded-tr-[24px]"
                  data-node-id="1:966"
                  data-name="Experience details"
                >
                  <div
                    className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                    data-node-id="1:967"
                    data-name="Concept status"
                  >
                    <div
                      className="bg-[#42b9fa] content-stretch flex items-start overflow-clip px-[14px] py-[8px] relative rounded-[100px] shrink-0"
                      data-node-id="1:968"
                      data-name="Programme label"
                    >
                      <p
                        className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap"
                        data-node-id="1:969"
                        style={{ fontVariationSettings: '"wdth" 100' }}
                      >
                        FEATURED PREVIEW
                      </p>
                    </div>
                    <div
                      className="relative shrink-0 size-[30px]"
                      data-node-id="1:970"
                      data-name="Spark"
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgSpark}
                      />
                    </div>
                  </div>
                  <div
                    className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] relative shrink-0 text-[#081d2b] text-[48px] tracking-[-1.92px] w-full"
                    data-node-id="1:971"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    <p className="leading-[1.02] mb-0">{featured?.title || "The Clarity"}</p>
                    <p className="leading-[1.02]">{featured?.title ? "" : "Room"}</p>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[17px] w-full"
                    data-node-id="1:972"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    {featured?.introduction ||
                      "A thoughtfully guided gathering connecting financial perspective, purposeful work and the life you want to create."}
                  </p>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] w-full"
                    data-node-id="1:973"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Guided conversation · Practical reflection · Connection
                  </p>
                  <div
                    className="content-stretch flex flex-col gap-[14px] items-start overflow-clip relative shrink-0 w-full"
                    data-node-id="1:974"
                    data-name="Invitation"
                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#56646c] text-[14px] whitespace-nowrap"
                      data-node-id="1:975"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      {featured?.startDate ? eventWhen(featured) : "Dates to be announced"}
                    </p>
                    <button type="button" onClick={() => featured && setOpenEvent(featured)} className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 [word-break:break-word] flex-col font-['Mona_Sans:Medium'] font-medium justify-center leading-[0] text-[15px] text-center text-white whitespace-nowrap leading-[20px] cursor-pointer" style={{ fontVariationSettings: '"wdth" 100' }}>Join the interest list</button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="bg-[#f6f3ec] col-1 content-stretch flex flex-col gap-[48px] items-start ml-0 mt-[2059.48px] overflow-clip pb-[96px] pt-[16px] px-[80px] relative row-1 w-[1440px]"
              data-node-id="1:977"
              data-name="Programme preview"
            >
              <div
                className="content-stretch flex items-end justify-between overflow-clip relative shrink-0 w-full"
                data-node-id="1:978"
                data-name="Programme heading"
              >
                <div
                  className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 text-[#081d2b] w-[820px]"
                  data-node-id="1:979"
                  data-name="Heading"
                >
                  <p
                    className="font-['Mona_Sans:Medium'] font-medium leading-[18px] relative shrink-0 text-[12px] whitespace-nowrap"
                    data-node-id="1:980"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    EXPLORE WHAT’S TAKING SHAPE
                  </p>
                  <div
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[64px] tracking-[-2.56px] w-[min-content]"
                    data-node-id="1:981"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    <p className="leading-[1.02] mb-0">Three paths.</p>
                    <p className="leading-[1.02]">One meaningful future.</p>
                  </div>
                </div>
                <div
                  className="bg-[#e6ba65] content-stretch flex items-start overflow-clip px-[14px] py-[8px] relative rounded-[100px] shrink-0"
                  data-node-id="1:982"
                  data-name="Programme label"
                >
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap"
                    data-node-id="1:983"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    PROGRAMME PREVIEW
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex gap-[32px] items-start overflow-clip relative shrink-0 w-full"
                data-node-id="1:984"
                data-name="Session collection"
              >
                <div
                  className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px overflow-clip relative"
                  data-node-id="1:985"
                  data-name="Session preview"
                >
                  <button
                                    type="button"
                                    onClick={() => published.find((e) => /wealth/i.test(`${e.category} ${e.title}`)) && setOpenEvent(published.find((e) => /wealth/i.test(`${e.category} ${e.title}`))!)}
                                    className="bg-[#42b9fa] content-stretch flex flex-col h-[290px] items-start overflow-clip p-[22px] relative rounded-[24px] shrink-0 w-full text-left cursor-pointer"
                                    data-node-id="1:986"
                                    data-name="Session artwork"
                                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                      data-node-id="1:987"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >{`Workshop concept `}</p>
                    <div
                      className="h-[218px] relative shrink-0 w-full"
                      data-node-id="1:988"
                      data-name="Pillar sculpture"
                    >
                      <img
                        alt=""
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                        src={imgPillarSculpture}
                                              />
                                            </div>
                                          </button>
                  <div
                    className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full"
                    data-node-id="1:989"
                    data-name="Session description"
                  >
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[18px] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap"
                      data-node-id="1:990"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      WEALTH CLARITY
                    </p>
                    <div
                      className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-[min-content]"
                      data-node-id="1:991"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      <p className="leading-[1.02] mb-0">Your wealth.</p>
                      <p className="leading-[1.02]">Your next chapter.</p>
                    </div>
                    <p
                      className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[17px] w-[min-content]"
                      data-node-id="1:992"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Connect your financial decisions to what matters most.
                      Explore priorities, planning and a more intentional path
                      forward.
                    </p>
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#56646c] text-[14px] whitespace-nowrap"
                      data-node-id="1:993"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      {published.find((e) => /wealth/i.test(`${e.category} ${e.title}`))?.startDate
                        ? eventWhen(published.find((e) => /wealth/i.test(`${e.category} ${e.title}`))!)
                        : "Dates to be announced"}
                    </p>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px overflow-clip relative"
                  data-node-id="1:994"
                  data-name="Session preview"
                >
                  <button
                                    type="button"
                                    onClick={() => published.find((e) => /leadership|advisor/i.test(`${e.category} ${e.title}`)) && setOpenEvent(published.find((e) => /leadership|advisor/i.test(`${e.category} ${e.title}`))!)}
                                    className="bg-[#ff806f] content-stretch flex flex-col h-[290px] items-start overflow-clip p-[22px] relative rounded-[24px] shrink-0 w-full text-left cursor-pointer"
                                    data-node-id="1:995"
                                    data-name="Session artwork"
                                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                      data-node-id="1:996"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >{`Conversation concept `}</p>
                    <div
                      className="h-[218px] relative shrink-0 w-full"
                      data-node-id="1:997"
                      data-name="Pillar sculpture"
                    >
                      <img
                        alt=""
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                        src={imgPillarSculpture1}
                                              />
                                            </div>
                                          </button>
                  <div
                    className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full"
                    data-node-id="1:998"
                    data-name="Session description"
                  >
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[18px] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap"
                      data-node-id="1:999"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      PURPOSEFUL LEADERSHIP
                    </p>
                    <div
                      className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-[min-content]"
                      data-node-id="1:1000"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      <p className="leading-[1.02] mb-0">Lead with</p>
                      <p className="leading-[1.02]">more purpose.</p>
                    </div>
                    <p
                      className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[17px] w-[min-content]"
                      data-node-id="1:1001"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      For aspiring advisors and purpose-driven professionals.
                      Explore the mindset, service and relationships behind
                      meaningful leadership.
                    </p>
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#56646c] text-[14px] whitespace-nowrap"
                      data-node-id="1:1002"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Dates to be announced
                    </p>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px overflow-clip relative"
                  data-node-id="1:1003"
                  data-name="Session preview"
                >
                  <button
                                    type="button"
                                    onClick={() => published.find((e) => /legacy|family/i.test(`${e.category} ${e.title}`)) && setOpenEvent(published.find((e) => /legacy|family/i.test(`${e.category} ${e.title}`))!)}
                                    className="bg-[#d4bcfa] content-stretch flex flex-col h-[290px] items-start overflow-clip p-[22px] relative rounded-[24px] shrink-0 w-full text-left cursor-pointer"
                                    data-node-id="1:1004"
                                    data-name="Session artwork"
                                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                      data-node-id="1:1005"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >{`Roundtable concept `}</p>
                    <div
                      className="h-[218px] relative shrink-0 w-full"
                      data-node-id="1:1006"
                      data-name="Pillar sculpture"
                    >
                      <img
                        alt=""
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                        src={imgPillarSculpture2}
                                              />
                                            </div>
                                          </button>
                  <div
                    className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1007"
                    data-name="Session description"
                  >
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[18px] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap"
                      data-node-id="1:1008"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      LEGACY
                    </p>
                    <div
                      className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[36px] tracking-[-1.44px] w-[min-content]"
                      data-node-id="1:1009"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      <p className="leading-[1.02] mb-0">Think beyond</p>
                      <p className="leading-[1.02]">the now.</p>
                    </div>
                    <p
                      className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[17px] w-[min-content]"
                      data-node-id="1:1010"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Bring family, contribution and the next generation into
                      the conversation. Make room for the future you want to
                      help create.
                    </p>
                    <p
                      className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#56646c] text-[14px] whitespace-nowrap"
                      data-node-id="1:1011"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Dates to be announced
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="border-[#c9d1d4] border-solid border-t content-stretch flex items-center justify-between overflow-clip pt-[28px] relative shrink-0 w-full"
                data-node-id="1:1012"
                data-name="Programme note"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[15px] w-[710px]"
                  data-node-id="1:1013"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  These are programme concepts, not a confirmed schedule. Join
                  the interest list to hear when dates, formats and registration
                  are announced.
                </p>
                <button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 [word-break:break-word] flex-col font-['Mona_Sans:Medium'] font-medium justify-center leading-[0] text-[15px] text-center text-white whitespace-nowrap leading-[20px]" style={{ fontVariationSettings: '"wdth" 100' }}>Find your next conversation</button>
              </div>
            </div>
            <div
              className="bg-[#ad7de3] col-1 content-stretch flex flex-col gap-[64px] items-center max-w-[1440px] ml-0 mt-[3067.48px] overflow-clip pb-[128px] pt-[148px] px-[128px] relative row-1 w-[1440px]"
              data-node-id="1:1015"
              data-name="section#schedules-section"
            >
              <div
                className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full"
                data-node-id="1:1016"
                data-name="header.flex"
              >
                <div
                  className="[word-break:break-word] flex flex-col font-['Coiny:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[#0c0a09] text-[48px] text-center tracking-[2.4px] whitespace-nowrap"
                  data-node-id="1:1017"
                >
                  <p className="leading-[50.6px]">Upcoming Events</p>
                </div>
                <div
                  className="content-stretch flex flex-col items-center relative shrink-0 w-[760px]"
                  data-node-id="1:1018"
                  data-name="p.text-base"
                >
                  <div
                    className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#404040] text-[16px] text-center w-full"
                    data-node-id="1:1019"
                  >
                    <p className="leading-[24px]">
                      Explore the programme concepts shaping the KSEFinServe
                      community. These gatherings connect wealth guidance,
                      purposeful work, leadership and legacy with the clarity
                      you need to move forward with confidence.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="content-stretch flex flex-col gap-[48px] items-center relative shrink-0 w-full"
                data-node-id="1:1020"
                data-name="div.hidden"
              >
                <div
                  className="bg-[#0c0a09] content-stretch flex items-center justify-between px-[24px] py-[32px] relative rounded-[16px] shrink-0 w-full"
                  data-node-id="1:1021"
                  data-name="header.box-border"
                >
                  <div
                    className="content-stretch flex gap-[32px] items-center relative shrink-0"
                    data-node-id="1:1022"
                    data-name="div.flex"
                  >
                    <div
                      className="content-stretch flex gap-[8px] items-center relative shrink-0"
                      data-node-id="1:1023"
                      data-name="div.flex"
                    >
                      <Component1 className="relative shrink-0 size-[32px]" />
                      <div
                        className="content-stretch flex flex-col items-center relative shrink-0"
                        data-node-id="1:1025"
                        data-name="h2.text-2xl"
                      >
                        <div
                          className="[word-break:break-word] flex flex-col font-['Coiny:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-center text-white tracking-[-0.6px] whitespace-nowrap"
                          data-node-id="1:1026"
                        >
                          <p className="leading-[28px]">Calendar</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-center relative shrink-0"
                      data-node-id="1:1027"
                      data-name="p.text-2xl"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-center text-white tracking-[-0.6px] whitespace-nowrap"
                        data-node-id="1:1028"
                      >
                        <p className="leading-[28px]">
                          January - December 2026
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="content-stretch flex flex-col items-center relative shrink-0"
                    data-node-id="1:1029"
                    data-name="p.text-2xl"
                  >
                    <div
                      className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-center text-white tracking-[-0.6px] whitespace-nowrap"
                      data-node-id="1:1030"
                    >
                      <p className="leading-[28px]">
                        Programme concepts and interest list
                      </p>
                    </div>
                  </div>
                </div>
                <button
                                  type="button"
                                  onClick={() => published[0] && setOpenEvent(published[0]!)}
                                  className="bg-[#ffedd5] content-stretch flex gap-[24px] items-start p-[24px] relative rounded-[16px] shrink-0 w-full text-left cursor-pointer"
                                  data-node-id="1:1031"
                                  data-name="Event row 1"
                                >
                  <div
                    className="content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[12px] shrink-0 size-[140px]"
                    data-node-id="1:1032"
                    data-name="div.flex-shrink-0"
                  >
                    <div
                      className="flex-[1_0_0] min-h-px relative w-full"
                      data-node-id="1:1033"
                      data-name="Event image"
                    >
                      <img
                        alt=""
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                        src={published[0]?.imageUrl || published[0]?.videoUrl || imgEventImage}
                                              />
                                            </div>
                                          </div>
                                          <div
                                            className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px relative"
                                            data-node-id="1:1034"
                    data-name="div.flex"
                  >
                    <div
                      className="content-stretch flex flex-col items-start pr-[160px] relative shrink-0 w-full"
                      data-node-id="1:1035"
                      data-name="h3.text-xl"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Bold'] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0c0a09] text-[24px] w-full"
                        data-node-id="1:1036"
                      >
                        <p className="leading-[32px]">{published[0]?.title || "The Clarity Room"}</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="1:1037"
                      data-name="p.text-sm"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#44403c] text-[16px] w-full"
                        data-node-id="1:1038"
                      >
                        <p className="leading-[24px]">{published[0] ? eventWhen(published[0]) : "To be announced"}</p>
                                              </div>
                                            </div>
                                            <div
                                              className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                                              data-node-id="1:1039"
                      data-name="p.text-xs"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#57534e] text-[14px] tracking-[0.35px] uppercase w-full"
                        data-node-id="1:1040"
                      >
                        <p className="leading-[20px]">{published[0]?.category || "featured preview"}</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="1:1041"
                      data-name="p.text-sm"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#404040] text-[16px] w-full"
                        data-node-id="1:1042"
                      >
                        <p className="leading-[24px]">
                                                  {published[0]?.introduction ||
                                                    "A thoughtfully guided gathering connecting financial perspective, purposeful work and the life you want to create."}
                                                </p>
                      </div>
                    </div>
                    <div
                      className="absolute content-stretch flex flex-col items-start right-[-0.13px] top-0"
                      data-node-id="1:1043"
                      data-name="div.absolute"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0c0a09] text-[16px] whitespace-nowrap"
                        data-node-id="1:1044"
                      >
                        <p className="leading-[24px]">{published[0]?.format || "Format to be announced"}</p>
                                              </div>
                                            </div>
                                          </div>
                                                                                  </button>
                                                          <button
                                                                            type="button"
                                                                            onClick={() => published[1] && setOpenEvent(published[1]!)}
                                  className="bg-[#f3e8ff] content-stretch flex gap-[24px] items-start p-[24px] relative rounded-[16px] shrink-0 w-full text-left cursor-pointer"
                                  data-node-id="1:1045"
                                  data-name="Event row 2"
                                >
                  <div
                    className="content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[12px] shrink-0 size-[140px]"
                    data-node-id="1:1046"
                    data-name="div.flex-shrink-0"
                  >
                    <div
                      className="flex-[1_0_0] min-h-px relative w-full"
                      data-node-id="1:1047"
                      data-name="Event image"
                    >
                      <img
                        alt=""
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                        src={published[1]?.imageUrl || published[1]?.videoUrl || imgEventImage1}
                      />
                    </div>
                  </div>
                  <div
                    className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px relative"
                    data-node-id="1:1048"
                    data-name="div.flex"
                  >
                    <div
                      className="content-stretch flex flex-col items-start pr-[160px] relative shrink-0 w-full"
                      data-node-id="1:1049"
                      data-name="h3.text-xl"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Bold'] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0c0a09] text-[24px] w-full"
                        data-node-id="1:1050"
                      >
                        <p className="leading-[32px]">
                                                  {published[1]?.title || "Your wealth. Your next chapter."}
                                                </p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="1:1051"
                      data-name="p.text-sm"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#44403c] text-[16px] w-full"
                        data-node-id="1:1052"
                      >
                        <p className="leading-[24px]">{published[1] ? eventWhen(published[1]) : "To be announced"}</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="1:1053"
                      data-name="p.text-xs"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#57534e] text-[14px] tracking-[0.35px] uppercase w-full"
                        data-node-id="1:1054"
                      >
                        <p className="leading-[20px]">
                          {published[1]?.category || "Programme concept"}
                        </p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="1:1055"
                      data-name="p.text-sm"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#404040] text-[16px] w-full"
                        data-node-id="1:1056"
                      >
                        <p className="leading-[24px]">
                          {published[1]?.introduction ||
                            "Connect your financial decisions to what matters most. Explore priorities, planning and a more intentional path forward."}
                        </p>
                      </div>
                    </div>
                    <div
                      className="absolute content-stretch flex flex-col items-start right-[-0.63px] top-0"
                      data-node-id="1:1057"
                      data-name="div.absolute"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0c0a09] text-[16px] whitespace-nowrap"
                        data-node-id="1:1058"
                      >
                        <p className="leading-[24px]">{published[1]?.format || "Format to be announced"}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </button>
                                        <button
                                                          type="button"
                                                          onClick={() => published[2] && setOpenEvent(published[2]!)}
                                  className="bg-[#dbeafe] content-stretch flex gap-[24px] items-start p-[24px] relative rounded-[16px] shrink-0 w-full text-left cursor-pointer"
                                  data-node-id="1:1059"
                                  data-name="Event row 3"
                                >
                  <div
                    className="content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[12px] shrink-0 size-[140px]"
                    data-node-id="1:1060"
                    data-name="div.flex-shrink-0"
                  >
                    <div
                      className="flex-[1_0_0] min-h-px relative w-full"
                      data-node-id="1:1061"
                      data-name="Event image"
                    >
                      <img
                        alt=""
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                        src={published[2]?.imageUrl || published[2]?.videoUrl || imgEventImage2}
                      />
                    </div>
                  </div>
                  <div
                    className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px relative"
                    data-node-id="1:1062"
                    data-name="div.flex"
                  >
                    <div
                      className="content-stretch flex flex-col items-start pr-[160px] relative shrink-0 w-full"
                      data-node-id="1:1063"
                      data-name="h3.text-xl"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Bold'] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0c0a09] text-[24px] w-full"
                        data-node-id="1:1064"
                      >
                        <p className="leading-[32px]">
                                                  {published[2]?.title || "Lead with more purpose."}
                                                </p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="1:1065"
                      data-name="p.text-sm"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#44403c] text-[16px] w-full"
                        data-node-id="1:1066"
                      >
                        <p className="leading-[24px]">{published[2] ? eventWhen(published[2]) : "To be announced"}</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="1:1067"
                      data-name="p.text-xs"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#57534e] text-[14px] tracking-[0.35px] uppercase w-full"
                        data-node-id="1:1068"
                      >
                        <p className="leading-[20px]">
                          {published[2]?.category || "Programme concept"}
                        </p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="1:1069"
                      data-name="p.text-sm"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#404040] text-[16px] w-full"
                        data-node-id="1:1070"
                      >
                        <p className="leading-[24px]">
                          A conversation concept for aspiring advisors and
                          purpose-driven professionals exploring mindset,
                          service and relationships. Designed to help leaders
                          build trust, clarity and meaningful impact in their
                          work.
                        </p>
                      </div>
                    </div>
                    <div
                      className="absolute content-stretch flex flex-col items-start right-[-0.13px] top-0"
                      data-node-id="1:1071"
                      data-name="div.absolute"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0c0a09] text-[16px] whitespace-nowrap"
                        data-node-id="1:1072"
                      >
                        <p className="leading-[24px]">{published[2]?.format || "Format to be announced"}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </button>
                                        <button
                                                          type="button"
                                                          onClick={() => published[3] && setOpenEvent(published[3]!)}
                                  className="bg-[#fce7f3] content-stretch flex gap-[24px] items-start p-[24px] relative rounded-[16px] shrink-0 w-full text-left cursor-pointer"
                                  data-node-id="1:1073"
                                  data-name="Event row 4"
                                >
                  <div
                    className="content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[12px] shrink-0 size-[140px]"
                    data-node-id="1:1074"
                    data-name="div.flex-shrink-0"
                  >
                    <div
                      className="flex-[1_0_0] min-h-px relative w-full"
                      data-node-id="1:1075"
                      data-name="Event image"
                    >
                      <img
                        alt=""
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                        src={published[3]?.imageUrl || published[3]?.videoUrl || imgEventImage3}
                      />
                    </div>
                  </div>
                  <div
                    className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px relative"
                    data-node-id="1:1076"
                    data-name="div.flex"
                  >
                    <div
                      className="content-stretch flex flex-col items-start pr-[160px] relative shrink-0 w-full"
                      data-node-id="1:1077"
                      data-name="h3.text-xl"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Bold'] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0c0a09] text-[24px] w-full"
                        data-node-id="1:1078"
                      >
                        <p className="leading-[32px]">{published[3]?.title || "Think beyond the now."}</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="1:1079"
                      data-name="p.text-sm"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#44403c] text-[16px] w-full"
                        data-node-id="1:1080"
                      >
                        <p className="leading-[24px]">{published[3] ? eventWhen(published[3]) : "To be announced"}</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="1:1081"
                      data-name="p.text-xs"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#57534e] text-[14px] tracking-[0.35px] uppercase w-full"
                        data-node-id="1:1082"
                      >
                        <p className="leading-[20px]">{published[3]?.category || "Programme concept"}</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="1:1083"
                      data-name="p.text-sm"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#404040] text-[16px] w-full"
                        data-node-id="1:1084"
                      >
                        <p className="leading-[24px]">
                          A roundtable concept focused on family, contribution
                          and the next generation. Explore how legacy thinking
                          can shape your decisions today and create a more
                          intentional path for what comes next.
                        </p>
                      </div>
                    </div>
                    <div
                      className="absolute content-stretch flex flex-col items-start right-0 top-0"
                      data-node-id="1:1085"
                      data-name="div.absolute"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0c0a09] text-[16px] whitespace-nowrap"
                        data-node-id="1:1086"
                      >
                        <p className="leading-[24px]">{published[3]?.format || "Format to be announced"}</p>
                      </div>
                    </div>
                  </div>
                </button>
                <button type="button" onClick={() => setShowAll(true)} className="bg-[#7c3aed] content-stretch flex items-center justify-center px-[24px] py-[14px] relative rounded-[8px] shrink-0 [word-break:break-word] flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic text-[16px] text-center text-white whitespace-nowrap leading-[24px] cursor-pointer">See More</button>
              </div>
              <div
                className="absolute bottom-[6.75px] content-stretch flex flex-col items-start left-[9.38%] right-[9.38%]"
                data-node-id="1:1090"
                data-name="div.absolute"
              >
                <Component1
                  className="h-[93.25px] relative shrink-0 w-[1170px]"
                  variant="9"
                />
              </div>
            </div>
            <div
              className="bg-[#fffdfa] col-1 content-stretch flex flex-col gap-[40px] items-start ml-0 mt-[4766.48px] overflow-clip px-[80px] py-[96px] relative row-1 w-[1440px]"
              data-node-id="1:1092"
              data-name="Community photo story"
            >
              <div
                className="[word-break:break-word] content-stretch flex items-end justify-between overflow-clip relative shrink-0 w-full"
                data-node-id="1:1093"
                data-name="Gallery introduction"
              >
                <div
                  className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 text-[#081d2b] w-[850px]"
                  data-node-id="1:1094"
                  data-name="Community headline"
                >
                  <p
                    className="font-['Mona_Sans:Medium'] font-medium leading-[18px] relative shrink-0 text-[12px] whitespace-nowrap"
                    data-node-id="1:1095"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    THE HUMAN SIDE OF GROWTH
                  </p>
                  <div
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[72px] tracking-[-2.88px] w-[min-content]"
                    data-node-id="1:1096"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    <p className="leading-[1.02] mb-0">Good energy.</p>
                    <p className="leading-[1.02]">Meaningful connection.</p>
                  </div>
                </div>
                <div
                  className="font-['Lora:Italic'] font-normal italic leading-[0] relative shrink-0 text-[#56646c] text-[28px] w-[300px]"
                  data-node-id="1:1097"
                >
                  <p className="leading-[1.25] mb-0">The conversations</p>
                  <p className="leading-[1.25]">between the sessions.</p>
                </div>
              </div>
              <div
                className="content-stretch flex gap-[24px] items-start overflow-clip relative shrink-0 w-full"
                data-node-id="1:1098"
                data-name="Photo mosaic"
              >
                <div
                  className="content-stretch flex flex-col h-[620px] items-start overflow-clip relative rounded-bl-[24px] rounded-br-[24px] rounded-tl-[24px] rounded-tr-[180px] shrink-0 w-[554px]"
                  data-node-id="1:1099"
                  data-name="Shared conversation"
                >
                  <div
                    className="flex-[1_0_0] min-h-px relative w-full"
                    data-node-id="1:1100"
                    data-name="Community conversation"
                  >
                    <img
                      alt=""
                      className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                      src={imgCommunityConversation}
                    />
                  </div>
                  <div
                    className="absolute bg-[#e6ba65] content-stretch flex items-start left-[24px] overflow-clip px-[20px] py-[16px] rounded-[100px] top-[530px]"
                    data-node-id="1:1101"
                    data-name="Photo annotation"
                  >
                    <p
                      className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                      data-node-id="1:1102"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >{`Connection is the starting point. `}</p>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px overflow-clip relative"
                  data-node-id="1:1103"
                  data-name="Community moments"
                >
                  <div
                    className="h-[286px] relative rounded-[24px] shrink-0 w-full"
                    data-node-id="1:1104"
                    data-name="Shared insight"
                  >
                    <img
                      alt=""
                      className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full"
                      src={imgSharedInsight}
                    />
                  </div>
                  <div
                    className="content-stretch flex gap-[24px] items-start overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1105"
                    data-name="Intimate moments"
                  >
                    <div
                      className="flex-[1_0_0] h-[310px] min-w-px relative rounded-[24px]"
                      data-node-id="1:1106"
                      data-name="Reflective moment"
                    >
                      <img
                        alt=""
                        className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full"
                        src={imgReflectiveMoment}
                      />
                    </div>
                    <div
                      className="bg-[#d4bcfa] content-stretch flex flex-[1_0_0] flex-col gap-[18px] h-[310px] items-start min-w-px overflow-clip p-[24px] relative rounded-[24px]"
                      data-node-id="1:1107"
                      data-name="Notes and possibilities"
                    >
                      <div
                        className="[word-break:break-word] font-['Lora:Italic'] font-normal italic leading-[0] relative shrink-0 text-[#081d2b] text-[30px] w-full"
                        data-node-id="1:1108"
                      >
                        <p className="leading-[1.2] mb-0">Small moments.</p>
                        <p className="leading-[1.2]">Lasting ideas.</p>
                      </div>
                      <div
                        className="h-[170px] relative rounded-[14px] shrink-0 w-full"
                        data-node-id="1:1109"
                        data-name="Workshop notes"
                      >
                        <img
                          alt=""
                          className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[14px] size-full"
                          src={imgWorkshopNotes}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                data-node-id="1:1110"
                data-name="Gallery context"
              >
                <p
                  className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                  data-node-id="1:1111"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  A vision of gathering, the KSE way.
                </p>
                <p
                  className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[13px] w-[575px]"
                  data-node-id="1:1112"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Illustrative imagery of the experience we’re shaping, not a
                  record of past KSE events.
                </p>
              </div>
            </div>
            <div
              className="bg-[#f6f3ec] col-1 content-stretch flex gap-[100px] items-center ml-0 mt-[5862.48px] overflow-clip px-[80px] py-[96px] relative row-1 w-[1440px]"
              data-node-id="1:1113"
              data-name="Meet your host"
            >
              <div
                className="bg-[#e6ba65] content-stretch flex flex-col h-[580px] items-start overflow-clip relative rounded-bl-[24px] rounded-br-[24px] rounded-tl-[240px] rounded-tr-[240px] shrink-0 w-[500px]"
                data-node-id="1:1114"
                data-name="Authentic host portrait"
              >
                <div
                  className="absolute left-[40px] size-[420px] top-[54px]"
                  data-node-id="1:1115"
                  data-name="Portrait halo"
                >
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgPortraitHalo}
                  />
                </div>
                <div
                  className="absolute h-[566px] left-0 top-[14px] w-[500px]"
                  data-node-id="1:1116"
                  data-name="Kayode Samson Elepe portrait"
                >
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img
                      alt=""
                      className="absolute h-full left-[7.87%] max-w-none top-[-0.52%] w-[84.03%]"
                      src={imgKayodeSamsonElepePortrait}
                    />
                  </div>
                </div>
                <div
                  className="[word-break:break-word] absolute bg-[#0d2b42] content-stretch flex flex-col gap-[6px] items-start left-[24px] p-[20px] rounded-[16px] top-[476px] w-[452px]"
                  data-node-id="1:1117"
                  data-name="Host identity"
                >
                  <p
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[1.2] min-w-full relative shrink-0 text-[24px] text-white w-[min-content]"
                    data-node-id="1:1118"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Kayode Samson Elepe, RR
                  </p>
                  <p
                    className="font-['Mona_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] whitespace-nowrap"
                    data-node-id="1:1119"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >{`KSEFinServe · Wealth & leadership`}</p>
                </div>
              </div>
              <div
                className="content-stretch flex flex-[1_0_0] flex-col gap-[28px] items-start min-w-px overflow-clip relative"
                data-node-id="1:1120"
                data-name="Host introduction"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[18px] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap"
                  data-node-id="1:1121"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  YOUR HOST / KSE
                </p>
                <div
                  className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[64px] tracking-[-2.56px] w-[min-content]"
                  data-node-id="1:1122"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  <p className="leading-[1.02] mb-0">An analytical mind.</p>
                  <p className="leading-[1.02] mb-0">A people-first</p>
                  <p className="leading-[1.02]">gathering.</p>
                </div>
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[18px] w-[min-content]"
                  data-node-id="1:1123"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Kayode brings a background in engineering and data to wealth
                  guidance and advisor leadership development — with a belief
                  that better decisions begin with clearer understanding.
                </p>
                <div
                  className="[word-break:break-word] font-['Lora:Italic'] font-normal italic leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[28px] w-[min-content]"
                  data-node-id="1:1124"
                >
                  <p className="leading-[1.3] mb-0">
                    Build Wealth with Clarity.
                  </p>
                  <p className="leading-[1.3]">Build Leaders with Purpose.</p>
                </div>
                <button type="button" onClick={() => { window.location.href = "/about" }} className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 [word-break:break-word] flex-col font-['Mona_Sans:Medium'] font-medium justify-center leading-[0] text-[15px] text-center text-white whitespace-nowrap leading-[20px] cursor-pointer" style={{ fontVariationSettings: '"wdth" 100' }}>Meet Kayode</button>
              </div>
            </div>
            <div
              className="bg-[#dfeff8] col-1 content-stretch flex flex-col gap-[48px] items-start ml-0 mt-[6634.48px] overflow-clip p-[80px] relative row-1 w-[1440px]"
              data-node-id="1:1126"
              data-name="Attendee essentials"
            >
              <div
                className="[word-break:break-word] content-stretch flex items-end justify-between overflow-clip relative shrink-0 text-[#081d2b] w-full"
                data-node-id="1:1127"
                data-name="Essentials heading"
              >
                <div
                  className="content-stretch flex flex-col gap-[18px] items-start overflow-clip relative shrink-0 w-[800px]"
                  data-node-id="1:1128"
                  data-name="Section introduction"
                >
                  <p
                    className="font-['Mona_Sans:Medium'] font-medium leading-[18px] relative shrink-0 text-[12px] whitespace-nowrap"
                    data-node-id="1:1129"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    A LITTLE BEFORE YOU ARRIVE
                  </p>
                  <p
                    className="font-['Mona_Sans:SemiBold'] font-semibold leading-[1.02] min-w-full relative shrink-0 text-[56px] tracking-[-2.24px] w-[min-content]"
                    data-node-id="1:1130"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Come as you are. Come curious.
                  </p>
                </div>
                <p
                  className="font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px] whitespace-nowrap"
                  data-node-id="1:1131"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Details are taking shape ↗
                </p>
              </div>
              <div
                className="content-stretch flex gap-[36px] items-start overflow-clip relative shrink-0 w-full"
                data-node-id="1:1132"
                data-name="Attendee guidance"
              >
                <div
                  className="content-stretch flex flex-[1_0_0] flex-col gap-[18px] items-start min-w-px overflow-clip relative"
                  data-node-id="1:1133"
                  data-name="Essential"
                >
                  <div
                    className="relative shrink-0 size-[30px]"
                    data-node-id="1:1134"
                    data-name="users"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgUsers}
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.2] min-w-full relative shrink-0 text-[#081d2b] text-[23px] w-[min-content]"
                    data-node-id="1:1136"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Find your room
                  </p>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]"
                    data-node-id="1:1137"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    For professionals, families, aspiring advisors and anyone
                    curious about a more intentional future.
                  </p>
                </div>
                <div
                  className="content-stretch flex flex-[1_0_0] flex-col gap-[18px] items-start min-w-px overflow-clip relative"
                  data-node-id="1:1138"
                  data-name="Essential"
                >
                  <div
                    className="relative shrink-0 size-[30px]"
                    data-node-id="1:1139"
                    data-name="calendar-days"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgCalendarDays}
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.2] min-w-full relative shrink-0 text-[#081d2b] text-[23px] w-[min-content]"
                    data-node-id="1:1141"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Be the first to know
                  </p>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]"
                    data-node-id="1:1142"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Dates, locations, formats and any attendance costs will be
                    shared when each event is announced.
                  </p>
                </div>
                <div
                  className="content-stretch flex flex-[1_0_0] flex-col gap-[18px] items-start min-w-px overflow-clip relative"
                  data-node-id="1:1143"
                  data-name="Essential"
                >
                  <div
                    className="relative shrink-0 size-[30px]"
                    data-node-id="1:1144"
                    data-name="notebook-pen"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgNotebookPen}
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.2] min-w-full relative shrink-0 text-[#081d2b] text-[23px] w-[min-content]"
                    data-node-id="1:1146"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Bring your curiosity
                  </p>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]"
                    data-node-id="1:1147"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    No financial background needed. A notebook, an open mind and
                    your questions are a good place to start.
                  </p>
                </div>
                <div
                  className="content-stretch flex flex-[1_0_0] flex-col gap-[18px] items-start min-w-px overflow-clip relative"
                  data-node-id="1:1148"
                  data-name="Essential"
                >
                  <div
                    className="relative shrink-0 size-[30px]"
                    data-node-id="1:1149"
                    data-name="accessibility"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgAccessibility}
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.2] min-w-full relative shrink-0 text-[#081d2b] text-[23px] w-[min-content]"
                    data-node-id="1:1151"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Plan for a good experience
                  </p>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[16px] w-[min-content]"
                    data-node-id="1:1152"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Accessibility and practical arrival information will
                    accompany each confirmed event. Share your needs when you
                    register.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="bg-[#fffdfa] col-1 content-stretch flex gap-[96px] items-start ml-0 mt-[7157.48px] overflow-clip px-[80px] py-[96px] relative row-1 w-[1440px]"
              data-node-id="1:1153"
              data-name="Event questions"
            >
              <div
                className="[word-break:break-word] content-stretch flex flex-col gap-[24px] items-start overflow-clip relative shrink-0 w-[420px]"
                data-node-id="1:1154"
                data-name="FAQ introduction"
              >
                <p
                  className="font-['Mona_Sans:Medium'] font-medium leading-[18px] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap"
                  data-node-id="1:1155"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  THE PRACTICAL THINGS
                </p>
                <div
                  className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[60px] tracking-[-2.4px] w-[min-content]"
                  data-node-id="1:1156"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  <p className="leading-[1.02] mb-0">A few good</p>
                  <p className="leading-[1.02]">questions.</p>
                </div>
                <p
                  className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[18px] w-[min-content]"
                  data-node-id="1:1157"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Here’s what to know while our next chapter of gatherings takes
                  shape.
                </p>
                <p
                  className="font-['Mona_Sans:Medium'] font-medium leading-[20px] min-w-full relative shrink-0 text-[#081d2b] text-[14px] w-[min-content]"
                  data-node-id="1:1158"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Stay in the loop for the full details ↗
                </p>
              </div>
              <div
                className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative"
                data-node-id="1:1159"
                data-name="Answered questions"
              >
                <div
                  className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[12px] items-start overflow-clip py-[24px] relative shrink-0 w-full"
                  data-node-id="1:1160"
                  data-name="Question and answer"
                >
                  <div
                    className="content-stretch flex gap-[24px] items-center overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1161"
                    data-name="Question"
                  >
                    <p
                      className="[word-break:break-word] flex-[1_0_0] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.25] min-w-px relative text-[#081d2b] text-[21px]"
                      data-node-id="1:1162"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      When and where are the events?
                    </p>
                    <div
                      className="relative shrink-0 size-[18px]"
                      data-node-id="1:1163"
                      data-name="minus"
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgMinus}
                      />
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                    data-node-id="1:1165"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Dates and locations are not confirmed yet. Join the interest
                    list and we’ll share the details when each gathering is
                    ready.
                  </p>
                </div>
                <div
                  className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[12px] items-start overflow-clip py-[24px] relative shrink-0 w-full"
                  data-node-id="1:1166"
                  data-name="Question and answer"
                >
                  <div
                    className="content-stretch flex gap-[24px] items-center overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1167"
                    data-name="Question"
                  >
                    <p
                      className="[word-break:break-word] flex-[1_0_0] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.25] min-w-px relative text-[#081d2b] text-[21px]"
                      data-node-id="1:1168"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Who can attend?
                    </p>
                    <div
                      className="relative shrink-0 size-[18px]"
                      data-node-id="1:1169"
                      data-name="minus"
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgMinus}
                      />
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                    data-node-id="1:1171"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    People curious about wealth, purposeful leadership and
                    legacy. Each announcement will explain who the session is
                    designed for.
                  </p>
                </div>
                <div
                  className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[12px] items-start overflow-clip py-[24px] relative shrink-0 w-full"
                  data-node-id="1:1172"
                  data-name="Question and answer"
                >
                  <div
                    className="content-stretch flex gap-[24px] items-center overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1173"
                    data-name="Question"
                  >
                    <p
                      className="[word-break:break-word] flex-[1_0_0] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.25] min-w-px relative text-[#081d2b] text-[21px]"
                      data-node-id="1:1174"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Does joining the list reserve a place?
                    </p>
                    <div
                      className="relative shrink-0 size-[18px]"
                      data-node-id="1:1175"
                      data-name="minus"
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgMinus}
                      />
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                    data-node-id="1:1177"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    No. It keeps you informed. Registration, availability and
                    any attendance costs will be shared separately for each
                    event.
                  </p>
                </div>
                <div
                  className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[12px] items-start overflow-clip py-[24px] relative shrink-0 w-full"
                  data-node-id="1:1178"
                  data-name="Question and answer"
                >
                  <div
                    className="content-stretch flex gap-[24px] items-center overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1179"
                    data-name="Question"
                  >
                    <p
                      className="[word-break:break-word] flex-[1_0_0] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.25] min-w-px relative text-[#081d2b] text-[21px]"
                      data-node-id="1:1180"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Will there be online sessions?
                    </p>
                    <div
                      className="relative shrink-0 size-[18px]"
                      data-node-id="1:1181"
                      data-name="minus"
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgMinus}
                      />
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                    data-node-id="1:1183"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Formats are still being shaped. Each event announcement will
                    confirm whether it is in person, online or a combination of
                    both.
                  </p>
                </div>
                <div
                  className="border-[#c9d1d4] border-solid border-t content-stretch flex flex-col gap-[12px] items-start overflow-clip py-[24px] relative shrink-0 w-full"
                  data-node-id="1:1184"
                  data-name="Question and answer"
                >
                  <div
                    className="content-stretch flex gap-[24px] items-center overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1185"
                    data-name="Question"
                  >
                    <p
                      className="[word-break:break-word] flex-[1_0_0] font-['Mona_Sans:SemiBold'] font-semibold leading-[1.25] min-w-px relative text-[#081d2b] text-[21px]"
                      data-node-id="1:1186"
                      style={{ fontVariationSettings: '"wdth" 100' }}
                    >
                      Is this personalised financial advice?
                    </p>
                    <div
                      className="relative shrink-0 size-[18px]"
                      data-node-id="1:1187"
                      data-name="minus"
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgMinus}
                      />
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[16px] w-full"
                    data-node-id="1:1189"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    Sessions are educational and conversational. Personal
                    financial guidance is a separate discussion tailored to your
                    circumstances.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="bg-[#d4bcfa] col-1 content-stretch flex gap-[100px] items-center ml-0 mt-[8029.48px] overflow-clip p-[80px] relative row-1 w-[1440px]"
              data-node-id="1:1190"
              data-name="Event updates signup"
            >
              <div
                className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-[580px]"
                data-node-id="1:1191"
                data-name="Update invitation"
              >
                <p
                  className="font-['Mona_Sans:Medium'] font-medium leading-[18px] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap"
                  data-node-id="1:1192"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  YOUR NEXT CHAPTER STARTS HERE
                </p>
                <div
                  className="font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[60px] tracking-[-2.4px] w-[min-content]"
                  data-node-id="1:1193"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  <p className="leading-[1.02] mb-0">Good things</p>
                  <p className="leading-[1.02]">are gathering.</p>
                </div>
                <p
                  className="font-['Mona_Sans:Regular'] font-normal leading-[1.55] min-w-full relative shrink-0 text-[#56646c] text-[18px] w-[min-content]"
                  data-node-id="1:1194"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Be first to hear about new event dates, programme details and
                  opportunities to connect with KSE.
                </p>
              </div>
              <div
                className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px overflow-clip relative"
                data-node-id="1:1195"
                data-name="Interest list form"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                  data-node-id="1:1196"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Your email address
                </p>
                <div
                  className="bg-[#fffdfa] content-stretch flex gap-[14px] h-[60px] items-center overflow-clip px-[20px] relative rounded-[12px] shrink-0 w-full"
                  data-node-id="1:1197"
                  data-name="Email field"
                >
                  <div
                    className="relative shrink-0 size-[21px]"
                    data-node-id="1:1198"
                    data-name="mail"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgMail}
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-transparent outline-none font-['Mona_Sans:Regular'] font-normal leading-[20px] text-[#081d2b] text-[14px]"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  />
                </div>
                <div
                  className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full"
                  data-node-id="1:1201"
                  data-name="Consent"
                >
                  <input
                    type="checkbox"
                    className="shrink-0 size-[18px] accent-[#081d2b] cursor-pointer"
                    data-node-id="1:1202"
                  />
                  <p
                    className="[word-break:break-word] flex-[1_0_0] font-['Mona_Sans:Regular'] font-normal leading-[20px] min-w-px relative text-[#081d2b] text-[14px]"
                    data-node-id="1:1203"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    I’d like to receive KSE event updates by email. I can
                    unsubscribe at any time.
                  </p>
                </div>
                <button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 w-[240px] [word-break:break-word] flex-col font-['Mona_Sans:Medium'] font-medium justify-center leading-[0] text-[15px] text-center text-white whitespace-nowrap leading-[20px]" style={{ fontVariationSettings: '"wdth" 100' }}>Join the interest list</button>
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[20px] min-w-full relative shrink-0 text-[#56646c] text-[14px] w-[min-content]"
                  data-node-id="1:1205"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  A little inspiration. Useful updates. No reservation required.
                </p>
              </div>
            </div>
            <div
              className="bg-[#42b9fa] col-1 content-stretch flex gap-[50px] items-center ml-0 mt-[8425.48px] overflow-clip px-[80px] py-[88px] relative row-1 w-[1440px]"
              data-node-id="1:1206"
              data-name="Your next conversation"
            >
              <div
                className="absolute left-[900px] size-[800px] top-[-200px]"
                data-node-id="1:1207"
                data-name="Atmospheric light"
              >
                <div className="absolute inset-[-12.5%]">
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={imgAtmosphericLight}
                  />
                </div>
              </div>
              <div
                className="content-stretch flex flex-col gap-[28px] items-start overflow-clip relative shrink-0 w-[760px]"
                data-node-id="1:1208"
                data-name="Closing invitation"
              >
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[18px] relative shrink-0 text-[#081d2b] text-[12px] whitespace-nowrap"
                  data-node-id="1:1209"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  MAKE ROOM FOR WHAT COMES NEXT
                </p>
                <div
                  className="[word-break:break-word] font-['Mona_Sans:SemiBold'] font-semibold leading-[0] min-w-full relative shrink-0 text-[#081d2b] text-[86px] tracking-[-3.44px] w-[min-content]"
                  data-node-id="1:1210"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  <p className="leading-[1.02] mb-0">Your next</p>
                  <p className="leading-[1.02] mb-0">chapter needs</p>
                  <p className="leading-[1.02]">a conversation.</p>
                </div>
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Regular'] font-normal leading-[1.55] relative shrink-0 text-[#56646c] text-[18px] w-[610px]"
                  data-node-id="1:1211"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  Start with curiosity. Stay for the connection. Be part of what
                  we’re building at KSE Events.
                </p>
                <button type="button" className="bg-[#081d2b] content-stretch flex h-[52px] items-center justify-center pb-[13.5px] pt-[12.5px] px-[16px] relative rounded-[100px] shrink-0 [word-break:break-word] flex-col font-['Mona_Sans:Medium'] font-medium justify-center leading-[0] text-[15px] text-center text-white whitespace-nowrap leading-[20px]" style={{ fontVariationSettings: '"wdth" 100' }}>Join the interest list</button>
              </div>
              <div
                className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-w-px overflow-clip relative"
                data-node-id="1:1213"
                data-name="Possibility sculpture"
              >
                <div
                  className="h-[370px] relative shrink-0 w-[440px]"
                  data-node-id="1:1214"
                  data-name="Connection landmark"
                >
                  <img
                    alt=""
                    className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                    src={imgConnectionLandmark}
                  />
                </div>
                <p
                  className="[word-break:break-word] font-['Mona_Sans:Medium'] font-medium leading-[20px] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                  data-node-id="1:1215"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  CLARITY IS ONLY THE BEGINNING.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute contents left-0 top-0" data-node-id="1:1216">
        <div className="absolute contents left-0 top-0" data-node-id="1:1217">
          <div className="absolute contents left-0 top-0" data-node-id="1:1218">
            <button
              type="button"
              onClick={() =>
                document
                  .querySelector('[data-name="section#schedules-section"]')
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="absolute bg-[#ee647b] content-stretch flex h-[46px] items-center justify-center left-0 pb-[13.5px] pt-[12.5px] px-[16px] rounded-[24px] top-0"
              data-node-id="1:1219"
              data-name="Component 5"
            >
              <div
                className="[word-break:break-word] flex flex-col font-['Mona_Sans:Medium'] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-black text-center whitespace-nowrap"
                data-node-id="I1:1219;30:2205"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                <p className="leading-[20px]">See Schedule</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => hero && setOpenEvent(hero)}
              className="absolute bg-[#6e8add] content-stretch flex h-[46px] items-center justify-center left-0 pb-[13.5px] pt-[12.5px] px-[16px] rounded-[24px] top-0 cursor-pointer"
              data-node-id="1:1220"
              data-name="Component 8"
            >
              <div
                className="[word-break:break-word] flex flex-col font-['Mona_Sans:Medium'] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-black text-center whitespace-nowrap"
                data-node-id="I1:1220;30:2205"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                <p className="leading-[20px]">View Details</p>
              </div>
            </button>
          </div>
          <div
            className="absolute bg-[rgba(255,255,255,0.6)] border border-[rgba(211,176,106,0.4)] border-solid content-stretch flex gap-[12px] items-start left-0 overflow-clip p-[6px] rounded-[999px] top-0"
            data-node-id="1:1221"
            data-name="Event / Insight toggle"
          >
            <button
              type="button"
              onClick={() => onModeChange("event")}
              aria-pressed="true"
              className="bg-[#f8ccdc] content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[180px] cursor-pointer"
              data-node-id="1:1222"
              data-name="Event active"
            >
              <p
                className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                data-node-id="I1:1222;33:286"
              >
                Event
              </p>
            </button>
            <button
              type="button"
              onClick={() => onModeChange("insight")}
              aria-pressed="false"
              className="bg-[rgba(255,255,255,0)] border border-[rgba(245,240,230,0.3)] border-solid content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[8px] shrink-0 w-[180px] cursor-pointer"
              data-node-id="1:1223"
              data-name="Insight"
            >
              <p
                className="[word-break:break-word] font-['Manrope:Bold'] font-bold leading-[normal] relative shrink-0 text-[#081d2b] text-[14px] whitespace-nowrap"
                data-node-id="I1:1223;33:293"
              >
                Insight
              </p>
            </button>
          </div>
        </div>
      </div>
      {openEvent &&
        createPortal(
          <EventModal event={openEvent} onClose={() => setOpenEvent(null)} />,
          document.body,
        )}
      {showAll &&
        createPortal(
          <AllEventsModal events={published} onClose={() => setShowAll(false)} onSelect={(e) => { setShowAll(false); setOpenEvent(e) }} />,
          document.body,
        )}
    </div>
  )
}
