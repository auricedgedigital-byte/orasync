"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { format } from "date-fns"
import type { Appointment, AppointmentType } from "./types"

interface BookingFormProps {
    selectedDate: Date
    onSubmit: (data: Partial<Appointment>) => void
    onCancel: () => void
}

export function BookingForm({ selectedDate, onSubmit, onCancel }: BookingFormProps) {
    const [patientName, setPatientName] = useState("")
    const [type, setType] = useState<AppointmentType>("exam")
    const [notes, setNotes] = useState("")

    const handleSubmit = () => {
        onSubmit({
            patientName,
            type,
            notes,
            start: selectedDate,
            // Default duration based on type
            end: new Date(selectedDate.getTime() + (type === "cleaning" ? 60 : 30) * 60000)
        })
    }

    return (
        <div className="space-y-4 py-2">
            <div className="bg-muted/30 p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Time Slot</p>
                <p className="font-medium font-mono">{format(selectedDate, "EEEE, MMMM d @ h:mm a")}</p>
            </div>

            <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input
                    placeholder="Search or enter name..."
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Appointment Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as AppointmentType)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="exam">New Patient Exam (30m)</SelectItem>
                        <SelectItem value="cleaning">Hygiene / Cleaning (1h)</SelectItem>
                        <SelectItem value="whitening">Whitening (1.5h)</SelectItem>
                        <SelectItem value="root_canal">Root Canal (2h)</SelectItem>
                        <SelectItem value="consultation">Consultation (30m)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                    placeholder="e.g. Needs x-rays"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <DialogFooter className="pt-4">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={!patientName}>Confirm Booking</Button>
            </DialogFooter>
        </div>
    )
}
