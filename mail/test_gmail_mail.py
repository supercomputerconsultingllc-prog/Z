import json
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
config = json.loads((ROOT / 'gmail-mail-config.json').read_text())
account = config.get('email', 'SupercomputerConsultingLLC@gmail.com')

print(f'Testing Gmail account access through GOG for {account}...')

if not os.environ.get('GOG_KEYRING_PASSWORD'):
    raise SystemExit('GOG_KEYRING_PASSWORD is not set in the environment.')

search = subprocess.run(
    ['gog', 'gmail', 'search', 'in:inbox newer_than:7d', '--account', account, '--max', '1'],
    capture_output=True,
    text=True,
)

if search.returncode != 0:
    raise SystemExit(search.stderr.strip() or search.stdout.strip() or 'GOG Gmail search failed.')

print('GOG Gmail search OK')
print(search.stdout.strip() or '(no recent inbox results)')
print('\nGmail account access is working through GOG/OAuth.')
print('Note: this workspace no longer validates Gmail via local IMAP/SMTP app-password secrets.')
