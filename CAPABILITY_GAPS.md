# CAPABILITY_GAPS.md

This file tracks what was missing from the prior chat catalog, plus what would be useful to add next.

## Missing from the prior catalog

### Omitted existing functions
- `process` was not listed explicitly
- the distinction between local workspace skills and globally available skills was not clear
- installed-vs-available skills were mixed together

### Missing operational assets
- no persistent capability catalog file in the workspace
- no persistent gap list for future upgrades
- no reusable request examples for common tasks

## Good additions to add now
These were feasible immediately inside the workspace.

1. `CAPABILITIES.md`
   - Persistent catalog of tools, skills, and guardrails
2. `CAPABILITY_GAPS.md`
   - Persistent list of omissions and next additions
3. `PROMPT_RECIPES.md`
   - Ready-to-use examples for asking for email, scheduling, research, and automation work
4. `capabilities.json`
   - Machine-readable registry for future scripts and audits
5. `scripts/audit_capabilities.py`
   - Self-audit script for capability drift detection
6. Basic outbound campaign skeleton
   - contact CSV template
   - draft generator
   - approval-first workflow doc
7. Campaign controls
   - suppression list
   - send limits
   - approval queue
   - status updater

## Good additions to add later, likely requiring more setup
These are useful but may require credentials, external installs, or explicit user approval.

1. Email campaign pipeline
   - CSV/list ingestion
   - personalization variables
   - suppression list support
   - approval queue before sending
2. Contact and campaign memory store
   - recipient history
   - sent/follow-up state
   - dedupe logic
3. Safer outbound controls
   - max-send/day limits
   - domain/mailbox throttling
   - auto-pause on errors or bounce signals
4. More integrations
   - CRM sync
   - browser automation if added to the environment
   - spreadsheet-driven outreach workflows
5. Automatic capability audit
   - compare configured tools/skills with catalog
   - flag omissions after environment changes
