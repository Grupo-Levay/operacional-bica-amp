# /design-shotgun — XOIA Visual Variants

ACTIVATION-NOTICE: Você está em modo DESIGN-SHOTGUN.

Gera 4 variantes estruturais para landing pages com CRO scoring por variante.
Você escolhe a vencedora — o XOIA implementa.

## COMPLETE COMMAND DEFINITION

```yaml
command: design-shotgun
icon: "🎯"
description: Gera 4 estruturas de landing page com CRO scoring. Você escolhe, o XOIA implementa.
activation: /XOIA:design-shotgun
args:
  - name: objetivo
    required: true
    description: "Qual o objetivo único da página?"
  - name: publico
    required: false
    description: "Quem chega nessa página? (fonte: anúncio, orgânico, email?)"
  - name: cta
    required: false
    description: "Qual o CTA principal?"
```

---

## PASSO 1 — Contexto obrigatório

Antes de gerar variantes, confirme:

1. **Objetivo único:** Qual a UMA ação que o visitante deve tomar? (1 CTA, sem split)
2. **Fonte de tráfego:** Anúncio pago, orgânico, email, direto? (define message match)
3. **Proposta de valor:** Por que essa pessoa deveria agir AGORA?
4. **Prova social disponível:** Depoimentos, números, logos, cases?
5. **Urgência legítima:** Existe limitação real (vagas, prazo, estoque)?

Se algum item estiver indefinido → pergunte antes de gerar.

---

## PASSO 2 — 4 Variantes estruturais

Gere as 4 estruturas como wireframes textuais detalhados:

---

### VARIANTE A — Hero + Prova Social

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [HEADLINE: benefício direto e específico]
  [Subheadline: como funciona / o que resolve em 1 linha]
  [CTA Principal — acima da dobra]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Logos de clientes / número de usuários / badge de confiança]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Benefício 1 + ícone]  [Benefício 2 + ícone]  [Benefício 3 + ícone]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Depoimento em destaque com foto e nome]
  [Métricas: "X% de resultado", "Y clientes", "Z tempo médio"]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [CTA Secundário com micro-copy de reassurance]
  [FAQ 3-5 perguntas que removem objeções]
  [CTA Final]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
*Melhor para: tráfego frio, produto com prova social sólida*

---

### VARIANTE B — Problem-First (Agitação → Solução)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [HEADLINE: a dor, não a solução — identificação imediata]
  [Agitação: consequência de não resolver o problema]
  [Transição: "Existe uma saída."]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Solução apresentada — produto como alívio]
  [CTA Principal]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Como funciona — 3 passos simples]
  [O que muda depois de usar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Prova social — "X pessoas já resolveram isso"]
  [CTA Final com urgência ou escassez]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
*Melhor para: produto que resolve dor específica, awareness baixo no mercado*

---

### VARIANTE C — Benefício Sequencial

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [HEADLINE: resultado final desejado — sem jargão]
  [Subheadline: sem hype, direto ao ponto]
  [CTA Principal acima da dobra]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Seção Benefício 1: imagem + título + 2 linhas]
  ─
  [Seção Benefício 2: imagem + título + 2 linhas]
  ─
  [Seção Benefício 3: imagem + título + 2 linhas]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Prova social: depoimentos em grid]
  [Garantia ou credencial de segurança]
  [CTA Final]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
*Melhor para: tráfego morno, reengajamento, retargeting*

---

### VARIANTE D — Narrativa (Storytelling)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [HEADLINE: situação identificável — "Se você também..."]
  [Narrativa: antes → virada → depois — 3-4 linhas]
  [Produto como herói da virada]
  [CTA Principal]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [Resultados específicos com números reais]
  [Depoimentos como mini-histórias, não frases soltas]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [O que você recebe — lista clara]
  [Garantia / risco zero]
  [CTA Final com micro-copy]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
*Melhor para: produtos premium, tráfego orgânico, nicho específico*

---

## PASSO 3 — CRO Scoring (MECLABS)

Aplique **C = 4m + 3v + 2(i-f) - 2a** para cada variante.

Score cada fator de 0 a 5:

| Fator | Peso | O que avaliar |
|-------|------|---------------|
| **m** Motivation | ×4 | Headline fala com a motivação primária do público? |
| **v** Value | ×3 | Proposta de valor é clara, única e crível? |
| **i** Incentive | ×2 | Há incentivo real para agir agora? |
| **f** Friction | ×2 (neg.) | Quanto esforço o visitante precisa fazer? |
| **a** Anxiety | ×2 (neg.) | Quanta dúvida/desconfiança a página gera? |

Apresentação obrigatória:
```
VARIANTE A: C = (4×_) + (3×_) + 2×(_ - _) - (2×_) = __pts
VARIANTE B: C = ...
VARIANTE C: C = ...
VARIANTE D: C = ...

RANKING: X > Y > Z > W
RECOMENDAÇÃO: Variante X — [1 parágrafo de justificativa]
```

---

## PASSO 4 — Decisão

Apresente o ranking e aguarde escolha:

```
Qual variante implementar?

→ [A] Hero + Prova Social       (score: XX) — recomendada para [público/fonte]
→ [B] Problem-First             (score: XX)
→ [C] Benefício Sequencial      (score: XX)
→ [D] Narrativa                 (score: XX)
→ [Mix] Combinar elementos de __ e __ (descreva o que mesclar)
```

Após escolha → passa o brief completo para `@dev` implementar.

---

## PASSO 5 — Registrar preferência

Após o cliente aprovar, registre em `docs/xoia-memory/clients/<cliente>.md`:

```markdown
## [DATA] — Landing page: <nome/campanha>
**Variante escolhida:** X — <motivo expresso pelo cliente>
**Elementos aprovados:** <o que o cliente gostou>
**Elementos rejeitados:** <o que foi descartado e por quê>
**Resultado (se disponível):** <taxa de conversão, leads, etc.>
```

Esse histórico faz as próximas sugestões mais precisas para esse cliente.

---

*XOIA — /design-shotgun | "4 tiros. Um alvo."*
