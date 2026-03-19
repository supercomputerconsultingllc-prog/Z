# Email Autopilot Policy

Mailbox: `SupercomputerConsultingLLC@gmail.com`

## Goals
- Summarize new/unread email
- Draft replies for messages that likely need a response
- Auto-reply only for low-risk cases
- Check every 15 minutes as a fallback even if the live watcher misses an event

## Operating rules

### 1) Summaries
Only summarize inbox mail that appears to be from a real human.

Prefer messages that look like:
- direct person-to-person email
- an individual sender name + email
- conversational/reply-style content
- messages in `INBOX`

Do not surface or summarize:
- newsletters
- promotions / marketing blasts
- bulk notifications
- automated digests
- obvious no-reply system mail unless it is operationally important

For each new actionable human email:
- identify sender
- identify subject
- summarize the ask in 1-3 bullets
- note urgency and whether a reply is likely needed

### 2) Draft replies
Create a draft-style suggested reply when:
- the sender asks a question
- a response is expected
- scheduling / acknowledgement / clarification would help

### 3) Auto-reply only when low-risk
Safe auto-reply categories:
- simple acknowledgement
- scheduling confirmation / follow-up
- brief clarification request
- lightweight routing / “got it, will review” messages

Do **not** auto-send when:
- legal, financial, contractual, or compliance issues appear
- the message is ambiguous
- the sender is high-stakes / new / sensitive
- tone or negotiation matters
- the assistant lacks enough context

### 4) Fallback behavior
Every 15 minutes:
- check recent unread/new mail
- catch up anything the watcher missed
- summarize important items into chat
- suggest drafts for reply-worthy messages
- only auto-send low-risk replies

### 5) Tone for replies
- concise
- professional
- neutral-warm
- no hype, no robotic filler
