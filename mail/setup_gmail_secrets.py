from pathlib import Path

root = Path(__file__).resolve().parent
secrets_path = root / 'gmail-mail-secrets.json'

print('Gmail account setup in this workspace now uses GOG/OAuth, not a local IMAP/SMTP app password.')
print('No secret needs to be written here for normal OpenClaw Gmail access.')
print(f'Legacy placeholder file remains at: {secrets_path}')
print('To verify access, run: python3 /home/ai/.openclaw/workspace/mail/test_gmail_mail.py')
