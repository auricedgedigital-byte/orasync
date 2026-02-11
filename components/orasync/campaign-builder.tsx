"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Trash2, Eye, AlertCircle, Zap, Sparkles } from "lucide-react"
import { useEffect } from "react"

interface Condition {
  id: string
  type: "last_visit" | "tags" | "treatment" | "provider" | "invoice" | "new_patient"
  operator: "gt" | "lt" | "includes" | "excludes"
  value: string
}

interface DripStep {
  day: number
  message: string
  channel: "sms" | "email" | "whatsapp"
}

export function CampaignBuilder() {
  const [campaignName, setCampaignName] = useState("")
  const [conditions, setConditions] = useState<Condition[]>([])
  const [showConditionDialog, setShowConditionDialog] = useState(false)
  const [newCondition, setNewCondition] = useState<Condition>({
    id: "",
    type: "last_visit",
    operator: "gt",
    value: "",
  })

  const [rateLimit, setRateLimit] = useState(100)
  const [batchSize, setBatchSize] = useState(50)
  const [pauseBetweenBatches, setPauseBetweenBatches] = useState(5)

  const [dripSteps, setDripSteps] = useState<DripStep[]>([
    { day: 0, message: "Day 0: Initial message", channel: "sms" },
    { day: 3, message: "Day 3: Follow-up message", channel: "email" },
    { day: 7, message: "Day 7: Final message", channel: "sms" },
  ])

  const [showDripDialog, setShowDripDialog] = useState(false)
  const [editingDripIndex, setEditingDripIndex] = useState<number | null>(null)
  const [newDripStep, setNewDripStep] = useState<DripStep>({ day: 0, message: "", channel: "sms" })

  const [previewMode, setPreviewMode] = useState(false)
  const [abTestEnabled, setAbTestEnabled] = useState(false)
  const [templateA, setTemplateA] = useState("Welcome! We'd love to see you soon.")
  const [templateB, setTemplateB] = useState("Hi! Ready for your next appointment?")

  const [segmentCount, setSegmentCount] = useState(245)

  const [trialCredits, setTrialCredits] = useState({
    reactivation_emails: 0,
    reactivation_sms: 0,
    reactivation_whatsapp: 0,
    campaigns_started: 0,
  })

  // Fetch real credits and recipient counts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clinicId = "clinic-001" // In production, get from context
        const res = await fetch(`/api/v1/clinics/${clinicId}/credits`)
        if (res.ok) {
          const data = await res.json()
          setTrialCredits(data)
        }
      } catch (err) {
        console.error("Failed to fetch credits:", err)
      }
    }
    fetchData()
  }, [])

  const [isLaunching, setIsLaunching] = useState(false)
  const [launchError, setLaunchError] = useState<string | null>(null)

  const addCondition = () => {
    if (newCondition.value) {
      setConditions([...conditions, { ...newCondition, id: Date.now().toString() }])
      setNewCondition({ id: "", type: "last_visit", operator: "gt", value: "" })
      setShowConditionDialog(false)
    }
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }

  const addDripStep = () => {
    if (editingDripIndex !== null) {
      const updated = [...dripSteps]
      updated[editingDripIndex] = newDripStep
      setDripSteps(updated)
      setEditingDripIndex(null)
    } else {
      setDripSteps([...dripSteps, newDripStep])
    }
    setNewDripStep({ day: 0, message: "", channel: "sms" })
    setShowDripDialog(false)
  }

  const removeDripStep = (index: number) => {
    setDripSteps(dripSteps.filter((_, i) => i !== index))
  }

  const editDripStep = (index: number) => {
    setNewDripStep(dripSteps[index])
    setEditingDripIndex(index)
    setShowDripDialog(true)
  }

  const getConditionLabel = (condition: Condition) => {
    const typeLabels: Record<string, string> = {
      last_visit: "Last Visit",
      tags: "Tags",
      treatment: "Treatment Type",
      provider: "Provider",
      invoice: "Open Invoice",
      new_patient: "New Patient",
    }
    const operatorLabels: Record<string, string> = {
      gt: "Greater than",
      lt: "Less than",
      includes: "Includes",
      excludes: "Excludes",
    }
    return `${typeLabels[condition.type]} ${operatorLabels[condition.operator]} ${condition.value}`
  }

  const calculateCreditCost = () => {
    let emailCount = 0
    let smsCount = 0
    let whatsappCount = 0

    dripSteps.forEach((step) => {
      const count = abTestEnabled ? Math.ceil(segmentCount / 2) : segmentCount
      if (step.channel === "email") emailCount += count
      else if (step.channel === "sms") smsCount += count
      else if (step.channel === "whatsapp") whatsappCount += count
    })

    return {
      emails: emailCount,
      sms: smsCount,
      whatsapp: whatsappCount,
      total: emailCount + smsCount + whatsappCount,
    }
  }

  const creditCost = calculateCreditCost()
  const hasInsufficientCredits =
    creditCost.emails > trialCredits.reactivation_emails ||
    creditCost.sms > trialCredits.reactivation_sms ||
    creditCost.whatsapp > trialCredits.reactivation_whatsapp ||
    trialCredits.campaigns_started < 1

  const handleLaunchCampaign = async () => {
    if (!campaignName) {
      alert("Please enter a campaign name")
      return
    }

    if (hasInsufficientCredits) {
      alert("Insufficient credits. Please buy more credits first.")
      return
    }

    setIsLaunching(true)
    setLaunchError(null)

    try {
      const clinicId = "clinic-001"

      const campaignData = {
        name: campaignName,
        segment_criteria: conditions,
        channels: dripSteps.map((s) => s.channel),
        batch_size: batchSize,
        sends_per_minute: rateLimit,
        drip_sequence: dripSteps,
        a_b_test: abTestEnabled,
      }

      const createResponse = await fetch(`/api/v1/clinics/${clinicId}/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      })

      if (!createResponse.ok) {
        throw new Error("Failed to create campaign")
      }

      const campaign = await createResponse.json()

      const startResponse = await fetch(`/api/v1/clinics/${clinicId}/campaigns/${campaign.id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!startResponse.ok) {
        const error = await startResponse.json()
        throw new Error(error.error || "Failed to start campaign")
      }

      alert("Campaign launched successfully!")
      setCampaignName("")
      setConditions([])
      setDripSteps([{ day: 0, message: "Day 0: Initial message", channel: "sms" }])
    } catch (error) {
      console.error("[v0] Campaign launch error:", error)
      setLaunchError(error instanceof Error ? error.message : "Failed to launch campaign")
    } finally {
      setIsLaunching(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaign Builder</h1>
          <p className="text-muted-foreground">Create advanced patient engagement campaigns</p>
        </div>
        <Button
          variant="outline"
          className="bg-indigo-600/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-600/20"
          onClick={async () => {
            // Mock calling Nova
            alert("Nova is analyzing your patient base to suggest the optimal campaign...")
          }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Nova Suggestions
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="segment">Segment</TabsTrigger>
          <TabsTrigger value="rate">Rate Limit</TabsTrigger>
          <TabsTrigger value="drip">Drip Sequence</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Set up your campaign basics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Name</label>
                <Input
                  placeholder="e.g., Spring Cleaning Special"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Reactivation", "Follow-up", "Welcome", "Promotion"].map((type) => (
                    <Button key={type} variant="outline" className="bg-transparent">
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Channel</label>
                <div className="grid grid-cols-4 gap-2">
                  {["SMS", "Email", "WhatsApp", "Push"].map((channel) => (
                    <Button key={channel} variant="outline" className="bg-transparent">
                      {channel}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segment Builder Tab */}
        <TabsContent value="segment" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Segment Builder</CardTitle>
                <CardDescription>Define who receives this campaign</CardDescription>
              </div>
              <Badge className="bg-blue-500">{segmentCount} patients</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {conditions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No conditions added yet. Add your first condition.</p>
                ) : (
                  conditions.map((condition) => (
                    <div key={condition.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="text-sm">{getConditionLabel(condition)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCondition(condition.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <Button onClick={() => setShowConditionDialog(true)} variant="outline" className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Condition
              </Button>

              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm font-medium mb-2">Segment Preview</p>
                <p className="text-xs text-muted-foreground">
                  {conditions.length === 0
                    ? "All patients will be included"
                    : `${segmentCount} patients match your criteria`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Condition Dialog */}
          <Dialog open={showConditionDialog} onOpenChange={setShowConditionDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Condition</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="condition-type" className="text-sm font-medium">Condition Type</label>
                  <select
                    id="condition-type"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newCondition.type}
                    onChange={(e) => setNewCondition({ ...newCondition, type: e.target.value as Condition["type"] })}
                  >
                    <option value="last_visit">Last Visit Days</option>
                    <option value="tags">Tags</option>
                    <option value="treatment">Treatment Type</option>
                    <option value="provider">Provider</option>
                    <option value="invoice">Open Invoice</option>
                    <option value="new_patient">New Patient</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="operator" className="text-sm font-medium">Operator</label>
                  <select
                    id="operator"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newCondition.operator}
                    onChange={(e) =>
                      setNewCondition({ ...newCondition, operator: e.target.value as Condition["operator"] })
                    }
                  >
                    <option value="gt">Greater than</option>
                    <option value="lt">Less than</option>
                    <option value="includes">Includes</option>
                    <option value="excludes">Excludes</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Value</label>
                  <Input
                    placeholder="Enter value"
                    value={newCondition.value}
                    onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConditionDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addCondition}>Add Condition</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Rate Limit Tab */}
        <TabsContent value="rate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting & Batch Controls</CardTitle>
              <CardDescription>Control how messages are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sends Per Minute</p>
                    <p className="text-sm text-muted-foreground">Maximum messages per minute</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={rateLimit}
                      onChange={(e) => setRateLimit(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm">/min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Batch Size</p>
                    <p className="text-sm text-muted-foreground">Messages per batch</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm">messages</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pause Between Batches</p>
                    <p className="text-sm text-muted-foreground">Wait time between batches</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={pauseBetweenBatches}
                      onChange={(e) => setPauseBetweenBatches(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm">min</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium mb-2">Estimated Send Time</p>
                <p className="text-xs text-muted-foreground">
                  At current settings, {segmentCount} messages will take approximately{" "}
                  {Math.ceil((segmentCount / rateLimit) * (pauseBetweenBatches + 1))} minutes to send.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drip Sequence Tab */}
        <TabsContent value="drip" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Drip Sequence</CardTitle>
                <CardDescription>Multi-step message sequence</CardDescription>
              </div>
              <Button size="sm" onClick={() => setShowDripDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {dripSteps.map((step, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium">Day {step.day}</div>
                    <div className="text-sm text-muted-foreground">{step.message}</div>
                    <Badge variant="outline" className="mt-2">
                      {step.channel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => editDripStep(index)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeDripStep(index)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Drip Step Dialog */}
          <Dialog open={showDripDialog} onOpenChange={setShowDripDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDripIndex !== null ? "Edit" : "Add"} Drip Step</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Day</label>
                  <Input
                    type="number"
                    value={newDripStep.day}
                    onChange={(e) => setNewDripStep({ ...newDripStep, day: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={newDripStep.message}
                    onChange={(e) => setNewDripStep({ ...newDripStep, message: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="channel-select" className="text-sm font-medium">Channel</label>
                  <select
                    id="channel-select"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newDripStep.channel}
                    onChange={(e) => setNewDripStep({ ...newDripStep, channel: e.target.value as DripStep["channel"] })}
                  >
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDripDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addDripStep}>{editingDripIndex !== null ? "Update" : "Add"} Step</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Preview</CardTitle>
              <CardDescription>See how your campaign will look</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm font-medium">First 5 Messages Preview:</p>
                {dripSteps.slice(0, 5).map((step, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge>Day {step.day}</Badge>
                      <Badge variant="outline">{step.channel.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm">{step.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Sample patient: John Doe | Last visit: 45 days ago
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>A/B Testing</CardTitle>
                <CardDescription>Test two message templates</CardDescription>
              </div>
              <Switch checked={abTestEnabled} onCheckedChange={setAbTestEnabled} />
            </CardHeader>
            {abTestEnabled && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template A</label>
                    <Textarea value={templateA} onChange={(e) => setTemplateA(e.target.value)} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template B</label>
                    <Textarea value={templateB} onChange={(e) => setTemplateB(e.target.value)} rows={3} />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted text-sm">
                  <p className="font-medium mb-1">A/B Test Results (Simulated)</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p>Template A: 24% open rate</p>
                      <p>Template B: 28% open rate</p>
                    </div>
                    <div>
                      <p>Template A: 12 bookings</p>
                      <p>Template B: 15 bookings</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          <Card
            className={hasInsufficientCredits ? "border-red-500/50 bg-red-50/50" : "border-green-500/50 bg-green-50/50"}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Credit Cost Preview
              </CardTitle>
              <CardDescription>Estimated credits needed to launch this campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg border">
                  <div className="text-sm text-muted-foreground">Emails</div>
                  <div className="text-2xl font-bold">{creditCost.emails}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Available: {trialCredits.reactivation_emails}
                  </div>
                  {creditCost.emails > trialCredits.reactivation_emails && (
                    <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Insufficient
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-lg border">
                  <div className="text-sm text-muted-foreground">SMS</div>
                  <div className="text-2xl font-bold">{creditCost.sms}</div>
                  <div className="text-xs text-muted-foreground mt-1">Available: {trialCredits.reactivation_sms}</div>
                  {creditCost.sms > trialCredits.reactivation_sms && (
                    <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Insufficient
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-lg border">
                  <div className="text-sm text-muted-foreground">WhatsApp</div>
                  <div className="text-2xl font-bold">{creditCost.whatsapp}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Available: {trialCredits.reactivation_whatsapp}
                  </div>
                  {creditCost.whatsapp > trialCredits.reactivation_whatsapp && (
                    <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Insufficient
                    </div>
                  )}
                </div>
              </div>

              {hasInsufficientCredits && (
                <div className="p-3 rounded-lg bg-red-100 border border-red-300">
                  <p className="text-sm text-red-900 font-medium">Insufficient Credits</p>
                  <p className="text-xs text-red-800 mt-1">
                    You don't have enough credits to launch this campaign. Buy more credits or reduce the segment size.
                  </p>
                </div>
              )}

              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm font-medium">Campaign Cost Summary</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total messages: {creditCost.total} | Campaigns remaining: {trialCredits.campaigns_started}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Eye className="w-4 h-4 mr-2" />
              Dry Run
            </Button>
            <Button className="flex-1" disabled={hasInsufficientCredits || isLaunching} onClick={handleLaunchCampaign}>
              {isLaunching ? "Launching..." : "Launch Campaign"}
            </Button>
          </div>

          {launchError && (
            <div className="p-3 rounded-lg bg-red-100 border border-red-300">
              <p className="text-sm text-red-900">{launchError}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
