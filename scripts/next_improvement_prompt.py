#!/usr/bin/env python3
import json
from pathlib import Path

WORKSPACE = Path('/home/ai/.openclaw/workspace')
LEARNINGS = WORKSPACE / '.learnings' / 'LEARNINGS.md'
GAPS = WORKSPACE / 'CAPABILITY_GAPS.md'
CAPS = WORKSPACE / 'CAPABILITIES.md'


def tail_sections(path: Path, lines: int = 80) -> str:
    if not path.exists():
        return ''
    text = path.read_text(encoding='utf-8', errors='replace').splitlines()
    return '\n'.join(text[-lines:]).strip()


def main():
    payload = {
        'goal': 'Make one small, concrete, reversible improvement, then stop.',
        'rules': [
            'Do not send external messages or emails.',
            'Do not run destructive commands.',
            'Prefer fixing a real broken edge over adding speculative complexity.',
            'After changes, smoke-test the new path and commit if it works.',
            'If nothing meaningful stands out, stop instead of churning.'
        ],
        'suggested_focus_order': [
            'Fix anything currently broken in the campaign workflow.',
            'Reduce formatting regressions in generated email content.',
            'Tighten capability audit coverage.',
            'Improve documentation for newly added scripts.'
        ],
        'recent_learnings_tail': tail_sections(LEARNINGS, 60),
        'capability_gaps_tail': tail_sections(GAPS, 80),
        'capabilities_tail': tail_sections(CAPS, 60),
        'output_instruction': 'Return the single next improvement you will make, then make it, test it, and summarize the result.'
    }
    print(json.dumps(payload, indent=2))


if __name__ == '__main__':
    main()
