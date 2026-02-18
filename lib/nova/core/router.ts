import { AIRequest, AIProvider, AIQuality } from "../types/ai.types"
import { OpenRouterProvider } from "../providers/openrouter"
import { GoogleAIProvider } from "../providers/googleai"

export class Router {
    private providers: Record<string, AIProvider> = {
        openrouter: OpenRouterProvider,
        googleai: GoogleAIProvider
    }

    // Map task types to preferred providers
    private taskMappings: Record<string, string[]> = {
        "classification": ["openrouter", "googleai"],
        "generate_email": ["googleai", "openrouter"],
        "marketing_strategy": ["googleai", "openrouter"],
        "analytics_insight": ["googleai", "openrouter"],
        "chatbot_response": ["openrouter", "googleai"],
        "ad_creative": ["googleai"],
        "clinical_soap": ["googleai"],
        "default": ["googleai", "openrouter"]
    }

    private isComplexRequest(request: AIRequest): boolean {
        // High token count or specific specialized tasks
        const totalTokens = (request.prompt?.length || 0) / 4 + (request.max_tokens || 1000)
        const specializedTasks = ["ad_creative", "clinical_soap", "analytics_insight"]

        return totalTokens > 3000 || specializedTasks.includes(request.task_type)
    }

    selectProvider(request: AIRequest): AIProvider {
        const quality = request.quality || "auto"
        const taskType = request.task_type || "default"
        const fallbackChain = this.taskMappings[taskType] || this.taskMappings["default"]

        // Rule 1: Explicit quality request
        if (quality === "premium") {
            return this.providers["googleai"]
        }

        if (quality === "cheap") {
            return this.providers["openrouter"]
        }

        // Rule 2: Complexity-based routing override (Auto mode)
        if (quality === "auto" && this.isComplexRequest(request)) {
            console.log(`NovaRouter: Routing complex task ${taskType} to premium provider`)
            return this.providers["googleai"]
        }

        // Rule 3: Dynamic selection based on task and health
        for (const providerName of fallbackChain) {
            const provider = this.providers[providerName]
            if (provider) return provider
        }

        return this.providers["googleai"] // Universal fallback
    }

    getFallbackChain(currentProviderName: string): AIProvider[] {
        const allProviders = Object.values(this.providers)
        return allProviders.filter(p => p.name !== currentProviderName)
    }
}

export const novaRouter = new Router()
