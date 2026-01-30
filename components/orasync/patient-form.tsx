"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface PatientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: PatientFormData) => void
  initialData?: PatientFormData
  isEditing?: boolean
}

export interface PatientFormData {
  name: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  insurance: string
  status: string
  notes: string
}

const insuranceProviders = ["Delta Dental", "Cigna", "Aetna", "United Healthcare", "Humana", "None"]
const patientStatuses = ["active", "inactive", "vip"]

export function PatientForm({ open, onOpenChange, onSubmit, initialData, isEditing }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>(
    initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      insurance: "Delta Dental",
      status: "active",
      notes: "",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[60vh] overflow-y-auto pr-4">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Patient" : "Add New Patient"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              placeholder="Enter patient name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="patient@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              placeholder="123 Main St, City, ST 12345"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Insurance</label>
              <Select
                value={formData.insurance}
                onValueChange={(value) => setFormData({ ...formData, insurance: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {insuranceProviders.map((provider) => (
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
                {patientStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              placeholder="Add any notes about the patient..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update Patient" : "Add Patient"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
