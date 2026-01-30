export type Sender = "user" | "ai" | "system"

export interface ChatMessage {
    id: string
    text: string
    sender: Sender
    timestamp: Date
    intent?: "BOOKING" | "QUESTION" | "GREETING"
}

export interface ChatConfig {
    botName: string
    primaryColor: string
    welcomeMessage: string
    isLive: boolean
    businessHours: string
}

export const DEFAULT_CONFIG: ChatConfig = {
    botName: "Orasync Assistant",
    primaryColor: "#4f46e5", // Indigo-600
    welcomeMessage: "Hi there! I can help you book an appointment or answer questions about our practice.",
    isLive: true,
    businessHours: "Mon-Fri 9AM-5PM"
}
