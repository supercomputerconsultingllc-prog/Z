# Supercomputer Consulting — CRM Pipeline and Deal Hygiene

## Purpose
This document defines how SCC should track, advance, and clean a premium consulting pipeline.

For high-end advisory work, the CRM is not just a contact database. It is the system for:
- protecting follow-up discipline,
- qualifying real opportunities,
- avoiding sloppy proposals,
- and keeping senior-level sales activity focused on deals that can close.

---

## CRM design principles
- Keep stages simple enough to use consistently.
- Every open deal must have a named owner and dated next step.
- Do not confuse activity with progress.
- Only advance a deal when something buyer-validated has changed.
- Preserve useful context in notes so future follow-up is sharp.
- Track why deals stall or die; that is strategy data.

---

## Recommended CRM objects
At minimum, track:

### Accounts
Company or organization record.

**Required fields**
- account name
- segment
- tier (A / B / C)
- website
- geography
- account type (investor, operator, enterprise, AI/HPC, referral partner)
- strategic notes
- known trigger or initiative
- account status

### Contacts
Individual stakeholders.

**Required fields**
- full name
- title
- role in deal (economic buyer, sponsor, influencer, referrer)
- email
- LinkedIn URL
- relationship status
- last touch date
- next touch date

### Opportunities
Specific potential engagement.

**Required fields**
- opportunity name
- linked account
- primary contact
- likely service line
- deal stage
- estimated value range
- urgency / timing
- source
- current pain / trigger
- next step
- next step date
- confidence level
- close-lost reason if applicable

---

## Pipeline stages
Use the following stage structure.

### 1. Target account
**Definition:** strong-fit account identified, but no active conversation yet.

**Entry criteria**
- account fits SCC ideal profile
- at least one target contact identified
- reason for targeting is documented

**Exit criteria**
- first outreach sent

**Mandatory fields**
- segment
- tier
- trigger or rationale
- first contact selected

---

### 2. Outreach active
**Definition:** outbound sequence is underway but no meaningful engagement yet.

**Entry criteria**
- at least one outreach touch sent
- touch dates logged

**Exit criteria**
- contact replies with real interest, referral, or disqualification
- sequence completed with no engagement, then moved to nurture

**Rules**
- max 4 to 5 active touches before nurture
- every touch logged with date and channel
- if no next planned touch, the record is incomplete

---

### 3. Engaged
**Definition:** prospect has replied, connected, forwarded internally, or otherwise shown real interest.

**Entry criteria**
One of the following:
- replied with substantive comment or question
- accepted intro and opened discussion
- referred SCC to another stakeholder
- requested materials
- indicated timing or project relevance

**Exit criteria**
- discovery call scheduled
- disqualified
- deferred to nurture with reason

**What to capture**
- what got their attention
- who else is involved
- problem they appear to care about
- timing signal

---

### 4. Discovery scheduled
**Definition:** a live fit conversation is booked.

**Entry criteria**
- date/time confirmed
- meeting purpose stated

**Exit criteria**
- discovery completed and notes entered

**Required prep fields**
- likely problem statement
- hypothesized offer fit
- call objective
- known stakeholders

---

### 5. Qualified opportunity
**Definition:** discovery indicates a real business problem SCC may be hired to address.

**Entry criteria**
All or most of the following are true:
- clear problem exists
- SCC is plausibly a fit
- buyer or sponsor identified
- timing is real
- next step agreed

**Exit criteria**
- scope / proposal requested
- opportunity parked with explicit reason
- disqualified

**Qualification questions**
- What decision or risk is driving this?
- Why now?
- What happens if they do nothing?
- Who owns the decision?
- Is independent advisory truly wanted, or are they shopping commodity support?

---

### 6. Scope / proposal in progress
**Definition:** SCC is shaping the engagement structure or preparing a proposal.

**Entry criteria**
- buyer confirmed enough context to frame scope
- proposal path agreed

**Exit criteria**
- proposal sent
- opportunity withdrawn or parked

**Rules**
- do not write proposals on vague pain alone
- confirm deliverable type, timing, stakeholders, and commercial posture first
- note open questions before drafting

