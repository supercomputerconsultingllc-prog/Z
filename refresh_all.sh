#!/usr/bin/env bash
set -euo pipefail

cd /home/ai/.openclaw/workspace

./mail/refresh_all.sh
./business/refresh_all.sh
SKIP_DEP_REFRESH=1 python3 ./scripts/generate_status_report.py

echo "Workspace views refreshed." 
