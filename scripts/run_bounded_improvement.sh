#!/usr/bin/env bash
set -euo pipefail

cd /home/ai/.openclaw/workspace

echo "=== NEXT IMPROVEMENT PROMPT ==="
python3 scripts/next_improvement_prompt.py

echo
echo "Use the prompt above in a fresh agent turn or heartbeat-driven review."
echo "This runner is intentionally bounded. It suggests one next step and stops."
