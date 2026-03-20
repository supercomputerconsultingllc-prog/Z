#!/usr/bin/env python3
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
        WORKSPACE / 'scripts' / 'next_improvement_prompt.py',
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


def main():
    missing = []
    print('# Self Check')
    print()
    for area, paths in CHECKS.items():
        print(f'## {area}')
        for path in paths:
            ok = path.exists()
            marker = 'OK' if ok else 'MISSING'
            print(f'- [{marker}] {path.relative_to(WORKSPACE)}')
            if not ok:
                missing.append(str(path.relative_to(WORKSPACE)))
        print()

    if missing:
        print('Missing files detected:')
        for item in missing:
            print(f'- {item}')
        raise SystemExit(1)

    print('All core self-check items present.')


if __name__ == '__main__':
    main()
