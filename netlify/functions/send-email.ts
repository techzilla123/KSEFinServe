/* Netlify Function: send transactional email via Brevo (Sendinblue).
   Reads BREVO_API_KEY from Netlify environment variables (server-side only).
   Expects POST JSON: { to, subject, html, text?, fromName?, replyTo? } */

import type { Request } from '@netlify/functions'

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? ''
const DEFAULT_FROM_EMAIL = process.env.EMAIL_FROM ?? 'info@ksefinserve.com'
const DEFAULT_FROM_NAME = process.env.EMAIL_FROM_NAME ?? 'KSEFinServe'

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ADMIN_ALLOWED_ORIGIN ?? '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

interface EmailPayload {
  to: string | string[]
  subject: string
  html: string
  text?: string
  fromName?: string
  replyTo?: string
}

function validatePayload(payload: unknown): payload is EmailPayload {
  if (!payload || typeof payload !== 'object') return false
  const p = payload as Record<string, unknown>
  if (!p.to || (typeof p.to !== 'string' && !Array.isArray(p.to))) return false
  if (!p.subject || typeof p.subject !== 'string') return false
  if (!p.html || typeof p.html !== 'string') return false
  return true
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  if (!BREVO_API_KEY) {
    return json({ error: 'Email service not configured (missing BREVO_API_KEY).' }, 500)
  }

  let payload: EmailPayload
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  if (!validatePayload(payload)) {
    return json({ error: 'Missing required fields: to, subject, html' }, 400)
  }

  const to = Array.isArray(payload.to) ? payload.to : [payload.to]

  const message = {
    sender: {
      name: payload.fromName ?? DEFAULT_FROM_NAME,
      email: DEFAULT_FROM_EMAIL,
    },
    to: to.map((email) => ({ email: String(email).trim() })),
    subject: payload.subject,
    htmlContent: payload.html,
    textContent: payload.text ?? payload.html.replace(/<[^>]*>/g, '').slice(0, 1000),
    ...(payload.replyTo ? { replyTo: { email: payload.replyTo } } : {}),
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(message),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Brevo error:', data)
      return json(
        { error: data.message ?? 'Failed to send email', code: data.code },
        res.status
      )
    }

    return json({ ok: true, messageId: data.messageId })
  } catch (e) {
    console.error('Send email error:', e)
    return json(
      { error: e instanceof Error ? e.message : 'Failed to send email' },
      500
    )
  }
}