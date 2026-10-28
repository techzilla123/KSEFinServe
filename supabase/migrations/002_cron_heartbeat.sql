-- Cron job heartbeat monitoring.
-- Provides a simple way to verify scheduled jobs are executing.
-- Run this in Supabase SQL Editor: Dashboard -> SQL Editor -> New query.

-- 1. Heartbeat table: one row per job execution.
create table if not exists public.cron_heartbeat (
  id bigint generated always as identity primary key,
  job_name text not null,
  run_at timestamptz not null default now(),
  status text not null default 'ok',
  details jsonb
);

-- Index for fast "latest run" queries.
create index if not exists cron_heartbeat_job_name_run_at_idx
  on public.cron_heartbeat (job_name, run_at desc);

-- RLS: only authenticated admins can read.
alter table public.cron_heartbeat enable row level security;

create policy "Admins can read heartbeat"
  on public.cron_heartbeat
  for select
  to authenticated
  using (
    exists (
      select 1 from auth.users u
      where u.id = auth.uid()
      and (u.raw_user_meta_data->>'role')::text in ('Administrator', 'Content editor')
    )
  );

-- 2. Helper function: call this from any pg_cron job to log its heartbeat.
create or replace function public.log_cron_heartbeat(
  p_job_name text,
  p_status text default 'ok',
  p_details jsonb default '{}'::jsonb
) returns void language plpgsql as $$
begin
  insert into public.cron_heartbeat (job_name, status, details)
  values (p_job_name, p_status, p_details);
end;
$$;

-- 3. Schedule the heartbeat job itself (runs every 5 minutes).
-- This job serves as the "canary" — if it stops, you know cron is down.
select cron.schedule(
  'cron-heartbeat-monitor',
  '*/5 * * * *',  -- every 5 minutes
  $$ select public.log_cron_heartbeat('cron-heartbeat-monitor', 'ok', '{"source": "pg_cron"}') $$
);

-- 4. Optional: cleanup old heartbeat rows (keep last 7 days).
select cron.schedule(
  'cron-heartbeat-cleanup',
  '0 3 * * *',  -- daily at 03:00 UTC
  $$ delete from public.cron_heartbeat where run_at < now() - interval '7 days' $$
);

-- 5. View: latest heartbeat per job (easy to query from health endpoint).
create or replace view public.cron_heartbeat_latest as
select distinct on (job_name)
  job_name,
  run_at,
  status,
  details,
  now() - run_at as age
from public.cron_heartbeat
order by job_name, run_at desc;

-- Grant read access to the view for authenticated users.
grant select on public.cron_heartbeat_latest to authenticated;

notify pgrst, 'reload schema';