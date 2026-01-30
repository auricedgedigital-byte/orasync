"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckCircle2, AlertCircle, Zap, Plus, Trash2 } from "lucide-react"

interface CalendarIntegration {
  id: string
  provider: "google" | "outlook" | "apple"
  email: string
  status: "connected" | "disconnected"
  lastSync: string
  syncEnabled: boolean
}

interface AvailabilitySlot {
  id: string
  provider: string
  dayOfWeek: string
  startTime: string
  endTime: string
  isActive: boolean
}

export default function CalendarSync() {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([
    {
      id: "1",
      provider: "google",
      email: "practice@gmail.com",
      status: "connected",
      lastSync: "2 minutes ago",
      syncEnabled: true,
    },
    {
      id: "2",
      provider: "outlook",
      email: "practice@outlook.com",
      status: "disconnected",
      lastSync: "Never",
      syncEnabled: false,
    },
  ])

  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([
    {
      id: "1",
      provider: "Dr. Sarah Mitchell",
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
    },
    {
      id: "2",
      provider: "Dr. Sarah Mitchell",
      dayOfWeek: "Tuesday",
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
    },
    {
      id: "3",
      provider: "Dr. Sarah Mitchell",
      dayOfWeek: "Wednesday",
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
    },
    {
      id: "4",
      provider: "Dr. James Wilson",
      dayOfWeek: "Monday",
      startTime: "10:00",
      endTime: "18:00",
      isActive: true,
    },
    {
      id: "5",
      provider: "Dr. James Wilson",
      dayOfWeek: "Thursday",
      startTime: "10:00",
      endTime: "18:00",
      isActive: true,
    },
    {
      id: "6",
      provider: "Hygienist Lisa Brown",
      dayOfWeek: "Monday",
      startTime: "08:00",
      endTime: "16:00",
      isActive: true,
    },
  ])

  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<"google" | "outlook" | "apple">("google")
  const [newEmail, setNewEmail] = useState("")
  const [activeTab, setActiveTab] = useState("integrations")

  const handleConnectCalendar = () => {
    if (!newEmail.trim()) return

    const newIntegration: CalendarIntegration = {
      id: Date.now().toString(),
      provider: selectedProvider,
      email: newEmail,
      status: "connected",
      lastSync: "Just now",
      syncEnabled: true,
    }

    setIntegrations([...integrations, newIntegration])
    setNewEmail("")
    setShowConnectDialog(false)
  }

  const handleDisconnect = (id: string) => {
    setIntegrations(
      integrations.map((int) => (int.id === id ? { ...int, status: "disconnected", syncEnabled: false } : int)),
    )
  }

  const handleToggleSync = (id: string) => {
    setIntegrations(integrations.map((int) => (int.id === id ? { ...int, syncEnabled: !int.syncEnabled } : int)))
  }

  const handleDeleteAvailability = (id: string) => {
    setAvailabilitySlots(availabilitySlots.filter((slot) => slot.id !== id))
  }

  const handleToggleAvailability = (id: string) => {
    setAvailabilitySlots(
      availabilitySlots.map((slot) => (slot.id === id ? { ...slot, isActive: !slot.isActive } : slot)),
    )
  }

  const connectedCount = integrations.filter((i) => i.status === "connected").length
  const syncedCount = integrations.filter((i) => i.syncEnabled).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar Sync & Availability</h1>
          <p className="text-muted-foreground">Manage calendar integrations and provider availability</p>
        </div>
        <Button size="sm" onClick={() => setShowConnectDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Connect Calendar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Connected Calendars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{connectedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Active integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Syncing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{syncedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Real-time sync enabled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Availability Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{availabilitySlots.filter((s) => s.isActive).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active time slots</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="integrations">Calendar Integrations</TabsTrigger>
          <TabsTrigger value="availability">Provider Availability</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          {activeTab === "integrations" && (
            <>
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium capitalize">{integration.provider} Calendar</div>
                          <div className="text-sm text-muted-foreground">{integration.email}</div>
                          <div className="text-xs text-muted-foreground mt-1">Last sync: {integration.lastSync}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                          {integration.status}
                        </Badge>
                        {integration.status === "connected" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleSync(integration.id)}
                              className={integration.syncEnabled ? "bg-green-50" : ""}
                            >
                              <Zap className="w-4 h-4 mr-1" />
                              {integration.syncEnabled ? "Syncing" : "Paused"}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDisconnect(integration.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {activeTab === "availability" && (
            <>
              {["Dr. Sarah Mitchell", "Dr. James Wilson", "Hygienist Lisa Brown"].map((provider) => (
                <Card key={provider}>
                  <CardHeader>
                    <CardTitle className="text-base">{provider}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {availabilitySlots
                      .filter((slot) => slot.provider === provider)
                      .map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <div className="font-medium text-sm">{slot.dayOfWeek}</div>
                            <div className="text-sm text-muted-foreground">
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleAvailability(slot.id)}
                              className={slot.isActive ? "bg-green-50" : ""}
                            >
                              {slot.isActive ? (
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
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteAvailability(slot.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </Tabs>

      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Connect Calendar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Calendar Provider</label>
              <Select value={selectedProvider} onValueChange={(v) => setSelectedProvider(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Calendar</SelectItem>
                  <SelectItem value="outlook">Outlook Calendar</SelectItem>
                  <SelectItem value="apple">Apple Calendar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input placeholder="practice@gmail.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-900">
                You'll be redirected to{" "}
                {selectedProvider === "google" ? "Google" : selectedProvider === "outlook" ? "Microsoft" : "Apple"} to
                authorize access to your calendar.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnectCalendar}>Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
