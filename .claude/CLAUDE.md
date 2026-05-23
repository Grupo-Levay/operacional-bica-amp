# XOIA Framework

Meta-framework que orquestra agentes AI. O usuario descreve, o XOIA executa PLAN→BUILD→CHECK→SHIP automaticamente.

## Principios
1. **Autonomia** — ciclos completos sem intervencao
2. **Qualidade** — lint/test/typecheck automaticos
3. **Requisitos** — nao invente features
4. **Velocidade** — abordagem mais simples sempre

## The Cycle

| Modo | Detectado quando | Ciclo |
|------|-----------------|-------|
| **Quick** | fix, ajuste, config, hotfix | BUILD→CHECK→SHIP |
| **Standard** | feature, landing page, integracao | PLAN→BUILD→CHECK→SHIP |
| **Deep** | arquitetura, brownfield, sistema complexo | PLAN→BUILD→CHECK→SHIP |

**PLAN** — story em `docs/stories/` (pula no Quick)
**BUILD** — codigo + testes + commits atomicos
**CHECK** — `npm run lint && npm test && npm run typecheck` (max 3 tentativas)
**SHIP** — push + PR

Para quando: ambiguidade, decisao de negocio, credenciais, 3 falhas consecutivas.

## Agentes

| Agente | Persona | Escopo |
|--------|---------|--------|
| `@xoia` | Nova | Orquestracao, routing |
| `@dev` | Dex | Codigo, testes, PRs |
| `@architect` | Aria | Arquitetura, DB, integracoes |
| `@qa` | Quinn | Qualidade, CRO |
| `@product` | Sage | Stories, priorizacao |

## Estrutura
```
.xoia-core/development/{agents,tasks,templates}
docs/{stories,prd,architecture}
docs/xoia-memory/{learnings.md,sessions.jsonl,clients/}
```

## Qualidade Automatica (CHECK)
```bash
npm run lint && npm test && npm run typecheck
```
Landing pages: CCD 7 principios + MECLABS `C=4m+3v+2(i-f)-2a` + Core Web Vitals (LCP<2.5s, CLS<0.1, INP<200ms)

## Convencoes
- Commits: `feat:` `fix:` `docs:` `chore:`
- Imports: `@/` alias
- Node 18+ | npm 9+

## Tools
Prefira nativos: `Read`/`Write`/`Edit`/`Bash`/`Glob`/`Grep`
MCP apenas para: web search (EXA), docs externas (Context7), scraping (Apify)

## Gestao de Contexto — Regra dos 12%
- Ao iniciar: leia `docs/xoia-memory/context-snapshot.md` primeiro
- Se contexto > 120K tokens: execute /clear e retome via context-snapshot
- Nunca deixe compaction automatico decidir — prefira /clear + resumo manual

---
*XOIA Framework v1.0*
