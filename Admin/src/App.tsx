import { useState, type ReactNode } from 'react'
import { BookingDetail, Bookings, EventEditor, Events, Monitoring, Settings } from './Continuity'

export type Screen =
  | 'login'
  | 'request'
  | 'password'
  | 'dashboard'
  | 'insights'
  | 'editor'
  | 'preview'
  | 'events'
  | 'event-editor'
  | 'event-new'
  | 'monitoring'
  | 'bookings'
  | 'booking-detail'
  | 'settings'

const A = '/assets'

const insights = [
  ['Where are all your assets?', 'Featured essay · 6 min read', 'Draft', 'Wealth foundations', 'Kayode Elepe', '20 Oct 2026', '09:18 EDT'],
  ['The kitchen table plan', 'Everyday conversations, clearer goals', 'Published', 'Life & legacy', 'Kayode Elepe', '18 Oct 2026', '10:00 EDT'],
  ['The rhythm of returns', 'Timing your financial goals', 'Scheduled', 'Investing', 'Nadia Cole', '19 Oct 2026', 'Publishes 23 Oct'],
  ['The craft of wealth', 'A more resilient financial future', 'Published', 'Investing', 'Kayode Elepe', '16 Oct 2026', '11:30 EDT'],
  ['The worker’s edge', 'Turning everyday income into a plan', 'Published', 'Retirement', 'Kayode Elepe', '14 Oct 2026', '14:00 EDT'],
  ['The taste of security', 'A financial plan built to last', 'Draft', 'Protection', 'Nadia Cole', '13 Oct 2026', '16:42 EDT'],
  ['The community effect', 'Relationships and long-term outlook', 'Published', 'Life & legacy', 'Kayode Elepe', '11 Oct 2026', '09:00 EDT'],
  ['The recipe for growth', 'Ingredients for long-term wealth', 'Scheduled', 'Wealth foundations', 'Nadia Cole', '10 Oct 2026', 'Publishes 26 Oct'],
]

function BrandStory() {
  return (
    <section className="brand-story">
      <img className="h-[54px] w-[144px] object-contain" src={`${A}/14b9a.png`} alt="KSE Financial Services" />
      <p className="eyebrow text-[#c9a963]">KSEFINSERVE / PRIVATE WORKSPACE</p>
      <h1 className="max-w-[520px] text-[52px] font-semibold leading-[1.1] text-white">Clarity in every conversation.</h1>
      <p className="max-w-[520px] text-[17px] leading-[1.5] text-[#b9c4c8]">
        A considered space to manage the people, perspectives and possibilities behind KSE.
      </p>
      <img className="h-[310px] w-full max-w-[460px]" src={`${A}/73a9b.svg`} alt="" />
      <p className="text-[12px] text-[#c9a963]">WEALTH&nbsp;&nbsp; / &nbsp;&nbsp;LEADERSHIP&nbsp;&nbsp; / &nbsp;&nbsp;LEGACY</p>
      <p className="text-[11px] text-[#b9c4c8]">© 2026 Kayode Samson Elepe. All rights reserved.</p>
    </section>
  )
}

