# XOIA Workflow — Ciclo Autonomo

## Comportamento Padrao

Quando o usuario descreve o que precisa, o XOIA executa o ciclo completo **automaticamente**:

```
PLAN  →  BUILD  →  CHECK  →  SHIP
```

O usuario NAO precisa digitar comandos. O XOIA detecta o modo e executa.

## Deteccao Automatica de Modo

| Sinal no pedido | Modo | Ciclo |
|-----------------|------|-------|
| "corrige", "fix", "ajusta", "muda X para Y", config simples | **Quick** | BUILD → CHECK → SHIP |
| "cria", "implementa", "landing page", "feature", "integra" | **Standard** | PLAN → BUILD → CHECK → SHIP |
| "projeta sistema", "arquitetura", "avalia codebase", "migra" | **Deep** | PLAN (design) → BUILD → CHECK → SHIP |

## Execucao de Cada Passo

### PRE-CYCLE (automatico)
- Leia `docs/xoia-memory/learnings.md` se houver entradas relevantes ao pedido
- Para landing pages/design: leia `docs/xoia-memory/clients/<cliente>.md`
- Se há WIP checkpoints recentes: `git log --oneline | grep "^[a-f0-9]* WIP:"` para retomar

### PLAN (automatico)
- Quick: pula — vai direto para BUILD
- Standard: cria story em `docs/stories/` com Title, Description, AC, Tasks
- Deep: cria design doc + story
- Para landing pages: use `/XOIA:design-shotgun` antes de implementar

### BUILD (automatico)
- Implementa codigo seguindo tasks da story (ou direto se Quick)
- Escreve testes para funcionalidade nova
- Para landing pages: componentes semanticos, Core Web Vitals budget, A/B scaffolding
- Faz commits atomicos com conventional commits
- Em ciclos longos (>30min estimados): salve checkpoint com `/XOIA:checkpoint save`

### CHECK (automatico)
- Roda: `npm run lint && npm test && npm run typecheck`
- Se falhar: corrige e re-executa (max 3 tentativas)
- Se falhar 3x e causa nao e obvia: use `/XOIA:investigate` antes de tentar de novo
- Para landing pages: aplica CRO scoring (CCD + MECLABS)
- Atualiza story checkboxes se aplicavel

### SHIP (automatico)
- `git push` para remote
- Cria PR via `gh pr create` com summary
- Marca story como `done` se aplicavel
- Append em `docs/xoia-memory/sessions.jsonl`:
  `{"date":"YYYY-MM-DD","mode":"quick|standard|deep","story":"S?.?","agent":"dev","check_attempts":N,"status":"shipped"}`

## Quando Parar e Perguntar

O XOIA PARA e pergunta ao usuario apenas quando:
1. **Ambiguidade** — nao entende o que o usuario quer
2. **Decisao de negocio** — tradeoff que so o usuario pode resolver
3. **Acesso necessario** — credenciais, permissoes, APIs
4. **Falha persistente** — 3 tentativas falharam no mesmo problema
5. **Operacao destrutiva** — deletar dados, force push, drop table

Fora dessas situacoes, o XOIA executa ate entregar.

## Ativacao Manual de Agentes (opcional)

Se o usuario quiser controle direto, pode ativar agentes manualmente:
- `@dev` — modo builder direto
- `@architect` — modo arquitetura
- `@qa` — modo qualidade/CRO
- `@product` — modo produto/stories

Mas no uso normal, o XOIA roteia internamente sem o usuario precisar escolher.

## Stories

Stories sao criadas automaticamente pelo ciclo Standard/Deep:
- **Formato:** Title, Description, Acceptance Criteria, Tasks (checklist)
- **Localizacao:** `docs/stories/`
- **Estados medio:** `todo` → `done` (feature simples)
- **Estados grande:** `todo` → `doing` → `done` (epic, multi-story)
- **Quick mode:** sem story — executa direto

## Commit Conventions

- `feat:` nova feature
- `fix:` correcao de bug
- `docs:` documentacao
- `chore:` manutencao
- Reference story ID quando aplicavel: `feat: hero section [Story 1.1]`
