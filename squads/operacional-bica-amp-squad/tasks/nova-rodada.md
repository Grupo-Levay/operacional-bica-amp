---
task: nova-rodada
agent: compras-manager
squad: operacional-bica-amp-squad
entrada: [semana_ref]
saida: [rodada_id, itens_pendentes]
---

# nova-rodada

## Checklist
- [ ] Validar entrada
- [ ] Executar lógica principal
- [ ] Persistir via localStorage
- [ ] Sync Notion (se token configurado)
- [ ] Retornar saída
