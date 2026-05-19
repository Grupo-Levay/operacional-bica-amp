---
task: fechar-rodada
agent: compras-manager
squad: operacional-bica-amp-squad
entrada: [rodada_id]
saida: [resumo_faltantes, historico_salvo]
---

# fechar-rodada

## Checklist
- [ ] Validar entrada
- [ ] Executar lógica principal
- [ ] Persistir via localStorage
- [ ] Sync Notion (se token configurado)
- [ ] Retornar saída
