# operacional-bica-amp-squad

Squad operacional para **Bica Bar & AMP 213**.

## Agentes

| Agente | Responsável | Uso |
|--------|-------------|-----|
| `operacional-manager` | Checklists, abertura/fechamento | Lana (diário) |
| `compras-manager` | Lista semanal, rodadas de compra | Lana (semanal) |
| `estoque-manager` | Contagem, alertas de mínimo | Ruan (semanal) |
| `escala-manager` | Equipe, funções, conflitos | Gestão |
| `cmv-manager` | Fichas técnicas, CMV, margens | Erick/Thaynan |

## Uso

```
@operacional-manager  → abrir/fechar casa
@compras-manager      → gerir compras da semana
@estoque-manager      → contagem e alertas
@escala-manager       → ver equipe e funções
@cmv-manager          → ficha técnica e CMV
```

## Stack
- Single-file SPA (HTML/CSS/JS)
- localStorage + Notion API
- Deploy via Vercel → sistema.bica.bar
