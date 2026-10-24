/* Supabase client for the KSEFinServe admin workspace.
   Auth, directory, bookings, events, insights, careers and notifications all
   run through this client.

   The keys are NOT bundled. Vite inlines any VITE_-prefixed env var into the
   client build, which both leaks the secret and trips Netlify/GitHub secret
   scanning, so they are injected at runtime instead: build.mjs writes a small
   public/config.js from .env before Vite runs. */

import { createClient } from '@supabase/supabase-js'

import { runtimeConfig, isSupabaseConfigured } from '../runtimeConfig'

const SUPABASE_URL = runtimeConfig().supabaseUrl ?? ''
const SUPABASE_ANON_KEY = runtimeConfig().supabaseAnonKey ?? ''

if (!isSupabaseConfigured()) {
  // Fail loudly rather than silently falling back to a broken client.
  throw new Error('Supabase is not configured on this deployment.')
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
