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
export TMPFILE="$TMP"
export WATCHED_ACCOUNT="${ACCOUNT,,}"
export STATE_FILE

python3 - <<'PY'
import json, os, re, subprocess
from pathlib import Path


def build_plaintext_email(*paragraphs: str) -> str:
    cleaned = []
    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        paragraph = re.sub(r'\n{3,}', '\n\n', paragraph)
        cleaned.append(paragraph)
    return '\n\n'.join(cleaned)

state_path = Path(os.environ['STATE_FILE'])
watched_account = os.environ['WATCHED_ACCOUNT']

if state_path.exists():
    state = json.loads(state_path.read_text())
else:
    state = {"lastProcessedIds": [], "lastThreadActions": {}}

processed = set(state.get('lastProcessedIds', []))
thread_actions = state.get('lastThreadActions', {})

search_path = Path(os.environ['TMPFILE'])
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
personal_markers = ['ssn','social security','dob','date of birth','home address','bank','routing number','account number']

for row in rows:
    msg_id = row.split()[0]
    if msg_id in processed:
        continue

    get = subprocess.run(
        ['gog', 'gmail', 'get', msg_id, '--account', watched_account],
        capture_output=True, text=True
    )
    if get.returncode != 0:
        continue

    text = get.stdout
    def field(name):
        mm = re.search(rf'^{name}\t?(.*)$', text, re.M)
        return mm.group(1).strip() if mm else ''

    thread_id = field('thread_id') or msg_id
    labels = field('label_ids')
    sender = field('from')
    subject = field('subject')
    body = text.split('\n\n', 1)[1].strip() if '\n\n' in text else ''

    low = (subject + '\n' + body).lower()
    sender_low = sender.lower()
    labels_low = labels.lower()
    thread_state = thread_actions.get(thread_id, {})

    # Ignore our own outbound mail and anything already waiting on the other person.
    if watched_account in sender_low:
        new_processed.append(msg_id)
        continue
    if 'sent' in labels_low:
        new_processed.append(msg_id)
        continue
    if thread_state.get('state') == 'waiting-on-them':
        new_processed.append(msg_id)
        continue

    if any(b in low or b in sender_low for b in blocked):
        new_processed.append(msg_id)
        continue

    business = any(k in low for k in keywords)
    personal_details = any(k in low for k in personal_markers)
    if personal_details or not business:
        new_processed.append(msg_id)
        continue

    name_match = re.search(r'^(.*?)\s*<', sender)
    raw_name = name_match.group(1).strip('" ') if name_match else 'there'
    raw_name = re.sub(r'\s+', ' ', raw_name).strip()

    if raw_name.lower() in {'', 'no-reply'}:
        greeting_name = 'there'
    else:
        cleaned_name = raw_name
        if ',' in cleaned_name:
            parts = [p.strip() for p in cleaned_name.split(',') if p.strip()]
            if len(parts) >= 2:
                cleaned_name = parts[1]
        cleaned_name = re.sub(r'\b(Mr|Mrs|Ms|Miss|Dr|Prof)\.??\s+', '', cleaned_name, flags=re.I)
        tokens = [t for t in re.split(r'\s+', cleaned_name) if t]
        greeting_name = tokens[0] if tokens else 'there'
        if len(greeting_name) == 1:
            greeting_name = cleaned_name or 'there'

    recipient_match = re.search(r'<([^>]+)>', sender)
    recipient = recipient_match.group(1) if recipient_match else sender.strip()

    reply = build_plaintext_email(
        f"Hi {greeting_name},",
        "Thanks for reaching out. I'd be glad to learn more.",
        "Could you share a brief overview of the opportunity, including the scope and expected timeline? If it's shareable, the client or company name would be helpful as well. A budget range and location would also be useful if available.",
        "Best,\nSupercomputer Consulting",
    )

    send = subprocess.run([
        'gog', 'send',
        '--account', watched_account,
        '--reply-to-message-id', msg_id,
        '--to', recipient,
        '--subject', f'Re: {subject}',
        '--body', reply,
    ], capture_output=True, text=True)

    if send.returncode == 0:
        sent_any = True
        thread_actions[thread_id] = {
            'state': 'waiting-on-them',
            'lastAction': 'auto-replied',
            'lastInboundSubject': subject,
        }

    new_processed.append(msg_id)

state['lastProcessedIds'] = new_processed[-200:]
state['lastThreadActions'] = thread_actions
state_path.write_text(json.dumps(state, indent=2) + '\n')
print('sent' if sent_any else 'no-send')
PY
