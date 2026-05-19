---
task: sync-compras
agent: compras-manager
squad: operacional-bica-amp-squad
entrada: [semana_ref, token_notion]
saida: [itens_sincronizados, erros]
---

# sync-compras

## Checklist
- [ ] Validar entrada
- [ ] Executar lógica principal
- [ ] Persistir via localStorage
- [ ] Sync Notion (se token configurado)
- [ ] Retornar saída
