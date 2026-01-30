"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Copy, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Zap, Code } from "lucide-react"

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  status: "active" | "inactive"
  lastTriggered: string
  successRate: number
}

interface Workflow {
  id: string
  name: string
  trigger: string
  actions: string[]
  status: "active" | "inactive"
  executions: number
  lastRun: string
}

export default function AutomationWebhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "1",
      name: "Appointment Confirmation",
      url: "https://n8n.example.com/webhook/appointment-confirm",
      events: ["appointment.created", "appointment.updated"],
      status: "active",
      lastTriggered: "2 minutes ago",
      successRate: 99.2,
    },
    {
      id: "2",
      name: "Lead Notification",
      url: "https://n8n.example.com/webhook/lead-notify",
      events: ["lead.created"],
      status: "active",
      lastTriggered: "5 minutes ago",
      successRate: 98.5,
    },
    {
      id: "3",
      name: "SMS Reminder",
      url: "https://n8n.example.com/webhook/sms-reminder",
      events: ["appointment.reminder"],
      status: "inactive",
      lastTriggered: "1 hour ago",
      successRate: 97.8,
    },
  ])

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Auto-Confirm Appointments",
      trigger: "New appointment created",
      actions: ["Send confirmation email", "Add to calendar", "Notify staff"],
      status: "active",
      executions: 234,
      lastRun: "2 minutes ago",
    },
    {
      id: "2",
      name: "Lead Follow-up Sequence",
      trigger: "New lead captured",
      actions: ["Send welcome email", "Create task", "Add to CRM", "Schedule follow-up"],
      status: "active",
      executions: 156,
      lastRun: "5 minutes ago",
    },
    {
      id: "3",
      name: "Appointment Reminders",
      trigger: "24 hours before appointment",
      actions: ["Send SMS reminder", "Send email reminder", "Log activity"],
      status: "active",
      executions: 89,
      lastRun: "1 hour ago",
    },
    {
      id: "4",
      name: "No-Show Follow-up",
      trigger: "Appointment marked as no-show",
      actions: ["Send apology email", "Offer reschedule", "Create follow-up task"],
      status: "inactive",
      executions: 12,
      lastRun: "3 days ago",
    },
  ])

  const [showWebhookDialog, setShowWebhookDialog] = useState(false)
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [newWebhookName, setNewWebhookName] = useState("")
  const [newWebhookUrl, setNewWebhookUrl] = useState("")
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([])

  const handleAddWebhook = () => {
    if (!newWebhookName.trim() || !newWebhookUrl.trim()) return

    const newWebhook: Webhook = {
      id: Date.now().toString(),
      name: newWebhookName,
      url: newWebhookUrl,
      events: newWebhookEvents,
      status: "active",
      lastTriggered: "Never",
      successRate: 100,
    }

    setWebhooks([...webhooks, newWebhook])
    setNewWebhookName("")
    setNewWebhookUrl("")
    setNewWebhookEvents([])
    setShowWebhookDialog(false)
  }

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((w) => w.id !== id))
  }

  const handleToggleWebhook = (id: string) => {
    setWebhooks(
      webhooks.map((w) => (w.id === id ? { ...w, status: w.status === "active" ? "inactive" : "active" } : w)),
    )
  }

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(
      workflows.map((w) => (w.id === id ? { ...w, status: w.status === "active" ? "inactive" : "active" } : w)),
    )
  }

  const handleCopyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const totalWebhooks = webhooks.length
  const activeWebhooks = webhooks.filter((w) => w.status === "active").length
  const totalWorkflows = workflows.length
  const activeWorkflows = workflows.filter((w) => w.status === "active").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Automation & Webhooks</h1>
          <p className="text-muted-foreground">Manage n8n workflows and webhook integrations</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowWebhookDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Webhook
          </Button>
          <Button size="sm" onClick={() => setShowWorkflowDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Webhooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalWebhooks}</div>
            <p className="text-xs text-muted-foreground mt-1">{activeWebhooks} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalWorkflows}</div>
            <p className="text-xs text-muted-foreground mt-1">{activeWorkflows} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Webhook reliability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{workflows.reduce((sum, w) => sum + w.executions, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Workflow runs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="webhooks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{webhook.name}</h3>
                        <Badge variant={webhook.status === "active" ? "default" : "secondary"}>{webhook.status}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                          <Code className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <code className="text-xs text-muted-foreground flex-1 truncate">{webhook.url}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyWebhookUrl(webhook.url)}
                            className="flex-shrink-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Last triggered: {webhook.lastTriggered}</span>
                          <span className="text-muted-foreground">Success rate: {webhook.successRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleWebhook(webhook.id)}
                        className={webhook.status === "active" ? "bg-green-50" : ""}
                      >
                        {webhook.status === "active" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Inactive
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedWebhook(webhook)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteWebhook(webhook.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-900 font-medium mb-2">Available Events:</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• appointment.created - When a new appointment is scheduled</li>
                  <li>• appointment.updated - When an appointment is modified</li>
                  <li>• appointment.cancelled - When an appointment is cancelled</li>
                  <li>• appointment.reminder - 24 hours before appointment</li>
                  <li>• lead.created - When a new lead is captured</li>
                  <li>• patient.updated - When patient information changes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{workflow.name}</h3>
                        <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                          {workflow.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="p-2 rounded-lg bg-muted">
                          <p className="text-sm font-medium text-muted-foreground">Trigger:</p>
                          <p className="text-sm">{workflow.trigger}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Actions:</p>
                          <div className="flex flex-wrap gap-1">
                            {workflow.actions.map((action, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Executions: {workflow.executions}</span>
                          <span className="text-muted-foreground">Last run: {workflow.lastRun}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleWorkflow(workflow.id)}
                        className={workflow.status === "active" ? "bg-green-50" : ""}
                      >
                        {workflow.status === "active" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Inactive
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedWorkflow(workflow)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Zap className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Email on Appointment", description: "Send email when appointment is created" },
                { name: "SMS Reminder", description: "Send SMS reminder 24 hours before appointment" },
                { name: "Lead to CRM", description: "Automatically add new leads to CRM" },
                { name: "Payment Notification", description: "Notify staff when payment is received" },
              ].map((template, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Use Template
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showWebhookDialog} onOpenChange={setShowWebhookDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook Name</label>
              <Input
                placeholder="e.g., Appointment Confirmation"
                value={newWebhookName}
                onChange={(e) => setNewWebhookName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook URL</label>
              <Input
                placeholder="https://n8n.example.com/webhook/..."
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Events to Trigger</label>
              <div className="space-y-2">
                {[
                  "appointment.created",
                  "appointment.updated",
                  "appointment.cancelled",
                  "lead.created",
                  "patient.updated",
                ].map((event) => (
                  <div key={event} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={event}
                      checked={newWebhookEvents.includes(event)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewWebhookEvents([...newWebhookEvents, event])
                        } else {
                          setNewWebhookEvents(newWebhookEvents.filter((ev) => ev !== event))
                        }
                      }}
                      className="rounded"
                    />
                    <label htmlFor={event} className="text-sm cursor-pointer">
                      {event}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWebhookDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWebhook}>Create Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