function Field({ label, value, type = 'text', icon }: { label: string; value: string; type?: string; icon?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold text-[#081d2b]">{label}</span>
      <span className="relative block">
        <input
          className="h-[46px] w-full rounded-[6px] border border-[#dddcd5] bg-[#fffdfa] px-[14px] text-[14px] text-[#081d2b] outline-none focus:border-[#c9a963]"
          defaultValue={value}
          type={type}
        />
        {icon && <img className="absolute right-[14px] top-1/2 size-[17px] -translate-y-1/2" src={`${A}/${icon}`} alt="" />}
      </span>
    </label>
  )
}

function AuthScreen({ screen, go }: { screen: 'login' | 'request' | 'password'; go: (screen: Screen) => void }) {
  const content = {
    login: {
      eyebrow: 'WELCOME BACK',
      title: 'Sign in to your workspace',
      intro: 'Manage your content, sessions and team with clarity.',
    },
    request: {
      eyebrow: 'ACCOUNT RECOVERY / REQUEST LINK',
      title: 'A fresh start, securely.',
      intro: 'Enter the email associated with your admin account to request a password reset link.',
    },
    password: {
      eyebrow: 'ACCOUNT RECOVERY / NEW PASSWORD',
      title: 'Choose a new password',
      intro: 'Set a strong, unique password for your KSEFinServe workspace.',
    },
  }[screen]

  return (
    <main className="auth-layout">
      <BrandStory />
      <section className="auth-panel">
        <header className="flex w-full items-start justify-between text-[12px] text-[#66757d]">
          <span>Administration</span>
          <img className="size-[18px]" src={`${A}/af1d3.svg`} alt="" />
        </header>

        <div className="w-full">
          <div className="mb-[26px]">
            <p className="eyebrow mb-[26px] text-[#876728]">{content.eyebrow}</p>
            <h2 className="text-[38px] font-semibold leading-none text-[#081d2b]">{content.title}</h2>
            <p className="mt-3 text-[15px] leading-[1.5] text-[#66757d]">{content.intro}</p>
          </div>

          {screen === 'login' && (
            <div className="space-y-[22px]">
              <Field label="Email address" value="kayode.elepe@example.com" type="email" />
              <Field label="Password" value="password1234" type="password" />
              <button className="ml-auto block text-[13px] text-[#876728]" onClick={() => go('request')}>
                Forgot password?
              </button>
              <button className="gold-button w-full" onClick={() => go('dashboard')}>Sign in →</button>
              <div className="h-px bg-[#dddcd5]" />
              <div className="flex gap-[10px] text-[12px] leading-[1.5] text-[#66757d]">
                <img className="size-[18px]" src={`${A}/14641.svg`} alt="" />
                <p>Accounts are created by an administrator. Contact your administrator if you need access.</p>
              </div>
              <p className="text-[11px] text-[#66757d]">Static design preview · Authentication is not connected.</p>
            </div>
          )}

          {screen === 'request' && (
            <div className="space-y-[20px]">
              <Field label="Email address" value="kayode.elepe@example.com" type="email" />
              <button className="gold-button w-full" onClick={() => go('password')}>Send reset link</button>
              <div className="flex gap-3 rounded-[8px] bg-[#f2ead7] p-4">
                <img className="mt-0.5 size-[18px]" src={`${A}/975db.svg`} alt="" />
                <div>
                  <p className="text-[13px] font-medium text-[#081d2b]">If an account exists, a reset link will be provided.</p>
                  <p className="mt-1 text-[12px] leading-[1.5] text-[#66757d]">
                    Check your inbox and spam folder. This message does not confirm whether an account is registered.
                  </p>
                </div>
              </div>
              <p className="text-[12px] text-[#66757d]">Preview confirmation · No email has been sent. Email delivery is not connected.</p>
              <button className="white-button w-full" onClick={() => go('login')}>← Back to login</button>
            </div>
          )}

          {screen === 'password' && (
            <div className="space-y-[18px]">
              <Field label="New password" value="Password!2026" type="password" icon="7c470.svg" />
              <Field label="Confirm new password" value="Password!2026" type="password" icon="7c470.svg" />
              <div className="space-y-[6px] text-[12px] leading-[1.5]">
                <p className="font-semibold text-[#081d2b]">Your password should include:</p>
                <p className="text-[#276b55]">✓ At least 12 characters</p>
                <p className="text-[#276b55]">✓ Uppercase and lowercase letters</p>
                <p className="text-[#276b55]">✓ A number and a special character</p>
                <p className="text-[#276b55]">✓ A password you haven’t used for this account</p>
              </div>
              <button className="gold-button w-full">Reset password</button>
              <p className="text-[12px] leading-[1.5] text-[#66757d]">
                After resetting, return to login and sign in with your new password. This preview does not change any account.
              </p>
              <button className="white-button w-full" onClick={() => go('login')}>← Back to login</button>
            </div>
          )}
        </div>

        <footer className="flex w-full justify-between text-[11px] text-[#66757d]">
          <span>Authorised KSEFinServe team members only.</span>
          <span className="text-[#876728]">Need help?</span>
        </footer>
      </section>
    </main>
  )
}

function Sidebar({ active, go }: { active: 'dashboard' | 'insights'; go: (screen: Screen) => void }) {
  return (
    <aside className="admin-sidebar">
      <img className="h-[54px] w-[144px] object-contain" src={`${A}/14b9a.png`} alt="KSE Financial Services" />
      <div className="text-[11px] font-medium leading-[2] text-[#c9a963]">
        <p>KSEFINSERVE / ADMIN</p>
        <p>Wealth · Leadership · Legacy</p>
      </div>
      <nav className="w-full space-y-2">
        <button className={`nav-item ${active === 'dashboard' ? 'active' : ''}`} onClick={() => go('dashboard')}>Dashboard</button>
        <button className={`nav-item ${active === 'insights' ? 'active' : ''}`} onClick={() => go('insights')}>Insights</button>
        <button className="nav-item" onClick={() => go('events')}>Events</button>
        <button className="nav-item" onClick={() => go('monitoring')}>Monitoring</button>
        <button className="nav-item" onClick={() => go('bookings')}>Booked sessions</button>
        <button className="nav-item" onClick={() => go('settings')}>Settings</button>
      </nav>
      <div className="text-[11px] leading-[1.7] text-[#b9c4c8]">
        <p>DESIGN PREVIEW</p><p>Sample records only.</p><p>No services connected.</p>
      </div>
      <div className="mt-auto text-[12px] leading-[2.5] text-[#b9c4c8]">
        <p>View public website ↗</p>
        <button onClick={() => go('login')}>Sign out</button>
        <p>© 2026 KSEFinServe</p>
      </div>
    </aside>
  )
}

function AdminHeader({ page }: { page: string }) {
  return (
    <header className="admin-header">
      <p className="flex-1 text-[12px] text-[#66757d]">Workspace&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;{page}</p>
      <p className="text-[11px] text-[#876728]">Demo workspace</p>
      <div className="flex items-center gap-[7px]">
        <img className="size-5" src={`${A}/9032b.svg`} alt="Notifications" />
        <span className="text-[13px] font-bold text-[#876728]">3</span>
      </div>
      <div className="h-[30px] w-px bg-[#dddcd5]" />
      <div className="text-[12px] leading-[1.6] text-[#081d2b]"><p>Kayode Elepe</p><p>Administrator ⌄</p></div>
    </header>
  )
}

function AdminShell({ page, active, go, children }: { page: string; active: 'dashboard' | 'insights'; go: (s: Screen) => void; children: ReactNode }) {
  return (
    <main className="admin-shell">
      <Sidebar active={active} go={go} />
      <section className="min-w-0 flex-1">
        <AdminHeader page={page} />
        <div className="admin-content">{children}</div>
      </section>
    </main>
  )
}

function PageHeading({ overline, title, intro, actions }: { overline: string; title: string; intro: string; actions?: ReactNode }) {
  return (
    <div>
      <p className="text-[12px] font-medium leading-[1.5] text-[#876728]">{overline}</p>
      <div className="mt-2 flex items-center gap-6">
        <h1 className="min-w-0 flex-1 text-[32px] font-semibold leading-none text-[#081d2b]">{title}</h1>
        {actions}
      </div>
      <p className="mt-2 text-[14px] leading-[21px] text-[#66757d]">{intro}</p>
    </div>
  )
}

function Metrics({ items }: { items: string[][] }) {
  return (
    <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2">
      {items.map(([label, value, detail]) => (
        <div className="card p-[22px]" key={label}>
          <p className="text-[12px] leading-7 text-[#66757d]">{label}</p>
          <p className="text-[34px] font-semibold leading-[52px] text-[#081d2b]">{value}</p>
          <p className={`text-[11px] leading-[18px] ${detail.includes('+') || detail.includes('editorial') ? 'text-[#276b55]' : 'text-[#66757d]'}`}>{detail}</p>
        </div>
      ))}
    </div>
  )
}

function Panel({ title, aside, children, className = '' }: { title: string; aside?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`card p-6 ${className}`}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#081d2b]">{title}</h2>
        {aside && <span className="text-[12px] text-[#876728]">{aside}</span>}
      </div>
      {children}
    </section>
  )
}

