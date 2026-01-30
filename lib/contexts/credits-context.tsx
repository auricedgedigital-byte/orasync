"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type { ReactNode } from "react"

interface CreditsContextType {
    credits: {
        emails: number
        sms: number
        campaigns: number
    }
    plan: "Free" | "Starter" | "Growth"
    refreshCredits: () => Promise<void>
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

export function CreditsProvider({ children }: { children: ReactNode }) {
    // In a real app, this would fetch from /api/credits
    const [credits, setCredits] = useState({
        emails: 150,
        sms: 25,
        campaigns: 1
    })
    const [plan] = useState<"Free" | "Starter" | "Growth">("Free")

    const refreshCredits = async () => {
        // Simulate refresh
        console.log("Refreshing credits...")
    }

    return (
        <CreditsContext.Provider value={{ credits, plan, refreshCredits }}>
            {children}
        </CreditsContext.Provider>
    )
}

export function useCredits() {
    const context = useContext(CreditsContext)
    if (context === undefined) {
        throw new Error("useCredits must be used within a CreditsProvider")
    }
    return context
}
