#!/usr/bin/env python3
import csv
from collections import Counter
from pathlib import Path

BASE = Path('/home/ai/.openclaw/workspace/business')
OPPS = BASE / 'opportunities.csv'
FOLLOWS = BASE / 'followups.csv'
OUT = BASE / 'state_summary.md'


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

    stage_counts = Counter(clean(r.get('stage', 'unknown')) or 'unknown' for r in opps)
    score_counts = Counter(clean(r.get('score_bucket', 'unknown')) or 'unknown' for r in opps)
    follow_counts = Counter(clean(r.get('thread_state', 'unknown')) or 'unknown' for r in follows)

    lines = ['# Business State Summary', '']
    lines.append(f'- Opportunities tracked: {len(opps)}')
    lines.append(f'- Follow-up threads tracked: {len(follows)}')
    lines.append('')

    lines.append('## Opportunity stages')
    if stage_counts:
        for key, value in sorted(stage_counts.items()):
            lines.append(f'- {key}: {value}')
    else:
        lines.append('- none')

    lines.append('')
    lines.append('## Opportunity score buckets')
    if score_counts:
        for key, value in sorted(score_counts.items()):
            lines.append(f'- {key}: {value}')
    else:
        lines.append('- none')

    lines.append('')
    lines.append('## Follow-up thread states')
    if follow_counts:
        for key, value in sorted(follow_counts.items()):
            lines.append(f'- {key}: {value}')
    else:
        lines.append('- none')

    OUT.write_text('\n'.join(lines).rstrip() + '\n', encoding='utf-8')
    print(f'Wrote {OUT}')


if __name__ == '__main__':
    main()
