"use client"

import { useMemo } from "react"
import { format, isSameDay, setHours, setMinutes, differenceInMinutes, startOfDay } from "date-fns"
import { APPOINTMENT_COLORS, type Appointment } from "./types"
import { cn } from "@/lib/utils"

interface DayViewProps {
    date: Date
    appointments: Appointment[]
    onSlotClick: (time: Date) => void
    onAppointmentClick: (appt: Appointment) => void
}

export function DayView({ date, appointments, onSlotClick, onAppointmentClick }: DayViewProps) {
    const hours = Array.from({ length: 11 }, (_, i) => i + 8) // 8 AM to 6 PM

    const todaysAppointments = useMemo(() => {
        return appointments.filter(appt => isSameDay(appt.start, date))
    }, [date, appointments])

    const getPositionStyles = (appt: Appointment) => {
        const startHour = appt.start.getHours()
        const startMin = appt.start.getMinutes()
        const duration = differenceInMinutes(appt.end, appt.start)

        // Grid starts at 8 AM. 1 hour = 64px height (customizable)
        const startOffsetMinutes = (startHour - 8) * 60 + startMin
        const top = startOffsetMinutes * (64 / 60) // 64px per hour
        const height = duration * (64 / 60)

        return { top: `${top}px`, height: `${height}px` }
    }

    return (
        <div className="flex border rounded-xl bg-background overflow-hidden h-[720px] shadow-sm">
            {/* Time Sidebar */}
            <div className="w-16 flex-shrink-0 border-r bg-muted/5 text-xs text-muted-foreground">
                {hours.map(hour => (
                    <div key={hour} className="h-16 border-b flex items-start justify-center pt-2 relative">
                        {format(setHours(new Date(), hour), "h a")}
                    </div>
                ))}
            </div>

            {/* Grid Area */}
            <div className="flex-1 relative overflow-y-auto">
                {/* Background Grid Lines */}
                {hours.map(hour => (
                    <div
                        key={hour}
                        className="h-16 border-b border-dashed border-muted/50 w-full absolute left-0 flex flex-col justify-end group cursor-pointer hover:bg-muted/10 transition-colors"
                        style={{ top: `${(hour - 8) * 64}px` }}
                        onClick={() => onSlotClick(setMinutes(setHours(date, hour), 0))}
                    >
                        {/* Half-hour marker (hidden visual aid) */}
                        <div className="h-8 border-t border-dotted border-muted/20 w-full pointer-events-none" />
                    </div>
                ))}

                {/* Appointments */}
                {todaysAppointments.map(appt => (
                    <div
                        key={appt.id}
                        className={cn(
                            "absolute left-2 right-2 rounded-md p-2 text-xs border cursor-pointer hover:brightness-95 hover:shadow-md transition-all z-10 overflow-hidden",
                            APPOINTMENT_COLORS[appt.type]
                        )}
                        style={getPositionStyles(appt)}
                        onClick={(e) => { e.stopPropagation(); onAppointmentClick(appt) }}
                    >
                        <div className="font-semibold leading-none mb-1">{appt.patientName}</div>
                        <div className="opacity-80 flex gap-1">
                            <span>{format(appt.start, "h:mm")}</span>
                            <span>-</span>
                            <span className="capitalize">{appt.type.replace("_", " ")}</span>
                        </div>
                    </div>
                ))}

                {/* Current Time Indicator (Visual Mock) */}
                <div
                    className="absolute w-full border-t-2 border-red-500 z-20 pointer-events-none opacity-50"
                    style={{ top: "340px" }} // Mocking approx 1:20 PM
                >
                    <span className="bg-red-500 text-white text-[10px] px-1 rounded-sm absolute -top-2 left-0">Now</span>
                </div>
            </div>
        </div>
    )
}
