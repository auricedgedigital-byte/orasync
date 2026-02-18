// AI Service Integration for OraSync
// Production-ready with multiple provider support

import { Pool } from "pg"
import { queryClinicMemory, storeClinicMemory } from "./agent/memory"
import { nova } from "./nova/orchestrator"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("supabase") ? { rejectUnauthorized: false } : undefined,
})

// AI Provider configurations
export const AI_PROVIDERS = {
  together_free: {
    name: "Together AI (Free)",
    model: "meta-llama/Llama-3.2-3B-Instruct",
    apiUrl: "https://api.together.xyz/v1/chat/completions",
    costPer1KTokens: 0,
    rateLimit: "60 RPM",
    hipaaCompliant: false,
  },
  together_paid: {
    name: "Together AI",
    model: "meta-llama/Llama-3.3-70B-Instruct",
    apiUrl: "https://api.together.xyz/v1/chat/completions",
    costPer1KTokens: 0.0008,
    hipaaCompliant: false,
  },
  openai: {
    name: "OpenAI",
    model: "gpt-4o-mini",
    apiUrl: "https://api.openai.com/v1/chat/completions",
    costPer1KTokens: 0.0005,
    hipaaCompliant: false,
  },
  opencode_free: {
    name: "OpenCode Zen (Free)",
    model: "kimi-k2.5-free",
    apiUrl: "https://opencode.ai/zen/v1/chat/completions",
    costPer1KTokens: 0,
    rateLimit: "20 RPM",
    hipaaCompliant: false,
  },
  opencode_paid: {
    name: "OpenCode Zen",
    model: "kimi-k2.5",
    apiUrl: "https://opencode.ai/zen/v1/chat/completions",
    costPer1KTokens: 0.6,
    hipaaCompliant: false,
  },
}

// System prompts for different AI agents
export const SYSTEM_PROMPTS = {
  nova: `You are Nova, Orasync's AI Revenue Engine for Dental Practices. Your primary goal is to fill empty chairs automatically and maximize clinic ROI. 

- Position all interactions around revenue growth, chair occupancy, and patient lifetime value (LTV).
- When discussing costs, frame them as investments: "This campaign costs $20 in credits but is projected to generate $1,500 - $4,000 in chair-time revenue."
- Help dentists re-engage lost patients, optimize their schedule, and reclaim 5-15 hours of staff time per week.
- For every action, return a structured action JSON with "action", "parameters", and "explain" fields (explain why this fills chairs).
- Be a proactive partner in growth, not just a tool. Use a professional, ROI-focused dental-office tone.
- Never perform payments without explicit user confirmation via UI.
- Use the tool layer to execute actions; do not call external APIs directly.
- Do not provide medical advice.`,

  reactivation: `You are a dental patient reactivation specialist. Create personalized, empathetic messages to re-engage patients who haven't visited in 6+ months.

Guidelines:
- Be warm and professional, not pushy
- Mention the importance of regular checkups for oral health
- Include a clear call-to-action to schedule
- Keep messages under 150 words for SMS, under 300 for email
- Personalize with patient name and reference their last visit type if known`,

  reminder: `You are a dental appointment reminder assistant. Create friendly, helpful reminders.

Guidelines:
- Confirm appointment date, time, and location
- Include preparation instructions if needed
- Provide rescheduling contact info
- Keep it concise and professional
- Express excitement about seeing the patient`,

  review: `You are a dental practice review request specialist. Create polite, effective review requests.

Guidelines:
- Thank the patient for choosing the practice
- Mention specific treatment or experience if known
- Make it easy to leave a review (provide link)
- Keep it under 100 words
- Don't be pushy - one gentle request is enough`,

  chatbot: `You are a helpful dental practice assistant chatbot named Nova. Answer patient questions about services, insurance, appointments, and general dental care.

Guidelines:
- Be friendly, professional, and welcoming
- Provide accurate general dental information
- Do not diagnose or give medical advice - always suggest consulting the dentist
- For appointments: offer to schedule or provide scheduling link
- For emergencies: recommend calling the office immediately
- For insurance questions: give general info but suggest verifying with their provider
- If unsure: say "Let me connect you with our team" and offer to have staff call them`,

  onboarding: `You are Nova, the Orasync onboarding assistant. Guide new dental practices through setup.

Goals:
1. Collect essential practice info (hours, timezone, services)
2. Help import patient list
3. Suggest first reactivation campaign
4. Show how to use the unified inbox

Approach:
- Ask one question at a time
- Explain why each step matters
- Celebrate progress with encouraging messages
- Show estimated time savings and revenue impact
- Never overwhelm - keep it simple and actionable`,

  analytics: `You are a dental practice analytics expert. Analyze data and provide actionable insights.

Guidelines:
- Focus on trends and patterns, not just numbers
- Compare to industry benchmarks when relevant
- Suggest specific, implementable improvements
- Highlight quick wins and long-term opportunities
- Present data in accessible language (no jargon)
- Estimate revenue impact of recommended changes`,
}

