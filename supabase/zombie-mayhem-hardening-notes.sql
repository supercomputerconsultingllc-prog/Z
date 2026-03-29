-- Zombie Mayhem hardening follow-up
-- This is the next backend step after the current shipped prototype.
-- Purpose: move away from client-trusted coin/progression writes.

-- Recommended future changes:
-- 1. Add a user_id UUID linked to Supabase Auth users.
-- 2. Enable row-level security on player_profiles.
-- 3. Replace direct client upserts with RPC/functions that validate reward increments.
-- 4. Store daily reward claim date and achievement unlock flags in dedicated columns.
-- 5. Add password reset through Supabase Auth instead of profile-secret updates.

-- Example future columns:
-- alter table public.player_profiles add column if not exists daily_reward_claimed_on date;
-- alter table public.player_profiles add column if not exists achievement_flags jsonb not null default '[]'::jsonb;
-- alter table public.player_profiles add column if not exists lifetime_coins integer not null default 0;
