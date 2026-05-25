# /XOIA:orchestrate

ACTIVATION-NOTICE: Você está em modo ORCHESTRATE.
Planeja e executa ciclos com agentes paralelos, token-eficientes e sem conflito.

---

## O QUE ESTE COMANDO FAZ

Dado um conjunto de tarefas, o ORCHESTRATE:
1. Lê o context-snapshot (não explora o codebase do zero)
2. Agrupa as tarefas por domínio e dependência
3. Identifica o que pode rodar em paralelo vs em sequência
4. Cria briefs focados (escopo de arquivo + contexto mínimo) para cada agente
5. Executa os agentes em paralelo com o `Agent` tool
6. Integra os resultados e valida (lint + typecheck uma vez só, no final)

---

## QUANDO USAR

- Standard ou Deep com **2+ tarefas independentes**
- Qualquer ciclo que toque **domínios distintos** (ex: UI + DB + actions)
- Quando o usuário diz "faz tudo isso" com uma lista de itens

---

## PROTOCOLO DE EXECUÇÃO

### PASSO 1 — LER CONTEXTO (não explorar)

```
Leia docs/xoia-memory/context-snapshot.md
NÃO rode find/grep no codebase agora — o snapshot tem o estado atual.
```

### PASSO 2 — DECOMPOR TAREFAS

Para cada tarefa da lista do usuário, identifique:

| Campo | O que preencher |
|-------|----------------|
| `id` | T1, T2, T3… |
| `domínio` | ui / db / action / config / docs |
| `arquivos` | lista exata de arquivos a tocar |
| `depende_de` | IDs das tarefas que devem terminar antes |
| `agente` | @dev / @architect / @qa |
| `tokens_max` | estimativa de tokens necessários (P=~5k, M=~15k, G=~40k) |

### PASSO 3 — MAPA DE PARALELISMO

Monte o grafo de dependências:

```
Independentes → rodam em paralelo (mesmo Agent call)
Dependentes   → rodam após os predecessores terminarem
```

Regra de ouro: **tarefas que tocam arquivos diferentes são paralelizáveis**.
Tarefas que tocam o mesmo arquivo devem ser sequenciais.

### PASSO 4 — CRIAR BRIEFS TOKEN-EFICIENTES

Para cada agente, o brief deve conter EXATAMENTE:

```
BRIEF PARA @<agente> — Tarefa <ID>: <título>

CONTEXTO (não explore, use isso):
<colar seção relevante do context-snapshot>

ESCOPO:
- Arquivos a LER: <lista>
- Arquivos a MODIFICAR: <lista>
- Arquivos a NÃO tocar: <lista do que outros agentes estão fazendo>

TAREFA:
<descrição específica e acionável>

RESTRIÇÕES DE TOKEN:
- NÃO rode npm install, npm run build ou lint completo
- NÃO explore arquivos fora do escopo
- NÃO crie arquivos não listados acima
- LEIA apenas os arquivos do escopo antes de editar
- Budget estimado: <P/M/G>

ENTREGÁVEL:
<o que deve estar feito ao final — testável e específico>
```

### PASSO 5 — EXECUTAR EM PARALELO

Regras de execução:

```
✅ Tarefas independentes: lançar no mesmo bloco de tool calls (paralelo real)
✅ Cada agente recebe APENAS o brief da sua tarefa
✅ Agentes NÃO devem rodar lint/typecheck — apenas o orquestrador faz isso no final
✅ Agentes NÃO devem fazer commit — o orquestrador commita tudo junto
❌ Nunca lançar agentes que tocam o mesmo arquivo em paralelo
❌ Nunca dar acesso ao contexto completo da sessão a um subagente
```

### PASSO 6 — INTEGRAR E VALIDAR

Após todos os agentes terminarem:

1. Revisar cada resultado recebido
2. Verificar conflitos (mesmo arquivo modificado por dois agentes)
3. Executar `npm run lint && npm run typecheck && npm test` UMA VEZ
4. Corrigir qualquer falha (máx 3 tentativas)
5. Commit único consolidado: `feat: <descrição geral> [orquestrado]`
6. Push + PR

---

## RELATÓRIO ANTES DE EXECUTAR

Antes de lançar os agentes, apresente o plano ao usuário:

```
PLANO DE ORQUESTRAÇÃO
─────────────────────────────────────────
Rodada 1 (paralelo):
  @dev   T1 — <título> (~Xk tokens)
  @dev   T2 — <título> (~Xk tokens)

Rodada 2 (sequencial — depende de T1):
  @architect  T3 — <título> (~Xk tokens)

Budget estimado: ~XXk tokens total
─────────────────────────────────────────
Confirma? (s/n)
```

Só execute após confirmação do usuário.

---

## REGRAS DE TOKEN PARA SUBAGENTES

Todo brief deve incluir estas restrições explícitas:

| Proibido | Por quê |
|----------|---------|
| `find . -name "*.ts"` no codebase inteiro | Re-exploração desnecessária |
| `npm install` / `npm run build` | Já feito pelo SessionStart hook |
| `npm run lint` completo | O orquestrador faz uma vez no final |
| Ler mais de 5 arquivos sem justificativa | Budget de tokens |
| Criar arquivos não listados no brief | Escopo creep |
| Fazer commit | Orquestrador commita tudo junto |

---

## EXEMPLO

**Usuário:** "Preciso adicionar validação zod nas actions de compras, refatorar o componente de estoque e criar a migration para a tabela de mesas"

**Plano gerado:**
```
PLANO DE ORQUESTRAÇÃO
─────────────────────────────────────────
Rodada 1 (paralelo — arquivos distintos):
  @dev       T1 — Validação zod em actions/compras.ts (~8k tokens)
  @dev       T2 — Refatorar componente estoque (~10k tokens)
  @architect T3 — Migration bar_tables (~5k tokens)

Rodada 2 (sequencial — depende de T3):
  @dev       T4 — Atualizar database.types.ts com novos tipos (~5k tokens)

Budget estimado: ~28k tokens (vs ~70k sem orquestração)
─────────────────────────────────────────
Confirma? (s/n)
```

---

*XOIA Orchestrate — paralelismo sincronizado com economia de tokens*
