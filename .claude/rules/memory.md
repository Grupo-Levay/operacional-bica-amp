# XOIA Memory

## Estrutura
```
docs/xoia-memory/
  context-snapshot.md  # Estado vivo do projeto (leia ao iniciar)
  learnings.md         # Aprendizados entre sessoes
  sessions.jsonl       # Log de ciclos
  clients/<cliente>.md # Historico por cliente
```

## Quando LER
- Sempre ao iniciar: `context-snapshot.md` + `learnings.md`
- Antes de arquitetura, landing page, debug recorrente, retomar sessao

## Quando ESCREVER
**learnings.md:** bug resolvido com causa raiz util, decisao tecnica com tradeoffs, padrao estabelecido, integracao com detalhes nao documentados
**clients/<cliente>.md:** preferencia de design aprovada, resultado de campanha, copy que funcionou
**sessions.jsonl:** ao final de cada SHIP

## Formato learnings.md
```
## [YYYY-MM-DD] — <titulo>
**Contexto:** <o que estava sendo feito>
**Aprendizado:** <o que foi descoberto — especifico e acionavel>
**Aplicar quando:** <situacoes futuras relevantes>
---
```

## Regras
- APPEND-ONLY — nunca delete entradas
- Max 5 linhas por entrada
- Verifique duplicata: `grep "<chave>" docs/xoia-memory/learnings.md`
