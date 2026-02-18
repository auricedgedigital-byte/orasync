import { type NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"
import { checkAndDecrementCredits } from "@/lib/db"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
})

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
    const clinicId = params.cid
    const client = await pool.connect()

    try {
        const body = await request.json()
        const {
            clinicName,
            chairValue,
            growthGoal,
            timeSaveGoal,
            calendarConnected,
            smsConnected,
            selectedCampaign
        } = body

        await client.query("BEGIN")

        // 1. Update Clinic Settings
        await client.query(
            `UPDATE clinics 
       SET name = COALESCE($1, name), 
           settings = settings || $2::jsonb, 
           updated_at = NOW() 
       WHERE id = $3`,
            [
                clinicName,
                JSON.stringify({
                    onboarding_completed: true,
                    chair_value: parseFloat(chairValue || "500"),
                    growth_goal_percent: parseFloat(growthGoal || "20"),
                    time_save_goal_hrs: parseFloat(timeSaveGoal || "10"),
                    integrations: {
                        calendar: !!calendarConnected,
                        sms: !!smsConnected
                    }
                }),
                clinicId
            ]
        )

        // 2. Initialize First Campaign (Draft) if selected
        if (selectedCampaign) {
            const campaignName = selectedCampaign === 'hygiene_reactivation' ? 'First Hygiene Reactivation Sprint' : 'Nova Growth Sprint'

            await client.query(
                `INSERT INTO campaigns (clinic_id, name, segment_criteria, template, channels, status, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, 'draft', NOW(), NOW())`,
                [
                    clinicId,
                    campaignName,
                    JSON.stringify({ last_visit_before: "2024-01-01", tags: ["reactivation"] }),
                    JSON.stringify({
                        subject: "Time for your checkup at {{practice_name}}",
                        body: "Hi {{first_name}}, it's been a while. Nova noticed you are due for hygiene...",
                        tokens: ["first_name", "practice_name"]
                    }),
                    JSON.stringify({ email: true, sms: !!smsConnected })
                ]
            )
        }

        // 3. Grant Onboarding Bonus Credits (if not already granted)
        await client.query(
            `UPDATE trial_credits 
         SET reactivation_emails = reactivation_emails + 500,
             reactivation_sms = reactivation_sms + 100,
             modified_at = NOW()
         WHERE clinic_id = $1`,
            [clinicId]
        )

        await client.query("COMMIT")

        return NextResponse.json({ success: true })
    } catch (error) {
        await client.query("ROLLBACK")
        console.error("Onboarding setup error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    } finally {
        client.release()
    }
}
