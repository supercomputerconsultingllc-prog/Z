#!/usr/bin/env bash
set -euo pipefail

ACCOUNT="${1:-SupercomputerConsultingLLC@gmail.com}"
QUERY="${2:-is:unread newer_than:7d}"
MAX="${3:-20}"

export GOG_KEYRING_PASSWORD="${GOG_KEYRING_PASSWORD:-}"

echo "== Gmail triage =="
echo "Account: $ACCOUNT"
echo "Query:   $QUERY"
echo "Max:     $MAX"
echo

gog gmail search "$QUERY" --account "$ACCOUNT" --max "$MAX"
