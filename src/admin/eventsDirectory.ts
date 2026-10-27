/* Events for the KSEFinServe workspace.
   The admin console writes these; the public /events page reads them.

   Images and videos live in Cloudinary — only the delivery URL is stored here,
   so the database stays small. */

import { useCallback, useEffect, useState } from 'react'
import { supabase, isConfigured } from './supabaseClient'

export type EventStatus = 'Published' | 'Draft' | 'Cancelled'

export interface KseEvent {
  id: string
  reference: string
  title: string
  tagline: string
  category: string
  status: EventStatus
  featured: boolean
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  timezone: string
  format: string
  venueName: string
  venueAddress: string
  city: string
  country: string
  onlineUrl: string
  host: string
  introduction: string
  description: string
  whoFor: string
  preparation: string
  howToApply: string
  capacity: string
  registered: string
  registrationStatus: string
  cost: string
  imageUrl: string
  imageAlt: string
  videoUrl: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface EventInput {
  title: string
  tagline?: string
  category?: string
  status?: EventStatus
  featured?: boolean
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  timezone?: string
  format?: string
  venueName?: string
  venueAddress?: string
  city?: string
  country?: string
  onlineUrl?: string
  host?: string
  introduction?: string
  description?: string
  whoFor?: string
  preparation?: string
  howToApply?: string
  capacity?: string
  registered?: string
  registrationStatus?: string
  cost?: string
  imageUrl?: string
  imageAlt?: string
  videoUrl?: string
  sortOrder?: number
}

/** Cloudinary cloud — the browser uploads straight to this. */
export const CLOUDINARY_CLOUD_NAME = 'dr1udeaev'
/**
 * Unsigned upload preset created in the Cloudinary console.
 *
 * `ml_default` is the account's built-in preset and has "Allow unsigned uploads"
 * enabled. The auto-generated `default_media_library_upload_preset_*` preset does
 * not, and rejects browser uploads with "must be whitelisted for unsigned
 * uploads" until that toggle is switched on.
 */
export const CLOUDINARY_UPLOAD_PRESET = 'ml_default'
/** Everything the site uploads lives under this folder. */
export const CLOUDINARY_FOLDER = 'ksefinserve/events'

/** Build a readable reference like EVT-2026-001-X7K. */
function buildReference(index: number): string {
  const year = new Date().getFullYear()
  const sequence = String(index + 1).padStart(3, '0')
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `EVT-${year}-${sequence}-${suffix}`
}

/** Turn a database row into the shape the UI uses. */
function toEvent(row: Record<string, any>): KseEvent {
  const status = (row.status as string) ?? 'Draft'
  return {
    id: row.id,
    reference: row.reference,
    title: row.title ?? '',
    tagline: row.tagline ?? '',
    category: row.category ?? '',
    status: status === 'Published' || status === 'Cancelled' ? status : 'Draft',
    featured: !!row.featured,
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    startTime: row.start_time ?? '',
    endTime: row.end_time ?? '',
    timezone: row.timezone ?? 'America/Chicago',
    format: row.format ?? 'In person',
    venueName: row.venue_name ?? '',
    venueAddress: row.venue_address ?? '',
    city: row.city ?? '',
    country: row.country ?? '',
    onlineUrl: row.online_url ?? '',
    host: row.host ?? '',
    introduction: row.introduction ?? '',
    description: row.description ?? '',
    whoFor: row.who_for ?? '',
    preparation: row.preparation ?? '',
    howToApply: row.how_to_apply ?? '',
    capacity: row.capacity ?? '',
    registered: row.registered ?? '',
    registrationStatus: row.registration_status ?? 'Not open',
    cost: row.cost ?? '',
    imageUrl: row.image_url ?? '',
    imageAlt: row.image_alt ?? '',
    videoUrl: row.video_url ?? '',
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  }
}

/** Format a stored date/time for display. */
export function eventWhen(e: KseEvent): string {
  if (!e.startDate) return 'Dates to be announced'
  const start = new Date(`${e.startDate}T${e.startTime || '00:00'}`)
  const day = Number.isNaN(start.getTime())
    ? e.startDate
    : start.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  if (!e.startTime) return day
  const clock = e.endTime ? `${e.startTime}–${e.endTime}` : e.startTime
  return `${day} · ${clock}`
}

/** The instant an event starts, for sorting. */
function eventStart(e: KseEvent): number {
  if (!e.startDate) return Number.POSITIVE_INFINITY
  const t = new Date(`${e.startDate}T${e.startTime || '00:00'}`).getTime()
  return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t
}

/** True when the event is still ahead of the visitor. */
export function eventIsUpcoming(e: KseEvent, now = Date.now()): boolean {
  return eventStart(e) >= now
}

/**
 * Events that have not happened yet, soonest first.
 * Past events are dropped so the page never advertises something over.
 */
export function upcomingEvents(events: KseEvent[], now = Date.now()): KseEvent[] {
  return events
    .filter((e) => e.status === 'Published')
    .filter((e) => eventIsUpcoming(e, now))
    .sort((a, b) => {
      const sortA = a.sortOrder ?? 0
      const sortB = b.sortOrder ?? 0
      if (sortA !== sortB) return sortA - sortB
      // Preserve admin save order when sort_order is the same.
      return a.createdAt.localeCompare(b.createdAt)
    })
}

export interface EventDirectory {
  events: KseEvent[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createEvent: (input: EventInput) => Promise<{ error: string | null; id?: string }>
  updateEvent: (id: string, input: EventInput) => Promise<{ error: string | null }>
  deleteEvent: (id: string) => Promise<{ error: string | null }>
  /** Save someone's interest in an event. */
  registerInterest: (eventId: string, input: { name: string; email: string; phone: string }) => Promise<{ error: string | null }>
  /** Everyone who registered interest in one event. */
  interestsFor: (eventId: string) => Promise<{ rows: EventInterest[]; error: string | null }>
  deleteInterest: (id: string) => Promise<{ error: string | null }>
}

export interface EventInterest {
  id: string
  eventId: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export function useEvents(): EventDirectory {
  const [events, setEvents] = useState<KseEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('events')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(500)
      if (err) {
        setError(err.message)
        setEvents([])
      } else {
        setEvents((data ?? []).map((r) => toEvent(r as Record<string, any>)))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load events.')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const createEvent = useCallback(async (input: EventInput) => {
    const { count } = await supabase.from('events').select('id', { count: 'exact', head: true })
    const { error: err } = await supabase.from('events').insert({
      reference: buildReference(count ?? 0),
      title: input.title.trim(),
      tagline: (input.tagline ?? '').trim(),
      category: (input.category ?? '').trim(),
      status: input.status ?? 'Draft',
      featured: !!input.featured,
      start_date: (input.startDate ?? '').trim(),
      end_date: (input.endDate ?? '').trim(),
      start_time: (input.startTime ?? '').trim(),
      end_time: (input.endTime ?? '').trim(),
      timezone: (input.timezone ?? 'America/Chicago').trim(),
      format: (input.format ?? 'In person').trim(),
      venue_name: (input.venueName ?? '').trim(),
      venue_address: (input.venueAddress ?? '').trim(),
      city: (input.city ?? '').trim(),
      country: (input.country ?? '').trim(),
      online_url: (input.onlineUrl ?? '').trim(),
      host: (input.host ?? '').trim(),
      introduction: (input.introduction ?? '').trim(),
      description: (input.description ?? '').trim(),
      who_for: (input.whoFor ?? '').trim(),
      preparation: (input.preparation ?? '').trim(),
      how_to_apply: (input.howToApply ?? '').trim(),
      capacity: (input.capacity ?? '').trim(),
      registered: (input.registered ?? '').trim(),
      registration_status: (input.registrationStatus ?? 'Not open').trim(),
      cost: (input.cost ?? '').trim(),
      image_url: (input.imageUrl ?? '').trim(),
      image_alt: (input.imageAlt ?? '').trim(),
      video_url: (input.videoUrl ?? '').trim(),
      sort_order: input.sortOrder ?? 0,
    })
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const updateEvent = useCallback(async (id: string, input: EventInput) => {
    const { error: err } = await supabase
      .from('events')
      .update({
        title: input.title.trim(),
        tagline: (input.tagline ?? '').trim(),
        category: (input.category ?? '').trim(),
        status: input.status ?? 'Draft',
        featured: !!input.featured,
        start_date: (input.startDate ?? '').trim(),
        end_date: (input.endDate ?? '').trim(),
        start_time: (input.startTime ?? '').trim(),
        end_time: (input.endTime ?? '').trim(),
        timezone: (input.timezone ?? 'America/Chicago').trim(),
        format: (input.format ?? 'In person').trim(),
        venue_name: (input.venueName ?? '').trim(),
        venue_address: (input.venueAddress ?? '').trim(),
        city: (input.city ?? '').trim(),
        country: (input.country ?? '').trim(),
        online_url: (input.onlineUrl ?? '').trim(),
        host: (input.host ?? '').trim(),
        introduction: (input.introduction ?? '').trim(),
        description: (input.description ?? '').trim(),
        who_for: (input.whoFor ?? '').trim(),
        preparation: (input.preparation ?? '').trim(),
        how_to_apply: (input.howToApply ?? '').trim(),
        capacity: (input.capacity ?? '').trim(),
        registered: (input.registered ?? '').trim(),
        registration_status: (input.registrationStatus ?? 'Not open').trim(),
        cost: (input.cost ?? '').trim(),
        image_url: (input.imageUrl ?? '').trim(),
        image_alt: (input.imageAlt ?? '').trim(),
        video_url: (input.videoUrl ?? '').trim(),
        sort_order: input.sortOrder ?? 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const deleteEvent = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('events').delete().eq('id', id)
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const registerInterest = useCallback(async (eventId: string, input: { name: string; email: string; phone: string }) => {
    const { error: err } = await supabase.from('event_interests').insert({
      event_id: eventId,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
    })
    if (err) return { error: err.message }
    return { error: null }
  }, [])

  const interestsFor = useCallback(async (eventId: string) => {
    const { data, error: err } = await supabase
      .from('event_interests')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })
      .limit(500)
    if (err) return { rows: [], error: err.message }
    return {
      rows: (data ?? []).map((r) => ({
        id: r.id,
        eventId: r.event_id,
        name: r.name ?? '',
        email: r.email ?? '',
        phone: r.phone ?? '',
        createdAt: r.created_at ?? '',
      })),
      error: null,
    }
  }, [])

  const deleteInterest = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('event_interests').delete().eq('id', id)
    if (err) return { error: err.message }
    return { error: null }
  }, [])

  return { events, loading, error, refresh, createEvent, updateEvent, deleteEvent, registerInterest, interestsFor, deleteInterest }
}

/**
 * Upload a file to Cloudinary from the browser and return the delivery URL.
 *
 * Uses the unsigned upload preset, so no API secret ever reaches the client.
 * Works for both images and videos — Cloudinary picks the resource type.
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<{ url: string; error: string | null }> {
  const resourceType = file.type.startsWith('video') ? 'video' : 'image'
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`

  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  form.append('folder', CLOUDINARY_FOLDER)

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', endpoint)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300 && body.secure_url) {
          resolve({ url: body.secure_url as string, error: null })
        } else {
          resolve({ url: '', error: describeCloudinaryError(body?.error?.message) })
        }
      } catch {
        resolve({ url: '', error: 'Upload failed. Please try again.' })
      }
    }
    xhr.onerror = () => resolve({ url: '', error: 'Upload failed. Please try again.' })
    xhr.send(form)
  })
}

/** Turn a Cloudinary error into something the admin can act on. */
function describeCloudinaryError(raw: string | undefined): string {
  if (!raw) return 'Upload failed. Please try again.'
  if (/must be whitelisted for unsigned uploads/i.test(raw)) {
    return 'The Cloudinary upload preset is not enabled for unsigned (browser) uploads. In the Cloudinary console open Settings → Upload, find the upload preset, and turn on "Allow unsigned uploads".'
  }
  if (/preset not found/i.test(raw)) {
    return 'The Cloudinary upload preset was not found. Check its name in Settings → Upload.'
  }
  return raw
}
