# XOIA Workflow

## Deteccao de Modo

| Sinal | Modo | Ciclo |
|-------|------|-------|
| fix, ajusta, muda X para Y | **Quick** | BUILD→CHECK→SHIP |
| cria, implementa, feature, integra | **Standard** | PLAN→BUILD→CHECK→SHIP |
| projeta, arquitetura, avalia, migra | **Deep** | PLAN→BUILD→CHECK→SHIP |

## Passos

**PRE-CYCLE:** leia `docs/xoia-memory/learnings.md` e `context-snapshot.md` se relevante

**PLAN:** Quick=pula. Standard=story em `docs/stories/`. Deep=design doc+story.

**BUILD:** segue tasks da story. Commits atomicos. Ciclos >30min: `/XOIA:checkpoint save`

**CHECK:** `npm run lint && npm test && npm run typecheck`. Falhou: corrige e re-executa (max 3x). Falhou 3x sem causa obvia: `/XOIA:investigate`.

**SHIP:** push → PR → marca story `done` → append `docs/xoia-memory/sessions.jsonl`:
`{"date":"YYYY-MM-DD","mode":"...","story":"S?.?","agent":"dev","check_attempts":N,"status":"shipped"}`

## Para e Pergunta quando
1. Ambiguidade no pedido
2. Decisao de negocio com tradeoffs
3. Credenciais ou acesso necessario
4. 3 tentativas falharam
5. Operacao destrutiva

## Stories
- Formato: Title, Description, AC, Tasks (checklist)
- Local: `docs/stories/`
- Estados: `todo` → `done` (simples) | `todo` → `doing` → `done` (epic)

## Commits
`feat:` `fix:` `docs:` `chore:` + story ID quando aplicavel
