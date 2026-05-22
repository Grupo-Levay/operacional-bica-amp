# Task: Apply QA Fixes

## When to use
When `@qa` has produced a report with issues and `@dev` needs to apply the fixes.

## Steps

### 1. Read the QA report
The report is either:
- In the current conversation
- In `docs/stories/{story-id}.md` under a QA section
- Inline in the code as TODO comments

### 2. Triage issues by severity
| Severity | Action |
|----------|--------|
| Critical | Fix before shipping (broken functionality, security) |
| High | Fix before shipping (poor UX, missing AC) |
| Medium | Fix if < 30min, otherwise note in story |
| Low | Note in story for future cycle |

### 3. Fix in order of severity
For each critical/high issue:
1. Identify the exact file and line
2. Apply minimal fix
3. Verify fix doesn't break adjacent behavior
4. Run targeted test: `npm test -- {test-file}`

### 4. Re-run full CHECK
```bash
npm run lint && npm test && npm run typecheck
```

### 5. Update story
Note which QA issues were fixed and which were deferred (with reason).
