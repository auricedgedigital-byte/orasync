"use client"

import { useState, useEffect } from "react"
import { ThreadList } from "./inbox/thread-list"
import { ChatInterface } from "./inbox/chat-interface"
import { PatientSidebar } from "./inbox/patient-sidebar"
import { InboxStatsHeader } from "./inbox/inbox-stats-header"
import { InboxQuickActions } from "./inbox/inbox-quick-actions"
import { useUser } from "@/hooks/use-user"
import type { Thread, Message, Patient } from "@/types/inbox"
import { Loader2, Inbox, Search, Filter, MessageSquare, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UnifiedInbox() {
  const { user } = useUser()
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterChannel, setFilterChannel] = useState("all")
  const [mounted, setMounted] = useState(false)

  const [threads, setThreads] = useState<Thread[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)

  const [threadsLoading, setThreadsLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)

  const selectedThread = threads.find(t => t.id === selectedThreadId)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch threads
  useEffect(() => {
    if (!user?.id) return

    const fetchThreads = async () => {
      setThreadsLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (filterChannel !== 'all') queryParams.append('channel', filterChannel)
        if (searchTerm) queryParams.append('search', searchTerm)

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
        const msgRes = await fetch(`/api/v1/clinics/${user.id}/inbox/${selectedThreadId}`)
        if (msgRes.ok) {
          const data = await msgRes.json()
          setMessages(data)
        }

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

  if (!mounted) return null

  const handleSendMessage = async (text: string) => {
    // Implement sending with Nova Soul fallback logic if needed
    console.log("Sending message:", text)
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Premium Stats Strip */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex-1 min-w-[200px] h-24 rounded-[1.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-6 flex flex-col justify-center gap-1 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Conversations</span>
          <span className="text-2xl font-black">{threads.length}</span>
        </div>
        <div className="flex-1 min-w-[200px] h-24 rounded-[1.5rem] border border-primary/20 bg-primary/5 p-6 flex flex-col justify-center gap-1 shadow-sm">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Nova AI Suggestions</span>
          <span className="text-2xl font-black text-primary">12 Ready</span>
        </div>
        <div className="flex-1 min-w-[200px] h-24 rounded-[1.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-6 flex flex-col justify-center gap-1 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SLA Status</span>
          <span className="text-2xl font-black text-emerald-500">100%</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex h-[calc(100vh-20rem)] w-full rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">

        {/* Thread List Pane */}
        <div className="w-96 flex-shrink-0 border-r border-slate-200 dark:border-white/5 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
            <div className="relative group mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-12 rounded-2xl bg-white dark:bg-slate-800 border-transparent focus:border-primary/20 shadow-inner font-bold text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">All</Button>
              <Button variant="ghost" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">SMS</Button>
              <Button variant="ghost" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">Email</Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
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
        </div>

        {/* Chat Interface Pane */}
        <div className="flex-1 flex flex-col relative bg-white/30 dark:bg-transparent">
          {selectedThread ? (
            <ChatInterface
              thread={selectedThread}
              messages={messages}
              patient={currentPatient}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="h-24 w-24 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
                <Inbox className="h-10 w-10 text-slate-200 dark:text-white/10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Patient Hub Primary</h3>
              <p className="text-sm font-medium text-slate-500 max-w-sm">Select a conversation from the left to engage with high-fidelity patient intelligence.</p>
            </div>
          )}
        </div>

        {/* Patient Detail Sidebar (Desktop only) */}
        <div className="w-80 flex-shrink-0 border-l border-slate-200 dark:border-white/5 hidden xl:flex flex-col bg-slate-50/50 dark:bg-transparent">
          {currentPatient ? (
            <PatientSidebar patient={currentPatient} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-300 dark:text-white/5">
              <Sparkles className="h-12 w-12 mb-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Clinical Context Node</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
