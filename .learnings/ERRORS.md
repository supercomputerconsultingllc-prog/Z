# ERRORS
## [ERR-20260327-001] zombie-squad-run-audio-freeze

**Logged**: 2026-03-28T03:39:00Z
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
Game likely froze because minigun called the normal firing path every frame, causing excessive audio node, bullet, and particle creation.

### Error
```
Observed symptom: game froze after running for a bit following recent music/minigun additions.
```

### Context
- Operation attempted: playing Zombie Squad Run after adding epic music and minigun effects
- Likely cause: per-frame fireAtLane calls during minigun active state created too many bullets, particles, and Web Audio nodes

### Suggested Fix
Throttle minigun burst generation, suppress normal per-shot vibration/audio for minigun bursts, and cap particle/bullet arrays.

### Metadata
- Reproducible: unknown
- Related Files: apps/zombie-squad-run/index.html

---
## [ERR-20260327-002] validation-command-python-missing

**Logged**: 2026-03-28T03:44:00Z
**Priority**: low
**Status**: pending
**Area**: infra

### Summary
Tried to use python for a quick HTML script extraction check, but python was not installed in this environment.

### Error
```
/bin/bash: line 1: python: command not found
```

### Context
- Operation attempted: syntax validation of embedded script in apps/zombie-squad-run/index.html
- Environment detail: Node available, python missing

### Suggested Fix
Prefer node-only extraction/validation commands in this workspace.

### Metadata
- Reproducible: yes
- Related Files: apps/zombie-squad-run/index.html

---
