"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Megaphone,
  MessageSquare,
  Bot,
  Send,
  Calendar,
  TrendingUp,
  Phone,
  Mail,
  MessageCircle,
  Play,
  Pause,
  Eye,
  BarChart3,
} from "lucide-react"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"

export default function PatientEngagement() {
  const [campaigns, setCampaigns] = useState([
    {
      id: "1",
      name: "6-Month Cleaning Reminder",
      type: "Reactivation",
      status: "active",
      sent: 245,
      opened: 89,
      clicked: 23,
      booked: 12,
    },
    {
      id: "2",
      name: "Overdue Treatment Follow-up",
      type: "Follow-up",
      status: "paused",
      sent: 156,
      opened: 67,
      clicked: 18,
      booked: 8,
    },
    {
      id: "3",
      name: "New Patient Welcome Series",
      type: "Welcome",
      status: "active",
      sent: 89,
      opened: 78,
      clicked: 34,
      booked: 15,
    },
  ])

  const [selectedConversation, setSelectedConversation] = useState(0)
  const [messageText, setMessageText] = useState("")
  const [activeTab, setActiveTab] = useState("campaigns")
  const { scrollToSection } = useScrollToSection()

  const handleToggleCampaign = (id: string) => {
    setCampaigns(
      campaigns.map((c) => (c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c)),
    )
  }

  const handleViewCampaign = (id: string) => {
    alert(`View campaign ${id} analytics`)
  }

  const handleNewCampaign = () => {
    alert("Create new campaign form would open here")
  }

  const handleCampaignAnalytics = () => {
    alert("Campaign analytics dashboard would open here")
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      alert(`Message sent: "${messageText}"`)
      setMessageText("")
    }
  }

  const handleMetricClick = (tab: string, sectionId: string) => {
    setActiveTab(tab)
    scrollToSection(sectionId)
  }

  const handleActiveCampaignsClick = () => {
    scrollToSection("active-campaigns-list")
  }

  const handleResponseRateClick = () => {
    scrollToSection("response-rate-details")
  }

  const handleAppointmentsClick = () => {
    scrollToSection("appointments-booked-list")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing Campaigns</h1>
          <p className="text-muted-foreground">Create and manage patient engagement campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCampaignAnalytics}>
            <Eye className="w-4 h-4 mr-2" />
            Campaign Analytics
          </Button>
          <Button size="sm" onClick={handleNewCampaign}>
            <Megaphone className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="inbox">Unified Inbox</TabsTrigger>
          <TabsTrigger value="chatbot">AI Chatbot</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={handleActiveCampaignsClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaigns.filter((c) => c.status === "active").length}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={handleResponseRateClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={handleAppointmentsClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Appointments Booked</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.booked, 0)}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card id="active-campaigns-list">
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaigns
                .filter((c) => c.status === "active")
                .map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">{campaign.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <div className="font-medium">{campaign.booked} booked</div>
                        <div className="text-muted-foreground">{campaign.sent} sent</div>
                      </div>
                      <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleToggleCampaign(campaign.id)}>
                          {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleViewCampaign(campaign.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card id="response-rate-details">
            <CardHeader>
              <CardTitle>Response Rate Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {campaign.type} - {campaign.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{((campaign.opened / campaign.sent) * 100).toFixed(1)}% opened</div>
                    <div className="text-sm text-muted-foreground">
                      {((campaign.clicked / campaign.sent) * 100).toFixed(1)}% clicked
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card id="appointments-booked-list">
            <CardHeader>
              <CardTitle>Appointments Booked by Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground">{campaign.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{campaign.booked}</div>
                    <div className="text-sm text-muted-foreground">
                      {((campaign.booked / campaign.sent) * 100).toFixed(1)}% conversion
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleMetricClick("inbox", "inbox-section")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Across all channels</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleMetricClick("inbox", "inbox-section")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SMS</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">New messages</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleMetricClick("inbox", "inbox-section")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">New messages</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleMetricClick("inbox", "inbox-section")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">New messages</p>
              </CardContent>
            </Card>
          </div>

          <div id="inbox-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  {
                    name: "Sarah Johnson",
                    message: "Can I reschedule my appointment?",
                    time: "2 min ago",
                    channel: "SMS",
                    unread: true,
                  },
                  {
                    name: "Mike Chen",
                    message: "Thank you for the reminder!",
                    time: "15 min ago",
                    channel: "Email",
                    unread: false,
                  },
                  {
                    name: "Emma Davis",
                    message: "What are your office hours?",
                    time: "1 hour ago",
                    channel: "WhatsApp",
                    unread: true,
                  },
                ].map((conversation, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedConversation(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === index
                        ? "bg-primary/10 border-primary/30"
                        : conversation.unread
                          ? "bg-primary/5 border-primary/20"
                          : "hover:bg-muted/50"
                    } border`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm">{conversation.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {conversation.channel}
                        </Badge>
                        {conversation.unread && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{conversation.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">{conversation.time}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{["Sarah Johnson", "Mike Chen", "Emma Davis"][selectedConversation]} - SMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 h-64 overflow-y-auto">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                      Hi! Your cleaning appointment is scheduled for tomorrow at 2 PM. Please reply CONFIRM to confirm.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg max-w-xs">
                      Can I reschedule my appointment? Something came up at work.
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    className="flex-1"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chatbot" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleMetricClick("chatbot", "chatbot-section")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversations Today</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground">+18% from yesterday</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleMetricClick("chatbot", "chatbot-section")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Appointments Booked</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Via AI chatbot</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleMetricClick("chatbot", "chatbot-section")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">Without human intervention</p>
              </CardContent>
            </Card>
          </div>

          <div id="chatbot-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Chatbot Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 space-y-3 h-80 overflow-y-auto">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-background p-3 rounded-lg shadow-sm max-w-xs">
                      Hi! I'm your virtual dental assistant. How can I help you today?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                      I'd like to schedule a cleaning appointment
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-background p-3 rounded-lg shadow-sm max-w-xs">
                      Great! I can help you schedule a cleaning. What's your preferred date and time?
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Input placeholder="Test the chatbot..." className="flex-1" />
                  <Button size="sm">Send</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { question: "What are your office hours?", count: 45 },
                  { question: "How do I schedule an appointment?", count: 38 },
                  { question: "Do you accept my insurance?", count: 32 },
                  { question: "What services do you offer?", count: 28 },
                  { question: "Where are you located?", count: 24 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="text-sm">{item.question}</div>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleMetricClick("analytics", "analytics-section")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">Patient interactions</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleMetricClick("analytics", "analytics-section")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5%</div>
                <p className="text-xs text-muted-foreground">Engagement to appointment</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleMetricClick("analytics", "analytics-section")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground">From campaigns</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
              onClick={() => handleMetricClick("analytics", "analytics-section")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">340%</div>
                <p className="text-xs text-muted-foreground">Return on investment</p>
              </CardContent>
            </Card>
          </div>

          <Card id="analytics-section">
            <CardHeader>
              <CardTitle>Engagement Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 mb-4" />
                <div className="text-center">
                  <p>Engagement analytics chart would be displayed here</p>
                  <p className="text-sm">Showing campaign performance over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
