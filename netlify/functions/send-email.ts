/* Netlify Function: send transactional email via Namecheap hosting SMTP.
   Uses the existing info@ksefinserve.com mailbox (included with hosting).
   Reads SMTP credentials from Netlify environment variables (server-side only).
   Expects POST JSON: { to, subject, html, text?, fromName?, replyTo? } */

import type { Request } from '@netlify/functions'
import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST!
const SMTP_PORT = Number(process.env.SMTP_PORT!)
const SMTP_USER = process.env.SMTP_USER!
const SMTP_PASS = process.env.SMTP_PASS!
const EMAIL_FROM = process.env.EMAIL_FROM!
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME!

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

// Create transporter once (reused across invocations)
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465 (SSL), false for 587 (TLS)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
})

// Verify transporter configuration on cold start
let transporterVerified = false
async function ensureTransporterReady() {
  if (!transporterVerified) {
    try {
      await transporter.verify()
      transporterVerified = true
      console.log('SMTP transporter verified successfully')
    } catch (err) {
      console.error('SMTP transporter verification failed:', err)
      throw new Error('Email service configuration error')
    }
  }
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  if (!SMTP_USER || !SMTP_PASS) {
    return json({ error: 'Email service not configured (missing SMTP credentials).' }, 500)
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

  try {
    await ensureTransporterReady()

    const info = await transporter.sendMail({
      from: `"${payload.fromName ?? EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
      to: to.join(', '),
      subject: payload.subject,
      html: payload.html,
      text: payload.text ?? payload.html.replace(/<[^>]*>/g, '').slice(0, 1000),
      replyTo: payload.replyTo,
    })

    console.log('Email sent:', info.messageId)
    return json({ ok: true, messageId: info.messageId })
  } catch (err) {
    console.error('Send email error:', err)
    return json(
      { error: err instanceof Error ? err.message : 'Failed to send email' },
      500
    )
  }
}