---

### 7. Proposal sent
**Definition:** a commercial scope, proposal, or engagement outline has been delivered.

**Entry criteria**
- proposal sent date logged
- review / decision process understood as best as possible

**Exit criteria**
- verbal yes
- revision request
- no decision / stalled
- closed lost

**Mandatory fields**
- proposal value
- delivery date
- decision owner
- expected response date

---

### 8. Verbal yes / commercial alignment
**Definition:** prospect has indicated intent to proceed pending paperwork, legal, or final internal approval.

**Entry criteria**
- explicit positive buying signal
- path to signature understood

**Exit criteria**
- signed engagement
- deal stalls materially
- internal approval fails

**Rules**
- treat as active until signed, not won early
- log blockers immediately

---

### 9. Closed won
**Definition:** engagement is signed or otherwise formally committed.

**Required fields**
- signed date
- final value
- service line
- delivery start date
- internal handoff notes

**Post-close actions**
- schedule kickoff
- transfer context to delivery materials
- set reminder for testimonial / referral / expansion check later

---

### 10. Closed lost
**Definition:** opportunity will not move forward.

**Required closed-lost reasons**
- no urgency
- not a fit
- budget mismatch
- chose incumbent or competitor
- internal resource chosen
- project delayed
- no response after proposal
- political / stakeholder issue
- shopping low-cost consulting

**Mandatory note**
Document the actual reason in plain language, not just a dropdown value.

---

### 11. Nurture / parked
**Definition:** account or opportunity is real but not active now.

**Use when**
- timing is not right
- budget cycle is later
- project is paused
- buyer asked to reconnect later
- contact is strategically valuable but no live deal exists

**Required fields**
- reason parked
- next revisit date
- likely trigger for reactivation

---

## Stage advancement rules
Advance a record only when the buyer has done something that changes the situation.

### Good reasons to advance
- replied with meaningful interest
- introduced another stakeholder
- booked a meeting
- confirmed a live project
- requested scope or proposal
- aligned on next commercial step

### Bad reasons to advance
- you sent another follow-up
- they opened an email
- they were polite on LinkedIn
- you feel optimistic
- you want a healthier-looking pipeline

---

## Opportunity qualification standard
Before treating a deal as serious, confirm as many of these as possible:

- **Problem:** specific risk, project, or decision exists
- **Importance:** issue matters enough to command senior attention
- **Timing:** there is a real window, deadline, or planning cycle
- **Buyer:** someone can approve budget or sponsor the work
- **Fit:** SCC’s independent advisory model matches what they need
- **Commercial logic:** the likely value of the decision outweighs advisory cost

If these are weak, the record belongs in nurture, not forecast.

---

## Required deal hygiene
These rules should be non-negotiable.

### Every active opportunity must have:
- current stage
- estimated value or value band
- named primary contact
- defined business problem
- dated next step
- note from most recent interaction

### Every meeting must produce:
- summary note
- updated qualification view
- stakeholder map update
- next step with owner and date

### Every proposal-stage deal must include:
- decision process notes
- budget posture if known
- likely objections
- proposal due date
- follow-up date already scheduled

---

## Note-taking format
Use a consistent note format so the CRM stays useful.

### Recommended note structure
**Date:**
**Contact(s):**
**Summary:**
**What matters to them:**
**Risks / objections:**
**Stakeholders mentioned:**
**Next step:**
**Next step date:**

### Example
**Date:** 2026-03-18  
**Contact(s):** Jane Smith, VP Operations  
**Summary:** Team is evaluating whether to modernize existing cooling infrastructure or sequence a broader retrofit. Reliability concerns are rising ahead of a capacity increase.  
**What matters to them:** Avoid unplanned downtime, validate capex priorities, get an outside view before locking scope.  
**Risks / objections:** CFO will ask why external advisory is needed if design firm is already engaged.  
**Stakeholders mentioned:** CFO, Director of Facilities Engineering.  
**Next step:** SCC to send brief outline of an independent owner-side review.  
**Next step date:** 2026-03-21

---

