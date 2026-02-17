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
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-background/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 sticky top-0 z-20 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {showBuilder ? "New Campaign" : "Patient Engagement"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {showBuilder
              ? "Design and launch your new marketing campaign"
              : "Manage campaigns, inbox, and AI automation"
            }
          </p>
        </div>
        <div className="flex gap-3">
          {showBuilder ? (
            <Button variant="ghost" onClick={() => setShowBuilder(false)}>
              Cancel
            </Button>
          ) : (
            <>
              <Button variant="outline" className="hidden sm:flex" onClick={() => setActiveTab("analytics")}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button onClick={() => setShowBuilder(true)} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </>
          )}
        </div>
      </div>

      {showBuilder ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CampaignBuilder onCancel={() => setShowBuilder(false)} onSuccess={() => {
            setShowBuilder(false)
            fetchCampaigns()
          }} />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8">
            <TabsTrigger
              value="campaigns"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              Campaigns
            </TabsTrigger>
            <TabsTrigger
              value="inbox"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              Unified Inbox
            </TabsTrigger>
            <TabsTrigger
              value="chatbot"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              Nova AI Agent
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-200/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-500">Active Campaigns</CardTitle>
                  <Megaphone className="h-4 w-4 text-blue-500 brightness-110" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{campaigns.filter((c) => c.status === "active").length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Currently running</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-200/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-500">Response Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500 brightness-110" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">--%</div>
                  <p className="text-xs text-muted-foreground mt-1">Global average</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-200/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-500">Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-orange-500 brightness-110" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{campaigns.reduce((sum, c) => sum + c.booked, 0)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Generated this month</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center p-12 border-2 border-dashed border-border/50 rounded-xl">
                    <Megaphone className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No campaigns yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Start engaging your patients with targeted campaigns.</p>
                    <Button onClick={() => setShowBuilder(true)}>Create First Campaign</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-border/50 bg-background hover:bg-muted/5 transition-all gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <Megaphone className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-bold text-lg text-foreground">{campaign.name}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                              <span>•</span>
                              <span className="capitalize">{campaign.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                            <div className="font-bold text-foreground">{campaign.booked} booked</div>
                            <div className="text-xs text-muted-foreground">{campaign.sent} sent</div>
                          </div>
                          <Badge
                            variant={campaign.status === "active" ? "default" : "secondary"}
                            className={cn("uppercase tracking-wider font-bold text-[10px]",
                              campaign.status === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {campaign.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => handleToggleCampaign(campaign.id)} className="h-9 w-9">
                              {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button size="icon" variant="ghost" className="h-9 w-9">
                              <Eye className="w-4 h-4" />
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

          <TabsContent value="inbox" className="h-[800px] animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Embedding Unified Inbox */}
            <UnifiedInbox />
          </TabsContent>

          <TabsContent value="chatbot" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    Nova AI Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Nova manages your patient communications 24/7.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                      <h4 className="font-bold text-2xl">87%</h4>
                      <p className="text-xs text-muted-foreground">Automated Resolution</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                      <h4 className="font-bold text-2xl">24/7</h4>
                      <p className="text-xs text-muted-foreground">Availability</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground text-center py-8">
                    Activity logs will appear here.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                  Analytics Dashboard Coming Soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
