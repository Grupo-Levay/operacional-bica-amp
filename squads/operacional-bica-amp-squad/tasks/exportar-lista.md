---
task: exportar-lista
agent: compras-manager
squad: operacional-bica-amp-squad
entrada: [rodada_id, formato]
saida: [arquivo_exportado]
---

# exportar-lista

## Checklist
- [ ] Validar entrada
- [ ] Executar lógica principal
- [ ] Persistir via localStorage
- [ ] Sync Notion (se token configurado)
- [ ] Retornar saída
