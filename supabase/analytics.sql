-- Sanuk Thai — minimal self-hosted product analytics (no third-party service).
-- Run in Supabase: SQL Editor → New query → paste → Run
--
-- The app batches a small allowlisted set of funnel events here. No PII:
-- only an anonymous per-device uuid, the event name, and a tiny props blob.
-- Clients can INSERT but never READ (you query from the SQL editor).

create table if not exists public.analytics_events (
  id         bigint generated always as identity primary key,
  device_id  uuid not null,
  event      text not null check (event in (
    'app_open', 'level_picked', 'lesson_start', 'lesson_complete',
    'lesson_fail', 'profile_created', 'email_linked',
    'paywall_view', 'checkout_click'
  )),
  props      jsonb not null default '{}' check (pg_column_size(props) < 512),
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

-- Write-only for clients (anon + signed-in). No select/update/delete policies:
-- events are readable only from the dashboard/service role.
drop policy if exists "client insert events" on public.analytics_events;
create policy "client insert events" on public.analytics_events
  for insert to anon, authenticated with check (true);

create index if not exists analytics_events_event_time_idx
  on public.analytics_events (event, created_at);
create index if not exists analytics_events_device_idx
  on public.analytics_events (device_id, created_at);

-- ── Abuse limits (AUDIT M1) ─────────────────────────────────────────────────
-- Insert is open to anon by design, so volume has to be bounded server-side.
-- Over-limit rows are dropped silently (the client never waits on analytics).
--   * per device: 300 events / hour   (a real session sends a few dozen)
--   * global:     3,000 events / minute (flood with rotating device ids)
-- SECURITY DEFINER is required: clients have no SELECT policy on this table,
-- so under RLS a plain count() would always see zero rows and never limit.
create index if not exists analytics_events_time_idx
  on public.analytics_events (created_at);

create or replace function public.analytics_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.analytics_events
        where device_id = new.device_id
          and created_at > now() - interval '1 hour') >= 300 then
    return null;
  end if;
  if (select count(*) from public.analytics_events
        where created_at > now() - interval '1 minute') >= 3000 then
    return null;
  end if;
  return new;
end;
$$;

drop trigger if exists analytics_rate_limit_trg on public.analytics_events;
create trigger analytics_rate_limit_trg
  before insert on public.analytics_events
  for each row execute function public.analytics_rate_limit();

-- ── Retention: 13 months (stated in the Privacy Policy) ─────────────────────
-- pg_cron ships with Supabase; this schedules a nightly purge at 03:00 UTC.
-- Re-running this file updates the job in place.
create extension if not exists pg_cron with schema extensions;
select cron.schedule(
  'analytics-retention',
  '0 3 * * *',
  $$delete from public.analytics_events where created_at < now() - interval '13 months'$$
);

-- ── Queries to run in the SQL editor ────────────────────────────────────────
-- Daily active devices:
--   select date_trunc('day', created_at) d, count(distinct device_id)
--   from analytics_events group by 1 order by 1 desc;
--
-- Funnel (last 30 days):
--   select event, count(distinct device_id)
--   from analytics_events where created_at > now() - interval '30 days'
--   group by 1 order by 2 desc;
--
-- Day-7 retention (devices first seen ≥7 days ago that came back on day 7±1):
--   with first_seen as (
--     select device_id, min(created_at)::date f from analytics_events group by 1)
--   select count(*) filter (where r.device_id is not null)::float / count(*) as d7
--   from first_seen fs
--   left join lateral (
--     select device_id from analytics_events e
--     where e.device_id = fs.device_id
--       and e.created_at::date between fs.f + 6 and fs.f + 8 limit 1) r on true
--   where fs.f <= current_date - 8;
