/* Admin directory for the KSEFinServe workspace.
   Reads the real Supabase auth users and exposes the actions the Settings
   page needs: list, invite, update role/permissions, deactivate, reactivate.

   Roles and permissions live in raw_user_meta_data, which keeps the whole
   directory working without any extra tables. */

import { useCallback, useEffect, useState } from 'react'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
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

/** The service-role client used for admin-only directory operations. */
function serviceClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string
  const key = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
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
  const canManage = serviceClient() !== null

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // The anon key can read auth.users only when exposed via a view; the
      // service key is the supported path. Fall back to the anon key so the
      // page still renders something when the service key is absent.
      const client = serviceClient() ?? supabase
      const { data, error: err } = await client.auth.admin.listUsers({ page: 1, perPage: 100 })
      if (err) {
        setError(err.message)
        setUsers([])
      } else {
        const list = (data.users ?? []).map((u) => toAdminUser(u as unknown as Record<string, any>))
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
    const client = serviceClient()
    if (!client) return { error: 'Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env to manage users.' }
    const { error } = await client.auth.admin.createUser({
      email: input.email.trim(),
      email_confirm: true,
      user_metadata: {
        first_name: input.firstName.trim(),
        last_name: input.lastName.trim(),
        role: input.role,
        permissions: input.permissions,
      },
    })
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const updateUser = useCallback(async (id: string, input: { firstName?: string; lastName?: string; role?: Role; permissions?: PermissionKey[] }) => {
    const client = serviceClient()
    if (!client) return { error: 'Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env to manage users.' }
    const existing = users.find((u) => u.id === id)
    const meta = {
      ...(existing?.raw ?? {}),
      ...(input.firstName !== undefined ? { first_name: input.firstName.trim() } : {}),
      ...(input.lastName !== undefined ? { last_name: input.lastName.trim() } : {}),
      ...(input.role !== undefined ? { role: input.role } : {}),
      ...(input.permissions !== undefined ? { permissions: input.permissions } : {}),
    }
    const { error } = await client.auth.admin.updateUserById(id, { user_metadata: meta })
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }, [users, refresh])

  const setUserPassword = useCallback(async (id: string, password: string) => {
    const client = serviceClient()
    if (!client) return { error: 'Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env to manage users.' }
    const { error } = await client.auth.admin.updateUserById(id, { password })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const deactivateUser = useCallback(async (id: string) => {
    const client = serviceClient()
    if (!client) return { error: 'Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env to manage users.' }
    const { error } = await client.auth.admin.updateUserById(id, { ban_duration: '2147483647s' })
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const reactivateUser = useCallback(async (id: string) => {
    const client = serviceClient()
    if (!client) return { error: 'Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env to manage users.' }
    const { error } = await client.auth.admin.updateUserById(id, { ban_duration: 'none' })
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }, [refresh])

  const deleteUser = useCallback(async (id: string) => {
    const client = serviceClient()
    if (!client) return { error: 'Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env to manage users.' }
    const { error } = await client.auth.admin.deleteUser(id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }, [refresh])

  return { users, loading, error, canManage, currentUser, refresh, inviteUser, updateUser, setUserPassword, deactivateUser, reactivateUser, deleteUser, sendInviteEmail }
}
