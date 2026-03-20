#!/usr/bin/env python3
import csv
from datetime import datetime
from pathlib import Path

BASE = Path('/home/ai/.openclaw/workspace/business')
FOLLOWS = BASE / 'followups.csv'
OUT = BASE / 'followup_due_summary.md'


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def read_csv(path: Path):
    with path.open(newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row.pop(None, None)
    return rows


def parse_date(value: str):
    value = clean(value)
    if not value:
        return None
    try:
        return datetime.strptime(value, '%Y-%m-%d').date()
    except ValueError:
        return None


def main():
    rows = read_csv(FOLLOWS)
    today = datetime.now().astimezone().date()

    overdue = []
    due_today = []
    upcoming = []
    unscheduled = []

    for row in rows:
        due = parse_date(row.get('followup_due', ''))
        item = {
            'email': clean(row.get('contact_email', '')),
            'company': clean(row.get('company', '')),
            'action': clean(row.get('recommended_action', '')),
            'state': clean(row.get('thread_state', '')),
            'due': clean(row.get('followup_due', '')),
        }
        if due is None:
            unscheduled.append(item)
        elif due < today:
            overdue.append(item)
        elif due == today:
            due_today.append(item)
        else:
            upcoming.append(item)

    def add_section(lines, title, items):
        lines.append(f'## {title}')
        if not items:
            lines.append('- none')
        else:
            for item in items:
                lines.append(
                    f"- {item['email'] or '(no email)'} | {item['company'] or '(no company)'} | state={item['state'] or 'unknown'} | due={item['due'] or 'unscheduled'} | action={item['action'] or 'none'}"
                )
        lines.append('')

    lines = ['# Follow-up Due Summary', '']
    add_section(lines, 'Overdue', overdue)
    add_section(lines, 'Due today', due_today)
    add_section(lines, 'Upcoming', upcoming)
    add_section(lines, 'Unscheduled', unscheduled)

    OUT.write_text('\n'.join(lines).rstrip() + '\n', encoding='utf-8')
    print(f'Wrote {OUT}')


if __name__ == '__main__':
    main()
