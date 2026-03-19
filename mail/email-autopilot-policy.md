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
Always create a draft-style suggested reply for every summarized human email.

Drafts should:
- answer the message if possible
- acknowledge receipt when appropriate
- ask clarifying questions when needed
- stay concise and professional
- never use em dashes

## 3) Sending policy
Default behavior: **draft first, never auto-send without confirmation** unless the reply is extremely obvious and low-risk.

Potentially obvious low-risk categories:
- simple acknowledgement
- scheduling confirmation / follow-up
- brief clarification request
- lightweight routing / "got it, will review" messages

Even for low-risk cases, prefer confirmation before sending whenever practical.

Do **not** auto-send when:
- legal, financial, contractual, or compliance issues appear
- the message is ambiguous
- the sender is high-stakes / new / sensitive
- tone or negotiation matters
- the assistant lacks enough context
- the reply would benefit from human review

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
- never use em dashes
