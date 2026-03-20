# Rewarded Revive Flow

## Current state
The game already has a mock rewarded revive placeholder.

## Recommended production flow
1. Player loses the run.
2. Show revive modal.
3. Offer one rewarded revive.
4. If ad completes, restore a partial squad and resume.
5. If declined, end run normally.

## Guardrails
- one rewarded revive per run
- keep the revive value meaningful but not overpowered
- do not stack deceptive prompts
- make the skip path obvious

## Copy example
### Title
Get back in the fight?

### Body
Watch one short ad to bring part of your squad back and keep the run alive.

### Buttons
- Revive with Ad
- No Thanks
