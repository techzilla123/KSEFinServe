/* Netlify Function: admin directory operations.
   The Supabase service-role key bypasses row-level security, so it must never
   reach the browser. This function holds it server-side and exposes only the
   specific actions the Settings page needs.

   Requires SERVICE_ROLE_KEY and SUPABASE_URL in the Netlify environment
   (Site settings → Environment variables). Never set them as VITE_ vars. */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.118.0'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') ?? ''

/** Origins allowed to call this function. */
const ALLOWED_ORIGIN = Deno.env.get('ADMIN_ALLOWED_ORIGIN') ?? '*'

const cors = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body, status = 200) {
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

export default async function handler(request) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: 'Admin directory is not configured on this deployment.' }, 500)
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid request body.' }, 400)
  }

  const action = payload?.action
  if (!action || !ACTIONS.has(action)) {
    return json({ error: 'Unsupported action.' }, 400)
  }

  // The caller must be signed in. We verify their access token before doing
  // anything privileged, so the function cannot be used anonymously.
  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) return json({ error: 'Not signed in.' }, 401)

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
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
        const { email, firstName, lastName, role, permissions } = payload
        if (!email) return json({ error: 'Email is required.' }, 400)
        const { error } = await admin.auth.admin.createUser({
          email: String(email).trim(),
          email_confirm: true,
          user_metadata: {
            first_name: String(firstName ?? '').trim(),
            last_name: String(lastName ?? '').trim(),
            role: role ?? 'Adviser',
            permissions: permissions ?? [],
          },
        })
        if (error) return json({ error: error.message }, 400)
        return json({ ok: true })
      }

      case 'updateUser': {
        const { id, firstName, lastName, role, permissions, password } = payload
        if (!id) return json({ error: 'User id is required.' }, 400)

        // Read the existing metadata so a partial update does not wipe it.
        const { data: existing, error: readError } = await admin.auth.admin.getUserById(id)
        if (readError) return json({ error: readError.message }, 400)

        const meta = { ...(existing.user.user_metadata ?? {}) }
        if (firstName !== undefined) meta.first_name = String(firstName).trim()
        if (lastName !== undefined) meta.last_name = String(lastName).trim()
        if (role !== undefined) meta.role = role
        if (permissions !== undefined) meta.permissions = permissions

        const { error } = await admin.auth.admin.updateUserById(id, {
          user_metadata: meta,
          ...(password ? { password: String(password) } : {}),
        })
        if (error) return json({ error: error.message }, 400)
        return json({ ok: true })
      }

      case 'deactivateUser': {
        const { error } = await admin.auth.admin.updateUserById(String(payload.id), {
          ban_duration: '2147483647s',
        })
        if (error) return json({ error: error.message }, 400)
        return json({ ok: true })
      }

      case 'reactivateUser': {
        const { error } = await admin.auth.admin.updateUserById(String(payload.id), {
          ban_duration: 'none',
        })
        if (error) return json({ error: error.message }, 400)
        return json({ ok: true })
      }

      case 'deleteUser': {
        const { error } = await admin.auth.admin.deleteUser(String(payload.id))
        if (error) return json({ error: error.message }, 400)
        return json({ ok: true })
      }

      default:
        return json({ error: 'Unsupported action.' }, 400)
    }
  } catch (e) {
    return json({ error: e?.message ?? 'Something went wrong.' }, 500)
  }
}
