"use client"

import { useState, useEffect } from "react"
import { ThreadList } from "./inbox/thread-list"
import { ChatInterface } from "./inbox/chat-interface"
import { PatientSidebar } from "./inbox/patient-sidebar"
import { InboxStatsHeader } from "./inbox/inbox-stats-header"
import { InboxQuickActions } from "./inbox/inbox-quick-actions"
import { useUser } from "@/hooks/use-user"
import type { Thread, Message, Patient } from "@/types/inbox"
import { Loader2 } from "lucide-react"

export default function UnifiedInbox() {
  const { user } = useUser()
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterChannel, setFilterChannel] = useState("all")

  const [threads, setThreads] = useState<Thread[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)

  const [threadsLoading, setThreadsLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)

  const selectedThread = threads.find(t => t.id === selectedThreadId)

  // Fetch threads
  useEffect(() => {
    if (!user?.id) return

    const fetchThreads = async () => {
      setThreadsLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (filterChannel !== 'all') queryParams.append('channel', filterChannel)
        if (searchTerm) queryParams.append('search', searchTerm)

        // Assuming user.id corresponds to clinic_id for now, or we fetch clinic_id from user metadata
        // In the schema, users belong to clinics. 
        // For this demo, let's assume we use the user.id as clinic_id OR fetch the clinic_id first.
        // The previous dashboard code used `user.id` as clinic_id directly in `/api/v1/clinics/${user.id}/dashboard`.
        // So we will stick to that pattern.

        const res = await fetch(`/api/v1/clinics/${user.id}/inbox?${queryParams.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setThreads(data)
        }
      } catch (error) {
        console.error("Failed to fetch threads:", error)
      } finally {
        setThreadsLoading(false)
      }
    }

    const debounce = setTimeout(fetchThreads, 300)
    return () => clearTimeout(debounce)
  }, [user?.id, filterChannel, searchTerm])

  // Fetch messages and patient when thread selected
  useEffect(() => {
    if (!selectedThreadId || !user?.id) return

    const fetchData = async () => {
      setMessagesLoading(true)
      try {
        const thread = threads.find(t => t.id === selectedThreadId)

        // Fetch messages
        const msgRes = await fetch(`/api/v1/clinics/${user.id}/inbox/${selectedThreadId}`)
        if (msgRes.ok) {
          const data = await msgRes.json()
          setMessages(data)
        }

        // Fetch patient if patient_id exists
        if (thread?.patient_id) {
          const patientRes = await fetch(`/api/v1/clinics/${user.id}/patients/${thread.patient_id}`)
          if (patientRes.ok) {
            const patientData = await patientRes.json()
            setCurrentPatient(patientData)
          } else {
            setCurrentPatient(null)
          }
        } else {
          setCurrentPatient(null)
        }

      } catch (error) {
        console.error("Failed to fetch thread details:", error)
      } finally {
        setMessagesLoading(false)
      }
    }

    fetchData()
  }, [selectedThreadId, user?.id, threads])

  const handleSendMessage = async (text: string) => {
    if (!selectedThreadId || !user?.id) return

    // Optimistic update
    const tempId = Date.now().toString()
    const optimisticMessage: Message = {
      id: tempId,
      thread_id: selectedThreadId,
      clinic_id: user.id,
      sender_type: "staff",
      content: text,
      created_at: new Date().toISOString(),
      user_id: user.id
    }

    setMessages(prev => [...prev, optimisticMessage])

    try {
      const res = await fetch(`/api/v1/clinics/${user.id}/inbox/${selectedThreadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text,
          senderType: 'staff',
          userId: user.id
        })
      })

      if (res.ok) {
        const savedMessage = await res.json()
        setMessages(prev => prev.map(m => m.id === tempId ? savedMessage : m))

        // Update thread preview
        setThreads(prev => prev.map(t =>
          t.id === selectedThreadId
            ? { ...t, last_message_content: text, last_message_at: savedMessage.created_at }
            : t
        ).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()))
      } else {
        // Handle error (rollback)
        console.error("Failed to send message")
        setMessages(prev => prev.filter(m => m.id !== tempId))
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages(prev => prev.filter(m => m.id !== tempId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Inbox Statistics Header */}
      <InboxStatsHeader />

      {/* Quick Action Buttons */}
      <InboxQuickActions />

      {/* Main Inbox Interface */}
      <div className="flex h-[calc(100vh-26rem)] w-full bg-background border border-border/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Sidebar: Threads */}
        <div className="w-80 flex-shrink-0 min-w-[300px] border-r border-border/40">
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
        <div className="flex-1 min-w-[400px] bg-background relative">
          {selectedThread ? (
            messagesLoading && messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ChatInterface
                thread={selectedThread}
                messages={messages}
                patient={currentPatient}
                onSendMessage={handleSendMessage}
              />
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/5 p-6 text-center">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No conversation selected</h3>
              <p className="text-sm max-w-xs mx-auto">Select a patient from the list to view their history and start chatting.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Patient Info */}
        <div className="w-[300px] flex-shrink-0 hidden xl:block border-l border-border/40">
          {currentPatient ? (
            <PatientSidebar patient={currentPatient} />
          ) : (
            <div className="h-full bg-muted/5 flex items-center justify-center text-muted-foreground text-xs font-medium">
              <p>Select a thread to view patient details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
