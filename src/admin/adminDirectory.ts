/* Admin directory for the KSEFinServe workspace.
   Reads the real Supabase auth users and exposes the actions the Settings
   page needs: list, invite, update role/permissions, deactivate, reactivate.

   Roles and permissions live in raw_user_meta_data, which keeps the whole
   directory working without any extra tables. */

import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

/** Roles an administrator can assign. */
export const ROLES = ['Administrator', 'Content editor', 'Adviser', 'Analyst'] as const
export type Role = (typeof ROLES)[number]

/** The permission rows shown in the create/edit modal. */
export const PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard', description: 'View workspace summary' },
  { key: 'insights', label: 'Insights & events', description: 'Create, edit and publish content' },
  { key: 'monitoring', label: 'Monitoring', description: 'View demo reports' },
  { key: 'bookings', label: 'Booked sessions', description: 'No client-record access' },
  { key: 'settings', label: 'Settings & users', description: 'No user-management access' },
] as const

export type PermissionKey = (typeof PERMISSIONS)[number]['key']

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  permissions: PermissionKey[]
  state: 'Active' | 'Invited' | 'Deactivated'
  lastActivity: string
  createdAt: string
  raw: Record<string, unknown>
}

/** Access scope shown in the table, derived from the role. */
export function scopeForRole(role: Role): string {
  switch (role) {
    case 'Administrator':
      return 'Full workspace access'
    case 'Content editor':
      return 'Insights & events'
    case 'Adviser':
      return 'Assigned sessions only'
    case 'Analyst':
      return 'Read-only monitoring'
    default:
      return 'Limited access'
  }
}

function defaultPermissions(role: Role): PermissionKey[] {
  switch (role) {
    case 'Administrator':
      return ['dashboard', 'insights', 'monitoring', 'bookings', 'settings']
    case 'Content editor':
      return ['dashboard', 'insights', 'monitoring']
    case 'Adviser':
      return ['dashboard', 'bookings']
    case 'Analyst':
      return ['dashboard', 'monitoring']
    default:
      return ['dashboard']
  }
}

