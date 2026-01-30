"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface AppointmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AppointmentFormData) => void
  initialData?: AppointmentFormData
  isEditing?: boolean
}

export interface AppointmentFormData {
  patient: string
  phone: string
  date: string
  time: string
  type: string
  provider: string
  notes: string
  status: string
}

const appointmentTypes = ["Cleaning", "Root Canal", "Consultation", "Filling", "Extraction", "Whitening", "Checkup"]
const providers = ["Dr. Sarah Mitchell", "Dr. James Wilson", "Hygienist Lisa Brown"]
const timeSlots = Array.from({ length: 12 }, (_, i) => `${9 + i}:00 AM`)

export function AppointmentForm({ open, onOpenChange, onSubmit, initialData, isEditing }: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>(
    initialData || {
      patient: "",
      phone: "",
      date: new Date().toISOString().split("T")[0],
      time: "9:00 AM",
      type: "Cleaning",
      provider: "Dr. Sarah Mitchell",
      notes: "",
      status: "pending",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Appointment" : "New Appointment"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Patient Name</label>
            <Input
              placeholder="Enter patient name"
              value={formData.patient}
              onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Appointment Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <Select
                value={formData.provider}
                onValueChange={(value) => setFormData({ ...formData, provider: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              placeholder="Add any notes about the appointment..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update Appointment" : "Create Appointment"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
