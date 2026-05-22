# Task: Execute Checklist

## When to use
When running a formal checklist (DoD, self-critique, CRO scoring).

## Steps

1. **Read the checklist** from `.xoia-core/development/checklists/{checklist}.md`

2. **Evaluate each item** honestly:
   - `[x]` — confirmed passing
   - `[ ]` — failed or not yet done

3. **For each failed item**, either:
   - Fix it immediately if it's a quick fix
   - Note it as a blocker if it requires user input

4. **Report results**:
   ```
   Checklist: {name}
   Passed: {N}/{total}
   Failed: {list of failed items}
   ```

5. **Do not ship** if any critical items fail (lint, tests, typecheck, AC coverage).
