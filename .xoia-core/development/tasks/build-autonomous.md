# Task: Autonomous Build

## When to use
Standard/Deep mode — XOIA is executing a full cycle without user intervention.

## Cycle

```
PLAN → BUILD → CHECK → SHIP
```

### PLAN
1. Read PRD or user request
2. Create story in `docs/stories/` using template
3. Define AC and tasks
4. Confirm with user if ambiguous

### BUILD
1. Read story tasks
2. Implement each task atomically
3. Write tests as you go
4. Commit after each logical unit: `feat: {description} [Story {ID}]`

### CHECK
```bash
npm run lint && npm test && npm run typecheck
```
- Pass: proceed to SHIP
- Fail: fix and re-run (max 3 attempts)
- Fail 3x: call /XOIA:investigate before attempting again

### SHIP
```bash
git push -u origin {branch}
gh pr create --title "{title}" --body "..."
```
Mark story done. Append to `docs/xoia-memory/sessions.jsonl`.

## Stop conditions
Stop and ask the user only when:
1. Ambiguous requirement
2. Business decision needed
3. External credentials required
4. 3 failed CHECK attempts on same issue
