import { type ReactNode, useState } from "react"
import type { Screen } from "./App"

const A = "/assets"
type Go = (screen: Screen) => void
type Active = "events" | "monitoring" | "bookings" | "settings"

function Shell({
  active,
  page,
  go,
  children,
}: {
  active: Active
  page: string
  go: Go
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
          <p>DESIGN PREVIEW</p>
          <p>Sample records only.</p>
          <p>No services connected.</p>
        </div>
        <div className="mt-auto text-[12px] leading-[2.5] text-[#b9c4c8]">
          <p>View public website ↗</p>
          <button onClick={() => go("login")}>Sign out</button>
          <p>© 2026 KSEFinServe</p>
        </div>
      </aside>
      <section className="min-w-0 flex-1">
        <header className="admin-header">
          <p className="flex-1 text-[12px] text-[#66757d]">
            Workspace&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;{page}
          </p>
          <p className="text-[11px] text-[#876728]">Demo workspace</p>
          <div className="flex items-center gap-[7px]">
            <img
              className="size-5"
              src={`${A}/9032b.svg`}
              alt="Notifications"
            />
            <b className="text-[13px] text-[#876728]">3</b>
          </div>
          <div className="h-[30px] w-px bg-[#dddcd5]" />
          <div className="text-[12px] leading-[1.6]">
            <p>Kayode Elepe</p>
            <p>Administrator ⌄</p>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </section>
    </main>
  )
}

