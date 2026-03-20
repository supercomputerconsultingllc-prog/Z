#!/usr/bin/env python3
import csv
import sys
from datetime import datetime, UTC
from pathlib import Path

MAIL = Path('/home/ai/.openclaw/workspace/mail')
HISTORY = MAIL / 'campaign_send_history.csv'

FIELDNAMES = ['sent_at', 'email', 'subject', 'campaign', 'status', 'notes']


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def main():
    if len(sys.argv) < 5:
        raise SystemExit('Usage: campaign_append_send_history.py <email> <subject> <campaign> <status> [notes]')

    email = clean(sys.argv[1]).lower()
    subject = clean(sys.argv[2])
    campaign = clean(sys.argv[3])
    status = clean(sys.argv[4])
    notes = clean(sys.argv[5]) if len(sys.argv) > 5 else ''

    row = {
        'sent_at': datetime.now(UTC).replace(microsecond=0).isoformat(),
        'email': email,
        'subject': subject,
        'campaign': campaign,
        'status': status,
        'notes': notes,
    }

    file_exists = HISTORY.exists()
    with HISTORY.open('a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        if not file_exists or HISTORY.stat().st_size == 0:
            writer.writeheader()
        writer.writerow(row)

    print(f"Appended send history for {email}")


if __name__ == '__main__':
    main()
