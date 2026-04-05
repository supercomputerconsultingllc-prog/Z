alter table public.player_profiles
add column if not exists user_id uuid references auth.users(id) on delete cascade;

create unique index if not exists idx_player_profiles_user_id
on public.player_profiles (user_id)
where user_id is not null;

create index if not exists idx_player_profiles_email
on public.player_profiles (email);

alter table public.player_profiles
add column if not exists auth_migrated boolean not null default false;
