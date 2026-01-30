"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Search, Bot } from "lucide-react"

export default function AIHelpAssistant() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "bot", content: "Hi! I'm your Orasync AI assistant. How can I help you today?" },
    { role: "user", content: "How do I create a new marketing campaign?" },
    {
      role: "bot",
      content:
        'To create a marketing campaign, go to Patient Engagement → Marketing Campaigns and click "New Campaign". You can then select your audience and message type.',
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: "user", content: inputValue }])
      setInputValue("")
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "I've received your question. Let me help you with that!" },
        ])
      }, 500)
    }
  }

  const handleViewTicket = () => {
    alert("Opening support ticket details...")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Help Assistant</h1>
          <p className="text-muted-foreground">Get instant help with Orasync features</p>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about Orasync..."
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
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search FAQ..." className="flex-1" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  question: "How do I reset my password?",
                  answer: "Go to Settings → Account → Change Password",
                  views: 234,
                },
                {
                  question: "How do I export patient data?",
                  answer: "Go to Patient CRM → Select patients → Export",
                  views: 189,
                },
                {
                  question: "Can I integrate with my existing software?",
                  answer: "Yes, we support integrations with most major dental software",
                  views: 156,
                },
                {
                  question: "What is the HIPAA compliance status?",
                  answer: "Orasync is fully HIPAA compliant and certified",
                  views: 145,
                },
              ].map((faq, i) => (
                <div key={i} className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-sm">{faq.question}</div>
                    <Badge variant="outline" className="text-xs">
                      {faq.views} views
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "#1234", subject: "Dashboard not loading", status: "open", date: "Today" },
                { id: "#1233", subject: "Export feature issue", status: "in-progress", date: "Yesterday" },
                { id: "#1232", subject: "Password reset help", status: "resolved", date: "2 days ago" },
              ].map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">{ticket.subject}</div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.id} • {ticket.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        ticket.status === "resolved"
                          ? "default"
                          : ticket.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {ticket.status}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={handleViewTicket}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
