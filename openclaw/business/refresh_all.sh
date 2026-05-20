#!/usr/bin/env bash
set -euo pipefail

cd /home/ai/.openclaw/workspace

python3 business/refresh_dashboard.py
python3 business/refresh_next_actions.py
python3 business/state_summary.py

echo "Business ops views refreshed." 
