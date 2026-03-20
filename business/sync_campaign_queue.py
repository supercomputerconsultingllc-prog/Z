#!/usr/bin/env python3
import csv
import subprocess
from pathlib import Path

WORKSPACE = Path('/home/ai/.openclaw/workspace')
MAIL = WORKSPACE / 'mail'
BUSINESS = WORKSPACE / 'business'
CONTACTS = MAIL / 'campaign_contacts_template.csv'
OPPS = BUSINESS / 'opportunities.csv'
REFRESH_ALL = BUSINESS / 'refresh_all.sh'

OPP_FIELDS = [
    'created_at', 'opportunity_id', 'contact_name', 'contact_email', 'company',
    'stage', 'score_bucket', 'estimated_value', 'next_action', 'next_action_due',
    'last_contact', 'location', 'timeline', 'budget_signal', 'notes'
]


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def read_csv(path: Path):
    with path.open(newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row.pop(None, None)
    return rows


def main():
    contacts = read_csv(CONTACTS)
    opps = read_csv(OPPS)
    opps_by_email = {clean(r.get('contact_email', '')).lower(): r for r in opps}
    changed = False
    next_num = len(opps) + 1
    today = subprocess.run(['date', '+%Y-%m-%d'], capture_output=True, text=True).stdout.strip()
    now = subprocess.run(['date', '--iso-8601=seconds'], capture_output=True, text=True).stdout.strip()

    for row in contacts:
        status = clean(row.get('status', ''))
        email = clean(row.get('email', '')).lower()
        if status != 'queued' or not email:
            continue

        full_name = f"{clean(row.get('first_name', ''))} {clean(row.get('last_name', ''))}".strip()
        company = clean(row.get('company', ''))
        location = clean(row.get('location', ''))
        notes = clean(row.get('notes', ''))

        if email in opps_by_email:
            opp = opps_by_email[email]
            if not clean(opp.get('next_action', '')):
                opp['next_action'] = 'Review queued outreach contact'
                changed = True
            if not clean(opp.get('stage', '')):
                opp['stage'] = 'outreach queued'
                changed = True
            if location and not clean(opp.get('location', '')):
                opp['location'] = location
                changed = True
            if notes and not clean(opp.get('notes', '')):
                opp['notes'] = notes
                changed = True
            continue

        opps.append({
            'created_at': now,
            'opportunity_id': f'opp-{today.replace("-", "")}-{next_num:03d}',
            'contact_name': full_name,
            'contact_email': email,
            'company': company,
            'stage': 'outreach queued',
            'score_bucket': '',
            'estimated_value': '',
            'next_action': 'Review queued outreach contact',
            'next_action_due': '',
            'last_contact': today,
            'location': location,
            'timeline': '',
            'budget_signal': '',
            'notes': notes,
        })
        next_num += 1
        changed = True

    if changed:
        with OPPS.open('w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=OPP_FIELDS)
            writer.writeheader()
            writer.writerows(opps)
        subprocess.run([str(REFRESH_ALL)], check=False)

    print(f'Synced campaign queue into business opportunities, changed={str(changed).lower()}')


if __name__ == '__main__':
    main()
