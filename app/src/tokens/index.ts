export const tokens = {
  color: {
    // Brand
    bica:          "#C9A368",
    "bica-dark":   "#B98D4E",
    "bica-light":  "rgba(201, 163, 104, 0.14)",
    "bica-fg":     "#14100D",
    amp:           "#B91C1C",
    "amp-dark":    "#991818",
    "amp-light":   "rgba(185, 28, 28, 0.14)",
    "amp-fg":      "#EFE3CC",

    // Aliases semânticos (usar em componentes)
    primary:            "var(--color-bica)",
    "primary-dark":     "var(--color-bica-dark)",
    "primary-light":    "var(--color-bica-light)",
    "primary-fg":       "var(--color-bica-fg)",
    "secondary-brand":  "var(--color-amp)",
    "secondary-fg":     "var(--color-amp-fg)",

    // Status
    success:       "#4ade80",
    "success-bg":  "rgba(74, 222, 128, 0.12)",
    warning:       "#fbbf24",
    "warning-bg":  "rgba(251, 191, 36, 0.12)",
    danger:        "#f87171",
    "danger-bg":   "rgba(248, 113, 113, 0.12)",

    // Parchment
    b0: "#F4ECDC",
    b1: "#EFE3CC",
    b2: "#D8C9A8",
    b3: "#B5A481",
    b4: "#8D7F66",

    // Ink
    ink:  "#0B0807",
    ink2: "#14100D",
    ink3: "#1C1612",
    ink4: "#2A211A",
  },
  radius: {
    sm:   "0.25rem",
    md:   "0.5rem",
    lg:   "0.75rem",
    xl:   "1rem",
    full: "9999px",
  },
  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.45)",
    md: "0 4px 10px -2px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.4)",
    lg: "0 12px 28px -6px rgb(0 0 0 / 0.6), 0 4px 8px -4px rgb(0 0 0 / 0.45)",
    xl: "0 24px 48px -12px rgb(0 0 0 / 0.7), 0 8px 16px -8px rgb(0 0 0 / 0.5)",
    // Elevation / glow com tint âmbar (dark theme)
    "glow-bica":    "0 0 0 1px rgba(201, 163, 104, 0.18), 0 8px 24px -6px rgba(201, 163, 104, 0.30)",
    "glow-bica-sm": "0 0 0 1px rgba(201, 163, 104, 0.16), 0 4px 14px -4px rgba(201, 163, 104, 0.28)",
    "glow-amp":     "0 0 0 1px rgba(185, 28, 28, 0.20), 0 8px 24px -6px rgba(185, 28, 28, 0.32)",
    "inner-hairline": "inset 0 1px 0 0 rgba(244, 236, 220, 0.04)",
  },
  gradient: {
    surface:        "linear-gradient(180deg, #14100D 0%, #1C1612 100%)",
    "surface-raised": "linear-gradient(180deg, #1C1612 0%, #2A211A 100%)",
    "brand-bica":   "linear-gradient(135deg, #C9A368 0%, #B98D4E 100%)",
    "brand-amp":    "linear-gradient(135deg, #B91C1C 0%, #991818 100%)",
    sheen:          "linear-gradient(135deg, rgba(244,236,220,0.16) 0%, rgba(244,236,220,0) 55%)",
  },
  transition: {
    fast:   "150ms cubic-bezier(0.16, 1, 0.3, 1)",
    normal: "200ms cubic-bezier(0.16, 1, 0.3, 1)",
    slow:   "300ms cubic-bezier(0.16, 1, 0.3, 1)",
    spring: "260ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  spacing: {
    1:  "0.25rem",
    2:  "0.5rem",
    3:  "0.75rem",
    4:  "1rem",
    5:  "1.25rem",
    6:  "1.5rem",
    8:  "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
  },
  touch: {
    target: "52px",
  },
} as const

export type Token = typeof tokens
