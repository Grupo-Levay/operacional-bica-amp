# Auditoria Visual — Design System Bica & AMP 213

**Data:** 2026-06-03  
**Fase:** Phase 2 — Design System v3 Modernization  
**Status:** AUDIT COMPLETO

---

## 📊 Resumo Executivo

O sistema visual Bica está **80% moderno** com uma paleta forte, tokens estruturados e sombras dinâmicas. **Gaps críticos:** escalas de tipografia incompletas, componentes base não redesenhados com nova visual, e aplicação inconsistente em páginas.

**Recomendação:** Expandir tokens de tipografia (scales xs-3xl), redesenhar 8 componentes base (button, card, input, badge, progress-ring, level-bar, modal, list), aplicar globalmente.

---

## ✅ O Que Está Bom

### Arquitetura de Tokens
- ✅ Tokens bem estruturados (`tokens.yaml` + `globals.css`)
- ✅ Paleta de brand (Bica âmbar, AMP tijolo) adequada para operacional
- ✅ Escalas de spacing bem definidas (1-16: 4px-64px)
- ✅ Border radius lógica (sm/md/lg/xl/full)
- ✅ Sombras dinâmicas v3 (preto denso visível no dark theme)
- ✅ Glow effects com tints de marca (premium look)
- ✅ Gradientes sutis (surface, surface-raised, brand)
- ✅ Focus rings acessíveis (WCAG 2.4.7)

### Paleta de Cores
- ✅ Brand primária (Bica #C9A368) vibrante e legível
- ✅ Brand secundária (AMP #B91C1C) com boa contrast
- ✅ Parchment (b0-b4) para texto em dark backgrounds
- ✅ Ink (ink-ink4) para backgrounds com profundidade
- ✅ Status semânticos (success, warning, danger) bem definidos
- ✅ Aliases dinâmicos por casa (Bica vs AMP)

### Tipografia Base
- ✅ Fontes escolhidas (Jost, DM Serif Display, JetBrains Mono)
- ✅ Pesos definidos (normal-bold: 400-700)
- ✅ Alguns sizes (xs-3xl: 0.75rem-1.875rem)

---

## ⚠️ Gaps Identificados

### 1. **Tipografia: Escalas Incompletas**
**Problema:** Apenas 7 sizes definidos (xs-3xl), faltam line-height e letter-spacing.  
**Impacto:** Inconsistência em títulos, body, labels, captions.  
**Recomendação:**
```yaml
# Expandir para escalas semânticas
typography:
  # Headings
  h1: size=2.25rem, weight=700, line-height=2.75rem
  h2: size=1.875rem, weight=700, line-height=2.25rem
  h3: size=1.5rem, weight=600, line-height=2rem
  
  # Body
  body-lg: size=1.125rem, weight=400, line-height=1.75rem
  body: size=1rem, weight=400, line-height=1.5rem
  body-sm: size=0.875rem, weight=400, line-height=1.25rem
  
  # UI
  label: size=0.875rem, weight=600, line-height=1.25rem
  caption: size=0.75rem, weight=400, line-height=1rem
```

### 2. **Componentes Base: Visuais Desatualizadas**
**Problema:** Componentes existentes (button, card, input) não aplicam novos tokens de glow/shadow/gradient.  
**Impacto:** App parece 2024, não 2026.  
**Recomendação:** Redesenhar 8 componentes:
- [ ] `button.tsx` — adicionar glow no hover, gradient brand, states refinados
- [ ] `card.tsx` — usar glow-brand, gradient-surface, shadow-lg
- [ ] `input.tsx` — focus ring dinâmico, label sizing
- [ ] `badge.tsx` — status colors semânticas, tamanhos
- [ ] `progress-ring.tsx` — glow on active, cores atualizadas
- [ ] `level-bar.tsx` — gradient-surface background
- [ ] Modal/Dialog — shadow-xl, glow-brand border
- [ ] List items — surface-raised background, hover glow

### 3. **Aplicação Inconsistente em Páginas**
**Problema:** Pages ainda usam cores hardcoded ou tokens parcialmente.  
**Exemplos:**
- Dashboard: mix de `bg-bica` e `bg-gradient-surface`
- Reservas: cards sem glow effects
- Escala: labels com tamanho inconsistente
- Estoque: absence de status-color badges

**Recomendação:** Varrer componentes/ui/ + componentes/shared/ + todas as pages.

### 4. **Microinterações & Animações**
**Problema:** Transições definidas (fast/normal/slow/spring) mas não aplicadas consistentemente.  
**Recomendação:**
- [ ] Hover states em buttons/cards (lift 2px, glow-brand)
- [ ] Focus states com anel e escala suave
- [ ] Modais com fade-in (150ms fast)
- [ ] Toasts com slide-up (spring)

---

## 🎨 Recomendações Phase 2

### Prioridade 1: Tipografia & Componentes Base
1. **Expandir escalas de tipografia** (h1-h3, body, label, caption com line-height/letter-spacing)
2. **Redesenhar 8 componentes base** (button, card, input, badge, ring, level-bar, modal, list)
3. **Aplicar glow/gradient/shadow** em todos components/ui/

### Prioridade 2: Aplicação Global
4. **Varrer todas as pages** e substituir hardcoded colors por tokens
5. **Padronizar spacing** (usar scale 1-16, não valores hardcoded)
6. **Validar contrast** (WCAG AAA em todos os estados)

### Prioridade 3: Microinterações
7. **Adicionar transitions** em hover/focus/active
8. **Refinar animações** de modais, toasts, menus

---

## 📐 Checklist Modernidade (2026)

- [x] Paleta de cores moderna (brand + semânticos)
- [x] Sombras dinâmicas (não /0.1 que some no dark)
- [x] Gradientes sutis (profundidade)
- [x] Glow effects (premium look)
- [x] Focus rings acessíveis
- [ ] **Tipografia escalada** (h1-caption com métricas)
- [ ] **Componentes com novo visual** (glow, gradient, microinterações)
- [ ] **Animações suaves** (spring easing)
- [ ] **Touch targets 52px** (WCAG 2.5.5 — já feito em alguns lugares)

---

## 🚀 Próximas Etapas

Phase 2 Tasks:
1. Atualizar `tokens.yaml` com tipografia completa (h1-caption)
2. Redesenhar 8 componentes base em `components/ui/`
3. Aplicar tokens em `components/shared/`
4. Varrer todas as pages (especialmente dashboard, reservas, escala)
5. Validar contrast WCAG AAA em todos os estados
6. Criar DESIGN-v3.md com padrões de uso

**Duração estimada:** 3-4 dias  
**Dependências:** Nenhuma (self-contained)  
**Bloqueadores:** Nenhum

---

## 📚 Referências

- `DESIGN.md` — Fonte de verdade v2.0
- `tokens.yaml` — Tokens estruturados
- `globals.css` — CSS vars aplicadas
- Padrões modernos: Figma, Material Design 3, design patterns 2026
