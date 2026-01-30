"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, Phone } from "lucide-react"
import type { CampaignTemplate } from "./types"

interface StepTemplateProps {
  onBack: () => void
  onNext: (template: CampaignTemplate) => void
  initialTemplate: CampaignTemplate | null
}

const templates: CampaignTemplate[] = [
  {
    id: "1",
    name: "Reactivation Email",
    subject: "We Miss You! Special Offer Inside",
    body: "Hi {firstName}, it's been a while since your last visit. We'd love to see you again! Book now and get 20% off your next cleaning.",
    type: "email"
  },
  {
    id: "2", 
    name: "SMS Reminder",
    subject: "Quick Check-in",
    body: "Hi {firstName}, just checking in! Haven't seen you in a while. Book your appointment today - slots available this week!",
    type: "sms"
  },
  {
    id: "3",
    name: "WhatsApp Personal",
    subject: "Personal Invitation",
    body: "Hi {firstName}! It's been too long. We miss your smile at our practice. Would love to see you again soon!",
    type: "whatsapp"
  }
]

export function StepTemplate({ onBack, onNext, initialTemplate }: StepTemplateProps) {
  const [selected, setSelected] = useState<CampaignTemplate | null>(initialTemplate)

  const handleNext = () => {
    if (selected) {
      onNext(selected)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="w-5 h-5" />
      case "sms": return <MessageSquare className="w-5 h-5" />
      case "whatsapp": return <Phone className="w-5 h-5" />
      default: return <Mail className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Template</h2>
        <p className="text-muted-foreground">Select a template for your campaign</p>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-6 cursor-pointer transition-all ${
              selected?.id === template.id
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelected(template)}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                template.type === "email" ? "bg-blue-100 text-blue-600" :
                template.type === "sms" ? "bg-green-100 text-green-600" :
                "bg-purple-100 text-purple-600"
              }`}>
                {getIcon(template.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                <p className="text-sm">{template.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!selected}>
          Continue to Preview
        </Button>
      </div>
    </div>
  )
}