/* Authentication state for the admin console.
   Wraps Supabase's session handling so the UI can react to sign-in, sign-out
   and the password-reset redirect without touching Supabase directly.

   The hook is called ONCE at the root of the admin app and the resulting
   actions are passed down. Calling it inside a screen would create a second,
   independent listener that the root never hears about — so sign-in from the
   login form would not move the app to the dashboard. */

import { useCallback, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

export type AuthStatus = 'loading' | 'signed-out' | 'signed-in'

export interface AdminAuth {
  session: Session | null
  user: User | null
  status: AuthStatus
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>
  setNewPassword: (password: string) => Promise<{ error: string | null }>
}

/** The actions a screen needs. The root owns the session state itself. */
export type AdminAuthActions = Pick<AdminAuth, 'signIn' | 'signOut' | 'requestPasswordReset' | 'setNewPassword'>

export function useAdminAuth(): AdminAuth {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    // Ask Supabase for any session restored from storage, then keep listening.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setStatus(data.session ? 'signed-in' : 'signed-out')
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setStatus(next ? 'signed-in' : 'signed-out')
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/auth/reset`,
    })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const setNewPassword = useCallback(async (password: string) => {
    // A signed-in user changes their own password.
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) return { error: error.message }
      return { error: null }
    }
    // Someone arriving from a reset/invite link has no session yet. Exchange the
    // one-time code in the URL for a session, then set the password.
    const url = new URL(window.location.href)
    const token = url.searchParams.get('token') ?? url.hash.match(/access_token=([^&]+)/)?.[1]
    if (!token) return { error: 'This link is missing its access token. Request a new one.' }
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token,
      type: 'recovery',
      email: url.searchParams.get('email') ?? '',
    })
    if (verifyError) {
      // Fall back to the hash token if the query-string form was not accepted.
      const { error: hashError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: url.searchParams.get('refresh_token') ?? '',
      })
      if (hashError) return { error: hashError.message }
    }
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  return { session, user: session?.user ?? null, status, signIn, signOut, requestPasswordReset, setNewPassword }
}

export type { User }
