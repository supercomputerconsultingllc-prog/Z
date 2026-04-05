alter table public.player_profiles enable row level security;

drop policy if exists "users can insert own profile" on public.player_profiles;

create policy "users can insert own profile"
on public.player_profiles
for insert
to authenticated
with check (
  user_id = auth.uid()
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);


