# DESIGN.md — Sistema de Design Bica & AMP 213

> Fonte única de verdade para tokens visuais, padrões de componentes e decisões de design.
> Lido por agentes AI antes de qualquer trabalho em UI. Zero valores hardcoded — tokens ou nada.

---

## Identidade de Marca

| Marca | Cor primária | Hex | OKLCH |
|-------|-------------|-----|-------|
| **Bica Bar** | Âmbar dourado | `#c4973a` | `oklch(0.68 0.12 72)` |
| **AMP 213** | Tijolo quente | `#c13b2a` | `oklch(0.49 0.17 28)` |

O sistema operacional serve ambas as marcas. **Bica é primary, AMP é secondary.**

---

## Paleta de Cores

### Brand Tokens

```css
--color-bica:          #c4973a   /* Âmbar Bica — primary */
--color-bica-dark:     #a07a28   /* Hover, active states */
--color-bica-light:    #f5e8c8   /* Backgrounds, badges */
--color-bica-fg:       #ffffff   /* Texto sobre bica */

--color-amp:           #c13b2a   /* Tijolo AMP — secondary */
--color-amp-dark:      #9a2e1f   /* Hover, active states */
--color-amp-light:     #f7dbd7   /* Backgrounds, badges */
--color-amp-fg:        #ffffff   /* Texto sobre amp */
```

### Tokens Semânticos

```css
--color-primary:        var(--color-bica)
--color-primary-dark:   var(--color-bica-dark)
--color-primary-light:  var(--color-bica-light)
--color-primary-fg:     var(--color-bica-fg)

--color-secondary:      var(--color-amp)
--color-secondary-dark: var(--color-amp-dark)
--color-secondary-light:var(--color-amp-light)
--color-secondary-fg:   var(--color-amp-fg)

--color-success:        oklch(0.55 0.16 145)  /* #16a34a verde */
--color-warning:        oklch(0.75 0.15 78)   /* #f59e0b amarelo */
--color-danger:         oklch(0.58 0.24 27)   /* #dc2626 vermelho */
--color-info:           oklch(0.54 0.18 250)  /* #2563eb azul */
```

### Neutros

```css
--color-neutral-50:    oklch(0.985 0 0)   /* #fafafa */
--color-neutral-100:   oklch(0.97 0 0)    /* #f4f4f5 */
--color-neutral-200:   oklch(0.922 0 0)   /* #e4e4e7 */
--color-neutral-300:   oklch(0.87 0 0)    /* #d4d4d8 */
--color-neutral-400:   oklch(0.71 0 0)    /* #a1a1aa */
--color-neutral-500:   oklch(0.556 0 0)   /* #71717a */
--color-neutral-600:   oklch(0.439 0 0)   /* #52525b */
--color-neutral-700:   oklch(0.371 0 0)   /* #3f3f46 */
--color-neutral-800:   oklch(0.269 0 0)   /* #27272a */
--color-neutral-900:   oklch(0.205 0 0)   /* #18181b */
```

---

## Tipografia

```css
--font-sans:     'Inter', system-ui, sans-serif
--font-heading:  'Inter', system-ui, sans-serif
--font-mono:     'Geist Mono', monospace

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

---

## Componentes Core

### Bottom Nav (mobile)
- 5–6 tabs máximo
- Tab ativa: cor `--color-primary`, peso semibold
- Tab inativa: `--color-neutral-500`
- Badge de urgência: `--color-danger`, círculo 18px

### Cards de Dashboard
- `rounded-lg`, `shadow-sm`, `border border-neutral-200`
- Header: label sm muted + valor xl bold
- Cor de destaque no valor quando crítico (`--color-danger`)

### Checklists
- Checkbox 24px, touch area 48px
- Item completado: `line-through text-muted`
- Grupo com header sticky top-0

### Status Badges
```
OK      → bg-success-light text-success
BAIXO   → bg-warning-light text-warning
CRÍTICO → bg-danger-light text-danger
```

---

## Acessibilidade

- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
- Focus visible em todos os elementos interativos
- `aria-label` obrigatório em ícones sem texto
- Nunca remover outline de focus — customizar com `ring-*`

---

## Regras para Agentes AI

1. **Zero hardcoded** — use sempre tokens CSS via `var(--token-name)` ou classes Tailwind mapeadas
2. **shadcn/ui primeiro** — prefira componentes shadcn antes de criar do zero
3. **Mobile-first** — escreva styles mobile e use `md:` para desktop
4. **Semântico** — `--color-primary` não `--color-bica` dentro de componentes
5. **Dark mode** — qualquer token novo precisa ter variante `.dark`
6. **Cores da marca** — `--color-primary` = Bica âmbar, `--color-secondary` = AMP tijolo

---

## Tokens File

`app/src/tokens/tokens.yaml` — fonte de verdade YAML exportada para CSS e TypeScript.

---

*DESIGN.md v1.0 — Bica & AMP 213 Design System*
