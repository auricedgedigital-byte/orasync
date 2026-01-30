"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Edit Profile Dialog
interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ProfileData) => void
  initialData?: ProfileData
}

export interface ProfileData {
  practiceName: string
  email: string
  phone: string
  address: string
}

export function EditProfileDialog({ open, onOpenChange, onSubmit, initialData }: EditProfileDialogProps) {
  const [formData, setFormData] = useState<ProfileData>(
    initialData || {
      practiceName: "Smile Dental Practice",
      email: "admin@smiledental.com",
      phone: "(555) 123-4567",
      address: "123 Dental Street, City, State 12345",
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
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Practice Name</label>
            <Input
              value={formData.practiceName}
              onChange={(e) => setFormData({ ...formData, practiceName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Change Password Dialog
interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: PasswordData) => void
}

export interface PasswordData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export function ChangePasswordDialog({ open, onOpenChange, onSubmit }: ChangePasswordDialogProps) {
  const [formData, setFormData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    onSubmit(formData)
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input
              type="password"
              value={formData.oldPassword}
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Password</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Add/Edit Team Member Dialog
interface TeamMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TeamMemberData) => void
  initialData?: TeamMemberData
  isEditing?: boolean
}

export interface TeamMemberData {
  name: string
  email: string
  role: string
}

const roles = ["Owner", "Dentist", "Hygienist", "Administrator", "Receptionist"]

export function TeamMemberDialog({ open, onOpenChange, onSubmit, initialData, isEditing }: TeamMemberDialogProps) {
  const [formData, setFormData] = useState<TeamMemberData>(
    initialData || {
      name: "",
      email: "",
      role: "Dentist",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", email: "", role: "Dentist" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update Member" : "Add Member"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Payment Method Dialog
interface PaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: PaymentData) => void
}

export interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

export function PaymentMethodDialog({ open, onOpenChange, onSubmit }: PaymentMethodDialogProps) {
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ cardNumber: "", expiryDate: "", cvv: "", cardholderName: "" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cardholder Name</label>
            <Input
              value={formData.cardholderName}
              onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Number</label>
            <Input
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date</label>
              <Input
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CVV</label>
              <Input
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Payment Method</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
