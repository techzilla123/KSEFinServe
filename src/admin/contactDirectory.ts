/* Contact form enquiries.
   The /contact dialog writes here, and the admin dashboard reads the same
   table alongside career applications. */

import { useCallback, useEffect, useState } from 'react'
import { supabase, isConfigured } from './supabaseClient'

export type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

export interface ContactDirectory {
  messages: ContactMessage[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  remove: (id: string) => Promise<void>
}

/** Read every contact enquiry, newest first. */
export function useContactMessages(): ContactDirectory {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (err) throw new Error(err.message)
      setMessages(
        (data ?? []).map((r) => ({
          id: r.id,
          name: r.name ?? '',
          email: r.email ?? '',
          subject: r.subject ?? '',
          message: r.message ?? '',
          createdAt: r.created_at ?? '',
        })),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load contact messages.')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const remove = useCallback(async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id)
    setMessages((current) => current.filter((m) => m.id !== id))
  }, [])

  return { messages, loading, error, refresh, remove }
}

/** Save one contact enquiry from the public form. */
export async function submitContactMessage(input: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('contact_messages').insert({
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
  })
  if (error) return { ok: false, error: error.message }

  // Send notification email to admin (non-blocking)
    try {
      const { sendContactNotification } = await import('@/lib/email')
      await sendContactNotification({
        name: input.name.trim(),
        email: input.email.trim(),
        subject: input.subject.trim(),
        message: input.message.trim(),
      })
    } catch {
    // Email failure shouldn't block the form submission
    console.warn('Contact notification email failed to send')
  }

  return { ok: true }
}
