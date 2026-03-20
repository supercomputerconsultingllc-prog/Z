#!/usr/bin/env bash
set -euo pipefail

cd /home/ai/.openclaw/workspace

python3 mail/campaign_generate_drafts.py
python3 mail/campaign_dedupe_check.py
python3 mail/campaign_export_queued.py
python3 mail/campaign_check_send_bundle.py
python3 mail/campaign_state_summary.py

echo "Campaign views refreshed." 
