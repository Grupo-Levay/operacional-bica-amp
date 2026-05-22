# /massa-token-save

ACTIVATION-NOTICE: Você está em modo MASSA-TOKEN-SAVE.
Instala o sistema de economia de tokens em 3 camadas em qualquer projeto Claude Code.

## COMPLETE COMMAND DEFINITION

```yaml
command: massa-token-save
icon: "⚡"
author: Gabriel Quental (Massa)
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

Ao ser ativado, execute os 5 passos abaixo em sequência.

---

## PASSO 1 — AUDITORIA

Colete o estado atual do projeto:

```bash
# Estrutura de config
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
- **Memory dir existente?** → `docs/xoia-memory/`, `.claude/memory/` ou equivalente (Camada B)
- **12% rule já presente?** → grep por "120K" ou "12%" no CLAUDE.md (Camada C)

Reporte o diagnóstico antes de continuar:
```
AUDITORIA:
├── Config: X linhas totais em Y arquivos
├── Memory dir: [existe em <path> / não existe]
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
- Frases de transição sem valor operacional

### O que NUNCA tocar
- Comandos bash, paths de arquivo, URLs
- Tabelas de referência
- Qualquer regra operacional ("sempre", "nunca", "max N tentativas")
- Nomes de arquivo, variáveis, aliases

### Meta de compressão
- CLAUDE.md principal: 40-60% de redução
- Arquivos de rules: 40-65% de redução
- Resultado: mesmas regras, menos tokens

**Se o projeto não tem arquivos de rules** → pule esta camada, registre no relatório.

---

## PASSO 3 — CAMADA B: CONTEXT-SNAPSHOT

Determine o diretório de memória do projeto:
- Se existe `.claude/memory/` → use esse
- Se existe `docs/xoia-memory/` → use esse
- Se nenhum existe → crie `.claude/memory/`

Crie ou atualize `<memory-dir>/context-snapshot.md` com o template abaixo.

### Template do snapshot

```
# Context Snapshot — <nome-do-projeto>

_Atualizado: YYYY-MM-DD | Branch: <branch-atual>_

## Projeto
App: <descrição em 1 linha>
Stack: <principais tecnologias>
Ambiente: <local / cloud / container — e limitações relevantes>

## Arquivos críticos
<path>  → <o que contém>
<path>  → <o que contém>

## Estado atual
✅ <módulo/feature completa>
✅ <módulo/feature completa>
🔄 <em progresso>
⬜ <pendente>

## Decisões técnicas ativas
- <decisão>: <contexto em 1 linha — por que foi assim>

## Últimos ships
1. <commit msg> (YYYY-MM-DD)
2. <commit msg>

## Gaps conhecidos
- <problema ou limitação conhecida>
```

### Como preencher
- **Stack:** leia package.json / pyproject.toml / Cargo.toml / go.mod
- **Arquivos críticos:** `git ls-files | head -30` + julgamento sobre o que é central
- **Estado:** `git log --oneline -10` para inferir o que foi entregue
- **Decisões:** leia CLAUDE.md e learnings.md se existir
- **Gaps:** pergunte ao usuário se não for óbvio pelo código

---

## PASSO 4 — CAMADA C: REGRA DOS 12%

### Verificar se já existe
```bash
grep -n "120K\|12%\|context.*12\|Regra.*12" .claude/CLAUDE.md 2>/dev/null
```

### Se não existir, injetar no CLAUDE.md

Adicione após o primeiro bloco de conteúdo (não no topo, não no fim):

```
## Gestão de Contexto — Regra dos 12%
- Ao iniciar: leia <path-do-context-snapshot> primeiro
- Se /context > 120K tokens usados: execute /clear e retome via context-snapshot
- Nunca deixe compaction automático decidir — prefira /clear + resumo manual
```

Substitua `<path-do-context-snapshot>` pelo path real onde foi criado no Passo 3.

---

## PASSO 5 — SESSIONS.JSONL

Verifique se existe `sessions.jsonl` no memory dir definido no Passo 3.

- **Não existe:** crie com a entrada da sessão atual
- **Existe mas vazio:** popule com histórico inferido do `git log`
- **Existe com entradas:** deixe como está

Formato de entrada:
```
{"date":"YYYY-MM-DD","mode":"quick|standard|deep","agent":"<agente>","check_attempts":N,"status":"shipped","note":"<descrição>"}
```

---

## RELATÓRIO FINAL

Ao concluir, execute o seguinte cálculo antes de apresentar o relatório:

### Cálculo de impacto em tokens

Estime usando a regra: **1 token ≈ 4 caracteres** (aproximação conservadora).

**Sem a skill — custo típico por sessão:**
```bash
# Linhas dos config files ANTES da compressão (coletado na auditoria)
# Estima: linhas_antes × 15 tokens/linha (média para markdown técnico)

# Re-descoberta de contexto sem snapshot:
# Claude lê ~20-40 arquivos para entender o projeto do zero
# Estima: 20 arquivos × média de 80 linhas × 12 tokens/linha ≈ 19.200 tokens
```

**Com a skill — custo típico por sessão:**
```bash
# Linhas dos config files DEPOIS da compressão
# Estima: linhas_depois × 15 tokens/linha

# Context-snapshot substitui toda re-descoberta:
# Estima: linhas_do_snapshot × 15 tokens/linha
```

**Projeção:**
- Economia por sessão = (custo_sem − custo_com)
- Projeção 10 sessões = economia_por_sessão × 10
- Projeção 30 sessões = economia_por_sessão × 30

### Mensagem final

Apresente nesta ordem, sem alterar o tom — direto, claro, sem exageros:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MASSA-TOKEN-SAVE — INSTALADO ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O QUE MUDOU
  Camada A  Config comprimida
            CLAUDE.md:  XXX → YYY linhas (−ZZ%)
            rules/:     XXX → YYY linhas (−ZZ%)

  Camada B  context-snapshot.md criado em <path>
            Próxima sessão começa com contexto completo,
            sem re-explorar o codebase do zero.

  Camada C  Regra dos 12% ativa
            Você controla a janela — não o auto-compactor.

  Sessions  <N> entradas registradas em sessions.jsonl

─────────────────────────────────────────
  IMPACTO EM TOKENS — ESTIMATIVA REAL
─────────────────────────────────────────

                        SEM SKILL    COM SKILL
  Carga de config:      ~X.XXX tok   ~Y.YYY tok
  Re-descoberta:        ~19.200 tok  ~ZZZ tok
  ─────────────────────────────────────────────
  Total por sessão:     ~XX.XXX tok  ~YY.YYY tok  (−ZZ%)

  Economia em 10 sessões:   ~XX.XXX tokens
  Economia em 30 sessões:   ~XX.XXX tokens

─────────────────────────────────────────
  VOCÊ NÃO PRECISA MUDAR NADA
─────────────────────────────────────────

  Continue trabalhando exatamente como antes.
  Fale com os agentes normalmente.
  Descreva o que precisa em linguagem natural.

  A skill opera em silêncio. O único momento
  que você verá diferença: se o contexto passar
  de 120K tokens, o agente vai sugerir /clear
  antes de continuar. Leva 10 segundos.

  Tudo mais: igual. Só mais rápido e mais barato.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Criado por Gabriel Quental — Massa
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## QUANDO PARAR E PERGUNTAR

- Projeto sem CLAUDE.md → pergunte onde colocar as regras
- Config com regras ambíguas → liste o que vai cortar antes de cortar
- Estrutura de diretórios não convencional → confirme paths com o usuário

---

*Criado por Gabriel Quental — Massa | /massa-token-save*
