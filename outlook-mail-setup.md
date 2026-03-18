# Outlook Mail-Only Setup

This workstation will use a simple local mail bridge for the Outlook account:
- IMAP for reading mail
- SMTP for sending mail
- credentials stored in a separate local secrets file

## Account
- Email: `supercomputerconsulting@outlook.com`

## Outlook servers
### IMAP
- Host: `outlook.office365.com`
- Port: `993`
- Security: `SSL/TLS`

### SMTP
- Host: `smtp.office365.com`
- Port: `587`
- Security: `STARTTLS`

## Files
- Config template: `mail/outlook-mail-config.json`
- Secrets template: `mail/outlook-mail-secrets.json`
- Test script: `mail/test_outlook_mail.py`

## Setup flow
1. Fill in `mail/outlook-mail-secrets.json` locally with the real Outlook password.
2. Run the test script to verify IMAP and SMTP login.
3. If login works, the same config can be used as the basis for a lightweight OpenClaw mail bridge.

## Security notes
- Do not paste the password into chat.
- Keep the secrets file local to this workstation.
- Restrict file permissions on the secrets file.

## Commands
```bash
chmod 600 mail/outlook-mail-secrets.json
python3 mail/test_outlook_mail.py
```

## Expected result
The script should:
- log into IMAP
- list mailbox summary
- connect to SMTP
- authenticate successfully

If either login fails, the likely causes are:
- incorrect password
- account-side auth restriction
- Microsoft blocking legacy/basic auth for that account flow
