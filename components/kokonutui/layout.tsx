"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import Sidebar from "./sidebar"
import TopNav from "./top-nav"

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
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary/30 border-t-primary"></div>
          <p className="text-sm text-muted-foreground">Loading Orasync...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className={`flex h-screen bg-background ${isDark ? "dark" : ""}`}>
      <Sidebar />
      <div className="w-full flex flex-1 flex-col">
        <header className="h-16 border-b border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 backdrop-blur-sm sticky top-0 z-40">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-background to-background/50 text-foreground">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
