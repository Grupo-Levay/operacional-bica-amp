# DESIGN.md — Sistema de Design Bica & AMP 213

> Fonte única de verdade para tokens visuais, padrões de componentes e decisões de design.
> Lido por agentes AI antes de qualquer trabalho em UI. Zero valores hardcoded — tokens ou nada.

---

## Identidade de Marca

| Marca | Cor primária | Hex | OKLCH |
|-------|-------------|-----|-------|
| **Bica Bar** | Âmbar dourado | `#C9A368` | `oklch(0.707 0.092 72)` |
| **AMP 213** | Tijolo quente | `#B91C1C` | `oklch(0.428 0.170 28)` |

O sistema operacional serve ambas as marcas. **Bica é primary, AMP é secondary.**

---

## Paleta de Cores

### Brand Tokens

```css
--color-bica:          #C9A368   /* Âmbar Bica — primary */
--color-bica-dark:     #B98D4E   /* Hover, active states */
--color-bica-light:    rgba(201, 163, 104, 0.14)  /* Backgrounds sutis */
--color-bica-fg:       #14100D   /* Texto sobre fundo bica */

--color-amp:           #B91C1C   /* Tijolo AMP — secondary */
--color-amp-dark:      #991818   /* Hover, active states */
--color-amp-light:     rgba(185, 28, 28, 0.14)    /* Backgrounds sutis */
--color-amp-fg:        #EFE3CC   /* Texto sobre fundo amp */
```

### Aliases Semânticos

Dentro de componentes, use SEMPRE os aliases semânticos — não as cores de marca diretamente.
Isso permite trocar o tema da casa sem alterar código de componente.

```css
--color-primary:       var(--color-bica)
--color-primary-dark:  var(--color-bica-dark)
--color-primary-light: var(--color-bica-light)
--color-primary-fg:    var(--color-bica-fg)

--color-secondary-brand:      var(--color-amp)
--color-secondary-brand-dark: var(--color-amp-dark)
--color-secondary-brand-light:var(--color-amp-light)
--color-secondary-fg:  var(--color-amp-fg)
```

**Exceção legítima:** componentes que exibem AMBAS as marcas simultaneamente
(ex: checklist-card mostra bica para Abertura e amp para Fechamento) podem usar
`var(--color-bica)` e `var(--color-amp)` diretamente.

### Status Semânticos

```css
--color-success:       #4ade80   /* oklch(0.74 0.18 145) */
--color-success-bg:    rgba(74, 222, 128, 0.12)

--color-warning:       #fbbf24   /* oklch(0.81 0.16 78) */
--color-warning-bg:    rgba(251, 191, 36, 0.12)

--color-danger:        #f87171   /* oklch(0.69 0.19 27) */
--color-danger-bg:     rgba(248, 113, 113, 0.12)
```

### Paleta Parchment (texto, superfícies claras sobre escuro)

```css
--color-b0:  #F4ECDC   /* oklch(0.940 0.024 72) — Quase branco creme */
--color-b1:  #EFE3CC   /* oklch(0.913 0.025 72) — Foreground principal */
--color-b2:  #D8C9A8   /* oklch(0.825 0.033 72) — Texto secundário */
--color-b3:  #B5A481   /* oklch(0.683 0.038 72) — Labels, placeholders */
--color-b4:  #8D7F66   /* oklch(0.552 0.024 72) — Muted foreground */
```

### Paleta Ink (backgrounds escuros)

```css
--color-ink:   #0B0807   /* oklch(0.065 0.008 52) — Preto quase absoluto */
--color-ink2:  #14100D   /* oklch(0.098 0.010 52) — Background card */
--color-ink3:  #1C1612   /* oklch(0.138 0.012 52) — Background principal */
--color-ink4:  #2A211A   /* oklch(0.190 0.014 52) — Superfície elevada */
```

---

## Tipografia

```css
--font-sans:     'Jost', system-ui, sans-serif     /* Corpo — UI geral */
--font-display:  'DM Serif Display', serif          /* Títulos de página */
--font-mono:     'JetBrains Mono', monospace        /* Números, código */

--text-xs:       0.75rem / 1rem
--text-sm:       0.875rem / 1.25rem
--text-base:     1rem / 1.5rem
--text-lg:       1.125rem / 1.75rem
--text-xl:       1.25rem / 1.75rem
--text-2xl:      1.5rem / 2rem
--text-3xl:      1.875rem / 2.25rem

--font-normal:   400
--font-medium:   500
--font-semibold: 600
--font-bold:     700
```

Padrão de header de página: `font-display text-2xl text-primary`

---

## Espaçamento

