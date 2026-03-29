# Zombie Mayhem cloud save backend

This folder is the first real backend step for cross-device save support.

## What this solves

The current site on GitHub Pages can now do browser-local accounts, but true cross-device accounts need a remote backend.

This Supabase-ready schema is for storing:
- coins
- best distance
- pass level / XP
- avatar unlocks
- mission progress
- upgrade pricing / progression state

## Next implementation steps

1. Create a Supabase project
2. Run `zombie-mayhem-schema.sql`
3. Add an auth/save API layer or edge functions
4. Update `docs/index.html` to call the real API instead of browser-local account storage
5. Migrate existing local accounts into remote profiles on sign-in

## Recommended API surface

- `POST /account/signup`
- `POST /account/login`
- `POST /account/logout`
- `GET /profile`
- `POST /profile/save`
- `POST /profile/import-guest`

## Important note

The current in-game account system is local-only. This backend folder is the bridge to make those accounts real across devices.
