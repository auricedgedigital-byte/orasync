"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DayView } from "@/components/orasync/calendar/day-view"
import { BookingForm } from "@/components/orasync/calendar/booking-form"
import { Plus, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import type { Appointment } from "@/components/orasync/calendar/types"
import { addHours, subDays, addDays } from "date-fns"

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [bookingSlot, setBookingSlot] = useState<Date | null>(null)

    // Mock appointments state
    const [appointments, setAppointments] = useState<Appointment[]>([
        {
            id: "1",
            patientId: "p1",
            patientName: "Alice Johnson",
            type: "cleaning",
            start: addHours(new Date(), 0), // Today, now
            end: addHours(new Date(), 1),
            status: "confirmed"
        },
        {
            id: "2",
            patientId: "p2",
            patientName: "Bob Smith",
            type: "exam",
            start: addHours(new Date(), -2),
            end: addHours(new Date(), -1.5),
            status: "checked-in"
        }
    ])

    const handleSlotClick = (date: Date) => {
        setBookingSlot(date)
        setIsBookingOpen(true)
    }

    const handleCreateAppointment = (data: Partial<Appointment>) => {
        if (!data.start || !data.end) return

        const newAppt: Appointment = {
            id: Math.random().toString(),
            patientId: "new",
            patientName: data.patientName || "Unknown",
            type: data.type || "exam",
            start: data.start,
            end: data.end,
            status: "confirmed",
            notes: data.notes
        }

        setAppointments(prev => [...prev, newAppt])
        setIsBookingOpen(false)
    }

    const currentDate = selectedDate || new Date()

    return (
        <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
                    <p className="text-muted-foreground mt-1">Manage appointments and provider availability.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleSlotClick(new Date())}>
                        <Plus className="mr-2 h-4 w-4" /> New Booking
                    </Button>
                </div>
            </div>

            <div className="flex gap-6 flex-1 overflow-hidden">
                {/* Sidebar Calendar */}
                <Card className="w-auto h-fit p-4 hidden md:block">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border shadow-none"
                    />
                    <div className="mt-4 space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">Filter Providers</div>
                        {["Dr. Smith", "Dr. Jones", "Hygiene 1"].map(p => (
                            <div key={p} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                                <span>{p}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Main Scheduler */}
                <Card className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedDate(subDays(currentDate, 1))}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="text-lg font-semibold w-40 text-center">
                                {currentDate.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(currentDate, 1))}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex bg-muted rounded-lg p-1">
                            <button className="px-3 py-1 text-xs font-medium bg-background shadow rounded-md">Day</button>
                            <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-background/50 rounded-md">Week</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden p-4 bg-muted/10">
                        <DayView
                            date={currentDate}
                            appointments={appointments}
                            onSlotClick={handleSlotClick}
                            onAppointmentClick={(appt) => alert(`Clicked ${appt.patientName}`)}
                        />
                    </div>
                </Card>
            </div>

            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Appointment</DialogTitle>
                    </DialogHeader>
                    {bookingSlot && (
                        <BookingForm
                            selectedDate={bookingSlot}
                            onSubmit={handleCreateAppointment}
                            onCancel={() => setIsBookingOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
