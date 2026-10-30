/* Booking records for the KSEFinServe workspace.
   The public /book-now form writes here and the admin console reads from it.

   Rows are written by the anon key (the form is public) and read by the
   authenticated admin session, so both policies are in place on the table. */

import { useCallback, useEffect, useState } from 'react'
import { supabase, isConfigured } from './supabaseClient'

export interface Booking {
  id: string
  reference: string
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  province: string
  country: string
  contactMethod: string
  source: string
  route: string
  path: string
  topic: string
  priorities: string[]
  outcome: string
  context: string
  question: string
  availableDate: string
  availableTime: string
  consentContact: boolean
  consentUpdates: boolean
  status: 'Upcoming' | 'Completed' | 'Cancelled'
  adviser: string
  internalNotes: string
  createdAt: string
  updatedAt: string
}

/** What the public form sends. */
export interface BookingInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  city?: string
  province?: string
  country?: string
  contactMethod?: string
  source?: string
  route?: string
  path?: string
  topic?: string
  priorities?: string[]
  outcome?: string
  context?: string
  question?: string
  availableDate?: string
  availableTime?: string
  consentContact?: boolean
  consentUpdates?: boolean
}

/** Build a human-readable reference like SES-2026-001-AB3. */
function buildReference(index: number): string {
  const year = new Date().getFullYear()
  const sequence = String(index + 1).padStart(3, '0')
  // A random suffix keeps references unique when two people submit at once, or
  // when a retried request would otherwise collide with the sequence number.
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `SES-${year}-${sequence}-${suffix}`
}

/** Format a stored date/time the way the admin table expects. */
function formatSessionTime(date: string, time: string): string {
  if (!date && !time) return 'To be arranged'
  if (!date) return `Time ${time}`
  const parsed = new Date(`${date}T${time || '00:00'}`)
  if (Number.isNaN(parsed.getTime())) return `${date}${time ? ` · ${time}` : ''}`
  const day = parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return `${day}${time ? ` · ${time}` : ''}`
}

/** The US zone every session time is shown in. */
const US_TIME_ZONE = 'America/Chicago'

/** Short zone abbreviation for a given instant, e.g. "CDT". */
function zoneAbbreviation(instant: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: US_TIME_ZONE,
    timeZoneName: 'short',
  }).formatToParts(instant)
  const part = parts.find((p) => p.type === 'timeZoneName')
  return part?.value ?? 'CT'
}

/**
 * Render the selected slot in United States Central Time.
 *
 * The form collects a wall-clock date and time with no zone attached, so it is
 * read as a local timestamp and then converted to America/Chicago. The admin
 * always sees Central Time regardless of where the client or the admin is.
 */
export function usTimeLabel(date: string, time: string): string {
  if (!date && !time) return 'To be arranged'
  if (!date) return `Time ${time}`
  const parsed = new Date(`${date}T${time || '00:00'}`)
  if (Number.isNaN(parsed.getTime())) return `${date}${time ? ` · ${time}` : ''}`

  const day = parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: US_TIME_ZONE,
  })
  if (!time) return `${day} · Central Time`

  const clock = parsed.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: US_TIME_ZONE,
  })
  const shortDate = parsed.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: US_TIME_ZONE,
  })
  const abbr = zoneAbbreviation(parsed)

  return `${day} · ${clock} ${abbr} (${shortDate})`
}

/** Turn a database row into the shape the admin UI uses. */
function toBooking(row: Record<string, any>): Booking {
  const status = (row.status as string) ?? 'Upcoming'
  return {
    id: row.id,
    reference: row.reference,
    firstName: row.first_name ?? '',
    lastName: row.last_name ?? '',
    email: row.email ?? '',
    phone: row.phone ?? '',
    city: row.city ?? '',
    province: row.province ?? '',
    country: row.country ?? '',
    contactMethod: row.contact_method ?? 'Email',
    source: row.source ?? '',
    route: row.route ?? 'Short form',
    path: row.path ?? 'Wealth planning',
    topic: row.topic ?? '',
    priorities: row.priorities ?? [],
    outcome: row.outcome ?? '',
    context: row.context ?? '',
    question: row.question ?? '',
    availableDate: row.available_date ?? '',
    availableTime: row.available_time ?? '',
    consentContact: !!row.consent_contact,
    consentUpdates: !!row.consent_updates,
    status: status === 'Completed' || status === 'Cancelled' ? status : 'Upcoming',
    adviser: row.adviser ?? 'Kayode Samson Elepe, RR',
    internalNotes: row.internal_notes ?? '',
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  }
}

