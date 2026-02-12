'use client'

import Header from '@/components/orasync/layout/Header'
import Sidebar from '@/components/orasync/layout/Sidebar'
import QuickActions from '@/components/orasync/layout/QuickActions'
import MetricCard from '@/components/orasync/cards/MetricCard'
import { Mail, MessageSquare, BarChart3, Calendar, MessageCircle, Clock } from 'lucide-react'

const messageThreads = [
  {
    contact: 'Alex Johnson',
    lastMessage: 'Hello from the name sets your message?',
    timestamp: '10:45 AM',
    status: 'New',
    unread: true,
  },
  {
    contact: 'WhatsApp',
    lastMessage: 'Sentime your message the subjects to whatsApp the...',
    timestamp: 'Yesterday',
    status: 'Replied',
    unread: false,
  },
  {
    contact: 'Email Remin',
    lastMessage: 'Your enx message is curring in the thread.',
    timestamp: 'Yesterday',
    status: 'Replied',
    unread: false,
  },
  {
    contact: 'Facebook',
    lastMessage: 'Thanks br sc your message but just senative with @sr...',
    timestamp: 'Oct 25',
    status: 'Pending',
    unread: false,
  },
  {
    contact: 'Website Chat',
    lastMessage: 'Pro eenplied with your message via spp-bopsted end th...',
    timestamp: 'Oct 25',
    status: 'Pending',
    unread: false,
  },
]

const messageChannels = [
  { name: 'SMS', count: '2,450', icon: 'SMS', color: 'blue' },
  { name: 'WhatsApp', count: '12', icon: '💬', color: 'green' },
  { name: 'Email', count: '1,800', icon: '📧', color: 'orange' },
  { name: 'Facebook', count: '320', icon: '👍', color: 'purple' },
]

export default function InboxPage() {
  return (
    <div className="orasync-container">
      <Sidebar />
      <div className="orasync-main">
        <Header />
        <div className="orasync-content max-w-7xl">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Inbox</h1>
            <p className="text-muted-foreground">Unified messaging across all channels</p>
          </div>

          {/* Message Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon={Mail}
              label="Total Messages"
              value="8,432"
              color="blue"
            />
            <MetricCard
              icon={MessageCircle}
              label="Unread Messages"
              value="145"
              subtitle="Action Required"
              color="orange"
            />
            <MetricCard
              icon={MessageSquare}
              label="Responses"
              value="7,890"
              color="green"
            />
            <MetricCard
              icon={Calendar}
              label="Bookings"
              value="320"
              color="purple"
            />
          </div>

          {/* Message Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {messageChannels.map((channel, idx) => {
              const iconMap: Record<string, string> = {
                SMS: '💬',
                '💬': '💬',
                '📧': '📧',
                '👍': '👍',
              }
              return (
                <div key={idx} className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all">
                  <div className="text-3xl mb-2">{channel.icon}</div>
                  <div className="text-sm text-muted-foreground mb-1">{channel.name}</div>
                  <div className="text-2xl font-bold text-foreground">{channel.count}</div>
                </div>
              )
            })}
          </div>

          {/* Message Timeline Activity */}
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Recent Message Timeline</h3>
            <div className="space-y-2 h-32 overflow-x-auto flex">
              {/* Horizontal timeline with dots and messages */}
              <div className="relative w-full flex items-center gap-8 pb-4">
                <div className="flex-shrink-0 w-20 h-2 bg-gradient-to-r from-primary to-primary/20 rounded-full"></div>
                {[
                  { time: 'SMS\n10:45 AM', label: 'Hello one will have previnu...' },
                  { time: 'WhatsApp\n19:03 AM', label: 'HI itoti new time oini...' },
                  { time: 'Email\n7:30 PM', label: 'Hallo is whin you hva abou...' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div className="text-xs text-center text-muted-foreground whitespace-nowrap">
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unified Threads */}
          <div className="p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Unified Threads</h3>
            <div className="space-y-2">
              {messageThreads.map((thread, idx) => (
                <div
                  key={idx}
                  className={`p-4 border border-border rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-primary ${
                    thread.unread ? 'bg-secondary' : 'bg-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{thread.contact}</span>
                        <span
                          className={`status-badge text-xs ${
                            thread.status === 'New'
                              ? 'status-active'
                              : thread.status === 'Replied'
                                ? 'status-completed'
                                : 'status-pending'
                          }`}
                        >
                          {thread.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xs text-muted-foreground mb-2">{thread.timestamp}</div>
                      {thread.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full ml-auto"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="fixed right-8 bottom-8 w-64 space-y-4">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
