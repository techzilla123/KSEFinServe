import { useState, useEffect, useRef, type ReactNode } from 'react'
import { BookingDetail, Bookings, EventEditor, Events, Monitoring, Settings } from './AdminContinuity'
import { describeAuthError, supabase } from "./admin/supabaseClient"
import { useInsights, insightParagraphs, uploadInsightImage, type Insight } from "./admin/insightsDirectory"
import { useBookings } from './admin/bookingsDirectory'
import { useCareers, type CareerApplication, type CareerStatus } from "./admin/careerDirectory"
import { useContactMessages, type ContactMessage } from "./admin/contactDirectory"
import { useNotifications, notificationKindLabel, type Notification } from "./admin/notifications"
import type { AdminAuthActions } from './admin/useAdminAuth'

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

function Field({ label, value, onChange, type = 'text', icon, autoComplete }: { label: string; value: string; onChange?: (value: string) => void; type?: string; icon?: string; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold text-[#081d2b]">{label}</span>
      <span className="relative block">
        <input
          className="h-[46px] w-full rounded-[6px] border border-[#dddcd5] bg-[#fffdfa] px-[14px] text-[14px] text-[#081d2b] outline-none focus:border-[#c9a963]"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          type={type}
          autoComplete={autoComplete}
        />
        {icon && <img className="absolute right-[14px] top-1/2 size-[17px] -translate-y-1/2" src={`${A}/${icon}`} alt="" />}
      </span>
    </label>
  )
}

/** Small inline status line used by the auth forms. */
function AuthNotice({ tone, children }: { tone: 'error' | 'success' | 'info'; children: ReactNode }) {
  const tones = {
    error: 'border-[#e6c4c0] bg-[#fdf1ef] text-[#8f2f24]',
    success: 'border-[#cfe0d6] bg-[#f1f7f3] text-[#276b55]',
    info: 'border-[#e6dcc4] bg-[#f7f1e3] text-[#6b5a2c]',
  } as const
  return (
    <p className={`rounded-[8px] border px-4 py-3 text-[13px] leading-[1.5] ${tones[tone]}`}>
      {children}
    </p>
  )
}

function AuthScreen({ screen, go, auth }: { screen: 'login' | 'request' | 'password'; go: (screen: Screen) => void; auth: AdminAuthActions }) {
  const { signIn, requestPasswordReset, setNewPassword } = auth
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

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  // Clear any stale message when the user moves between the auth screens.
  useEffect(() => {
    setError(null)
    setSent(false)
    setResetDone(false)
  }, [screen])

  const submitLogin = async () => {
    if (busy) return
    setError(null)
    if (!email.trim() || !password) {
      setError('Enter your email address and password.')
      return
    }
    setBusy(true)
    const { error } = await signIn(email.trim(), password)
    setBusy(false)
    if (error) {
      setError(describeAuthError({ message: error }))
      return
    }
    go('dashboard')
  }

  const submitResetRequest = async () => {
    if (busy) return
    setError(null)
    if (!email.trim()) {
      setError('Enter the email address on your account.')
      return
    }
    setBusy(true)
    const { error } = await requestPasswordReset(email.trim())
    setBusy(false)
    if (error) {
      setError(describeAuthError({ message: error }))
      return
    }
    setSent(true)
  }

  const submitNewPassword = async () => {
    if (busy) return
    setError(null)
    if (password.length < 12) {
      setError('Your password must be at least 12 characters long.')
      return
    }
    if (password !== confirm) {
      setError('The two passwords do not match.')
      return
    }
    setBusy(true)
    const { error } = await setNewPassword(password)
    setBusy(false)
    if (error) {
      setError(describeAuthError({ message: error }))
      return
    }
    setResetDone(true)
  }

  // The reset link carries a one-time token. Hand it to Supabase as soon as the
  // page opens so the session exists by the time the user submits the form.
  useEffect(() => {
    if (screen !== 'password') return
    const url = new URL(window.location.href)
    const token = url.searchParams.get('token') ?? url.hash.match(/access_token=([^&]+)/)?.[1]
    const email = url.searchParams.get('email') ?? ''
    if (!token) return
    supabase.auth.verifyOtp({ token, type: 'recovery', email }).catch(() => {
      // The link may use the hash form instead; try that.
      const refresh = url.searchParams.get('refresh_token') ?? ''
      if (refresh) supabase.auth.setSession({ access_token: token, refresh_token: refresh }).catch(() => {})
    })
  }, [screen])

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

          {error && <div className="mb-5"><AuthNotice tone="error">{error}</AuthNotice></div>}

          {screen === 'login' && (
            <div className="space-y-[22px]">
              <Field label="Email address" value={email} onChange={setEmail} type="email" autoComplete="email" />
              <Field label="Password" value={password} onChange={setPassword} type="password" autoComplete="current-password" />
              <button className="ml-auto block text-[13px] text-[#876728]" onClick={() => go('request')}>
                Forgot password?
              </button>
              <button className="gold-button w-full" onClick={submitLogin} disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in →'}
              </button>
              <div className="h-px bg-[#dddcd5]" />
              <div className="flex gap-[10px] text-[12px] leading-[1.5] text-[#66757d]">
                <img className="size-[18px]" src={`${A}/14641.svg`} alt="" />
                <p>Accounts are created by an administrator. Contact your administrator if you need access.</p>
              </div>
              <p className="text-[11px] text-[#66757d]">Connected to Supabase Auth.</p>
            </div>
          )}

          {screen === 'request' && (
            <div className="space-y-[20px]">
              <Field label="Email address" value={email} onChange={setEmail} type="email" autoComplete="email" />
              <button className="gold-button w-full" onClick={submitResetRequest} disabled={busy}>
                {busy ? 'Sending…' : 'Send reset link'}
              </button>
              {sent && (
                <AuthNotice tone="success">
                  If an account exists for {email.trim()}, a reset link is on its way. Check your inbox and spam folder.
                </AuthNotice>
              )}
              <div className="flex gap-3 rounded-[8px] bg-[#f2ead7] p-4">
                <img className="mt-0.5 size-[18px]" src={`${A}/975db.svg`} alt="" />
                <div>
                  <p className="text-[13px] font-medium text-[#081d2b]">If an account exists, a reset link will be provided.</p>
                  <p className="mt-1 text-[12px] leading-[1.5] text-[#66757d]">
                    Check your inbox and spam folder. This message does not confirm whether an account is registered.
                  </p>
                </div>
              </div>
              <button className="white-button w-full" onClick={() => go('login')}>← Back to login</button>
            </div>
          )}

          {screen === 'password' && (
            <div className="space-y-[18px]">
              <Field label="New password" value={password} onChange={setPassword} type="password" icon="7c470.svg" autoComplete="new-password" />
              <Field label="Confirm new password" value={confirm} onChange={setConfirm} type="password" icon="7c470.svg" autoComplete="new-password" />
              <div className="space-y-[6px] text-[12px] leading-[1.5]">
                <p className="font-semibold text-[#081d2b]">Your password should include:</p>
                <p className={password.length >= 12 ? 'text-[#276b55]' : 'text-[#66757d]'}>✓ At least 12 characters</p>
                <p className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-[#276b55]' : 'text-[#66757d]'}>✓ Uppercase and lowercase letters</p>
                <p className={/\d/.test(password) && /[^A-Za-z0-9]/.test(password) ? 'text-[#276b55]' : 'text-[#66757d]'}>✓ A number and a special character</p>
                <p className="text-[#66757d]">✓ A password you haven’t used for this account</p>
              </div>
              <button className="gold-button w-full" onClick={submitNewPassword} disabled={busy}>
                {busy ? 'Saving…' : 'Reset password'}
              </button>
              {resetDone && (
                <AuthNotice tone="success">
                  Your password has been updated. You can now sign in with your new password.
                </AuthNotice>
              )}
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

function Sidebar({ active, go, onSignOut }: { active: 'dashboard' | 'insights'; go: (screen: Screen) => void; onSignOut?: () => void }) {
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
        <p>SUPABASE CONNECTED</p><p>Authentication is live.</p><p>Sample content below.</p>
      </div>
      <div className="mt-auto text-[12px] leading-[2.5] text-[#b9c4c8]">
        <a href="/" target="_blank" rel="noreferrer" className="block hover:text-white">View public website ↗</a>
        <button onClick={() => onSignOut?.()}>Sign out</button>
        <p>© 2026 KSEFinServe</p>
      </div>
    </aside>
  )
}

function AdminHeader({ page, notifications, onOpenNotifications }: { page: string; notifications: number; onOpenNotifications: () => void }) {
  return (
    <header className="admin-header">
      <p className="flex-1 text-[12px] text-[#66757d]">Workspace&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;{page}</p>
      <p className="text-[11px] text-[#876728]">Live workspace</p>
      <button
        type="button"
        onClick={onOpenNotifications}
        className="relative flex items-center gap-[7px] rounded-[6px] px-2 py-1 transition-colors hover:bg-[#f5f3ee]"
        aria-label={`Notifications (${notifications})`}
      >
        <img className="size-5" src={`${A}/9032b.svg`} alt="" />
        <span className="text-[13px] font-bold text-[#876728]">{notifications}</span>
        {notifications > 0 && <span className="absolute right-1 top-1 size-[6px] rounded-full bg-[#b3382c]" aria-hidden="true" />}
      </button>
      <div className="h-[30px] w-px bg-[#dddcd5]" />
      <div className="text-[12px] leading-[1.6] text-[#081d2b]"><p>Kayode Elepe</p><p>Administrator ⌄</p></div>
    </header>
  )
}

function AdminShell({ page, active, go, onSignOut, children }: { page: string; active: 'dashboard' | 'insights'; go: (s: Screen) => void; onSignOut?: () => void; children: ReactNode }) {
  const directory = useNotifications()
  const { items } = directory
  const [showNotifications, setShowNotifications] = useState(false)
  return (
    <main className="admin-shell">
      <Sidebar active={active} go={go} onSignOut={onSignOut} />
      <section className="min-w-0 flex-1">
        <AdminHeader page={page} notifications={items.length} onOpenNotifications={() => setShowNotifications(true)} />
        <div className="admin-content">{children}</div>
      </section>
      {showNotifications && <NotificationModal items={items} onRemove={directory.remove} onClose={() => setShowNotifications(false)} />}
    </main>
  )
}

function PageHeading({ overline, title, intro, actions, backTo, go }: { overline: string; title: string; intro: string; actions?: ReactNode; backTo?: Screen; go?: (s: Screen) => void }) {
  return (
    <div>
      {backTo && go
        ? <button className="text-[12px] font-medium leading-[1.5] text-[#876728] hover:underline" onClick={() => go(backTo)}>{overline}</button>
        : <p className="text-[12px] font-medium leading-[1.5] text-[#876728]">{overline}</p>}
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

function Panel({ title, aside, asideTo, go, children, className = '' }: { title: string; aside?: string; asideTo?: Screen; go?: (s: Screen) => void; children: ReactNode; className?: string }) {
  return (
    <section className={`card p-6 ${className}`}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#081d2b]">{title}</h2>
        {aside && (
          asideTo && go
            ? <button className="text-[12px] text-[#876728] hover:underline" onClick={() => go(asideTo)}>{aside}</button>
            : <span className="text-[12px] text-[#876728]">{aside}</span>
        )}
      </div>
      {children}
    </section>
  )
}

function Dashboard({ go, onSignOut }: { go: (s: Screen, bookingId?: string | null, eventId?: string | null, insightId?: string | null) => void; onSignOut?: () => void }) {
  const { insights } = useInsights()
  const { applications, loading: careersLoading } = useCareers()
  const { messages: contacts } = useContactMessages()
  const { bookings } = useBookings()
  const { items: notifications, remove: removeNotification } = useNotifications()
  const [showCareers, setShowCareers] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const published = insights.filter((i) => i.status === 'Published')
  const drafts = insights.filter((i) => i.status === 'Draft')
  const newCareers = applications.filter((a) => a.status === 'New')
  const upcomingBookings = bookings.filter((b) => b.status === 'Upcoming')
  const recentBookings = [...bookings].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

  // The greeting follows the admin's local time of day.
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  // The header date is real: "TUESDAY, 20 OCTOBER 2026".
  const today = new Date()
  const dateLine = today
    .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase()

  return (
    <AdminShell page="Dashboard" active="dashboard" go={go} onSignOut={onSignOut}>
      <PageHeading
        overline={dateLine}
        title="A clear view of what matters."
        intro={`${greeting}, Kayode. Here’s your workspace at a glance.`}
        actions={
                  <div className="flex gap-3">
                    <button className="white-button whitespace-nowrap relative" onClick={() => setShowCareers(true)}>
                      Enquiries
                      {(applications.length + contacts.length) > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[18px] h-5 bg-[#c9a963] text-[#081d2b] text-[10px] font-semibold rounded-full flex items-center justify-center px-1.5">
                          {applications.length + contacts.length}
                        </span>
                      )}
                    </button>
                    <button className="white-button whitespace-nowrap" onClick={() => go('bookings')}>View booked sessions</button>
                  </div>
                }
      />
      <Metrics items={[
        ['Booked sessions', String(bookings.length), `${upcomingBookings.length} upcoming · ${bookings.length} total`],
        ['Enquiries', String(applications.length + contacts.length), `${newCareers.length} careers awaiting review`],
        ['Published insights', String(published.length), `${drafts.length} draft${drafts.length === 1 ? '' : 's'} in the reading room`],
        ['Workspace activity', String(notifications.length), 'Most recent first'],
      ]} />
      <div className="grid grid-cols-[minmax(0,1fr)_404px] gap-6 max-[1100px]:grid-cols-1">
        <Panel title="A little perspective on your reach" aside="Live data">
          <div className="mb-3 flex items-baseline gap-6">
            <strong className="text-[28px]">{published.length + applications.length + bookings.length}</strong><span className="flex-1 text-[12px] text-[#66757d]">Live records · {bookings.length} booked sessions · {published.length} published insights · {applications.length} career applications</span><button className="text-[12px] text-[#876728] hover:underline" onClick={() => go('monitoring')}>View monitoring ↗</button>
          </div>
          <div className="chart">
            <div className="chart-grid"><span>600</span><i /></div><div className="chart-grid"><span>400</span><i /></div>
            <div className="chart-grid"><span>200</span><i /></div><div className="chart-grid"><span>0</span><i /></div>
            <img className="previous-line" src={`${A}/1dd10.png`} alt="" /><img className="current-line" src={`${A}/cd484.svg`} alt="" />
          </div>
          <div className="ml-11 flex justify-between text-[10px] text-[#66757d]"><span>01 Oct</span><span>05 Oct</span><span>10 Oct</span><span>15 Oct</span><span>20 Oct</span></div>
          <p className="mt-4 text-[11px]"><span>━ This period</span><span className="ml-5 text-[#876728]">┄ Previous period</span><span className="ml-5 text-[#66757d]">Monitoring stays as designed</span></p>
        </Panel>
        <Panel title="Needs your attention" aside={`${notifications.length} item${notifications.length === 1 ? '' : 's'}`}>
          {notifications.slice(0, 3).map((n) => (
            <Priority key={n.id} icon="94bb9.svg" title={n.title} detail={`${notificationKindLabel(n.kind)} · ${n.detail}`} />
          ))}
          {notifications.length === 0 && (
            <p className="text-[12px] leading-[1.5] text-[#66757d]">Nothing needs your attention right now.</p>
          )}
          <div className="my-5 h-px bg-[#dddcd5]" />
          <p className="text-[12px] leading-[1.5] text-[#66757d]">Notifications update as bookings, career applications, event interest and content changes arrive.</p>
        </Panel>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_404px] gap-6 max-[1100px]:grid-cols-1">
        <Panel title="Your next conversations" aside="Live data" asideTo="bookings" go={go}>
          <p className="mb-4 text-[11px] text-[#66757d]">Booked sessions · newest first</p>
          {recentBookings.length === 0 && (
            <p className="text-[12px] leading-[1.5] text-[#66757d]">No booked sessions yet.</p>
          )}
          {recentBookings.slice(0, 3).map((b) => (
            <Session key={b.id} values={[
              b.availableDate ? b.availableDate.toUpperCase().slice(0, 10) : '—',
              b.availableTime || 'Time to be confirmed',
              [b.firstName, b.lastName].filter(Boolean).join(' ') || b.email,
              b.topic || b.path || 'Session request',
              b.status,
            ]} />
          ))}
        </Panel>
        <Panel title="On your editorial desk" aside="Insights →" asideTo="insights" go={go}>
          {insights.length === 0 && (
            <p className="text-[12px] leading-[1.5] text-[#66757d]">No insights yet.</p>
          )}
          {insights.slice(0, 3).map((i) => (
            <div className="mb-4 flex gap-[14px] last:mb-0" key={i.id}>
              {i.imageUrl
                ? <img className="size-[54px] rounded-[6px] object-cover" src={i.imageUrl} alt="" />
                : <img className="size-[54px] rounded-[6px] object-cover" src={`${A}/b8130.png`} alt="" />}
              <div><p className="text-[13px] font-semibold">{i.title || 'Untitled'}</p><p className="mt-1 text-[11px] text-[#66757d]">{i.status} · {i.category || 'Uncategorised'} · {i.reference}</p></div>
            </div>
          ))}
        </Panel>
      </div>
      <Panel title="Recent workspace activity" aside="Live data">
        <div className="grid grid-cols-3 gap-8 text-[11px] max-[900px]:grid-cols-1">
          {notifications.slice(0, 3).map((n) => (
            <Activity key={n.id} time={n.createdAt ? new Date(n.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'} title={n.title} detail={n.detail} />
          ))}
          {notifications.length === 0 && (
            <p className="text-[12px] leading-[1.5] text-[#66757d]">No activity recorded yet.</p>
          )}
        </div>
      </Panel>
      <AdminFooter />
      {showCareers && <CareerModal onClose={() => setShowCareers(false)} />}
      {showNotifications && (
        <NotificationModal items={notifications} onRemove={removeNotification} onClose={() => setShowNotifications(false)} />
      )}
    </AdminShell>
  )
}

function Priority({ icon, title, detail }: { icon: string; title: string; detail: string }) {
  return <div className="mb-5 flex gap-3 last:mb-0"><img className="size-[18px]" src={`${A}/${icon}`} alt="" /><div className="min-w-0 flex-1"><p className="text-[13px] font-semibold">{title}</p><p className="mt-1 text-[11px] text-[#66757d]">{detail}</p></div><img className="size-[14px]" src={`${A}/85489.svg`} alt="" /></div>
}

/** Enquiries: career applications and contact messages, with a detail view. */
/**
 * The dashboard's "Enquiries" modal.
 *
 * Lists both career applications and contact-form messages in one place, with
 * a tab to switch between them. Selecting a row shows the full details of
 * what was submitted.
 */
function CareerModal({ onClose }: { onClose: () => void }) {
  const careers = useCareers()
  const contacts = useContactMessages()
  const [tab, setTab] = useState<'careers' | 'contacts'>('careers')
  const [careerId, setCareerId] = useState<string | null>(null)
  const [contactId, setContactId] = useState<string | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  const careerList = careers.applications
  const contactList = contacts.messages

  const career = careerId ? careerList.find((a) => a.id === careerId) ?? null : null
  const contact = contactId ? contactList.find((m) => m.id === contactId) ?? null : null

  const openDetail = (id: string, type: 'career' | 'contact') => {
    if (type === 'career') {
      setCareerId(id)
      setContactId(null)
    } else {
      setContactId(id)
      setCareerId(null)
    }
    setDetailModalOpen(true)
  }

  const closeDetail = () => {
    setDetailModalOpen(false)
    setCareerId(null)
    setContactId(null)
  }

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="enquiries-title">
      <button className="modal-scrim" aria-label="Close" onClick={onClose} />
      <section className="event-modal event-modal--compact career-modal">
        <button className="event-modal-close" onClick={onClose} aria-label="Close">
          <svg className="size-[16px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="#081d2b" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div className="event-modal-body">
          <h2 id="enquiries-title" className="text-[26px] font-semibold">Enquiries</h2>
          <p className="mt-2 text-[14px] text-[#66757d]">
            Career applications and contact-form messages, newest first.
          </p>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              className={tab === 'careers' ? 'tab tab-active' : 'tab'}
              onClick={() => setTab('careers')}
            >
              Careers {careerList.length}
            </button>
            <button
              type="button"
              className={tab === 'contacts' ? 'tab tab-active' : 'tab'}
              onClick={() => setTab('contacts')}
            >
              Contact form {contactList.length}
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {tab === 'careers' && (
              <>
                {careers.loading && <p className="text-[13px] text-[#66757d]">Loading applications…</p>}
                {!careers.loading && careerList.length === 0 && (
                  <p className="text-[13px] text-[#66757d]">No career applications yet.</p>
                )}
                {careerList.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => openDetail(a.id, 'career')}
                    className="flex w-full items-start gap-3 rounded-[12px] border border-[#e5e1d8] p-4 text-left transition-colors hover:border-[#c9a963] hover:bg-[#fffdfa]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold">{a.name || a.email || 'Applicant'}</p>
                      <p className="mt-1 text-[12px] text-[#66757d]">{a.email || '—'} · {a.role || 'Career interest'}</p>
                      <p className="mt-1 text-[11px] text-[#66757d]">{a.reference} · {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}</p>
                    </div>
                    <span className="shrink-0 rounded-[5px] bg-[#f2ead7] px-[9px] py-1 text-[11px] font-semibold text-[#876728]">{a.status}</span>
                  </button>
                ))}
              </>
            )}

            {tab === 'contacts' && (
              <>
                {contacts.loading && <p className="text-[13px] text-[#66757d]">Loading messages…</p>}
                {!contacts.loading && contactList.length === 0 && (
                  <p className="text-[13px] text-[#66757d]">No contact-form messages yet.</p>
                )}
                {contactList.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => openDetail(m.id, 'contact')}
                    className="flex w-full items-start gap-3 rounded-[12px] border border-[#e5e1d8] p-4 text-left transition-colors hover:border-[#c9a963] hover:bg-[#fffdfa]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold">{m.name || m.email || 'Message'}</p>
                      <p className="mt-1 text-[12px] text-[#66757d]">{m.email || '—'} · {m.subject || 'No subject'}</p>
                      <p className="mt-1 text-[11px] text-[#66757d]">{m.createdAt ? new Date(m.createdAt).toLocaleString() : '—'}</p>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>

          {detailModalOpen && career && (
            <CareerDetailModal
              application={career}
              directory={careers}
              onClose={closeDetail}
            />
          )}

          {detailModalOpen && contact && (
            <ContactDetailModal
              message={contact}
              directory={contacts}
              onClose={closeDetail}
            />
          )}
        </div>
      </section>
    </div>
  )
}

/** Full detail for one career application. */
function CareerDetail({ application: a, directory, onClose }: { application: CareerApplication; directory: ReturnType<typeof useCareers>; onClose: () => void }) {
  const [notes, setNotes] = useState(a.notes)
  const [status, setStatus] = useState<CareerStatus>(a.status)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setNotes(a.notes)
    setStatus(a.status)
  }, [a.id])

  const save = async (nextStatus: CareerStatus) => {
    if (busy) return
    setError(null)
    setBusy(true)
    const result = await directory.saveNote(a.id, notes)
    if (!result.error) {
      const statusResult = nextStatus !== a.status ? await directory.updateStatus(a.id, nextStatus) : { error: null }
      if (statusResult.error) {
        setError(statusResult.error)
        setBusy(false)
        return
      }
    } else {
      setError(result.error)
    }
    setBusy(false)
  }

  const remove = async () => {
    if (busy) return
    setBusy(true)
    const result = await directory.deleteApplication(a.id)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    onClose()
  }

  return (
    <div className="mt-6 rounded-[14px] border border-[#e5e1d8] bg-[#fffdfa] p-5">
      <button type="button" className="text-[12px] text-[#876728] hover:underline" onClick={onClose}>← Back to the list</button>
      <h3 className="mt-3 text-[20px] font-semibold">{a.name || 'Applicant'}</h3>
      <p className="mt-1 text-[12px] text-[#66757d]">{a.reference} · Applied {a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}</p>

      <dl className="mt-4 grid grid-cols-2 gap-4 text-[13px]">
        <div><dt className="text-[11px] text-[#66757d]">Email</dt><dd className="mt-1">{a.email || '—'}</dd></div>
        <div><dt className="text-[11px] text-[#66757d]">Phone</dt><dd className="mt-1">{a.phone || '—'}</dd></div>
        <div><dt className="text-[11px] text-[#66757d]">Location</dt><dd className="mt-1">{a.location || '—'}</dd></div>
        <div><dt className="text-[11px] text-[#66757d]">Preferred contact</dt><dd className="mt-1">{a.preferredContact}</dd></div>
        <div><dt className="text-[11px] text-[#66757d]">Current role or field</dt><dd className="mt-1">{a.role || '—'}</dd></div>
        <div><dt className="text-[11px] text-[#66757d]">Licences</dt><dd className="mt-1">{a.licences || '—'}</dd></div>
      </dl>

      {a.interests.length > 0 && (
        <div className="mt-4">
          <h4 className="text-[13px] font-semibold">Career interests</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {a.interests.map((i) => <span key={i} className="rounded-[6px] bg-[#f2ead7] px-[9px] py-1 text-[11px] font-semibold text-[#876728]">{i}</span>)}
          </div>
        </div>
      )}

      {a.background && (
        <div className="mt-4">
          <h4 className="text-[13px] font-semibold">Background &amp; goals</h4>
          <p className="mt-2 whitespace-pre-line text-[13px] leading-[1.7] text-[#404040]">{a.background}</p>
        </div>
      )}

      <div className="mt-4 flex gap-4 text-[12px] text-[#66757d]">
        <span>{a.consentContact ? '✓' : '✗'} Contact consent</span>
        <span>{a.consentData ? '✓' : '✗'} Data consent</span>
      </div>

      <div className="mt-5">
        <label className="block">
          <span className="mb-2 block text-[12px] font-semibold">Status</span>
          <select className="static-field" value={status} onChange={(e) => setStatus(e.target.value as CareerStatus)}>
            <option>New</option>
            <option>Reviewing</option>
            <option>Contacted</option>
            <option>Archived</option>
          </select>
        </label>
      </div>

      <div className="mt-4">
        <label className="block">
          <span className="mb-2 block text-[12px] font-semibold">Internal notes</span>
          <textarea className="static-field min-h-[90px]" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes for the team…" />
        </label>
      </div>

      {error && <p className="mt-3 rounded-[8px] border border-[#e6c4c0] bg-[#fdf1ef] px-3 py-2 text-[12px] text-[#8f2f24]">{error}</p>}

      <div className="mt-5 flex gap-3">
        <button className="gold-button flex-1" onClick={() => void save(status)} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        <button className="white-button text-[#b3382c]" onClick={() => void remove()} disabled={busy}>Delete</button>
      </div>
    </div>
  )
}

/** Full detail for one contact-form message. */
function ContactDetail({ message: m, directory, onClose }: { message: ContactMessage; directory: ReturnType<typeof useContactMessages>; onClose: () => void }) {
  const [busy, setBusy] = useState(false)

  const remove = async () => {
    if (busy) return
    setBusy(true)
    await directory.remove(m.id)
    setBusy(false)
    onClose()
  }

  return (
    <div className="mt-6 rounded-[14px] border border-[#e5e1d8] bg-[#fffdfa] p-5">
      <button type="button" className="text-[12px] text-[#876728] hover:underline" onClick={onClose}>← Back to the list</button>
      <h3 className="mt-3 text-[20px] font-semibold">{m.name || 'Message'}</h3>
      <p className="mt-1 text-[12px] text-[#66757d]">{m.createdAt ? new Date(m.createdAt).toLocaleString() : '—'}</p>

      <dl className="mt-4 grid grid-cols-2 gap-4 text-[13px]">
        <div><dt className="text-[11px] text-[#66757d]">Name</dt><dd className="mt-1">{m.name || '—'}</dd></div>
        <div><dt className="text-[11px] text-[#66757d]">Email</dt><dd className="mt-1">{m.email || '—'}</dd></div>
        <div className="col-span-2"><dt className="text-[11px] text-[#66757d]">Subject</dt><dd className="mt-1">{m.subject || '—'}</dd></div>
      </dl>

      <div className="mt-4">
        <h4 className="text-[13px] font-semibold">Message</h4>
        <p className="mt-2 whitespace-pre-line text-[13px] leading-[1.7] text-[#404040]">{m.message || '—'}</p>
      </div>

      <div className="mt-5 flex gap-3">
              <a className="gold-button flex-1 text-center" href={`mailto:${m.email}`}>Reply by email</a>
              <button className="white-button text-[#b3382c]" onClick={() => void remove()} disabled={busy}>Delete</button>
            </div>
          </div>
        )
      }

      /** Modal wrapper for CareerDetail. */
      function CareerDetailModal({ application: a, directory, onClose }: { application: CareerApplication; directory: ReturnType<typeof useCareers>; onClose: () => void }) {
        return (
          <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="career-detail-title">
            <button className="modal-scrim" aria-label="Close" onClick={onClose} />
            <section className="event-modal event-modal--compact career-modal">
              <button className="event-modal-close" onClick={onClose} aria-label="Close">
                <svg className="size-[16px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 2l12 12M14 2L2 14" stroke="#081d2b" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              <div className="event-modal-body">
                <CareerDetail application={a} directory={directory} onClose={onClose} />
              </div>
            </section>
          </div>
        )
      }

      /** Modal wrapper for ContactDetail. */
      function ContactDetailModal({ message: m, directory, onClose }: { message: ContactMessage; directory: ReturnType<typeof useContactMessages>; onClose: () => void }) {
        return (
          <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="contact-detail-title">
            <button className="modal-scrim" aria-label="Close" onClick={onClose} />
            <section className="event-modal event-modal--compact career-modal">
              <button className="event-modal-close" onClick={onClose} aria-label="Close">
                <svg className="size-[16px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 2l12 12M14 2L2 14" stroke="#081d2b" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              <div className="event-modal-body">
                <ContactDetail message={m} directory={directory} onClose={onClose} />
              </div>
            </section>
          </div>
        )
      }

      /** The bell's notification list. */
function NotificationModal({ items, onRemove, onClose }: { items: Notification[]; onRemove?: (item: Notification) => Promise<{ error: string | null }>; onClose: () => void }) {
  const [removing, setRemoving] = useState<string | null>(null)
  const [failed, setFailed] = useState<string | null>(null)

  const handleRemove = async (item: Notification) => {
    if (!onRemove) return
    setRemoving(item.id)
    setFailed(null)
    const { error } = await onRemove(item)
    if (error) setFailed(error)
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
                  <p className="text-[11px] font-semibold text-[#876728]">{notificationKindLabel(n.kind)}</p>
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
function Session({ values: x }: { values: string[] }) {
  return <div className="grid grid-cols-[120px_1fr_auto] items-center gap-4 border-t border-[#dddcd5] py-3"><div><p className="text-[11px] font-semibold text-[#876728]">{x[0]}</p><p className="text-[12px]">{x[1]}</p></div><div><p className="text-[13px] font-semibold">{x[2]}</p><p className="text-[11px] text-[#66757d]">{x[3]}</p></div><span className="rounded-[5px] bg-[#f2ead7] px-[9px] py-1 text-[11px] font-semibold text-[#876728]">{x[4]}</span></div>
}
function Activity({ time, title, detail }: { time: string; title: string; detail: string }) {
  return <div className="flex gap-3"><span className="text-[#876728]">{time}</span><div><p className="font-semibold">{title}</p><p className="mt-1 text-[#66757d]">{detail}</p></div></div>
}
function AdminFooter() {
  return <p className="text-[10px] text-[#66757d]">KSEFinServe administration · Static design preview <span className="float-right">Clarity · Growth · Impact</span></p>
}

function Insights({ go, onSignOut }: { go: (s: Screen, bookingId?: string | null, eventId?: string | null, insightId?: string | null) => void; onSignOut?: () => void }) {
  const directory = useInsights()
  const [filter, setFilter] = useState<'All' | 'Published' | 'Drafts' | 'Archived'>('All')
  const [query, setQuery] = useState('')

  const all = directory.insights
  const published = all.filter((i) => i.status === 'Published')
  const drafts = all.filter((i) => i.status === 'Draft')
  const archived = all.filter((i) => i.status === 'Archived')

  const rows = all.filter((r) => {
    if (filter === 'Published' && r.status !== 'Published') return false
    if (filter === 'Drafts' && r.status !== 'Draft') return false
    if (filter === 'Archived' && r.status !== 'Archived') return false
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      const haystack = `${r.title} ${r.description} ${r.category} ${r.author}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  const FILTERS = [
    ['All', 'All insights', all.length],
    ['Published', 'Published', published.length],
    ['Drafts', 'Drafts', drafts.length],
    ['Archived', 'Archived', archived.length],
  ] as const

  return (
    <AdminShell page="Insights" active="insights" go={go} onSignOut={onSignOut}>
      <PageHeading
        overline="THE KSE READING ROOM" title="Insights"
        intro="Fresh thinking on wealth, work and life. Keep every perspective considered."
        actions={<div className="flex gap-3"><button className="gold-button whitespace-nowrap" onClick={() => go('editor', null, null, null)}>+ New insight</button></div>}
      />
      <Metrics items={[
        ['All insights', String(all.length), 'Your editorial library'],
        ['Published', String(published.length), 'Available to readers'],
        ['Drafts', String(drafts.length), 'Not publicly visible'],
        ['Archived', String(archived.length), 'Kept for reference'],
      ]} />
      <div className="flex gap-2 border-b border-[#dddcd5] pb-3">
        {FILTERS.map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={filter === key
              ? 'rounded-[6px] bg-[#081d2b] px-3 py-[9px] text-[14px] text-white'
              : 'px-3 py-[9px] text-[14px] text-[#66757d] hover:text-[#081d2b]'}
          >
            {label} {count}
          </button>
        ))}
      </div>
      <div className="flex gap-3 max-[1000px]:flex-wrap">
        <label className="flex h-[42px] min-w-[280px] flex-1 items-center gap-[10px] rounded-[7px] border border-[#dddcd5] bg-white px-3">
          <img className="size-[17px]" src={`${A}/6c1eb.svg`} alt="" /><input className="w-full text-[13px] outline-none" placeholder="Search title, summary or author…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        {['All categories', 'All authors', 'Last updated'].map(x => <button className="filter" key={x}>{x}<img className="size-[14px]" src={`${A}/f8540.svg`} alt="" /></button>)}
      </div>
      <div className="overflow-x-auto rounded-[10px] border border-[#dddcd5] bg-white">
        <table className="insights-table">
          <thead><tr><th>INSIGHT</th><th>STATUS</th><th>CATEGORY</th><th>AUTHOR</th><th>LAST UPDATED</th><th>ACTIONS</th></tr></thead>
          <tbody>
            {directory.loading && (
              <tr><td colSpan={6} className="!text-center py-8 text-[13px] text-[#66757d]">Loading insights…</td></tr>
            )}
            {!directory.loading && directory.error && (
              <tr><td colSpan={6} className="!text-center py-8 text-[13px] text-[#8f2f24]">{directory.error}</td></tr>
            )}
            {!directory.loading && !directory.error && rows.length === 0 && (
              <tr><td colSpan={6} className="!text-center py-8 text-[13px] text-[#66757d]">No insights yet. Use “+ New insight” to write one.</td></tr>
            )}
            {rows.map((r) => <tr key={r.id}>
              <td><strong>{r.title}</strong><span>{r.description}</span></td>
              <td className={r.status === 'Published' ? '!text-[#276b55]' : '!text-[#876728]'}>{r.status}</td>
              <td>{r.category || '—'}</td><td>{r.author || '—'}</td>
              <td>{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : '—'}<span>{r.reference}</span></td>
              <td className="whitespace-nowrap text-[#876728]"><button onClick={() => go('editor', null, null, r.id)}>View</button>&nbsp; / &nbsp;<button onClick={() => go('editor', null, null, r.id)}>Edit</button></td>
            </tr>)}
          </tbody>
        </table>
        {!directory.loading && !directory.error && rows.length > 0 && (
          <div className="flex justify-between border-t border-[#dddcd5] p-[18px] text-[12px]"><span className="text-[#66757d]">Showing {rows.length} of {all.length} insights · live data</span><span>← Previous&nbsp;&nbsp;&nbsp; 1&nbsp;&nbsp;&nbsp; Next →</span></div>
        )}
      </div>
      <p className="text-[11px] text-[#66757d]">Insights marked Published appear on the public insights page.</p>
      <AdminFooter />
    </AdminShell>
  )
}

function StaticInput({ label, children, tall, value, onChange, readOnly }: { label: string; children?: ReactNode; tall?: boolean; value?: string; onChange?: (v: string) => void; readOnly?: boolean }) {
  if (onChange) {
    return (
      <label className="block">
        <span className="mb-2 block text-[12px] font-semibold">{label}</span>
        {tall ? (
          <textarea className="static-field min-h-[96px] resize-none" value={value} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} />
        ) : (
          <input className="static-field" value={value} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} />
        )}
      </label>
    )
  }
  return <label className="block"><span className="mb-2 block text-[12px] font-semibold">{label}</span><span className={`block rounded-[6px] border border-[#dddcd5] bg-[#fffdfa] px-[14px] py-3 text-[14px] leading-[1.5] ${tall ? 'min-h-[96px]' : 'min-h-[46px]'}`}>{children}</span></label>
}

function Editor({ go, onSignOut, insightId }: { go: (s: Screen, bookingId?: string | null, eventId?: string | null, insightId?: string | null) => void; onSignOut?: () => void; insightId?: string | null }) {
  const directory = useInsights()
  const editing = insightId ? directory.insights.find((i) => i.id === insightId) ?? null : null

  // The list loads asynchronously; don't initialise the form from an empty array.
  const [hydrated, setHydrated] = useState(!insightId)
  useEffect(() => {
    if (!insightId || directory.loading) return
    setHydrated(true)
  }, [insightId, directory.loading])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [author, setAuthor] = useState('')
  const [readTime, setReadTime] = useState('')
  const [color, setColor] = useState('#d4bcfa')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState<'Published' | 'Draft' | 'Archived'>('Draft')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  // Editor toolbar state: the current block style and the live textarea selection.
  const [blockType, setBlockType] = useState<'p' | 'h2' | 'h3' | 'quote'>('p')
  const contentRef = useRef<HTMLTextAreaElement | null>(null)
  const selRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 })

  /** Wrap the current selection in markdown emphasis markers. */
  const applyFormat = (kind: 'bold' | 'italic' | 'underline') => {
    const el = contentRef.current
    if (!el) return
    const markers = kind === 'bold' ? '**' : kind === 'italic' ? '*' : '_'
    // Read the live selection: onSelect does not fire for programmatic
    // setSelectionRange, so the ref alone can be stale.
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = content.slice(start, end)
    const next = content.slice(0, start) + markers + selected + markers + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + markers.length, end + markers.length)
    })
  }

  /** Prefix the current line with a markdown list/heading marker. */
  const insertLine = (prefix: string) => {
    const el = contentRef.current
    if (!el) return
    const start = el.selectionStart
    const lineStart = content.lastIndexOf('\n', Math.max(0, start - 1)) + 1
    const next = content.slice(0, lineStart) + prefix + content.slice(lineStart)
    setContent(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + prefix.length, start + prefix.length)
    })
  }

  /** Turn the selection into a markdown link. */
  const insertLink = () => {
    const el = contentRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = content.slice(start, end) || 'link text'
    const next = content.slice(0, start) + `[${selected}](https://)` + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      el.focus()
      const linkStart = start + selected.length + 3
      el.setSelectionRange(linkStart, linkStart + 8)
    })
  }

  /** Turn the current line into the chosen block style. */
  const applyBlockType = (kind: string) => {
    setBlockType(kind as typeof blockType)
    const el = contentRef.current
    if (!el) return
    const start = el.selectionStart
    const lineStart = content.lastIndexOf('\n', Math.max(0, start - 1)) + 1
    const lineEnd = content.indexOf('\n', start)
    const end = lineEnd === -1 ? content.length : lineEnd
    const line = content.slice(lineStart, end).replace(/^(#{2,3}|>)\s+/, '')
    const prefix = kind === 'h2' ? '## ' : kind === 'h3' ? '### ' : kind === 'quote' ? '> ' : ''
    const next = content.slice(0, lineStart) + prefix + line + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(lineStart + prefix.length + line.length, lineStart + prefix.length + line.length)
    })
  }

  useEffect(() => {
    if (!hydrated || !editing) return
    setTitle(editing.title)
    setDescription(editing.description)
    setContent(editing.content)
    setCategory(editing.category)
    setAuthor(editing.author)
    setReadTime(editing.readTime)
    setColor(editing.color)
    setImageUrl(editing.imageUrl)
    setImageAlt(editing.imageAlt)
    setFeatured(editing.featured)
    setStatus(editing.status)
  }, [hydrated, editing])

  const pickImage = async (file: File | null) => {
    if (!file) return
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    const result = await uploadInsightImage(file, setUploadProgress)
    setUploading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setImageUrl(result.url)
  }

  const save = async (nextStatus: 'Published' | 'Draft') => {
    if (busy) return
    setError(null)
    if (!title.trim()) {
      setError('Give the insight a title.')
      return
    }
    setBusy(true)
    const payload = {
      title, description, content, category, author, readTime, color, imageUrl, imageAlt, featured, status: nextStatus,
    }
    const result = editing
      ? await directory.updateInsight(editing.id, payload)
      : await directory.createInsight(payload)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setDone(nextStatus === 'Published' ? 'Insight published.' : 'Draft saved.')
    setStatus(nextStatus)
  }

  const remove = async () => {
    if (!editing || busy) return
    setBusy(true)
    const result = await directory.deleteInsight(editing.id)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    go('insights')
  }

  const words = content.trim() ? content.trim().split(/\s+/).length : 0
  const minutes = Math.max(1, Math.round(words / 200))

  return (
    <AdminShell page="Insights" active="insights" go={go} onSignOut={onSignOut}>
      <PageHeading
        overline={editing ? `← Insights / ${editing.reference}` : '← Insights / NEW INSIGHT'}
        title={editing ? 'Edit insight' : 'New insight'}
        intro={editing
          ? `${editing.category || 'Insight'} · Last updated ${editing.updatedAt ? new Date(editing.updatedAt).toLocaleString() : '—'}`
          : 'Write a new perspective and shape every detail with care.'}
        backTo="insights"
        go={go}
        actions={<div className="flex gap-[10px]"><button className="white-button" onClick={() => void save('Draft')} disabled={busy}>{busy ? 'Saving…' : 'Save draft'}</button><button className="gold-button" onClick={() => void save('Published')} disabled={busy}>{busy ? 'Saving…' : 'Publish insight'}</button></div>}
      />
      {error && <p className="rounded-[8px] border border-[#e6c4c0] bg-[#fdf1ef] px-4 py-3 text-[13px] text-[#8f2f24]">{error}</p>}
      {done && <p className="rounded-[8px] border border-[#cfe0d6] bg-[#f1f7f3] px-4 py-3 text-[13px] text-[#276b55]">{done}</p>}
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-6 max-[1050px]:grid-cols-1">
        <div className="space-y-6">
          <Panel title="The story" aside={status}>
            <div className="space-y-5">
              <StaticInput label="Title *" value={title} onChange={setTitle} />
              <div>
                <StaticInput label="Summary *" tall value={description} onChange={setDescription} />
                <p className="mt-2 text-[11px] text-[#66757d]">Shown on insight cards and in the article introduction. {description.length} / 200 characters</p>
              </div>
              <div className="overflow-hidden rounded-[7px] border border-[#dddcd5]">
                <div className="flex items-center gap-2 bg-[#f5f3ee] p-3 text-[12px]">
                  <select
                    className="rounded-[4px] border border-[#dddcd5] bg-white px-2 py-1 text-[12px] outline-none"
                    value={blockType}
                    onChange={(e) => applyBlockType(e.target.value)}
                    aria-label="Paragraph style"
                  >
                    <option value="p">Paragraph</option>
                    <option value="h2">Heading</option>
                    <option value="h3">Subheading</option>
                    <option value="quote">Quote</option>
                  </select>
                  <button type="button" className={toolBtn} onClick={() => applyFormat('bold')} aria-label="Bold"><b className="text-[14px]">B</b></button>
                  <button type="button" className={toolBtn} onClick={() => applyFormat('italic')} aria-label="Italic"><i className="text-[14px]">I</i></button>
                  <button type="button" className={toolBtn} onClick={() => applyFormat('underline')} aria-label="Underline"><u className="text-[14px]">U</u></button>
                  <button type="button" className={toolBtn} onClick={() => insertLine('• ')} aria-label="Bullet list"><span className="text-[13px]">≡</span></button>
                  <button type="button" className={toolBtn} onClick={() => insertLine('1. ')} aria-label="Numbered list"><span className="text-[13px]">1.</span></button>
                  <button type="button" className={toolBtn} onClick={() => insertLine('## ')} aria-label="Heading"><span className="text-[13px]">H</span></button>
                  <button type="button" className={toolBtn} onClick={() => insertLine('> ')} aria-label="Quote"><span className="text-[13px]">❝</span></button>
                  <button type="button" className={toolBtn} onClick={() => insertLine('---')} aria-label="Divider"><span className="text-[13px]">―</span></button>
                  <button type="button" className={toolBtn} onClick={insertLink} aria-label="Insert link"><span className="text-[13px]">🔗</span></button>
                </div>
                <textarea
                  ref={contentRef}
                  className="min-h-[260px] w-full resize-y bg-white p-6 text-[14px] leading-[21px] outline-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onSelect={(e) => { const t = e.currentTarget; selRef.current = { start: t.selectionStart, end: t.selectionEnd } }}
                  placeholder="Write the article. Separate paragraphs with a blank line."
                />
                <div className="flex justify-between border-t border-[#dddcd5] p-3 text-[10px] text-[#66757d]"><span>English (Canada) · {words} words · {minutes} min estimated read</span><span>{busy ? 'Saving…' : 'Changes saved to Supabase'}</span></div>
              </div>
            </div>
          </Panel>
          <Panel title="Search & sharing metadata">
            <div className="space-y-5">
              <div>
                <StaticInput label="URL slug" value={title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')} readOnly />
                <p className="mt-2 text-[11px] text-[#66757d]">/insights/{title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}</p>
              </div>
              <StaticInput label="SEO title" value={title ? `${title} | KSEFinServe` : ''} readOnly />
              <StaticInput label="Meta description" tall value={description} readOnly />
            </div>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Publishing">
            <div className="space-y-5">
              <Tag>{status}{status === 'Published' ? ' · Live' : status === 'Draft' ? ' · Not visible' : ' · Archived'}</Tag>
              <Detail label="Author"><input className="static-field" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Kayode Samson Elepe, RR" /></Detail>
              <label className="block">
                <span className="mb-2 block text-[12px] font-semibold">Status</span>
                <select className="static-field" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Archived</option>
                </select>
              </label>
              <div className="flex gap-3">
                <button className="white-button flex-1" onClick={() => void save('Draft')} disabled={busy}>Save draft</button>
                <button className="gold-button flex-1" onClick={() => void save('Published')} disabled={busy}>Publish</button>
              </div>
              {editing && (
                <button className="white-button w-full text-[#b3382c]" onClick={remove} disabled={busy}>
                  {busy ? 'Deleting…' : 'Delete insight'}
                </button>
              )}
            </div>
          </Panel>
          <Panel title="Cover image">
            {imageUrl ? (
              <img className="h-[170px] w-full rounded-[7px] object-cover" src={imageUrl} alt={imageAlt || title} />
            ) : (
              <div className="flex h-[170px] w-full items-center justify-center rounded-[7px] border border-dashed border-[#c9d1d4] text-[12px] text-[#66757d]">No cover image</div>
            )}
            <p className="mt-5 text-[12px] font-medium">{uploading ? `Uploading… ${uploadProgress}%` : imageUrl ? 'Image saved to Cloudinary' : 'No image selected'}</p>
            <div className="mt-3"><Tag>{uploading ? `Uploading ${uploadProgress}%` : imageUrl ? 'Selected · Ready' : 'Image optional'}</Tag></div>
            <label className="my-4 block">
              <span className="mb-2 block text-[12px] font-semibold">Upload cover image</span>
              <input type="file" accept="image/*" className="static-field" disabled={uploading} onChange={(e) => void pickImage(e.target.files?.[0] ?? null)} />
              <span className="mt-2 block text-[11px] leading-[1.5] text-[#66757d]">Uploads to Cloudinary. Only the link is stored.</span>
            </label>
            <StaticInput label="Alt text *" value={imageAlt} onChange={setImageAlt} />
            <label className="mt-3 flex items-center gap-3 text-[13px]">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              <span>Feature in the reading room</span>
            </label>
          </Panel>
          <Panel title="Organisation">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-[12px] font-semibold">Category *</span>
                <select className="static-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Choose a category</option>
                  {['Wealth foundations', 'Investing', 'Retirement', 'Protection', 'Life & legacy', 'Guidance', 'Connection', 'What comes next'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <StaticInput label="Reading time" value={readTime} onChange={setReadTime} />
              <label className="block">
                <span className="mb-2 block text-[12px] font-semibold">Accent colour</span>
                <input type="color" className="static-field h-[42px] cursor-pointer" value={color} onChange={(e) => setColor(e.target.value)} />
              </label>
            </div>
          </Panel>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-[#66757d]">{editing ? `${editing.reference} · Saved to Supabase` : 'New insight · Saved to Supabase'}</p>
        <div className="flex gap-3"><button className="white-button" onClick={() => go('insights')}>Cancel</button><button className="gold-button" onClick={() => void save('Draft')} disabled={busy}>Save draft</button></div>
      </div>
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
/** Shared class for the insight editor's toolbar buttons. */
const toolBtn = 'tool-btn'
function Detail({ label, children }: { label: string; children: ReactNode }) { return <div><p className="text-[12px] leading-[1.7] text-[#66757d]">{label}</p><p className="text-[14px] leading-[1.7]">{children}</p></div> }

function Preview({ go, onSignOut }: { go: (s: Screen) => void; onSignOut?: () => void }) {
  return (
    <AdminShell page="Insights" active="insights" go={go} onSignOut={onSignOut}>
      <PageHeading overline="← Back to insights / INS-024" title="Insight preview" intro="Review the reading experience before your next publishing decision." backTo="insights" go={go} actions={<button className="gold-button w-[130px]" onClick={() => go('editor')}>Edit insight</button>} />
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

export default function App({ initialScreen = 'login', bookingId, eventId, insightId, go: navigate, auth }: { initialScreen?: Screen; bookingId?: string | null; eventId?: string | null; insightId?: string | null; go?: (s: Screen, bookingId?: string | null, eventId?: string | null, insightId?: string | null) => void; auth: AdminAuthActions }) {
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const go = navigate ?? setScreen

  // When the host drives navigation from outside (a URL change), follow it.
  useEffect(() => {
    setScreen(initialScreen)
  }, [initialScreen])

  if (screen === 'login' || screen === 'request' || screen === 'password') return <AuthScreen screen={screen} go={go} auth={auth} />
  if (screen === 'dashboard') return <Dashboard go={go} onSignOut={() => auth.signOut()} />
  if (screen === 'insights') return <Insights go={go} onSignOut={() => auth.signOut()} />
  if (screen === 'editor') return <Editor go={go} onSignOut={() => auth.signOut()} insightId={insightId} />
  if (screen === 'preview') return <Preview go={go} onSignOut={() => auth.signOut()} />
  if (screen === 'events') return <Events go={go} />
  if (screen === 'event-editor') return <EventEditor go={go} eventId={eventId} />
  if (screen === 'event-new') return <EventEditor go={go} empty />
  if (screen === 'monitoring') return <Monitoring go={go} />
  if (screen === 'bookings') return <Bookings go={go} />
  if (screen === 'booking-detail') return <BookingDetail go={go} bookingId={bookingId} />
  return <Settings go={go} onSignOut={() => auth.signOut()} />
}
