/* Admin console entry point.
   The admin workspace is its own page with its own navigation — it does not
   use the marketing site's header or footer. */

import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import AdminApp, { type Screen } from "./AdminApp"
import { useAdminAuth } from "./admin/useAdminAuth"
import "./admin.css"

/* Map a URL path to the admin screen it should show. */
const ROUTES: Record<string, Screen> = {
  "/admin": "login",
  "/admin/auth/login": "login",
  "/admin/auth/forget": "request",
  "/admin/auth/reset": "password",
  "/admin/dashboard": "dashboard",
  "/admin/insights": "insights",
  "/admin/insights/editor": "editor",
  "/admin/insights/preview": "preview",
  "/admin/events": "events",
  "/admin/events/new": "event-new",
  "/admin/events/editor": "event-editor",
  "/admin/monitoring": "monitoring",
  "/admin/bookings": "bookings",
  "/admin/bookings/detail": "booking-detail",
  "/admin/settings": "settings",
}

function screenFromPath(path: string): Screen {
  const clean = path.replace(/\/+$/, "")
  return ROUTES[clean] ?? "login"
}

/** The booking id carried in the URL, e.g. /admin/bookings/detail?id=<uuid>. */
function bookingIdFromUrl(): string | null {
  const id = new URLSearchParams(window.location.search).get("id")
  return id && id.length > 0 ? id : null
}

/** The event id carried in the URL, e.g. /admin/events/editor?event=<uuid>. */
function eventIdFromUrl(): string | null {
  const id = new URLSearchParams(window.location.search).get("event")
  return id && id.length > 0 ? id : null
}

/** The insight id carried in the URL, e.g. /admin/insights/editor?insight=<uuid>. */
function insightIdFromUrl(): string | null {
  const id = new URLSearchParams(window.location.search).get("insight")
  return id && id.length > 0 ? id : null
}

function AdminRoot() {
  const [screen, setScreen] = useState<Screen>(() => screenFromPath(window.location.pathname))
  const { status, signIn, signOut, requestPasswordReset, setNewPassword } = useAdminAuth()

  // Keep the URL in step with the screen, and follow back/forward.
  useEffect(() => {
    const apply = () => {
      setScreen(screenFromPath(window.location.pathname))
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }
    window.addEventListener("popstate", apply)
    return () => window.removeEventListener("popstate", apply)
  }, [])

  const go = (next: Screen, bookingId?: string | null, eventId?: string | null, insightId?: string | null) => {
    setScreen(next)
    const target = Object.entries(ROUTES).find(([, s]) => s === next)?.[0] ?? "/admin"
    // Detail pages need to know which record to show.
    const params = new URLSearchParams()
    if (next === "booking-detail" && bookingId) params.set("id", bookingId)
    if (next === "event-editor" && eventId) params.set("event", eventId)
    if (next === "editor" && insightId) params.set("insight", insightId)
    const qs = params.toString()
    const url = qs ? `${target}?${qs}` : target
    if (window.location.pathname + window.location.search !== url) {
      window.history.pushState({}, "", url)
    }
    // Every navigation starts the new page at the top.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }

  // A signed-in user never sees the auth screens; a signed-out user never sees
  // the workspace. This is what makes the auth pages real rather than decorative.
  useEffect(() => {
    if (status === "signed-in" && (screen === "login" || screen === "request" || screen === "password")) {
      go("dashboard")
    }
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === "signed-out" && screen !== "login" && screen !== "request" && screen !== "password") {
      go("login")
    }
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  if (status === "loading") {
    return (
      <main className="auth-layout">
        <section className="auth-panel">
          <p className="text-[13px] text-[#66757d]">Restoring your session…</p>
        </section>
      </main>
    )
  }

  return (
    <AdminApp
      initialScreen={screen}
      bookingId={bookingIdFromUrl()}
      eventId={eventIdFromUrl()}
      insightId={insightIdFromUrl()}
      go={go}
      auth={{ signIn, signOut, requestPasswordReset, setNewPassword }}
    />
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AdminRoot />
  </React.StrictMode>,
)
