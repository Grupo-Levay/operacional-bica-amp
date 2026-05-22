# XOIA Workflow

PLAN → BUILD → CHECK → SHIP (automático, detecção por sinal no pedido)

## Modos
| Sinal | Modo | Ciclo |
|-------|------|-------|
| fix, ajusta, config | Quick | BUILD → CHECK → SHIP |
| cria, implementa, feature | Standard | PLAN → BUILD → CHECK → SHIP |
| arquitetura, migra, sistema | Deep | PLAN(design) → BUILD → CHECK → SHIP |

## PRE-CYCLE
- Leia `docs/xoia-memory/context-snapshot.md` — contexto completo do projeto
- Leia `docs/xoia-memory/learnings.md` se pedido tem paralelo com aprendizados anteriores
- WIP check: `git log --oneline | grep "^[a-f0-9]* WIP:"`

## PLAN
- Quick: pula. Standard: story em `docs/stories/`. Deep: design doc + story.
- Landing pages: `/XOIA:design-shotgun` antes de implementar.

## BUILD
- Segue tasks da story (ou direto se Quick). Testes para funcionalidade nova.
- Commits atômicos com conventional commits.
- Ciclo longo (>30min): `*checkpoint save`

## CHECK
- `npm run lint && npm test && npm run typecheck` — max 3 tentativas
- Falha 3x sem causa óbvia: `/XOIA:investigate`
- Landing pages: CRO scoring (CCD + MECLABS)

## SHIP
- `git push -u origin <branch>`
- PR via `mcp__github__create_pull_request`
- Append `docs/xoia-memory/sessions.jsonl`: `{"date":"YYYY-MM-DD","mode":"...","agent":"...","check_attempts":N,"status":"shipped"}`
- **Atualiza `docs/xoia-memory/context-snapshot.md`** — últimos ships, gaps, decisões

## Parar e Perguntar
Apenas quando: ambiguidade · decisão de negócio · credenciais · falha 3x · operação destrutiva

## Agentes (ativação direta)
`@dev` código · `@architect` sistema/DB · `@qa` qualidade · `@product` stories

## Stories
Formato: Title, Description, AC, Tasks. Local: `docs/stories/`. Estados: todo → done.

## Commits
`feat:` `fix:` `docs:` `chore:` + story ID quando aplicável
