#!/usr/bin/env python3
import csv
import json
from pathlib import Path

MAIL = Path('/home/ai/.openclaw/workspace/mail')
CONTACTS = MAIL / 'campaign_contacts_template.csv'
SUPPRESSION = MAIL / 'campaign_suppression_list.csv'
LIMITS = MAIL / 'campaign_send_limits.json'
QUEUE = MAIL / 'campaign_approval_queue.md'


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def load_suppressed() -> dict:
    suppressed = {}
    with SUPPRESSION.open(newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            email = clean(row.get('email', '')).lower()
            if email:
                suppressed[email] = clean(row.get('reason', 'suppressed'))
    return suppressed


def load_limits() -> dict:
    return json.loads(LIMITS.read_text(encoding='utf-8'))


def main():
    suppressed = load_suppressed()
    limits = load_limits()
    max_queue = int(limits.get('maxApprovedToQueuePerRun', 10))

    with CONTACTS.open(newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row.pop(None, None)

    queued = []
    changed = False
    for row in rows:
        if len(queued) >= max_queue:
            break
        email = clean(row.get('email', '')).lower()
        status = clean(row.get('status', ''))
        if not email:
            continue
        if email in suppressed:
            if row.get('status') != 'suppressed':
                row['status'] = 'suppressed'
                changed = True
            continue
        if status == 'approved':
            row['status'] = 'queued'
            queued.append(row)
            changed = True

    if changed:
        with CONTACTS.open('w', newline='', encoding='utf-8') as f:
            fieldnames = [name for name in rows[0].keys() if name is not None]
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

    existing = QUEUE.read_text(encoding='utf-8') if QUEUE.exists() else '# Campaign Approval Queue\n\n'
    parts = [existing.rstrip(), '']
    for row in queued:
        parts.extend([
            f"## {row.get('email', '').strip()}",
            f"- Status: queued",
            f"- Company: {clean(row.get('company', ''))}",
            f"- Contact: {clean(row.get('first_name', ''))} {clean(row.get('last_name', ''))}".rstrip(),
            '',
        ])

    QUEUE.write_text('\n'.join(parts).rstrip() + '\n', encoding='utf-8')
    print(f'Queued {len(queued)} approved contacts')


if __name__ == '__main__':
    main()
