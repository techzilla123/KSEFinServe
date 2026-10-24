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

/** True when the client has real credentials and can actually connect. */
export const isConfigured = isSupabaseConfigured()

// A missing config must not blank the page. The client is still exported so
// imports keep working; callers check `isConfigured` before using it, and the
// auth screens show a clear message instead of a white screen.
if (!isConfigured) {
  console.warn(
    '[supabaseClient] Supabase is not configured on this deployment. ' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY as build-time ' +
      'environment variables so build.mjs can write dist/config.js.',
  )
}

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // The admin console is a single page app; keep the session in storage so a
    // reload does not drop the user back to the login screen.
      storageKey: 'kse.admin.session',
    },
  })
  : (null as unknown as ReturnType<typeof createClient>)

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

/**
 * Run a Supabase operation, or report a clear error when the client is not
 * configured. Every directory module goes through this so a missing config
 * shows a message instead of crashing the page.
 */
export async function withSupabase<T>(
  fn: (client: NonNullable<typeof supabase>) => Promise<T>,
): Promise<{ data: T | null; error: string | null }> {
  if (!isConfigured || !supabase) {
    return {
      data: null,
      error:
        'Supabase is not configured on this deployment. Set VITE_SUPABASE_URL ' +
        'and VITE_SUPABASE_ANON_KEY as build-time environment variables.',
    }
  }
  try {
    const data = await fn(supabase as NonNullable<typeof supabase>)
    return { data, error: null }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Something went wrong.' }
  }
}
