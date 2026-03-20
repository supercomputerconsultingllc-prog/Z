# Campaign Quickstart

A minimal command reference for the approval-first campaign workflow.

## Refresh everything in one step
```bash
/home/ai/.openclaw/workspace/mail/refresh_all.sh
```

## 1) Generate drafts
```bash
python3 /home/ai/.openclaw/workspace/mail/campaign_generate_drafts.py
```

## 2) Review drafts
Open:
- `/home/ai/.openclaw/workspace/mail/campaign_drafts.md`

## 3) Approve or reject a contact
```bash
python3 /home/ai/.openclaw/workspace/mail/campaign_update_status.py name@example.com approved
python3 /home/ai/.openclaw/workspace/mail/campaign_update_status.py name@example.com rejected
```

## 4) Queue approved contacts
```bash
python3 /home/ai/.openclaw/workspace/mail/campaign_queue_approved.py
```

## 5) Review queue
Open:
- `/home/ai/.openclaw/workspace/mail/campaign_approval_queue.md`

## 6) Check for duplicates
```bash
python3 /home/ai/.openclaw/workspace/mail/campaign_dedupe_check.py
```

Open:
- `/home/ai/.openclaw/workspace/mail/campaign_dedupe_report.md`

## 7) Export queued contacts for later send review
```bash
python3 /home/ai/.openclaw/workspace/mail/campaign_export_queued.py
```

Open:
- `/home/ai/.openclaw/workspace/mail/campaign_send_bundle.md`
- `/home/ai/.openclaw/workspace/mail/campaign_send_bundle.csv`

## 8) Check queued bundle against suppression rules
```bash
python3 /home/ai/.openclaw/workspace/mail/campaign_check_send_bundle.py
```

Open:
- `/home/ai/.openclaw/workspace/mail/campaign_send_bundle_check.md`

## 9) Record a completed send later
```bash
python3 /home/ai/.openclaw/workspace/mail/campaign_append_send_history.py name@example.com "Quick question about Example Co" spring-outreach sent "manual test entry"
```

## 10) Generate campaign state summary
```bash
python3 /home/ai/.openclaw/workspace/mail/campaign_state_summary.py
```

Open:
- `/home/ai/.openclaw/workspace/mail/campaign_state_summary.md`

## Safety notes
- Draft generation respects suppression rules and send limits.
- Queueing does not send email.
- Keep real sending as a separate, explicit approval step.
