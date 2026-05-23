"use client"

import type React from "react"
import { useEffect } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const initialTheme = savedTheme || (prefersDark ? "dark" : "light")

      const html = document.documentElement
      if (initialTheme === "dark") {
        html.classList.add("dark")
      } else {
        html.classList.remove("dark")
      }
    }
  }, [])

  return <>{children}</>
}
