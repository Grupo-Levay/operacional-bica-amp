# XOIA Memory

`docs/xoia-memory/` — persistência entre sessões, zero dependências externas.

## Arquivos
- `context-snapshot.md` — estado atual do projeto (leia SEMPRE ao iniciar)
- `learnings.md` — aprendizados técnicos, append-only
- `sessions.jsonl` — log de ciclos (1 linha JSON por SHIP)
- `clients/<cliente>.md` — padrões e histórico por cliente

## LER
- `context-snapshot.md`: sempre ao iniciar qualquer ciclo
- `learnings.md`: antes de decisão técnica, debug recorrente, retomar sessão
- `clients/<cliente>.md`: antes de landing page ou copy

## ESCREVER
- `learnings.md`: após investigação com causa raiz de valor futuro (max 5 linhas/entrada)
- `sessions.jsonl`: ao final de todo SHIP — `{"date":"YYYY-MM-DD","mode":"...","agent":"...","check_attempts":N,"status":"shipped"}`
- `context-snapshot.md`: ao final de todo SHIP — atualize últimos ships, gaps, decisões

## Regras
APPEND-ONLY em learnings.md. Sem dados sensíveis de negócio.
Verifique duplicata antes de adicionar: `grep "<keyword>" docs/xoia-memory/learnings.md`
