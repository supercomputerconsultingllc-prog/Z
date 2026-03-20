# Campaign Pipeline

A lightweight, approval-first outbound workflow.

## Goal
Create personalized drafts from a CSV list without sending anything automatically.

## Files
- `campaign_contacts_template.csv` - starter contact list format
- `campaign_generate_drafts.py` - creates draft markdown output for review
- `campaign_drafts.md` - generated draft preview file

## Default workflow
1. Fill in `campaign_contacts_template.csv` or copy it to a real campaign CSV.
2. Run the draft generator.
3. Review `campaign_drafts.md`.
4. Approve, edit, or reject drafts.
5. Only after approval should any sending flow be used.

## Guardrails
- No auto-send in this pipeline.
- Keep batches small at first.
- Add suppression or do-not-contact rules before any real sending.
- Review personalization quality before approval.
