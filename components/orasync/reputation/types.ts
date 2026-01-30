export type Sentiment = "positive" | "negative" | "neutral"

export interface ReviewRequest {
    id: string
    patientName: string
    patientPhone: string
    visitDate: string
    status: "sent" | "opened" | "clicked" | "reviewed"
    sentiment?: Sentiment
    rating?: number // 1-5
}

export interface ReputationConfig {
    googleReviewLink: string
    facebookReviewLink?: string
    minPositiveRating: number // e.g., 4 or 5
    internalFeedbackEmail: string
}

export const DEFAULT_REPUTATION_CONFIG: ReputationConfig = {
    googleReviewLink: "https://g.page/r/CbG9...",
    minPositiveRating: 4,
    internalFeedbackEmail: "manager@orasync.site"
}
