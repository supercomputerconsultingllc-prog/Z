#!/usr/bin/env python3
import csv
import json
from pathlib import Path

WORKSPACE = Path('/home/ai/.openclaw/workspace/mail')
INPUT = WORKSPACE / 'campaign_contacts_template.csv'
OUTPUT = WORKSPACE / 'campaign_drafts.md'
LIMITS = WORKSPACE / 'campaign_send_limits.json'
SUPPRESSION = WORKSPACE / 'campaign_suppression_list.csv'


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def load_limits() -> dict:
    return json.loads(LIMITS.read_text(encoding='utf-8'))


def load_suppressed() -> set[str]:
    suppressed = set()
    with SUPPRESSION.open(newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            email = clean(row.get('email', '')).lower()
            if email:
                suppressed.add(email)
    return suppressed


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
    limits = load_limits()
    suppressed = load_suppressed()
    max_drafts = int(limits.get('maxDraftsPerRun', 25))

    parts = ['# Campaign Drafts', '']
    drafted = 0
    for row in rows:
        email = clean(row.get('email', ''))
        status = clean(row.get('status', 'draft')) or 'draft'
        if not email:
            continue
        if email.lower() in suppressed or status in {'suppressed', 'sent', 'queued', 'rejected'}:
            continue
        if drafted >= max_drafts:
            break
        subject, body = build_email(row)
        drafted += 1
        parts.extend([
            f"## Draft {drafted}",
            f"- To: {email}",
            f"- Status: {status}",
            f"- Subject: {subject}",
            '',
            '```text',
            body,
            '```',
            '',
        ])

    OUTPUT.write_text('\n'.join(parts).rstrip() + '\n', encoding='utf-8')
    print(f'Wrote {OUTPUT} with {drafted} draft(s)')


if __name__ == '__main__':
    main()
