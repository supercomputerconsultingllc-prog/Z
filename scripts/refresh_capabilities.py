#!/usr/bin/env python3
import json
from pathlib import Path

WORKSPACE = Path('/home/ai/.openclaw/workspace')
SKILLS_DIR = WORKSPACE / 'skills'
OUT = WORKSPACE / 'capabilities.json'

STATIC_TOOLS = [
    'read', 'write', 'edit', 'exec', 'process',
    'web_search', 'web_fetch', 'cron',
    'sessions_list', 'sessions_history', 'sessions_send',
    'sessions_spawn', 'sessions_yield', 'subagents',
    'memory_search', 'memory_get', 'session_status'
]

GLOBAL_SKILLS = [
    'prose', 'clawhub', 'gh-issues', 'github', 'healthcheck',
    'node-connect', 'oracle', 'session-logs', 'skill-creator', 'video-frames'
]

GUARDRAILS = [
    'ask-before-external-sends',
    'ask-before-destructive-actions',
    'bounded-improvement-only',
    'verify-real-fix-path'
]


def workspace_skills():
    return sorted(p.parent.name for p in SKILLS_DIR.glob('*/SKILL.md'))


def main():
    data = {
        'tools': STATIC_TOOLS,
        'workspaceSkills': workspace_skills(),
        'globalSkills': GLOBAL_SKILLS,
        'guardrails': GUARDRAILS,
    }
    OUT.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
    print(f'Refreshed {OUT}')


if __name__ == '__main__':
    main()
