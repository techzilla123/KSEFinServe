/* Insights (articles) for the KSEFinServe workspace.
   The admin console writes these; the public /insights page reads them.

   Images live in Cloudinary — only the delivery URL is stored here. */

import { useCallback, useEffect, useState } from 'react'
import { supabase, isConfigured } from './supabaseClient'

export type InsightStatus = 'Published' | 'Draft' | 'Archived'

export interface Insight {
  id: string
  reference: string
  title: string
  category: string
  description: string
  content: string
  imageUrl: string
  imageAlt: string
  color: string
  readTime: string
  status: InsightStatus
  featured: boolean
  author: string
  publishedAt: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface InsightInput {
  title: string
  category?: string
  description?: string
  content?: string
  imageUrl?: string
  imageAlt?: string
  color?: string
  readTime?: string
  status?: InsightStatus
  featured?: boolean
  author?: string
  publishedAt?: string
  sortOrder?: number
}

/** Cloudinary cloud — the browser uploads straight to this. */
export const CLOUDINARY_CLOUD_NAME = 'dr1udeaev'
/** Unsigned upload preset. `ml_default` has unsigned uploads enabled. */
export const CLOUDINARY_UPLOAD_PRESET = 'ml_default'
/** Everything the site uploads lives under this folder. */
export const CLOUDINARY_FOLDER = 'ksefinserve/insights'

/** Build a readable reference like INS-2026-001-X7K. */
function buildReference(index: number): string {
  const year = new Date().getFullYear()
  const sequence = String(index + 1).padStart(3, '0')
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `INS-${year}-${sequence}-${suffix}`
}

/** Turn a database row into the shape the UI uses. */
function toInsight(row: Record<string, any>): Insight {
  const status = (row.status as string) ?? 'Draft'
  return {
    id: row.id,
    reference: row.reference,
    title: row.title ?? '',
    category: row.category ?? '',
    description: row.description ?? '',
    content: row.content ?? '',
    imageUrl: row.image_url ?? '',
    imageAlt: row.image_alt ?? '',
    color: row.color ?? '#d4bcfa',
    readTime: row.read_time ?? '',
    status: status === 'Published' || status === 'Archived' ? status : 'Draft',
    featured: !!row.featured,
    author: row.author ?? '',
    publishedAt: row.published_at ?? '',
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  }
}

/** Split stored content into paragraphs for the reader. */
export function insightParagraphs(insight: Insight): string[] {
  return insight.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
}

export interface InsightDirectory {
  insights: Insight[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createInsight: (input: InsightInput) => Promise<{ error: string | null; id?: string }>
  updateInsight: (id: string, input: InsightInput) => Promise<{ error: string | null }>
  deleteInsight: (id: string) => Promise<{ error: string | null }>
}

export function useInsights(): InsightDirectory {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('insights')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(500)
      if (err) {
        setError(err.message)
        setInsights([])
      } else {
        setInsights((data ?? []).map((r) => toInsight(r as Record<string, any>)))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load insights.')
      setInsights([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const createInsight = useCallback(async (input: InsightInput) => {
    const { count } = await supabase.from('insights').select('id', { count: 'exact', head: true })
    const { error: err } = await supabase.from('insights').insert({
      reference: buildReference(count ?? 0),
      title: input.title.trim(),
      category: (input.category ?? '').trim(),
      description: (input.description ?? '').trim(),
      content: (input.content ?? '').trim(),
      image_url: (input.imageUrl ?? '').trim(),
      image_alt: (input.imageAlt ?? '').trim(),
      color: (input.color ?? '#d4bcfa').trim(),
      read_time: (input.readTime ?? '').trim(),
      status: input.status ?? 'Draft',
      featured: !!input.featured,
      author: (input.author ?? '').trim(),
      published_at: (input.publishedAt ?? '').trim(),
      sort_order: input.sortOrder ?? 0,
    })
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const updateInsight = useCallback(async (id: string, input: InsightInput) => {
    const { error: err } = await supabase
      .from('insights')
      .update({
        title: input.title.trim(),
        category: (input.category ?? '').trim(),
        description: (input.description ?? '').trim(),
        content: (input.content ?? '').trim(),
        image_url: (input.imageUrl ?? '').trim(),
        image_alt: (input.imageAlt ?? '').trim(),
        color: (input.color ?? '#d4bcfa').trim(),
        read_time: (input.readTime ?? '').trim(),
        status: input.status ?? 'Draft',
        featured: !!input.featured,
        author: (input.author ?? '').trim(),
        published_at: (input.publishedAt ?? '').trim(),
        sort_order: input.sortOrder ?? 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const deleteInsight = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('insights').delete().eq('id', id)
    if (err) return { error: err.message }
    await refresh()
    return { error: null }
  }, [refresh])

  return { insights, loading, error, refresh, createInsight, updateInsight, deleteInsight }
}

/**
 * Upload a file to Cloudinary from the browser and return the delivery URL.
 *
 * Uses the unsigned upload preset, so no API secret ever reaches the client.
 */
export async function uploadInsightImage(
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
