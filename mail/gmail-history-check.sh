#!/usr/bin/env bash
set -euo pipefail

ACCOUNT="${1:-SupercomputerConsultingLLC@gmail.com}"
SINCE="${2:-}"

if [[ -z "$SINCE" ]]; then
  echo "Usage: $0 <account> <history_id>"
  echo "Example: $0 SupercomputerConsultingLLC@gmail.com 2755"
  exit 1
fi

export GOG_KEYRING_PASSWORD="${GOG_KEYRING_PASSWORD:-}"

echo "== Gmail history =="
echo "Account: $ACCOUNT"
echo "Since:   $SINCE"
echo

gog gmail history --account "$ACCOUNT" --since "$SINCE"
