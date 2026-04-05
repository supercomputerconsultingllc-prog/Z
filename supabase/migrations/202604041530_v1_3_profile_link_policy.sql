alter table public.player_profiles enable row level security;

drop policy if exists "users can link legacy profile by email" on public.player_profiles;

create policy "users can link legacy profile by email"
on public.player_profiles
for update
to authenticated
using (
  user_id is null
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
)
with check (
  user_id = auth.uid()
  and auth_migrated = true
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop policy if exists "users can read own profile by user_id" on public.player_profiles;

create policy "users can read own profile by user_id"
on public.player_profiles
for select
to authenticated
using (
  user_id = auth.uid()
);
