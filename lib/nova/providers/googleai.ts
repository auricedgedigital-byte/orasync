import { AIProvider, AIRequest, AIResponse } from "../types/ai.types"

export const GoogleAIProvider: AIProvider = {
    name: "googleai",
    model: "gemini-1.5-flash", // Default to flash for efficiency, can override

    estimateTokens(prompt: string): number {
        return Math.ceil(prompt.length / 4)
    },

    estimateCost(tokens: number): number {
        // Gemini 1.5 Flash is highly cost-efficient, approx $0.00002 per 1K tokens
        return (tokens / 1000) * 0.00002
    },

    async run(params: AIRequest): Promise<AIResponse> {
        const apiKey = process.env.GOOGLE_AI_STUDIO_KEY
        if (!apiKey) {
            throw new Error("GOOGLE_AI_STUDIO_KEY is not defined")
        }

        const modelName = params.quality === "premium" ? "gemini-1.5-pro" : "gemini-1.5-flash"
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    ...(params.context ? [{ role: "user", parts: [{ text: `Instructions: ${params.context.join("\n")}` }] }] : []),
                    { role: "user", parts: [{ text: params.prompt }] }
                ],
                generationConfig: {
                    maxOutputTokens: params.max_tokens || 500,
                    temperature: params.temperature || 0.7
                }
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Google AI Studio error: ${errorText}`)
        }

        const data = await response.json()
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

        // Google doesn't always return usage in the same format, estimating if missing
        const tokensUsed = data.usageMetadata?.totalTokenCount || this.estimateTokens(params.prompt + resultText)

        return {
            request_id: Math.random().toString(36).substring(7),
            result: resultText,
            provider: this.name,
            model: modelName,
            quality_used: params.quality === "premium" ? "premium" : "cheap",
            tokens_used: tokensUsed,
            cost_actual: this.estimateCost(tokensUsed)
        }
    }
}
