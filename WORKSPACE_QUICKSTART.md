# Workspace Quickstart

Minimal command reference for refreshing the main generated views in this workspace.

## Refresh everything
```bash
/home/ai/.openclaw/workspace/refresh_all.sh
```

## What it refreshes
- campaign outputs
- business outputs
- `STATUS.md`

## Subsystem refresh commands
### Campaign only
```bash
/home/ai/.openclaw/workspace/mail/refresh_all.sh
```

### Business only
```bash
/home/ai/.openclaw/workspace/business/refresh_all.sh
```

## Useful follow-up checks
```bash
python3 /home/ai/.openclaw/workspace/scripts/self_check.py
python3 /home/ai/.openclaw/workspace/scripts/generate_status_report.py
```
