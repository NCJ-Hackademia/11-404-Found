import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TRUSTLIST - SUSTAINABLE MARKETPLACE FOR PRE-OWNED GOODS",
  description:
    "BUY SMART. SELL SMART. EVERY REUSE REDUCES WASTE AND HELPS OUR PLANET. A VERIFIED, AI-POWERED MARKETPLACE FOR PRE-OWNED GOODS THAT PROMOTES SUSTAINABILITY, REUSE, AND REDUCES CARBON FOOTPRINT.",
  keywords:
    "sustainable marketplace, pre-owned goods, circular economy, carbon footprint, reuse, second-hand, verified listings",
  authors: [{ name: "TrustList Team" }],
  openGraph: {
    title: "TRUSTLIST - SUSTAINABLE MARKETPLACE",
    description: "A VERIFIED, AI-POWERED MARKETPLACE FOR PRE-OWNED GOODS",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
