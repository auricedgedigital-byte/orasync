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
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Header / Nova Suggestion */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-3xl rounded-[2rem] opacity-50 pointer-events-none" />
        <div className="glass-card p-1 rounded-[2rem] border-primary/20 bg-primary/5 overflow-hidden">
          <div className="bg-background/40 backdrop-blur-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-primary/20 p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight">Nova AI Intelligence</h3>
                <p className="text-sm font-medium text-muted-foreground">"I've analyzed your database and found <span className="text-primary font-bold">128 patients</span> ideal for a hygiene reactivation."</p>
              </div>
            </div>
            <Button size="lg" onClick={applyNovaSuggestion} className="rounded-2xl px-8 h-14 font-black shadow-xl shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.05] active:scale-95">
              Auto-Pilot Launch
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Steps */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card rounded-[2rem] border-border/50 overflow-hidden bg-card/30">
            <CardHeader className="pb-4 pt-8 px-6">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Campaign Logic</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {(["basic", "segment", "drip", "review"] as const).map((step, idx) => (
                <div
                  key={step}
                  onClick={() => setActiveTab(step)}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all group",
                    activeTab === step
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/30"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all shadow-sm",
                    activeTab === step ? "border-primary bg-background scale-110" : "border-muted-foreground/20 bg-card/50"
                  )}>
                    {idx + 1}
                  </div>
                  <span className="capitalize font-black tracking-tight text-sm">{step} Setup</span>
                  {activeTab === step && <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto shadow-[0_0_10px_rgba(124,58,237,0.5)]" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Summary Card */}
          <Card className="glass-card rounded-[2rem] border-primary/20 bg-primary/5 p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-primary fill-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Stats</span>
            </div>
            <div className="space-y-4 font-bold text-sm">
              <div className="flex justify-between items-center bg-background/40 p-3 rounded-xl border border-border/40">
                <span className="text-muted-foreground">Reach</span>
                <span className="text-foreground">{segmentCount} Patients</span>
              </div>
              <div className="flex justify-between items-center bg-background/40 p-3 rounded-xl border border-border/40">
                <span className="text-muted-foreground">Steps</span>
                <span className="text-foreground">{dripSteps.length} Messages</span>
              </div>
              <div className="flex justify-between items-center bg-background/40 p-3 rounded-xl border border-border/40">
                <span className="text-muted-foreground">Channels</span>
                <span className="text-primary truncate ml-4 font-black uppercase tracking-tighter">
                  {[...new Set(dripSteps.map(s => s.channel))].join(', ') || 'None'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

            {/* Basic Info */}
            <TabsContent value="basic" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="glass-card rounded-[2rem] border-border/50 p-8">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-black">Campaign Details</CardTitle>
                  <CardDescription className="text-base font-medium">Name your campaign and set its strategic goal.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 py-6 space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Campaign Name</label>
                    <Input
                      placeholder="e.g. Summer Whitening High-Impact Promo"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="text-xl font-black h-16 rounded-2xl border-border/60 bg-background/40 px-6 focus:ring-primary/20 focus:border-primary/40 shadow-inner"
                    />
                  </div>

                  <Button onClick={() => setActiveTab("segment")} className="w-full h-14 rounded-2xl text-lg font-black bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all">
                    Next: Define Audience
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Segment */}
            <TabsContent value="segment" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="glass-card rounded-[2rem] border-border/50 p-8">
                <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black">Audience Engine</CardTitle>
                    <CardDescription className="text-base font-medium">Who should receive this intelligence?</CardDescription>
                  </div>
                  <div className="bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20 shadow-sm">
                    <span className="text-2xl font-black text-primary">{segmentCount}</span>
                    <span className="text-[10px] font-black uppercase text-primary ml-2 tracking-widest">Patients</span>
                  </div>
                </CardHeader>
                <CardContent className="px-0 py-6 space-y-8">
                  <div className="space-y-4">
                    {conditions.length === 0 ? (
                      <div className="p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5 border-border/60 group hover:border-primary/40 transition-colors">
                        <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center border border-border/50 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          <Plus className="w-8 h-8 opacity-30" />
                        </div>
                        <p className="font-bold text-lg mb-1">Total Reach Applied</p>
                        <p className="text-sm opacity-70">No filters applied. Campaign will target your whole base.</p>
                        <Button variant="link" onClick={() => setShowConditionDialog(true)} className="text-primary font-bold mt-2">Add target criteria</Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {conditions.map((condition) => (
                          <div key={condition.id} className="flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-background/40 hover:bg-background/60 transition-colors group">
                            <div className="flex items-center gap-5">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black border border-primary/20 shadow-sm">
                                IF
                              </div>
                              <span className="font-black text-lg tracking-tight">{getConditionLabel(condition)}</span>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => removeCondition(condition.id)} className="h-10 w-10 text-red-500 hover:text-red-100 hover:bg-red-500 rounded-xl transition-all">
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={() => setShowConditionDialog(true)} variant="outline" className="flex-1 h-14 rounded-2xl border-dashed font-bold hover:bg-muted/50 border-border/60">
                      <Plus className="w-5 h-5 mr-3" />
                      Add Drill-Down
                    </Button>
                    <Button onClick={() => setActiveTab("drip")} className="flex-1 h-14 rounded-2xl font-black bg-primary shadow-lg shadow-primary/20">
                      Edit Sequence
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Drip Sequence */}
            <TabsContent value="drip" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="glass-card rounded-[2rem] border-border/50 p-8">
                <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black">Performance Cadence</CardTitle>
                    <CardDescription className="text-base font-medium">Design your multi-channel follow-up flow.</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setShowDripDialog(true)} className="rounded-xl font-bold bg-muted/50 text-foreground border border-border/50 hover:bg-muted/80">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </CardHeader>
                <CardContent className="px-0 py-8 space-y-6 relative">
                  <div className="absolute left-[19px] top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary via-primary/30 to-border/20" />
                  {dripSteps.map((step, index) => (
                    <div key={index} className="relative pl-12 group">
                      <div className="absolute left-0 top-6 w-10 h-10 rounded-2xl bg-background border-2 border-primary flex items-center justify-center z-10 shadow-lg group-hover:scale-110 transition-transform">
                        <div className="w-4 h-4 rounded-full bg-primary" />
                      </div>
                      <div className="p-8 rounded-[2rem] border border-border/50 bg-background/40 hover:bg-background/60 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex gap-3">
                            <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">Day {step.day}</div>
                            <div className="bg-blue-500/10 text-blue-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20">{step.channel}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-primary/10 text-primary" onClick={() => editDripStep(index)}>
                              <Eye className="w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-red-500/10 text-red-500" onClick={() => removeDripStep(index)}>
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-muted/30 p-6 rounded-2xl border border-border/40 min-h-[100px] text-lg font-medium leading-relaxed italic text-foreground/80">
                          "{step.message}"
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button onClick={() => setActiveTab("review")} className="w-full h-16 rounded-3xl text-xl font-black bg-primary shadow-2xl shadow-primary/20 mt-8">
                    Review Command & Launch
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Review */}
            <TabsContent value="review" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="glass-card rounded-[2rem] border-border/50 p-8 overflow-hidden relative">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full" />
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl font-black">Final Command</CardTitle>
                  <CardDescription className="text-lg font-medium">Execution ready. Verify your parameters for takeoff.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 py-8 space-y-12">
                  {launchError && (
                    <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center gap-4 animate-bounce">
                      <AlertCircle className="w-6 h-6 shrink-0" />
                      <p className="text-base font-black tracking-tight">{launchError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[2rem] bg-background/50 border border-border/60 shadow-inner group transition-all hover:border-primary/40">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4 block">Velocity</span>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-foreground">{rateLimit}</p>
                        <span className="text-sm font-bold text-muted-foreground">sends / minute</span>
                      </div>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-background/50 border border-border/60 shadow-inner group transition-all hover:border-primary/40">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4 block">Parallelism</span>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-foreground">{batchSize}</p>
                        <span className="text-sm font-bold text-muted-foreground">batch size</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button
                      className="w-full h-20 text-2xl font-black rounded-3xl shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 group overflow-hidden"
                      onClick={handleLaunchCampaign}
                      disabled={isLaunching}
                    >
                      {isLaunching ? (
                        <>
                          <Zap className="w-8 h-8 mr-4 animate-ping text-white/50" />
                          IGNITING...
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6 mr-4 fill-current group-hover:scale-125 transition-transform" />
                          LAUNCH NOW
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" onClick={onCancel} className="h-12 rounded-2xl font-bold opacity-60 hover:opacity-100" disabled={isLaunching}>
                      Retract to Drafts
                    </Button>
                  </div>
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
