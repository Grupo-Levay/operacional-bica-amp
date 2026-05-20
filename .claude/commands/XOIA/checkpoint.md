# /checkpoint — XOIA Session Saver

ACTIVATION-NOTICE: Você está em modo CHECKPOINT.

Salva o estado atual da sessão como commit WIP estruturado no git.
Permite retomar exatamente de onde parou em qualquer sessão futura.

## COMPLETE COMMAND DEFINITION

```yaml
command: checkpoint
icon: "💾"
description: Salva/restaura o estado da sessão via commit WIP estruturado.
activation: /XOIA:checkpoint
subcommands:
  save:    Salva estado atual como commit WIP
  restore: Reconstrói contexto do último checkpoint
  log:     Lista todos os checkpoints do projeto
```

---

## SUBCOMMAND: save

### Quando usar
- Antes de encerrar uma sessão longa no meio de um ciclo
- Quando o contexto está cheio e vai compactar
- Antes de uma operação potencialmente destrutiva
- Ao fazer pausa em qualquer fase do ciclo (PLAN/BUILD/CHECK/SHIP)

### Como executar

**Passo 1 — Capturar estado atual**
```bash
git status
git log --oneline -3
```

**Passo 2 — Stage apenas arquivos rastreados modificados**
```bash
git add -u
```

**Passo 3 — Identificar contexto antes do commit**

Determine com precisão:
- Qual story/task estava em progresso?
- Em qual fase do ciclo estava (PLAN/BUILD/CHECK/SHIP)?
- Qual agente estava ativo?
- Qual é o próximo passo EXATO (não genérico)?
- Há algum bloqueador?

**Passo 4 — Commit WIP estruturado**

```bash
git commit -m "$(cat <<'EOF'
WIP: <o que estava sendo feito em uma linha>

[xoia-context]
story: <story-id ou "none">
phase: <PLAN|BUILD|CHECK|SHIP>
agent: <dev|qa|architect|product|xoia>
progress: <o que foi concluído nessa sessão>
next: <próximo passo exato — específico o suficiente para retomar sem perguntas>
blockers: <se houver, senão "none">
[/xoia-context]
EOF
)"
```

**Exemplo real:**
```
WIP: implementando modal de confirmacao fechar-casa

[xoia-context]
story: S1.3
phase: BUILD
agent: dev
progress: ChecklistModal criado com UI completa, falta integração Supabase
next: implementar handleFecharCasa() em app/src/app/(app)/checklists/page.tsx com update em operacional.checklists
blockers: none
[/xoia-context]
```

---

## SUBCOMMAND: restore

### Quando usar
- Ao iniciar nova sessão querendo retomar trabalho anterior
- Quando o contexto foi compactado e o fio foi perdido

### Como executar

**Passo 1 — Encontrar checkpoints disponíveis**
```bash
git log --oneline --all | grep "WIP:" | head -10
```

**Passo 2 — Ler o contexto do último checkpoint**
```bash
git log -1 --format="%B" <sha>
# ou para o mais recente:
git log --all --format="%H %s" | grep "WIP:" | head -1 | cut -d' ' -f1 | xargs git log -1 --format="%B"
```

**Passo 3 — Reconstruir estado**

Com base no `[xoia-context]`, reconstrua:
1. Story em progresso → leia `docs/stories/<story-id>.md`
2. Arquivos modificados no checkpoint → `git diff <sha>~1 <sha> --name-only`
3. Próximo passo → campo `next:` do contexto

**Passo 4 — Continuar**

Ative o agente do campo `agent:` e continue a partir do campo `next:`.
O ciclo retoma exatamente de onde parou.

---

## SUBCOMMAND: log

Lista todos os checkpoints do projeto com data e contexto resumido:

```bash
git log --all --format="%h %ci %s" | grep "WIP:" | head -20
```

---

## Integração com o Ciclo XOIA

O checkpoint pode ser inserido em qualquer ponto do ciclo:

```
PLAN → BUILD → [CHECKPOINT] → BUILD → CHECK → [CHECKPOINT] → SHIP
```

Checkpoints não bloqueiam o ciclo — são apenas pontos de segurança.
Ao retomar, o ciclo continua da fase indicada no contexto salvo.

---

*XOIA — /checkpoint | "Sua sessão nunca se perde"*
