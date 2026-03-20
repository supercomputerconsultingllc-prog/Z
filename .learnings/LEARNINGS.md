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

## [LRN-20260320-007] best_practice

**Logged**: 2026-03-20T07:37:00-07:00
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
When asked for autonomous self-prompting, provide a bounded one-step improvement runner instead of an open-ended loop.

### Details
A direct self-prompt loop can become unbounded and hard to audit. A safer pattern is to generate one concrete next-improvement prompt from current workspace state, require testing, and stop after a single step.

### Suggested Action
Use bounded improvement helpers that surface one next action, plus explicit stop conditions.

### Metadata
- Source: conversation
- Related Files: scripts/next_improvement_prompt.py, scripts/run_bounded_improvement.sh, HEARTBEAT.md
- Tags: autonomy, bounded-loop, process, safety

---

## [LRN-20260320-008] best_practice

**Logged**: 2026-03-20T07:39:00-07:00
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
When capability catalogs are hand-maintained, add a refresh script so the machine-readable registry can be regenerated reliably.

### Details
After adding a persistent capability catalog, the next weak point was drift between real workspace skills and `capabilities.json`. A refresh helper reduces manual update mistakes and pairs naturally with the audit script.

### Suggested Action
Keep both a refresh step and an audit step for capability metadata so changes can be regenerated and then verified.

### Metadata
- Source: conversation
- Related Files: scripts/refresh_capabilities.py, scripts/audit_capabilities.py, capabilities.json
- Tags: capability-audit, refresh, automation, hardening

---

## [LRN-20260320-009] best_practice

**Logged**: 2026-03-20T07:39:30-07:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
When adding multiple helper scripts in one workflow, add a quickstart so the operating sequence is obvious.

### Details
The campaign tooling had grown to several scripts and control files, but the exact run order still had to be inferred from longer docs. A short quickstart reduces friction and lowers the chance of using the right tools in the wrong order.

### Suggested Action
Add a compact command reference whenever a workflow spans more than two helper scripts.

### Metadata
- Source: conversation
- Related Files: mail/campaign_quickstart.md, mail/campaign_pipeline.md
- Tags: docs, quickstart, workflow, usability

---

## [LRN-20260320-010] best_practice

**Logged**: 2026-03-20T07:40:00-07:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
Approval-first outreach workflows should reserve a simple send-history ledger before any real send step exists.

### Details
The campaign flow already had drafts, approvals, queueing, and limits, but no dedicated ledger for recording what was eventually sent. Adding a lightweight CSV now makes later send tooling easier to audit.

### Suggested Action
Add a simple history file early in campaign workflows so send operations have an obvious place to append records.

### Metadata
- Source: conversation
- Related Files: mail/campaign_send_history.csv, mail/campaign_pipeline.md
- Tags: campaign, ledger, auditability, workflow

---

## [LRN-20260320-011] best_practice

**Logged**: 2026-03-20T07:41:00-07:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
Approval-first outreach workflows should check for duplicate contacts before queueing or sending.

### Details
The campaign tooling had drafts, approvals, suppression, limits, queueing, and history scaffolding, but no duplicate-contact check. Adding a simple dedupe report reduces the chance of contacting the same address twice from a messy list.

### Suggested Action
Run a duplicate-email check as part of campaign review before queueing approved contacts.

### Metadata
- Source: conversation
- Related Files: mail/campaign_dedupe_check.py, mail/campaign_dedupe_report.md, mail/campaign_quickstart.md
- Tags: campaign, dedupe, quality-control, workflow

---

## [LRN-20260320-012] best_practice

**Logged**: 2026-03-20T07:42:00-07:00
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
Assistant improvements should include a lightweight business-ops layer, not just outreach mechanics.

### Details
A useful assistant for revenue work needs more than campaign scripts. It also benefits from simple opportunity tracking, follow-up timing, dashboarding, and explicit next actions. Adding a small `business/` layer makes the system more generally useful for assistant-style operations without requiring full CRM infrastructure.

### Suggested Action
Maintain a lightweight business-ops layer that tracks opportunities, follow-ups, dashboard state, and next actions.

### Metadata
- Source: conversation
- Related Files: business/opportunities.csv, business/followups.csv, business/dashboard.md, business/next_actions.md
- Tags: business-ops, assistant, revenue-support, workflow

---

## [LRN-20260320-013] best_practice

**Logged**: 2026-03-20T07:42:30-07:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
If a dashboard is backed by structured files, add a refresh script so the human-readable view can be regenerated reliably.

### Details
The business layer added useful CSV trackers and a dashboard, but the dashboard was still a hand-maintained snapshot. A refresh helper makes it easier to keep the summary aligned with underlying state.

### Suggested Action
For every human-readable dashboard backed by CSV or JSON state, add a small refresh script and smoke-test the generated output.

### Metadata
- Source: conversation
- Related Files: business/refresh_dashboard.py, business/dashboard.md
- Tags: dashboard, refresh, business-ops, automation

---

## [LRN-20260320-014] best_practice

**Logged**: 2026-03-20T07:43:00-07:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
Structured ops layers benefit from both a detailed dashboard and a terse state summary.