export interface BookingDirectory {
  bookings: Booking[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  /** Store a new enquiry from the public form. */
  submitBooking: (input: BookingInput) => Promise<{ error: string | null; reference?: string }>
  updateStatus: (id: string, status: Booking['status']) => Promise<{ error: string | null }>
  saveNote: (id: string, note: string) => Promise<{ error: string | null }>
  deleteBooking: (id: string) => Promise<{ error: string | null }>
}

export function useBookings(): BookingDirectory {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)
      if (err) {
        setError(err.message)
        setBookings([])
      } else {
        setBookings((data ?? []).map((r) => toBooking(r as Record<string, any>)))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load bookings.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const submitBooking = useCallback(async (input: BookingInput) => {
      // The reference is built from the current count so it stays readable.
      const { count } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
      const reference = buildReference(count ?? 0)

      const { error: err } = await supabase
        .from('bookings')
        .insert({
          reference,
          first_name: input.firstName.trim(),
          last_name: input.lastName.trim(),
          email: input.email.trim(),
          phone: input.phone.trim(),
          city: (input.city ?? '').trim(),
          province: (input.province ?? '').trim(),
          country: (input.country ?? '').trim(),
          contact_method: input.contactMethod ?? 'Email',
          source: (input.source ?? '').trim(),
          route: input.route ?? input.path ?? 'Short form',
          path: input.path ?? 'Wealth planning',
          topic: (input.topic ?? '').trim(),
          priorities: input.priorities ?? [],
          outcome: (input.outcome ?? '').trim(),
          context: (input.context ?? '').trim(),
          question: (input.question ?? '').trim(),
          available_date: (input.availableDate ?? '').trim(),
          available_time: (input.availableTime ?? '').trim(),
          consent_contact: !!input.consentContact,
          consent_updates: !!input.consentUpdates,
        })
      if (err) return { error: err.message }
      await refresh()

      // Send confirmation emails (non-blocking)
      try {
        const { sendBookingConfirmation } = await import('@/lib/email')
        await sendBookingConfirmation({
          userEmail: input.email.trim(),
          userName: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
          userPhone: input.phone ?? 'Not provided',
          bookingDate: input.availableDate ? new Date(input.availableDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'To be arranged',
          bookingTime: input.availableTime || 'To be confirmed',
          serviceType: input.path || input.topic || 'Wealth Strategy Session',
          city: input.city,
          province: input.province,
          country: input.country,
          path: input.path,
          topic: input.topic,
          priorities: input.priorities,
          outcome: input.outcome,
          context: input.context,
          question: input.question,
          consentContact: input.consentContact,
          consentUpdates: input.consentUpdates,
          contactMethod: input.contactMethod,
          source: input.source,
        })
      } catch {
        console.warn('Booking confirmation emails failed to send')
      }

      return { error: null, reference }
    }, [refresh])

  const updateStatus = useCallback(async (id: string, status: Booking['status']) => {
    const { error: err } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const saveNote = useCallback(async (id: string, note: string) => {
    const { error: err } = await supabase
      .from('bookings')
      .update({ internal_notes: note, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const deleteBooking = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('bookings').delete().eq('id', id)
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  return { bookings, loading, error, refresh, submitBooking, updateStatus, saveNote, deleteBooking }
}

/** Session time label used by the admin table. */
export function sessionTimeLabel(booking: Booking): string {
  return formatSessionTime(booking.availableDate, booking.availableTime)
}

/** Duration shown alongside the session time. */
export function sessionDuration(booking: Booking): string {
  if (booking.status === 'Completed') return 'Completed session'
  if (booking.status === 'Cancelled') return 'Cancelled'
  return 'Proposed · 30 minutes'
}
