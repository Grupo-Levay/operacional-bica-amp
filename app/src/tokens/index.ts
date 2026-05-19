export const tokens = {
  color: {
    bica:          "#c4973a",
    "bica-dark":   "#a07a28",
    "bica-light":  "#f5e8c8",
    "bica-fg":     "#ffffff",
    amp:           "#c13b2a",
    "amp-dark":    "#9a2e1f",
    "amp-light":   "#f7dbd7",
    "amp-fg":      "#ffffff",
    success:       "#16a34a",
    "success-light": "#dcfce7",
    warning:       "#f59e0b",
    "warning-light": "#fef9c3",
    danger:        "#dc2626",
    "danger-light": "#fee2e2",
    info:          "#2563eb",
    "info-light":  "#dbeafe",
  },
  radius: {
    sm:   "0.25rem",
    md:   "0.5rem",
    lg:   "0.75rem",
    xl:   "1rem",
    full: "9999px",
  },
  spacing: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    6: "1.5rem",
    8: "2rem",
    12: "3rem",
    16: "4rem",
  },
} as const

export type Token = typeof tokens
