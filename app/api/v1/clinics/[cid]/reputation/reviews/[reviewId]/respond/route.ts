import { type NextRequest, NextResponse } from "next/server"
import { respondToReview, getReviewsNeedingAttention } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: { cid: string; reviewId: string } }
) {
  try {
    const clinicId = params.cid
    const reviewId = params.reviewId
    const body = await request.json()
    const { response_text, user_id } = body

    if (!response_text) {
      return NextResponse.json(
        { error: "Missing required field: response_text" },
        { status: 400 }
      )
    }

    const updated = await respondToReview(reviewId, user_id, response_text)

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to respond to review" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      review: updated
    })
  } catch (error) {
    console.error("Respond to review error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
