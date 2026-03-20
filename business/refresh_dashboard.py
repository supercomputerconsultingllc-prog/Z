#!/usr/bin/env python3
import csv
from pathlib import Path

BASE = Path('/home/ai/.openclaw/workspace/business')
OPPS = BASE / 'opportunities.csv'
FOLLOWS = BASE / 'followups.csv'
DASH = BASE / 'dashboard.md'


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

    lines = ['# Business Ops Dashboard', '']
    lines.append('## Current opportunities')
    if not opps:
        lines.append('- None')
    else:
        for row in opps:
            lines.extend([
                f"- **{clean(row.get('opportunity_id', ''))}** — {clean(row.get('contact_name', ''))} / {clean(row.get('company', ''))}",
                f"  - Stage: {clean(row.get('stage', '')) or 'unknown'}",
                f"  - Score bucket: {clean(row.get('score_bucket', '')) or 'unknown'}",
                f"  - Next action: {clean(row.get('next_action', '')) or 'none'}",
                f"  - Next action due: {clean(row.get('next_action_due', '')) or 'unscheduled'}",
                f"  - Last contact: {clean(row.get('last_contact', '')) or 'unknown'}",
            ])

    lines.extend(['', '## Follow-ups tracked'])
    if not follows:
        lines.append('- None')
    else:
        for row in follows:
            lines.append(
                f"- {clean(row.get('contact_email', ''))} | state={clean(row.get('thread_state', '')) or 'unknown'} | due={clean(row.get('followup_due', '')) or 'unscheduled'} | action={clean(row.get('recommended_action', '')) or 'none'}"
            )

    lines.extend([
        '',
        '## Open workflow assets',
        '- `business/opportunities.csv`',
        '- `business/followups.csv`',
        '- `business/next_actions.md`',
        '- `mail/email-crm-lite.csv`',
        '- `mail/opportunity-scoring-rubric.md`',
        '',
        '## Notes',
        '- Keep this dashboard lightweight and update it when opportunity state changes.',
        '- Prefer concrete next actions over vague pipeline labels.',
    ])

    DASH.write_text('\n'.join(lines).rstrip() + '\n', encoding='utf-8')
    print(f'Refreshed {DASH}')


if __name__ == '__main__':
    main()
