---
task: registrar-turno
agent: operacional-manager
squad: operacional-bica-amp-squad
entrada: [checklist_id, obs, hora_inicio, hora_fim]
saida: [notion_page_id, confirmacao]
---

# registrar-turno

## Checklist
- [ ] Validar entrada
- [ ] Executar lógica principal
- [ ] Persistir via localStorage
- [ ] Sync Notion (se token configurado)
- [ ] Retornar saída
