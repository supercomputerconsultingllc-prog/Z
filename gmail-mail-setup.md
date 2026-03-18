# Gmail Mail-Only Setup

This workstation will use a simple local mail bridge for the Gmail account:
- IMAP for reading mail
- SMTP for sending mail
- credentials stored in a separate local secrets file

## Account
- Email: `SupercomputerConsultingLLC@gmail.com`

## Required Google account settings
1. Enable **2-Step Verification**
2. Create a **Google App Password**
3. Use the app password locally for this setup (not the normal Gmail password)

## Gmail servers
### IMAP
- Host: `imap.gmail.com`
- Port: `993`
- Security: `SSL/TLS`

### SMTP
- Host: `smtp.gmail.com`
- Port: `587`
- Security: `STARTTLS`

## Files
- Config template: `mail/gmail-mail-config.json`
- Secrets template: `mail/gmail-mail-secrets.json`
- Setup helper: `mail/setup_gmail_secrets.py`
- Test script: `mail/test_gmail_mail.py`

## Setup flow
1. Turn on Google 2-Step Verification.
2. Create a Google App Password.
3. Run the helper script and paste the **app password** locally.
4. Run the test script to verify IMAP and SMTP login.

## Security notes
- Do not paste the password or app password into chat.
- Keep the secrets file local to this workstation.
- Restrict file permissions on the secrets file.

## Commands
```bash
python3 /home/ai/.openclaw/workspace/mail/setup_gmail_secrets.py
python3 /home/ai/.openclaw/workspace/mail/test_gmail_mail.py
```

## Expected result
The script should:
- log into IMAP
- list mailbox summary
- connect to SMTP
- authenticate successfully
