'use client'

import { Plus, Send, Calendar } from 'lucide-react'

export default function QuickActions() {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground px-1">Quick Actions</h3>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 transform hover:scale-105">
        <Plus className="w-5 h-5" />
        Create Campaign
      </button>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 transform hover:scale-105">
        <Send className="w-5 h-5" />
        Send Message
      </button>

      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 transform hover:scale-105">
        <Calendar className="w-5 h-5" />
        Book Appointment
      </button>
    </div>
  )
}
