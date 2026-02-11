// AI Service Integration for OraSync
// Production-ready with multiple provider support

import { Pool } from "pg"
import { queryClinicMemory, storeClinicMemory } from "./agent/memory"

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

// Main AI generation function
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
  } = {}
) {
  const {
    systemPrompt = SYSTEM_PROMPTS.nova,
    context = "",
    maxTokens = 500,
    temperature = 0.7,
    provider = (process.env.AI_PROVIDER as keyof typeof AI_PROVIDERS) || "together_free",
    clinicId,
    userId,
  } = options

  // Get API key
  const apiKey = getProviderApiKey(provider)
  if (!apiKey && provider !== "together_free") {
    throw new Error(`API key required for provider: ${provider}`)
  }

  const providerConfig = AI_PROVIDERS[provider]

  // Build full prompt with context
  const fullPrompt = context
    ? `Context: ${context}\n\nUser: ${prompt}`
    : prompt

  try {
    // Make API call
    const response = await fetch(providerConfig.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: providerConfig.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: fullPrompt },
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`AI API error: ${error}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ""
    const tokensUsed = data.usage?.total_tokens || estimateTokens(fullPrompt + text)
    const cost = calculateCost(tokensUsed, provider)

    // Log AI usage if clinicId provided
    if (clinicId) {
      await logAIUsage(clinicId, userId, prompt, text, tokensUsed, cost, provider)
    }

    return {
      text,
      tokensUsed,
      cost,
      provider: providerConfig.name,
    }
  } catch (error) {
    console.error("AI generation error:", error)
    // Return fallback response
    return {
      text: generateFallbackResponse(prompt),
      tokensUsed: 0,
      cost: 0,
      provider: "fallback",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Log AI usage to database
async function logAIUsage(
  clinicId: string,
  userId: string | undefined,
  prompt: string,
  response: string,
  tokens: number,
  cost: number,
  provider: string
) {
  try {
    await pool.query(
      `INSERT INTO usage_logs (clinic_id, user_id, action_type, amount, details, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        clinicId,
        userId || null,
        "ai_suggestion",
        tokens,
        JSON.stringify({
          provider,
          cost,
          prompt_preview: prompt.substring(0, 100),
          response_preview: response.substring(0, 100),
        }),
      ]
    )
  } catch (error) {
    console.error("Failed to log AI usage:", error)
  }
}

// Get API key from environment
function getProviderApiKey(provider: string): string {
  const keyMap: Record<string, string> = {
    together_free: process.env.TOGETHER_API_KEY || "",
    together_paid: process.env.TOGETHER_API_KEY || "",
    openai: process.env.OPENAI_API_KEY || "",
    opencode_free: process.env.OPENCODE_API_KEY || "",
    opencode_paid: process.env.OPENCODE_API_KEY || "",
  }
  return keyMap[provider] || ""
}

// Generate fallback responses when AI fails
function generateFallbackResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()

  if (lowerPrompt.includes("reactivat") || lowerPrompt.includes("haven't visit")) {
    return "Hi! We noticed it's been a while since your last visit. Regular checkups are important for maintaining your oral health. We'd love to see you again - would you like to schedule an appointment?"
  }

  if (lowerPrompt.includes("reminder") || lowerPrompt.includes("appointment")) {
    return "This is a friendly reminder of your upcoming dental appointment. Please arrive 10 minutes early. If you need to reschedule, please call us as soon as possible."
  }

  if (lowerPrompt.includes("review") || lowerPrompt.includes("feedback")) {
    return "Thank you for trusting us with your dental care! If you had a positive experience, we'd appreciate a brief review. It helps other patients find quality dental care."
  }

  if (lowerPrompt.includes("campaign") || lowerPrompt.includes("suggest")) {
    return "I'd recommend starting with a reactivation campaign targeting patients who haven't visited in 6-12 months. This typically yields 15-25% response rates and can generate significant revenue."
  }

  return "I'm here to help! What can I assist you with today?"
}

