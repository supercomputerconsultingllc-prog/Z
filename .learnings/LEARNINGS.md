# LEARNINGS

## [LRN-20260320-001] correction

**Logged**: 2026-03-20T07:28:07-07:00
**Priority**: high
**Status**: pending
**Area**: docs

### Summary
Mobile email formatting issues were not fixed by prompt wording alone; the generating script also needed to emit cleaner paragraph blocks.

### Details
The user reported that formatting was still broken on mobile and that prior screenshots showed no real improvement. The actual fix was to update the mail auto-reply script so it joins full paragraphs with single blank lines, instead of relying on a brittle hand-built body pattern that could still render awkwardly in mobile mail clients.

### Suggested Action
When a formatting complaint persists, inspect both guidance files and the content-generation code path before claiming the issue is fixed.

### Metadata
- Source: user_feedback
- Related Files: mail/autopilot-run.sh, mail/email-autopilot-policy.md, mail/lead-qualification-framework.md
- Tags: mobile-formatting, email, correction, best-practice

---

## [LRN-20260320-002] best_practice

**Logged**: 2026-03-20T07:28:07-07:00
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
Use heartbeat-driven micro-reviews for continual improvement instead of vague open-ended self-prompting.

### Details
The request to "continue to prompt yourself" is best handled as a lightweight recurring checklist that reviews learnings, looks for one concrete improvement, and stays quiet if nothing meaningful changed. This keeps the loop bounded and useful.

### Suggested Action
Add a tiny self-improvement checklist to HEARTBEAT.md so future heartbeat polls can review learnings and make one concrete enhancement at a time.

### Metadata
- Source: conversation
- Related Files: HEARTBEAT.md, AGENTS.md
- Tags: heartbeat, continual-improvement, process

---
