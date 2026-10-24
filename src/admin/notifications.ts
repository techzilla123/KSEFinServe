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

export interface Notifications {
  items: Notification[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  remove: (item: Notification) => void
}

/** Dismiss one notification.
    Notifications are derived from the live tables, so dismissing one only
    drops it from this admin's list — it never deletes the underlying record.
    The dismissal is remembered in localStorage so it survives a reload. */
const DISMISSED_KEY = 'kse.admin.notifications.dismissed'

export function dismissedNotifications(): string[] {
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function dismissNotification(id: string): void {
  try {
    const current = dismissedNotifications()
    if (!current.includes(id)) {
      window.localStorage.setItem(DISMISSED_KEY, JSON.stringify([...current, id]))
    }
  } catch {
    /* storage unavailable — the dismissal simply will not persist */
  }
}

export function restoreNotifications(): void {
  try {
    window.localStorage.removeItem(DISMISSED_KEY)
  } catch {
    /* ignore */
  }
}

/** Read the most recent activity across the live tables. */
export function useNotifications(): Notifications {
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [bookings, careers, interests, insights, events] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('career_applications').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('event_interests').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('insights').select('*').order('updated_at', { ascending: false }).limit(20),
        supabase.from('events').select('*').order('updated_at', { ascending: false }).limit(20),
      ])

      const collected: Notification[] = []
      if (bookings.data) collected.push(...bookings.data.map((r) => fromBooking(r as Record<string, any>)))
      if (careers.data) collected.push(...careers.data.map((r) => fromCareer(r as Record<string, any>)))
      if (interests.data) collected.push(...interests.data.map((r) => fromInterest(r as Record<string, any>)))
      if (insights.data) collected.push(...insights.data.map((r) => fromInsight(r as Record<string, any>)))
      if (events.data) collected.push(...events.data.map((r) => fromEvent(r as Record<string, any>)))

      // Newest first, most recent 20 across every source.
      collected.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      // Dismissed notifications stay dismissed until the admin restores them.
      const dismissed = dismissedNotifications()
      setItems(collected.filter((n) => !dismissed.includes(n.id)).slice(0, 20))
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

  /** Drop one notification from this admin's list. The record stays put. */
  const remove = useCallback((item: Notification) => {
    dismissNotification(item.id)
    setItems((current) => current.filter((n) => n.id !== item.id))
  }, [])
  return { items, loading, error, refresh, remove }
}

/** Human-readable label for a notification kind. */
export function notificationKindLabel(kind: Notification['kind']): string {
  return KIND_LABEL[kind]
}
