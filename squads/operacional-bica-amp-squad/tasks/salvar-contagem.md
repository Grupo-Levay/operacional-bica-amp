---
task: salvar-contagem
agent: estoque-manager
squad: operacional-bica-amp-squad
entrada: [quantidades, data]
saida: [itens_baixo_minimo, compras_geradas]
---

# salvar-contagem

## Checklist
- [ ] Validar entrada
- [ ] Executar lógica principal
- [ ] Persistir via localStorage
- [ ] Sync Notion (se token configurado)
- [ ] Retornar saída
