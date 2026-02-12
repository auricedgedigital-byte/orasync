"use client"

import React from 'react'
import OrasyncLayout from '@/components/orasync/OrasyncLayout'

export default function AIChatbotOrasyncPage() {
  return (
    <OrasyncLayout>
      <div className="space-y-8">
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Nova AI Chatbot</h1>
          <p className="text-muted-foreground mb-6">AI-powered patient engagement and scheduling assistant</p>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-12 border border-blue-200/30">
            <p className="text-lg text-foreground mb-4">🤖 Nova AI Integration</p>
            <p className="text-muted-foreground">Manage your AI chatbot configuration here</p>
          </div>
        </div>
      </div>
    </OrasyncLayout>
  )
}
