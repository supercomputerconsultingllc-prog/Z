# CAPABILITIES.md

A persistent catalog of what this assistant can do in this OpenClaw workspace.

## Core tool-backed functions

### File and workspace
- `read` - read text files and local images
- `write` - create or overwrite files
- `edit` - make exact text replacements in files
- `exec` - run shell commands
- `process` - manage long-running/background exec sessions

### Web and retrieval
- `web_search` - search the web
- `web_fetch` - fetch readable page content from URLs

### Scheduling and reminders
- `cron` - create, update, remove, and run scheduled jobs/reminders

### Sessions and delegation
- `sessions_list` - inspect recent/active sessions
- `sessions_history` - fetch another session's history
- `sessions_send` - message another session
- `sessions_spawn` - spawn isolated sub-agents or ACP sessions
- `sessions_yield` - yield after delegating work
- `subagents` - list, steer, or kill sub-agents

### Memory and status
- `memory_search` - semantic search over memory files
- `memory_get` - safe snippet read from memory files
- `session_status` - status card, current session metadata, and time/date lookup

## Built-in operating abilities
- answer questions
- draft and rewrite text
- summarize documents
- inspect screenshots and local images
- plan workflows and campaigns
- edit scripts and docs in the workspace
- log learnings and improve recurring processes
- commit workspace changes to git

## Installed local skills in this workspace
- `gog` - Google Workspace CLI workflows
- `image-chat-preview` - display local images in chat
- `m365-pnp-cli` - Microsoft 365 PnP CLI workflows
- `m365cli` - Microsoft 365 work account workflows
- `mcporter` - MCP server/tool operations
- `outlook-calendar` - Outlook calendar access
- `outlook-email` - Outlook email workflows
- `pdf-inbox-reporter` - summarize PDFs from inbox to reports
- `self-improving-agent` - log learnings, errors, and feature requests
- `tmux` - remote-control tmux sessions
- `weather` - weather and forecasts

## Available global skills in this environment
These are available to use even if not copied into `workspace/skills`.

- `prose`
- `clawhub`
- `gh-issues`
- `github`
- `healthcheck`
- `node-connect`
- `oracle`
- `session-logs`
- `skill-creator`
- `video-frames`

## Important guardrails
- Ask before sending external communications.
- Ask before destructive actions.
- Prefer bounded improvement loops over open-ended autonomy.
- Do not claim a fix without checking the real generation path.

## Practical examples
- "Draft a reply to this email."
- "Schedule a reminder for tomorrow at 9 AM."
- "Search the web for current pricing."
- "Summarize this PDF from the inbox into a report."
- "Spawn a coding sub-agent to investigate this bug."
- "Show me the latest screenshot in chat."
- "Audit your current capabilities and tell me what changed."
- "Generate campaign drafts from the contact CSV, but do not send anything."

## Local helper scripts added
- `scripts/audit_capabilities.py` - compare workspace skills against `capabilities.json`
- `scripts/refresh_capabilities.py` - rebuild `capabilities.json` from current workspace skills and known static tool inventory
- `scripts/next_improvement_prompt.py` - generate one bounded next-improvement prompt from current workspace state
- `scripts/run_bounded_improvement.sh` - print the bounded self-review prompt and stop
- `mail/campaign_generate_drafts.py` - generate approval-first outbound drafts from CSV
- `mail/campaign_update_status.py` - update campaign status for a contact
- `mail/campaign_queue_approved.py` - move approved contacts into a queue
- `mail/campaign_pipeline.md` - lightweight campaign workflow

## Local campaign controls added
- suppression list support via `mail/campaign_suppression_list.csv`
- send limits via `mail/campaign_send_limits.json`
- approval queue via `mail/campaign_approval_queue.md`
- send history ledger via `mail/campaign_send_history.csv`
