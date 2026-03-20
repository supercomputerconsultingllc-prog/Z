#!/usr/bin/env python3
import csv
from pathlib import Path

WORKSPACE = Path('/home/ai/.openclaw/workspace/mail')
INPUT = WORKSPACE / 'campaign_contacts_template.csv'
OUTPUT = WORKSPACE / 'campaign_drafts.md'


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def build_email(row: dict) -> tuple[str, str]:
    first = clean(row.get('first_name', '')) or 'there'
    company = clean(row.get('company', 'your team'))
    title = clean(row.get('title', ''))
    location = clean(row.get('location', ''))
    notes = clean(row.get('notes', ''))
    if notes and notes[-1] not in '.!?':
        notes = notes + '.'

    subject = f"Quick question about {company}"

    details = []
    if title:
        details.append(f"your work as {title}")
    if location:
        details.append(f"what you're seeing in {location}")
    opener = ', especially '.join(details) if details else 'the work your team is doing'

    body = (
        f"Hi {first},\n\n"
        f"I came across {company} and wanted to reach out because of {opener}. "
        f"I thought there might be a fit for a short conversation around infrastructure, capacity, or planning work.\n\n"
        f"{notes + ' ' if notes else ''}If a quick conversation would be useful, I can send over a few times.\n\n"
        "Best,\n"
        "Supercomputer Consulting"
    )
    return subject, body


def main():
    rows = list(csv.DictReader(INPUT.open(newline='', encoding='utf-8')))
    parts = ['# Campaign Drafts', '']
    for idx, row in enumerate(rows, 1):
        email = clean(row.get('email', ''))
        if not email:
            continue
        subject, body = build_email(row)
        parts.extend([
            f"## Draft {idx}",
            f"- To: {email}",
            f"- Subject: {subject}",
            '',
            '```text',
            body,
            '```',
            '',
        ])

    OUTPUT.write_text('\n'.join(parts).rstrip() + '\n', encoding='utf-8')
    print(f'Wrote {OUTPUT}')


if __name__ == '__main__':
    main()
