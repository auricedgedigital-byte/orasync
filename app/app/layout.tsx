import type React from "react"
import type { Metadata, Viewport } from "next"
import { Onest } from "next/font/google"
import "./globals.css"

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-onest",
})

export const metadata: Metadata = {
  title: "Orasync - Turn Patients into Bookings, Effortlessly",
  description:
    "Orasync helps dentists reactivate old patients, convert new leads, and manage campaigns — all in one place. Grow your dental practice with AI-powered patient engagement.",
  keywords:
    "dental practice growth, patient reactivation, dental marketing, patient engagement, dental CRM, booking automation",
  authors: [{ name: "Orasync Team" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://orasync.com",
    title: "Orasync - Dental Practice Growth Platform",
    description: "Turn patients into bookings effortlessly with Orasync's AI-powered patient engagement platform.",
    siteName: "Orasync",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orasync - Dental Practice Growth Platform",
    description: "Turn patients into bookings effortlessly with Orasync's AI-powered patient engagement platform.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${onest.variable} font-sans`}>
      <body className="antialiased bg-background text-foreground">{children}</body>
    </html>
  )
}
