# Campaign Quickstart

A minimal command reference for the approval-first campaign workflow.

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

## Safety notes
- Draft generation respects suppression rules and send limits.
- Queueing does not send email.
- Keep real sending as a separate, explicit approval step.
