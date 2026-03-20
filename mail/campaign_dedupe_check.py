#!/usr/bin/env python3
import csv
from collections import defaultdict
from pathlib import Path

MAIL = Path('/home/ai/.openclaw/workspace/mail')
CONTACTS = MAIL / 'campaign_contacts_template.csv'
REPORT = MAIL / 'campaign_dedupe_report.md'


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def main():
    buckets = defaultdict(list)
    with CONTACTS.open(newline='', encoding='utf-8') as f:
        for idx, row in enumerate(csv.DictReader(f), 2):
            email = clean(row.get('email', '')).lower()
            if not email:
                continue
            row.pop(None, None)
            buckets[email].append({
                'line': idx,
                'status': clean(row.get('status', '')),
                'company': clean(row.get('company', '')),
                'name': f"{clean(row.get('first_name', ''))} {clean(row.get('last_name', ''))}".strip(),
            })

    dupes = {email: rows for email, rows in buckets.items() if len(rows) > 1}

    parts = ['# Campaign Dedupe Report', '']
    if not dupes:
        parts.append('No duplicate email addresses found.')
    else:
        for email, rows in sorted(dupes.items()):
            parts.extend([f'## {email}', ''])
            for row in rows:
                parts.append(
                    f"- line {row['line']}: {row['name'] or '(no name)'} | {row['company'] or '(no company)'} | status={row['status'] or '(blank)'}"
                )
            parts.append('')

    REPORT.write_text('\n'.join(parts).rstrip() + '\n', encoding='utf-8')
    print(f'Wrote {REPORT} with {len(dupes)} duplicate group(s)')


if __name__ == '__main__':
    main()