### Details
A dashboard is useful for human review, but a compact summary is better for quick checks and future automation. Adding a summary script creates a second, lighter view over the same business state.

### Suggested Action
When building lightweight operational systems, provide both a detailed human-readable view and a short summary view.

### Metadata
- Source: conversation
- Related Files: business/state_summary.py, business/state_summary.md, business/dashboard.md
- Tags: business-ops, summary, dashboard, usability

---

## [LRN-20260320-015] correction

**Logged**: 2026-03-20T07:46:00-07:00
**Priority**: medium
**Status**: pending
**Area**: docs

### Summary
Queueing workflows should be idempotent, and queued contacts should be exportable into a clean review bundle.

### Details
While looking for new missing capabilities, the approval queue already contained a duplicate contact entry. The fix was to make queue insertion idempotent by checking existing queue headers before appending, and to add an exporter that turns queued contacts into clean markdown and CSV send bundles for later review.

### Suggested Action
When adding queue-based workflows, ensure repeat runs do not duplicate queue entries and provide a clean export step for downstream review.

### Metadata
- Source: conversation
- Related Files: mail/campaign_queue_approved.py, mail/campaign_export_queued.py, mail/campaign_send_bundle.md, mail/campaign_send_bundle.csv
- Tags: queueing, idempotency, export, campaign

---

## [LRN-20260320-016] best_practice

**Logged**: 2026-03-20T07:47:00-07:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
If a workflow has a send-history ledger, add a helper to append records consistently instead of relying on manual CSV edits.

### Details
The campaign system already had a send-history CSV, but no supported way to add rows. A tiny append helper makes the ledger actually usable and reduces formatting mistakes in manual edits.

### Suggested Action
Whenever you add a ledger file for an operational workflow, also add the smallest practical write helper for it.

### Metadata
- Source: conversation
- Related Files: mail/campaign_append_send_history.py, mail/campaign_send_history.csv
- Tags: ledger, helper, campaign, auditability

---

## [LRN-20260320-017] best_practice

**Logged**: 2026-03-20T07:48:00-07:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
Campaign tooling benefits from its own compact state summary, not just per-file helpers.

### Details
The campaign system had multiple useful files and helpers, but no single compact status view. Adding a summary script makes it easier to inspect campaign health quickly without reading several files separately.

### Suggested Action
For multi-file workflows, add a summary view once the file count and helper count start to grow.

### Metadata
- Source: conversation
- Related Files: mail/campaign_state_summary.py, mail/campaign_state_summary.md
- Tags: campaign, summary, reporting, workflow

---

## [LRN-20260320-018] best_practice

**Logged**: 2026-03-20T07:49:00-07:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
If a workflow keeps a hand-written next-actions file, add a refresh helper once the source-of-truth data becomes structured.

### Details
The business ops layer had CSV trackers plus a manually maintained `next_actions.md`. Once opportunity and follow-up state lived in structured files, it made sense to generate the action list from those sources instead of relying on hand edits.

### Suggested Action
When operational state is already structured, derive next-action summaries from it rather than duplicating maintenance manually.

### Metadata
- Source: conversation
- Related Files: business/refresh_next_actions.py, business/next_actions.md
- Tags: next-actions, refresh, business-ops, automation

---

## [LRN-20260320-019] best_practice

**Logged**: 2026-03-20T07:50:00-07:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
If the system grows across multiple helper layers, add a self-check so core capabilities can be verified quickly.

### Details
The workspace now includes capability metadata, improvement tooling, campaign tooling, and business-ops tooling. A lightweight self-check script makes it easier to confirm that key files still exist and that the core operating layers are intact.

### Suggested Action
Add a simple self-check once the workspace has multiple interdependent helper layers.

### Metadata
- Source: conversation
- Related Files: scripts/self_check.py, CAPABILITIES.md
- Tags: self-check, reliability, assistant, maintenance

---

## [LRN-20260320-020] best_practice

**Logged**: 2026-03-20T07:50:00-07:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
When a workflow gains multiple refresh helpers, add a quickstart so the recommended refresh order is obvious.

### Details
The business-ops layer had several refresh and summary scripts, but no short command reference explaining how to use them together. A small quickstart makes the operating sequence easier to follow.

### Suggested Action
Add a quickstart once a workflow has more than one refresh or reporting helper.

### Metadata
- Source: conversation
- Related Files: business/quickstart.md, business/README.md
- Tags: quickstart, business-ops, workflow, usability

---

## [LRN-20260320-021] best_practice

**Logged**: 2026-03-20T07:51:00-07:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
When a workflow has multiple refresh commands, add a single wrapper to refresh them together.

### Details
The business layer had separate refresh commands for the dashboard, next actions, and state summary. Adding one wrapper script reduces friction and makes the common maintenance path easier to run consistently.

### Suggested Action
Bundle multi-step refresh flows into a single convenience script once the component commands are stable.

### Metadata
- Source: conversation
- Related Files: business/refresh_all.sh, business/quickstart.md
- Tags: refresh, wrapper, business-ops, usability

---
