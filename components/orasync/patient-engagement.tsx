"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Megaphone,
  MessageSquare,
  Bot,
  Calendar,
  TrendingUp,
  Play,
  Pause,
  Eye,
  BarChart3,
  Plus,
  Loader2,
  Sparkles
} from "lucide-react"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import { CampaignBuilder } from "./campaign-builder"
import UnifiedInbox from "./unified-inbox"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"

interface Campaign {
  id: string
  name: string
  type: string // inferred from segment/channels
  status: 'draft' | 'active' | 'paused' | 'completed'
  sent: number
  opened: number
  clicked: number
  booked: number
  created_at: string
}

export default function PatientEngagement() {
  const { user } = useUser()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("campaigns")
  const [showBuilder, setShowBuilder] = useState(false)
  const { scrollToSection } = useScrollToSection()

  const fetchCampaigns = async () => {
    if (!user?.id) return
    try {
      const res = await fetch(`/api/v1/clinics/${user.id}/campaigns`)
      if (res.ok) {
        const data = await res.json()
        // Map DB fields to UI fields if necessary
        // For now assuming existing structure or mapping it:
        const mapped = data.campaigns.map((c: any) => ({
          id: c.id,
          name: c.name,
          type: "General", // Deduce from criteria?
          status: c.status,
          sent: 0, // Need analytics data
          opened: 0,
          clicked: 0,
          booked: 0,
          created_at: c.created_at
        }))
        setCampaigns(mapped)
      }
    } catch (err) {
      console.error("Failed to fetch campaigns", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [user?.id, showBuilder]) // Refetch when builder closes (campaign created)

  const handleToggleCampaign = (id: string) => {
    // Implement API call to pause/resume
    console.log("Toggle campaign", id)
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto p-4 md:p-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-card/40 backdrop-blur-xl p-8 rounded-[2rem] border border-border/50 sticky top-0 z-20 shadow-2xl shadow-primary/5">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            {showBuilder ? "New Campaign" : "Intelligence Hub"}
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            {showBuilder
              ? "Design and launch your next-gen growth engine."
              : "Command center for patient engagement & AI automation."
            }
          </p>
        </div>
        <div className="flex gap-3">
          {showBuilder ? (
            <Button variant="ghost" onClick={() => setShowBuilder(false)} className="rounded-xl font-bold px-6 border-border/60 hover:bg-muted/50 transition-all">
              Retract
            </Button>
          ) : (
            <>
              <Button variant="outline" className="hidden sm:flex rounded-xl font-bold px-6 h-12 border-border/60 hover:bg-muted/50 transition-all" onClick={() => setActiveTab("analytics")}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Performance
              </Button>
              <Button onClick={() => setShowBuilder(true)} className="rounded-xl px-8 h-12 font-black shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.05]">
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </>
          )}
        </div>
      </div>

      {showBuilder ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CampaignBuilder onCancel={() => setShowBuilder(false)} onSuccess={() => {
            setShowBuilder(false)
            fetchCampaigns()
          }} />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <TabsList className="bg-muted/30 border border-border/50 p-1 rounded-2xl h-14 w-fit px-2">
            <TabsTrigger value="campaigns" className="rounded-xl h-10 px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">Campaigns</TabsTrigger>
            <TabsTrigger value="inbox" className="rounded-xl h-10 px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">Inbox</TabsTrigger>
            <TabsTrigger value="chatbot" className="rounded-xl h-10 px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">Nova AI</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl h-10 px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-card ring-1 ring-primary/5 hover:ring-primary/20 transition-all bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Active Engines</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Megaphone className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-4xl font-black">{campaigns.filter((c) => c.status === "active").length}</div>
                  <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-tight opacity-70">Currently running</p>
                </CardContent>
              </Card>

              <Card className="glass-card ring-1 ring-green-500/5 hover:ring-green-500/20 transition-all bg-green-500/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Response Pulse</CardTitle>
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-4xl font-black">24.2%</div>
                  <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-tight opacity-70">Global average</p>
                </CardContent>
              </Card>

              <Card className="glass-card ring-1 ring-orange-500/5 hover:ring-orange-500/20 transition-all bg-orange-500/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Reactivations</CardTitle>
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-4xl font-black">{campaigns.reduce((sum, c) => sum + c.booked, 0)}</div>
                  <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-tight opacity-70">Bookings generated</p>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card rounded-[2rem] border-border/50 overflow-hidden shadow-2xl shadow-primary/5">
              <CardHeader className="p-8 border-b border-border/40">
                <CardTitle className="text-xl font-black">Deployment History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center p-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center p-20">
                    <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Megaphone className="h-10 w-10 opacity-30" />
                    </div>
                    <h3 className="text-xl font-black">Awaiting Ignition</h3>
                    <p className="text-muted-foreground font-medium mb-8 max-w-sm mx-auto">Start engaging your patients with high-impact automated campaigns.</p>
                    <Button onClick={() => setShowBuilder(true)} className="rounded-xl font-black px-8">Create First Campaign</Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-muted/10 transition-all gap-6 group">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-background border border-border/50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                            <Megaphone className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <div className="font-black text-xl text-foreground group-hover:text-primary transition-colors">{campaign.name}</div>
                            <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase mt-1">
                              <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                              <span className="opacity-30">•</span>
                              <span className={cn(
                                "tracking-widest",
                                campaign.status === 'active' ? 'text-primary' : 'text-muted-foreground'
                              )}>{campaign.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-10">
                          <div className="text-right hidden md:block group-hover:translate-x-[-10px] transition-transform">
                            <div className="font-black text-lg text-foreground">{campaign.booked} RECENT</div>
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{campaign.sent.toLocaleString()} DISPATCHED</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleToggleCampaign(campaign.id)} className="h-12 w-12 rounded-xl hover:bg-primary/10 text-primary">
                              {campaign.status === "active" ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                            </Button>
                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl hover:bg-muted/80">
                              <Eye className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inbox" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <UnifiedInbox />
          </TabsContent>

          <TabsContent value="chatbot" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="glass-card rounded-[2.5rem] border-primary/20 bg-gradient-to-br from-primary/10 via-background to-ai-secondary/5 overflow-hidden group">
                <CardHeader className="p-10 pb-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/20 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter">Nova AI Agent</CardTitle>
                  </div>
                  <p className="text-lg font-medium text-foreground/70 leading-relaxed">
                    Nova manages your patient communications 24/7 with human-level EQ and clinical precision.
                  </p>
                </CardHeader>
                <CardContent className="p-10 pt-6 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-[2rem] bg-background/50 border border-border/50 shadow-inner group-hover:border-primary/30 transition-all">
                      <h4 className="font-black text-3xl mb-1">87%</h4>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Resolution Rate</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-background/50 border border-border/50 shadow-inner group-hover:border-primary/30 transition-all">
                      <h4 className="font-black text-3xl mb-1">24/7</h4>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Presence</p>
                    </div>
                  </div>
                  <Button className="w-full h-16 rounded-2xl text-xl font-black bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
                    Configure Agent Logic
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card rounded-[2.5rem] border-border/50 p-10 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                  <Bot className="w-12 h-12 opacity-20" />
                </div>
                <h3 className="text-2xl font-black">Intelligence Logs</h3>
                <p className="text-muted-foreground font-medium max-w-xs">
                  Real-time analysis of agent-patient interactions will manifest here soon.
                </p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="glass-card rounded-[3rem] border-border/50 border-dashed p-32 text-center group">
              <div className="max-w-md mx-auto space-y-8">
                <div className="w-32 h-32 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-muted/10 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-16 h-16 opacity-20" />
                </div>
                <h3 className="text-4xl font-black tracking-tighter">Performance Matrix</h3>
                <p className="text-xl font-medium text-muted-foreground">
                  Deep analytics including attribution, conversion funnels, and ROI tracking are being synthesized.
                </p>
                <Button variant="outline" className="rounded-2xl h-14 font-black px-12 border-border/60">
                  Request Access
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
