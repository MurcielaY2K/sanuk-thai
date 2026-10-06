-- Thai App — Premium entitlements (server-verified via Stripe webhook)
-- Run in Supabase: SQL Editor → New query → paste → Run
-- See docs/PAYMENTS_SETUP.md for the full deployment guide.

create table if not exists public.entitlements (
  auth_id                uuid primary key references auth.users(id) on delete cascade,
  status                 text not null default 'none'
                         check (status in ('none', 'active', 'past_due', 'canceled')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  current_period_end     timestamptz,
  updated_at             timestamptz default now()
);

-- Only the webhook (service role) writes; clients may read their own row.
alter table public.entitlements enable row level security;

create policy "owner read entitlement" on public.entitlements
  for select using (auth.uid() = auth_id);

-- No insert/update/delete policies on purpose: the Stripe webhook Edge
-- Function uses the service role key, which bypasses RLS. Clients cannot
-- grant themselves Premium.

-- Look up rows quickly by Stripe ids when subscription events arrive.
create index if not exists entitlements_subscription_idx
  on public.entitlements (stripe_subscription_id);
create index if not exists entitlements_customer_idx
  on public.entitlements (stripe_customer_id);

-- ---------------------------------------------------------------------------
-- AUDIT I3: payments that arrive without an app user id
-- ---------------------------------------------------------------------------
-- If the app could not attach client_reference_id (Supabase unreachable when
-- checkout opened), the webhook first tries to match the buyer's Stripe email
-- to an account's linked email; failing that, it parks the payment here so a
-- paying customer is never silently left without Premium.
--
-- Review:   select * from public.unlinked_payments where resolved_at is null;
-- Resolve:  insert into public.entitlements (auth_id, status, stripe_customer_id,
--             stripe_subscription_id, current_period_end)
--           values ('<auth uuid>', 'active', '<cus_…>', '<sub_… or null>', null)
--           on conflict (auth_id) do update set status = 'active';
--           update public.unlinked_payments set resolved_at = now() where id = <id>;
create table if not exists public.unlinked_payments (
  id                     bigint generated always as identity primary key,
  stripe_session_id      text unique not null,
  stripe_customer_id     text,
  stripe_subscription_id text,
  customer_email         text,
  amount_total           bigint,
  currency               text,
  reason                 text not null,
  created_at             timestamptz not null default now(),
  resolved_at            timestamptz
);
-- RLS on with no policies: service role (webhook, dashboard) only.
alter table public.unlinked_payments enable row level security;

-- Email → auth user id, for the webhook's fallback match. auth.users is not
-- exposed through the API, so this is SECURITY DEFINER — and therefore
-- executable by the service role ONLY (it would otherwise be an account-
-- enumeration oracle for anyone holding the public anon key).
create or replace function public.auth_id_for_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = public, auth
as $$
  select id from auth.users
  where lower(email) = lower(p_email) and email_confirmed_at is not null
  limit 1;
$$;
revoke all on function public.auth_id_for_email(text) from public, anon, authenticated;
grant execute on function public.auth_id_for_email(text) to service_role;
