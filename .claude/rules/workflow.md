# XOIA Workflow

## Deteccao de Modo

| Sinal | Modo | Ciclo |
|-------|------|-------|
| fix, ajusta, muda X para Y | **Quick** | BUILD→CHECK→SHIP |
| cria, implementa, feature, integra | **Standard** | PLAN→BUILD→CHECK→SHIP |
| projeta, arquitetura, avalia, migra | **Deep** | PLAN→BUILD→CHECK→SHIP |

## Passos

**PRE-CYCLE:** leia `docs/xoia-memory/context-snapshot.md` (não explore o codebase — o snapshot tem o estado atual).

**PLAN:** Quick=pula. Standard=story em `docs/stories/`. Deep=design doc+story.
→ Se Standard/Deep com 2+ tarefas independentes: use `/XOIA:orchestrate` antes de BUILD.

**ORCHESTRATE** (Standard/Deep com múltiplas tarefas):
- Decompor tarefas por domínio e arquivo
- Identificar paralelas vs sequenciais
- Criar briefs token-eficientes (escopo fechado, sem re-exploração)
- Lançar agentes em paralelo com `Agent` tool
- Agentes NÃO fazem commit nem lint — só o orquestrador
- Apresentar plano + budget estimado ao usuário antes de executar

**BUILD:** segue tasks da story (ou resultados do orchestrate). Commits atômicos.

**CHECK:** `npm run lint && npm test && npm run typecheck` — UMA vez, no final. Falhou: corrige e re-executa (max 3x). Falhou 3x: `/XOIA:investigate`.

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
