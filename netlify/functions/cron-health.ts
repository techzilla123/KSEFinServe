/* Netlify Function: cron job health check.
   Queries the cron_heartbeat_latest view to verify scheduled jobs are running.
   Returns 200 if all known jobs have run within expected windows, 503 otherwise. */

import type { Request } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? ''
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ADMIN_ALLOWED_ORIGIN ?? '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

/** Expected jobs and their maximum allowed age before considering them stale. */
const EXPECTED_JOBS: Record<string, { maxAgeMinutes: number; description: string }> = {
  'cron-heartbeat-monitor': { maxAgeMinutes: 10, description: 'Heartbeat canary (every 5 min)' },
  'cron-heartbeat-cleanup': { maxAgeMinutes: 1500, description: 'Cleanup old heartbeats (daily at 03:00)' },
  // Add your other cron jobs here:
  // 'your-job-name': { maxAgeMinutes: 30, description: 'Description' },
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: 'Supabase not configured' }, 500)
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  try {
    // Query the latest heartbeat per job.
    const { data: heartbeats, error } = await supabase
      .from('cron_heartbeat_latest')
      .select('job_name, run_at, status, age')

    if (error) {
      console.error('Heartbeat query error:', error)
      return json({ error: 'Failed to query heartbeat table', details: error.message }, 500)
    }

    const now = new Date()
    const results: Array<{
      job_name: string
      description: string
      last_run: string | null
      age_minutes: number | null
      status: 'ok' | 'stale' | 'missing' | 'error'
      expected_max_age_minutes: number
    }> = []

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'

    for (const [jobName, config] of Object.entries(EXPECTED_JOBS)) {
      const hb = heartbeats?.find((h) => h.job_name === jobName)

      if (!hb) {
        results.push({
          job_name: jobName,
          description: config.description,
          last_run: null,
          age_minutes: null,
          status: 'missing',
          expected_max_age_minutes: config.maxAgeMinutes,
        })
        overallStatus = 'unhealthy'
        continue
      }

      const runAt = hb.run_at ? new Date(hb.run_at) : null
      const ageMinutes = runAt ? (now.getTime() - runAt.getTime()) / 60000 : null
      const isStale = ageMinutes !== null && ageMinutes > config.maxAgeMinutes

      results.push({
        job_name: jobName,
        description: config.description,
        last_run: hb.run_at ?? null,
        age_minutes: ageMinutes ? Math.round(ageMinutes * 10) / 10 : null,
        status: isStale ? 'stale' : hb.status === 'ok' ? 'ok' : 'error',
        expected_max_age_minutes: config.maxAgeMinutes,
      })

      if (isStale) overallStatus = 'unhealthy'
      else if (hb.status !== 'ok') overallStatus = 'degraded'
    }

    // Also report any unexpected jobs in the table.
    const unexpected = heartbeats?.filter(
      (h) => !EXPECTED_JOBS[h.job_name]
    ) ?? []

    for (const hb of unexpected) {
      const runAt = hb.run_at ? new Date(hb.run_at) : null
      const ageMinutes = runAt ? (now.getTime() - runAt.getTime()) / 60000 : null
      results.push({
        job_name: hb.job_name,
        description: 'Unknown job (not in EXPECTED_JOBS)',
        last_run: hb.run_at ?? null,
        age_minutes: ageMinutes ? Math.round(ageMinutes * 10) / 10 : null,
        status: 'unknown',
        expected_max_age_minutes: 0,
      })
    }

    const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503

    return json(
      {
        status: overallStatus,
        timestamp: now.toISOString(),
        jobs: results,
        summary: {
          total: results.length,
          healthy: results.filter((r) => r.status === 'ok').length,
          stale: results.filter((r) => r.status === 'stale').length,
          missing: results.filter((r) => r.status === 'missing').length,
          error: results.filter((r) => r.status === 'error').length,
          unknown: results.filter((r) => r.status === 'unknown').length,
        },
      },
      httpStatus
    )
  } catch (e) {
    console.error('Cron health check error:', e)
    return json(
      { error: e instanceof Error ? e.message : 'Health check failed' },
      500
    )
  }
}