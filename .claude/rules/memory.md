# XOIA Memory — Aprendizado Persistente Entre Sessões

## O que é

Sistema de memória leve baseado em arquivos. Persiste aprendizados, padrões e
preferências entre sessões sem banco de dados ou dependências externas.

## Estrutura

```
docs/xoia-memory/
  learnings.md       # Aprendizados gerais do projeto e do framework
  sessions.jsonl     # Log de ciclos executados (1 linha JSON por ciclo)
  clients/
    <cliente>.md     # Padrões, preferências e histórico por cliente
```

## Quando LER memória

**Sempre ao iniciar um ciclo** — verifique se há contexto relevante em:
- `docs/xoia-memory/learnings.md`
- `docs/xoia-memory/clients/<cliente-atual>.md` (se aplicável)

Leia especialmente antes de:
- Propor arquitetura ou decisão técnica
- Criar landing page ou copy (leia o arquivo do cliente)
- Debugar um problema recorrente
- Retomar trabalho de sessão anterior

## Quando ESCREVER memória

**Escreva em `learnings.md` quando:**
- Um bug foi resolvido via `/investigate` e a causa raiz tem valor futuro
- Uma decisão técnica foi tomada com tradeoffs que podem se repetir
- Um padrão de código foi estabelecido para o projeto
- Uma integração foi configurada com detalhes não documentados

**Escreva em `clients/<cliente>.md` quando:**
- O cliente aprovou/rejeitou um design e expressou preferência clara
- Uma campanha teve resultado mensurável (conversão, leads, etc.)
- Um padrão de copy funcionou bem para esse público específico
- `/design-shotgun` foi executado e a escolha foi registrada

**Escreva em `sessions.jsonl` ao final de cada SHIP:**
```json
{"date":"YYYY-MM-DD","mode":"quick|standard|deep","story":"S1.3","agent":"dev","check_attempts":1,"duration_min":14,"status":"shipped"}
```

## Formato de entrada em learnings.md

```markdown
## [YYYY-MM-DD] — <título do aprendizado em uma linha>
**Contexto:** o que estava sendo feito quando o aprendizado surgiu
**Aprendizado:** o que foi descoberto — específico e acionável
**Aplicar quando:** em quais situações futuras isso é relevante
---
```

## Regras

- Entradas são APPEND-ONLY — nunca delete um aprendizado existente
- Máximo 5 linhas por entrada — seja cirúrgico
- Só escreva se o aprendizado tiver valor real em sessões futuras
- Verifique duplicata antes de adicionar: `grep "<palavra-chave>" docs/xoia-memory/learnings.md`
- Arquivos de cliente são confidenciais — não incluir dados sensíveis de negócio