// Structured action generator for AI agent tools
export async function generateStructuredAction(
  userInput: string,
  context: {
    clinicId: string
    userId?: string
    currentCredits?: any
    recentCampaigns?: any[]
  }
) {
  const systemPrompt = `${SYSTEM_PROMPTS.nova}

When the user wants to perform an action, respond with a structured JSON action plan in this format:
{
  "action": "action_name",
  "parameters": { ...action-specific params },
  "explain": "human-readable explanation of what will happen",
  "estimated_credits": { "type": "amount", ... },
  "requires_confirmation": true/false
}

Available actions:
- create_campaign: Create a new reactivation campaign
- start_campaign: Start an existing campaign
- create_order: Purchase credit pack
- send_message: Send a message to a patient
- schedule_appointment: Book an appointment
- import_leads: Import patient list

Always estimate credit costs when applicable. Never proceed without user confirmation for purchases or bulk sends.`

  // Retrieve clinic memory for context
  const memory = await queryClinicMemory(context.clinicId, userInput)
  const memoryContext = memory.length > 0
    ? `\nRelevant clinic history: ${JSON.stringify(memory)}`
    : ""

  const fullContext = JSON.stringify(context) + memoryContext
  const response = await generateAIResponse(userInput, {
    systemPrompt,
    context: fullContext,
    provider: "together_free",
    clinicId: context.clinicId,
    userId: context.userId,
  })

  try {
    // Try to parse structured JSON from response
    const jsonMatch = response.text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const action = JSON.parse(jsonMatch[0])
      return {
        ...response,
        structured: action,
      }
    }
  } catch {
    // If JSON parsing fails, return text response
  }

  return response
}

// Patient reactivation message generator
export async function generateReactivationMessage(
  patient: {
    firstName: string
    lastName: string
    lastVisit?: string
    lastTreatment?: string
  },
  clinicId: string
) {
  const prompt = `Generate a personalized reactivation message for ${patient.firstName} ${patient.lastName}${patient.lastVisit ? ` who last visited on ${patient.lastVisit}` : ''}${patient.lastTreatment ? ` for ${patient.lastTreatment}` : ''}.`

  return generateAIResponse(prompt, {
    systemPrompt: SYSTEM_PROMPTS.reactivation,
    provider: "together_free",
    clinicId,
  })
}

// Appointment reminder generator
export async function generateAppointmentReminder(
  appointment: {
    patientName: string
    date: string
    time: string
    treatment: string
  },
  clinicId: string
) {
  const prompt = `Create an appointment reminder for ${appointment.patientName} scheduled for ${appointment.treatment} on ${appointment.date} at ${appointment.time}.`

  return generateAIResponse(prompt, {
    systemPrompt: SYSTEM_PROMPTS.reminder,
    provider: "together_free",
    clinicId,
  })
}

// Review request generator
export async function generateReviewRequest(
  patient: {
    firstName: string
    treatment?: string
  },
  clinicId: string
) {
  const prompt = `Write a review request for ${patient.firstName}${patient.treatment ? ` who recently had ${patient.treatment}` : ''}.`

  return generateAIResponse(prompt, {
    systemPrompt: SYSTEM_PROMPTS.review,
    maxTokens: 200,
    provider: "together_free",
    clinicId,
  })
}

// Analytics insight generator
export async function generateAnalyticsInsight(
  data: {
    patientCount: number
    reactivationRate: number
    avgRevenue: number
    campaignCount: number
  },
  clinicId: string
) {
  const prompt = `Analyze this practice data: ${data.patientCount} patients, ${data.reactivationRate}% reactivation rate, $${data.avgRevenue} average revenue, ${data.campaignCount} campaigns run. Provide 3 actionable insights.`

  return generateAIResponse(prompt, {
    systemPrompt: SYSTEM_PROMPTS.analytics,
    provider: "together_free",
    clinicId,
  })
}

// Chatbot response generator
export async function generateChatbotResponse(
  message: string,
  context: {
    clinicId: string
    patientName?: string
    conversationHistory?: string[]
  }
) {
  const historyContext = context.conversationHistory
    ? `Previous messages: ${context.conversationHistory.join('\n')}\n\n`
    : ''

  const prompt = `${historyContext}Patient message: ${message}`

  return generateAIResponse(prompt, {
    systemPrompt: SYSTEM_PROMPTS.chatbot,
    context: context.patientName ? `Patient name: ${context.patientName}` : undefined,
    maxTokens: 300,
    provider: "together_free",
    clinicId: context.clinicId,
  })
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
