import { AIProvider, AIRequest, AIResponse } from "../types/ai.types"

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

export const OpenRouterProvider: AIProvider = {
    name: "openrouter",
    model: "gpt-4o-mini",

    estimateTokens(prompt: string): number {
        return Math.ceil(prompt.length / 4)
    },

    estimateCost(tokens: number): number {
        // Approx $0.0001 per 1K tokens for mini models
        return (tokens / 1000) * 0.0001
    },

    async run(params: AIRequest): Promise<AIResponse> {
        const apiKey = process.env.OPENROUTER_API_KEY
        if (!apiKey) {
            throw new Error("OPENROUTER_API_KEY is not defined")
        }

        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://orasync.site",
                "X-Title": "Orasync Nova"
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    ...(params.context ? [{ role: "system", content: params.context.join("\n") }] : []),
                    { role: "user", content: params.prompt }
                ],
                max_tokens: params.max_tokens || 500,
                temperature: params.temperature || 0.7
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`OpenRouter API error: ${errorText}`)
        }

        const data = await response.json()

        return {
            request_id: data.id || Math.random().toString(36).substring(7),
            result: data.choices[0]?.message?.content || "",
            provider: this.name,
            model: this.model,
            quality_used: "cheap",
            tokens_used: data.usage?.total_tokens || this.estimateTokens(params.prompt),
            cost_actual: this.estimateCost(data.usage?.total_tokens || 0)
        }
    }
}
