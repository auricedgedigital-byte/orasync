"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface SendMessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: MessageData) => void
  patientNames?: string[]
}

export interface MessageData {
  recipient: string
  channel: string
  message: string
}

const channels = ["SMS", "Email", "WhatsApp"]

export function SendMessageDialog({ open, onOpenChange, onSubmit, patientNames = [] }: SendMessageDialogProps) {
  const [formData, setFormData] = useState<MessageData>({
    recipient: patientNames[0] || "",
    channel: "SMS",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.recipient && formData.message.trim()) {
      onSubmit(formData)
      setFormData({
        recipient: patientNames[0] || "",
        channel: "SMS",
        message: "",
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send New Message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient</label>
            <Input
              placeholder="Enter patient name"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Channel</label>
            <Select value={formData.channel} onValueChange={(value) => setFormData({ ...formData, channel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              placeholder="Type your message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="resize-none"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Send Message</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
