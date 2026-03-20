# Campaign Pipeline

A lightweight, approval-first outbound workflow.

## Goal
Create personalized drafts from a CSV list without sending anything automatically.

## Files
- `campaign_contacts_template.csv` - starter contact list format
- `campaign_suppression_list.csv` - do-not-contact / blocked contacts
- `campaign_send_limits.json` - batch and approval limits
- `campaign_generate_drafts.py` - creates draft markdown output for review
- `campaign_update_status.py` - update one contact status in the CSV
- `campaign_queue_approved.py` - move approved contacts into the queue
- `campaign_drafts.md` - generated draft preview file
- `campaign_approval_queue.md` - queued contacts approved for a later send step
- `campaign_quickstart.md` - minimal command reference for the workflow
- `campaign_send_history.csv` - ledger for recording future sends

## Default workflow
1. Fill in `campaign_contacts_template.csv` or copy it to a real campaign CSV.
2. Maintain `campaign_suppression_list.csv` before any real outreach.
3. Run the draft generator.
4. Review `campaign_drafts.md`.
5. Mark rows as `approved` or `rejected`.
6. Queue approved rows.
7. Only after approval should any sending flow be used.

## Status meanings
- `draft`
- `approved`
- `queued`
- `sent`
- `rejected`
- `suppressed`

## Guardrails
- No auto-send in this pipeline.
- Keep batches small at first.
- Suppression rules win over approval.
- Review personalization quality before approval.
- Respect `campaign_send_limits.json`.
