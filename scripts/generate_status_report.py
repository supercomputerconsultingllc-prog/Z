#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path

WORKSPACE = Path('/home/ai/.openclaw/workspace')
CAPS = WORKSPACE / 'CAPABILITIES.md'
CAMPAIGN = WORKSPACE / 'mail' / 'campaign_state_summary.md'
BUSINESS = WORKSPACE / 'business' / 'state_summary.md'
OUT = WORKSPACE / 'STATUS.md'


def read_tail(path: Path, max_lines: int = 40) -> str:
    if not path.exists():
        return '_missing_'
    lines = path.read_text(encoding='utf-8', errors='replace').splitlines()
    return '\n'.join(lines[:max_lines]).strip()


def recent_commits(n: int = 5) -> str:
    res = subprocess.run(['git', '-C', str(WORKSPACE), 'log', f'-{n}', '--oneline'], capture_output=True, text=True)
    return res.stdout.strip() if res.returncode == 0 else '_git log unavailable_'


def main():
    parts = [
        '# Workspace Status Report',
        '',
        '## Recent commits',
        recent_commits(),
        '',
        '## Capability snapshot',
        read_tail(CAPS, 80),
        '',
        '## Campaign snapshot',
        read_tail(CAMPAIGN, 40),
        '',
        '## Business snapshot',
        read_tail(BUSINESS, 40),
    ]
    OUT.write_text('\n'.join(parts).rstrip() + '\n', encoding='utf-8')
    print(f'Wrote {OUT}')


if __name__ == '__main__':
    main()
