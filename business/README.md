# Business Ops Layer

This folder adds a lightweight operator layer for assistant-style and revenue-support work.

## Files
- `opportunities.csv` - current opportunities and next actions
- `followups.csv` - thread follow-up tracking
- `dashboard.md` - quick human-readable view
- `next_actions.md` - active priorities
- `refresh_dashboard.py` - regenerate the dashboard from CSV state
- `refresh_next_actions.py` - regenerate next actions from CSV state
- `state_summary.py` - generate a compact state summary from CSV state

## Principles
- Keep next actions concrete.
- Prefer human review before external outreach.
- Track stage, timing, and missing information.
- Update these files when meaningful new business context arrives.
