# Task: Waves — Parallel Task Analysis

## When to use
When `*waves` is called or when planning execution of multiple tasks.

## What it does
Analyzes story tasks and groups them into parallel execution waves.
Tasks in the same wave can run concurrently. Each wave must complete before the next starts.

## Steps

### 1. List all tasks from the story
Read `docs/stories/{story-id}.md` and extract all `- [ ] T{N}: ...` items.

### 2. Build dependency graph
For each task, ask: "Does this task require output from another task?"
- If yes: add a directed edge (dependency)
- If no: it's a root task (can start immediately)

### 3. Group into waves
- Wave 1: tasks with no dependencies
- Wave 2: tasks whose only dependencies are in Wave 1
- Wave N: tasks whose dependencies are all in previous waves

### 4. Display result
```
Wave 1 (parallel): T1, T3, T5
Wave 2 (parallel): T2, T4
Wave 3 (serial):   T6
```

Add `--visual` for ASCII diagram:
```
T1 ──┐
T3 ──┼──► Wave 1 ──► T2 ──► Wave 2 ──► T6
T5 ──┘              T4 ──┘
```

### 5. Execute
Run each wave using parallel tool calls where possible.
