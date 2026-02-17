import { NextRequest, NextResponse } from "next/server"
import { getThreads, createMessage } from "@/lib/db" // Assuming generic createMessage can be used for initiating, but normally we need createThread too.
import { Pool } from "pg"

// We need a createThread function in db.ts or inline here if it's simple. 
// For now, let's assume getThreads is enough for the GET endpoint.

export async function GET(
    request: NextRequest,
    { params }: { params: { cid: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams
        const filterChannel = searchParams.get("channel") || "all"
        const searchTerm = searchParams.get("search") || ""

        const threads = await getThreads(params.cid, 50, filterChannel, searchTerm)

        return NextResponse.json(threads)
    } catch (error) {
        console.error("Error in threads API:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