function Dashboard({ go }: { go: (s: Screen) => void }) {
  return (
    <AdminShell page="Dashboard" active="dashboard" go={go}>
      <PageHeading
        overline="TUESDAY, 20 OCTOBER 2026"
        title="A clear view of what matters."
        intro="Good morning, Kayode. Here’s your workspace at a glance."
        actions={<button className="white-button w-[190px]">View booked sessions</button>}
      />
      <Metrics items={[
        ['Session requests · October', '48', '+8 vs. previous period · Demo'],
        ['Upcoming sessions', '12', '3 scheduled in the next 48 hours'],
        ['Published insights', '24', '6 drafts · 2 scheduled'],
        ['Upcoming events', '4', '2 event drafts awaiting review'],
      ]} />
      <div className="grid grid-cols-[minmax(0,1fr)_404px] gap-6 max-[1100px]:grid-cols-1">
        <Panel title="A little perspective on your reach" aside="01–20 Oct · Demo data">
          <div className="mb-3 flex items-baseline gap-6">
            <strong className="text-[28px]">8,420</strong><span className="flex-1 text-[12px] text-[#66757d]">Visitors · +12.4% vs. prior 20 days</span><span className="text-[12px] text-[#876728]">View monitoring ↗</span>
          </div>
          <div className="chart">
            <div className="chart-grid"><span>600</span><i /></div><div className="chart-grid"><span>400</span><i /></div>
            <div className="chart-grid"><span>200</span><i /></div><div className="chart-grid"><span>0</span><i /></div>
            <img className="previous-line" src={`${A}/1dd10.png`} alt="" /><img className="current-line" src={`${A}/cd484.svg`} alt="" />
          </div>
          <div className="ml-11 flex justify-between text-[10px] text-[#66757d]"><span>01 Oct</span><span>05 Oct</span><span>10 Oct</span><span>15 Oct</span><span>20 Oct</span></div>
          <p className="mt-4 text-[11px]"><span>━ This period</span><span className="ml-5 text-[#876728]">┄ Previous period</span><span className="ml-5 text-[#66757d]">Demo data</span></p>
        </Panel>
        <Panel title="Needs your attention" aside="3 items">
          <Priority icon="94bb9.svg" title="Review Amara’s session request" detail="Wealth planning · Received 19 Oct" />
          <Priority icon="e352f.svg" title="Finish your featured insight" detail="Where are all your assets? · Draft" />
          <Priority icon="172da.svg" title="Prepare delivery integrations" detail="Email and Google Calendar not connected" />
          <div className="my-5 h-px bg-[#dddcd5]" />
          <p className="text-[12px] leading-[1.5] text-[#66757d]">No automated messages or calendar entries have been created in this preview.</p>
        </Panel>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_404px] gap-6 max-[1100px]:grid-cols-1">
        <Panel title="Your next conversations" aside="View all 12 →">
          <p className="mb-4 text-[11px] text-[#66757d]">Proposed schedules · America/Toronto (EDT, UTC−04:00)</p>
          {[
            ['20 OCT', '14:00–14:30', 'Amara Okafor', 'Wealth planning', 'Pending confirmation'],
            ['21 OCT', '10:00–10:30', 'Daniel Mensah', 'Advisor opportunities', 'Upcoming'],
            ['21 OCT', '15:00–15:45', 'Priya Shah', 'Speaking & partnerships', 'Upcoming'],
          ].map(x => <Session key={x[2]} values={x} />)}
        </Panel>
        <Panel title="On your editorial desk" aside="Insights →">
          {[
            ['b8130.png', 'Where are all your assets?', 'Draft · Kayode Elepe · Today'],
            ['80031.png', 'The kitchen table plan', 'Published · 18 Oct 2026'],
            ['330b4.png', 'The rhythm of returns', 'Scheduled · 23 Oct, 09:00 EDT'],
          ].map(x => (
            <div className="mb-4 flex gap-[14px] last:mb-0" key={x[1]}>
              <img className="size-[54px] rounded-[6px] object-cover" src={`${A}/${x[0]}`} alt="" />
              <div><p className="text-[13px] font-semibold">{x[1]}</p><p className="mt-1 text-[11px] text-[#66757d]">{x[2]}</p></div>
            </div>
          ))}
        </Panel>
      </div>
      <Panel title="Recent workspace activity" aside="Sample activity">
        <div className="grid grid-cols-3 gap-8 text-[11px] max-[900px]:grid-cols-1">
          <Activity time="09:42" title="Amara’s enquiry reviewed" detail="Kayode Elepe · Booked sessions" />
          <Activity time="09:18" title="Featured essay updated" detail="Nadia Cole · Insights" />
          <Activity time="Yesterday" title="The Clarity Room draft added" detail="Nadia Cole · Events" />
        </div>
      </Panel>
      <AdminFooter />
    </AdminShell>
  )
}

