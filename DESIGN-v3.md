# Design System v3 — Bica & AMP 213

**Data:** 2026-06-03  
**Versão:** 3.0 (Phase 2 Modernization)  
**Status:** Ativo

---

## 📋 Índice

1. [Princípios de Design](#princípios-de-design)
2. [Paleta de Cores v3](#paleta-de-cores-v3)
3. [Tipografia](#tipografia)
4. [Componentes Base](#componentes-base)
5. [Padrões de Uso](#padrões-de-uso)
6. [Accessibility (a11y)](#accessibility-a11y)
7. [Microinterações](#microinterações)

---

## 🎨 Princípios de Design

### 1. **Consistência**
- Use tokens definidos em `src/tokens/tokens.yaml` — nunca hardcode colors/sizes
- Componentes compartilham a mesma base visual (sombras, raios, transições)
- Padrão: `bg-primary`, `text-primary-fg`, `shadow-md`, `rounded-lg`

### 2. **Affordance**
- CTAs claros: `Button variant="brand"` ou `Button variant="gradient"` com altura 52px (WCAG 2.5.5)
- Cards interativos: adicione `interactive` variant com hover lift + glow
- Labels explícitos em inputs/forms (não placeholders como único hint)
- Icons como suporte visual, não substituto de texto

### 3. **Contraste & Acessibilidade**
- Texto: WCAG AAA (contrast ratio 7:1 mínimo)
- Focus rings: âmbar dinâmico (`--focus-ring`) sobre dark background
- Cores semânticas para status: success (verde), warning (amarelo), danger (vermelho)
- Touch targets: min 52px (WCAG 2.5.5 AAA)

### 4. **Modernidade 2026**
- Sombras dinâmicas reais (preto denso 0.45–0.7, não /0.1)
- Gradientes sutis em superfícies (profundidade vertical)
- Glow effects com tints de marca (premium look)
- Animações suaves (cubic-bezier(0.16, 1, 0.3, 1) — easeOutExpo)

---

## 🎭 Paleta de Cores v3

### Brand Primária

```
Bica #C9A368 — Âmbar ouro velho
├─ base:       #C9A368
├─ dark:       #B98D4E (hover, active)
├─ light:      rgba(201, 163, 104, 0.14) (background)
├─ foreground: #14100D (texto sobre fundo bica)
└─ semântico:  --color-primary (alias dinâmico, segue [data-casa])
```

### Brand Secundária (AMP)

```
AMP #B91C1C — Tijolo terracota
├─ base:       #B91C1C
├─ dark:       #991818 (hover, active)
├─ light:      rgba(185, 28, 28, 0.14) (background)
├─ foreground: #EFE3CC (texto sobre fundo amp)
└─ semântico:  --color-secondary-brand
```

### Status Semânticos

```
Success:  #4ade80  (verde)  — OK, completo, aprovado
Warning:  #fbbf24  (amarelo)— Atenção, pendente
Danger:   #f87171  (vermelho)— Crítico, erro, falha
```

### Parchment (Foregrounds)

```
b0: #F4ECDC  — Quase branco creme (disabled/inactive)
b1: #EFE3CC  — Foreground principal
b2: #D8C9A8  — Texto secundário
b3: #B5A481  — Labels, placeholders
b4: #8D7F66  — Muted foreground
```

### Ink (Backgrounds)

```
ink:   #0B0807  — Preto absoluto
ink2:  #14100D  — Background card
ink3:  #1C1612  — Background principal
ink4:  #2A211A  — Superfície elevada
```

---

## 🔤 Tipografia

### Fontes

| Família       | Uso                           |
|---------------|-------------------------------|
| Jost          | Sans-serif (body, UI)         |
| DM Serif Display | Display, headings premium   |
| JetBrains Mono| Código, monospace            |

### Escalas Semânticas

#### Headings

| Nível | Tamanho | Peso | Line Height | Letter-spacing | Uso                          |
|-------|---------|------|-------------|----------------|------------------------------|
| h1    | 2.25rem | 700  | 2.75rem     | -0.02em       | Títulos principais (pages)   |
| h2    | 1.875rem | 700 | 2.25rem     | -0.01em       | Títulos de seção            |
| h3    | 1.5rem  | 600  | 2rem        | 0em            | Subtítulos, subseções       |

#### Body

| Nível       | Tamanho | Peso | Line Height | Uso                         |
|-------------|---------|------|-------------|------------------------------|
| body-lg     | 1.125rem | 400 | 1.75rem     | Introduções, leads          |
| body        | 1rem    | 400  | 1.5rem      | Padrão (descrições, texto)  |
| body-sm     | 0.875rem | 400 | 1.25rem     | Helper text, metadados     |

#### UI

| Nível   | Tamanho | Peso | Line Height | Uso              |
|---------|---------|------|-------------|------------------|
| label   | 0.875rem | 600 | 1.25rem     | Form labels      |
| caption | 0.75rem | 400  | 1rem        | Timestamps, info |

---

## 🧩 Componentes Base

### Button

**Variantes:**
- `default` — primária âmbar com glow ao hover
- `brand` — alias para default (bica específico)
- `gradient` — premium com gradiente + sheen overlay
- `outline` — borda, útil para ações secundárias
- `ghost` — mínimo, só hover background
- `destructive` — ações destrutivas (vermelho)
- `success` — ações de sucesso (verde)

**Tamanhos:**
- `xs` (24px), `sm` (28px), `default` (32px), `lg` (36px)
- `cta` — **Call-to-action** (52px h, full-width, WCAG 2.5.5)
- `icon`, `icon-sm`, `icon-lg` — botões só ícone

### Card

**Variantes:**
- `default` — gradiente surface + shadow-md + hairline interno
- `interactive` — `default` + hover lift + glow-brand-sm
- `flat` — sem gradiente/sombra (cards aninhados, legado)

### Badge

**Variantes:** `default`, `secondary`, `success`, `warning`, `danger`, `neutral`, `outline`, `ghost`

### ProgressRing

Anel circular de progresso (SVG puro). **Glow automático** quando valor > 70%.

### LevelBar

Barra horizontal de nível com gradient-surface background.

### Dialog (ConfirmDialog)

Modal de confirmação mobile-first com shadow-xl e glow-brand.

### List & ListItem

Componentes genéricos para listas com `interactive` variant para hover lift + glow.

---

## 📐 Padrões de Uso

### Quando Usar Card vs List

| Card | List |
|------|------|
| Conteúdo complexo | Itens simples, repetidos |
| Ênfase visual isolada | Fluxo contínuo, compacto |
| Dashboard, detalhes | Tabelas, registros |

### Buttons em Contextos

**Forms:** `variant="brand" size="cta"` para confirmação, `variant="outline"` para cancelamento.

**Destrutivas:** Sempre com `ConfirmDialog`.

**Inline:** `variant="ghost" size="sm"` em listas/cards.

### Tipografia em Pages

```tsx
<h1 className="text-h1 font-bold">Dashboard</h1>
<h2 className="text-h2 font-semibold">Seção</h2>
<p className="text-body leading-body">Descrição...</p>
<span className="text-caption text-muted-foreground">Metadados</span>
```

---

## ♿ Accessibility (a11y)

### WCAG 2.1 AAA

| Critério     | Padrão         |
|--------------|----------------|
| Contrast     | 7:1 (AAA)      |
| Touch Target | 52px mín       |
| Focus Ring   | Âmbar dinâmico |

### Padrões Implementados

1. **Focus Visible:** `focus-visible:ring` âmbar em todos inputs/buttons
2. **Semantic HTML:** `<button>`, `<input>`, `<label>`, proper roles
3. **ARIA Labels:** `aria-label`, `aria-description`, `aria-invalid`
4. **Color + Symbol:** Status sempre com ícone + cor

---

## ✨ Microinterações

### Transições

| Duração | Timing | Uso |
|---------|--------|-----|
| 150ms | cubic-bezier(0.16, 1, 0.3, 1) | Fast feedback |
| 200ms | idem | Normal (padrão) |
| 300ms | idem | Slow reveal |
| 260ms | cubic-bezier(0.34, 1.56, 0.64, 1) | Spring bounce |

### Hover Effects

- **Button:** `translateY(-1px)` + glow-brand-sm
- **Card Interactive:** `translateY(-2px)` + glow-brand-sm
- **ListItem Interactive:** `translateY(-2px)` + glow-brand-sm

### Active States

- **Button:** `translateY(1px)` (settle, inverse lift) com duração 75ms

---

## 🚀 Checklist de Implementação

- [ ] Usa tokens (não hardcoded)
- [ ] Focus ring (`focus-visible:ring`)
- [ ] Hover effect
- [ ] Active state
- [ ] Touch target 52px min
- [ ] Contrast ratio 7:1 (AAA)
- [ ] Semântica HTML
- [ ] ARIA labels
- [ ] Mobile-first responsive
- [ ] Motion reduce support
- [ ] Tests

---

## 📚 Referências

- **Tokens:** `src/tokens/tokens.yaml`
- **CSS vars:** `src/app/globals.css`
- **Componentes:** `src/components/ui/`
- **Audit:** `docs/AUDIT-VISUAL.md`
