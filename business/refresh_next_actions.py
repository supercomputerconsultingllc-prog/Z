#!/usr/bin/env python3
import csv
from pathlib import Path

BASE = Path('/home/ai/.openclaw/workspace/business')
OPPS = BASE / 'opportunities.csv'
FOLLOWS = BASE / 'followups.csv'
OUT = BASE / 'next_actions.md'


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def read_csv(path: Path):
    with path.open(newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row.pop(None, None)
    return rows


def main():
    opps = read_csv(OPPS)
    follows = read_csv(FOLLOWS)

    lines = ['# Next Actions', '']
    lines.append('## Revenue-support work')
    if not opps:
        lines.append('1. No active opportunities tracked.')
    else:
        idx = 1
        for row in opps:
            contact = clean(row.get('contact_name', '')) or clean(row.get('contact_email', '')) or 'unknown contact'
            action = clean(row.get('next_action', '')) or 'review opportunity state'
            due = clean(row.get('next_action_due', '')) or 'unscheduled'
            lines.append(f'{idx}. {action} for {contact} (due: {due}).')
            idx += 1

    lines.extend(['', '## Follow-up tracking'])
    if not follows:
        lines.append('1. No follow-up threads tracked.')
    else:
        idx = 1
        for row in follows:
            email = clean(row.get('contact_email', '')) or 'unknown email'
            action = clean(row.get('recommended_action', '')) or 'review thread'
            due = clean(row.get('followup_due', '')) or 'unscheduled'
            lines.append(f'{idx}. {action} for {email} (due: {due}).')
            idx += 1

    lines.extend([
        '',
        '## System improvements',
        '1. Keep capability catalog and audit in sync after changes.',
        '2. Refresh dashboards and summaries after meaningful state updates.',
    ])

    OUT.write_text('\n'.join(lines).rstrip() + '\n', encoding='utf-8')
    print(f'Refreshed {OUT}')


if __name__ == '__main__':
    main()
