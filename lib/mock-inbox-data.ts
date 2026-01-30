import { MessageSquare, Phone, Mail, User, Calendar, Clock, AlertCircle } from "lucide-react"

export type ChannelType = "sms" | "whatsapp" | "email" | "chat"

export interface Thread {
    id: string
    patientId: string
    patientName: string
    patientAvatar?: string
    lastMessage: string
    timestamp: string
    unreadCount: number
    channel: ChannelType
    status: "open" | "closed" | "flagged"
    tags: string[]
}

export interface Message {
    id: string
    threadId: string
    content: string
    sender: "patient" | "staff" | "ai"
    timestamp: string
    type: "text" | "image" | "template"
    status: "sent" | "delivered" | "read" | "failed"
}

export interface PatientProfile {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
    lastVisit: string
    nextVisit?: string
    ltv: number
    status: "active" | "inactive" | "new"
    notes: string
}

export const mockThreads: Thread[] = [
    {
        id: "t1",
        patientId: "p1",
        patientName: "Sarah Johnson",
        lastMessage: "Is there any availability for a cleaning this Friday?",
        timestamp: "10:30 AM",
        unreadCount: 1,
        channel: "sms",
        status: "open",
        tags: ["High Value", "Recall"],
    },
    {
        id: "t2",
        patientId: "p2",
        patientName: "Mike Chen",
        lastMessage: "Thanks, I received the confirmation.",
        timestamp: "Yesterday",
        unreadCount: 0,
        channel: "whatsapp",
        status: "closed",
        tags: ["New Patient"],
    },
    {
        id: "t3",
        patientId: "p3",
        patientName: "Emma Davis",
        lastMessage: "Do you accept Delta Dental insurance?",
        timestamp: "Yesterday",
        unreadCount: 0,
        channel: "chat",
        status: "open",
        tags: ["Insurance Question"],
    },
]

export const mockMessages: Record<string, Message[]> = {
    t1: [
        {
            id: "m1",
            threadId: "t1",
            content: "Hi Sarah, this is Orasync reminding you it's time for your checkup!",
            sender: "ai",
            timestamp: "Mon, 10:00 AM",
            type: "text",
            status: "read",
        },
        {
            id: "m2",
            threadId: "t1",
            content: "Is there any availability for a cleaning this Friday?",
            sender: "patient",
            timestamp: "Mon, 10:30 AM",
            type: "text",
            status: "read",
        },
    ],
    t2: [
        {
            id: "m3",
            threadId: "t2",
            content: "Your appointment is confirmed for Tue Oct 24 at 2pm.",
            sender: "ai",
            timestamp: "Sun, 4:00 PM",
            type: "text",
            status: "read",
        },
        {
            id: "m4",
            threadId: "t2",
            content: "Thanks, I received the confirmation.",
            sender: "patient",
            timestamp: "Sun, 4:05 PM",
            type: "text",
            status: "read",
        },
    ],
}

export const mockPatients: Record<string, PatientProfile> = {
    p1: {
        id: "p1",
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+1 (555) 123-4567",
        lastVisit: "6 months ago",
        nextVisit: "Not scheduled",
        ltv: 2400,
        status: "active",
        notes: "Prefers morning appointments. Sensitive gums.",
    },
    p2: {
        id: "p2",
        name: "Mike Chen",
        email: "mike.chen@example.com",
        phone: "+1 (555) 987-6543",
        lastVisit: "New Patient",
        nextVisit: "Tue Oct 24, 2:00 PM",
        ltv: 0,
        status: "new",
        notes: "Referred by Facebook Ad.",
    },
}
