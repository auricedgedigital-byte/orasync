export type AIQuality = "cheap" | "balanced" | "premium" | "auto"

export interface AIProvider {
    name: string
    model: string
    estimateTokens(prompt: string): number
    estimateCost(tokens: number): number
    run(params: AIRequest): Promise<AIResponse>
}

export interface AIRequest {
    clinic_id: string
    user_id?: string
    task_type: string
    prompt: string
    context?: string[]
    quality?: AIQuality
    max_tokens?: number
    temperature?: number
}

export interface AIResponse {
    request_id: string
    result: string
    provider: string
    model: string
    quality_used: AIQuality
    tokens_used: number
    cost_actual: number
    cached?: boolean
    error?: string
}

export interface ClinicBalances {
    cheap: number
    premium: number
}

export interface ProviderHealth {
    name: string
    consecutiveFailures: number
    lastFailureAt?: Date
    isHealthy: boolean
}