function Priority({ icon, title, detail }: { icon: string; title: string; detail: string }) {
  return <div className="mb-5 flex gap-3 last:mb-0"><img className="size-[18px]" src={`${A}/${icon}`} alt="" /><div className="min-w-0 flex-1"><p className="text-[13px] font-semibold">{title}</p><p className="mt-1 text-[11px] text-[#66757d]">{detail}</p></div><img className="size-[14px]" src={`${A}/85489.svg`} alt="" /></div>
}
function Session({ values: x }: { values: string[] }) {
  return <div className="grid grid-cols-[120px_1fr_auto] items-center gap-4 border-t border-[#dddcd5] py-3"><div><p className="text-[11px] font-semibold text-[#876728]">{x[0]}</p><p className="text-[12px]">{x[1]}</p></div><div><p className="text-[13px] font-semibold">{x[2]}</p><p className="text-[11px] text-[#66757d]">{x[3]}</p></div><span className="rounded-[5px] bg-[#f2ead7] px-[9px] py-1 text-[11px] font-semibold text-[#876728]">{x[4]}</span></div>
}
function Activity({ time, title, detail }: { time: string; title: string; detail: string }) {
  return <div className="flex gap-3"><span className="text-[#876728]">{time}</span><div><p className="font-semibold">{title}</p><p className="mt-1 text-[#66757d]">{detail}</p></div></div>
}
function AdminFooter() {
  return <p className="text-[10px] text-[#66757d]">KSEFinServe administration · Static design preview <span className="float-right">Clarity · Growth · Impact</span></p>
}

