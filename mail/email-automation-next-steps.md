# Gmail Automation Next Steps

## 1) Manual inbox triage

Quick unread triage:

```bash
bash ~/gogcli/mail/gmail-triage.sh SupercomputerConsultingLLC@gmail.com 'is:unread newer_than:7d' 20
```

Or from the workspace copy:

```bash
bash /home/ai/.openclaw/workspace/mail/gmail-triage.sh SupercomputerConsultingLLC@gmail.com 'is:unread newer_than:7d' 20
```

Useful queries:

```bash
is:unread newer_than:1d
in:inbox newer_than:1d
from:ttate@sdsc.edu newer_than:7d
label:inbox category:primary newer_than:2d
```

## 2) Fallback poll / catch-up

If the live watcher misses something, use Gmail history or a fresh unread search.

History check:

```bash
bash /home/ai/.openclaw/workspace/mail/gmail-history-check.sh SupercomputerConsultingLLC@gmail.com 2755
```

Search-based catch-up:

```bash
gog gmail search 'is:unread newer_than:1d' --account SupercomputerConsultingLLC@gmail.com --max 20
```

## 3) Safe response workflow

Recommended default: **draft first, send second**.

Best practice:
- auto-ingest and summarize new mail
- auto-draft only for obvious low-risk replies
- require human review for anything external/business-critical

Good candidates for automation:
- acknowledgements
- scheduling follow-ups
- routing/triage replies
- asking for clarification

Do not auto-send without review when:
- money/contracts are involved
- legal/sensitive topics appear
- the sender is new or unclear
- tone matters a lot

## 4) Operational recommendation

Use both:
- **live watcher** for near-real-time events
- **fallback unread/history triage** for catch-up

That gives you resilience when the watcher is flaky.
