#!/usr/bin/env python3
import csv
import subprocess
import sys
from datetime import datetime
from pathlib import Path

BASE = Path('/home/ai/.openclaw/workspace/business')
OPPS = BASE / 'opportunities.csv'
REFRESH_ALL = BASE / 'refresh_all.sh'

FIELDNAMES = [
    'created_at', 'opportunity_id', 'contact_name', 'contact_email', 'company',
    'stage', 'score_bucket', 'estimated_value', 'next_action', 'next_action_due',
    'last_contact', 'location', 'timeline', 'budget_signal', 'notes'
]


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def read_rows():
    with OPPS.open(newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row.pop(None, None)
    return rows


def main():
    if len(sys.argv) < 6:
        raise SystemExit('Usage: import_opportunity.py <contact_name> <contact_email> <company> <stage> <next_action> [next_action_due] [notes]')

    contact_name = clean(sys.argv[1])
    contact_email = clean(sys.argv[2]).lower()
    company = clean(sys.argv[3])
    stage = clean(sys.argv[4])
    next_action = clean(sys.argv[5])
    next_action_due = clean(sys.argv[6]) if len(sys.argv) > 6 else ''
    notes = clean(sys.argv[7]) if len(sys.argv) > 7 else ''

    rows = read_rows()
    now = datetime.now().astimezone().replace(microsecond=0).isoformat()

    for row in rows:
        if clean(row.get('contact_email', '')).lower() == contact_email:
            row['contact_name'] = contact_name or row.get('contact_name', '')
            row['company'] = company or row.get('company', '')
            row['stage'] = stage or row.get('stage', '')
            row['next_action'] = next_action or row.get('next_action', '')
            row['next_action_due'] = next_action_due or row.get('next_action_due', '')
            row['notes'] = notes or row.get('notes', '')
            row['last_contact'] = now[:10]
            with OPPS.open('w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
                writer.writeheader()
                writer.writerows(rows)
            subprocess.run([str(REFRESH_ALL)], check=False)
            print(f'Updated existing opportunity for {contact_email}')
            return

    new_id = f"opp-{now[:10].replace('-', '')}-{len(rows)+1:03d}"
    row = {
        'created_at': now,
        'opportunity_id': new_id,
        'contact_name': contact_name,
        'contact_email': contact_email,
        'company': company,
        'stage': stage,
        'score_bucket': '',
        'estimated_value': '',
        'next_action': next_action,
        'next_action_due': next_action_due,
        'last_contact': now[:10],
        'location': '',
        'timeline': '',
        'budget_signal': '',
        'notes': notes,
    }
    with OPPS.open('a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writerow(row)
    subprocess.run([str(REFRESH_ALL)], check=False)
    print(f'Added new opportunity {new_id} for {contact_email}')


if __name__ == '__main__':
    main()
