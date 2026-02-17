import { type NextRequest, NextResponse } from "next/server"
import { checkAndDecrementCredits, logUsage } from "@/lib/db"
import { generateAIResponse } from "@/lib/ai-service"

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const body = await request.json()
    const { count = 1, context = "", user_id } = body

    // 1. Credit Check
    const creditCheck = await checkAndDecrementCredits(clinicId, "ai_suggestions", count, user_id)

    if (!creditCheck.allowed) {
      return NextResponse.json(
        {
          error: "Insufficient AI suggestion credits",
          remaining: creditCheck.remaining,
        },
        { status: 402 },
      )
    }

    // 2. Real AI Generation
    const prompt = `Generate ${count} actionable growth suggestions for a dental clinic. ${context ? `Context: ${context}` : ""}`
    const aiResponse = await generateAIResponse(prompt, {
      clinicId,
      userId: user_id,
      systemPrompt: "You are Nova, Orasync's AI Growth Engine. Provide brief, actionable, revenue-focused suggestions for a dental clinic dashboard.",
      quality: "cheap"
    })

    const suggestions = aiResponse.text
      .split("\n")
      .filter((line: string) => line.trim().length > 0)
      .slice(0, count)

    // 3. Log Usage (Already handled inside generateAIResponse/Nova, but keeping lib/db log for double audit if needed)
    await logUsage(clinicId, user_id || null, "ai_suggestions", count, undefined, {
      context,
      ai_request_id: aiResponse.requestId
    })

    return NextResponse.json({
      success: true,
      suggestions: suggestions.length > 0 ? suggestions : ["Refine patient reactivation campaign", "Monitor review trends"],
      remaining_credits: creditCheck.remaining,
    })
  } catch (error) {
    console.error("AI suggest error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
