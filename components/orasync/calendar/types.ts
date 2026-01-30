export type AppointmentType = "cleaning" | "exam" | "root_canal" | "whitening" | "consultation"

export interface Appointment {
    id: string
    patientId: string
    patientName: string
    type: AppointmentType
    start: Date
    end: Date
    status: "confirmed" | "pending" | "cancelled" | "checked-in"
    notes?: string
}

export interface DragEvent {
    id: string
    originalStart: Date
    newStart: Date
}

export const APPOINTMENT_COLORS: Record<AppointmentType, string> = {
    cleaning: "bg-blue-100 text-blue-700 border-blue-200",
    exam: "bg-green-100 text-green-700 border-green-200",
    root_canal: "bg-red-100 text-red-700 border-red-200",
    whitening: "bg-purple-100 text-purple-700 border-purple-200",
    consultation: "bg-amber-100 text-amber-700 border-amber-200",
}
