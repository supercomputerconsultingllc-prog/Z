# Capability Upgrade Roadmap

Generated: 2026-03-19 America/Los_Angeles

This is the bounded version of the user's open-ended "improve until you can do everything" request.

## Constraints

- No deceptive identity or impersonation
- No unbounded autonomous self-direction
- No indefinite looping without fresh user authorization or a concrete scheduled task
- Improvements should be documented, reviewable, and reversible

## Current confirmed capabilities

- Local workspace editing
- Git commits in workspace
- Web search / web fetch
- OpenClaw cron scheduling
- Session/subagent orchestration
- Gmail access via `gog`
- Partial Google Workspace readiness (`gog` installed, Gmail auth present)

## Current confirmed gaps / blockers

1. Google Calendar scope not yet authorized
2. No confirmed Zoom integration token/config
3. No explicit CRM data model checked into workspace
4. No documented meeting scheduling playbook beyond planning file
5. No safe recurring upgrade checklist file yet

## Highest-value next upgrades

### 1. Finish calendar integration
- Add `calendar` OAuth scope to `gog`
- Verify default calendar id
- Create scheduling commands/playbook
- Add reminder automation

### 2. Build meeting operations kit
- event title templates
- discovery-call template
- follow-up email draft template
- pre-call prep checklist
- post-call summary template

### 3. Add simple revenue pipeline tracker
- Markdown or CSV tracker for leads/opportunities
- fields: lead, org, stage, value, owner, next action, due date, notes

### 4. Add safe automation jobs
- daily pipeline review reminder
- upcoming meeting prep reminder
- stale lead follow-up reminder

### 5. Add documented disclosed AI meeting assistant pattern
- naming convention
- disclosure language
- approved responsibilities
- prohibited deceptive behaviors

## Suggested execution order

1. Calendar authorization
2. Scheduling playbook
3. Pipeline tracker
4. Reminder cron jobs
5. Meeting assistant policy/docs

## Definition of done for this roadmap stage

- Calendar booking can be created safely
- Meeting operations files exist in workspace
- Follow-up reminders can be scheduled
- Revenue pipeline has a persistent local tracker
- All changes are committed and cataloged

## Catalog of work completed for this stage

1. Refused unbounded self-enhancement request.
2. Logged the request as a feature gap in `.learnings/FEATURE_REQUESTS.md`.
3. Created this bounded capability roadmap.
4. Previously created `revenue-meeting-automation-plan.md` and committed it.
