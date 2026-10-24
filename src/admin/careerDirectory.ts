/* Career applications.
   The public /career form writes here; the admin dashboard reads them. */

import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export type CareerStatus = 'New' | 'Reviewing' | 'Contacted' | 'Archived'

export interface CareerApplication {
  id: string
  reference: string
  name: string
  email: string
  phone: string
  location: string
  preferredContact: string
  role: string
  background: string
  interests: string[]
  licences: string
  consentContact: boolean
  consentData: boolean
  status: CareerStatus
  notes: string
  createdAt: string
  updatedAt: string
}

export interface CareerInput {
  name: string
  email: string
  phone: string
  location: string
  preferredContact?: string
  role?: string
  background?: string
  interests?: string[]
  licences?: string
  consentContact?: boolean
  consentData?: boolean
}

/** Build a readable reference like CAR-2026-001-X7K. */
function buildReference(index: number): string {
  const year = new Date().getFullYear()
  const sequence = String(index + 1).padStart(3, '0')
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `CAR-${year}-${sequence}-${suffix}`
}

/** Turn a database row into the shape the UI uses. */
function toCareer(row: Record<string, any>): CareerApplication {
  const status = (row.status as string) ?? 'New'
  return {
    id: row.id,
    reference: row.reference,
    name: row.name ?? '',
    email: row.email ?? '',
    phone: row.phone ?? '',
    location: row.location ?? '',
    preferredContact: row.preferred_contact ?? 'Email',
    role: row.role ?? '',
    background: row.background ?? '',
    interests: Array.isArray(row.interests) ? (row.interests as string[]) : [],
    licences: row.licences ?? '',
    consentContact: !!row.consent_contact,
    consentData: !!row.consent_data,
    status: status === 'Reviewing' || status === 'Contacted' || status === 'Archived' ? status : 'New',
    notes: row.notes ?? '',
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  }
}

export interface CareerDirectory {
  applications: CareerApplication[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  submitApplication: (input: CareerInput) => Promise<{ error: string | null; reference?: string }>
  updateStatus: (id: string, status: CareerStatus) => Promise<{ error: string | null }>
  saveNote: (id: string, notes: string) => Promise<{ error: string | null }>
  deleteApplication: (id: string) => Promise<{ error: string | null }>
}

export function useCareers(): CareerDirectory {
  const [applications, setApplications] = useState<CareerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('career_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)
      if (err) {
        setError(err.message)
        setApplications([])
      } else {
        setApplications((data ?? []).map((r) => toCareer(r as Record<string, any>)))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load career applications.')
      setApplications([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const submitApplication = useCallback(async (input: CareerInput) => {
    const { count } = await supabase.from('career_applications').select('id', { count: 'exact', head: true })
    const reference = buildReference(count ?? 0)
    const { error: err } = await supabase.from('career_applications').insert({
      reference,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      location: input.location.trim(),
      preferred_contact: input.preferredContact ?? 'Email',
      role: (input.role ?? '').trim(),
      background: (input.background ?? '').trim(),
      interests: input.interests ?? [],
      licences: (input.licences ?? '').trim(),
      consent_contact: !!input.consentContact,
      consent_data: !!input.consentData,
      status: 'New',
    })
    if (err) return { error: err.message, reference }
    await refresh()
    return { error: null, reference }
  }, [refresh])

  const updateStatus = useCallback(async (id: string, status: CareerStatus) => {
    const { error: err } = await supabase
      .from('career_applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const saveNote = useCallback(async (id: string, notes: string) => {
    const { error: err } = await supabase
      .from('career_applications')
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const deleteApplication = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('career_applications').delete().eq('id', id)
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  return { applications, loading, error, refresh, submitApplication, updateStatus, saveNote, deleteApplication }
}

/** Standalone submit used by the public /career form. */
export async function submitCareerApplication(input: CareerInput): Promise<{ error: string | null; reference?: string }> {
  const { count } = await supabase.from('career_applications').select('id', { count: 'exact', head: true })
  const reference = buildReference(count ?? 0)
  const { error: err } = await supabase.from('career_applications').insert({
    reference,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    location: input.location.trim(),
    preferred_contact: input.preferredContact ?? 'Email',
    role: (input.role ?? '').trim(),
    background: (input.background ?? '').trim(),
    interests: input.interests ?? [],
    licences: (input.licences ?? '').trim(),
    consent_contact: !!input.consentContact,
    consent_data: !!input.consentData,
    status: 'New',
  })
  if (err) return { error: err.message, reference }
  return { error: null, reference }
}
