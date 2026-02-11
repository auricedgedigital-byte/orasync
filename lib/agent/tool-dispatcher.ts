import {
    createCampaign,
    enqueueJob,
    createOrderRecord,
    createAppointment
} from "../db"

export interface AgentAction {
    action: string
    parameters: Record<string, any>
    explain: string
}

export async function dispatchAgentAction(clinicId: string, action: AgentAction) {
    console.log(`[Nova] Dispatching action: ${action.action} for clinic: ${clinicId}`)

    switch (action.action) {
        case "create_campaign":
            return await createCampaign(
                clinicId,
                action.parameters.name,
                action.parameters.segment_criteria || {},
                action.parameters.channels || ["email"]
            )

        case "start_campaign":
            const campaignId = action.parameters.campaign_id
            if (!campaignId) throw new Error("Missing campaign_id")
            return await enqueueJob(clinicId, "campaign_batch", {
                campaign_id: campaignId,
                clinic_id: clinicId,
                batch_index: 0
            })

        case "create_order":
            // Usually pre-filled from a pack selection Nova suggested
            return await createOrderRecord(
                clinicId,
                `nova_${Date.now()}`,
                action.parameters.pack_id,
                action.parameters.amount_cents
            )

        case "schedule_appointment":
            return await createAppointment(
                clinicId,
                action.parameters.patient_email,
                action.parameters.provider_id || "default",
                action.parameters.scheduled_time
            )

        case "import_leads":
            return await enqueueJob(clinicId, "lead_import", {
                clinic_id: clinicId,
                leads: action.parameters.leads || []
            })

        default:
            throw new Error(`Unknown action: ${action.action}`)
    }
}
