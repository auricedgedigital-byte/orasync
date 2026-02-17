import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

export async function POST(
    request: NextRequest,
    { params }: { params: { cid: string } }
) {
    try {
        const clinicId = params.cid
        const { name, description, conditions } = await request.json()

        const result = await pool.query(
            `INSERT INTO segments (clinic_id, name, description, filters, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, name, created_at`,
            [clinicId, name, description || null, JSON.stringify(conditions)]
        )

        return NextResponse.json(result.rows[0])

    } catch (error) {
        console.error('Save segment error:', error)
        return NextResponse.json(
            { error: 'Failed  to save segment', details: (error as Error).message },
            { status: 500 }
        )
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { cid: string } }
) {
    try {
        const clinicId = params.cid

        const result = await pool.query(
            `SELECT id, name, description, filters, created_at
       FROM segments
       WHERE clinic_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
            [clinicId]
        )

        return NextResponse.json({ segments: result.rows })

    } catch (error) {
        console.error('List segments error:', error)
        return NextResponse.json(
            { error: 'Failed to list segments', details: (error as Error).message },
            { status: 500 }
        )
    }
}
