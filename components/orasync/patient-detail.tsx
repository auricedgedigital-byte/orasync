"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Mail, Phone, MapPin, Calendar, FileText, Edit2 } from "lucide-react"
import type { PatientFormData } from "./patient-form"

interface PatientDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: (PatientFormData & { id: string }) | null
  onEdit: (patient: PatientFormData & { id: string }) => void
  onDelete: (patientId: string) => void
}

export function PatientDetail({ open, onOpenChange, patient, onEdit, onDelete }: PatientDetailProps) {
  if (!patient) return null

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this patient?")) {
      onDelete(patient.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center pb-4 border-b">
            <h2 className="text-2xl font-bold">{patient.name}</h2>
            <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{patient.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{patient.phone}</p>
              </div>
            </div>

            {patient.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{patient.address}</p>
                </div>
              </div>
            )}

            {patient.dateOfBirth && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date of Birth</p>
                  <p className="text-sm text-muted-foreground">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Insurance</p>
                <p className="text-sm text-muted-foreground">{patient.insurance}</p>
              </div>
            </div>

            {patient.notes && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-2">Notes</p>
                <p className="text-sm text-muted-foreground">{patient.notes}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button type="button" variant="destructive" size="sm" onClick={handleDelete} className="flex-1">
            Delete Patient
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onEdit(patient)
              onOpenChange(false)
            }}
            className="flex-1"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
