"use client"

import { useCallback, useRef } from "react"

export interface MetricInteractionConfig {
  sectionId: string
  scrollBehavior?: "smooth" | "auto"
  onInteract?: () => void
}

export function useMetricInteraction(config: MetricInteractionConfig) {
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleMetricClick = useCallback(() => {
    // Call custom handler if provided
    config.onInteract?.()

    // Scroll to section if it exists
    if (sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: config.scrollBehavior || "smooth",
          block: "start",
        })
      }, 100)
    }
  }, [config])

  return { handleMetricClick, sectionRef }
}
