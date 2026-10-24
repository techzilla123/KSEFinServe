/* Netlify Function: admin directory operations.
   The Supabase service-role key bypasses row-level security, so it must never
   reach the browser. This function holds it server-side and exposes only the
   specific actions the Settings page needs.

   Reads the service-role key from SERVICE_ROLE_KEY, falling back to
   VITE_SUPABASE_SERVICE_ROLE_KEY so it also works when the key is set with
   the VITE_ prefix in the Netlify environment. Either way it is only ever
   read here, server-side, and is never bundled into the browser build.

   Runs on Netlify's Node runtime, so the Supabase SDK is imported from the
   installed package rather than a remote ESM URL. */

import type { IncomingMessage } from 'node:http'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? ''
const SERVICE_ROLE_KEY =
  process.env.SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? ''

/** Origins allowed to call this function. */
const ALLOWED_ORIGIN = process.env.ADMIN_ALLOWED_ORIGIN ?? '*'

const cors = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

/** Build a response.
    Netlify's runtime accepts a WHATWG Response (or undefined), so we return one
    rather than a plain object. */
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

/** Actions this function will perform. Anything else is refused. */
const ACTIONS = new Set([
  'listUsers',
  'createUser',
  'updateUser',
  'deactivateUser',
  'reactivateUser',
  'deleteUser',
])

interface Payload {
  action?: string
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  role?: string
  permissions?: string[]
  password?: string
}

/** Read and parse the JSON body, tolerating an empty or malformed body. */
async function readBody(req: IncomingMessage): Promise<Payload> {
  const raw = await new Promise<string>((resolve, reject) => {
    let acc = ''
    req.on('data', (chunk) => (acc += chunk))
    req.on('end', () => resolve(acc))
    req.on('error', reject)
  })
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Payload
  } catch {
    return {}
  }
}

export default async function handler(req: IncomingMessage) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors })
  }
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: 'Admin directory is not configured on this deployment.' }, 500)
  }

  const payload = await readBody(req)
  const action = payload.action
  if (!action || !ACTIONS.has(action)) {
    return json({ error: 'Unsupported action.' }, 400)
  }

  // The caller must be signed in. We verify their access token before doing
  // anything privileged, so the function cannot be used anonymously.
  const rawAuth = req.headers.authorization
  const authHeader = (Array.isArray(rawAuth) ? rawAuth[0] : rawAuth) ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) return json({ error: 'Not signed in.' }, 401)

  const admin: SupabaseClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Confirm the token belongs to a real user before acting on their behalf.
  const { data: me, error: meError } = await admin.auth.getUser(token)
  if (meError || !me?.user) return json({ error: 'Session is no longer valid.' }, 401)

  try {
    switch (action) {
      case 'listUsers': {
        const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 100 })
        if (error) return json({ error: error.message }, 400)
        return json({ users: data.users ?? [] })
      }

      case 'createUser': {
        if (!payload.email) return json({ error: 'Email is required.' }, 400)
        const { error } = await admin.auth.admin.createUser({
          email: String(payload.email).trim(),
          email_confirm: true,
          user_metadata: {
            first_name: String(payload.firstName ?? '').trim(),
            last_name: String(payload.lastName ?? '').trim(),
            role: payload.role ?? 'Adviser',
            permissions: payload.permissions ?? [],
          },
        })
        if (error) return json({ error: error.message }, 400)
        return json({ ok: true })
      }

      case 'updateUser': {
        if (!payload.id) return json({ error: 'User id is required.' }, 400)

        // Read the existing metadata so a partial update does not wipe it.
        const { data: existing, error: readError } = await admin.auth.admin.getUserById(payload.id)
        if (readError) return json({ error: readError.message }, 400)

        const meta = { ...(existing.user.user_metadata ?? {}) }
        if (payload.firstName !== undefined) meta.first_name = String(payload.firstName).trim()
        if (payload.lastName !== undefined) meta.last_name = String(payload.lastName).trim()
        if (payload.role !== undefined) meta.role = payload.role
        if (payload.permissions !== undefined) meta.permissions = payload.permissions

        const { error } = await admin.auth.admin.updateUserById(payload.id, {
          user_metadata: meta,
          ...(payload.password ? { password: String(payload.password) } : {}),
        })
        if (error) return json({ error: error.message }, 400)
        return json({ ok: true })
      }

      case 'deactivateUser': {
        if (!payload.id) return json({ error: 'User id is required.' }, 400)
        const { error } = await admin.auth.admin.updateUserById(payload.id, {
          ban_duration: '2147483647s',
        })
        if (error) return json({ error: error.message }, 400)
        return json({ ok: true })
      }

      case 'reactivateUser': {
        if (!payload.id) return json({ error: 'User id is required.' }, 400)
        const { error } = await admin.auth.admin.updateUserById(payload.id, { ban_duration: 'none' })
        if (error) return json({ error: error.message }, 400)
        return json({ ok: true })
      }

      case 'deleteUser': {
        if (!payload.id) return json({ error: 'User id is required.' }, 400)
        const { error } = await admin.auth.admin.deleteUser(payload.id)
        if (error) return json({ error: error.message }, 400)
        return json({ ok: true })
      }

      default:
        return json({ error: 'Unsupported action.' }, 400)
    }
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Something went wrong.' }, 500)
  }
}
