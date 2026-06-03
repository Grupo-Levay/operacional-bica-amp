# DESIGN-v3.md — Camada Visual v3 (Bica & AMP 213)

> Evolução **additive e não-breaking** sobre `DESIGN.md` (v2). Eleva a UI de plana/ultrapassada
> para moderna: **profundidade real**, **glow âmbar**, **gradientes sutis** e **microinterações**.
> Nada do v2 foi removido — apenas novos tokens e refinamento dos 3 componentes base.

---

## Princípios v3

1. **Profundidade** — No dark theme, sombras `/0.1` somem. Usamos preto denso (0.45–0.7) +
   *hairline* interno (highlight no topo) + gradiente de superfície (ink2→ink3) para dar volume.
2. **Contraste** — Status com `bg-light + texto forte + borda-tint`. Mínimo WCAG AA.
3. **Microinteração** — Hover com *lift* sutil (`-translate-y`), `active` que assenta, easing
   premium `cubic-bezier(0.16,1,0.3,1)`. Respeita `prefers-reduced-motion`.
4. **Consistência** — Glow e gradientes são **dinâmicos por marca**: seguem `[data-casa]`
   automaticamente via `--color-primary-dynamic(-rgb)`.

---

## Novos Tokens

Fonte: `app/src/tokens/tokens.yaml` → `app/src/tokens/index.ts` → `app/src/app/globals.css`.

### Sombras (refeitas para dark) + Glow

| Token / Utility | Uso |
|---|---|
| `shadow-sm/md/lg/xl` | Sombras dark reais (preto denso). Substituem as antigas que sumiam. |
| `shadow-glow-bica` / `-sm` | Halo âmbar fixo (Bica). CTAs, cards em foco. |
| `shadow-glow-amp` | Halo tijolo fixo (AMP). |
| `shadow-glow-brand` / `-sm` | **Dinâmico** — segue a casa ativa (`[data-casa]`). Preferir este. |
| `shadow-inner-hairline` | Highlight interno no topo; dá volume a superfícies elevadas. |

### Gradientes (utilities `bg-gradient-*`)

| Utility | Uso |
|---|---|
| `bg-gradient-surface` | ink2→ink3. Profundidade vertical em cards (padrão). |
| `bg-gradient-surface-raised` | ink3→ink4. Hover/active de cards interativos. |
| `bg-gradient-brand` | **Dinâmico** brand→brand-dark. CTA premium. |
| `bg-gradient-brand-bica` / `-amp` | Versões fixas por marca. |
| `bg-gradient-sheen` | Brilho diagonal sobreposto (overlay) — usado no botão `gradient`. |

### Focus & Transition

| Token / Utility | Uso |
|---|---|
| `.focus-ring-brand` | Outline âmbar acessível com offset (contraste no dark). `focus-visible`. |
| `--focus-ring`, `--focus-ring-width/-offset` | Vars para compor anéis custom. |
| `transition.spring` | Curva com leve overshoot para lift/scale. |

> **Radius:** mantido. `md` (8px) segue OK para botões — sem nova variante necessária.

---

## Componentes redesenhados (API preservada)

### Button — `app/src/components/ui/button.tsx`

- **Microinteração:** hover *lift* (`-translate-y-px`) só em ponteiro fino (`@media(hover:hover)`),
  `active` assenta, transição com easing premium, `motion-reduce` neutraliza.
- **Foco:** `focus-visible` ring mantido (ring-3 âmbar).
- **Variante nova `gradient`** (CTA premium): `bg-gradient-brand` + glow + sheen no topo.
- **`size="cta"`** agora com `min-h-[52px]` (WCAG 2.5.5).
- Variantes existentes (`default`, `brand`, `outline`, `secondary`, `ghost`, `destructive`,
  `link`, `success`) **mantidas**; `default`/`brand` ganharam sombra + glow-hover.

```tsx
<Button variant="gradient" size="cta">Abrir caixa</Button>   {/* CTA premium */}
<Button variant="brand">Salvar</Button>                       {/* refinado */}
```

### Card — `app/src/components/ui/card.tsx`

- **Prop `variant` nova (opcional):** `default` | `interactive` | `flat`. `size` preservado.
- `default`: gradiente de superfície + `shadow-md` + hairline + ring. Profundidade real.
- `interactive`: + hover lift (`-translate-y-0.5`) + glow âmbar + ring primary. Para cards clicáveis.
- `flat`: comportamento legado (sem gradiente/sombra) para cards aninhados.

```tsx
<Card>…</Card>                          {/* profundidade por padrão */}
<Card variant="interactive">…</Card>    {/* card clicável com lift */}
```

### Badge — `app/src/components/ui/badge.tsx`

- **Pill real:** `rounded-full`.
- **Status com contraste melhor:** `bg-light + texto forte + borda-tint` (`success`,
  `warning`, `destructive`).
- **Variantes novas:** `danger` (alias de destructive) e `neutral`.
- Existentes (`default`, `secondary`, `outline`, `ghost`, `link`) **mantidas**.

```tsx
<Badge variant="success">OK</Badge>
<Badge variant="warning">BAIXO</Badge>
<Badge variant="danger">CRÍTICO</Badge>
<Badge variant="neutral">—</Badge>
```

---

## Antes vs Depois (conceitual)

| Aspecto | Antes (v2) | Depois (v3) |
|---|---|---|
| Cards | `bg-card` chapado, ring fino. Plano. | Gradiente ink2→ink3 + sombra dark + hairline. Volume. |
| Sombras | `rgb(0 0 0 / 0.1)` — invisível no dark. | Preto denso 0.45–0.7 + glow âmbar dinâmico. |
| Botões | Hover só troca cor/opacidade. | Lift sutil + glow no hover + easing premium + sheen no CTA. |
| CTA | Cor sólida. | Gradiente de marca + glow + brilho diagonal. |
| Badges | `rounded-4xl`, status low-contrast. | Pill + bg-light + texto forte + borda-tint. |
| Foco | Ring genérico. | `.focus-ring-brand` âmbar com offset (acessível no dark). |

---

## Acessibilidade (mantida/ampliada)

- Touch target `cta` garantido em `min-h-[52px]` (WCAG 2.5.5).
- `prefers-reduced-motion`: lift/scale e transições neutralizados.
- Lift só em `@media(hover:hover)` — evita estados grudados em touch.
- Contraste de status WCAG AA; foco sempre visível.

---

*DESIGN-v3.md — camada additive sobre DESIGN.md v2. Atualizado 2026-06-03.*
