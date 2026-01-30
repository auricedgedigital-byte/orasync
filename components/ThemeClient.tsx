"use client"

import { useEffect, useState } from "react"

export default function ThemeClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Guard access to `document`
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    
    setMounted(true)
  }, [])

  // Render children always — but you can add UI that depends on `isDark` safely after mounted
  return <div data-theme={isDark ? "dark" : "light"}>{children}</div>
}