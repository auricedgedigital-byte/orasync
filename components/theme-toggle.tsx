"use client"

import * as React from "react"
import { Moon, Sun } from "@/components/icons"

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const [theme, setTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light")

    setTheme(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)
  }, [])

  const applyTheme = (newTheme: "light" | "dark") => {
    const html = document.documentElement
    if (newTheme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
    localStorage.setItem("theme", newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-all dark:hidden" />
      <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-all hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
