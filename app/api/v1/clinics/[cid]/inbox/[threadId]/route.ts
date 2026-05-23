import { NextRequest, NextResponse } from "next/server"
import { getMessages, createMessage } from "@/lib/db"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ cid: string; threadId: string }> }
) {
    try {
        const resolvedParams = await params
        const messages = await getMessages(resolvedParams.threadId)
        return NextResponse.json(messages)
    } catch (error) {
        console.error("Error in messages API:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ cid: string; threadId: string }> }
) {
    try {
        const resolvedParams = await params
        const body = await request.json()
        const { content, senderType, userId } = body

        if (!content || !senderType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const message = await createMessage(resolvedParams.cid, resolvedParams.threadId, senderType, content, userId)

        if (!message) {
            return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
        }

        return NextResponse.json(message)
    } catch (error) {
        console.error("Error in create message API:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
