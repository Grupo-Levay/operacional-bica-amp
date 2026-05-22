# Definition of Done — Story Checklist

Use this checklist before marking any story as done.

## Code Quality
- [ ] All acceptance criteria met (verify each AC individually)
- [ ] `npm run lint` passes with zero errors
- [ ] `npm test` passes (all tests green)
- [ ] `npm run typecheck` passes with zero errors
- [ ] No `console.log` left in production code
- [ ] No hardcoded values that should be env vars

## Functionality
- [ ] Feature works in the happy path
- [ ] Edge cases handled (empty state, error state, loading state)
- [ ] No regressions in adjacent features

## Code Standards
- [ ] Follows existing patterns in the codebase
- [ ] TypeScript types are explicit (no `any` unless justified)
- [ ] Imports use `@/` alias where configured
- [ ] Components are semantic and accessible (min 52px touch targets on mobile)

## Git
- [ ] Commits use conventional format (`feat:`, `fix:`, `chore:`, `docs:`)
- [ ] Commit references story ID when applicable
- [ ] No unrelated changes mixed in

## Documentation
- [ ] Story updated with final status and notes if needed
- [ ] `docs/xoia-memory/learnings.md` updated if a non-obvious decision was made
