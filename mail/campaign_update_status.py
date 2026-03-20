#!/usr/bin/env python3
import csv
import sys
from pathlib import Path

MAIL = Path('/home/ai/.openclaw/workspace/mail')
CSV_PATH = MAIL / 'campaign_contacts_template.csv'


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def main():
    if len(sys.argv) < 3:
        raise SystemExit('Usage: campaign_update_status.py <email> <status>')

    target_email = clean(sys.argv[1]).lower()
    new_status = clean(sys.argv[2])
    rows = list(csv.DictReader(CSV_PATH.open(newline='', encoding='utf-8')))
    if not rows:
        raise SystemExit('No rows found')

    updated = False
    fieldnames = [name for name in rows[0].keys() if name is not None]
    for row in rows:
        row.pop(None, None)
    for row in rows:
        email = clean(row.get('email', '')).lower()
        if email == target_email:
            row['status'] = new_status
            updated = True

    if not updated:
        raise SystemExit(f'Email not found: {target_email}')

    with CSV_PATH.open('w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f'Updated {target_email} -> {new_status}')


if __name__ == '__main__':
    main()