## Stakeholder mapping
For larger consulting opportunities, map these roles explicitly:
- economic buyer
- operational sponsor
- technical validator
- blocker or skeptic
- procurement / legal contact

Questions to answer:
- Who feels the pain?
- Who approves spend?
- Who can quietly kill the project?
- Who benefits if nothing changes?

A deal with only one enthusiastic contact is fragile until the broader map is clear.

---

## Forecasting guidance
Use a conservative forecast.

### Best case
Only include deals where:
- discovery is complete,
- the problem is real,
- buyer is identified,
- and there is a defined proposal or approval process.

### Commit-level confidence
Reserve for deals with:
- proposal accepted in principle or verbal yes,
- clear path to signature,
- no major unknown decision gate.

High-end consulting pipelines can look lumpy. Do not solve that by inflating probability.

---

## Re-engagement rules for stalled deals
A deal is stale when any of these are true:
- no reply for 14+ days in an active cycle
- no next meeting after discovery
- proposal sent with no decision path
- internal sponsor disappears or goes quiet

### Stalled deal recovery sequence
1. Send a concise follow-up tied to the agreed next step.
2. If no reply, send a close-the-loop note after 5 to 7 business days.
3. If strategically valuable, re-enter nurture with a future trigger date.
4. If clearly dead, close lost with real reason.

Do not let silent deals sit indefinitely in late stages.

---

## Close-lost analysis
Review closed-lost deals monthly.

### Questions to ask
- Were we targeting the wrong buyer?
- Was timing too early?
- Did the offer feel too broad?
- Did they really want implementation or staffing instead?
- Was price the stated objection but fit the real issue?
- Did we propose before the business case was strong enough?

This analysis should influence targeting, message angles, and offer packaging.

---

## Next-step templates
Use these to standardize momentum.

### 1. After initial interest
**Next step:** book 20-minute fit call with buyer / sponsor.

### 2. After discovery call
**Next step:** SCC sends short recap and recommended engagement path.

### 3. After multi-stakeholder discovery
**Next step:** stakeholder alignment call or document review.

### 4. Before proposal
**Next step:** confirm scope boundaries, deliverables, timing, and decision process.

### 5. After proposal sent
**Next step:** proposal review call on [date].

### 6. When timing is later
**Next step:** reconnect in [month] ahead of planning / capital cycle.

### 7. When another stakeholder is needed
**Next step:** introduction to [role] to validate fit and scope.

---

## Example pipeline flow
Here is what healthy progression looks like:

1. Target account identified because operator is planning expansion.
2. Personalized outbound sent to COO.
3. COO replies and copies VP Operations.
4. Discovery call booked with VP Operations.
5. Discovery reveals real resilience and sequencing concerns.
6. SCC sends recap and proposes owner-side assessment.
7. Scope discussion confirms deliverables, timeline, and budget posture.
8. Proposal sent.
9. Review call held; minor revisions made.
10. Verbal yes.
11. Signed engagement and kickoff.

This is what “advancement” means: buyer actions, not just seller activity.

---

## Weekly CRM review checklist
Run once per week.

### Pipeline hygiene
- Which records lack a next step?
- Which opportunities are stale?
- Which proposal-stage deals need follow-up now?
- Which accounts should move from outreach to nurture?

### Pipeline quality
- How many real qualified opportunities exist?
- Are there too many low-fit deals in active stages?
- Which segments are producing the best conversations?
- Which loss reasons are recurring?

### Pipeline focus
Pick the top 5 opportunities that deserve founder attention next week.
Premium consulting sales are won by focus, not by spreading attention evenly.

---

## Minimum CRM standard for SCC
If SCC does only five things consistently, do these:
1. Log every meaningful touch.
2. Keep every active record attached to a dated next step.
3. Write real discovery notes, not vague summaries.
4. Move weak deals to nurture instead of pretending they are active.
5. Close lost deals honestly so the market feedback is visible.

---

## Final standard
A clean SCC CRM should answer, at a glance:
- Which accounts matter most?
- Which conversations are truly active?
- What problem each prospect is trying to solve?
- What the exact next step is?
- And whether the pipeline contains real consulting opportunities or just polite interest.