function Insights({ go }: { go: (s: Screen) => void }) {
  return (
    <AdminShell page="Insights" active="insights" go={go}>
      <PageHeading
        overline="THE KSE READING ROOM" title="Insights"
        intro="Fresh thinking on wealth, work and life. Keep every perspective considered."
        actions={<div className="flex gap-3"><button className="white-button w-[160px]">↑ Upload content</button><button className="gold-button w-[138px]" onClick={() => go('editor')}>+ New insight</button></div>}
      />
      <Metrics items={[
        ['All insights', '32', 'Your editorial library'], ['Published', '24', 'Available to readers'],
        ['Drafts', '6', 'Not publicly visible'], ['Scheduled', '2', 'Next: 23 October, 09:00 EDT'],
      ]} />
      <div className="flex gap-2 border-b border-[#dddcd5] pb-3">
        <button className="rounded-[6px] bg-[#081d2b] px-3 py-[9px] text-[14px] text-white">All insights 32</button>
        {['Published 24', 'Drafts 6', 'Scheduled 2'].map(x => <button className="px-3 py-[9px] text-[14px] text-[#66757d]" key={x}>{x}</button>)}
      </div>
      <div className="flex gap-3 max-[1000px]:flex-wrap">
        <label className="flex h-[42px] min-w-[280px] flex-1 items-center gap-[10px] rounded-[7px] border border-[#dddcd5] bg-white px-3">
          <img className="size-[17px]" src={`${A}/6c1eb.svg`} alt="" /><input className="w-full text-[13px] outline-none" placeholder="Search title, summary or author…" />
        </label>
        {['All categories', 'All authors', 'Last updated'].map(x => <button className="filter" key={x}>{x}<img className="size-[14px]" src={`${A}/f8540.svg`} alt="" /></button>)}
      </div>
      <div className="overflow-x-auto rounded-[10px] border border-[#dddcd5] bg-white">
        <table className="insights-table">
          <thead><tr><th>INSIGHT</th><th>STATUS</th><th>CATEGORY</th><th>AUTHOR</th><th>LAST UPDATED</th><th>ACTIONS</th></tr></thead>
          <tbody>{insights.map((r, i) => <tr key={r[0]}>
            <td><strong>{r[0]}</strong><span>{r[1]}</span></td>
            <td className={r[2] === 'Published' ? '!text-[#276b55]' : '!text-[#876728]'}>{r[2]}</td>
            <td>{r[3]}</td><td>{r[4]}</td><td>{r[5]}<span>{r[6]}</span></td>
            <td className="whitespace-nowrap text-[#876728]"><button onClick={() => go('preview')}>View</button>&nbsp; / &nbsp;<button onClick={() => go('editor')}>Edit</button></td>
          </tr>)}</tbody>
        </table>
        <div className="flex justify-between border-t border-[#dddcd5] p-[18px] text-[12px]"><span className="text-[#66757d]">Showing 1–8 of 32 insights · 8 per page</span><span>← Previous&nbsp;&nbsp;&nbsp; 1&nbsp;&nbsp;&nbsp; 2&nbsp;&nbsp;&nbsp; Next →</span></div>
      </div>
      <p className="text-[11px] text-[#66757d]">Scheduled publishing is shown as a visual state only. No content is published by this design.</p>
      <AdminFooter />
    </AdminShell>
  )
}

