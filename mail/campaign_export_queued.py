#!/usr/bin/env python3
import csv
from pathlib import Path

MAIL = Path('/home/ai/.openclaw/workspace/mail')
CONTACTS = MAIL / 'campaign_contacts_template.csv'
OUT_MD = MAIL / 'campaign_send_bundle.md'
OUT_CSV = MAIL / 'campaign_send_bundle.csv'


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def main():
    with CONTACTS.open(newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row.pop(None, None)

    queued = []
    for row in rows:
        if clean(row.get('status', '')) == 'queued':
            queued.append(row)

    fieldnames = ['email', 'first_name', 'last_name', 'company', 'title', 'location', 'notes', 'status', 'last_contacted']
    with OUT_CSV.open('w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in queued:
            writer.writerow({k: row.get(k, '') for k in fieldnames})

    parts = ['# Campaign Send Bundle', '']
    if not queued:
        parts.append('No queued contacts ready for export.')
    else:
        for idx, row in enumerate(queued, 1):
            parts.extend([
                f'## Queued Contact {idx}',
                f"- Email: {clean(row.get('email', ''))}",
                f"- Name: {clean(row.get('first_name', ''))} {clean(row.get('last_name', ''))}".rstrip(),
                f"- Company: {clean(row.get('company', ''))}",
                f"- Title: {clean(row.get('title', ''))}",
                f"- Location: {clean(row.get('location', ''))}",
                f"- Notes: {clean(row.get('notes', ''))}",
                '',
            ])

    OUT_MD.write_text('\n'.join(parts).rstrip() + '\n', encoding='utf-8')
    print(f'Wrote {OUT_MD} and {OUT_CSV} with {len(queued)} queued contact(s)')


if __name__ == '__main__':
    main()
