"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Phone, Users, Send } from "lucide-react"
import type { CampaignState } from "./types"

interface StepPreviewProps {
  onBack: () => void
  onLaunch: () => void
  state: CampaignState
}

export function StepPreview({ onBack, onLaunch, state }: StepPreviewProps) {
  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="w-4 h-4" />
      case "sms": return <MessageSquare className="w-4 h-4" />
      case "whatsapp": return <Phone className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  const getChannelColor = (type: string) => {
    switch (type) {
      case "email": return "bg-blue-100 text-blue-700"
      case "sms": return "bg-green-100 text-green-700" 
      case "whatsapp": return "bg-purple-100 text-purple-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review & Launch</h2>
        <p className="text-muted-foreground">Review your campaign before launching</p>
      </div>

      {/* Campaign Summary */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Campaign Details</h3>
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Recipients</p>
              <p className="text-sm text-muted-foreground">
                {state.leads.length} leads ready to contact
              </p>
            </div>
          </div>
          
          {state.selectedTemplate && (
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getChannelColor(state.selectedTemplate.type)}`}>
                {getChannelIcon(state.selectedTemplate.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium">Template</p>
                <p className="text-sm text-muted-foreground">{state.selectedTemplate.name}</p>
                <p className="text-sm mt-1">{state.selectedTemplate.subject}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Cost Estimate */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Credit Usage</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Messages to send:</span>
            <span className="font-medium">{state.leads.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Credits per message:</span>
            <span className="font-medium">1</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total credits needed:</span>
            <span className="text-primary">{state.leads.length}</span>
          </div>
        </div>
      </Card>

      {/* Sample Preview */}
      {state.selectedTemplate && state.leads.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Sample Message Preview</h3>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="capitalize">
                {state.selectedTemplate.type}
              </Badge>
              <span className="text-sm text-muted-foreground">To: {state.leads[0].email}</span>
            </div>
            <div>
              <p className="font-medium mb-2">{state.selectedTemplate.subject}</p>
              <p className="text-sm">
                {state.selectedTemplate.body.replace("{firstName}", state.leads[0].firstName)}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onLaunch} className="gap-2">
          <Send className="w-4 h-4" />
          Launch Campaign
        </Button>
      </div>
    </div>
  )
}