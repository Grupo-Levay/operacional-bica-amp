# XOIA Agents

| Agente | Persona | Escopo | Ativar |
|--------|---------|--------|--------|
| `@xoia` | Nova | Orquestracao, routing | `/XOIA:agents:xoia` |
| `@dev` | Dex | Codigo, testes, PRs | `/XOIA:agents:dev` |
| `@architect` | Aria | Arquitetura, DB, MarTech | `/XOIA:agents:architect` |
| `@qa` | Quinn | Qualidade, CRO | `/XOIA:agents:qa` |
| `@product` | Sage | Stories, priorizacao | `/XOIA:agents:product` |

**Uso:** `@agent-name` ou `/XOIA:agents:agent-name` | Comandos: `*help` `*build` `*check` `*ship` `*exit`

@dev pode git push e criar PRs sem restricao. Definitions em `.claude/commands/XOIA/agents/`
