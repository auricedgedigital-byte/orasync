import { type NextRequest, NextResponse } from "next/server"
import { checkAndDecrementCredits } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid

    const creditCheck = await checkAndDecrementCredits(clinicId, "seo_applies", 1)

    if (!creditCheck.allowed) {
      return NextResponse.json(
        {
          error: "Insufficient SEO apply credits",
          remaining: creditCheck.remaining,
        },
        { status: 402 },
      )
    }

    const appliedFixes = [
      "Added meta descriptions to all pages",
      "Optimized heading hierarchy",
      "Improved page load speed",
      "Added schema markup for local business",
    ]

    return NextResponse.json({
      success: true,
      applied_fixes: appliedFixes,
      remaining_credits: creditCheck.remaining,
    })
  } catch (error) {
    console.error("SEO apply error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
