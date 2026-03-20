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

## [LRN-20260320-003] best_practice

**Logged**: 2026-03-20T07:28:07-07:00
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
Shared formatting rules should live in one helper when generated message bodies may grow over time.

### Details
After the initial mobile-format fix, the next hardening step was to centralize plain-text paragraph joining in a helper function. That makes future email body changes less likely to reintroduce stray spacing or inconsistent paragraph separators.

### Suggested Action
Use a small helper for generated message-body assembly whenever multiple templates may evolve in the same script.

### Metadata
- Source: conversation
- Related Files: mail/autopilot-run.sh
- Tags: formatting, email, hardening, maintainability

---

## [LRN-20260320-004] best_practice

**Logged**: 2026-03-20T07:30:00-07:00
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
Capability lists should be persisted in workspace files, not only answered ad hoc in chat.

### Details
A chat-only capability summary can omit tools or blur the distinction between installed local skills and globally available skills. Adding a persistent catalog and gap file makes future audits more reliable and easier to update.

### Suggested Action
Maintain `CAPABILITIES.md`, `CAPABILITY_GAPS.md`, and a machine-readable `capabilities.json` whenever the environment meaningfully changes.

### Metadata
- Source: conversation
- Related Files: CAPABILITIES.md, CAPABILITY_GAPS.md, capabilities.json
- Tags: catalog, capability-audit, documentation, process

---

## [LRN-20260320-005] best_practice

**Logged**: 2026-03-20T07:33:00-07:00
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
New helper scripts should be smoke-tested immediately, because formatting bugs often show up in first-run output.

### Details
After adding the outbound campaign draft generator, the first smoke test showed note text merging awkwardly with the following sentence. A quick test-run exposed and fixed it before the workflow was relied on.

### Suggested Action
Whenever adding a new script or automation helper, run it once with sample data and patch any output-quality issues immediately.

### Metadata
- Source: conversation
- Related Files: mail/campaign_generate_drafts.py, mail/campaign_drafts.md
- Tags: testing, smoke-test, formatting, automation

---

## [LRN-20260320-006] correction

**Logged**: 2026-03-20T07:35:00-07:00
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
CSV-based helpers should defensively ignore stray columns and malformed sample rows.

### Details
The first pass of the campaign status/queue flow exposed a malformed CSV sample row with an extra trailing column. That produced a `None` key in `csv.DictReader` output and leaked junk back into the file on rewrite. The fix was to correct the sample and harden the scripts to drop `None` keys before writing.

### Suggested Action
When using CSV helpers, normalize rows before writing and test the update path, not just the read path.

### Metadata
- Source: conversation
- Related Files: mail/campaign_contacts_template.csv, mail/campaign_update_status.py, mail/campaign_queue_approved.py
- Tags: csv, hardening, campaign, correction

---
