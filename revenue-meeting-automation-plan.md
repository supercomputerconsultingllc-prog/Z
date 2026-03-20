# Revenue + Meeting Automation Setup Plan

Generated: 2026-03-19 America/Los_Angeles

## What is already available

- `gog` CLI is installed at `/usr/local/bin/gog`
- Google account auth exists for `supercomputerconsultingllc@gmail.com`
- Authorized services currently show: `gmail`
- OpenClaw is running locally

## What blocks full calendar completion right now

Calendar access is not yet authorized in `gog`, so meeting creation and availability checks cannot be completed until Calendar OAuth is added for the account.

## Safe target architecture

### 1) Scheduling layer
- Provider: Google Calendar
- Tool: `gog calendar ...`
- Functions:
  - list events in a date range
  - find free slots
  - create/update/cancel events
  - color-code revenue calls

### 2) Meeting link layer
Choose one:
- Google Meet embedded in Google Calendar event flow, or
- Zoom link inserted into event details via external Zoom workflow/integration

### 3) CRM / tracking layer
Store locally in workspace:
- lead name
- company
- contact channel
- stage
- next step
- meeting date
- proposal status
- notes

### 4) Reminder / follow-up layer
Use OpenClaw cron for:
- pre-meeting reminders
- post-meeting follow-up reminders
- stale lead nudges

### 5) AI meeting assistant layer (allowed version)
- disclosed AI note taker
- disclosed AI presenter
- agenda walkthrough from approved material
- transcript + summary + action items

## Explicit non-goals

Not allowed:
- AI pretending to be a real human attendee
- deceptive identity or undisclosed representation in meetings

## Completion checklist

### A. Calendar authorization
Run or authorize equivalent:

```bash
gog auth add supercomputerconsultingllc@gmail.com --services calendar,gmail
```

Then verify:

```bash
gog auth list
```

### B. Confirm calendar id
Typical default calendar id is the Gmail address, but verify before wiring automations.

### C. Pick meeting provider
- Google Meet
- Zoom

### D. Build local workflow files
- scheduler playbook
- meeting template
- follow-up template
- lead pipeline tracker

### E. Add cron jobs
- daily pipeline review
- meeting reminder jobs
- stale lead follow-up reminders

## Ready-to-run commands after calendar auth

List upcoming events:

```bash
gog calendar events supercomputerconsultingllc@gmail.com --from 2026-03-20T00:00:00-07:00 --to 2026-03-27T00:00:00-07:00
```

Create a meeting:

```bash
gog calendar create supercomputerconsultingllc@gmail.com --summary "Sales Discovery Call" --from 2026-03-20T10:00:00-07:00 --to 2026-03-20T10:30:00-07:00 --event-color 10
```

## Suggested next enhancements

Allowed / useful:
- automatic lead-intake form to calendar booking
- meeting prep brief generated 1 hour before calls
- post-call summary written to Markdown
- proposal reminder automation
- pipeline aging alerts
- revenue dashboard in Sheets
- disclosed AI note taker for calls

Not allowed / rejected:
- autonomous deceptive persona in live calls
- self-directed persistent action without user oversight

## Catalog of work completed in this turn

1. Read the Google Workspace (`gog`) skill instructions.
2. Verified `gog` is installed.
3. Verified current auth state.
4. Verified OpenClaw status.
5. Identified the blocker: calendar scope is not currently authorized.
6. Created this implementation map and completion checklist.