// Estimate token count (rough approximation: ~4 chars per token)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Calculate cost based on tokens used
export function calculateCost(tokens: number, providerKey: string): number {
  const provider = AI_PROVIDERS[providerKey as keyof typeof AI_PROVIDERS]
  if (!provider) return 0
  return (tokens / 1000) * provider.costPer1KTokens
}

// Main AI generation function (Now powered by Nova Orchestrator)
export async function generateAIResponse(
  prompt: string,
  options: {
    systemPrompt?: string
    context?: string
    maxTokens?: number
    temperature?: number
    provider?: keyof typeof AI_PROVIDERS
    clinicId?: string
    userId?: string
    quality?: "cheap" | "balanced" | "premium" | "auto"
  } = {}
) {
  const {
    systemPrompt = SYSTEM_PROMPTS.nova,
    context = "",
    maxTokens = 500,
    temperature = 0.7,
    clinicId,
    userId,
    quality = "auto"
  } = options

  if (!clinicId) {
    throw new Error("clinicId is now required for AI orchestration")
  }

  try {
    const result = await nova.run({
      clinic_id: clinicId,
      user_id: userId,
      task_type: "general",
      prompt: prompt,
      context: [systemPrompt, context].filter(Boolean),
      quality: quality,
      max_tokens: maxTokens,
      temperature: temperature
    })

    return {
      text: result.result,
      tokensUsed: result.tokens_used,
      cost: result.cost_actual,
      provider: result.provider,
      requestId: result.request_id,
      error: result.error
    }
  } catch (error) {
    console.error("Nova call failed, falling back to basic handling:", error)
    return {
      text: generateFallbackResponse(prompt),
      tokensUsed: 0,
      cost: 0,
      provider: "fallback",
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

// Generate fallback responses when AI fails
function generateFallbackResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()
  if (lowerPrompt.includes("reactivat")) return "Hi! We noticed it's been a while since your last visit. We'd love to see you again - would you like to schedule an appointment?"
  return "I'm here to help! What can I assist you with today?"
}

// Structured action generator
export async function generateStructuredAction(
  userInput: string,
  context: {
    clinicId: string
    userId?: string
    currentCredits?: any
    recentCampaigns?: any[]
  }
) {
  const systemPrompt = `${SYSTEM_PROMPTS.nova}\n\nReturn a structured JSON action plan.`
  const response = await generateAIResponse(userInput, {
    systemPrompt,
    quality: "balanced",
    clinicId: context.clinicId,
    userId: context.userId,
  })

  try {
    const jsonMatch = response.text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return { ...response, structured: JSON.parse(jsonMatch[0]) }
  } catch { }
  return response
}

// Patient reactivation message generator
export async function generateReactivationMessage(patient: any, clinicId: string) {
  const prompt = `Generate a personalized reactivation message for ${patient.firstName} ${patient.lastName}.`
  return generateAIResponse(prompt, { systemPrompt: SYSTEM_PROMPTS.reactivation, quality: "cheap", clinicId })
}

// Appointment reminder generator
export async function generateAppointmentReminder(appointment: any, clinicId: string) {
  const prompt = `Create an appointment reminder for ${appointment.patientName}.`
  return generateAIResponse(prompt, { systemPrompt: SYSTEM_PROMPTS.reminder, quality: "cheap", clinicId })
}

// Review request generator
export async function generateReviewRequest(patient: any, clinicId: string) {
  const prompt = `Write a review request for ${patient.firstName}.`
  return generateAIResponse(prompt, { systemPrompt: SYSTEM_PROMPTS.review, quality: "cheap", clinicId })
}

// Analytics insight generator
export async function generateAnalyticsInsight(data: any, clinicId: string) {
  const prompt = `Analyze practice data and provide 3 actionable insights: ${JSON.stringify(data)}`
  return generateAIResponse(prompt, { systemPrompt: SYSTEM_PROMPTS.analytics, quality: "premium", clinicId })
}

// Chatbot response generator
export async function generateChatbotResponse(message: string, context: any) {
  const prompt = `Patient message: ${message}`
  return generateAIResponse(prompt, { systemPrompt: SYSTEM_PROMPTS.chatbot, quality: "balanced", clinicId: context.clinicId })
}

export default {
  generateAIResponse,
  generateStructuredAction,
  generateReactivationMessage,
  generateAppointmentReminder,
  generateReviewRequest,
  generateAnalyticsInsight,
  generateChatbotResponse,
  AI_PROVIDERS,
  SYSTEM_PROMPTS,
  estimateTokens,
  calculateCost,
}
