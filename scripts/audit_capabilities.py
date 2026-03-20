#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path

WORKSPACE = Path('/home/ai/.openclaw/workspace')
CAPS = WORKSPACE / 'capabilities.json'
SKILLS_DIR = WORKSPACE / 'skills'


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, check=False)


def workspace_skills():
    return sorted(p.parent.name for p in SKILLS_DIR.glob('*/SKILL.md'))


def clawhub_list():
    proc = run(['clawhub', 'list'])
    if proc.returncode != 0:
        return []
    names = []
    for line in proc.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        names.append(line.split()[0])
    return sorted(set(names))


def main():
    data = json.loads(CAPS.read_text())
    expected_workspace = sorted(data.get('workspaceSkills', []))
    actual_workspace = workspace_skills()
    clawhub_installed = clawhub_list()

    report = {
        'expectedWorkspaceSkills': expected_workspace,
        'actualWorkspaceSkills': actual_workspace,
        'missingFromWorkspaceCatalog': sorted(set(actual_workspace) - set(expected_workspace)),
        'missingFromWorkspaceFiles': sorted(set(expected_workspace) - set(actual_workspace)),
        'clawhubInstalled': clawhub_installed,
        'missingFromClawhubInstallSet': sorted(set(data.get('globalSkills', [])) - set(clawhub_installed)),
    }

    print(json.dumps(report, indent=2))

    has_gap = any(report[k] for k in [
        'missingFromWorkspaceCatalog',
        'missingFromWorkspaceFiles',
    ])
    raise SystemExit(1 if has_gap else 0)


if __name__ == '__main__':
    main()
