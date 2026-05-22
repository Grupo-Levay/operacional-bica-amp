# Task: Resume Build from Checkpoint

## When to use
When resuming work from a WIP checkpoint in a previous session.

## Steps

### 1. Find the last checkpoint
```bash
git log --oneline | grep "^[a-f0-9]* WIP:"
```

### 2. Read the WIP commit message
```bash
git show {commit-hash} --no-patch
```
Extract:
- `story:` — which story was in progress
- `phase:` — PLAN/BUILD/CHECK/SHIP
- `next:` — exact next step
- `blockers:` — any blockers noted

### 3. Restore context
```bash
cat docs/stories/{story-id}.md
git status
git diff
```

### 4. Resume from exact `next:` step
Do not re-do completed work. Continue from where you left off.

### 5. If blockers were noted
Address them before continuing, or escalate to user if they require input.
