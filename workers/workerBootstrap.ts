import { Pool } from "pg"
import dotenv from "dotenv"
import processCampaignJob from "./campaignRunner"

dotenv.config({ path: ".env.local" })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

interface Job {
  id: string
  clinic_id: string
  type: string
  payload: Record<string, unknown>
}

// Handler mapping
const JOB_HANDLERS: Record<string, (payload: Record<string, unknown>, jobId: string) => Promise<void>> = {
  campaign_batch: processCampaignJob,
  campaign_resume: processCampaignJob,
}

export async function startWorkerProcess() {
  console.log("[v0] Worker bootstrap started")
  startDBWorker()
}

async function startDBWorker() {
  console.log("[v0] Database polling worker started")

  while (true) {
    let client
    try {
      client = await pool.connect()

      const res = await client.query(
        "SELECT * FROM jobs WHERE status = 'pending' ORDER BY created_at ASC LIMIT 10"
      )
      const jobs = res.rows as Job[]

      for (const job of jobs) {
        const handler = JOB_HANDLERS[job.type]
        if (handler) {
          try {
            // Mark as processing
            await client.query("UPDATE jobs SET status = 'processing', started_at = NOW() WHERE id = $1", [job.id])

            // Execute handler
            await handler(job.payload, job.id)

            // Status update handled by handler usually, but we could enforce completion if not done
          } catch (error) {
            console.error(`[v0] Error processing job ${job.id}:`, error)
            await client.query(
              "UPDATE jobs SET status = 'failed', error_message = $1 WHERE id = $2",
              [(error as Error).message, job.id]
            )
          }
        }
      }

    } catch (error) {
      console.error("[v0] Database worker error:", error)
    } finally {
      if (client) client.release()
    }

    // Poll every 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000))
  }
}

// Run if called directly
if (require.main === module) {
  startWorkerProcess()
}

export default startWorkerProcess
