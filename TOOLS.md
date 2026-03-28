# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

## GitHub Notes

- GitHub Actions only detects workflows from the repo root: `.github/workflows/`, not nested app folders.
- For GitHub Pages with source `main / docs`, files under `docs/` publish at the site root. Example: `docs/support/index.html` becomes `/support/`, not `/docs/support/`.
- If the live site is not reflecting app changes, verify the real deploy target before editing. In this workspace, the published Zombie Squad Run page was serving `docs/index.html`, while gameplay edits were initially being made in `apps/zombie-squad-run/index.html`.
- PATs that push workflow file changes need workflow permission. A classic token with `repo` and `workflow` scopes works when fine-grained tokens are too narrow.

---

Add whatever helps you do your job. This is your cheat sheet.
