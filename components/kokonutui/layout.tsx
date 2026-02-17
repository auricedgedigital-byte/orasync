"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import Sidebar from "./sidebar"
import TopNav from "./top-nav"
import { NovaAssistant } from "@/components/orasync/onboarding/nova-assistant"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const { user, loading } = useUser()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const updateTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark")
      setIsDark(isDarkMode)
    }

    // Only run on client side
    if (typeof window !== "undefined") {
      // Initial check
      updateTheme()
      setMounted(true)
    } else {
      setMounted(true)
    }

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className={`flex h-screen ${isDark ? "dark" : ""}`}>
      <Sidebar />
      <div className="w-full flex flex-1 flex-col relative">
        <header className="h-16 border-b border-border text-foreground bg-background/60 backdrop-blur-xl sticky top-0 z-30 transition-all duration-300">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-background text-foreground relative">
          {/* Subtle gradient blobb - Dashboard only */}
          <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-3xl pointer-events-none -z-10" />
          {children}
          <NovaAssistant />
        </main>
      </div>
    </div>
  )
}
