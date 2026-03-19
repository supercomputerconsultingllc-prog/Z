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
- keep the current working reply formatting style
- never use em dashes

## 3) Sending policy
Default behavior: **draft for all human emails**.

Auto-send is allowed only when all of the following are true:
- the sender appears to be an individual human
- the email is analyzed as likely human-written rather than AI-generated, bulk-written, or heavily templated
- if there is uncertainty about whether it is human-written, draft only and do not auto-send
- the reply is low-risk or medium-risk, but not high-risk
- the reply does not involve personal details
- the reply does not require sensitive judgment, negotiation, or unusually delicate tone handling

Potentially acceptable low-risk categories:
- simple acknowledgement
- scheduling confirmation / follow-up
- brief clarification request
- lightweight routing / "got it, will review" messages

Potentially acceptable medium-risk categories:
- straightforward follow-up answers with clear context
- basic factual responses that do not expose personal details
- simple coordination messages where tone stakes are moderate but manageable

Do **not** auto-send when:
- legal, financial, contractual, or compliance issues appear
- personal details are involved
- the message is ambiguous
- the sender is unknown, high-stakes, or sensitive
- the email may be AI-written, bulk-written, or heavily templated
- tone or negotiation matters in a sensitive way
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

### 6) Business-development lens
Apply the data center consulting / lead-development lens only when the opportunity naturally presents itself.

Use that lens when:
- the email is business-related
- the sender appears relevant to consulting work
- there is a natural opening to clarify needs, offer help, or suggest a next step

Do not use that lens when:
- the email is personal
- the email is purely social
- a business-development angle would feel forced or out of place
- the message is operational but not a lead/opportunity moment
