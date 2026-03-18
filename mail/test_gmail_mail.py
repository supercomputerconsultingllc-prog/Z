import imaplib
import json
import smtplib
import ssl
from pathlib import Path

ROOT = Path(__file__).resolve().parent
config = json.loads((ROOT / 'gmail-mail-config.json').read_text())
secrets = json.loads((ROOT / 'gmail-mail-secrets.json').read_text())

email = secrets['email']
password = secrets['password']

if password == 'REPLACE_WITH_GOOGLE_APP_PASSWORD_LOCALLY':
    raise SystemExit('Set the Google app password in mail/gmail-mail-secrets.json before running this test.')

print('Testing Gmail IMAP...')
imap = imaplib.IMAP4_SSL(config['imap']['host'], config['imap']['port'])
imap.login(email, password)
status, mailboxes = imap.list()
print('IMAP login OK')
print(f'Mailboxes visible: {len(mailboxes or [])}')
imap.logout()

print('Testing Gmail SMTP...')
context = ssl.create_default_context()
with smtplib.SMTP(config['smtp']['host'], config['smtp']['port']) as smtp:
    smtp.ehlo()
    smtp.starttls(context=context)
    smtp.ehlo()
    smtp.login(email, password)
    print('SMTP login OK')

print('All Gmail tests passed.')
