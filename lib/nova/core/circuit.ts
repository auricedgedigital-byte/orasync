import { AIProvider } from "../types/ai.types"

interface ProviderStats {
    failureCount: number
    lastFailureTime: number | null
    status: "open" | "closed" | "half-open"
}

export class CircuitBreaker {
    private stats: Map<string, ProviderStats> = new Map()
    private readonly threshold = 3
    private readonly resetTimeout = 60000 // 1 minute

    getStatus(providerName: string): ProviderStats {
        if (!this.stats.has(providerName)) {
            this.stats.set(providerName, {
                failureCount: 0,
                lastFailureTime: null,
                status: "closed"
            })
        }
        return this.stats.get(providerName)!
    }

    isOpen(providerName: string): boolean {
        const stat = this.getStatus(providerName)

        if (stat.status === "open" && stat.lastFailureTime) {
            const now = Date.now()
            if (now - stat.lastFailureTime > this.resetTimeout) {
                stat.status = "half-open"
                return false
            }
            return true
        }

        return stat.status === "open"
    }

    recordSuccess(providerName: string) {
        const stat = this.getStatus(providerName)
        stat.failureCount = 0
        stat.status = "closed"
        stat.lastFailureTime = null
    }

    recordFailure(providerName: string) {
        const stat = this.getStatus(providerName)
        stat.failureCount++
        stat.lastFailureTime = Date.now()

        if (stat.failureCount >= this.threshold) {
            stat.status = "open"
            console.warn(`Circuit breaker OPEN for provider: ${providerName}`)
        }
    }
}

export const novaCircuit = new CircuitBreaker()