function Heading({
  overline,
  title,
  intro,
  action,
}: {
  overline: string
  title: string
  intro: string
  action?: ReactNode
}) {
  return (
    <div>
      <p className="text-[12px] font-medium leading-[1.5] text-[#876728]">
        {overline}
      </p>
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
function Tabs({ labels }: { labels: string[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto border-b border-[#dddcd5] pb-3">
      {labels.map((x, i) => (
        <button className={i ? "tab" : "tab tab-active"} key={x}>
          {x}
        </button>
      ))}
    </div>
  )
}
function Controls({
  placeholder,
  filters,
}: {
  placeholder: string
  filters: string[]
}) {
  return (
    <div className="flex gap-3 max-[980px]:flex-wrap">
      <label className="flex h-[42px] min-w-[260px] flex-1 items-center gap-2 rounded-[7px] border border-[#dddcd5] bg-white px-3">
        <img className="size-[17px]" src={`${A}/6c1eb.svg`} alt="" />
        <input
          className="w-full text-[13px] outline-none"
          placeholder={placeholder}
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
  tall = false,
  hint,
}: {
  label: string
  value?: string
  tall?: boolean
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold">{label}</span>
      {tall ? (
        <textarea
          className="static-field min-h-[96px] resize-none"
          defaultValue={value}
        />
      ) : (
        <input className="static-field" defaultValue={value} />
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
          src={`${A}/d0f2a.png`}
          alt="People sharing a guided roundtable conversation"
        />
        <div className="flex-1">
          <p className="text-[11px] text-[#c9a963]">THE KSE PROGRAMME</p>
          <h2>Good things are gathering.</h2>
          <p>4 upcoming · 3 past · 2 drafts · 62 upcoming registrations</p>
        </div>
        <div className="w-[230px] max-[760px]:w-full">
          <p className="text-[11px]">NEXT IN THE SAMPLE SCHEDULE</p>
          <p className="mt-2 text-white">03 Nov · Wealth clarity</p>
          <p className="mt-2 text-[#c9a963]">View event →</p>
        </div>
      </section>
      <Notice title="Sample programme only">
        Public event concepts inspired this schedule. Dates, venues and
        registration counts below are illustrative, not confirmed public events.
      </Notice>
      <Tabs labels={["All events 9", "Upcoming 4", "Past 3", "Drafts 2"]} />
      <Controls
        placeholder="Search event title or programme…"
        filters={["All formats", "All dates", "America/Toronto"]}
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
            {events.map((r, i) => (
              <tr key={`${r[0]}${i}`}>
                <td>
                  <b>{r[0]}</b>
                  <span>{r[1]}</span>
                </td>
                <td className={r[2] === "Upcoming" ? "green" : "gold"}>
                  {r[2]}
                </td>
                <td>
                  {r[3]}
                  <span>{r[4]}</span>
                </td>
                <td>
                  {r[5]}
                  <span>{r[6]}</span>
                </td>
                <td>
                  {r[7]}
                  <span>{r[8]}</span>
                </td>
                <td className="gold whitespace-nowrap">
                  <button>View</button> /{" "}
                  <button onClick={() => go("event-editor")}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination text="Showing 1–7 of 9 events · Times use America/Toronto (EDT / EST)" />
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

export function EventEditor({ go, empty = false }: { go: Go, empty?: boolean }) {
  const v = (value: string) => (empty ? "" : value)
  return (
    <Shell active="events" page="Events" go={go}>
      <Heading
        overline={empty ? "← Events / NEW EVENT" : "← Events / EVT-009"}
        title={empty ? "Add event" : "The Clarity Room"}
        intro={
          empty
            ? "Create a new gathering and shape every detail with care."
            : "Edit event · A gathering imagined for you · Draft updated 19 Oct 2026"
        }
        action={
          <div className="flex gap-[10px]">
            <button className="white-button">Save draft</button>
            <button className="gold-button">Publish event</button>
          </div>
        }
      />
      <Notice
        title={
          empty
            ? "New event · Add the essentials"
            : "Draft event · Proposed details only"
        }
      >
        {empty
          ? "Start with the event details below. Nothing will be published until you decide."
          : "This public-side programme concept has no confirmed schedule. The sample date and location below are for design review."}
      </Notice>
      <div className="editor-layout">
        <div className="space-y-6">
          <Panel title="The essentials">
            <div className="space-y-5">
              <Field label="Event title *" value={v("The Clarity Room")} />
              <Field
                label="Short introduction *"
                value={v(
                  "A thoughtfully guided gathering connecting financial perspective, purposeful work and the life you want to create.",
                )}
                tall
              />
              <div className="field-grid">
                <Field label="Programme" value={v("Wealth & leadership ⌄")} />
                <Field label="Format *" value={v("In person ⌄")} />
              </div>
              <Field
                label="Host / speaker *"
                value={v("Kayode Samson Elepe, RR")}
              />
            </div>
          </Panel>
          <Panel title="Date, time & place">
            <div className="space-y-5">
              <div className="field-grid">
                <Field label="Start date *" value={v("12 Nov 2026")} />
                <Field label="End date *" value={v("12 Nov 2026")} />
              </div>
              <div className="field-grid">
                <Field label="Start time *" value={v("18:00")} />
                <Field label="End time *" value={v("20:00")} />
              </div>
              <Field
                label="Timezone *"
                value={v("America/Toronto · EST (UTC−05:00) ⌄")}
              />
              <Field
                label="Venue name *"
                value={v("Toronto roundtable venue — to be confirmed")}
              />
              <div className="field-grid">
                <Field label="City" value={v("Toronto, Ontario")} />
                <Field label="Country" value={v("Canada")} />
              </div>
              <Field
                label="Venue address"
                value={v("Not yet provided")}
                hint="Confirm a full address and accessibility information before publishing."
              />
              <Field
                label="Online attendance / meeting URL"
                value={v("Not applicable · In-person event")}
                hint="For an online or hybrid event, provide the meeting URL here. No meeting is created automatically."
              />
            </div>
          </Panel>
          <Panel title="Description & attendee information">
            <div className="editor-toolbar">
              Paragraph ⌄　 <b>B</b>　<i>I</i>　 List　Link　Quote
            </div>
            <div className="space-y-5 text-[14px] leading-[21px]">
              <p>
                {v(
                  "A space to pause, ask better questions and leave with a clearer sense of what comes next. The Clarity Room brings wealth, purposeful work and long-term thinking into one considered conversation.",
                )}
              </p>
              <h3 className="text-[17px] font-semibold">
                {empty ? "" : "What to expect"}
              </h3>
              <p>
                {v(
                  "• A guided conversation with Kayode Samson Elepe, RR · Practical reflection on your priorities and next steps · Time to ask questions and connect with others",
                )}
              </p>
              <Field
                label="Who this is for"
                value={v(
                  "Professionals, families and aspiring advisors curious about an intentional financial future.",
                )}
                tall
              />
              <Field
                label="Preparation & accessibility"
                value={v(
                  "Bring a notebook and your questions. Venue and accessibility details will be confirmed before registration opens.",
                )}
                tall
              />
            </div>
          </Panel>
        </div>
        <aside className="space-y-6">
          <Panel title="Publishing">
            <div className="space-y-5">
              <Status>Draft · Not visible</Status>
              <p className="text-[12px] text-[#66757d]">
                Event owner
                <br />
                <span className="text-[14px] text-[#081d2b]">
                  {empty ? "Not assigned" : "Nadia Cole · Content editor"}
                </span>
              </p>
              <Field label="Visibility" value={v("Public, when published ⌄")} />
              <Field label="Publish timing" value={v("After review ⌄")} />
              <Field
                label="Schedule publishing"
                value={v("29 Oct 2026 · 09:00 EDT")}
              />
              <button className="white-button w-full">Schedule event</button>
              <p className="text-[11px] text-[#66757d]">
                Publishing and scheduling are static affordances. No event will
                be created.
              </p>
            </div>
          </Panel>
          <Panel title="Event image">
            {empty ? (
              <div className="empty-image">Select event image</div>
            ) : (
              <img
                className="h-[180px] w-full rounded-[8px] object-cover"
                src={`${A}/d0f2a.png`}
                alt="People sharing a guided roundtable conversation"
              />
            )}
            <p className="mt-4 text-[12px]">
              {empty ? "No image selected" : "clarity-room.jpg · 2.1 MB"}
            </p>
            <div className="my-3">
              <Status>
                {empty ? "Image required" : "Selected · Ready to upload"}
              </Status>
            </div>
            <Field
              label="Image alt text *"
              value={v("People sharing a guided roundtable conversation")}
            />
          </Panel>
          <Panel title="Registration settings">
            <div className="space-y-5">
              <Field label="Capacity *" value={v("30 attendees")} />
              <Field label="Registration status" value={v("Not open ⌄")} />
              <Field
                label="Registration opens"
                value={v("30 Oct 2026 · 09:00 EDT")}
              />
              <Field
                label="Registration closes"
                value={v("11 Nov 2026 · 17:00 EST")}
              />
              <Field label="Attendance cost" value={v("Free · $0 CAD")} />
            </div>
          </Panel>
          <Panel title="Listing preview">
            <p className="text-[11px] text-[#876728]">GUIDED CONVERSATION</p>
            <h3 className="my-4 text-[20px] font-semibold">
              {empty ? "Your event title" : "The Clarity Room"}
            </h3>
            <p className="text-[11px] text-[#66757d]">
              {empty
                ? "Add a date and location"
                : "12 November · 18:00 EST Toronto · In person · 30 spaces"}
            </p>
          </Panel>
        </aside>
      </div>
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
          [
            `All session records · October`,
            "48",
            "Sample records · 01–20 Oct intake",
          ],
          ["Upcoming", "12", "Includes proposed / pending confirmation"],
          ["Completed", "32", "Sample manually recorded outcomes"],
          ["Cancelled", "4", "Retained for operational history"],
        ]}
      />
      <Notice title="Email & calendar setup pending">
        Client emails: not sent · Admin emails: not sent · Google Calendar: not
        connected. Sample schedules do not create calendar events.
      </Notice>
      <Tabs
        labels={[
          "All records 48",
          "Upcoming 12",
          "Completed 32",
          "Cancelled 4",
        ]}
      />
      <Controls
        placeholder="Search client, email or record reference…"
        filters={["All services", "All advisers", "October 2026"]}
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
              <th>EMAIL & CALENDAR</th>
              <th>RECORD</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((r) => (
              <tr key={r[0]}>
                <td>
                  <b>{r[0]}</b>
                  <span>{r[1]}</span>
                </td>
                <td>
                  {r[2]}
                  <span>{r[3]}</span>
                </td>
                <td>
                  {r[4]}
                  <span>{r[5]}</span>
                </td>
                <td>{r[6]}</td>
                <td
                  className={
                    r[7] === "Completed"
                      ? "green"
                      : r[7] === "Cancelled"
                        ? "red"
                        : "gold"
                  }
                >
                  {r[7]}
                </td>
                <td>
                  Emails: Not sent<span>Calendar: Not connected</span>
                </td>
                <td>
                  <button
                    className="gold whitespace-nowrap"
                    onClick={() => go("booking-detail")}
                  >
                    Details →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination text="Showing 1–8 of 48 records · 8 per page" />
      </div>
      <p className="text-[11px] text-[#66757d]">
        All session times use America/Toronto (EDT, UTC−04:00). Public form
        submissions are requests; a proposed time still requires agreement with
        the client.
      </p>
      <Footer />
    </Shell>
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
export function BookingDetail({ go }: { go: Go }) {
  return (
    <Shell active="bookings" page="Booked sessions" go={go}>
      <Heading
        overline="← Booked sessions / SES-2026-048"
        title="Amara Okafor"
        intro="Wealth planning · Share the full picture · Received 19 Oct 2026, 16:24 EDT"
        action={
          <div className="flex gap-3">
            <button className="white-button">Reschedule</button>
            <button className="white-button">Cancel session</button>
          </div>
        }
      />
      <Notice title="Upcoming · Pending client confirmation">
        A proposed time is recorded below. This is still an enquiry, not a
        confirmed appointment. No emails have been sent and no calendar event
        has been created.
      </Notice>
      <div className="detail-layout">
        <div className="space-y-6">
          <Panel title="About the client" aside="Submitted details">
            <div className="info-grid">
              <Pair label="First name" value="Amara" />
              <Pair label="Last name" value="Okafor" />
              <Pair label="Email address" value="amara.okafor@example.com" />
              <Pair
                label="Phone number (with country code)"
                value="+1 416 555 0142"
              />
              <Pair label="City" value="Toronto" />
              <Pair label="Province / state / region" value="Ontario" />
              <Pair label="Country" value="Canada" />
              <Pair label="Preferred contact method" value="Email" />
              <Pair label="How did you hear about KSE?" value="LinkedIn" />
            </div>
          </Panel>
          <Panel title="Submitted enquiry" aside="Detailed route">
            <div className="info-grid">
              <Pair label="Booking route" value="Share the full picture" />
              <Pair label="Discussion priority" value="Wealth planning" />
              <Pair
                label="What matters most right now?"
                value="Retirement planning · Growing my wealth"
              />
              <Pair
                label="What would a good outcome look like?"
                value="I’d like a clearer retirement plan and a more intentional approach to growing my savings."
              />
              <Pair
                label="Where are you in your planning?"
                value="Building on an existing plan"
              />
              <Pair
                label="When would you like to take a next step?"
                value="Within the next 3–6 months"
              />
            </div>
            <div className="mt-5">
              <Pair
                label="Relevant context · Optional"
                value="I’m balancing long-term savings with family responsibilities and would like to review my priorities."
              />
            </div>
          </Panel>
          <Panel
            title="Consent & contact permissions"
            aside="Captured 19 Oct, 16:24 EDT"
          >
            <div className="space-y-4 text-[13px]">
              <p className="flex items-center gap-3">
                <img className="size-[16px]" src={`${A}/b5a53.svg`} alt="" />
                <b>Session contact · Agreed</b>
              </p>
              <p className="pl-7 text-[12px] text-[#66757d]">
                I agree that KSEFinServe may contact me using the details
                provided to discuss and arrange this session.
              </p>
              <p className="flex items-center gap-3">
                <img className="size-[16px]" src={`${A}/3be92.svg`} alt="" />
                <b>Insights & updates by email · Not opted in</b>
              </p>
              <p className="pl-7 text-[12px] text-[#66757d]">
                I’d also like KSE insights and updates by email. Optional — I
                can unsubscribe at any time.
              </p>
            </div>
          </Panel>
          <Panel title="Internal notes" aside="Visible to authorised team only">
            <div className="rounded-[7px] bg-[#f5f3ee] p-4 text-[12px]">
              <b>Kayode Elepe · 20 Oct 2026, 09:42 EDT</b>
              <p className="mt-2">
                Review retirement and family priorities together. Proposed
                30-minute introductory conversation; confirm the time directly
                before treating this as an appointment.
              </p>
            </div>
            <div className="mt-5">
              <Field
                label="Add an internal note"
                value="Add preparation points or a follow-up reminder."
                tall
              />
            </div>
            <button className="white-button float-right mt-4">Save note</button>
          </Panel>
        </div>
        <aside className="space-y-6">
          <Panel title="Session schedule">
            <Status>Upcoming · Proposed</Status>
            <h3 className="my-5 text-[23px] font-semibold">
              Tuesday, 20 October
            </h3>
            <p className="text-[18px]">14:00–14:30</p>
            <p className="mt-3 text-[11px] text-[#66757d]">
              America/Toronto EDT · UTC−04:00 · 30 minutes
            </p>
            <hr className="my-5 border-[#dddcd5]" />
            <Pair label="Assigned adviser" value="Kayode Samson Elepe, RR" />
            <div className="mt-4">
              <Pair
                label="Session format"
                value="Online conversation · Link not yet added"
              />
            </div>
            <div className="mt-4">
              <Pair
                label="Confirmation"
                value="Awaiting agreement with client"
              />
            </div>
            <button className="white-button mt-5 w-full">
              Edit schedule & adviser
            </button>
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
          <Panel title="Activity timeline" aside="Sample history">
            <div className="timeline">
              <p>
                <img src={`${A}/0fde5.svg`} alt="" />
                <b>Preparation note added</b>
                <span>Kayode Elepe · Internal note only</span>
              </p>
              <p>
                <img src={`${A}/0fde5.svg`} alt="" />
                <b>Proposed time recorded</b>
                <span>20 Oct · Not confirmed</span>
              </p>
              <p>
                <img src={`${A}/0fde5.svg`} alt="" />
                <b>Adviser assigned</b>
                <span>Kayode Samson Elepe, RR</span>
              </p>
              <p>
                <img src={`${A}/0fde5.svg`} alt="" />
                <b>Enquiry submitted</b>
                <span>Detailed form · Contact consent agreed</span>
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

const users = [
  [
    "Kayode Elepe",
    "kayode.elepe@example.com",
    "Administrator",
    "Full workspace access",
    "Active",
    "Today, 09:42 EDT",
    "Edit access",
  ],
  [
    "Olivia Martin",
    "olivia.martin@example.com",
    "Administrator",
    "Users, security & operations",
    "Active",
    "19 Oct, 16:20 EDT",
    "Edit / Deactivate",
  ],
  [
    "Nadia Cole",
    "nadia.cole@example.com",
    "Content editor",
    "Insights & events",
    "Active",
    "Today, 09:18 EDT",
    "Edit / Deactivate",
  ],
  [
    "Ruth Adeyemi",
    "ruth.adeyemi@example.com",
    "Adviser",
    "Assigned sessions only",
    "Active",
    "19 Oct, 14:00 EDT",
    "Edit / Deactivate",
  ],
  [
    "Isaac Thompson",
    "isaac.thompson@example.com",
    "Analyst",
    "Read-only monitoring",
    "Invited",
    "Not yet signed in",
    "Edit / Revoke",
  ],
  [
    "Amina Yusuf",
    "amina.yusuf@example.com",
    "Content editor",
    "Insights & events",
    "Invited",
    "Not yet signed in",
    "Edit / Revoke",
  ],
]
export function Settings({ go }: { go: Go }) {
  const [modal, setModal] = useState(false)
  return (
    <Shell active="settings" page="Settings" go={go}>
      <Heading
        overline="A THOUGHTFUL WORKSPACE, RESPONSIBLY MANAGED"
        title="Settings"
        intro="Manage your team’s access and keep the foundations clear."
        action={
          <button className="gold-button" onClick={() => setModal(true)}>
            + Create user
          </button>
        }
      />
      <Tabs
        labels={["User management", "Account & security", "Integrations"]}
      />
      <Notice title="Admin-only provisioning">
        Only administrators can create users, change roles or deactivate access.
        There is no public sign-up. Invited and active states below are sample
        records only.
      </Notice>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[21px] font-semibold">Administrative users</h2>
          <p className="mt-1 text-[12px] text-[#66757d]">
            6 users · 4 active · 2 invited · Role-based access
          </p>
        </div>
        <Status>Administrator access</Status>
      </div>
      <Controls
        placeholder="Search name or email…"
        filters={["All roles", "All states"]}
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
            {users.map((r) => (
              <tr key={r[0]}>
                <td>
                  <b>{r[0]}</b>
                  <span>{r[1]}</span>
                </td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td className={r[4] === "Active" ? "green" : "gold"}>{r[4]}</td>
                <td>{r[5]}</td>
                <td className="gold">{r[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination text="6 sample users · Invited is a visual state; no invitations have been sent" />
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
            <p className="text-[#876728]">Change password →</p>
            <p className="text-[#876728]">Review sign-in activity →</p>
            <p className="text-[11px] text-[#66757d]">
              Authentication and security controls are not active in this visual
              preview.
            </p>
          </div>
        </Panel>
        <Panel title="Integration readiness" aside="Not configured">
          <div className="space-y-5">
            {[
              ["Supabase", "Authentication & database"],
              ["Google Calendar", "Session scheduling"],
              ["Email service", "Client confirmations & admin notices"],
            ].map((x) => (
              <div className="flex items-center" key={x[0]}>
                <div className="flex-1">
                  <b className="text-[13px]">{x[0]}</b>
                  <p className="text-[11px] text-[#66757d]">{x[1]}</p>
                </div>
                <Status gray>Not connected</Status>
              </div>
            ))}
            <p className="text-[11px] text-[#66757d]">
              No credentials entered. Setup is intentionally deferred; no
              external services are connected.
            </p>
          </div>
        </Panel>
      </div>
      <Footer />
      {modal && <CreateUser close={() => setModal(false)} />}
    </Shell>
  )
}
function CreateUser({ close }: { close: () => void }) {
  const permissions = [
    ["☑", "Dashboard", "View workspace summary"],
    ["☑", "Insights & events", "Create, edit and publish content"],
    ["☑", "Monitoring", "View demo reports"],
    ["□", "Booked sessions", "No client-record access"],
    ["□", "Settings & users", "No user-management access"],
  ]
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
              Create a user
            </h2>
            <p className="mt-2 text-[13px] text-[#66757d]">
              Give a team member the access they need. Nothing more.
            </p>
          </div>
          <button onClick={close} aria-label="Close">
            <img className="size-[18px]" src={`${A}/490c7.svg`} alt="" />
          </button>
        </div>
        <hr className="border-[#dddcd5]" />
        <div className="field-grid">
          <Field label="First name *" value="Samuel" />
          <Field label="Last name *" value="Bennett" />
        </div>
        <Field
          label="Email address *"
          value="samuel.bennett@example.com"
          hint="The address they will use to sign in."
        />
        <Field
          label="Role *"
          value="Content editor ⌄"
          hint="Other roles: Administrator, Adviser and Analyst."
        />
        <div>
          <div className="mb-3 flex justify-between">
            <h3 className="text-[14px] font-semibold">Access permissions</h3>
            <Status>Role-based</Status>
          </div>
          <div className="space-y-3">
            {permissions.map((x) => (
              <div className="permission" key={x[1]}>
                <span>{x[0]}</span>
                <b>{x[1]}</b>
                <p>{x[2]}</p>
              </div>
            ))}
          </div>
        </div>
        <Notice title="No password is exposed or assigned here.">
          Account activation will require a secure setup flow once
          authentication and email are configured.
        </Notice>
        <p className="text-[11px] text-[#66757d]">
          Design preview only. Create user does not provision an account or send
          an invitation.
        </p>
        <div className="flex justify-end gap-3">
          <button className="white-button" onClick={close}>
            Cancel
          </button>
          <button className="gold-button" onClick={close}>
            Create user
          </button>
        </div>
      </section>
    </div>
  )
}
