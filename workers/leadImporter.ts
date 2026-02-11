import { neon } from "@neondatabase/serverless"
import { updateJobStatus } from "@/lib/db"

const sql = neon(process.env.DATABASE_URL || "")

interface LeadImportJob {
  clinic_id: string
  leads: Array<{ first_name?: string; last_name?: string; email?: string; phone?: string }>
}

export async function processLeadImportJob(job: LeadImportJob, jobId: string) {
  const { clinic_id, leads } = job

  try {
    await updateJobStatus(jobId, "processing")

    if (!leads || leads.length === 0) {
      await updateJobStatus(jobId, "completed")
      return
    }

    let created = 0
    let updated = 0

    for (const lead of leads) {
      const email = lead.email?.toLowerCase().trim()
      const phone = lead.phone?.replace(/\D/g, "").slice(-10)

      if (!email && !phone) continue

      // Upsert patient
      const result = await sql`
        INSERT INTO patients (clinic_id, first_name, last_name, email, phone, source, created_at)
        VALUES (${clinic_id}, ${lead.first_name || ""}, ${lead.last_name || ""}, ${email || null}, ${phone || null}, 'import', NOW())
        ON CONFLICT (clinic_id, email) WHERE email IS NOT NULL
        DO UPDATE SET last_name = COALESCE(EXCLUDED.last_name, patients.last_name), phone = COALESCE(EXCLUDED.phone, patients.phone)
        RETURNING xmax
      `

      if (result[0]?.xmax === 0) {
        created++
      } else {
        updated++
      }
    }

    await updateJobStatus(jobId, "completed")
  } catch (error) {
    console.error("[v0] Lead importer error:", error)
    await updateJobStatus(jobId, "failed", (error as Error).message)
  }
}

export default processLeadImportJob
