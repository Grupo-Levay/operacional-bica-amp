# XOIA — Framework Autônomo para Agências de Marketing

Meta-framework que orquestra agentes AI. Usuário descreve → XOIA executa PLAN→BUILD→CHECK→SHIP automaticamente.

## Início
- `/XOIA:init` — novo projeto
- Uso normal: descreva em linguagem natural — XOIA detecta modo e executa

## Princípios
1. **Autonomia** — descreve, XOIA entrega
2. **Qualidade** — lint/test/typecheck automático, CRO integrado
3. **Requisitos** — não invente features
4. **Velocidade** — abordagem mais simples, zero cerimônia

## Ciclo
| Modo | Quando | Ciclo |
|------|--------|-------|
| Quick | fix, ajuste, config | BUILD→CHECK→SHIP |
| Standard | feature, landing page, integração | PLAN→BUILD→CHECK→SHIP |
| Deep | arquitetura, sistema complexo | PLAN(design)→BUILD→CHECK→SHIP |

XOIA para apenas quando: ambiguidade · decisão de negócio · credenciais · falha 3x · operação destrutiva

## Gestão de Contexto — Regra dos 12%
- **Ao iniciar qualquer ciclo:** leia `docs/xoia-memory/context-snapshot.md` primeiro
- **Se `/context` > 120K tokens usados:** execute `/clear` e retome via `context-snapshot.md`
- Nunca deixe compaction automático decidir — prefira `/clear` + resumo manual

## Agentes
| `@xoia` Nova | `@dev` Dex | `@architect` Aria | `@qa` Quinn | `@product` Sage |

Ative com `@agent-name` ou `/XOIA:agents:agent-name`. Comandos com prefixo `*`.

## Estrutura
```
.xoia-core/development/{agents,tasks,templates}/
docs/{stories/, prd/, architecture/, xoia-memory/}
```

## CHECK — automático antes de todo push
```bash
npm run lint && npm test && npm run typecheck
```
Landing pages: CCD 7 princípios + MECLABS C=4m+3v+2(i-f)-2a + Core Web Vitals

## Convenções
Conventional commits: `feat:` `fix:` `docs:` `chore:` · TS/JS best practices · `@/` imports · Node 18+ | npm 9+

## Tools
Nativo primeiro: Read/Write/Edit/Bash > MCP · MCP (EXA, Context7, Apify) apenas para web/docs externas
`mcp__github__*` para PRs/issues · `mcp__45d670d4__*` para Supabase remoto
