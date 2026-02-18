import { nova } from "../orchestrator"
import { AIResponse } from "../types/ai.types"

export interface SOAPRequest {
    clinic_id: string
    user_id?: string
    raw_notes: string
    patient_context?: string
}

export interface SOAPResult {
    subjective: string
    objective: string
    assessment: string
    plan: string
    full_formatted: string
}

export async function generateSOAPNote(params: SOAPRequest): Promise<SOAPResult> {
    const prompt = `
        You are a highly experienced and detail-oriented Dental Clinical Assistant.
        Your task is to transform the following raw clinical notes/transcript into a professional SOAP (Subjective, Objective, Assessment, Plan) format.
        
        Raw Notes: "${params.raw_notes}"
        ${params.patient_context ? `Patient Context: ${params.patient_context}` : ""}

        Guidelines:
        - Subjective: Chief complaint, history of present illness, relevant past medical history as reported by patient.
        - Objective: Clinical findings, exam results, radiograph findings (if mentioned).
        - Assessment: Diagnosis or clinical impressions based on findings.
        - Plan: Recommended treatment, prescriptions, next steps, or referrals.

        Format the output clearly with headers.
    `

    const response: AIResponse = await nova.run({
        clinic_id: params.clinic_id,
        user_id: params.user_id,
        task_type: "clinical_soap",
        prompt: prompt,
        quality: "premium" // Clinical notes require high precision
    })

    const sections = response.result.split(/(?=Subjective:|Objective:|Assessment:|Plan:)/i)

    return {
        subjective: sections.find(s => s.toLowerCase().includes("subjective"))?.replace(/Subjective:\s*/i, "").trim() || "",
        objective: sections.find(s => s.toLowerCase().includes("objective"))?.replace(/Objective:\s*/i, "").trim() || "",
        assessment: sections.find(s => s.toLowerCase().includes("assessment"))?.replace(/Assessment:\s*/i, "").trim() || "",
        plan: sections.find(s => s.toLowerCase().includes("plan"))?.replace(/Plan:\s*/i, "").trim() || "",
        full_formatted: response.result
    }
}
