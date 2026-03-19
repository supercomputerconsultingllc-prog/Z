#!/usr/bin/env bash
set -euo pipefail

ACCOUNT="${1:-SupercomputerConsultingLLC@gmail.com}"
STATE_FILE="/home/ai/.openclaw/workspace/mail/autopilot-state.json"

if [[ -z "${GOG_KEYRING_PASSWORD:-}" ]]; then
  echo "GOG_KEYRING_PASSWORD is not set" >&2
  exit 2
fi

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

gog gmail search 'is:unread newer_than:1d' --account "$ACCOUNT" --max 5 > "$TMP"

python3 - <<'PY'
import json, os, re, subprocess, sys
from pathlib import Path

state_path = Path('/home/ai/.openclaw/workspace/mail/autopilot-state.json')
if state_path.exists():
    state = json.loads(state_path.read_text())
else:
    state = {"lastProcessedIds": [], "lastThreadActions": {}}
processed = set(state.get('lastProcessedIds', []))
thread_actions = state.get('lastThreadActions', {})

search_path = Path(os.environ.get('TMPFILE', ''))
lines = search_path.read_text().splitlines()
rows = []
for line in lines:
    if not line.strip() or line.startswith('ID ') or line.startswith('# Next page'):
        continue
    rows.append(line)

sent_any = False
new_processed = list(processed)

keywords = ['consulting','lead','aws','amazon','data center','colocation','hpc','ai cluster','cooling','power','capacity','migration','design review','due diligence']
blocked = ['no-reply@','noreply@','newsletter','unsubscribe','promotion']

for row in rows:
    m = re.match(r'^(\S+)\s+\S+\s+\S+\s+(.+?)\s{2,}(.+?)\s{2,}(.*?)\s{2,}(.*?)\s*$', row)
    msg_id = row.split()[0]
    if msg_id in processed:
        continue
    get = subprocess.run(['gog','gmail','get',msg_id,'--account','SupercomputerConsultingLLC@gmail.com'], capture_output=True, text=True)
    if get.returncode != 0:
        continue
    text = get.stdout
    def field(name):
        mm = re.search(rf'^{name}\t?(.*)$', text, re.M)
        return mm.group(1).strip() if mm else ''
    thread_id = field('thread_id') or msg_id
    sender = field('from')
    subject = field('subject')
    body = text.split('\n\n',1)[1].strip() if '\n\n' in text else ''
    low = (subject + '\n' + body).lower()
    if any(b in low or b in sender.lower() for b in blocked):
        new_processed.append(msg_id)
        continue
    if thread_id in thread_actions:
        new_processed.append(msg_id)
        continue
    business = any(k in low for k in keywords)
    personal_details = any(k in low for k in ['ssn','social security','dob','date of birth','home address','bank','routing number','account number'])
    if personal_details:
        new_processed.append(msg_id)
        continue
    if not business:
        new_processed.append(msg_id)
        continue
    name_match = re.search(r'^(.*?)\s*<', sender)
    name = name_match.group(1).strip('" ') if name_match else 'there'
    if name.lower() in {'', 'no-reply'}:
        name = 'there'
    reply = (
        f"Hi {name},\n\n"
        "Thanks for reaching out. I am interested.\n\n"
        "Can you send over a short description of the opportunity, the scope, and the timeline? If it is shareable, the client or company name would help too. Budget range and location would also be useful if available.\n\n"
        "Best,\n"
        "Supercomputer Consulting"
    )
    send = subprocess.run([
        'gog','send',
        '--account','SupercomputerConsultingLLC@gmail.com',
        '--reply-to-message-id',msg_id,
        '--to', re.search(r'<([^>]+)>', sender).group(1) if '<' in sender else sender,
        '--subject', f'Re: {subject}',
        '--body', reply,
    ], capture_output=True, text=True)
    if send.returncode == 0:
        sent_any = True
        thread_actions[thread_id] = {'lastAction': 'auto-replied'}
    new_processed.append(msg_id)

state['lastProcessedIds'] = new_processed[-200:]
state['lastThreadActions'] = thread_actions
state_path.write_text(json.dumps(state, indent=2) + '\n')
print('sent' if sent_any else 'no-send')
PY
