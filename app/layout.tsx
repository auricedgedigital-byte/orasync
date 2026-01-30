import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import ThemeClient from "@/components/ThemeClient"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Orasync | AI-Powered Dental Operating System",
  description: "Modern dental practice management, AI-driven patient reactivation, and marketing growth engine for dental clinics.",
  keywords: ["dental marketing", "patient reactivation", "dental CRM", "AI dental assistant", "practice management"],
  openGraph: {
    title: "Orasync | Transform Your Dental Practice",
    description: "The AI-augmented dental operating system that removes admin friction and increases bookings.",
    url: "https://orasync.site",
    siteName: "Orasync",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orasync | AI DentalOS",
    description: "AI-driven growth for dental practices.",
  },
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeClient>{children}</ThemeClient>
      </body>
    </html>
  )
}
