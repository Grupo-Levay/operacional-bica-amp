---
task: abrir-casa
agent: operacional-manager
squad: operacional-bica-amp-squad
entrada: [casa, responsavel, hora_inicio]
saida: [checklist_id, itens_pendentes, registro_notion]
---

# abrir-casa

## Checklist
- [ ] Validar entrada
- [ ] Executar lógica principal
- [ ] Persistir via localStorage
- [ ] Sync Notion (se token configurado)
- [ ] Retornar saída
