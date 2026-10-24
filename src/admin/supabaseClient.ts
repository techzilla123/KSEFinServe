/* Supabase client for the KSEFinServe admin workspace.
   Only the auth flows live here for now — the rest of the admin pages stay on
   their sample data until they are connected. */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Fail loudly rather than silently falling back to a broken client.
  throw new Error(
    'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env',
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // The admin console is a single page app; keep the session in storage so a
    // reload does not drop the user back to the login screen.
    storageKey: 'kse.admin.session',
  },
})

/** Where to send the user after Supabase redirects back from a reset email. */
export const AUTH_REDIRECT_URL = new URL('/admin/auth/reset', window.location.origin).toString()

export type AuthError = { message: string }

/** Normalise a Supabase error into a short, human-readable message. */
export function describeAuthError(error: unknown): string {
  const raw = (error as { message?: string } | null)?.message ?? ''
  if (/invalid login credentials/i.test(raw)) return 'That email and password do not match our records.'
  if (/user not found/i.test(raw)) return 'No account is registered with that email address.'
  if (/email not confirmed/i.test(raw)) return 'Please confirm your email address before signing in.'
  if (/rate limit/i.test(raw)) return 'Too many attempts. Please wait a moment and try again.'
  if (/password.*(8|character)/i.test(raw)) return 'Please choose a longer password.'
  return raw || 'Something went wrong. Please try again.'
}
