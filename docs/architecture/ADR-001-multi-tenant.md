# ADR-001 — Multi-tenant strategy (Bica + AMP)

**Status:** Accepted
**Data:** 2026-05-19
**Decisores:** Gabriel, Nova (XOIA)

## Contexto

O Grupo Levay opera múltiplas casas — hoje **Bica Bar** (Olinda) e **AMP213**, com perspectiva de adicionar **Sollu** e outras. Cada casa tem operação distinta mas compartilha 80% do core operacional: checklists, escala, compras, estoque, fichas técnicas.

Erick (gestor) precisa de visão cruzada entre as casas. Membros como Lana, Suedney e Thiago atuam simultaneamente em Bica e AMP. Já existe deploy em `sistema.bica.bar` com 12 tabelas operacionais sem filtro de casa.

Sem uma estratégia de isolamento, o sistema vai:
- duplicar código se separarmos em dois repos
- ou misturar dados entre casas sem controle se ficar como está

## Decisão

**Sistema único multi-tenant com coluna `casa` em todas as tabelas operacionais.**

- Cada tabela operacional ganha `casa text not null default 'bica' check (casa in ('bica','amp'))`.
- Resolução de tenant via subdomínio:
  - `sistema.bica.bar` → contexto `casa=bica`
  - `sistema.amp213.com.br` (futuro) → contexto `casa=amp`
- Override via cookie `casa_atual` para usuários multi-casa (toggle no header).
- RLS filtra por `casa` cruzando com `team_members.casa` (a coluna `casa` será adicionada em `team_members` na Fase 1).
- Admins (`team_members.role = 'admin'`) podem ver as duas casas.

## Alternativas consideradas

### A) Dois repositórios separados
**Rejeitada.** Duplica 80% do código. Manutenção dobra. Cruzamento de dados (Erick gestor) exige integração futura.

### B) Schemas Postgres separados (`bica.checklists`, `amp.checklists`)
**Rejeitada.** Complica queries cruzadas. RLS por schema é mais frágil. Migrations duplicadas.

### C) Banco separado por casa
**Rejeitada.** Custo Supabase dobra. Sem ganho de isolamento que RLS bem feito não dê.

## Consequências

### Positivas
- Uma codebase, um deploy, um banco
- Módulos específicos (mesas/reservas só Bica) ficam atrás de feature flag por casa
- AMP entra como tenant sem refatoração futura
- Cruzamento de dados para o gestor é trivial

### Negativas / Trade-offs
- RLS precisa ser rigoroso — vazamento entre casas é risco real
- Toggle de casa adiciona complexidade de UX para users single-casa (mitigado: só aparece para multi-casa)
- Migração: todas as queries existentes precisam considerar `casa` (mitigado: helper `getCurrentCasa()` + Supabase RLS faz a maior parte)

## Implementação

1. Migration `0002_multi_tenant.sql`: adiciona `casa` em 12 tabelas operacionais.
2. Helper `app/src/lib/tenant.ts` resolve casa atual.
3. Fase 1 vai adicionar `casa` em `team_members` e RLS por casa.

## Tabelas afetadas

| Tabela | Coluna `casa` |
|---|---|
| `checklists` | ✅ |
| `checklist_registros` | ✅ (via FK em `checklists`, mas duplicada para query rápida) |
| `equipe` | ✅ |
| `escala` | ✅ |
| `estoque_categorias` | ✅ |
| `estoque_itens` | ✅ |
| `estoque_contagens` | ✅ (via FK, mas duplicada) |
| `compras_categorias` | ✅ |
| `compras_itens` | ✅ |
| `rodadas` | ✅ |
| `rodada_itens` | ✅ (via FK, mas duplicada) |
| `fichas_tecnicas` | ✅ |
| `team_members` | ⏭️ Fase 1 |
| `bar_tables` | ❌ Bica-only por natureza |
| `reservations` | ❌ Bica-only por natureza |

## Não-decisões (escopo futuro)

- **Cross-casa analytics** (ex: dashboard agregado para Erick) — escopo do Levay OS, não deste sistema.
- **Casas adicionais** (Sollu) — quando vier, basta adicionar `'sollu'` ao check constraint.
