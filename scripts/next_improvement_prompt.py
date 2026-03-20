#!/usr/bin/env python3
import json
import subprocess
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


def git_status_lines(limit: int = 20) -> list[str]:
    try:
        result = subprocess.run(
            ['git', 'status', '--short'],
            cwd=WORKSPACE,
            check=True,
            capture_output=True,
            text=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        return []

    lines = [line.rstrip() for line in result.stdout.splitlines() if line.strip()]
    return lines[:limit]


def build_focus_order(status_lines: list[str]) -> list[str]:
    focus = []
    touched = ' '.join(status_lines)

    if 'mail/' in touched:
        focus.append('Stabilize a broken or awkward edge in the mail or campaign workflow.')
    if 'scripts/' in touched:
        focus.append('Harden or clarify a recently added helper script that is already in active use.')
    if 'CAPABILIT' in touched:
        focus.append('Tighten capability audit coverage or make the audit output easier to reuse.')

    focus.extend([
        'Fix the smallest real problem revealed by current git changes before adding anything new.',
        'Reduce formatting regressions in generated text or reports.',
        'Improve documentation only when it prevents a repeat mistake or clarifies a live workflow.'
    ])

    deduped = []
    seen = set()
    for item in focus:
        if item not in seen:
            seen.add(item)
            deduped.append(item)
    return deduped


def main():
    status_lines = git_status_lines()
    payload = {
        'goal': 'Make one small, concrete, reversible improvement, then stop.',
        'rules': [
            'Do not send external messages or emails.',
            'Do not run destructive commands.',
            'Prefer fixing a real broken edge over adding speculative complexity.',
            'Use current workspace changes as clues, because they often show the hottest path.',
            'After changes, smoke-test the new path and commit only the files for that single improvement if it works.',
            'If nothing meaningful stands out, stop instead of churning.'
        ],
        'working_tree_status': status_lines,
        'suggested_focus_order': build_focus_order(status_lines),
        'recent_learnings_tail': tail_sections(LEARNINGS, 60),
        'capability_gaps_tail': tail_sections(GAPS, 80),
        'capabilities_tail': tail_sections(CAPS, 60),
        'output_instruction': 'Return the single next improvement you will make, then make it, test it, and summarize the result.'
    }
    print(json.dumps(payload, indent=2))


if __name__ == '__main__':
    main()
