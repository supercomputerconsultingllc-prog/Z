import json
import getpass
from pathlib import Path

root = Path(__file__).resolve().parent
secrets_path = root / 'gmail-mail-secrets.json'
email = 'SupercomputerConsultingLLC@gmail.com'

password = getpass.getpass(f'Enter Google App Password for {email}: ')
if not password:
    raise SystemExit('No password entered; aborting.')

secrets = {
    'email': email,
    'password': password,
}

secrets_path.write_text(json.dumps(secrets, indent=2) + '\n')
secrets_path.chmod(0o600)
print(f'Wrote {secrets_path} with mode 600.')
print('Now run: python3 /home/ai/.openclaw/workspace/mail/test_gmail_mail.py')