/** Format a timestamp the way the table expects. */
function formatActivity(iso: string | null): string {
  if (!iso) return 'Not yet signed in'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Not yet signed in'
  const pad = (n: number) => String(n).padStart(2, '0')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  if (sameDay) return `Today, ${time}`
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${time}`
}

/** The signed-in admin's email, or '' when nobody is signed in. */
function sessionEmail(): string {
  try {
    const raw = window.localStorage.getItem('kse.admin.session')
    if (!raw) return ''
    const parsed = JSON.parse(raw)
    // Supabase stores the session under `currentSession`; older builds used `user`.
    return (
      parsed?.currentSession?.user?.email ??
      parsed?.user?.email ??
      ''
    ) as string
  } catch {
    return ''
  }
}

/** Turn a Supabase auth user into the shape the Settings table uses. */
function toAdminUser(u: Record<string, any>): AdminUser {
  // The admin API returns `user_metadata`; older shapes used `raw_user_meta_data`.
  const meta = ((u.user_metadata ?? u.raw_user_meta_data ?? {}) as Record<string, unknown>)
  const role = (ROLES as readonly string[]).includes(meta.role as string) ? (meta.role as Role) : 'Analyst'
  const perms = Array.isArray(meta.permissions)
    ? (meta.permissions as string[]).filter((p): p is PermissionKey =>
        PERMISSIONS.some((row) => row.key === p),
      )
    : defaultPermissions(role)

  return {
    id: u.id,
    email: u.email ?? '',
    firstName: (meta.first_name as string) ?? '',
    lastName: (meta.last_name as string) ?? '',
    role,
    permissions: perms.length ? perms : defaultPermissions(role),
    state: u.banned_until ? 'Deactivated' : u.last_sign_in_at ? 'Active' : 'Invited',
    lastActivity: formatActivity(u.last_sign_in_at ?? null),
    createdAt: u.created_at ?? '',
    raw: meta,
  }
}

/**
 * Call the admin-directory Netlify Function.
 *
 * The service-role key bypasses row-level security, so it lives on the server
 * and never reaches the browser. The function verifies the caller's session
 * before doing anything privileged.
 */
async function callAdminFunction(action: string, body: Record<string, unknown> = {}): Promise<{ error: string | null; users?: unknown[] }> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.access_token) return { error: 'You are signed out. Please sign in again.' }

  const res = await fetch('/.netlify/functions/admin-directory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ action, ...body }),
  })

  let payload: { error?: string; users?: unknown[] } = {}
  try {
    payload = await res.json()
  } catch {
    return { error: 'The admin service did not respond.' }
  }
  if (!res.ok) return { error: payload.error ?? 'The admin service could not complete that.' }
  return { error: null, users: payload.users }
}

export interface AdminDirectory {
  users: AdminUser[]
  loading: boolean
  error: string | null
  /** True when a service-role key is configured and admin actions will work. */
  canManage: boolean
  /** The signed-in admin, so the UI can tell "self" from "someone else". */
  currentUser: AdminUser | null
  refresh: () => Promise<void>
  inviteUser: (input: { email: string; firstName: string; lastName: string; role: Role; permissions: PermissionKey[] }) => Promise<{ error: string | null }>
  updateUser: (id: string, input: { firstName?: string; lastName?: string; role?: Role; permissions?: PermissionKey[] }) => Promise<{ error: string | null }>
  setUserPassword: (id: string, password: string) => Promise<{ error: string | null }>
  deactivateUser: (id: string) => Promise<{ error: string | null }>
  reactivateUser: (id: string) => Promise<{ error: string | null }>
  deleteUser: (id: string) => Promise<{ error: string | null }>
  /** Ask the invited person to set their own password by email. */
  sendInviteEmail: (email: string) => Promise<{ error: string | null }>
}

export function useAdminDirectory(): AdminDirectory {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  // The directory is served by the Netlify Function, so it is available
  // whenever the admin console is deployed.
  const canManage = true

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { error: err, users: rows } = await callAdminFunction('listUsers')
      if (err) {
        setError(err)
        setUsers([])
      } else {
        const list = (rows ?? []).map((u) => toAdminUser(u as Record<string, any>))
        setUsers(list)
        // Mark which row is the signed-in admin.
        setCurrentUser(list.find((u) => u.email === sessionEmail()) ?? null)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load users.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const sendInviteEmail = useCallback(async (email: string) => {
    // Ask Supabase to send the invitee a link to set their own password.
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/auth/reset`,
    })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const inviteUser = useCallback(async (input: { email: string; firstName: string; lastName: string; role: Role; permissions: PermissionKey[] }) => {
    const { error } = await callAdminFunction('createUser', {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      permissions: input.permissions,
    })
    if (error) return { error }
    await refresh()
    return { error: null }
  }, [refresh])

  const updateUser = useCallback(async (id: string, input: { firstName?: string; lastName?: string; role?: Role; permissions?: PermissionKey[] }) => {
    const { error } = await callAdminFunction('updateUser', {
      id,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      permissions: input.permissions,
    })
    if (error) return { error }
    await refresh()
    return { error: null }
  }, [refresh])

  const setUserPassword = useCallback(async (id: string, password: string) => {
    const { error } = await callAdminFunction('updateUser', { id, password })
    if (error) return { error }
    return { error: null }
  }, [])

  const deactivateUser = useCallback(async (id: string) => {
    const { error } = await callAdminFunction('deactivateUser', { id })
    if (error) return { error }
    await refresh()
    return { error: null }
  }, [refresh])

  const reactivateUser = useCallback(async (id: string) => {
    const { error } = await callAdminFunction('reactivateUser', { id })
    if (error) return { error }
    await refresh()
    return { error: null }
  }, [refresh])

  const deleteUser = useCallback(async (id: string) => {
    const { error } = await callAdminFunction('deleteUser', { id })
    if (error) return { error }
    await refresh()
    return { error: null }
  }, [refresh])

  return { users, loading, error, canManage, currentUser, refresh, inviteUser, updateUser, setUserPassword, deactivateUser, reactivateUser, deleteUser, sendInviteEmail }
}
