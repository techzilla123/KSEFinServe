/* Workspace notifications.
   Derived from the live tables so the bell always reflects what is actually
   happening on the site: new session requests, new career applications, new
   event interest registrations and draft content awaiting review. */

import { useCallback, useEffect, useState } from 'react'
import { supabase, isConfigured } from './supabaseClient'

export type Notification = {
  id: string
  kind: 'booking' | 'career' | 'interest' | 'insight' | 'event'
  title: string
  detail: string
  createdAt: string
}

const KIND_LABEL: Record<Notification['kind'], string> = {
  booking: 'Booked sessions',
  career: 'Careers',
  interest: 'Events',
  insight: 'Insights',
  event: 'Events',
}

/** Turn a database row into a notification. */
function fromBooking(r: Record<string, any>): Notification {
  const name = [r.first_name, r.last_name].filter(Boolean).join(' ') || r.email || 'New enquiry'
  return {
    id: `booking-${r.id}`,
    kind: 'booking',
    title: `New session request from ${name}`,
    detail: `${r.service || 'Session'} · ${r.preferred_date || 'Date to be confirmed'}`,
    createdAt: r.created_at ?? '',
  }
}

function fromCareer(r: Record<string, any>): Notification {
  return {
    id: `career-${r.id}`,
    kind: 'career',
    title: `Career application from ${r.name || r.email || 'an applicant'}`,
    detail: `${r.role || 'Role to be confirmed'} · ${r.location || 'Location not given'}`,
    createdAt: r.created_at ?? '',
  }
}

function fromInterest(r: Record<string, any>): Notification {
  return {
    id: `interest-${r.id}`,
    kind: 'interest',
    title: `${r.name || 'Someone'} joined an interest list`,
    detail: `${r.email || 'Email not given'} · ${r.phone || 'No phone'}`,
    createdAt: r.created_at ?? '',
  }
}

function fromInsight(r: Record<string, any>): Notification {
  return {
    id: `insight-${r.id}`,
    kind: 'insight',
    title: `${r.status === 'Published' ? 'Published' : 'Draft'} insight: ${r.title || 'Untitled'}`,
    detail: `${r.category || 'Uncategorised'} · ${r.reference}`,
    createdAt: r.updated_at ?? r.created_at ?? '',
  }
}

function fromEvent(r: Record<string, any>): Notification {
  return {
    id: `event-${r.id}`,
    kind: 'event',
    title: `${r.status === 'Published' ? 'Published' : 'Draft'} event: ${r.title || 'Untitled'}`,
    detail: `${r.category || 'Uncategorised'} · ${r.status}`,
    createdAt: r.updated_at ?? r.created_at ?? '',
  }
}

function fromContact(r: Record<string, any>): Notification {
  return {
    id: `contact-${r.id}`,
    kind: 'booking', // reuse booking kind for contact forms
    title: `Contact form: ${r.name || r.email || 'New message'}`,
    detail: `${r.subject || 'No subject'} · ${r.email}`,
    createdAt: r.created_at ?? '',
  }
}

export interface Notifications {
  items: Notification[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  remove: (item: Notification) => Promise<{ error: string | null }>
}

/** Dismiss one notification.
    The dismissal is stored in the database, keyed to the signed-in admin, so it
    follows them to any device. A dismissal never deletes the underlying record —
    it only hides that notification from the admin's bell. */
const DISMISSED_TABLE = 'notification_dismissals'

/** Read the most recent activity across the live tables. */
export function useNotifications(): Notifications {
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (!isConfigured || !supabase) {
        setError('Supabase is not configured on this deployment.')
        setItems([])
        return
      }

      const [bookings, careers, interests, insights, events, contacts] = await Promise.all([
              supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(20),
              supabase.from('career_applications').select('*').order('created_at', { ascending: false }).limit(20),
              supabase.from('event_interests').select('*').order('created_at', { ascending: false }).limit(20),
              supabase.from('insights').select('*').order('updated_at', { ascending: false }).limit(20),
              supabase.from('events').select('*').order('updated_at', { ascending: false }).limit(20),
              supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(20),
            ])

      // Dismissals live in the database so they follow the admin to any device.
      // If the table has not been created yet this rejects; the notifications
      // still load, just without any dismissals applied.
      let dismissedRows: { notification_id: string }[] = []
      try {
        const { data: rows } = await supabase.from(DISMISSED_TABLE).select('notification_id')
        dismissedRows = (rows ?? []) as { notification_id: string }[]
      } catch {
        dismissedRows = []
      }

      const collected: Notification[] = []
            if (bookings.data) collected.push(...bookings.data.map((r) => fromBooking(r as Record<string, any>)))
            if (careers.data) collected.push(...careers.data.map((r) => fromCareer(r as Record<string, any>)))
            if (interests.data) collected.push(...interests.data.map((r) => fromInterest(r as Record<string, any>)))
            if (insights.data) collected.push(...insights.data.map((r) => fromInsight(r as Record<string, any>)))
            if (events.data) collected.push(...events.data.map((r) => fromEvent(r as Record<string, any>)))
            if (contacts.data) collected.push(...contacts.data.map((r) => fromContact(r as Record<string, any>)))

      // Newest first, most recent 20 across every source.
      collected.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

      // Hide anything this admin has dismissed.
      const dismissed = new Set(dismissedRows.map((r) => r.notification_id).filter(Boolean))
      setItems(collected.filter((n) => !dismissed.has(n.id)).slice(0, 20))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load notifications.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  /** Dismiss one notification by recording it against the signed-in admin. */
  const remove = useCallback(async (item: Notification) => {
    // Drop it from the list immediately so the click feels instant.
    setItems((current) => current.filter((n) => n.id !== item.id))

    if (!isConfigured || !supabase) {
      return { error: 'Supabase is not configured on this deployment.' }
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()
    const adminId = session?.user?.id
    if (!adminId) {
      // Not signed in, so there is nothing to attach the dismissal to.
      return { error: 'You are signed out. Please sign in again.' }
    }

    const { error: insertError } = await supabase
      .from(DISMISSED_TABLE)
      .upsert(
        { notification_id: item.id, admin_id: adminId },
        { onConflict: 'notification_id,admin_id', ignoreDuplicates: true },
      )

    // The table may not exist yet. Rather than putting the notification back
    // (which would look like the delete silently failed), keep it dismissed for
    // this session and say what to do.
    if (insertError) {
      const missing = /PGRST205|does not exist|Could not find the table/i.test(insertError.message)
      if (missing) {
        return {
          error:
            'Notification dismissals are not set up yet. Run the SQL in ' +
            'supabase/migrations/001_notification_dismissals.sql in the Supabase ' +
            'SQL editor, then reload.',
        }
      }
      // A real failure — put it back so the list matches the database.
      setItems((current) => (current.some((n) => n.id === item.id) ? current : [item, ...current]))
      return { error: insertError.message }
    }
    return { error: null }
  }, [])

  return { items, loading, error, refresh, remove }
}

/** Human-readable label for a notification kind. */
export function notificationKindLabel(kind: Notification['kind']): string {
  return KIND_LABEL[kind]
}
