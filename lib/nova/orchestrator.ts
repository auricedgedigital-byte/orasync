import { AIRequest, AIResponse, AIProvider } from "./types/ai.types"
import { novaRouter } from "./core/router"
import { QuotaManager } from "./core/quota"
import { Pool } from "pg"
import { novaCircuit } from "./core/circuit"
import { novaCache } from "./core/cache"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("supabase") ? { rejectUnauthorized: false } : undefined,
})

export class NovaOrchestrator {
    private quotaManager = new QuotaManager(pool)

    async run(request: AIRequest): Promise<AIResponse> {
        const requestId = Math.random().toString(36).substring(7)

        // 1. Check Cache
        const cacheKey = novaCache.generateKey(request.prompt, request.context)
        const cachedResponse = novaCache.get(cacheKey)
        if (cachedResponse) {
            console.log("Nova: Returning cached response", requestId)
            return {
                ...cachedResponse,
                request_id: requestId,
                is_cached: true
            }
        }

        // 2. Select initial provider
        let provider = novaRouter.selectProvider(request)

        // 3. Circuit Breaker Check
        if (novaCircuit.isOpen(provider.name)) {
            console.warn(`Nova: Provider ${provider.name} circuit is open, rotating...`)
            const fallbacks = novaRouter.getFallbackChain(provider.name)
            if (fallbacks.length > 0) {
                provider = fallbacks[0]
            }
        }

        try {
            // 4. Budget check (Pre-flight)
            const estimatedTokens = provider.estimateTokens(request.prompt)
            const hasQuota = await this.quotaManager.checkQuota(request.clinic_id, estimatedTokens, request.quality || "cheap")

            if (!hasQuota && request.quality !== "cheap") {
                // Try falling back to cheap model if premium quota is out
                provider = novaRouter.selectProvider({ ...request, quality: "cheap" })
            }

            // 5. Execution with fallback loop
            let response: AIResponse
            try {
                response = await provider.run(request)
                novaCircuit.recordSuccess(provider.name)
            } catch (error) {
                novaCircuit.recordFailure(provider.name)
                console.error(`Provider ${provider.name} failed, trying fallback...`, error)

                const fallbacks = novaRouter.getFallbackChain(provider.name)
                if (fallbacks.length === 0) throw error

                provider = fallbacks[0]
                response = await provider.run(request)
            }

            // 6. Update usage logs and decrement balance
            await this.quotaManager.consumeQuota(
                request.clinic_id,
                request.user_id,
                response.tokens_used,
                response.quality_used,
                {
                    request_id: requestId,
                    provider: response.provider,
                    model: response.model,
                    task_type: request.task_type,
                    cost_actual: response.cost_actual
                }
            )

            // 7. Store in Cache
            novaCache.set(cacheKey, response)

            return {
                ...response,
                request_id: requestId
            }

        } catch (error) {
            console.error("Nova Orchestrator Error:", error)
            return {
                request_id: requestId,
                result: "I'm sorry, I'm having trouble processing that right now. Please try again or check your credit balance.",
                provider: "error",
                model: "none",
                quality_used: "cheap",
                tokens_used: 0,
                cost_actual: 0,
                error: error instanceof Error ? error.message : "Unknown error"
            }
        }
    }
}

export const nova = new NovaOrchestrator()
