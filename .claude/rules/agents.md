# XOIA Agents

| Agente | Persona | Escopo | Ativar |
|--------|---------|--------|--------|
| `@xoia` | Nova | Orquestração, routing, framework | `/XOIA:agents:xoia` |
| `@dev` | Dex | Código, testes, PRs, landing pages | `/XOIA:agents:dev` |
| `@architect` | Aria | Arquitetura, DB, MarTech | `/XOIA:agents:architect` |
| `@qa` | Quinn | Qualidade, CRO, auditorias | `/XOIA:agents:qa` |
| `@product` | Sage | Stories, specs, growth | `/XOIA:agents:product` |

Comandos: prefixo `*` (`*help` `*build` `*check` `*ship` `*exit`)
`@dev` tem permissão total: git push + PRs. Definitions em `.claude/commands/XOIA/agents/`
