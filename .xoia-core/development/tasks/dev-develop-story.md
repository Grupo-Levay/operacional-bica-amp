# Task: Develop Story

## When to use
When `*build {story-id}` is called or when implementing a new feature story.

## Steps

### 1. Read the story
```bash
cat docs/stories/{story-id}.md
```
Confirm: story status is `todo` or `doing`. Update to `doing`.

### 2. Analyze the codebase
Before writing code:
- Identify which files will be touched
- Check existing patterns in similar files
- Read `docs/xoia-memory/learnings.md` for relevant past decisions

### 3. Implement tasks in order
Work through each task checkbox:
- Implement the smallest working change first
- Commit atomically per logical unit
- Mark tasks complete as you go: `- [x] T1: ...`

### 4. Write tests
For every new function or component:
- Unit test for the logic
- Integration test if it touches external services (Supabase, API)

### 5. Run CHECK
```bash
npm run lint && npm test && npm run typecheck
```
If any fail → fix before continuing. Max 3 attempts. On 3rd failure, use /XOIA:investigate.

### 6. Update story
Change status to `done`. Add notes if decisions were made.

### 7. Ship
Run `*ship` to commit, push, and create PR.
