import { type NextRequest, NextResponse } from "next/server"
import { checkAndDecrementCredits, logUsage } from "@/lib/db"
import { generateAdCreative, type AdCreativeRequest } from "@/lib/nova/specialized/ad-creative"

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const body = await request.json()
    const { 
      goal, 
      target_audience, 
      platforms = ["facebook", "instagram"], 
      confirm = false,
      user_id 
    } = body

    if (!goal || !target_audience) {
      return NextResponse.json(
        { error: "Missing required fields: goal, target_audience" },
        { status: 400 }
      )
    }

    const estimatedTokens = Math.ceil((goal.length + target_audience.length) * 1.5)
    const estimatedCost = Math.ceil(estimatedTokens / 100)

    if (!confirm) {
      return NextResponse.json({
        requires_confirmation: true,
        estimate: {
          tokens: estimatedTokens,
          credits_cost: estimatedCost,
          description: "This will generate ad copy and image prompts for your campaign"
        },
        message: "Would you like to proceed? This will consume AI credits."
      })
    }

    const creditCheck = await checkAndDecrementCredits(
      clinicId, 
      "ai_suggestions", 
      estimatedCost, 
      user_id
    )

    if (!creditCheck.allowed) {
      return NextResponse.json(
        {
          error: "Insufficient AI credits",
          remaining: creditCheck.remaining,
        },
        { status: 402 }
      )
    }

    const adRequest: AdCreativeRequest = {
      clinic_id: clinicId,
      user_id,
      goal,
      target_audience,
      platforms
    }

    const result = await generateAdCreative(adRequest)

    await logUsage(
      clinicId, 
      user_id || null, 
      "ai_suggestions", 
      estimatedCost, 
      undefined, 
      {
        task_type: "ad_creative",
        goal,
        platforms
      }
    )

    return NextResponse.json({
      success: true,
      ad_creative: result,
      credits_used: estimatedCost,
      remaining_credits: creditCheck.remaining,
    })
  } catch (error) {
    console.error("Ad Creative error:", error)
    return NextResponse.json(
      { error: "Failed to generate ad creative" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const goal = searchParams.get("goal")
    const target_audience = searchParams.get("target_audience")
    const platforms = searchParams.get("platforms")?.split(",") || ["facebook", "instagram"]

    if (!goal || !target_audience) {
      return NextResponse.json(
        { error: "Missing required query params: goal, target_audience" },
        { status: 400 }
      )
    }

    const estimatedTokens = Math.ceil((goal.length + target_audience.length) * 1.5)
    const estimatedCost = Math.ceil(estimatedTokens / 100)

    return NextResponse.json({
      requires_confirmation: true,
      estimate: {
        tokens: estimatedTokens,
        credits_cost: estimatedCost,
        description: "This will generate ad copy and image prompts for your campaign"
      },
      message: "POST to this endpoint with confirm: true to execute"
    })
  } catch (error) {
    console.error("Ad Creative estimate error:", error)
    return NextResponse.json(
      { error: "Failed to estimate ad creative cost" },
      { status: 500 }
    )
  }
}
