"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Bot, MessageSquare, Settings, TrendingUp, Calendar, Send, Edit2 } from "@/components/icons"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"

interface ConversationAnalytics {
  date: string
  conversations: number
  avgDuration: number
  satisfaction: number
  resolutionRate: number
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; sentiment?: string }>>([
    { role: "bot", content: "Hello! I'm your Orasync AI assistant. I can help you schedule appointments, answer questions about services, and manage your dental practice. How can I assist you today?", sentiment: "neutral" },
  ])
  const [inputValue, setInputValue] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [conversationAnalytics, setConversationAnalytics] = useState<ConversationAnalytics[]>([
    { date: "Oct 17", conversations: 156, avgDuration: 4.2, satisfaction: 4.7, resolutionRate: 92 },
    { date: "Oct 16", conversations: 142, avgDuration: 3.8, satisfaction: 4.6, resolutionRate: 89 },
    { date: "Oct 15", conversations: 168, avgDuration: 4.5, satisfaction: 4.8, resolutionRate: 94 },
  ])
  const { scrollToSection } = useScrollToSection()

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = { role: "user", content: inputValue, sentiment: "neutral" }
      const newMessages = [...messages, userMessage]
      setMessages(newMessages)
      setInputValue("")

      try {
        const response = await fetch('/api/v1/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputValue,
            conversation: messages.slice(-5), // Send last 5 messages for context
            context: 'dental_assistant'
          })
        })

        if (response.ok) {
          const data = await response.json()
          const botMessage = {
            role: "bot",
            content: data.response,
            sentiment: data.sentiment || "neutral",
          }
          setMessages(prev => [...prev, botMessage])
        } else {
          throw new Error('Failed to get AI response')
        }
      } catch (error) {
        console.error('AI chat error:', error)
        const botMessage = {
          role: "bot",
          content: "I apologize, but I'm having trouble connecting right now. Please try again or contact our support team for immediate assistance.",
          sentiment: "neutral",
        }
        setMessages(prev => [...prev, botMessage])
      }
    }
  }

  const handleConversationsClick = () => {
    scrollToSection("conversations-preview")
  }

  const handleAppointmentsClick = () => {
    scrollToSection("appointments-booked-section")
  }

  const handleResolutionClick = () => {
    scrollToSection("training-data")
  }

  const handleSatisfactionClick = () => {
    scrollToSection("satisfaction-details")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Chatbot</h1>
          <p className="text-muted-foreground">Configure and monitor your AI patient assistant</p>
        </div>
        <Button size="sm" onClick={() => setShowAdvancedSettings(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Configure Bot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={handleConversationsClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations Today</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+24% from yesterday</p>
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
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Via chatbot</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all" onClick={handleResolutionClick}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Without escalation</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={handleSatisfactionClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">User ratings</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="preview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="training">Training Data</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card id="conversations-preview">
              <CardHeader>
                <CardTitle>Chatbot Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 space-y-3 h-96 overflow-y-auto">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "items-start gap-3"}`}>
                      {msg.role === "bot" && (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg max-w-xs ${
                          msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-background shadow-sm"
                        }`}
                      >
                        {msg.content}
                        {msg.sentiment && msg.role === "bot" && (
                          <div className="text-xs opacity-70 mt-1">
                            Sentiment:{" "}
                            <Badge variant="outline" className="text-xs">
                              {msg.sentiment}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Input
                    placeholder="Test the chatbot..."
                    className="flex-1"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bot Name</label>
                  <Input value="Dental Assistant" readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Availability</label>
                  <Badge>24/7 Active</Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Escalation</label>
                  <Badge variant="outline">After 3 failed attempts</Badge>
                </div>
                <Button className="w-full" onClick={() => setShowAdvancedSettings(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card id="training-data">
            <CardHeader>
              <CardTitle>Training Data & Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { topic: "Appointment Scheduling", responses: 245, accuracy: "98%", resolved: true },
                { topic: "Insurance Questions", responses: 189, accuracy: "95%", resolved: true },
                { topic: "Office Hours", responses: 156, accuracy: "100%", resolved: true },
                { topic: "Services Offered", responses: 134, accuracy: "97%", resolved: true },
                { topic: "Payment Methods", responses: 98, accuracy: "96%", resolved: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">{item.topic}</div>
                    <div className="text-xs text-muted-foreground">{item.responses} training responses</div>
                  </div>
                  <div className="text-right">
                    <Badge>{item.accuracy} accuracy</Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.resolved ? "✓ Resolved" : "Escalated"}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg. Conversation Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.2 min</div>
                <p className="text-xs text-muted-foreground mt-1">+0.3 min from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Escalation Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8%</div>
                <p className="text-xs text-muted-foreground mt-1">-2% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.6/5</div>
                <p className="text-xs text-muted-foreground mt-1">Overall positive</p>
              </CardContent>
            </Card>
          </div>

          <Card id="appointments-booked-section">
            <CardHeader>
              <CardTitle>Appointments Booked via Chatbot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { date: "Today", count: 8, type: "Cleaning" },
                { date: "Yesterday", count: 6, type: "Consultation" },
                { date: "This Week", count: 23, type: "Mixed" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">{item.date}</div>
                    <div className="text-xs text-muted-foreground">{item.type}</div>
                  </div>
                  <div className="text-2xl font-bold text-primary">{item.count}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card id="satisfaction-details">
            <CardHeader>
              <CardTitle>User Satisfaction & Ratings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { rating: "5 Stars", count: 145, percentage: "65%" },
                { rating: "4 Stars", count: 52, percentage: "23%" },
                { rating: "3 Stars", count: 18, percentage: "8%" },
                { rating: "2 Stars", count: 5, percentage: "2%" },
                { rating: "1 Star", count: 2, percentage: "2%" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">{item.rating}</div>
                    <div className="text-xs text-muted-foreground">{item.count} ratings</div>
                  </div>
                  <Badge variant="secondary">{item.percentage}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversationAnalytics.map((day, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium text-sm">{day.date}</div>
                      <div className="text-xs text-muted-foreground">{day.conversations} conversations</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-right">
                      <div>
                        <div className="text-sm font-medium">{day.avgDuration}m</div>
                        <div className="text-xs text-muted-foreground">avg duration</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{day.satisfaction}/5</div>
                        <div className="text-xs text-muted-foreground">satisfaction</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{day.resolutionRate}%</div>
                        <div className="text-xs text-muted-foreground">resolved</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bot Personality</label>
                <Select defaultValue="professional">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Response Time</label>
                <Select defaultValue="instant">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="realistic">Realistic (1-2s)</SelectItem>
                    <SelectItem value="slow">Slow (3-5s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Escalation Threshold</label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">After 1 failed attempt</SelectItem>
                    <SelectItem value="2">After 2 failed attempts</SelectItem>
                    <SelectItem value="3">After 3 failed attempts</SelectItem>
                    <SelectItem value="5">After 5 failed attempts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Save Configuration</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium text-sm">Calendar Integration</div>
                  <div className="text-xs text-muted-foreground">Sync with appointment system</div>
                </div>
                <Badge className="bg-green-500">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium text-sm">CRM Integration</div>
                  <div className="text-xs text-muted-foreground">Access patient records</div>
                </div>
                <Badge className="bg-green-500">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium text-sm">SMS Notifications</div>
                  <div className="text-xs text-muted-foreground">Send appointment reminders</div>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAdvancedSettings} onOpenChange={setShowAdvancedSettings}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Advanced Bot Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bot Name</label>
              <Input defaultValue="Dental Assistant" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Welcome Message</label>
              <Input defaultValue="Hello! I'm your dental assistant. How can I help you today?" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fallback Message</label>
              <Input defaultValue="I'm not sure I understand. Could you rephrase that?" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Escalation Message</label>
              <Input defaultValue="Let me connect you with a team member who can better assist you." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdvancedSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAdvancedSettings(false)}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
