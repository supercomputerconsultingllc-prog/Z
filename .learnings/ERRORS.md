## [ERR-20260318-001] outlook_mail_test

**Logged**: 2026-03-18T02:27:00-07:00
**Priority**: high
**Status**: pending
**Area**: config

### Summary
The local Outlook IMAP/SMTP test script failed after prompting the user to configure credentials.

### Error
```
User reported: "Failed after python3 /home/ai/.openclaw/workspace/mail/test_outlook_mail.py"
Exact stderr/output not yet captured.
```

### Context
- Operation attempted: validate Outlook.com mail-only access via IMAP/SMTP
- Files involved:
  - `/home/ai/.openclaw/workspace/mail/outlook-mail-secrets.json`
  - `/home/ai/.openclaw/workspace/mail/test_outlook_mail.py`
- Likely causes include incorrect password, Microsoft auth restrictions, or basic-auth login rejection for IMAP/SMTP.

### Suggested Fix
Ask for the exact error output, then adapt the bridge strategy based on whether the failure is IMAP auth, SMTP auth, or account-side protocol restrictions.

### Metadata
- Reproducible: unknown
- Related Files: /home/ai/.openclaw/workspace/mail/test_outlook_mail.py

---
## [ERR-20260318-001] gmail-autopilot-fallback-poll

**Logged**: 2026-03-19T05:58:00Z
**Priority**: high
**Status**: pending
**Area**: infra

### Summary
Gmail fallback poll could not read the SupercomputerConsultingLLC mailbox in non-interactive cron context because the existing local auth paths both failed.

### Error
```text
gog auth list -> read token for supercomputerconsultingllc@gmail.com: read token: no TTY available for keyring file backend password prompt; set GOG_KEYRING_PASSWORD

python imaplib login -> [AUTHENTICATIONFAILED] Invalid credentials (Failure)
```

### Context
- Operation attempted: cron-driven Gmail unread-mail poll for SupercomputerConsultingLLC@gmail.com
- gog was available but keyring-backed token access required GOG_KEYRING_PASSWORD in this non-interactive session
- local IMAP fallback using mail/gmail-mail-secrets.json also failed authentication
- Related policy file: /home/ai/.openclaw/workspace/mail/email-autopilot-policy.md

### Suggested Fix
Verify which auth path is intended for unattended mailbox polling, then either:
1. provide the correct GOG_KEYRING_PASSWORD to the cron/runtime environment, or
2. refresh/replace the Gmail app password in mail/gmail-mail-secrets.json and re-test IMAP/SMTP login.

### Metadata
- Reproducible: yes
- Related Files: /home/ai/.openclaw/workspace/mail/gmail-triage.sh, /home/ai/.openclaw/workspace/mail/test_gmail_mail.py, /home/ai/.openclaw/workspace/mail/gmail-mail-secrets.json

---
## [ERR-20260319-001] clawhub_rate_limit_and_suspicious_package

**Logged**: 2026-03-19T20:33:00-07:00
**Priority**: medium
**Status**: pending
**Area**: infra

### Summary
Bulk ClawHub installs hit registry rate limits, and one candidate package was flagged suspicious.

### Error
```
Rate limit exceeded (retry in 1s, remaining: 0/20, reset in 1s)
Error: Use --force to install suspicious skills in non-interactive mode
```

### Context
Attempted parallel installs of gog, github-cli, mcporter, tmux, and weather. Registry throttled repeated requests, and github-cli was flagged suspicious by VirusTotal Code Insight.

### Suggested Fix
Serialize ClawHub installs instead of parallelizing them, and prefer built-in/first-party skills over suspicious registry packages.

### Metadata
- Reproducible: yes
- Related Files: /home/ai/.openclaw/workspace/skills

---
