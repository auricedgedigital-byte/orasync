export interface AdMetrics {
    spend: number
    impressions: number
    clicks: number
    leads: number
    appointments: number
    revenue: number
}

export interface AdCampaign {
    id: string
    name: string
    platform: "facebook" | "google" | "instagram"
    status: "active" | "paused"
    metrics: AdMetrics
}

export interface LeadPayload {
    id: string
    source: string
    timestamp: string
    data: {
        fullName: string
        email: string
        phone: string
    }
}
