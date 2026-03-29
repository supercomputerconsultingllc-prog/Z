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
- For syntax-checking JavaScript extracted from inline HTML `<script>` tags, write the extracted code to a real temp file first, then run `node --check /tmp/file.js`. In this shell/runtime, `node --check <( ... )` can fail on the process-substitution path.
- When refactoring JavaScript threshold logic, declare derived mode flags before any expression that uses them. A later `const` like `dotArmyMode` cannot be referenced earlier in the same block without triggering a runtime error.
- For milestone game builds, create both a workspace snapshot folder under `backups/<name>/` and a matching git tag (for example `zombie-squad-run-v1.1`) before pushing. That gives a fast file restore path and a clean git restore path.
- For GitHub CLI device login, treat the one-time code as short-lived. After `gh auth login` shows the code, open `https://github.com/login/device` immediately and complete approval before trying other commands, or the code may expire and mislead the next troubleshooting step.
- In this WSL/workspace runtime, prefer `python3` over `python` for ad hoc scripts. `python` may be missing even when Node and other tooling are present.
- For hot JavaScript update/render loops, avoid `filter(...)/sort(...)` and other temporary-array patterns in the per-frame path when an in-place write-index loop or single-pass scan will do. This reduces allocation churn and late-run lag without changing visuals.
- For browser-game audio changes, distinguish between synth scheduling tweaks and actual source replacement. If the goal is a recognizably different song, swap in a bundled audio asset and verify the live code path points only to that file, not a fallback synth implementation.
- For browser-game audio UX, keep music and SFX on separate volume controls when possible. This avoids the common failure mode where imported background music is technically working but still feels broken because weapon sounds dominate the mix.
- For fast-moving HUD/layout regressions in a working browser game, restore the exact known-good game file first, then reapply one small layout change at a time. Do not stack multiple HUD experiments before the last working state is verified in the browser.
- For milestone browser-game releases, treat remote tags as immutable unless you deliberately mean to force-move them. If `git push --tags` says a tag already exists remotely, stamp a new version tag instead of assuming the old one can be reused.
- For pause UX on canvas-based games, do not rely on painted text alone for paused state. Provide a real overlay with resume/unpause and restart actions so users are not stranded when input focus or layout changes.
- For browser Web Audio changes, do not claim the audible result is confirmed unless it was actually heard by the user or verified with real browser audio output. Distinguish syntax/deploy confirmation from sound confirmation, and when rescheduling looped music add a dedicated music bus or other clean stop path so old scheduled notes do not overlap or glitch.

---

Add whatever helps you do your job. This is your cheat sheet.
