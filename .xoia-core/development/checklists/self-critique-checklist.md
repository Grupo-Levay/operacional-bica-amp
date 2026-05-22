# Self-Critique Checklist

Run this before shipping any change. Be honest.

## Did I solve the right problem?
- [ ] I implemented exactly what was asked — no more, no less
- [ ] I didn't invent requirements not stated by the user
- [ ] I didn't over-engineer a simple request

## Is the code correct?
- [ ] I manually traced the happy path in my head and it works
- [ ] I considered what happens when inputs are empty, null, or unexpected
- [ ] I didn't introduce a security vulnerability (XSS, SQL injection, unvalidated input at boundaries)

## Is the code clean?
- [ ] A future developer can understand this without comments
- [ ] I didn't leave dead code, unused imports, or TODO comments
- [ ] Functions do one thing

## Did I test it?
- [ ] I ran lint + tests + typecheck and they all pass
- [ ] I verified the change works end-to-end (not just unit tests)

## Am I done?
- [ ] The story's acceptance criteria are all satisfied
- [ ] There are no loose ends I'm leaving for "later"
- [ ] If I can't finish something, I've noted it explicitly
