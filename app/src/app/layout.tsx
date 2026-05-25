import type { Metadata } from "next"
import { Jost, DM_Serif_Display, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "600"],
  display: "swap",
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["300", "400", "500"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Bica & AMP 213 — Operacional",
  description: "Sistema operacional Bica Bar e AMP 213",
  manifest: "/manifest.json",
  themeColor: "#c9a368",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BiCA",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${jost.variable} ${dmSerifDisplay.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
