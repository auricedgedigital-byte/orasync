import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'
import validator from 'validator'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("postgres") ? { rejectUnauthorized: false } : undefined,
})

interface LeadRow {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    date_of_birth?: string
    address?: string
    [key: string]: any
}

interface ImportError {
    row: number
    message: string
}

export async function POST(
    request: NextRequest,
    { params }: { params: { cid: string } }
) {
    try {
        const clinicId = params.cid
        const { leads } = await request.json() as { leads: LeadRow[] }

        if (!leads || leads.length === 0) {
            return NextResponse.json(
                { error: 'No leads provided' },
                { status: 400 }
            )
        }

        let added = 0
        let skipped = 0
        const errors: ImportError[] = []

        for (let i = 0; i < leads.length; i++) {
            const lead = leads[i]
            const rowNumber = i + 2 // CSV row numbering (1-indexed + header row)

            try {
                // Validate required fields
                if (!lead.first_name || !lead.last_name) {
                    errors.push({ row: rowNumber, message: 'Missing first or last name' })
                    skipped++
                    continue
                }

                if (!lead.email && !lead.phone) {
                    errors.push({ row: rowNumber, message: 'Missing both email and phone' })
                    skipped++
                    continue
                }

                // Normalize and validate email
                let normalizedEmail: string | null = null
                if (lead.email) {
                    const email = lead.email.trim().toLowerCase()
                    if (!validator.isEmail(email)) {
                        errors.push({ row: rowNumber, message: `Invalid email: ${lead.email}` })
                        skipped++
                        continue
                    }
                    normalizedEmail = email
                }

                // Normalize and validate phone
                let normalizedPhone: string | null = null
                if (lead.phone) {
                    try {
                        const phoneStr = lead.phone.trim()
                        if (isValidPhoneNumber(phoneStr, 'US')) {
                            const parsed = parsePhoneNumber(phoneStr, 'US')
                            normalizedPhone = parsed.format('E.164')
                        } else {
                            errors.push({ row: rowNumber, message: `Invalid phone: ${lead.phone}` })
                            skipped++
                            continue
                        }
                    } catch (phoneError) {
                        errors.push({ row: rowNumber, message: `Invalid phone format: ${lead.phone}` })
                        skipped++
                        continue
                    }
                }

                // Check for duplicates
                const duplicateCheck = await pool.query(
                    `SELECT id FROM patients 
           WHERE clinic_id = $1 
           AND (email = $2 OR phone = $3)
           LIMIT 1`,
                    [clinicId, normalizedEmail, normalizedPhone]
                )

                if (duplicateCheck.rows.length > 0) {
                    skipped++
                    continue // Skip duplicates silently
                }

                // Insert patient
                await pool.query(
                    `INSERT INTO patients (
            clinic_id, 
            first_name, 
            last_name, 
            email, 
            phone, 
            date_of_birth, 
            address,
            status,
            created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'lead', NOW())`,
                    [
                        clinicId,
                        lead.first_name.trim(),
                        lead.last_name.trim(),
                        normalizedEmail,
                        normalizedPhone,
                        lead.date_of_birth || null,
                        lead.address || null
                    ]
                )

                added++

            } catch (rowError) {
                console.error(`Error processing row ${rowNumber}:`, rowError)
                errors.push({
                    row: rowNumber,
                    message: `Processing error: ${(rowError as Error).message}`
                })
                skipped++
            }
        }

        return NextResponse.json({
            total: leads.length,
            added,
            skipped,
            errors
        })

    } catch (error) {
        console.error('Lead upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload leads', details: (error as Error).message },
            { status: 500 }
        )
    }
}
