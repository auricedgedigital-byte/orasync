import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

interface FilterCondition {
    id: string
    type: "last_visit" | "tags" | "treatment" | "age" | "status"
    operator: "gt" | "lt" | "eq" | "includes" | "excludes"
    value: string
}

export async function POST(
    request: NextRequest,
    { params }: { params: { cid: string } }
) {
    try {
        const clinicId = params.cid
        const { conditions } = await request.json() as { conditions: FilterCondition[] }

        if (!conditions || conditions.length === 0) {
            return NextResponse.json({ count: 0, preview: [] })
        }

        // Build dynamic WHERE clause based on conditions
        let whereClauses: string[] = [`p.clinic_id = $1`]
        const queryParams: any[] = [clinicId]
        let paramIndex = 2

        for (const condition of conditions) {
            switch (condition.type) {
                case "last_visit":
                    // Join with appointments to find last visit date
                    const days = parseInt(condition.value)
                    if (condition.operator === "gt") {
                        whereClauses.push(`
              (SELECT MAX(appointment_date) 
               FROM appointments 
               WHERE patient_id = p.id AND status NOT IN ('cancelled', 'no-show')
              ) < NOW() - INTERVAL '$${paramIndex} days'
            `)
                        queryParams.push(days)
                        paramIndex++
                    } else if (condition.operator === "lt") {
                        whereClauses.push(`
              (SELECT MAX(appointment_date) 
               FROM appointments 
               WHERE patient_id = p.id AND status NOT IN ('cancelled', 'no-show')
              ) > NOW() - INTERVAL '$${paramIndex} days'
            `)
                        queryParams.push(days)
                        paramIndex++
                    }
                    break

                case "tags":
                    if (condition.operator === "includes") {
                        whereClauses.push(`p.tags @> ARRAY[$${paramIndex}]`)
                        queryParams.push(condition.value)
                        paramIndex++
                    } else if (condition.operator === "excludes") {
                        whereClauses.push(`NOT (p.tags @> ARRAY[$${paramIndex}])`)
                        queryParams.push(condition.value)
                        paramIndex++
                    }
                    break

                case "treatment":
                    // Check if patient has had specific treatment codes
                    const treatmentCodes = condition.value.split(',').map(t => t.trim())
                    if (condition.operator === "includes") {
                        whereClauses.push(`
              EXISTS (
                SELECT 1 FROM appointments a
                WHERE a.patient_id = p.id 
                AND a.treatment_code = ANY($${paramIndex})
              )
            `)
                        queryParams.push(treatmentCodes)
                        paramIndex++
                    }
                    break

                case "age":
                    const age = parseInt(condition.value)
                    if (condition.operator === "gt") {
                        whereClauses.push(`EXTRACT(YEAR FROM AGE(p.date_of_birth)) > $${paramIndex}`)
                        queryParams.push(age)
                        paramIndex++
                    } else if (condition.operator === "lt") {
                        whereClauses.push(`EXTRACT(YEAR FROM AGE(p.date_of_birth)) < $${paramIndex}`)
                        queryParams.push(age)
                        paramIndex++
                    }
                    break

                case "status":
                    if (condition.operator === "excludes") {
                        whereClauses.push(`p.status != $${paramIndex}`)
                        queryParams.push(condition.value)
                        paramIndex++
                    } else if (condition.operator === "eq") {
                        whereClauses.push(`p.status = $${paramIndex}`)
                        queryParams.push(condition.value)
                        paramIndex++
                    }
                    break
            }
        }

        const whereClause = whereClauses.join(' AND ')

        // Count matching patients
        const countQuery = `
      SELECT COUNT(*) as count
      FROM patients p
      WHERE ${whereClause}
    `

        const countResult = await pool.query(countQuery, queryParams)
        const count = parseInt(countResult.rows[0]?.count || '0', 10)

        // Get preview of first 10 patients
        const previewQuery = `
      SELECT 
        p.id,
        p.first_name,
        p.last_name,
        p.email,
        p.phone,
        (SELECT MAX(appointment_date) FROM appointments WHERE patient_id = p.id) as last_visit
      FROM patients p
      WHERE ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT 10
    `

        const previewResult = await pool.query(previewQuery, queryParams)

        return NextResponse.json({
            count,
            preview: previewResult.rows
        })

    } catch (error) {
        console.error('Segment preview error:', error)
        return NextResponse.json(
            { error: 'Failed to preview segment', details: (error as Error).message },
            { status: 500 }
        )
    }
}
