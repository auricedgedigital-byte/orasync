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
import { Plus, Trash2, Eye, AlertCircle, Zap, Sparkles, X, ArrowRight, Check, Play, Settings2, Users2, CalendarDays } from "lucide-react"
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
  const [mounted, setMounted] = useState(false)

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

  const [dripSteps, setDripSteps] = useState<DripStep[]>([
    { day: 0, message: "Hi {first_name}, just a friendly reminder from Dr. Smith at Orasync. Reply YES to book.", channel: "sms" },
  ])

  const [showDripDialog, setShowDripDialog] = useState(false)
  const [editingDripIndex, setEditingDripIndex] = useState<number | null>(null)
  const [newDripStep, setNewDripStep] = useState<DripStep>({ day: 0, message: "", channel: "sms" })

  const [segmentCount, setSegmentCount] = useState(245)
  const [isLaunching, setIsLaunching] = useState(false)
  const [launchError, setLaunchError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const applyNovaSuggestion = () => {
    setCampaignName("Recall: Overdue Hygiene > 6 Months (Nova AI)")
    setConditions([
      { id: "1", type: "last_visit", operator: "gt", value: "180" },
      { id: "2", type: "tags", operator: "excludes", value: "scheduled" }
    ])
    setDripSteps([
      { day: 0, message: "Hi {first_name}, it's been over 6 months since your last cleaning at Orasync. Reply YES to book a slot this week!", channel: "sms" },
      { day: 3, message: "Hey {first_name}, we still have a few openings for hygiene checkups. Let us know if you'd like to reserve one!", channel: "email" }
    ])
    setSegmentCount(128)
  }

  const handleLaunchCampaign = async () => {
    if (!campaignName) {
      setLaunchError("Please enter a campaign name")
      return
    }
    setIsLaunching(true)
    setLaunchError(null)

    // Simulate API call
    setTimeout(() => {
      setIsLaunching(false)
      onSuccess()
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Nova Suggestion Wrapper */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-ai-secondary rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative p-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl">
          <div className="bg-slate-50 dark:bg-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Nova AI Insight</h3>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  "I've found <span className="text-primary font-black">128 patients</span> overdue for hygiene. Launching this now could increase revenue by <span className="text-primary font-black">$3,400</span> this month."
                </p>
              </div>
            </div>
            <Button size="lg" onClick={applyNovaSuggestion} className="rounded-2xl px-10 h-16 h-14 font-black text-lg bg-primary text-white shadow-xl shadow-primary/30 hover:scale-[1.05] transition-all">
              Apply Suggestion
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Step Guide Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="rounded-[2.5rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-3 shadow-xl h-fit overflow-hidden">
            <div className="p-6 pb-2">
              <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-white/20 tracking-[0.3em]">Campaign Flow</h4>
            </div>
            <div className="space-y-2">
              {(["basic", "segment", "drip", "review"] as const).map((step, idx) => (
                <button
                  key={step}
                  onClick={() => setActiveTab(step)}
                  className={cn(
                    "w-full flex items-center gap-5 p-5 rounded-2xl transition-all group",
                    activeTab === step ? "bg-primary/10 text-primary" : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                >
                  <div className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all",
                    activeTab === step ? "border-primary bg-white dark:bg-slate-900 shadow-lg scale-110" : "border-slate-200 dark:border-white/10"
                  )}>
                    {idx + 1}
                  </div>
                  <span className="text-sm font-black tracking-tight capitalize">{step} Setup</span>
                  {activeTab === step && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                </button>
              ))}
            </div>
          </Card>

          {/* Real-time Summary */}
          <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Projection</span>
            </div>
            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Reach</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">{segmentCount} <span className="text-sm text-slate-400">Patients</span></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engagement Channels</span>
                <div className="flex gap-2">
                  {[...new Set(dripSteps.map(s => s.channel))].map(c => (
                    <Badge key={c} variant="outline" className="bg-primary/10 border-primary/20 text-primary font-black uppercase text-[9px] px-2">{c}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Wizard */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} className="w-full">
            {/* STEP 1: BASIC */}
            <TabsContent value="basic" className="animate-in fade-in slide-in-from-right-8 duration-500">
              <Card className="rounded-[3rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-12 shadow-2xl">
                <CardHeader className="px-0 pt-0 mb-10">
                  <CardTitle className="text-3xl font-black tracking-tight">Campaign Foundation</CardTitle>
                  <CardDescription className="text-lg font-medium text-slate-500">Name your strategic engine and set its core goal.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-12">
                  <div className="flex flex-col gap-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Unique Campaign Identifier</label>
                    <Input
                      placeholder="e.g. hygiene_reactivation_q3"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="h-20 px-8 text-2xl font-black rounded-3xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                    />
                  </div>
                  <Button
                    onClick={() => setActiveTab("segment")}
                    className="w-full h-16 rounded-3xl text-xl font-black bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-[1.01] transition-all"
                  >
                    Configure Audience
                    <ArrowRight className="ml-4 h-6 w-6" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* STEP 2: SEGMENT */}
            <TabsContent value="segment" className="animate-in fade-in slide-in-from-right-8 duration-500">
              <Card className="rounded-[3rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-12 shadow-2xl">
                <CardHeader className="px-0 pt-0 mb-10 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-black tracking-tight">Audience Precision</CardTitle>
                    <CardDescription className="text-lg font-medium text-slate-500">Who should this campaign intelligent target?</CardDescription>
                  </div>
                  <div className="h-16 px-6 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center gap-3">
                    <Users2 className="h-6 w-6 text-primary" />
                    <span className="text-2xl font-black text-primary">{segmentCount}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-0 space-y-10">
                  <div className="space-y-4">
                    {conditions.length === 0 ? (
                      <div className="p-20 border-4 border-dashed rounded-[3rem] border-slate-200 dark:border-white/5 flex flex-col items-center justify-center text-center group bg-slate-50/50 dark:bg-transparent">
                        <div className="h-20 w-20 rounded-3xl bg-white dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-sm group-hover:scale-110 transition-transform mb-6">
                          <Plus className="h-10 w-10 text-slate-300" />
                        </div>
                        <h4 className="text-xl font-black mb-2">Broadest Reach Applied</h4>
                        <p className="text-slate-500 font-medium max-w-xs">No audience filters active. Campaign targets 100% of your patient database.</p>
                        <Button onClick={() => setShowConditionDialog(true)} variant="link" className="text-primary font-black mt-4">Add Precision Filter</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {conditions.map(c => (
                          <div key={c.id} className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-between group hover:border-primary/40 transition-all">
                            <div className="flex items-center gap-6">
                              <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-primary font-black text-xs shadow-sm">IF</div>
                              <div className="space-y-0.5">
                                <span className="text-xs font-black text-slate-400 capitalize">{c.type.replace('_', ' ')}</span>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{c.operator} {c.value}</p>
                              </div>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => setConditions(conditions.filter(x => x.id !== c.id))} className="h-12 w-12 rounded-2xl hover:bg-red-500 hover:text-white transition-all text-slate-400">
                              <Trash2 className="h-6 w-6" />
                            </Button>
                          </div>
                        ))}
                        <Button onClick={() => setShowConditionDialog(true)} variant="outline" className="w-full h-16 rounded-3xl border-dashed border-slate-300 dark:border-white/10 font-black hover:bg-slate-50 dark:hover:bg-white/5">
                          <Plus className="mr-3 h-6 w-6" /> Add Detailed Filter
                        </Button>
                      </div>
                    )}
                  </div>

                  <Button onClick={() => setActiveTab("drip")} className="w-full h-16 rounded-3xl text-xl font-black bg-primary text-white shadow-2xl shadow-primary/30">
                    Configure Drip Engine
                    <ArrowRight className="ml-4 h-6 w-6" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* STEP 3: DRIP */}
            <TabsContent value="drip" className="animate-in fade-in slide-in-from-right-8 duration-500">
              <Card className="rounded-[3rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-12 shadow-2xl">
                <CardHeader className="px-0 pt-0 mb-12 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-black tracking-tight">Intelligence Sequence</CardTitle>
                    <CardDescription className="text-lg font-medium text-slate-500">Design the multi-touch cadence for maximum conversion.</CardDescription>
                  </div>
                  <Button size="lg" onClick={() => setShowDripDialog(true)} className="rounded-2xl h-14 px-8 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 border border-transparent hover:border-slate-300 transition-all font-black">
                    Add Step
                  </Button>
                </CardHeader>
                <CardContent className="px-0 space-y-12 relative">
                  <div className="absolute left-10 top-16 bottom-16 w-0.5 bg-gradient-to-b from-primary via-primary/20 to-transparent" />

                  {dripSteps.map((step, idx) => (
                    <div key={idx} className="relative pl-24 group">
                      <div className="absolute left-6 top-8 h-10 w-10 rounded-2xl bg-white dark:bg-slate-900 border-4 border-primary z-10 shadow-xl group-hover:scale-110 transition-transform flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div className="p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-2xl">
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex gap-4">
                            <div className="px-5 py-2 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20">Day {step.day}</div>
                            <div className="px-5 py-2 rounded-2xl bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">{step.channel}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-primary/10 text-primary" onClick={() => {
                              setNewDripStep(step)
                              setEditingDripIndex(idx)
                              setShowDripDialog(true)
                            }}>
                              <Eye className="h-6 w-6" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-red-500/10 text-red-500" onClick={() => setDripSteps(dripSteps.filter((_, i) => i !== idx))}>
                              <Trash2 className="h-6 w-6" />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 rounded-3xl min-h-[120px] shadow-inner text-xl font-bold italic leading-relaxed text-slate-600 dark:text-slate-300">
                          "{step.message}"
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={() => setActiveTab("review")}
                    className="w-full h-20 rounded-[2.5rem] text-2xl font-black bg-primary text-white shadow-[0_20px_60px_-15px_rgba(var(--primary),0.5)] mt-12 hover:scale-[1.01] transition-all"
                  >
                    Review Command & Ignition
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* STEP 4: REVIEW */}
            <TabsContent value="review" className="animate-in fade-in slide-in-from-right-8 duration-500">
              <Card className="rounded-[3rem] border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-40 -top-40 h-96 w-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
                <CardHeader className="px-0 pt-0 mb-12">
                  <CardTitle className="text-4xl font-black tracking-tight">Finalized Intelligence Code</CardTitle>
                  <CardDescription className="text-xl font-medium text-slate-500">All modules synchronized. Ready for practice-wide deployment.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-12">
                  {launchError && (
                    <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center gap-6 animate-pulse">
                      <AlertCircle className="h-8 w-8" />
                      <p className="text-xl font-black">{launchError}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Core Range</span>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black">{segmentCount}</p>
                        <p className="text-sm font-bold text-slate-400">Patients</p>
                      </div>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Intelligence Velocity</span>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black">{rateLimit}</p>
                        <p className="text-sm font-bold text-slate-400">sends / minute</p>
                      </div>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Total Drips</span>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black">{dripSteps.length}</p>
                        <p className="text-sm font-bold text-slate-400">Sequence Steps</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <Button
                      className="w-full h-24 text-3xl font-black rounded-[2.5rem] shadow-2xl shadow-primary/40 bg-primary text-white hover:bg-primary/95 transition-all hover:scale-[1.02] active:scale-95 group overflow-hidden"
                      onClick={handleLaunchCampaign}
                      disabled={isLaunching}
                    >
                      {isLaunching ? (
                        <>
                          <Zap className="h-10 w-10 mr-4 animate-ping" />
                          SYNCHRONIZING...
                        </>
                      ) : (
                        <>
                          <Play className="h-8 w-8 mr-6 fill-current group-hover:scale-125 transition-transform" />
                          IGNITE ENGINE
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={onCancel}
                      className="h-14 rounded-2xl font-black text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      disabled={isLaunching}
                    >
                      RETRACT TO DASHBOARD
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
        <DialogContent className="rounded-[2.5rem] border-slate-200 dark:border-white/10 max-w-lg p-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Audience Filter</DialogTitle>
          </DialogHeader>
          <div className="space-y-8 py-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Node</label>
              <select
                className="w-full px-6 h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-bold"
                value={newCondition.type}
                onChange={(e) => setNewCondition({ ...newCondition, type: e.target.value as any })}
              >
                <option value="last_visit">Days Since Last Visit</option>
                <option value="tags">Patient Tags</option>
                <option value="treatment">Treatment Plan</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</label>
              <select
                className="w-full px-6 h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-bold"
                value={newCondition.operator}
                onChange={(e) => setNewCondition({ ...newCondition, operator: e.target.value as any })}
              >
                <option value="gt">Is Greater Than</option>
                <option value="lt">Is Less Than</option>
                <option value="includes">Includes Exactly</option>
                <option value="excludes">Does Not Include</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Threshold Value</label>
              <Input
                placeholder="Enter value..."
                className="h-14 px-6 rounded-2xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5"
                value={newCondition.value}
                onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setShowConditionDialog(false)} className="rounded-xl h-12 font-black">Cancel</Button>
            <Button onClick={() => {
              setConditions([...conditions, { ...newCondition, id: Date.now().toString() }])
              setShowConditionDialog(false)
              setNewCondition({ id: "", type: "last_visit", operator: "gt", value: "" })
            }} className="rounded-xl h-12 bg-primary text-white font-black px-8">Add Node</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drip Dialog */}
      <Dialog open={showDripDialog} onOpenChange={setShowDripDialog}>
        <DialogContent className="rounded-[2.5rem] border-slate-200 dark:border-white/10 max-w-xl p-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">{editingDripIndex !== null ? "Edit Intelligence Node" : "Add Sequence Node"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-8 py-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day Offset</label>
                <Input
                  type="number"
                  className="h-14 px-6 rounded-2xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5"
                  value={newDripStep.day}
                  onChange={(e) => setNewDripStep({ ...newDripStep, day: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel</label>
                <select
                  className="w-full px-6 h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-bold"
                  value={newDripStep.channel}
                  onChange={(e) => setNewDripStep({ ...newDripStep, channel: e.target.value as any })}
                >
                  <option value="sms">SMS Protocol</option>
                  <option value="email">Email Protocol</option>
                  <option value="whatsapp">WhatsApp Protocol</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intelligence Content</label>
              <Textarea
                className="p-6 rounded-2xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 min-h-[160px] text-lg font-medium italic"
                placeholder="Hi {first_name}, Nova has identified..."
                value={newDripStep.message}
                onChange={(e) => setNewDripStep({ ...newDripStep, message: e.target.value })}
              />
              <div className="flex gap-2">
                {["{first_name}", "{last_name}", "{practice_name}"].map(v => (
                  <Badge key={v} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white" onClick={() => setNewDripStep({ ...newDripStep, message: newDripStep.message + v })}>{v}</Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setShowDripDialog(false)} className="rounded-xl h-12 font-black">Cancel</Button>
            <Button onClick={() => {
              if (editingDripIndex !== null) {
                const updated = [...dripSteps]
                updated[editingDripIndex] = newDripStep
                setDripSteps(updated)
                setEditingDripIndex(null)
              } else {
                setDripSteps([...dripSteps, newDripStep])
              }
              setShowDripDialog(false)
              setNewDripStep({ day: 0, message: "", channel: "sms" })
            }} className="rounded-xl h-12 bg-primary text-white font-black px-8">{editingDripIndex !== null ? "Update" : "Add Node"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
