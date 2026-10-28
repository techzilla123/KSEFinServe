import { type ReactNode, useEffect, useState } from "react"
import type { Screen } from "./AdminApp"
import {
  PERMISSIONS,
  ROLES,
  scopeForRole,
  useAdminDirectory,
  type AdminUser,
  type PermissionKey,
  type Role,
} from "./admin/adminDirectory"
import { supabase } from "./admin/supabaseClient"
import { useBookings, sessionDuration, usTimeLabel, type Booking } from "./admin/bookingsDirectory"
import { useEvents, eventWhen, uploadToCloudinary, type KseEvent } from "./admin/eventsDirectory"
import { useNotifications, type Notification } from "./admin/notifications"

const A = "/assets"
type Go = (screen: Screen, bookingId?: string | null, eventId?: string | null) => void
type Active = "events" | "monitoring" | "bookings" | "settings"

function Shell({
  active,
  page,
  go,
  onSignOut,
  children,
}: {
  active: Active
  page: string
  go: Go
  onSignOut?: () => void
  children: ReactNode
}) {
  const links: [string, Screen, Active?][] = [
    ["Dashboard", "dashboard"],
    ["Insights", "insights"],
    ["Events", "events", "events"],
    ["Monitoring", "monitoring", "monitoring"],
    ["Booked sessions", "bookings", "bookings"],
    ["Settings", "settings", "settings"],
  ]
  const directory = useNotifications()
  const { items } = directory
  const [showNotifications, setShowNotifications] = useState(false)
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <img
          className="h-[54px] w-[144px] object-contain"
          src={`${A}/14b9a.png`}
          alt="KSE Financial Services"
        />
        <div className="text-[11px] font-medium leading-[2] text-[#c9a963]">
          <p>KSEFINSERVE / ADMIN</p>
          <p>Wealth · Leadership · Legacy</p>
        </div>
        <nav className="w-full space-y-2">
          {links.map(([label, screen, key]) => (
            <button
              className={`nav-item ${key === active ? "active" : ""}`}
              onClick={() => go(screen)}
              key={label}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="text-[11px] leading-[1.7] text-[#b9c4c8]">
          <p>SUPABASE CONNECTED</p>
          <p>Authentication is live.</p>
          <p>Sample content below.</p>
        </div>
        <div className="mt-auto text-[12px] leading-[2.5] text-[#b9c4c8]">
          <a href="/" target="_blank" rel="noreferrer" className="block hover:text-white">View public website ↗</a>
          <button onClick={() => onSignOut?.()}>Sign out</button>
          <p>© 2026 KSEFinServe</p>
        </div>
      </aside>
      <section className="min-w-0 flex-1">
        <header className="admin-header">
          <p className="flex-1 text-[12px] text-[#66757d]">
            Workspace&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;{page}
          </p>
          <p className="text-[11px] text-[#876728]">Live workspace</p>
          <button
            type="button"
            onClick={() => setShowNotifications(true)}
            className="relative flex items-center gap-[7px] rounded-[6px] px-2 py-1 transition-colors hover:bg-[#f5f3ee]"
            aria-label={`Notifications (${items.length})`}
          >
            <img
              className="size-5"
              src={`${A}/9032b.svg`}
              alt=""
            />
            <b className="text-[13px] text-[#876728]">{items.length}</b>
            {items.length > 0 && <span className="absolute right-1 top-1 size-[6px] rounded-full bg-[#b3382c]" aria-hidden="true" />}
          </button>
          <div className="h-[30px] w-px bg-[#dddcd5]" />
          <div className="text-[12px] leading-[1.6]">
            <p>Kayode Elepe</p>
            <p>Administrator ⌄</p>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </section>
      {showNotifications && <NotificationListModal items={items} onRemove={directory.remove} onClose={() => setShowNotifications(false)} />}
    </main>
  )
}

/** The bell's notification list, shared by every admin page. */
function NotificationListModal({ items, onRemove, onClose }: { items: Notification[]; onRemove?: (item: Notification) => void; onClose: () => void }) {
  const [removing, setRemoving] = useState<string | null>(null)
  const [failed, setFailed] = useState<string | null>(null)

  const handleRemove = (item: Notification) => {
    if (!onRemove) return
    setRemoving(item.id)
    setFailed(null)
    // The dismissal is local to this admin's list, so there is nothing to fail.
    onRemove(item)
    setRemoving(null)
  }

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="notifications-title">
      <button className="modal-scrim" aria-label="Close" onClick={onClose} />
      <section className="event-modal event-modal--compact">
        <button className="event-modal-close" onClick={onClose} aria-label="Close">
          <svg className="size-[16px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="#081d2b" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div className="event-modal-body">
          <h2 id="notifications-title" className="text-[26px] font-semibold">Notifications</h2>
          <p className="mt-2 text-[14px] text-[#66757d]">
            {items.length} recent update{items.length === 1 ? '' : 's'} from across the site.
          </p>
          {failed && <p className="mt-2 text-[12px] text-[#a2493e]">{failed}</p>}
          <div className="mt-6 space-y-3">
            {items.length === 0 && <p className="text-[13px] text-[#66757d]">Nothing yet.</p>}
            {items.map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-[12px] border border-[#e5e1d8] p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-[#876728]">{n.kind}</p>
                  <p className="mt-1 text-[14px] font-semibold">{n.title}</p>
                  <p className="mt-1 text-[12px] text-[#66757d]">{n.detail}</p>
                  <p className="mt-1 text-[11px] text-[#66757d]">{n.createdAt ? new Date(n.createdAt).toLocaleString() : '—'}</p>
                </div>
                <button
                  type="button"
                  className="notification-delete"
                  aria-label={`Delete notification: ${n.title}`}
                  disabled={removing === n.id}
                  onClick={() => handleRemove(n)}
                >
                  {removing === n.id ? '…' : (
                    <svg className="size-[15px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 4h10M6.5 4V2.8h3V4M4.5 4l.6 8.2h5.8L11.5 4M6.7 6.4v4M9.3 6.4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Heading({
  overline,
  title,
  intro,
  action,
  backTo,
  go,
}: {
  overline: string
  title: string
  intro: string
  action?: ReactNode
  backTo?: Screen
  go?: Go
}) {
  return (
    <div>
      {backTo && go
        ? <button className="text-[12px] font-medium leading-[1.5] text-[#876728] hover:underline" onClick={() => go(backTo)}>{overline}</button>
        : <p className="text-[12px] font-medium leading-[1.5] text-[#876728]">{overline}</p>}
      <div className="mt-2 flex items-center gap-6">
        <h1 className="min-w-0 flex-1 text-[32px] font-semibold leading-none">
          {title}
        </h1>
        {action}
      </div>
      <p className="mt-2 text-[14px] leading-[21px] text-[#66757d]">{intro}</p>
    </div>
  )
}
function Notice({ title, children }: { title: string, children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-[8px] bg-[#f2ead7] p-4">
      <img className="size-[18px]" src={`${A}/975db.svg`} alt="" />
      <div>
        <p className="text-[13px] font-medium">{title}</p>
        <p className="mt-[3px] text-[12px] leading-[1.5] text-[#66757d]">
          {children}
        </p>
      </div>
    </div>
  )
}
function Tabs({ labels, active, onChange }: { labels: string[]; active?: string; onChange?: (label: string) => void }) {
  // The label carries its count ("All events 4"), so compare on the prefix.
  const isActive = (label: string) => (active === undefined ? false : label === active || label.startsWith(active) || active.startsWith(label))
  return (
    <div className="flex gap-2 overflow-x-auto border-b border-[#dddcd5] pb-3">
      {labels.map((x) => (
        <button
          className={isActive(x) ? "tab tab-active" : "tab"}
          key={x}
          onClick={() => onChange?.(x)}
        >
          {x}
        </button>
      ))}
    </div>
  )
}
function Controls({
  placeholder,
  filters,
  value,
  onSearch,
}: {
  placeholder: string
  filters: string[]
  value?: string
  onSearch?: (value: string) => void
}) {
  return (
    <div className="flex gap-3 max-[980px]:flex-wrap">
      <label className="flex h-[42px] min-w-[260px] flex-1 items-center gap-2 rounded-[7px] border border-[#dddcd5] bg-white px-3">
        <img className="size-[17px]" src={`${A}/6c1eb.svg`} alt="" />
        <input
          className="w-full text-[13px] outline-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </label>
      {filters.map((x) => (
        <button className="filter" key={x}>
          {x}
          <img className="size-[14px]" src={`${A}/f8540.svg`} alt="" />
        </button>
      ))}
    </div>
  )
}
function Footer() {
  return (
    <p className="text-[10px] text-[#66757d]">
      KSEFinServe administration · Static design preview{" "}
      <span className="float-right">Clarity · Growth · Impact</span>
    </p>
  )
}
function MetricCards({ items }: { items: string[][] }) {
  return (
    <div className="grid grid-cols-4 gap-4 max-[950px]:grid-cols-2 max-[540px]:grid-cols-1">
      {items.map((x) => (
        <div className="card p-[22px]" key={x[0]}>
          <p className="text-[12px] leading-7 text-[#66757d]">{x[0]}</p>
          <p className="text-[34px] font-semibold leading-[52px]">{x[1]}</p>
          <p
            className={`text-[11px] leading-[18px] ${
              x[2].includes("+") || x[2].includes("Sample")
                ? "text-[#276b55]"
                : "text-[#66757d]"
            }`}
          >
            {x[2]}
          </p>
        </div>
      ))}
    </div>
  )
}
function Panel({
  title,
  aside,
  children,
  className = "",
}: {
  title: string
  aside?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`card p-6 ${className}`}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-semibold">{title}</h2>
        {aside && <span className="text-[11px] text-[#876728]">{aside}</span>}
      </div>
      {children}
    </section>
  )
}
function Field({
  label,
  value = "",
  onChange,
  tall = false,
  hint,
  type = "text",
}: {
  label: string
  value?: string
  onChange?: (value: string) => void
  tall?: boolean
  hint?: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold">{label}</span>
      {tall ? (
        <textarea
          className="static-field min-h-[96px] resize-none"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      ) : (
        <input className="static-field" type={type} value={value} onChange={(e) => onChange?.(e.target.value)} />
      )}
      {hint && (
        <span className="mt-2 block text-[11px] leading-[1.5] text-[#66757d]">
          {hint}
        </span>
      )}
    </label>
  )
}
const Status = ({
  children,
  gray = false,
}: {
  children: ReactNode
  gray?: boolean
}) => (
  <span
    className={`inline-block rounded-[5px] px-[9px] py-1 text-[11px] font-semibold ${
      gray ? "bg-[#e8eef2] text-[#66757d]" : "bg-[#f2ead7] text-[#876728]"
    }`}
  >
    {children}
  </span>
)

const events = [
  [
    "Your wealth. Your next chapter.",
    "Wealth clarity · Workshop",
    "Upcoming",
    "03 Nov 2026",
    "18:00–19:30 EST",
    "Online",
    "Meeting link pending",
    "24 / 60",
    "Registration open",
  ],
  [
    "Lead with more purpose.",
    "Leadership development",
    "Upcoming",
    "07 Nov 2026",
    "10:00–12:00 EST",
    "Toronto",
    "Venue to confirm",
    "18 / 40",
    "Registration open",
  ],
  [
    "Think beyond the now.",
    "Life & legacy · Conversation",
    "Upcoming",
    "14 Nov 2026",
    "13:00–14:30 EST",
    "Online",
    "Meeting link pending",
    "12 / 50",
    "Registration open",
  ],
  [
    "Your wealth. Your next chapter.",
    "Wealth clarity · Workshop",
    "Upcoming",
    "21 Nov 2026",
    "11:00–12:30 EST",
    "Toronto",
    "Venue to confirm",
    "8 / 60",
    "Registration open",
  ],
  [
    "The Clarity Room",
    "Featured experience · Roundtable",
    "Draft",
    "12 Nov 2026",
    "18:00–20:00 EST",
    "Toronto",
    "Proposed in person",
    "0 / 30",
    "Not open",
  ],
  [
    "Lead with more purpose.",
    "Leadership development",
    "Draft",
    "Date to be announced",
    "America/Toronto",
    "Online",
    "Details pending",
    "0 / 40",
    "Not open",
  ],
  [
    "The Clarity Room",
    "Community conversation",
    "Past",
    "10 Oct 2026",
    "18:00–20:00 EDT",
    "Toronto",
    "Sample venue",
    "28 / 30",
    "Registration closed",
  ],
]

export function Events({ go }: { go: Go }) {
  const directory = useEvents()
  const [filter, setFilter] = useState("All events")
  const [query, setQuery] = useState("")

  const all = directory.events
  const published = all.filter((e) => e.status === "Published")
  const drafts = all.filter((e) => e.status === "Draft")
  const cancelled = all.filter((e) => e.status === "Cancelled")

  const rows = all.filter((e) => {
    if (filter.startsWith("Published") && e.status !== "Published") return false
    if (filter.startsWith("Drafts") && e.status !== "Draft") return false
    if (filter.startsWith("Cancelled") && e.status !== "Cancelled") return false
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      if (!`${e.title} ${e.category} ${e.reference}`.toLowerCase().includes(q)) return false
    }
    return true
  })

  // The tab label carries its count, so the filter has to match on the
  // leading words rather than the whole string.
  const tabs = [
    `All events ${all.length}`,
    `Published ${published.length}`,
    `Drafts ${drafts.length}`,
    `Cancelled ${cancelled.length}`,
  ]
  const activeTab = tabs.find((t) => filter === t || filter.startsWith(t) || t.startsWith(filter)) ?? tabs[0]

  const next = [...published].sort((a, b) => (a.startDate || "9999").localeCompare(b.startDate || "9999"))[0]
  const totalInterests = 0 // counted per event on the editor

  return (
    <Shell active="events" page="Events" go={go}>
      <Heading
        overline="CLARITY IN GOOD COMPANY"
        title="Events"
        intro="Shape meaningful gatherings, from the first idea to the final detail."
        action={
          <button className="gold-button" onClick={() => go("event-new")}>
            + Add event
          </button>
        }
      />
      <section className="event-hero">
        <img
          src={next?.imageUrl || `${A}/d0f2a.png`}
          alt="People sharing a guided roundtable conversation"
        />
        <div className="flex-1">
          <p className="text-[11px] text-[#c9a963]">THE KSE PROGRAMME</p>
          <h2>Good things are gathering.</h2>
          <p>
            {published.length} published · {drafts.length} drafts · {cancelled.length} cancelled
          </p>
        </div>
        <div className="w-[230px] max-[760px]:w-full">
          <p className="text-[11px]">NEXT PUBLISHED EVENT</p>
          <p className="mt-2 text-white">{next ? next.title : "None yet"}</p>
          <p className="mt-2 text-[#c9a963]">
            {next ? eventWhen(next) : "Publish an event to see it here"}
          </p>
        </div>
      </section>
      <Notice title="Live events">
        These records are stored in Supabase and shown on the public events page.
        Only events marked Published are visible to visitors.
      </Notice>
      <Tabs
        labels={tabs}
        active={activeTab}
        onChange={setFilter}
      />
      <Controls
        placeholder="Search event title or programme…"
        filters={["All formats", "All dates"]}
        value={query}
        onSearch={setQuery}
      />
      <div className="records-wrap">
        <table className="records-table events-table">
          <thead>
            <tr>
              <th>EVENT</th>
              <th>STATUS</th>
              <th>DATE & TIME</th>
              <th>LOCATION / FORMAT</th>
              <th>REGISTRATION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {directory.loading && (
              <tr><td colSpan={6} className="text-center py-8 text-[13px] text-[#66757d]">Loading events…</td></tr>
            )}
            {!directory.loading && directory.error && (
              <tr><td colSpan={6} className="text-center py-8 text-[13px] text-[#8f2f24]">{directory.error}</td></tr>
            )}
            {!directory.loading && !directory.error && rows.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-[13px] text-[#66757d]">No events yet. Use “+ Add event” to create one.</td></tr>
            )}
            {rows.map((e) => (
              <tr key={e.id}>
                <td>
                  <b>{e.title}</b>
                  <span>{e.category || "Event"}</span>
                </td>
                <td className={e.status === "Published" ? "green" : e.status === "Cancelled" ? "red" : "gold"}>
                  {e.status}
                </td>
                <td>
                  {eventWhen(e)}
                  <span>{e.startTime && e.endTime ? `${e.startTime}–${e.endTime}` : e.startTime || ""}</span>
                </td>
                <td>
                  {e.format || "—"}
                  <span>{[e.venueName, e.city].filter(Boolean).join(", ") || "To be announced"}</span>
                </td>
                <td>
                  {e.registrationStatus || "Not open"}
                  <span>{e.capacity ? `${e.capacity} spaces` : ""}</span>
                </td>
                <td className="gold whitespace-nowrap">
                  <button onClick={() => go("event-editor", null, e.id)}>View</button> /{" "}
                  <button onClick={() => go("event-editor", null, e.id)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!directory.loading && !directory.error && rows.length > 0 && (
          <Pagination text={`Showing ${rows.length} of ${all.length} events · live data`} />
        )}
      </div>
      <Footer />
    </Shell>
  )
}

function Pagination({ text }: { text: string }) {
  return (
    <div className="flex justify-between gap-6 border-t border-[#dddcd5] p-[18px] text-[12px]">
      <span className="text-[#66757d]">{text}</span>
      <span className="whitespace-nowrap">
        ← Previous&nbsp;&nbsp;&nbsp; 1&nbsp;&nbsp;&nbsp; 2&nbsp;&nbsp;&nbsp;
        Next →
      </span>
    </div>
  )
}

export function EventEditor({ go, empty = false, eventId }: { go: Go, empty?: boolean, eventId?: string | null }) {
  const directory = useEvents()
  const editing = !empty ? directory.events.find((e) => e.id === eventId) ?? null : null
  // The events list loads asynchronously; the form must not initialise from an
  // empty list or the fields would stay blank even after the data arrives.
  const [hydrated, setHydrated] = useState(empty ? true : false)

  useEffect(() => {
    if (empty) return
    if (directory.loading) return
    setHydrated(true)
  }, [empty, directory.loading])

  const [title, setTitle] = useState("")
  const [tagline, setTagline] = useState("")
  const [introduction, setIntroduction] = useState("")
  const [category, setCategory] = useState("")
  const [format, setFormat] = useState("In person")
  const [host, setHost] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [timezone, setTimezone] = useState("America/Chicago")
  const [venueName, setVenueName] = useState("")
  const [venueAddress, setVenueAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [onlineUrl, setOnlineUrl] = useState("")
  const [description, setDescription] = useState("")
  const [whoFor, setWhoFor] = useState("")
  const [preparation, setPreparation] = useState("")
  const [howToApply, setHowToApply] = useState("")
  const [capacity, setCapacity] = useState("")
  const [registered, setRegistered] = useState("")
  const [registrationStatus, setRegistrationStatus] = useState("Not open")
  const [cost, setCost] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState<"Published" | "Draft" | "Cancelled">("Draft")

  // Populate the form once the record is available.
  useEffect(() => {
    if (!hydrated || !editing) return
    setTitle(editing.title)
    setTagline(editing.tagline)
    setIntroduction(editing.introduction)
    setCategory(editing.category)
    setFormat(editing.format)
    setHost(editing.host)
    setStartDate(editing.startDate)
    setEndDate(editing.endDate)
    setStartTime(editing.startTime)
    setEndTime(editing.endTime)
    setTimezone(editing.timezone)
    setVenueName(editing.venueName)
    setVenueAddress(editing.venueAddress)
    setCity(editing.city)
    setCountry(editing.country)
    setOnlineUrl(editing.onlineUrl)
    setDescription(editing.description)
    setWhoFor(editing.whoFor)
    setPreparation(editing.preparation)
    setHowToApply(editing.howToApply)
    setCapacity(editing.capacity)
    setRegistered(editing.registered)
    setRegistrationStatus(editing.registrationStatus)
    setCost(editing.cost)
    setImageUrl(editing.imageUrl)
    setImageAlt(editing.imageAlt)
    setVideoUrl(editing.videoUrl)
    setFeatured(editing.featured)
    setStatus(editing.status)
  }, [hydrated, editing])

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [interests, setInterests] = useState<{ id: string; name: string; email: string; phone: string; createdAt: string }[]>([])
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Load the interest list for the event being edited.
  useEffect(() => {
    if (!editing) {
      setInterests([])
      return
    }
    void directory.interestsFor(editing.id).then((r) => setInterests(r.rows))
  }, [editing?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const pickImage = async (file: File | null) => {
    if (!file) return
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    const result = await uploadToCloudinary(file, setUploadProgress)
    setUploading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (file.type.startsWith("video")) setVideoUrl(result.url)
    else setImageUrl(result.url)
  }

  const buildPayload = () => ({
    title,
    tagline,
    category,
    introduction,
    format,
    host,
    startDate,
    endDate,
    startTime,
    endTime,
    timezone,
    venueName,
    venueAddress,
    city,
    country,
    onlineUrl,
    description,
    whoFor,
    preparation,
    howToApply,
    capacity,
    registered,
    registrationStatus,
    cost,
    imageUrl,
    imageAlt,
    videoUrl,
    featured,
    status,
  })

  const save = async (nextStatus: "Published" | "Draft") => {
    if (busy) return
    setError(null)
    if (!title.trim()) {
      setError("Give the event a title.")
      return
    }
    setBusy(true)
    const payload = { ...buildPayload(), status: nextStatus }
    const result = editing
      ? await directory.updateEvent(editing.id, payload)
      : await directory.createEvent(payload)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setDone(nextStatus === "Published" ? "Event published." : "Draft saved.")
    setStatus(nextStatus)
  }

  const remove = async () => {
    if (!editing || busy) return
    setBusy(true)
    const result = await directory.deleteEvent(editing.id)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    go("events")
  }

  return (
    <Shell active="events" page="Events" go={go}>
      <Heading
        overline={empty ? "← Events / NEW EVENT" : `← Events / ${editing?.reference ?? ""}`}
        backTo="events"
        go={go}
        title={empty ? "Add event" : editing?.title || "Edit event"}
        intro={
          empty
            ? "Create a new gathering and shape every detail with care."
            : `Edit event · ${editing?.category || "Event"} · Last updated ${editing?.updatedAt ? new Date(editing.updatedAt).toLocaleString() : "—"}`
        }
        action={
          <div className="flex gap-[10px]">
            <button className="white-button" onClick={() => void save("Draft")} disabled={busy}>
              {busy ? "Saving…" : "Save draft"}
            </button>
            <button className="gold-button" onClick={() => void save("Published")} disabled={busy}>
              {busy ? "Saving…" : "Publish event"}
            </button>
          </div>
        }
      />
      <Notice
        title={empty ? "New event · Add the essentials" : `${status} event · ${status === "Published" ? "visible on the public page" : "not visible publicly"}`}
      >
        {empty
          ? "Start with the event details below. Nothing will be published until you decide."
          : "Changes save to Supabase immediately. Visitors only see events marked Published."}
      </Notice>
      {error && <p className="rounded-[8px] border border-[#e6c4c0] bg-[#fdf1ef] px-4 py-3 text-[13px] text-[#8f2f24]">{error}</p>}
      {done && <p className="rounded-[8px] border border-[#cfe0d6] bg-[#f1f7f3] px-4 py-3 text-[13px] text-[#276b55]">{done}</p>}
      <div className="editor-layout">
        <div className="space-y-6">
          <Panel title="The essentials">
            <div className="space-y-5">
              <Field label="Event title *" value={title} onChange={setTitle} />
              <Field
                label="Short introduction *"
                value={introduction}
                onChange={setIntroduction}
                tall
              />
              <div className="field-grid">
                <Field label="Programme" value={category} onChange={setCategory} />
                <label className="block">
                  <span className="mb-2 block text-[12px] font-semibold">Format *</span>
                  <select className="static-field" value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option>In person</option>
                    <option>Online</option>
                    <option>Hybrid</option>
                  </select>
                </label>
              </div>
              <Field label="Host / speaker *" value={host} onChange={setHost} />
              <label className="flex items-center gap-3 text-[13px]">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                <span>Feature this event in the public hero</span>
              </label>
            </div>
          </Panel>
          <Panel title="Date, time & place">
            <div className="space-y-5">
              <div className="field-grid">
                <Field label="Start date *" type="date" value={startDate} onChange={setStartDate} />
                <Field label="End date" type="date" value={endDate} onChange={setEndDate} />
              </div>
              <div className="field-grid">
                <Field label="Start time *" type="time" value={startTime} onChange={setStartTime} />
                <Field label="End time" type="time" value={endTime} onChange={setEndTime} />
              </div>
              <label className="block">
                <span className="mb-2 block text-[12px] font-semibold">Timezone *</span>
                <select className="static-field" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option>America/Chicago</option>
                  <option>America/New_York</option>
                  <option>America/Toronto</option>
                  <option>America/Los_Angeles</option>
                  <option>Europe/London</option>
                  <option>Africa/Lagos</option>
                </select>
              </label>
              <Field label="Venue name *" value={venueName} onChange={setVenueName} />
              <div className="field-grid">
                <Field label="City" value={city} onChange={setCity} />
                <Field label="Country" value={country} onChange={setCountry} />
              </div>
              <Field
                label="Venue address"
                value={venueAddress}
                onChange={setVenueAddress}
                hint="Confirm a full address and accessibility information before publishing."
              />
              <Field
                label="Online attendance / meeting URL"
                value={onlineUrl}
                onChange={setOnlineUrl}
                hint="For an online or hybrid event, provide the meeting URL here."
              />
            </div>
          </Panel>
          <Panel title="Description & attendee information">
            <div className="space-y-5 text-[14px] leading-[21px]">
              <Field label="Full description" value={description} onChange={setDescription} tall />
              <Field label="Who this is for" value={whoFor} onChange={setWhoFor} tall />
              <Field label="Preparation & accessibility" value={preparation} onChange={setPreparation} tall />
              <Field label="How to apply" value={howToApply} onChange={setHowToApply} tall />
            </div>
          </Panel>
        </div>
        <aside className="space-y-6">
          <Panel title="Publishing">
            <div className="space-y-5">
              <Status>{status}{status === "Published" ? " · Live" : status === "Draft" ? " · Not visible" : " · Cancelled"}</Status>
              <p className="text-[12px] text-[#66757d]">
                Reference
                <br />
                <span className="text-[14px] text-[#081d2b]">{editing?.reference ?? "Assigned on save"}</span>
              </p>
              <label className="block">
                <span className="mb-2 block text-[12px] font-semibold">Status</span>
                <select className="static-field" value={status} onChange={(e) => setStatus(e.target.value as "Published" | "Draft" | "Cancelled")}>
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Cancelled</option>
                </select>
              </label>
              <div className="flex gap-3">
                <button className="white-button flex-1" onClick={() => void save("Draft")} disabled={busy}>Save draft</button>
                <button className="gold-button flex-1" onClick={() => void save("Published")} disabled={busy}>Publish</button>
              </div>
              {editing && (
                <button className="white-button w-full text-[#b3382c]" onClick={() => setConfirmDelete(true)}>
                  Delete event
                </button>
              )}
            </div>
          </Panel>
          <Panel title="Event image">
            {imageUrl || videoUrl ? (
              imageUrl ? (
                <img className="h-[180px] w-full rounded-[8px] object-cover" src={imageUrl} alt={imageAlt || title} />
              ) : (
                <video className="h-[180px] w-full rounded-[8px] object-cover" src={videoUrl} controls />
              )
            ) : (
              <div className="empty-image">Select event image or video</div>
            )}
            <p className="mt-4 text-[12px]">
              {uploading ? `Uploading… ${uploadProgress}%` : imageUrl ? "Image saved to Cloudinary" : videoUrl ? "Video saved to Cloudinary" : "No media selected"}
            </p>
            <div className="my-3">
              <Status>
                {uploading ? `Uploading ${uploadProgress}%` : imageUrl || videoUrl ? "Media ready" : "Media optional"}
              </Status>
            </div>
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold">Upload image or video</span>
              <input
                type="file"
                accept="image/*,video/*"
                className="static-field"
                disabled={uploading}
                onChange={(e) => void pickImage(e.target.files?.[0] ?? null)}
              />
              <span className="mt-2 block text-[11px] leading-[1.5] text-[#66757d]">
                Uploads to Cloudinary. Only the link is stored in the database.
              </span>
            </label>
            <Field
              label="Or paste an image / video URL"
              value={imageUrl || videoUrl}
              onChange={(next) => {
                // Keep the two fields in step: a video URL belongs to videoUrl.
                if (/\.(mp4|webm|mov|m3u8)(\?|$)/i.test(next)) {
                  setVideoUrl(next)
                  setImageUrl("")
                } else {
                  setImageUrl(next)
                  setVideoUrl("")
                }
              }}
              hint="Use this if the upload preset is not enabled for unsigned uploads yet."
            />
            <Field label="Image alt text *" value={imageAlt} onChange={setImageAlt} />
          </Panel>
          <Panel title="Registration settings">
            <div className="space-y-5">
              <Field label="Capacity *" value={capacity} onChange={setCapacity} />
              <label className="block">
                <span className="mb-2 block text-[12px] font-semibold">Registration status</span>
                <select className="static-field" value={registrationStatus} onChange={(e) => setRegistrationStatus(e.target.value)}>
                  <option>Not open</option>
                  <option>Open</option>
                  <option>Closed</option>
                  <option>Waitlist</option>
                </select>
              </label>
              <Field label="Attendance cost" value={cost} onChange={setCost} />
              <Field label="Registered count" value={registered} onChange={setRegistered} />
            </div>
          </Panel>
          {editing && (
            <Panel title="Interested candidates" aside={`${interests.length} registered`}>
              {interests.length === 0 ? (
                <p className="text-[12px] text-[#66757d]">
                  Nobody has registered interest in this event yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {interests.map((p) => (
                    <div key={p.id} className="rounded-[8px] border border-[#e5e1d8] p-3 text-[12px]">
                      <b>{p.name}</b>
                      <p className="text-[#66757d]">{p.email}</p>
                      <p className="text-[#66757d]">{p.phone}</p>
                      <p className="mt-1 text-[11px] text-[#66757d]">
                        {new Date(p.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}
          <Panel title="Listing preview">
            <p className="text-[11px] text-[#876728]">{category || "EVENT"}</p>
            <h3 className="my-4 text-[20px] font-semibold">{title || "Your event title"}</h3>
            <p className="text-[11px] text-[#66757d]">
              {startDate
                ? `${startDate}${startTime ? ` · ${startTime}${endTime ? `–${endTime}` : ""}` : ""} · ${format} · ${city || "location to confirm"}`
                : "Add a date and location"}
            </p>
          </Panel>
        </aside>
      </div>
      {confirmDelete && (
        <div className="modal-layer" role="dialog" aria-modal="true">
          <button className="modal-scrim" aria-label="Close" onClick={() => setConfirmDelete(false)} />
          <section className="create-modal">
            <h2 className="mt-2 text-[24px] font-semibold">Delete this event?</h2>
            <p className="mt-2 text-[13px] text-[#66757d]">
              {editing?.title} · {editing?.reference}. This also removes its registered interest list.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button className="white-button" onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button className="gold-button" onClick={remove} disabled={busy}>
                {busy ? "Deleting…" : "Delete event"}
              </button>
            </div>
          </section>
        </div>
      )}
      <Footer />
    </Shell>
  )
}

const sessions = [
  [
    "Amara Okafor",
    "amara.okafor@example.com",
    "Wealth planning",
    "Detailed enquiry",
    "20 Oct · 14:00 EDT",
    "Proposed · 30 minutes",
    "Kayode Elepe",
    "Upcoming",
  ],
  [
    "Daniel Mensah",
    "daniel.mensah@example.com",
    "Advisor opportunities",
    "Short enquiry",
    "21 Oct · 10:00 EDT",
    "30 minutes",
    "Kayode Elepe",
    "Upcoming",
  ],
  [
    "Priya Shah",
    "priya.shah@example.com",
    "Speaking & partnerships",
    "Detailed enquiry",
    "21 Oct · 15:00 EDT",
    "45 minutes",
    "Kayode Elepe",
    "Upcoming",
  ],
  [
    "Michael Chen",
    "michael.chen@example.com",
    "Wealth planning",
    "Short enquiry",
    "22 Oct · 11:00 EDT",
    "30 minutes",
    "Ruth Adeyemi",
    "Upcoming",
  ],
  [
    "Sarah Williams",
    "sarah.williams@example.com",
    "Wealth planning",
    "Detailed enquiry",
    "23 Oct · 09:30 EDT",
    "30 minutes",
    "Ruth Adeyemi",
    "Upcoming",
  ],
  [
    "Kwame Asante",
    "kwame.asante@example.com",
    "Advisor opportunities",
    "Short enquiry",
    "19 Oct · 13:00 EDT",
    "30 minutes",
    "Kayode Elepe",
    "Completed",
  ],
  [
    "Elena Rossi",
    "elena.rossi@example.com",
    "Wealth planning",
    "Detailed enquiry",
    "18 Oct · 10:00 EDT",
    "30 minutes",
    "Ruth Adeyemi",
    "Completed",
  ],
  [
    "James Wilson",
    "james.wilson@example.com",
    "Speaking & partnerships",
    "Short enquiry",
    "17 Oct · 16:00 EDT",
    "Cancelled by client",
    "Kayode Elepe",
    "Cancelled",
  ],
]
export function Bookings({ go }: { go: Go }) {
  const directory = useBookings()
  const [filter, setFilter] = useState("All records")
  const [query, setQuery] = useState("")
  const [openId, setOpenId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Booking | null>(null)

  const all = directory.bookings
  const upcoming = all.filter((b) => b.status === "Upcoming")
  const completed = all.filter((b) => b.status === "Completed")
  const cancelled = all.filter((b) => b.status === "Cancelled")

  const rows = all.filter((b) => {
    if (filter.startsWith("Upcoming") && b.status !== "Upcoming") return false
    if (filter.startsWith("Completed") && b.status !== "Completed") return false
    if (filter.startsWith("Cancelled") && b.status !== "Cancelled") return false
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      const haystack = `${b.firstName} ${b.lastName} ${b.email} ${b.reference}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  const tabs = [
    `All records ${all.length}`,
    `Upcoming ${upcoming.length}`,
    `Completed ${completed.length}`,
    `Cancelled ${cancelled.length}`,
  ]

  // The tab label carries its count, so the filter has to match on the
  // leading words rather than the whole string.
  const activeTab = tabs.find((t) => filter === t || filter.startsWith(t) || t.startsWith(filter)) ?? tabs[0]

  return (
    <Shell active="bookings" page="Booked sessions" go={go}>
      <Heading
        overline="PEOPLE FIRST. EVERY DETAIL CONSIDERED."
        title="Booked sessions"
        intro="One considered record for every enquiry, conversation and next step."
        action={<button className="white-button">↓ Export records</button>}
      />
      <MetricCards
        items={[
          ["All session records", String(all.length), "Live from the booking form"],
          ["Upcoming", String(upcoming.length), "Includes proposed / pending confirmation"],
          ["Completed", String(completed.length), "Manually recorded outcomes"],
          ["Cancelled", String(cancelled.length), "Retained for operational history"],
        ]}
      />
      <Notice title="Live booking records">
        These records come from the public booking form. Email and calendar
        delivery are configured separately.
      </Notice>
      <Tabs labels={tabs} active={activeTab} onChange={setFilter} />
      <Controls
        placeholder="Search client, email or record reference…"
        filters={["All services", "All advisers"]}
        value={query}
        onSearch={setQuery}
      />
      <div className="records-wrap">
        <table className="records-table sessions-table">
          <thead>
            <tr>
              <th>CLIENT</th>
              <th>SERVICE / ROUTE</th>
              <th>SESSION TIME</th>
              <th>ADVISER</th>
              <th>STATUS</th>
              <th>RECORD</th>
            </tr>
          </thead>
          <tbody>
            {directory.loading && (
              <tr><td colSpan={6} className="text-center py-8 text-[13px] text-[#66757d]">Loading bookings…</td></tr>
            )}
            {!directory.loading && directory.error && (
              <tr><td colSpan={6} className="text-center py-8 text-[13px] text-[#8f2f24]">{directory.error}</td></tr>
            )}
            {!directory.loading && !directory.error && rows.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-[13px] text-[#66757d]">No bookings yet. Submissions from the booking form will appear here.</td></tr>
            )}
            {rows.map((b) => (
              <tr key={b.id}>
                <td>
                  <b>{b.firstName} {b.lastName}</b>
                  <span>{b.email}</span>
                </td>
                <td>
                  {b.path || b.topic || "Wealth planning"}
                  <span>{b.route}</span>
                </td>
                <td>
                  {usTimeLabel(b.availableDate, b.availableTime)}
                  <span>{sessionDuration(b)}</span>
                </td>
                <td>{b.adviser}</td>
                <td
                  className={
                    b.status === "Completed"
                      ? "green"
                      : b.status === "Cancelled"
                        ? "red"
                        : "gold"
                  }
                >
                  {b.status}
                </td>
                <td>
                  <button
                    className="gold whitespace-nowrap"
                    onClick={() => go("booking-detail", b.id)}
                  >
                    Details →
                  </button>
                  {b.status === "Cancelled" && (
                    <button
                      className="text-[#b3382c] hover:underline whitespace-nowrap"
                      onClick={() => setConfirmDelete(b)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!directory.loading && !directory.error && rows.length > 0 && (
          <Pagination text={`Showing ${rows.length} record${rows.length === 1 ? "" : "s"} · live data`} />
        )}
      </div>
      {confirmDelete && (
        <ConfirmDeleteBooking
          booking={confirmDelete}
          close={() => setConfirmDelete(null)}
          onDone={() => setConfirmDelete(null)}
        />
      )}
      <p className="text-[11px] text-[#66757d]">
        All session times use America/Toronto (EDT, UTC−04:00). Public form
        submissions are requests; a proposed time still requires agreement with
        the client.
      </p>
      <Footer />
    </Shell>
  )
}

function ConfirmDeleteBooking({ booking, close, onDone }: { booking: Booking; close: () => void; onDone: () => void }) {
  const directory = useBookings()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState("")

  const confirm = async () => {
    if (busy) return
    if (confirmText.trim().toLowerCase() !== "delete") {
      setError('Type "delete" to confirm.')
      return
    }
    setBusy(true)
    setError(null)
    const result = await directory.deleteBooking(booking.id)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    onDone()
  }

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <button className="modal-scrim" aria-label="Close modal" onClick={close} />
      <section className="create-modal">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-[#876728]">ADMINISTRATORS ONLY</p>
            <h2 id="delete-title" className="mt-2 text-[28px] font-semibold">
              Delete {booking.firstName} {booking.lastName}’s record?
            </h2>
            <p className="mt-2 text-[13px] text-[#66757d]">
              {booking.reference} · {booking.email}
            </p>
            <p className="mt-2 text-[13px] text-[#8f2f24]">
              This permanently removes the record. It cannot be undone.
            </p>
          </div>
          <button onClick={close} aria-label="Close">
            <img className="size-[18px]" src={`${A}/490c7.svg`} alt="" />
          </button>
        </div>
        {error && <p className="rounded-[8px] border border-[#e6c4c0] bg-[#fdf1ef] px-4 py-3 text-[13px] text-[#8f2f24]">{error}</p>}
        <label className="block">
          <span className="mb-2 block text-[12px] font-semibold">Type “delete” to confirm</span>
          <input
            className="static-field"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="delete"
          />
        </label>
        <hr className="border-[#dddcd5]" />
        <div className="flex justify-end gap-3">
          <button className="white-button" onClick={close}>Cancel</button>
          <button className="gold-button" onClick={confirm} disabled={busy}>
            {busy ? "Deleting…" : "Delete record"}
          </button>
        </div>
      </section>
    </div>
  )
}

function Pair({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[11px] text-[#66757d]">{label}</p>
      <p className="mt-1 text-[13px]">{value}</p>
    </div>
  )
}
export function BookingDetail({ go, bookingId }: { go: Go; bookingId?: string | null }) {
  const directory = useBookings()
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const booking = directory.bookings.find((b) => b.id === bookingId) ?? null

  // Load the saved internal note when the record changes. Depending on the note
  // value itself would re-run after every save and wipe what was just typed.
  useEffect(() => {
    setNote(booking?.internalNotes ?? "")
    setError(null)
  }, [bookingId]) // eslint-disable-line react-hooks/exhaustive-deps

  const saveNote = async () => {
    if (!booking || busy) return
    setBusy(true)
    setError(null)
    const result = await directory.saveNote(booking.id, note)
    setBusy(false)
    if (result.error) setError(result.error)
  }

  if (!bookingId) {
    return (
      <Shell active="bookings" page="Booked sessions" go={go}>
        <Heading
          overline="← Booked sessions"
          backTo="bookings"
          go={go}
          title="No record selected"
          intro="Choose a record from the booked sessions list to see its details."
        />
        <Footer />
      </Shell>
    )
  }

  if (directory.loading) {
    return (
      <Shell active="bookings" page="Booked sessions" go={go}>
        <Heading overline="← Booked sessions" backTo="bookings" go={go} title="Loading…" intro="Fetching this booking record." />
        <Footer />
      </Shell>
    )
  }

  if (!booking) {
    return (
      <Shell active="bookings" page="Booked sessions" go={go}>
        <Heading
          overline="← Booked sessions"
          backTo="bookings"
          go={go}
          title="Record not found"
          intro="This booking may have been deleted. Return to the list to choose another."
        />
        <Footer />
      </Shell>
    )
  }

  const received = booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "—"
  const when = usTimeLabel(booking.availableDate, booking.availableTime)
  const location = [booking.city, booking.province, booking.country].filter(Boolean).join(", ") || "—"

  return (
    <Shell active="bookings" page="Booked sessions" go={go}>
      <Heading
        overline={`← Booked sessions / ${booking.reference}`}
        backTo="bookings"
        go={go}
        title={`${booking.firstName} ${booking.lastName}`.trim()}
        intro={`${booking.path || booking.topic || "Wealth planning"} · ${booking.route} · Received ${received}`}
        action={
          <div className="flex gap-3">
            <button className="white-button" onClick={() => void directory.updateStatus(booking.id, "Completed")}>Mark completed</button>
            <button className="white-button" onClick={() => void directory.updateStatus(booking.id, "Cancelled")}>Cancel session</button>
          </div>
        }
      />
      <Notice title={`${booking.status} · ${booking.status === "Upcoming" ? "Pending client confirmation" : booking.status.toLowerCase()}`}>
        A proposed time is recorded below. This is still an enquiry, not a
        confirmed appointment. No emails have been sent and no calendar event
        has been created.
      </Notice>
      <div className="detail-layout">
        <div className="space-y-6">
          <Panel title="About the client" aside="Submitted details">
            <div className="info-grid">
              <Pair label="First name" value={booking.firstName} />
              <Pair label="Last name" value={booking.lastName} />
              <Pair label="Email address" value={booking.email} />
              <Pair label="Phone number (with country code)" value={booking.phone} />
              <Pair label="City" value={booking.city || "—"} />
              <Pair label="Province / state / region" value={booking.province || "—"} />
              <Pair label="Country" value={booking.country} />
              <Pair label="Preferred contact method" value={booking.contactMethod} />
              <Pair label="How did you hear about KSE?" value={booking.source || "Not provided"} />
            </div>
          </Panel>
          <Panel title="Submitted enquiry" aside={booking.route}>
            <div className="info-grid">
              <Pair label="Booking route" value={booking.route} />
              <Pair label="Discussion path" value={booking.path} />
              <Pair label="Topic" value={booking.topic || "—"} />
              <Pair label="What matters most right now?" value={booking.priorities.length ? booking.priorities.join(" · ") : "—"} />
              <Pair label="What would a good outcome look like?" value={booking.outcome || "—"} />
            </div>
            <div className="mt-5">
              <Pair label="Relevant context · Optional" value={booking.context || "—"} />
            </div>
            <div className="mt-5">
              <Pair label="Questions they’d like to ask" value={booking.question || "—"} />
            </div>
          </Panel>
          <Panel title="Consent & contact permissions" aside={`Captured ${received}`}>
            <div className="space-y-4 text-[13px]">
              <p className="flex items-center gap-3">
                <img className="size-[16px]" src={`${A}/b5a53.svg`} alt="" />
                <b>Session contact · {booking.consentContact ? "Agreed" : "Not agreed"}</b>
              </p>
              <p className="pl-7 text-[12px] text-[#66757d]">
                I agree that KSEFinServe may contact me using the details
                provided to discuss and arrange this session.
              </p>
              <p className="flex items-center gap-3">
                <img className="size-[16px]" src={`${A}/3be92.svg`} alt="" />
                <b>Insights & updates by email · {booking.consentUpdates ? "Opted in" : "Not opted in"}</b>
              </p>
              <p className="pl-7 text-[12px] text-[#66757d]">
                I’d also like KSE insights and updates by email. Optional — I
                can unsubscribe at any time.
              </p>
            </div>
          </Panel>
          <Panel title="Internal notes" aside="Visible to authorised team only">
            {booking.internalNotes && (
              <div className="rounded-[7px] bg-[#f5f3ee] p-4 text-[12px]">
                <b>Saved note</b>
                <p className="mt-2">{booking.internalNotes}</p>
              </div>
            )}
            <div className="mt-5">
              <Field
                label="Add an internal note"
                value={note}
                onChange={setNote}
                tall
              />
            </div>
            {error && <p className="mt-3 text-[12px] text-[#8f2f24]">{error}</p>}
            <button className="white-button float-right mt-4" onClick={saveNote} disabled={busy}>
              {busy ? "Saving…" : "Save note"}
            </button>
          </Panel>
        </div>
        <aside className="space-y-6">
          <Panel title="Session schedule">
            <Status>{booking.status}{booking.status === "Upcoming" ? " · Proposed" : ""}</Status>
            <h3 className="my-5 text-[23px] font-semibold">{when}</h3>
            <p className="text-[18px]">{booking.availableTime || "Time to be arranged"}</p>
            <p className="mt-3 text-[11px] text-[#66757d]">
              Converted to United States Central Time · CDT
            </p>
            <hr className="my-5 border-[#dddcd5]" />
            <Pair label="Assigned adviser" value={booking.adviser} />
            <div className="mt-4">
              <Pair label="Client location" value={location} />
            </div>
            <div className="mt-4">
              <Pair label="Confirmation" value="Awaiting agreement with client" />
            </div>
            <div className="mt-4 flex gap-3">
              {booking.status !== "Completed" && (
                <button className="white-button flex-1" onClick={() => void directory.updateStatus(booking.id, "Completed")}>Mark completed</button>
              )}
              {booking.status !== "Cancelled" && (
                <button className="white-button flex-1" onClick={() => void directory.updateStatus(booking.id, "Cancelled")}>Cancel</button>
              )}
              {booking.status !== "Upcoming" && (
                <button className="white-button flex-1" onClick={() => void directory.updateStatus(booking.id, "Upcoming")}>Reopen</button>
              )}
            </div>
          </Panel>
          <Panel title="Delivery & integrations">
            <div className="space-y-5">
              <Pair label="Client email" value="Not sent" />
              <Pair label="Admin email" value="Not sent" />
              <Pair label="Google Calendar" value="Not connected" />
              <p className="text-[12px] text-[#876728]">
                Review integration status →
              </p>
            </div>
          </Panel>
          <Panel title="Activity timeline" aside="Record history">
            <div className="timeline">
              <p>
                <img src={`${A}/0fde5.svg`} alt="" />
                <b>Enquiry submitted</b>
                <span>{booking.route} · {received}</span>
              </p>
              {booking.internalNotes && (
                <p>
                  <img src={`${A}/0fde5.svg`} alt="" />
                  <b>Internal note added</b>
                  <span>Visible to authorised team only</span>
                </p>
              )}
              <p>
                <img src={`${A}/0fde5.svg`} alt="" />
                <b>Status: {booking.status}</b>
                <span>{booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : "—"}</span>
              </p>
            </div>
          </Panel>
          <Notice title="Handle with care">
            Client information is for session preparation and relevant follow-up
            only. Access is role restricted.
          </Notice>
        </aside>
      </div>
      <Footer />
    </Shell>
  )
}

export function Monitoring({ go }: { go: Go }) {
  const performance = [
    [
      "Home page",
      "/",
      "4,820",
      "3m 12s",
      "210 session-page visits",
      "24 requests",
    ],
    [
      "Insight · The kitchen table plan",
      "/insights/the-kitchen-table-plan",
      "1,340",
      "4m 08s",
      "124 article reads",
      "8 requests",
    ],
    [
      "Book a session",
      "/book-a-session",
      "640",
      "2m 41s",
      "96 form starts",
      "48 requests",
    ],
    [
      "Event · Your wealth. Your next chapter.",
      "/events/wealth-clarity",
      "480",
      "2m 16s",
      "24 registrations",
      "5.0% registration rate",
    ],
    [
      "Retirement planning tool",
      "/tools/retirement",
      "920",
      "5m 04s",
      "210 scenario views",
      "6 requests",
    ],
  ]
  return (
    <Shell active="monitoring" page="Monitoring" go={go}>
      <Heading
        overline="PERSPECTIVE, NOT LIVE TRACKING"
        title="Monitoring"
        intro="Understand the journey from a first visit to a thoughtful conversation."
        action={
          <div className="flex gap-3">
            <button className="white-button">01–20 Oct 2026 ⌄</button>
            <button className="white-button">↓ Export demo report</button>
          </div>
        }
      />
      <Notice title="Demo data · Tracking is not connected">
        No analytics collection, Meta Pixel or live tracking is active. All
        figures are illustrative; date filters and exports are static.
      </Notice>
      <MetricCards
        items={[
          [
            `Visitors / unique users`,
            "8,420",
            "+12.4% · Demo vs prior 20 days",
          ],
          ["Page views", "14,260", "1.69 views per visitor · Demo"],
          ["Engaged visits", "5,380", "63.9% engagement rate · Demo"],
          [
            "Session request conversion",
            "0.57%",
            "48 requests / 8,420 visitors · Demo",
          ],
        ]}
      />
      <div className="analytics-grid">
        <Panel title="Visitors over time" aside="Daily · Demo">
          <div className="mb-2">
            <b className="text-[24px]">8,420</b>
            <span className="ml-4 text-[11px] text-[#66757d]">
              01–20 October 2026 Compared with 1–30 September
            </span>
          </div>
          <div className="chart continuity-chart">
            <div className="chart-grid">
              <span>600</span>
              <i />
            </div>
            <div className="chart-grid">
              <span>400</span>
              <i />
            </div>
            <div className="chart-grid">
              <span>200</span>
              <i />
            </div>
            <div className="chart-grid">
              <span>0</span>
              <i />
            </div>
            <img className="previous-line" src={`${A}/8228a.png`} alt="" />
            <img className="current-line" src={`${A}/aadc8.svg`} alt="" />
          </div>
        </Panel>
        <Panel title="Traffic sources" aside="Demo">
          <Traffic />
        </Panel>
        <Panel
          title="Booking conversion funnel"
          aside="Demo journey"
          className="min-h-[300px]"
        >
          <p className="mb-5 text-[11px] text-[#66757d]">
            Requests are enquiries, not automatically confirmed appointments.
          </p>
          <div className="funnel">
            {[
              ["8,420", "Visitors", "100% of visitors"],
              ["640", "Session page", "7.6% of visitors"],
              ["96", "Form starts", "1.14% of visitors"],
              ["48", "Requests", "0.57% of visitors"],
            ].map((x, i) => (
              <div
                style={{ height: `${132 - i * 18}px` }}
                className={i === 3 ? "goldbar" : ""}
                key={x[1]}
              >
                <b>{x[0]}</b>
                <i />
                <span>
                  {x[1]}
                  <small>{x[2]}</small>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-[#dddcd5] pt-4 text-[11px] text-[#876728]">
            50% of form starts become requests · Biggest opportunity: the
            session-page introduction.
          </p>
        </Panel>
        <Panel title="Device breakdown" aside="Demo">
          <div className="flex items-center gap-5">
            <img
              className="size-[130px]"
              src={`${A}/2a826.svg`}
              alt="Desktop 55%, Mobile 38%, Tablet 7%"
            />
            <p className="text-[12px] leading-[2.3]">
              Desktop · 55%
              <br />
              Mobile · 38%
              <br />
              Tablet · 7%
            </p>
          </div>
          <hr className="my-4 border-[#dddcd5]" />
          <Pair label="Average visit duration" value="3m 24s" />
          <div className="mt-3">
            <Pair label="New / returning visitors" value="72% / 28%" />
          </div>
          <div className="mt-3">
            <Pair label="Top country" value="Canada · 68%" />
          </div>
        </Panel>
      </div>
      <h2 className="text-[18px] font-semibold">
        Page & event performance <Status>Illustrative attribution</Status>
      </h2>
      <div className="records-wrap">
        <table className="records-table performance-table">
          <thead>
            <tr>
              <th>PAGE / EVENT</th>
              <th>VIEWS</th>
              <th>AVG. TIME</th>
              <th>KEY ACTIVITY</th>
              <th>OUTCOME</th>
              <th>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {performance.map((r) => (
              <tr key={r[0]}>
                <td>
                  <b>{r[0]}</b>
                  <span>{r[1]}</span>
                </td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td>{r[4]}</td>
                <td>{r[5]}</td>
                <td className="gold">View report</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination text="Top 5 example pages · Requests or demos may overlap across a visitor journey" />
      </div>
      <div className="grid grid-cols-2 gap-6 max-[800px]:grid-cols-1">
        <Panel title="What visitors do" aside="Demo activity">
          <ListStats
            items={[
              ["Insight reads", "412"],
              ["Calculator scenarios viewed", "684"],
              ["Session form starts", "96"],
              ["Event registrations", "62"],
            ]}
          />
        </Panel>
        <Panel title="Top referring sites" aside="Demo">
          <ListStats
            items={[
              ["linkedin.com", "1,980"],
              ["google.com", "926"],
              ["Community partners", "484"],
              ["Other referring sites", "220"],
            ]}
          />
        </Panel>
      </div>
      <Notice title="Tracking setup is a separate step">
        Analytics provider: not configured · Meta Pixel: not connected · Consent
        and event definitions require review before any future collection.
      </Notice>
      <Footer />
    </Shell>
  )
}
function Traffic() {
  return (
    <div className="space-y-4">
      {[
        ["Organic search", "3,368 · 40%", "40%"],
        ["Direct", "2,106 · 25%", "25%"],
        ["Social", "1,684 · 20%", "20%"],
        ["Referral", "842 · 10%", "10%"],
        ["Email / other", "421 · 5%", "5%"],
      ].map((x) => (
        <div key={x[0]}>
          <p className="flex justify-between text-[12px]">
            <span>{x[0]}</span>
            <b>{x[1]}</b>
          </p>
          <div className="mt-2 h-1 bg-[#f2ead7]">
            <i className="block h-full bg-[#c9a963]" style={{ width: x[2] }} />
          </div>
        </div>
      ))}
    </div>
  )
}
function ListStats({ items }: { items: string[][] }) {
  return (
    <div className="space-y-5">
      {items.map((x) => (
        <p className="flex justify-between text-[12px]" key={x[0]}>
          <span>{x[0]}</span>
          <b>{x[1]}</b>
        </p>
      ))}
    </div>
  )
}

export function Settings({ go, onSignOut }: { go: Go; onSignOut?: () => void }) {
  const directory = useAdminDirectory()
  const [modal, setModal] = useState<"create" | "edit" | null>(null)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [confirm, setConfirm] = useState<AdminUser | null>(null)
  const [security, setSecurity] = useState<"password" | "activity" | null>(null)
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("All roles")
  const [stateFilter, setStateFilter] = useState("All states")
  const [refreshKey, setRefreshKey] = useState(0)

  // Re-read the directory after a mutation. `refresh` is stable (useCallback),
  // so depending on it directly does not loop.
  const { refresh } = directory
  useEffect(() => {
    if (refreshKey === 0) return
    void refresh()
  }, [refreshKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const rows = directory.users.filter((u) => {
    if (roleFilter !== "All roles" && u.role !== roleFilter) return false
    if (stateFilter === "Active" && u.state !== "Active") return false
    if (stateFilter === "Invited" && u.state !== "Invited") return false
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      const haystack = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  const activeCount = directory.users.filter((u) => u.state === "Active").length
  const invitedCount = directory.users.filter((u) => u.state === "Invited").length
  const deactivatedCount = directory.users.filter((u) => u.state === "Deactivated").length

  return (
    <Shell active="settings" page="Settings" go={go} onSignOut={onSignOut}>
      <Heading
        overline="A THOUGHTFUL WORKSPACE, RESPONSIBLY MANAGED"
        title="Settings"
        intro="Manage your team’s access and keep the foundations clear."
        action={
          <button className="gold-button" onClick={() => { setEditingUser(null); setModal("create") }}>
            + Create user
          </button>
        }
      />
      <Tabs
        labels={["User management", "Account & security", "Integrations"]}
      />
      <Notice title="Admin-only provisioning">
        Only administrators can create users, change roles or deactivate access.
        There is no public sign-up — every account below was created here.
      </Notice>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[21px] font-semibold">Administrative users</h2>
          <p className="mt-1 text-[12px] text-[#66757d]">
            {directory.users.length} users · {activeCount} active · {invitedCount} invited
            {deactivatedCount ? ` · ${deactivatedCount} deactivated` : ""} · Role-based access
          </p>
        </div>
        <Status>Administrator access</Status>
      </div>
      <Controls
        placeholder="Search name or email…"
        filters={["All roles", "All states"]}
        value={query}
        onSearch={setQuery}
      />
      <div className="records-wrap">
        <table className="records-table users-table">
          <thead>
            <tr>
              <th>USER</th>
              <th>ROLE</th>
              <th>ACCESS SCOPE</th>
              <th>STATE</th>
              <th>LAST ACTIVITY</th>
              <th>MANAGE</th>
            </tr>
          </thead>
          <tbody>
            {directory.loading && (
              <tr><td colSpan={6} className="text-[13px] text-[#66757d]">Loading users…</td></tr>
            )}
            {!directory.loading && directory.error && (
              <tr><td colSpan={6} className="text-[13px] text-[#8f2f24]">{directory.error}</td></tr>
            )}
            {!directory.loading && !directory.error && rows.length === 0 && (
              <tr><td colSpan={6} className="text-[13px] text-[#66757d]">No users match this search.</td></tr>
            )}
            {rows.map((u) => (
              <tr key={u.id}>
                <td>
                  <b>{u.firstName} {u.lastName}</b>
                  <span>{u.email}</span>
                </td>
                <td>{u.role}</td>
                <td>{scopeForRole(u.role)}</td>
                <td className={u.state === "Active" ? "green" : u.state === "Invited" ? "gold" : "red"}>{u.state}</td>
                <td>{u.lastActivity}</td>
                <td className="gold">
                  <div className="flex justify-end gap-2 whitespace-nowrap">
                    <button className="hover:underline" onClick={() => { setEditingUser(u); setModal("edit") }}>
                      Edit
                    </button>
                    {u.state === "Active" ? (
                      <button className="text-[#b3382c] hover:underline" onClick={() => setConfirm(u)}>
                        Deactivate
                      </button>
                    ) : u.state === "Invited" ? (
                      <button className="text-[#b3382c] hover:underline" onClick={() => setConfirm(u)}>
                        Revoke
                      </button>
                    ) : (
                      <button className="text-[#276b55] hover:underline" onClick={() => setConfirm(u)}>
                        Activate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination text={`${directory.users.length} administrative users · Connected to Supabase Auth`} />
      </div>
      <div className="grid grid-cols-2 gap-6 max-[800px]:grid-cols-1">
        <Panel title="Account & security" aside="Manage →">
          <div className="space-y-5 text-[12px]">
            <p className="text-[13px]">Your role: Administrator</p>
            <p className="text-[#66757d]">
              Use a unique password and review access regularly. Administrative
              actions should remain attributable to individual accounts.
            </p>
            <hr className="border-[#dddcd5]" />
            <button className="block text-[#876728] hover:underline" onClick={() => setSecurity("password")}>Change password →</button>
            <button className="mt-2 block text-[#876728] hover:underline" onClick={() => setSecurity("activity")}>Review sign-in activity →</button>
            <p className="text-[11px] text-[#66757d]">
              Authentication is connected to Supabase. Password changes apply
              to your account immediately.
            </p>
          </div>
        </Panel>
        <Panel title="Integration readiness" aside="Partially configured">
          <div className="space-y-5">
            {([
              ["Supabase", "Authentication & database", true],
              ["Google Calendar", "Session scheduling", false],
              ["Email service", "Client confirmations & admin notices", false],
            ] as [string, string, boolean][]).map(([name, detail, connected]) => (
              <div className="flex items-center" key={name}>
                <div className="flex-1">
                  <b className="text-[13px]">{name}</b>
                  <p className="text-[11px] text-[#66757d]">{detail}</p>
                </div>
                {connected ? <Status>Connected</Status> : <Status gray>Not connected</Status>}
              </div>
            ))}
            <p className="text-[11px] text-[#66757d]">
              Supabase Auth is live. Calendar and email are configured separately
              when those features are connected.
            </p>
          </div>
        </Panel>
      </div>
      <Footer />
      {modal && (
        <CreateUser
          close={() => setModal(null)}
          mode={modal}
          user={editingUser}
          directory={directory}
          onDone={() => { setModal(null); setEditingUser(null); setRefreshKey((k) => k + 1) }}
        />
      )}
      {confirm && (
        <ConfirmDeactivate
          user={confirm}
          close={() => setConfirm(null)}
          onDone={() => { setConfirm(null); setRefreshKey((k) => k + 1) }}
        />
      )}
      {security && (
        <SecurityModal kind={security} close={() => setSecurity(null)} />
      )}
    </Shell>
  )
}
function SecurityModal({ kind, close }: { kind: "password" | "activity"; close: () => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [sessions, setSessions] = useState<{ at: string | null; ip: string | null; agent: string | null }[]>([])
  const isPassword = kind === "password"

  // Show the real current session. Supabase does not expose a per-user session
  // list to a signed-in user, so this is the session the browser holds.
  useEffect(() => {
    if (kind !== "activity") return
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session
      setSessions(
        s ? [{ at: s.user?.last_sign_in_at ?? null, ip: null, agent: s.user?.aud ?? null }] : [],
      )
    })
  }, [kind])

  const submit = async () => {
    if (busy) return
    setError(null)
    if (next.length < 12) {
      setError("Your new password must be at least 12 characters long.")
      return
    }
    if (next !== confirm) {
      setError("The two passwords do not match.")
      return
    }
    const email = (await supabase.auth.getUser()).data.user?.email
    if (!email) {
      setError("We could not confirm your account. Please sign in again.")
      return
    }
    // Verify the current password before changing it.
    const { error: verifyError } = await supabase.auth.signInWithPassword({ email, password: current })
    if (verifyError) {
      setError("That is not your current password.")
      return
    }
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password: next })
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    setDone(true)
    window.setTimeout(close, 1400)
  }

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="security-title">
      <button className="modal-scrim" aria-label="Close modal" onClick={close} />
      <section className="create-modal">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-[#876728]">ACCOUNT &amp; SECURITY</p>
            <h2 id="security-title" className="mt-2 text-[28px] font-semibold">
              {isPassword ? "Change password" : "Sign-in activity"}
            </h2>
            <p className="mt-2 text-[13px] text-[#66757d]">
              {isPassword
                ? "Choose a strong, unique password. You will stay signed in on this device."
                : "Recent sign-ins on your administrator account."}
            </p>
          </div>
          <button onClick={close} aria-label="Close">
            <img className="size-[18px]" src={`${A}/490c7.svg`} alt="" />
          </button>
        </div>
        {error && <p className="rounded-[8px] border border-[#e6c4c0] bg-[#fdf1ef] px-4 py-3 text-[13px] text-[#8f2f24]">{error}</p>}
        {done && <p className="rounded-[8px] border border-[#cfe0d6] bg-[#f1f7f3] px-4 py-3 text-[13px] text-[#276b55]">Your password has been updated.</p>}
        <hr className="border-[#dddcd5]" />
        {isPassword ? (
          <div className="field-grid">
            <Field label="Current password *" type="password" value={current} onChange={setCurrent} />
            <Field label="New password *" type="password" value={next} onChange={setNext} />
            <Field label="Confirm new password *" type="password" value={confirm} onChange={setConfirm} />
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.length === 0 && (
              <p className="text-[13px] text-[#66757d]">No recent sign-in activity to show.</p>
            )}
            {sessions.map((row, i) => (
              <div className="flex items-start justify-between gap-4 border-b border-[#eee] pb-3" key={i}>
                <div>
                  <p className="text-[13px] font-semibold">
                    {row.at ? new Date(row.at).toLocaleString() : "This device"}
                  </p>
                  <p className="text-[11px] text-[#66757d]">
                    {row.agent ? `Session · ${row.agent}` : "Current session"}
                  </p>
                </div>
                <span className="text-[11px] text-[#276b55]">Current session</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button className="white-button" onClick={close}>Cancel</button>
          {isPassword && (
            <button className="gold-button" onClick={submit} disabled={busy}>
              {busy ? "Updating…" : "Update password"}
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
function ConfirmDeactivate({ user, close, onDone }: { user: AdminUser; close: () => void; onDone: () => void }) {
  const directory = useAdminDirectory()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState("")
  const action = user.state === "Active" ? "deactivate" : user.state === "Invited" ? "revoke" : "reactivate"
  const needsTyping = user.state === "Invited"

  const confirm = async () => {
    if (busy) return
    if (needsTyping && confirmText.trim().toLowerCase() !== "revoke") {
      setError('Type "revoke" to confirm.')
      return
    }
    setBusy(true)
    setError(null)
    const result =
      user.state === "Active"
        ? await directory.deactivateUser(user.id)
        : user.state === "Invited"
          ? await directory.deleteUser(user.id)
          : await directory.reactivateUser(user.id)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    onDone()
  }

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <button className="modal-scrim" aria-label="Close modal" onClick={close} />
      <section className="create-modal">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-[#876728]">ADMINISTRATORS ONLY</p>
            <h2 id="confirm-title" className="mt-2 text-[28px] font-semibold">
              {action === "deactivate" && `Deactivate ${user.firstName} ${user.lastName}?`}
              {action === "revoke" && `Revoke ${user.firstName} ${user.lastName}?`}
              {action === "reactivate" && `Reactivate ${user.firstName} ${user.lastName}?`}
            </h2>
            <p className="mt-2 text-[13px] text-[#66757d]">
              {action === "deactivate" &&
                "They will no longer be able to sign in until access is restored. This can be reversed at any time."}
              {action === "revoke" &&
                "This removes the account entirely. They will not be able to sign in, and the record is deleted."}
              {action === "reactivate" &&
                "They will be able to sign in again immediately with their existing password."}
            </p>
          </div>
          <button onClick={close} aria-label="Close">
            <img className="size-[18px]" src={`${A}/490c7.svg`} alt="" />
          </button>
        </div>
        {error && <p className="rounded-[8px] border border-[#e6c4c0] bg-[#fdf1ef] px-4 py-3 text-[13px] text-[#8f2f24]">{error}</p>}
        {needsTyping && (
          <label className="block">
            <span className="mb-2 block text-[12px] font-semibold">Type “revoke” to confirm</span>
            <input
              className="static-field"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="revoke"
            />
          </label>
        )}
        <hr className="border-[#dddcd5]" />
        <div className="flex justify-end gap-3">
          <button className="white-button" onClick={close}>Cancel</button>
          <button className="gold-button" onClick={confirm} disabled={busy}>
            {busy ? "Working…" : action === "deactivate" ? "Deactivate access" : action === "revoke" ? "Revoke access" : "Reactivate access"}
          </button>
        </div>
      </section>
    </div>
  )
}
/** Short, human-readable version of a directory/API error. */
function describeDirectoryError(raw: string): string {
  if (/rate limit/i.test(raw)) {
    return 'The account was created, but the invite email was rate-limited. Ask them to use “Forgot password?” on the sign-in screen, or try again shortly.'
  }
  if (/already.*registered|already been registered/i.test(raw)) {
    return 'A user with this email address has already been registered.'
  }
  if (/invalid.*email|email.*invalid/i.test(raw)) {
    return 'That email address is not valid. Supabase does not accept placeholder domains such as example.com.'
  }
  return raw || 'Something went wrong. Please try again.'
}

function CreateUser({ close, mode, user, directory, onDone }: {
  close: () => void
  mode: "create" | "edit"
  user: AdminUser | null
  directory: ReturnType<typeof useAdminDirectory>
  onDone: () => void
}) {
  const editing = mode === "edit" && user !== null
  // Only the signed-in admin may change a password. Nobody can set another
  // person's password from this modal — they use the reset link instead.
  const currentEmail = directory.currentUser?.email ?? ""
  const isSelf = editing && user!.email.toLowerCase() === currentEmail.toLowerCase()
  const [firstName, setFirstName] = useState(editing ? user!.firstName : "")
  const [lastName, setLastName] = useState(editing ? user!.lastName : "")
  const [email, setEmail] = useState(editing ? user!.email : "")
  const [role, setRole] = useState<Role>(editing ? user!.role : "Content editor")
  const [granted, setGranted] = useState<boolean[]>(
    PERMISSIONS.map((p) => (editing ? user!.permissions.includes(p.key) : role === "Administrator" ? true : ["dashboard", "insights", "monitoring"].includes(p.key))),
  )
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailNotice, setEmailNotice] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  const handleDelete = async () => {
    if (busy) return
    setError(null)
    const confirmed = window.confirm(
      `Permanently delete ${firstName} ${lastName} (${email})?\n\nThis cannot be undone.`
    )
    if (!confirmed) return
    setBusy(true)
    const result = await directory.deleteUser(user!.id)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    onDone()
  }

  const togglePermission = (index: number) =>
    setGranted((current) => current.map((v, i) => (i === index ? !v : v)))

  const submit = async () => {
    if (busy) return
    setError(null)
    setEmailNotice(null)
    if (!firstName.trim() || !lastName.trim()) {
      setError("Enter a first and last name.")
      return
    }
    if (!editing && !email.trim()) {
      setError("Enter the email address they will use to sign in.")
      return
    }
    if (isSelf && password.trim() && password.trim().length < 12) {
      setError("Your new password must be at least 12 characters long.")
      return
    }
    const permissions = PERMISSIONS.filter((_, i) => granted[i]).map((p) => p.key)

    setBusy(true)
    let result: { error: string | null }
    if (editing) {
      result = await directory.updateUser(user!.id, {
        firstName,
        lastName,
        role,
        permissions,
      })
      if (!result.error && isSelf && password.trim()) {
        result = await directory.setUserPassword(user!.id, password.trim())
      }
    } else {
      result = await directory.inviteUser({ email, firstName, lastName, role, permissions })
      // Ask Supabase to email them a link to set their own password. A rate
      // limit here must not fail the create — the account already exists.
      if (!result.error) {
        const mail = await directory.sendInviteEmail(email)
        if (mail.error) setEmailNotice(describeDirectoryError(mail.error))
      }
    }
    setBusy(false)

    if (result.error) {
      setError(result.error)
      return
    }
    setDone(editing ? "Access updated." : "Account created. They can now sign in.")
    window.setTimeout(onDone, 1200)
  }

  return (
    <div
      className="modal-layer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-user-title"
    >
      <button
        className="modal-scrim"
        aria-label="Close modal"
        onClick={close}
      />
      <section className="create-modal">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-[#876728]">
              ADMINISTRATORS ONLY
            </p>
            <h2
              id="create-user-title"
              className="mt-2 text-[28px] font-semibold"
            >
              {editing ? "Edit access" : "Create a user"}
            </h2>
            <p className="mt-2 text-[13px] text-[#66757d]">
              {editing
                ? `Update ${user!.firstName} ${user!.lastName}’s role and permissions.`
                : "Give a team member the access they need. Nothing more."}
            </p>
          </div>
          <button onClick={close} aria-label="Close">
            <img className="size-[18px]" src={`${A}/490c7.svg`} alt="" />
          </button>
        </div>
        {error && <p className="rounded-[8px] border border-[#e6c4c0] bg-[#fdf1ef] px-4 py-3 text-[13px] text-[#8f2f24]">{describeDirectoryError(error)}</p>}
        {emailNotice && <p className="rounded-[8px] border border-[#e8d9b5] bg-[#fdf8ec] px-4 py-3 text-[13px] text-[#7a5c1e]">{emailNotice}</p>}
        {done && <p className="rounded-[8px] border border-[#cfe0d6] bg-[#f1f7f3] px-4 py-3 text-[13px] text-[#276b55]">{done}</p>}
        <hr className="border-[#dddcd5]" />
        <div className="field-grid">
          <Field label="First name *" value={firstName} onChange={setFirstName} />
          <Field label="Last name *" value={lastName} onChange={setLastName} />
        </div>
        <Field
          label="Email address *"
          value={email}
          onChange={setEmail}
          hint={editing ? "The address they use to sign in." : "The address they will use to sign in."}
        />
        <label className="block">
          <span className="mb-2 block text-[12px] font-semibold">Role *</span>
          <select
            className="static-field"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <span className="mt-2 block text-[11px] leading-[1.5] text-[#66757d]">
            {scopeForRole(role)} · {role === "Administrator" ? "can manage users and settings" : "no user-management access"}
          </span>
        </label>
        <div>
          <div className="mb-3 flex justify-between">
            <h3 className="text-[14px] font-semibold">Access permissions</h3>
            <Status>Role-based</Status>
          </div>
          <div className="space-y-3">
            {PERMISSIONS.map((p, i) => (
              <button
                type="button"
                className="permission permission-toggle"
                key={p.key}
                aria-pressed={granted[i]}
                onClick={() => togglePermission(i)}
              >
                <span>{granted[i] ? "☑" : "□"}</span>
                <b>{p.label}</b>
                <p>{p.description}</p>
              </button>
            ))}
          </div>
        </div>
        {editing && isSelf && (
          <Field
            label="New password (optional)"
            type="password"
            value={password}
            onChange={setPassword}
            hint="Leave blank to keep the current password. Minimum 12 characters."
          />
        )}
        {editing && !isSelf && (
          <Notice title="Passwords are private">
            You cannot change another person’s password. They can reset it
            themselves from the sign-in screen, or you can revoke this account
            and create a new one.
          </Notice>
        )}
        {!editing && (
          <Notice title="The account is created immediately.">
            We email them a link to set their own password. If the email does not
            arrive, they can use “Forgot password?” on the sign-in screen.
          </Notice>
        )}
        {editing && !isSelf && (
          <Notice title="Danger zone">
            Deleting this user removes them from Supabase Auth permanently.
            They will lose all access immediately.
          </Notice>
        )}
        {editing && !isSelf && (
          <div className="flex justify-end gap-3 border-t border-[#dddcd5] pt-4 mt-4">
            <button
              className="white-button text-[#b3382c]"
              onClick={handleDelete}
              disabled={busy}
            >
              {busy ? 'Deleting…' : 'Delete user'}
            </button>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button className="white-button" onClick={close}>
            Cancel
          </button>
          <button className="gold-button" onClick={submit} disabled={busy}>
            {busy ? "Saving…" : editing ? "Save changes" : "Create user"}
          </button>
        </div>
      </section>
    </div>
  )
}
