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
