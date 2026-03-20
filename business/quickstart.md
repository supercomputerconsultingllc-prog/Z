# Business Ops Quickstart

Minimal command reference for the business-ops layer.

## Refresh dashboard
```bash
python3 /home/ai/.openclaw/workspace/business/refresh_dashboard.py
```

## Refresh next actions
```bash
python3 /home/ai/.openclaw/workspace/business/refresh_next_actions.py
```

## Refresh state summary
```bash
python3 /home/ai/.openclaw/workspace/business/state_summary.py
```

## Refresh everything in one step
```bash
/home/ai/.openclaw/workspace/business/refresh_all.sh
```

## Recommended order after updating CSV state
1. Refresh dashboard
2. Refresh next actions
3. Refresh state summary
