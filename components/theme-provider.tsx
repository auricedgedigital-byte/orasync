"use client"

import type React from "react"
import { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light")

    // Apply the theme to the HTML element
    const html = document.documentElement
    if (initialTheme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }

    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <>{children}</>
}
