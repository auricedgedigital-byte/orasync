import { AIRequest, AIResponse, AIProvider } from "./types/ai.types"
import { novaRouter } from "./core/router"
import { QuotaManager } from "./core/quota"
import { Pool } from "pg"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("supabase") ? { rejectUnauthorized: false } : undefined,
})

export class NovaOrchestrator {
    private quotaManager = new QuotaManager(pool)

    async run(request: AIRequest): Promise<AIResponse> {
        const requestId = Math.random().toString(36).substring(7)

        // 1. Select initial provider
        let provider = novaRouter.selectProvider(request)

        try {
            // 2. Budget check (Pre-flight)
            const estimatedTokens = provider.estimateTokens(request.prompt)
            const hasQuota = await this.quotaManager.checkQuota(request.clinic_id, estimatedTokens, request.quality || "cheap")

            if (!hasQuota && request.quality !== "cheap") {
                // Try falling back to cheap model if premium quota is out
                provider = novaRouter.selectProvider({ ...request, quality: "cheap" })
            }

            // 3. Execution with fallback loop
            let response: AIResponse
            try {
                response = await provider.run(request)
            } catch (error) {
                console.error(`Provider ${provider.name} failed, trying fallback...`, error)

                // Circuit breaker / manual fallback to another provider
                const fallbacks = novaRouter.getFallbackChain(provider.name)
                if (fallbacks.length === 0) throw error

                provider = fallbacks[0]
                response = await provider.run(request)
            }

            // 4. Update usage logs and decrement balance
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
