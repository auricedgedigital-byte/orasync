"use client"

import { useState } from "react"
import { ThreadList } from "./inbox/thread-list"
import { ChatInterface } from "./inbox/chat-interface"
import { PatientSidebar } from "./inbox/patient-sidebar"
import { Sparkles } from "lucide-react"
import { mockThreads, mockMessages, mockPatients, type Thread, type Message } from "@/lib/mock-inbox-data"

export default function UnifiedInbox() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(mockThreads[0].id)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterChannel, setFilterChannel] = useState("all")

  // In a real app, these would be state/context
  const [threads, setThreads] = useState(mockThreads)
  const [messagesMap, setMessagesMap] = useState(mockMessages)

  const selectedThread = threads.find(t => t.id === selectedThreadId)
  const currentMessages = selectedThreadId ? messagesMap[selectedThreadId] || [] : []
  const currentPatient = selectedThread ? mockPatients[selectedThread.patientId] : null

  const handleSendMessage = (text: string) => {
    if (!selectedThreadId) return

    const newMessage: Message = {
      id: Date.now().toString(),
      threadId: selectedThreadId,
      content: text,
      sender: "staff",
      timestamp: "Just now",
      type: "text",
      status: "sent"
    }

    setMessagesMap(prev => ({
      ...prev,
      [selectedThreadId]: [...(prev[selectedThreadId] || []), newMessage]
    }))

    // Update thread preview
    setThreads(prev => prev.map(t =>
      t.id === selectedThreadId
        ? { ...t, lastMessage: text, timestamp: "Just now" }
        : t
    ))
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full bg-background border rounded-2xl overflow-hidden shadow-sm">
      {/* Left Sidebar: Threads */}
      <div className="w-80 flex-shrink-0 min-w-[300px]">
        <ThreadList
          threads={threads}
          selectedThreadId={selectedThreadId}
          onSelectThread={(t) => setSelectedThreadId(t.id)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterChannel={filterChannel}
          onFilterChange={setFilterChannel}
        />
      </div>

      {/* Middle Pane: Chat */}
      <div className="flex-1 min-w-[400px] border-r border-l border-muted/20">
        {selectedThread && currentPatient ? (
          <ChatInterface
            thread={selectedThread}
            messages={currentMessages}
            patient={currentPatient}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>

      {/* Right Sidebar: Patient Info */}
      <div className="w-[300px] flex-shrink-0 hidden xl:block">
        {currentPatient ? (
          <PatientSidebar patient={currentPatient} />
        ) : (
          <div className="h-full bg-muted/10 border-l" />
        )}
      </div>
    </div>
  )
}
