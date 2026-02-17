export interface Thread {
    id: string
    clinic_id: string
    patient_id?: string
    contact_name?: string
    contact_email?: string
    contact_phone?: string
    channel: 'sms' | 'email' | 'whatsapp' | 'chat'
    status: 'open' | 'closed' | 'spam'
    last_message_at: string
    created_at: string
    // Derived/Joined fields
    patient_first_name?: string
    patient_last_name?: string
    last_message_content?: string
    unread_count?: number // Not in DB yet, but useful for UI
}

export interface Message {
    id: string
    thread_id: string
    clinic_id: string
    sender_type: 'staff' | 'patient' | 'ai' | 'system'
    user_id?: string
    content: string
    created_at: string
    attachments?: any[]
}

export interface Patient {
    id: string
    first_name: string
    last_name: string
    email?: string
    phone?: string
    last_visit?: string
    next_due?: string
    ltv?: number // Logic to calculate this might be needed
    notes?: string
    avatar?: string // Placeholder for UI
}
