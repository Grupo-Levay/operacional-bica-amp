---
task: relatorio-margem
agent: cmv-manager
squad: operacional-bica-amp-squad
entrada: [periodo]
saida: [margem_bica, margem_amp, consolidado]
---

# relatorio-margem

## Checklist
- [ ] Validar entrada
- [ ] Executar lógica principal
- [ ] Persistir via localStorage
- [ ] Sync Notion (se token configurado)
- [ ] Retornar saída
