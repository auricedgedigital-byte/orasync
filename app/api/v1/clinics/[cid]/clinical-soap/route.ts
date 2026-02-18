import { type NextRequest, NextResponse } from "next/server"
import { checkAndDecrementCredits, logUsage } from "@/lib/db"
import { generateSOAPNote, type SOAPRequest } from "@/lib/nova/specialized/clinical-soap"

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid
    const body = await request.json()
    const { 
      raw_notes, 
      patient_context,
      confirm = false,
      user_id 
    } = body

    if (!raw_notes) {
      return NextResponse.json(
        { error: "Missing required field: raw_notes" },
        { status: 400 }
      )
    }

    const estimatedTokens = Math.ceil(raw_notes.length * 1.5 + (patient_context?.length || 0) * 1.5)
    const estimatedCost = Math.ceil(estimatedTokens / 100)

    if (!confirm) {
      return NextResponse.json({
        requires_confirmation: true,
        estimate: {
          tokens: estimatedTokens,
          credits_cost: estimatedCost,
          description: "This will convert your clinical notes into a structured SOAP format"
        },
        message: "Would you like to proceed? This will consume AI credits for clinical documentation."
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

    const soapRequest: SOAPRequest = {
      clinic_id: clinicId,
      user_id,
      raw_notes,
      patient_context
    }

    const result = await generateSOAPNote(soapRequest)

    await logUsage(
      clinicId, 
      user_id || null, 
      "ai_suggestions", 
      estimatedCost, 
      undefined, 
      {
        task_type: "clinical_soap",
        notes_length: raw_notes.length
      }
    )

    return NextResponse.json({
      success: true,
      soap_note: result,
      credits_used: estimatedCost,
      remaining_credits: creditCheck.remaining,
    })
  } catch (error) {
    console.error("Clinical SOAP error:", error)
    return NextResponse.json(
      { error: "Failed to generate SOAP note" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const raw_notes = searchParams.get("raw_notes")
    const patient_context = searchParams.get("patient_context") || undefined

    if (!raw_notes) {
      return NextResponse.json(
        { error: "Missing required query param: raw_notes" },
        { status: 400 }
      )
    }

    const estimatedTokens = Math.ceil(raw_notes.length * 1.5 + (patient_context?.length || 0) * 1.5)
    const estimatedCost = Math.ceil(estimatedTokens / 100)

    return NextResponse.json({
      requires_confirmation: true,
      estimate: {
        tokens: estimatedTokens,
        credits_cost: estimatedCost,
        description: "This will convert your clinical notes into a structured SOAP format"
      },
      message: "POST to this endpoint with confirm: true to execute"
    })
  } catch (error) {
    console.error("Clinical SOAP estimate error:", error)
    return NextResponse.json(
      { error: "Failed to estimate SOAP note cost" },
      { status: 500 }
    )
  }
}
