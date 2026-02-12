"use client"

import { useState } from "react"
import { Mail, MessageSquare, Search, Star, Archive, MoreVertical, Send, Phone, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Thread {
  id: string
  name: string
  avatar?: string
  channel: "email" | "sms" | "whatsapp" | "facebook" | "website"
  lastMessage: string
  timestamp: string
  status: "new" | "replied" | "pending" | "action"
  unread?: boolean
}

interface UnifiedInboxProps {
  threads?: Thread[]
}

const channelConfig = {
  email: { icon: Mail, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600" },
  sms: { icon: Phone, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
  whatsapp: { icon: MessageSquare, color: "bg-green-100 dark:bg-green-900/30 text-green-600" },
  facebook: { icon: Globe, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600" },
  website: { icon: Send, color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600" }
}

const statusConfig = {
  new: { label: "New", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
  replied: { label: "Replied", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" },
  pending: { label: "Pending", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
  action: { label: "Action Required", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" }
}

const defaultThreads: Thread[] = [
  {
    id: "1",
    name: "Alex Johnson",
    channel: "email",
    lastMessage: "Hello from the name dits set your message?",
    timestamp: "10:45 AM",
    status: "new",
    unread: true
  },
  {
    id: "2",
    name: "WhatsApp",
    channel: "whatsapp",
    lastMessage: "Hi! do your message...",
    timestamp: "Yesterday",
    status: "replied"
  },
  {
    id: "3",
    name: "Email Reminder",
    channel: "email",
    lastMessage: "Send message omici...",
    timestamp: "Yesterday",
    status: "pending"
  },
  {
    id: "4",
    name: "Facebook",
    channel: "facebook",
    lastMessage: "Your messages anti...",
    timestamp: "Oct 25",
    status: "action"
  }
]

export default function UnifiedInboxRedesign({ threads = defaultThreads }: UnifiedInboxProps) {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterChannel, setFilterChannel] = useState<string>("all")

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = thread.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thread.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesChannel = filterChannel === "all" || thread.channel === filterChannel
    return matchesSearch && matchesChannel
  })

  const selectedThread = threads.find(t => t.id === selectedThreadId)

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Left Sidebar: Threads List */}
      <div className="w-full sm:w-96 flex flex-col rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700/30 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Unified Inbox</h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700/30 focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Channel Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "email", "sms", "whatsapp", "facebook", "website"].map((channel) => (
              <button
                key={channel}
                onClick={() => setFilterChannel(channel)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  filterChannel === channel
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 dark:bg-slate-700/50 text-foreground hover:bg-gray-200 dark:hover:bg-slate-700"
                }`}
              >
                {channel.charAt(0).toUpperCase() + channel.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-slate-700/30">
              {filteredThreads.map((thread) => {
                const ChannelIcon = channelConfig[thread.channel].icon
                
                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full p-4 text-left transition-all hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
                      selectedThreadId === thread.id ? "bg-primary/10 border-l-4 border-primary" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <Avatar className="flex-shrink-0 w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold">
                          {thread.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-semibold text-foreground truncate ${thread.unread ? "font-bold" : ""}`}>
                            {thread.name}
                          </p>
                          <ChannelIcon className={`w-4 h-4 flex-shrink-0 ${channelConfig[thread.channel].color.split(" ")[0]}`} />
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">{thread.timestamp}</span>
                          {thread.unread && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusConfig[thread.status].color}`}>
                          {statusConfig[thread.status].label}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Mail className="w-12 h-12 mb-3 opacity-50" />
              <p>No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Chat View */}
      {selectedThread ? (
        <div className="flex-1 hidden sm:flex flex-col rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 backdrop-blur-sm overflow-hidden">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold">
                  {selectedThread.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-foreground">{selectedThread.name}</h3>
                <p className="text-sm text-muted-foreground">Active now</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50">
                <Star className="w-5 h-5 text-muted-foreground" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50">
                <Archive className="w-5 h-5 text-muted-foreground" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background to-background/50">
            <div className="flex justify-start">
              <div className="max-w-xs bg-gray-100 dark:bg-slate-700/50 rounded-2xl rounded-tl-none p-4">
                <p className="text-foreground">{selectedThread.lastMessage}</p>
                <p className="text-xs text-muted-foreground mt-2">{selectedThread.timestamp}</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <div className="max-w-xs bg-primary rounded-2xl rounded-tr-none p-4 text-white">
                <p>Thank you! I'll get back to you soon.</p>
                <p className="text-xs opacity-75 mt-2">Just now</p>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-200 dark:border-slate-700/30 flex gap-3">
            <Input
              placeholder="Type your message..."
              className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700/30 focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            <Button className="rounded-xl px-4 bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden sm:flex items-center justify-center rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 text-muted-foreground">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">Select a conversation to start</p>
          </div>
        </div>
      )}
    </div>
  )
}
