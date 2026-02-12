'use client'

import Header from '@/components/orasync/layout/Header'
import Sidebar from '@/components/orasync/layout/Sidebar'
import { useState } from 'react'
import { Send, Zap } from 'lucide-react'

const conversationMessages = [
  {
    role: 'ai',
    content: 'Hello! I\'m Nova, your AI assistant. How can I help you today? I can help with campaign creation, patient scheduling, and more!',
    timestamp: '2:30 PM',
  },
  {
    role: 'user',
    content: 'I need help creating a campaign for reactivation',
    timestamp: '2:31 PM',
  },
  {
    role: 'ai',
    content: 'Great! I can help you create a reactivation campaign. To get started, I\'ll need to know:\n\n1. Target audience (e.g., inactive patients)\n2. Campaign duration\n3. Communication channels (Email, SMS, WhatsApp)\n4. Budget/credit allocation\n\nLet\'s start with your target audience. How many patients are you looking to reach?',
    timestamp: '2:32 PM',
  },
]

export default function AIChatbotPage() {
  const [messages, setMessages] = useState(conversationMessages)
  const [input, setInput] = useState('')

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { role: 'user', content: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        {
          role: 'ai',
          content: 'Thank you for that information. Let me process your request and create a customized campaign proposal for you. I\'ll analyze your patient data and suggest the best approach...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setInput('')
    }
  }

  return (
    <div className="orasync-container">
      <Sidebar />
      <div className="orasync-main">
        <Header />
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Chat Header */}
          <div className="sticky top-16 bg-card border-b border-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                N
              </div>
              <div>
                <h2 className="font-bold text-foreground">Nova AI Assistant</h2>
                <p className="text-sm text-muted-foreground">Always online • Ready to assist</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-bl-lg rounded-tl-lg rounded-tr-lg'
                      : 'bg-secondary text-foreground rounded-br-lg rounded-tr-lg rounded-bl-lg'
                  } p-4 rounded-lg`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="sticky bottom-0 bg-card border-t border-border p-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Nova anything... (e.g., 'Create a campaign', 'Schedule appointments')"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
