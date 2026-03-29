-- Zombie Mayhem cloud save schema
-- Apply in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.player_profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  best integer not null default 0,
  bank_coins integer not null default 0,
  avatar_coins integer not null default 0,
  selected_avatar text not null default 'default',
  unlocked_avatars jsonb not null default '["default"]'::jsonb,
  mission_index integer not null default 0,
  mission_progress integer not null default 0,
  pass_level integer not null default 1,
  pass_xp integer not null default 0,
  total_runs integer not null default 0,
  youtube_visit_claimed boolean not null default false,
  youtube_subscribe_claimed boolean not null default false,
  starter_pack_claimed boolean not null default false,
  gun_price integer not null default 10,
  squad_price integer not null default 8,
  revive_price integer not null default 15,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_player_profiles_email on public.player_profiles (email);

create or replace function public.touch_player_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_player_profiles_updated_at on public.player_profiles;
create trigger trg_touch_player_profiles_updated_at
before update on public.player_profiles
for each row execute function public.touch_player_profiles_updated_at();
