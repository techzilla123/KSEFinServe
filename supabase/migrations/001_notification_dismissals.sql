-- Notification dismissals.
--
-- Notifications are derived from the live tables (bookings, career
-- applications, event interests, insights, events), so they cannot simply be
-- deleted. Instead an admin's dismissal is recorded here, keyed to their user
-- id, so it follows them to any device they sign in on.
--
-- Run this in the Supabase SQL editor: Dashboard -> SQL Editor -> New query.

create table if not exists public.notification_dismissals (
  id bigint generated always as identity primary key,
  notification_id text not null,
  admin_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  -- One dismissal per admin per notification.
  unique (notification_id, admin_id)
);

-- The bell reads this table on every load.
alter table public.notification_dismissals enable row level security;

create policy "Admins read their own dismissals"
  on public.notification_dismissals
  for select
  to authenticated
  using (auth.uid() = admin_id);

create policy "Admins add their own dismissals"
  on public.notification_dismissals
  for insert
  to authenticated
  with check (auth.uid() = admin_id);

create policy "Admins remove their own dismissals"
  on public.notification_dismissals
  for delete
  to authenticated
  using (auth.uid() = admin_id);

-- Keep the schema cache fresh so PostgREST sees the new table immediately.
notify pgrst, 'reload schema';
