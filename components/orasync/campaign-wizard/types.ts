export interface Lead {
    id: string
    name: string
    phone: string
    email: string
    status: "valid" | "duplicate" | "invalid"
    lastVisit?: string
}

export interface CampaignTemplate {
    id: string
    name: string
    type: "reactivation" | "promo" | "seasonal"
    channel: "sms" | "email"
    subject?: string
    content: string
    estimatedConversion: string
}

export interface CampaignState {
    step: number
    leads: Lead[]
    selectedTemplate: CampaignTemplate | null
    campaignName: string
    scheduledDate: Date | null
}

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
    {
        id: "t1",
        name: "Standard Reactivation",
        type: "reactivation",
        channel: "sms",
        content: "Hi {name}, it's been a while! We have an opening with Dr. Smith this week. Reply BOOK to grab a spot.",
        estimatedConversion: "12%"
    },
    {
        id: "t2",
        name: "Free Whitening Offer",
        type: "promo",
        channel: "email",
        subject: "Special Gift from Orasync Dental",
        content: "Hi {name}, book your cleaning this month and receive a complimentary whitening kit! Click here to schedule.",
        estimatedConversion: "18%"
    },
    {
        id: "t3",
        name: "Insurance Reminder",
        type: "seasonal",
        channel: "email",
        subject: "Use It or Lose It: Insurance Benefits",
        content: "Hi {name}, the year is almost over. Don't let your dental benefits expire! Schedule your checkup today.",
        estimatedConversion: "15%"
    }
]
