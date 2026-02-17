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
        "default": ["googleai", "openrouter"]
    }

    selectProvider(request: AIRequest): AIProvider {
        const quality = request.quality || "auto"
        const taskType = request.task_type || "default"
        const fallbackChain = this.taskMappings[taskType] || this.taskMappings["default"]

        // Rule 1: Explicit quality request
        if (quality === "premium") {
            // Find the first provider in the chain that can handle premium (Google AI in our case)
            return this.providers["googleai"]
        }

        if (quality === "cheap") {
            return this.providers["openrouter"]
        }

        // Rule 2: Dynamic selection based on task and health (simplified health here)
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
