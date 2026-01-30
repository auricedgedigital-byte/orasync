import { type NextRequest, NextResponse } from "next/server"
import { checkAndDecrementCredits, getTrialCreditsWithDefaults } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const amount = searchParams.get("amount")

    const clinicId = params.cid

    if (!action || !amount) {
      const credits = await getTrialCreditsWithDefaults(clinicId)
      if (!credits) {
        return NextResponse.json({ error: "Failed to fetch trial credits" }, { status: 500 })
      }
      return NextResponse.json({ allowed: true, remaining: credits })
    }

    const amountNum = Number.parseInt(amount, 10)

    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const result = await checkAndDecrementCredits(clinicId, action, amountNum)

    if (!result.allowed) {
      return NextResponse.json(
        {
          allowed: false,
          error: result.error,
          remaining: result.remaining,
        },
        { status: 402 },
      )
    }

    return NextResponse.json({
      allowed: true,
      remaining: result.remaining,
    })
  } catch (error) {
    console.error("Trial check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
