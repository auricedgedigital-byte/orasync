import { nova } from "../orchestrator"
import { AIResponse } from "../types/ai.types"

export interface AdCreativeRequest {
    clinic_id: string
    user_id?: string
    goal: string
    target_audience: string
    platforms: string[]
}

export interface AdCreativeResult {
    copies: { platform: string; text: string }[]
    image_prompt: string
    suggested_visuals: string
}

export async function generateAdCreative(params: AdCreativeRequest): Promise<AdCreativeResult> {
    const prompt = `
        You are an expert dental marketing specialist. 
        Create 3 variations of ad copy for a practice with the following goal: "${params.goal}".
        Target Audience: "${params.target_audience}".
        Platforms: ${params.platforms.join(", ")}.

        Also, generate a high-quality descriptive prompt for an image generator (like Stable Diffusion) that would complement these ads. 
        The visual should be premium, professional, and trustworthy.

        Return the response in the following JSON format:
        {
            "copies": [{"platform": "...", "text": "..."}],
            "image_prompt": "...",
            "suggested_visuals": "..."
        }
    `

    const response: AIResponse = await nova.run({
        clinic_id: params.clinic_id,
        user_id: params.user_id,
        task_type: "ad_creative",
        prompt: prompt,
        quality: "premium" // Ads need high quality
    })

    try {
        // Find JSON block in the response
        const jsonMatch = response.result.match(/\{[\s\S]*\}/)
        if (!jsonMatch) throw new Error("Could not parse AI response as JSON")
        return JSON.parse(jsonMatch[0])
    } catch (e) {
        console.error("Ad Creative Parsing Error:", e)
        return {
            copies: [{ platform: "General", text: response.result }],
            image_prompt: "Dental office interior, premium lighting, bokeh background",
            suggested_visuals: "Professional dental equipment or a smiling patient"
        }
    }
}
