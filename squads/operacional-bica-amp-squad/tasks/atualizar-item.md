---
task: atualizar-item
agent: compras-manager
squad: operacional-bica-amp-squad
entrada: [item_id, status, forn_alternativo, obs]
saida: [item_atualizado, progresso_geral]
---

# atualizar-item

## Checklist
- [ ] Validar entrada
- [ ] Executar lógica principal
- [ ] Persistir via localStorage
- [ ] Sync Notion (se token configurado)
- [ ] Retornar saída
