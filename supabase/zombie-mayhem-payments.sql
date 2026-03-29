-- Zombie Mayhem verified payment flow
-- Apply after zombie-mayhem-schema.sql
-- Purpose: support server-verified coin purchases and idempotent coin grants.

create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  player_profile_id uuid references public.player_profiles(id) on delete cascade,
  player_email text not null,
  pack_id text not null,
  coin_amount integer not null check (coin_amount > 0),
  usd_price numeric(10,2) not null check (usd_price > 0),
  provider text not null default 'coinbase',
  provider_checkout_id text,
  provider_checkout_url text,
  provider_charge_id text,
  provider_event_id text,
  status text not null default 'pending' check (status in ('pending', 'checkout_created', 'paid', 'failed', 'expired', 'cancelled')),
  granted boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  granted_at timestamptz
);

create index if not exists idx_purchase_orders_player_email
  on public.purchase_orders (player_email);

create index if not exists idx_purchase_orders_status
  on public.purchase_orders (status);

create unique index if not exists idx_purchase_orders_provider_charge_id
  on public.purchase_orders (provider_charge_id)
  where provider_charge_id is not null;

alter table public.player_profiles
  add column if not exists lifetime_purchased_coins integer not null default 0;

create or replace function public.touch_purchase_orders_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_purchase_orders_updated_at on public.purchase_orders;
create trigger trg_touch_purchase_orders_updated_at
before update on public.purchase_orders
for each row execute function public.touch_purchase_orders_updated_at();

create or replace function public.grant_paid_coins(p_order_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_order public.purchase_orders%rowtype;
begin
  select *
  into v_order
  from public.purchase_orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'purchase order not found';
  end if;

  if v_order.status <> 'paid' then
    raise exception 'purchase order is not marked paid';
  end if;

  if v_order.granted then
    return jsonb_build_object(
      'ok', true,
      'alreadyGranted', true,
      'orderId', v_order.id,
      'coinAmount', v_order.coin_amount
    );
  end if;

  update public.player_profiles
  set bank_coins = bank_coins + v_order.coin_amount,
      lifetime_purchased_coins = lifetime_purchased_coins + v_order.coin_amount
  where id = v_order.player_profile_id;

  update public.purchase_orders
  set granted = true,
      granted_at = now()
  where id = v_order.id;

  return jsonb_build_object(
    'ok', true,
    'alreadyGranted', false,
    'orderId', v_order.id,
    'coinAmount', v_order.coin_amount
  );
end;
$$;

alter table public.purchase_orders enable row level security;

-- Tighten these policies further once player_profiles is linked to Supabase Auth users.
create policy "players can read their own purchase orders by email"
on public.purchase_orders
for select
using (
  lower(player_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

-- Do not create client-side insert/update policies for paid order state.
-- purchase_orders should be written by trusted backend code only.
