"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Trash2, Eye, AlertCircle, Zap, Sparkles, X, ArrowRight, Check, Play } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"

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

interface CampaignBuilderProps {
  onCancel: () => void
  onSuccess: () => void
}

export function CampaignBuilder({ onCancel, onSuccess }: CampaignBuilderProps) {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("basic")

  const [campaignName, setCampaignName] = useState("")
  const [conditions, setConditions] = useState<Condition[]>([])
  const [showConditionDialog, setShowConditionDialog] = useState(false)
  const [newCondition, setNewCondition] = useState<Condition>({
    id: "",
    type: "last_visit",
    operator: "gt",
    value: "",
  })

  // Defaults
  const [rateLimit, setRateLimit] = useState(100)
  const [batchSize, setBatchSize] = useState(50)
  const [pauseBetweenBatches, setPauseBetweenBatches] = useState(5)

  const [dripSteps, setDripSteps] = useState<DripStep[]>([
    { day: 0, message: "Hi {first_name}, it's time for your check-up at Orasync Dental. Reply YES to book.", channel: "sms" },
  ])

  const [showDripDialog, setShowDripDialog] = useState(false)
  const [editingDripIndex, setEditingDripIndex] = useState<number | null>(null)
  const [newDripStep, setNewDripStep] = useState<DripStep>({ day: 0, message: "", channel: "sms" })

  const [abTestEnabled, setAbTestEnabled] = useState(false)
  const [templateA, setTemplateA] = useState("")
  const [templateB, setTemplateB] = useState("")

  const [segmentCount, setSegmentCount] = useState(245) // Mock segment count for now
  const [isLaunching, setIsLaunching] = useState(false)
  const [launchError, setLaunchError] = useState<string | null>(null)

  // Suggestion System
  const applyNovaSuggestion = () => {
    setCampaignName("Recall: Overdue Hygiene > 6 Months (Nova Optimized)")
    setConditions([
      { id: "1", type: "last_visit", operator: "gt", value: "180" },
      { id: "2", type: "tags", operator: "excludes", value: "scheduled" }
    ])
    setDripSteps([
      { day: 0, message: "Hi {first_name}, just a friendly reminder from Dr. Smith at Orasync. It's been over 6 months since your last cleaning! Reply YES to book a slot.", channel: "sms" },
      { day: 3, message: "Hey {first_name}, we still have a few openings this week for comprehensive exams. Let us know if you'd like one!", channel: "email" }
    ])
    setSegmentCount(128)
  }

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
      last_visit: "Last Visit (Days)",
      tags: "Tags",
      treatment: "Treatment Type",
      provider: "Provider",
      invoice: "Open Invoice",
      new_patient: "New Patient context",
    }
    return `${typeLabels[condition.type]} ${condition.operator} ${condition.value}`
  }

  const handleLaunchCampaign = async () => {
    if (!campaignName) {
      setLaunchError("Please enter a campaign name")
      return
    }
    if (!user?.id) return

    setIsLaunching(true)
    setLaunchError(null)

    try {
      const campaignData = {
        name: campaignName,
        segment_criteria: conditions,
        channels: [...new Set(dripSteps.map((s) => s.channel))], // Deduplicate channels
        batch_size: batchSize,
        sends_per_minute: rateLimit,
        drip_sequence: dripSteps,
        a_b_test: abTestEnabled,
      }

      // Create
      const createRes = await fetch(`/api/v1/clinics/${user.id}/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      })

      if (!createRes.ok) throw new Error("Failed to create campaign")
      const campaign = await createRes.json()

      // Start
      const startRes = await fetch(`/api/v1/clinics/${user.id}/campaigns/${campaign.id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!startRes.ok) throw new Error("Failed to start campaign")

      onSuccess()
    } catch (error) {
      console.error("Campaign launch error:", error)
      setLaunchError(error instanceof Error ? error.message : "Failed to launch campaign")
    } finally {
      setIsLaunching(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header / Nova Suggestion */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent p-1 rounded-2xl border border-indigo-500/20">
        <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Nova AI Suggestion</h3>
              <p className="text-xs text-muted-foreground">Based on your recent patient data, we found 128 patients overdue for hygiene.</p>
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={applyNovaSuggestion} className="bg-indigo-500 text-white hover:bg-indigo-600 border-none shadow-lg shadow-indigo-500/20">
            Auto-Fill Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar: Steps */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border/50 bg-muted/5">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Configuration Steps</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(["basic", "segment", "drip", "review"] as const).map((step, idx) => (
                <div
                  key={step}
                  onClick={() => setActiveTab(step)}
                  className={cn(
                    "flex items-center gap-3 p-4 border-l-2 cursor-pointer transition-all hover:bg-muted/10",
                    activeTab === step
                      ? "border-primary bg-primary/5 text-primary font-medium"
                      : "border-transparent text-muted-foreground"
                  )}
                >
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs border", activeTab === step ? "border-primary bg-background" : "border-muted-foreground/30")}>
                    {idx + 1}
                  </div>
                  <span className="capitalize">{step} Setup</span>
                  {activeTab === step && <ArrowRight className="h-4 w-4 ml-auto opacity-50" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary Card */}
          {activeTab === 'review' && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4" />
                  Launch Ready
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Audience</span>
                  <span className="font-bold">{segmentCount} patients</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Channels</span>
                  <span className="font-bold uppercase">{[...new Set(dripSteps.map(s => s.channel))].join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Steps</span>
                  <span className="font-bold">{dripSteps.length} messages</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

            {/* Basic Info */}
            <TabsContent value="basic" className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                  <CardDescription>Name your campaign and set its goal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Name</label>
                    <Input
                      placeholder="e.g. Summer Whitening Promo"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="text-lg font-medium p-6"
                    />
                  </div>

                  <Button onClick={() => setActiveTab("segment")} className="w-full" variant="outline">
                    Next: Define Audience
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Segment */}
            <TabsContent value="segment" className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Audience Segment</CardTitle>
                    <CardDescription>Who should receive this campaign?</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1 bg-primary/10 text-primary">{segmentCount} est. patients</Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {conditions.length === 0 ? (
                      <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                        <p>No filters applied. Campaign will be sent to ALL patients.</p>
                        <Button variant="link" onClick={() => setShowConditionDialog(true)}>Add a filter</Button>
                      </div>
                    ) : (
                      conditions.map((condition) => (
                        <div key={condition.id} className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              IF
                            </div>
                            <span className="font-mono text-sm">{getConditionLabel(condition)}</span>
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => removeCondition(condition.id)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={() => setShowConditionDialog(true)} variant="outline" className="flex-1 border-dashed">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Condition
                    </Button>
                    <Button onClick={() => setActiveTab("drip")} className="flex-1">
                      Next: Message Sequence
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Drip Sequence */}
            <TabsContent value="drip" className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Message Sequence</CardTitle>
                    <CardDescription>Design your follow-up cadence.</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setShowDripDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dripSteps.map((step, index) => (
                    <div key={index} className="relative pl-8 border-l-2 border-border/50 pb-8 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                      <div className="p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-2">
                            <Badge variant="outline">Day {step.day}</Badge>
                            <Badge className="uppercase text-[10px]">{step.channel}</Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => editDripStep(index)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => removeDripStep(index)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{step.message}</p>
                      </div>
                    </div>
                  ))}

                  <Button onClick={() => setActiveTab("review")} className="w-full mt-4">
                    Next: Review & Launch
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Review */}
            <TabsContent value="review" className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Launch Confirmation</CardTitle>
                  <CardDescription>Double check everything before starting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {launchError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5" />
                      <p className="text-sm font-medium">{launchError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/10 border border-border/50">
                      <span className="text-xs text-muted-foreground uppercase tracking-widest">Rate Limit</span>
                      <p className="text-lg font-bold">{rateLimit} / min</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/10 border border-border/50">
                      <span className="text-xs text-muted-foreground uppercase tracking-widest">Batch Size</span>
                      <p className="text-lg font-bold">{batchSize} msgs</p>
                    </div>
                  </div>

                  <CardFooter className="px-0 flex-col gap-3">
                    <Button
                      className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
                      onClick={handleLaunchCampaign}
                      disabled={isLaunching}
                    >
                      {isLaunching ? (
                        <>
                          <Zap className="w-5 h-5 mr-2 animate-pulse" />
                          Launching Campaign...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2 fill-current" />
                          Launch Campaign Now
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" onClick={onCancel} disabled={isLaunching}>
                      Cancel and Save Draft
                    </Button>
                  </CardFooter>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Condition Dialog */}
      <Dialog open={showConditionDialog} onOpenChange={setShowConditionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Filter Condition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Condition Type</label>
              <select
                className="w-full px-3 py-2 bg-background border rounded-md"
                value={newCondition.type}
                onChange={(e) => setNewCondition({ ...newCondition, type: e.target.value as any })}
              >
                <option value="last_visit">Last Visit Days</option>
                <option value="tags">Tags</option>
                <option value="treatment">Treatment Type</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Operator</label>
              <select
                className="w-full px-3 py-2 bg-background border rounded-md"
                value={newCondition.operator}
                onChange={(e) => setNewCondition({ ...newCondition, operator: e.target.value as any })}
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
            <Button variant="ghost" onClick={() => setShowConditionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addCondition}>Add Condition</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drip Step Dialog */}
      <Dialog open={showDripDialog} onOpenChange={setShowDripDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingDripIndex !== null ? "Edit" : "Add"} Message Step</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Day Offset (0 = Immediate)</label>
                <Input
                  type="number"
                  value={newDripStep.day}
                  onChange={(e) => setNewDripStep({ ...newDripStep, day: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Channel</label>
                <select
                  className="w-full px-3 py-2 bg-background border rounded-md"
                  value={newDripStep.channel}
                  onChange={(e) => setNewDripStep({ ...newDripStep, channel: e.target.value as any })}
                >
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message Content</label>
              <Textarea
                value={newDripStep.message}
                onChange={(e) => setNewDripStep({ ...newDripStep, message: e.target.value })}
                rows={5}
                placeholder="Hi {first_name}, ..."
              />
              <p className="text-xs text-muted-foreground">Available variables: {'{first_name}'}, {'{last_name}'}, {'{practice_name}'}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDripDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addDripStep}>{editingDripIndex !== null ? "Update" : "Add"} Step</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
