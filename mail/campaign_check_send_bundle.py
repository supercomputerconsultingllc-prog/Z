#!/usr/bin/env python3
import csv
from pathlib import Path

MAIL = Path('/home/ai/.openclaw/workspace/mail')
BUNDLE = MAIL / 'campaign_send_bundle.csv'
SUPPRESSION = MAIL / 'campaign_suppression_list.csv'
OUT = MAIL / 'campaign_send_bundle_check.md'


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
    bundle = read_csv(BUNDLE)
    suppression = {
        clean(r.get('email', '')).lower(): clean(r.get('reason', 'suppressed'))
        for r in read_csv(SUPPRESSION)
        if clean(r.get('email', ''))
    }

    blocked = []
    ok = []
    for row in bundle:
        email = clean(row.get('email', '')).lower()
        if not email:
            continue
        if email in suppression:
            blocked.append((email, suppression[email]))
        else:
            ok.append(email)

    lines = ['# Campaign Send Bundle Check', '']
    lines.append(f'- Bundle contacts checked: {len(bundle)}')
    lines.append(f'- Allowed: {len(ok)}')
    lines.append(f'- Blocked by suppression: {len(blocked)}')
    lines.append('')

    if blocked:
        lines.append('## Blocked contacts')
        for email, reason in blocked:
            lines.append(f'- {email} | reason: {reason}')
        lines.append('')

    if ok:
        lines.append('## Allowed contacts')
        for email in ok:
            lines.append(f'- {email}')
        lines.append('')

    OUT.write_text('\n'.join(lines).rstrip() + '\n', encoding='utf-8')
    print(f'Wrote {OUT}')


if __name__ == '__main__':
    main()
