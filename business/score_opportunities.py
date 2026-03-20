#!/usr/bin/env python3
import csv
import subprocess
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


def score_bucket(row: dict) -> str:
    stage = clean(row.get('stage', '')).lower()
    company = clean(row.get('company', ''))
    timeline = clean(row.get('timeline', '')).lower()
    budget = clean(row.get('budget_signal', '')).lower()
    notes = clean(row.get('notes', '')).lower()
    next_action = clean(row.get('next_action', '')).lower()

    points = 0

    if company:
        points += 1
    if 'qualified' in stage:
        points += 3
    elif 'warm lead' in stage or 'early conversation' in stage:
        points += 2
    elif 'outreach queued' in stage or 'prospect' in stage:
        points += 1

    if location := clean(row.get('location', '')):
        points += 1
    if timeline and timeline not in {'', 'unknown'}:
        points += 1
    if budget and budget not in {'', 'unknown'}:
        points += 1

    signal_terms = ['capacity', 'data center', 'hpc', 'cooling', 'power', 'cluster', 'migration', 'design', 'due diligence']
    if any(term in notes or term in next_action for term in signal_terms):
        points += 1

    credible_terms = ['university', 'lab', 'sds c', 'sdsc', 'consulting', 'inc', 'llc']
    if any(term in company.lower() for term in credible_terms):
        points += 1

    if points >= 6:
        return 'strong lead'
    if points >= 3:
        return 'possible lead'
    return 'weak lead'


def main():
    rows = read_rows()
    changed = False
    for row in rows:
        new_bucket = score_bucket(row)
        if clean(row.get('score_bucket', '')) != new_bucket:
            row['score_bucket'] = new_bucket
            changed = True

    if changed:
        with OPPS.open('w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
            writer.writeheader()
            writer.writerows(rows)
        subprocess.run([str(REFRESH_ALL)], check=False)

    print(f'Scored opportunities, changed={str(changed).lower()}')


if __name__ == '__main__':
    main()
