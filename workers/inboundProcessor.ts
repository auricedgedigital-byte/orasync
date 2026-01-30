import { neon } from "@neondatabase/serverless"
import { updateJobStatus } from "@/lib/db"

const sql = neon(process.env.DATABASE_URL || "")

interface InboundJob {
  clinic_id: string
  from: string
  message: string
  channel: string
}

export async function processInboundJob(job: InboundJob, jobId: string) {
  const { clinic_id, from, message, channel } = job

  try {
    await updateJobStatus(jobId, "processing")

    // Process inbound message (SMS, WhatsApp, etc.)
    // For now, log it
    console.log(`[v0] Inbound ${channel} from ${from}: ${message}`)

    // TODO: Implement actual inbound processing
    // - Create or update patient record
    // - Update CRM
    // - Trigger workflows

    await updateJobStatus(jobId, "completed")
  } catch (error) {
    console.error("[v0] Inbound processor error:", error)
    await updateJobStatus(jobId, "failed", (error as Error).message)
  }
}

export default processInboundJob
