"use client"

import { useCallback } from "react"

export function useScrollToSection() {
  const scrollToSection = useCallback((sectionId: string, delay = 300) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
        // Add a highlight effect
        element.classList.add("ring-2", "ring-primary", "rounded-lg")
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-primary", "rounded-lg")
        }, 2000)
      }
    }, delay)
  }, [])

  return { scrollToSection }
}
