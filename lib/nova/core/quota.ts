import { Pool } from "pg"
import { AIQuality } from "../types/ai.types"

export class QuotaManager {
    constructor(private pool: Pool) { }

    async checkQuota(clinicId: string, estimatedTokens: number, quality: AIQuality): Promise<boolean> {
        const creditType = quality === "premium" ? "ai_premium" : "ai_cheap"

        try {
            const result = await this.pool.query(
                "SELECT amount FROM balances WHERE clinic_id = $1 AND credit_type = $2",
                [clinicId, creditType]
            )

            if (result.rows.length === 0) return false

            const balance = parseFloat(result.rows[0].amount)
            return balance >= estimatedTokens
        } catch (error) {
            console.error("Quota Check Error:", error)
            return false
        }
    }

    async consumeQuota(
        clinicId: string,
        userId: string | undefined,
        amount: number,
        quality: AIQuality,
        meta: {
            request_id: string
            provider: string
            model: string
            task_type: string
            cost_actual: number
        }
    ) {
        const client = await this.pool.connect()
        const creditType = quality === "premium" ? "ai_premium" : "ai_cheap"

        try {
            await client.query("BEGIN")

            // 1. Decrement balance (SELECT FOR UPDATE pattern)
            const balanceResult = await client.query(
                "SELECT amount FROM balances WHERE clinic_id = $1 AND credit_type = $2 FOR UPDATE",
                [clinicId, creditType]
            )

            if (balanceResult.rows.length > 0) {
                await client.query(
                    "UPDATE balances SET amount = amount - $1 WHERE clinic_id = $2 AND credit_type = $3",
                    [amount, clinicId, creditType]
                )
            }

            // 2. Log usage
            await client.query(
                `INSERT INTO usage_logs (clinic_id, user_id, action_type, amount, details, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
                [
                    clinicId,
                    userId || null,
                    "ai_call",
                    amount,
                    JSON.stringify({
                        request_id: meta.request_id,
                        provider: meta.provider,
                        model: meta.model,
                        task_type: meta.task_type,
                        quality: quality,
                        cost_actual: meta.cost_actual
                    })
                ]
            )

            await client.query("COMMIT")
        } catch (error) {
            await client.query("ROLLBACK")
            console.error("Quota Consumption Error:", error)
        } finally {
            client.release()
        }
    }
}