function StaticInput({ label, children, tall = false }: { label: string; children: ReactNode; tall?: boolean }) {
  return <label className="block"><span className="mb-2 block text-[12px] font-semibold">{label}</span><span className={`block rounded-[6px] border border-[#dddcd5] bg-[#fffdfa] px-[14px] py-3 text-[14px] leading-[1.5] ${tall ? 'min-h-[96px]' : 'min-h-[46px]'}`}>{children}</span></label>
}

function Editor({ go }: { go: (s: Screen) => void }) {
  return (
    <AdminShell page="Insights" active="insights" go={go}>
      <PageHeading overline="← Insights / INS-024" title="Edit insight" intro="Where are all your assets? · Last edited 20 Oct 2026, 09:18 EDT by Nadia Cole"
        actions={<div className="flex gap-[10px]"><button className="white-button" onClick={() => go('preview')}>Preview</button><button className="white-button">Save draft</button><button className="gold-button">Publish insight</button></div>} />
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-6 max-[1050px]:grid-cols-1">
        <div className="space-y-6">
          <Panel title="The story" aside="Draft">
            <div className="space-y-5">
              <StaticInput label="Title *">Where are all your assets?</StaticInput>
              <div><StaticInput label="Summary *" tall>A closer look at hidden wealth and the gaps in your current portfolio.</StaticInput><p className="mt-2 text-[11px] text-[#66757d]">Shown on insight cards and in the article introduction. 76 / 200 characters</p></div>
              <div className="overflow-hidden rounded-[7px] border border-[#dddcd5]">
                <div className="flex items-center gap-5 bg-[#f5f3ee] p-3 text-[12px]">
                  <span>Paragraph ⌄</span><b className="text-[14px]">B</b><i className="text-[14px]">I</i>
                  {['b4f0d.svg','53208.svg','3e614.svg','39a94.svg','3c13a.svg','80d10.svg'].map(x => <img className="size-4" src={`${A}/${x}`} alt="" key={x} />)}
                </div>
                <ArticleCopy editor />
                <div className="flex justify-between border-t border-[#dddcd5] p-3 text-[10px] text-[#66757d]"><span>English (Canada) · 212 words · 6 min estimated read</span><span>Changes not saved</span></div>
              </div>
            </div>
          </Panel>
          <Panel title="Search & sharing metadata">
            <div className="space-y-5"><div><StaticInput label="URL slug">where-are-all-your-assets</StaticInput><p className="mt-2 text-[11px] text-[#66757d]">/insights/where-are-all-your-assets</p></div><StaticInput label="SEO title">Where are all your assets? | KSEFinServe</StaticInput><StaticInput label="Meta description" tall>Explore hidden wealth, identify portfolio gaps and start a more intentional financial conversation.</StaticInput></div>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Publishing">
            <div className="space-y-5"><Tag>Draft · Not visible</Tag><Detail label="Author">Kayode Samson Elepe, RR</Detail><StaticInput label="Publish timing">Publish now ⌄</StaticInput><div><StaticInput label="Schedule alternative">23 Oct 2026 · 09:00 EDT</StaticInput><p className="mt-2 text-[11px] text-[#66757d]">America/Toronto · Select Schedule to use this date.</p></div><button className="white-button w-full">Schedule instead</button><div className="h-px bg-[#dddcd5]" /><p className="text-[11px] leading-[1.5] text-[#66757d]">Review content, image rights and disclosures before publishing. All actions are static.</p></div>
          </Panel>
          <Panel title="Cover image">
            <img className="h-[170px] w-full rounded-[7px] object-cover" src={`${A}/b8130.png`} alt="A musician sharing a moment of creative focus" />
            <p className="mt-5 text-[12px] font-medium">assets-feature.jpg · 1.4 MB</p><div className="mt-3"><Tag>Selected · Ready to upload</Tag></div>
            <p className="my-4 text-[12px]"><span className="text-[#876728]">Replace image</span>&nbsp;&nbsp;&nbsp;<span className="text-[#66757d]">Remove</span></p>
            <StaticInput label="Alt text *">A musician sharing a moment of creative focus</StaticInput>
            <p className="mt-3 text-[10px] text-[#66757d]">JPG, PNG or WebP · 1600 × 1000 recommended · Max 10 MB. No file has been uploaded.</p>
          </Panel>
          <Panel title="Organisation"><div className="space-y-5"><StaticInput label="Category *">Wealth foundations ⌄</StaticInput><StaticInput label="Tags">Asset review, Financial clarity</StaticInput><StaticInput label="Reading time">6 minutes</StaticInput><p className="text-[12px]">☑ Feature in the reading room</p></div></Panel>
        </div>
      </div>
      <div className="flex items-center justify-between"><p className="text-[12px] text-[#66757d]">Draft INS-024 · Preview only · No content changes applied</p><div className="flex gap-3"><button className="white-button">Cancel</button><button className="gold-button">Save draft</button></div></div>
      <AdminFooter />
    </AdminShell>
  )
}

