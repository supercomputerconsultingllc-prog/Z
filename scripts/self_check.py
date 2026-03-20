#!/usr/bin/env python3
import json
from pathlib import Path

WORKSPACE = Path('/home/ai/.openclaw/workspace')

CHECKS = {
    'capability catalog': [
        WORKSPACE / 'CAPABILITIES.md',
        WORKSPACE / 'CAPABILITY_GAPS.md',
        WORKSPACE / 'capabilities.json',
    ],
    'improvement loop': [
        WORKSPACE / 'HEARTBEAT.md',
        WORKSPACE / '.learnings' / 'LEARNINGS.md',
        WORKSPACE / 'WORKSPACE_QUICKSTART.md',
        WORKSPACE / 'scripts' / 'next_improvement_prompt.py',
        WORKSPACE / 'scripts' / 'run_bounded_improvement.sh',
    ],
    'campaign workflow': [
        WORKSPACE / 'mail' / 'campaign_pipeline.md',
        WORKSPACE / 'mail' / 'campaign_quickstart.md',
        WORKSPACE / 'mail' / 'campaign_state_summary.py',
    ],
    'business ops': [
        WORKSPACE / 'business' / 'dashboard.md',
        WORKSPACE / 'business' / 'next_actions.md',
        WORKSPACE / 'business' / 'state_summary.py',
    ],
}

JSON_CHECKS = [
    WORKSPACE / 'capabilities.json',
]


def validate_json(path: Path) -> tuple[bool, str | None]:
    try:
        json.loads(path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as exc:
        return False, str(exc)
    return True, None


def main():
    failures = []
    print('# Self Check')
    print()
    for area, paths in CHECKS.items():
        print(f'## {area}')
        for path in paths:
            ok = path.exists()
            marker = 'OK' if ok else 'MISSING'
            print(f'- [{marker}] {path.relative_to(WORKSPACE)}')
            if not ok:
                failures.append(f'missing: {path.relative_to(WORKSPACE)}')
        print()

    print('## structured data')
    for path in JSON_CHECKS:
        if not path.exists():
            print(f'- [SKIP] {path.relative_to(WORKSPACE)} (missing, already reported above)')
            continue
        ok, detail = validate_json(path)
        marker = 'OK' if ok else 'INVALID'
        print(f'- [{marker}] {path.relative_to(WORKSPACE)}')
        if detail and not ok:
            print(f'  - {detail}')
            failures.append(f'invalid json: {path.relative_to(WORKSPACE)}')
    print()

    if failures:
        print('Self-check failures detected:')
        for item in failures:
            print(f'- {item}')
        raise SystemExit(1)

    print('All core self-check items present and valid.')


if __name__ == '__main__':
    main()
