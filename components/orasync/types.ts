export interface Lead {
  id: string
  firstName: string
  lastName?: string
  email: string
  phone: string
  status: "valid" | "invalid" | "duplicate"
}

export interface CampaignTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: "email" | "sms" | "whatsapp"
}

export interface CampaignState {
  step: number
  leads: Lead[]
  selectedTemplate: CampaignTemplate | null
  campaignName: string
  scheduledDate: Date | null
}