# XOIA Framework

## Princípios
1. **Autonomia** — Executa ciclos completos. Usuário descreve, XOIA entrega.
2. **Qualidade** — Lint, test, typecheck passam. CRO scoring integrado.
3. **Requisitos** — Não invente features. Trace trabalho a requisitos.
4. **Velocidade** — Abordagem mais simples. Zero cerimônia.

## Gestão de Contexto — Regra dos 12%
- Ao iniciar: leia `docs/xoia-memory/context-snapshot.md` primeiro
- Se /context > 120K tokens usados: execute /clear e retome via context-snapshot
- Nunca deixe compaction automático decidir — prefira /clear + resumo manual

## Ciclo
| Modo | Quando | Ciclo |
|------|--------|-------|
| Quick | fix, ajuste, hotfix | BUILD→CHECK→SHIP |
| Standard | feature, integração | PLAN→BUILD→CHECK→SHIP |
| Deep | arquitetura, brownfield | PLAN→BUILD→CHECK→SHIP |

Ver `rules/workflow.md` para passos detalhados.

## Qualidade — CHECK
```bash
npm run lint && npm test && npm run typecheck
```
Ver `rules/quality.md` para CRO e CodeRabbit.

## Agentes
Ver `rules/agents.md` — @dev, @architect, @qa, @product, @xoia.

## Convenções
- Conventional commits: `feat:` `fix:` `docs:` `chore:`
- TypeScript/JS best practices | `@/` alias | Node 18+ | npm 9+

## Tools
Nativos primeiro: `Read`/`Write`/`Edit`/`Bash`/`Glob`/`Grep`. MCP só para web search/docs externas.
