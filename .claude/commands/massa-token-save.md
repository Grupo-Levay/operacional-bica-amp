# /massa-token-save

ACTIVATION-NOTICE: Você está em modo MASSA-TOKEN-SAVE.
Instala o sistema de economia de tokens em 3 camadas em qualquer projeto Claude Code.

## COMPLETE COMMAND DEFINITION

```yaml
command: massa-token-save
icon: "⚡"
author: Massa
description: |
  Instala 3 camadas de economia de tokens em qualquer projeto:
  A) Comprime arquivos de configuração verbose (CLAUDE.md, rules)
  B) Cria context-snapshot.md — memória viva entre sessões
  C) Injeta regra dos 12% — controle consciente da janela de contexto
activation: /massa-token-save
args:
  none: Roda auditoria + instala tudo automaticamente
  --audit: Só analisa, não altera nada
  --snapshot-only: Só cria/atualiza o context-snapshot.md
```

---

## EXECUÇÃO AUTOMÁTICA

Ao ser ativado, execute os 4 passos abaixo em sequência.

---

## PASSO 1 — AUDITORIA

Colete o estado atual do projeto:

```bash
# Estrutura geral
find . -name "CLAUDE.md" -not -path "*/node_modules/*" | head -5
find . -path "*/.claude/rules/*.md" -not -path "*/node_modules/*"
find . -name "context-snapshot.md" -not -path "*/node_modules/*"
find . -name "sessions.jsonl" -not -path "*/node_modules/*"

# Volume dos arquivos de config
wc -l .claude/CLAUDE.md .claude/rules/*.md 2>/dev/null || echo "sem rules"

# Estado do projeto
git log --oneline -5
git branch --show-current
ls package.json pyproject.toml Cargo.toml go.mod 2>/dev/null | head -3
```

Com base nos resultados, identifique:
- **Config files existentes** → candidatos à compressão (Camada A)
- **Memory dir existente?** → `docs/xoia-memory/` ou equivalente (Camada B)
- **12% rule já presente?** → grep por "120K" ou "12%" no CLAUDE.md (Camada C)

Reporte o diagnóstico antes de continuar:
```
AUDITORIA:
├── Config: X linhas totais em Y arquivos
├── Memory dir: [existe / não existe]
├── context-snapshot: [existe / não existe]
├── sessions.jsonl: [existe / vazio / N entradas]
└── 12% rule: [presente / ausente]
```

---

## PASSO 2 — CAMADA A: COMPRIMIR CONFIG

**Regra:** preservar 100% das instruções. Cortar prosa, exemplos decorativos e repetições.

### O que comprimir
- Parágrafos explicativos que só reafirmam o que o título já diz
- Seções "O que é" / "Por que usar"
- Exemplos verbosos quando uma linha basta
- Headers desnecessários em listas curtas
- Frases de transição ("Fora dessas situações, o XOIA executa até entregar")

### O que NUNCA tocar
- Comandos bash, paths de arquivo, URLs
- Tabelas de referência (manter compactas)
- Qualquer regra operacional ("sempre", "nunca", "max N tentativas")
- Nomes de arquivo, variáveis, aliases

### Meta de compressão
- CLAUDE.md principal: 40-60% de redução
- Arquivos de rules: 40-65% de redução
- Resultado: mesmas regras, menos tokens

**Se o projeto não tem arquivos de rules** → pule esta camada, registre no relatório.

---

## PASSO 3 — CAMADA B: CONTEXT-SNAPSHOT

Crie ou atualize `docs/xoia-memory/context-snapshot.md`.
Se o projeto não usa `docs/xoia-memory/`, crie o diretório mais próximo da convenção do projeto.

### Template do snapshot

```markdown
# Context Snapshot — <nome-do-projeto>

_Atualizado: YYYY-MM-DD | Branch: `<branch-atual>`_

## Projeto
**App:** <descrição em 1 linha>
**Stack:** <principais tecnologias>
**Ambiente:** <local / cloud / container — e limitações relevantes>

## Arquivos críticos
```
<path>    # <o que contém>
<path>    # <o que contém>
```

## Estado atual
- ✅ <módulo/feature completa>
- ✅ <módulo/feature completa>
- 🔄 <em progresso>
- ⬜ <pendente>

## Decisões técnicas ativas
- **<decisão>:** <contexto em 1 linha — por que foi assim>

## Últimos ships
1. `<commit msg>` (YYYY-MM-DD)
2. `<commit msg>`

## Gaps conhecidos
- <problema ou limitação conhecida>
```

### Como preencher
- **Stack:** leia package.json / pyproject.toml / Cargo.toml / go.mod
- **Arquivos críticos:** `git ls-files | head -30` + julgamento sobre o que é central
- **Estado:** `git log --oneline -10` para inferir o que foi entregue
- **Decisões:** leia o CLAUDE.md e learnings.md se existir
- **Gaps:** pergunte ao usuário se não for óbvio pelo código

---

## PASSO 4 — CAMADA C: REGRA DOS 12%

### Verificar se já existe
```bash
grep -n "120K\|12%\|context.*12\|Regra.*12" .claude/CLAUDE.md 2>/dev/null
```

### Se não existir, adicionar ao CLAUDE.md

Injete após o primeiro bloco de conteúdo (não no topo, não no fim):

```markdown
## Gestão de Contexto — Regra dos 12%
- **Ao iniciar:** leia `<path-do-context-snapshot>` primeiro
- **Se `/context` > 120K tokens usados:** execute `/clear` e retome via context-snapshot
- Nunca deixe compaction automático decidir — prefira `/clear` + resumo manual
```

Adapte o path para onde o context-snapshot.md foi criado.

---

## PASSO 5 — SESSIONS.JSONL

Verifique se existe `sessions.jsonl` no memory dir.

- **Não existe:** crie com a entrada da sessão atual
- **Existe mas vazio:** popule com histórico inferido do `git log`
- **Existe com entradas:** deixe como está

Formato de entrada:
```json
{"date":"YYYY-MM-DD","mode":"quick|standard|deep","agent":"<agente>","check_attempts":N,"status":"shipped","note":"<descrição>"}
```

---

## RELATÓRIO FINAL

Ao concluir, apresente:

```
MASSA-TOKEN-SAVE — COMPLETO

Camada A: config comprimida
  ├── CLAUDE.md: XXX → YYY linhas (−ZZ%)
  └── rules/: XXX → YYY linhas (−ZZ%)

Camada B: context-snapshot.md
  └── criado/atualizado em <path>

Camada C: regra dos 12%
  └── injetada em CLAUDE.md

Sessions: <N entradas em sessions.jsonl>

PROTOCOLO ATIVO:
→ Próxima sessão: leia context-snapshot.md primeiro
→ A cada SHIP: atualize context-snapshot.md + append sessions.jsonl
→ Se /context > 120K: /clear + retome via snapshot
```

---

## QUANDO PARAR E PERGUNTAR

- O projeto não tem CLAUDE.md → pergunte onde colocar as regras
- Arquivos de config com regras ambíguas → liste o que vai cortar antes de cortar
- Estrutura de diretórios muito diferente do padrão → confirme paths com o usuário

---

*Massa — /massa-token-save | "Sessões inteligentes, tokens economizados"*