function ArticleCopy({ editor = false }: { editor?: boolean }) {
  return <article className={editor ? 'space-y-5 p-6 text-[14px] leading-[21px]' : 'article-copy'}>
    <h2>Start with the whole picture.</h2>
    <p>We often measure wealth by what appears on a statement. But a thoughtful plan begins with a wider question: what do you own, what do you owe, and what matters most to you?</p>
    <p>Your savings and investments are part of the picture. So are your skills, your capacity to earn, the protection you have in place and the people who depend on you.</p>
    <h3>Make the invisible visible</h3>
    <p>Take time to list the assets you can see and the resources you might overlook. Then consider how they work together. A portfolio is not simply a collection of accounts; it should support the life you want to build.</p>
    {editor ? <p>Begin with three questions: • What have I built, and what am I still building? • Where could a change in my circumstances leave a gap? • What would greater clarity make possible for my family?</p> :
      <div className="rounded-[8px] bg-[#f2ead7] p-[22px] text-[15px]"><b>Begin with three questions</b><p>What have I built, and what am I still building?</p><p>Where could a change in my circumstances leave a gap?</p><p>What would greater clarity make possible for my family?</p></div>}
    <p>There is no single answer for everyone. A clear inventory is a starting point for a more intentional conversation.</p>
    <hr /><p className="!text-[12px] text-[#66757d]">Educational content only. Not personalised financial advice. {editor ? '' : 'Your circumstances deserve a conversation of their own.'}</p>
  </article>
}

function Tag({ children }: { children: ReactNode }) { return <span className="inline-block rounded-[5px] bg-[#f2ead7] px-[9px] py-1 text-[11px] font-semibold text-[#876728]">{children}</span> }
function Detail({ label, children }: { label: string; children: ReactNode }) { return <div><p className="text-[12px] leading-[1.7] text-[#66757d]">{label}</p><p className="text-[14px] leading-[1.7]">{children}</p></div> }

