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
