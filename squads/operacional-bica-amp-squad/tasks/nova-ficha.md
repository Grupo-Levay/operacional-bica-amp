---
task: nova-ficha
agent: cmv-manager
squad: operacional-bica-amp-squad
entrada: [nome, tipo, insumos, preco_venda]
saida: [ficha_id, custo_total, margem]
---

# nova-ficha

## Checklist
- [ ] Validar entrada
- [ ] Executar lógica principal
- [ ] Persistir via localStorage
- [ ] Sync Notion (se token configurado)
- [ ] Retornar saída