Base 4px. Tokens em múltiplos.

```css
--space-1:   0.25rem   /* 4px */
--space-2:   0.5rem    /* 8px */
--space-3:   0.75rem   /* 12px */
--space-4:   1rem      /* 16px */
--space-5:   1.25rem   /* 20px */
--space-6:   1.5rem    /* 24px */
--space-8:   2rem      /* 32px */
--space-10:  2.5rem    /* 40px */
--space-12:  3rem      /* 48px */
--space-16:  4rem      /* 64px */
```

---

## Raios de Borda

```css
--radius-sm:  0.25rem   /* 4px — badges, chips */
--radius-md:  0.5rem    /* 8px — inputs, cards small */
--radius-lg:  0.75rem   /* 12px — cards, modais */
--radius-xl:  1rem      /* 16px — sheets, drawers */
--radius-full: 9999px   /* pills, avatares */
```

---

## Sombras

```css
--shadow-sm:  0 1px 2px rgb(0 0 0 / 0.05)
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1)
```

---

## Mobile-First (touch targets)

- **Touch target mínimo**: 52px height/width (WCAG 2.5.5)
- **Bottom nav**: fixo, 64px height, ícone 24px + label 10px
- **Safe area**: `env(safe-area-inset-bottom)` no padding do bottom nav
- **Breakpoints**: `sm: 640px`, `md: 768px`, `lg: 1024px`

Em Tailwind: `min-h-[52px]` para botões de ação primária.

---

## Componentes Core

### PageHeader (shared)
```tsx
// Padrão de cabeçalho de página — props: title, subtitle?, badge?, action?
<div className="flex items-start justify-between gap-3">
  <h1 className="font-display text-2xl text-primary">{title}</h1>
  <p className="text-xs text-muted-foreground capitalize">{subtitle}</p>
</div>
```

### EmptyState (shared)
```tsx
// Props: icon?, message, className?
// Com ícone: fichas, checklists, reservas
// Sem ícone: empty inline (compras, rodadas)
```

### BrandLink (ui)
```tsx
// Link full-width com estilo primary, 52px height
// Substitui <Link style={{ height: 56, backgroundColor: "var(--color-bica)" }}>
```

### Bottom Nav (mobile)
- 5–6 tabs máximo
- Tab ativa: `text-primary` (âmbar), `font-semibold`
- Tab inativa: `text-b4`
- Indicador ativo: linha 2px `bg-primary` no topo da tab

### Cards de Dashboard
- `rounded-xl`, `ring-1 ring-foreground/10`
- Header: label xs muted uppercase + valor 3xl mono
- Cor de destaque no valor: `text-danger`, `text-success`, `text-primary`

### Checklists
- Checkbox 24px, touch area 48px+
- Item completado: `line-through text-muted`
- Grupo com `SectionLabel` como header
- Borda esquerda colorida: bica para Abertura, amp para Fechamento

### Status Badges
```
OK      → bg-success-bg text-success
BAIXO   → bg-warning-bg text-warning
CRÍTICO → bg-danger-bg text-danger
```

Em Tailwind (após @theme inline):
```
bg-success-bg text-success
bg-warning-bg text-warning
bg-danger-bg text-danger
```

---

## Acessibilidade

- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
- Focus visible em todos os elementos interativos
- `aria-label` obrigatório em ícones sem texto
- Nunca remover outline de focus — customizar com `ring-*`
- Touch targets mínimo 52px (WCAG 2.5.5 — AAA)

---

## Regras para Agentes AI

1. **Zero hardcoded** — use sempre tokens CSS via classes Tailwind ou `var(--token-name)`
2. **Semântico primeiro** — `text-primary` não `text-bica`; `bg-danger` não `style={{ backgroundColor: "#dc2626" }}`
3. **shadcn/ui primeiro** — prefira componentes existentes antes de criar do zero
4. **Mobile-first** — escreva styles mobile e use `md:` para desktop
5. **Leia este arquivo** antes de qualquer trabalho em UI
6. **`style={{}}` inevitáveis**: `gridTemplateColumns` dinâmico, `env(safe-area-inset-bottom)`, radial-gradient — documentar com comentário inline
7. **Exceção multi-brand**: checklist-card e wordmark BiCA podem usar `var(--color-bica)` e `var(--color-amp)` diretamente

---

## Tokens File

`app/src/tokens/tokens.yaml` — exporta para TypeScript via `app/src/tokens/index.ts`

`app/src/app/globals.css` — CSS custom properties + `@theme inline` para Tailwind v4

---

*DESIGN.md v2.0 — Bica & AMP 213 Design System (atualizado 2026-05-25)*
