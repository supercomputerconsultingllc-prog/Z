#!/usr/bin/env python3
import csv
from collections import Counter
from pathlib import Path

MAIL = Path('/home/ai/.openclaw/workspace/mail')
CONTACTS = MAIL / 'campaign_contacts_template.csv'
SUPPRESSION = MAIL / 'campaign_suppression_list.csv'
HISTORY = MAIL / 'campaign_send_history.csv'
OUT = MAIL / 'campaign_state_summary.md'


def clean(value: str) -> str:
    return ' '.join((value or '').split()).strip()


def read_csv(path: Path):
    if not path.exists():
        return []
    with path.open(newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row.pop(None, None)
    return rows


def main():
    contacts = read_csv(CONTACTS)
    suppression = read_csv(SUPPRESSION)
    history = read_csv(HISTORY)

    status_counts = Counter(clean(r.get('status', 'blank')) or 'blank' for r in contacts)
    sent_counts = Counter(clean(r.get('status', 'blank')) or 'blank' for r in history)

    lines = ['# Campaign State Summary', '']
    lines.append(f'- Contacts tracked: {len(contacts)}')
    lines.append(f'- Suppressed contacts: {len([r for r in suppression if clean(r.get("email", ""))])}')
    lines.append(f'- Send history records: {len(history)}')
    lines.append('')

    lines.append('## Contact statuses')
    if status_counts:
        for key, value in sorted(status_counts.items()):
            lines.append(f'- {key}: {value}')
    else:
        lines.append('- none')

    lines.append('')
    lines.append('## Send history statuses')
    if sent_counts:
        for key, value in sorted(sent_counts.items()):
            lines.append(f'- {key}: {value}')
    else:
        lines.append('- none')

    OUT.write_text('\n'.join(lines).rstrip() + '\n', encoding='utf-8')
    print(f'Wrote {OUT}')


if __name__ == '__main__':
    main()
