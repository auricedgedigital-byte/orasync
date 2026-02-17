"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import Sidebar from "./sidebar"
import { Header } from "@/components/orasync/header"
import { NovaAssistant } from "@/components/orasync/onboarding/nova-assistant"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const { user, loading } = useUser()
  const [mounted, setMounted] = useState(false)

  // Use this to prevent hydration mismatch for dark mode if needed
  // But strictly, we are using Tailwind v4 which handles .dark class on html
  // We just need to ensure we don't flash content before auth check

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-medium animate-pulse">Loading Orasync...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Optional: Redirect handling implies this layout is protected
    router.push('/auth/login')
    return null
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-ai-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Sidebar (Fixed Left) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
        {/* Header (Fixed Top) */}
        <Header />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* Global AI Assistant Overlay */}
      <NovaAssistant />
    </div>
  )
}