function Preview({ go }: { go: (s: Screen) => void }) {
  return (
    <AdminShell page="Insights" active="insights" go={go}>
      <PageHeading overline="← Back to insights / INS-024" title="Insight preview" intro="Review the reading experience before your next publishing decision." actions={<button className="gold-button w-[130px]" onClick={() => go('editor')}>Edit insight</button>} />
      <div className="flex gap-3 rounded-[8px] bg-[#f2ead7] p-4"><img className="size-[18px]" src={`${A}/975db.svg`} alt="" /><div><p className="text-[13px] font-medium">Draft preview · Only visible in the admin workspace</p><p className="mt-1 text-[12px] text-[#66757d]">Where are all your assets? is not published. This is an admin reading preview, not a live public page.</p></div></div>
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-6 max-[1050px]:grid-cols-1">
        <article className="card p-9">
          <div className="flex justify-between"><p className="text-[11px] font-semibold text-[#876728]">WEALTH FOUNDATIONS / FEATURED ESSAY</p><Tag>Draft</Tag></div>
          <h1 className="mt-6 text-[42px] font-semibold leading-[1.1]">Where are all your assets?</h1>
          <p className="mt-6 text-[18px] text-[#66757d]">A closer look at hidden wealth and the gaps in your current portfolio.</p>
          <p className="mt-6 text-[12px] text-[#66757d]">By Kayode Samson Elepe, RR · 2 min read · Draft updated 20 October 2026 · Not published</p>
          <img className="mt-6 h-[290px] w-full rounded-[8px] object-cover" src={`${A}/b8130.png`} alt="A different lens on everyday wealth" />
          <p className="mt-5 text-[11px] text-[#66757d]">A different lens on everyday wealth · Illustrative cover image</p>
          <hr className="my-6 border-[#dddcd5]" /><ArticleCopy />
        </article>
        <aside className="space-y-6">
          <Panel title="Publication details">
            <div className="space-y-5"><Tag>Draft · Not publicly visible</Tag><Detail label="Author">Kayode Samson Elepe, RR</Detail><Detail label="Category">Wealth foundations</Detail><Detail label="Tags">Asset review · Financial clarity</Detail><Detail label="Featured">Yes · KSE reading room</Detail><Detail label="Last updated">20 Oct 2026 · 09:18 EDT · Nadia Cole</Detail><button className="white-button w-full" onClick={() => go('editor')}>Back to editor</button></div>
          </Panel>
          <Panel title="Before you publish"><div className="space-y-4 text-[12px]"><p>✓ Title and summary added</p><p>✓ Cover image selected</p><p>✓ Alt text provided</p><p>✓ Educational disclosure included</p><p className="text-[#876728]">○ Final editorial review pending</p><hr className="border-[#dddcd5]" /><p className="text-[11px] leading-[1.5] text-[#66757d]">The cover remains selected in the editor. No file upload or content publishing has taken place.</p></div></Panel>
          <Panel title="Search preview"><p className="text-[16px] font-semibold leading-[1.5]">Where are all your assets? | KSEFinServe</p><p className="mt-4 text-[11px] text-[#876728]">/insights/where-are-all-your-assets</p><p className="mt-4 text-[12px] leading-[1.5] text-[#66757d]">Explore hidden wealth, identify portfolio gaps and start a more intentional financial conversation.</p></Panel>
        </aside>
      </div>
      <AdminFooter />
    </AdminShell>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  if (screen === 'login' || screen === 'request' || screen === 'password') return <AuthScreen screen={screen} go={setScreen} />
  if (screen === 'dashboard') return <Dashboard go={setScreen} />
  if (screen === 'insights') return <Insights go={setScreen} />
  if (screen === 'editor') return <Editor go={setScreen} />
  if (screen === 'preview') return <Preview go={setScreen} />
  if (screen === 'events') return <Events go={setScreen} />
  if (screen === 'event-editor') return <EventEditor go={setScreen} />
  if (screen === 'event-new') return <EventEditor go={setScreen} empty />
  if (screen === 'monitoring') return <Monitoring go={setScreen} />
  if (screen === 'bookings') return <Bookings go={setScreen} />
  if (screen === 'booking-detail') return <BookingDetail go={setScreen} />
  return <Settings go={setScreen} />
}
