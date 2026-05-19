---
task: fechar-casa
agent: operacional-manager
squad: operacional-bica-amp-squad
entrada: [casa, responsavel, hora_fim, valor_caixa]
saida: [registro_id, itens_nao_concluidos, sync_status]
---

# fechar-casa

## Checklist
- [ ] Validar entrada
- [ ] Executar lógica principal
- [ ] Persistir via localStorage
- [ ] Sync Notion (se token configurado)
- [ ] Retornar saída
