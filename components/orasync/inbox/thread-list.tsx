"use client"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Phone, Mail } from "lucide-react"
import type { Thread } from "@/types/inbox"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface ThreadListProps {
    threads: Thread[]
    selectedThreadId: string | null
    onSelectThread: (thread: Thread) => void
    searchTerm: string
    onSearchChange: (term: string) => void
    filterChannel: string
    onFilterChange: (channel: string) => void
}

export function ThreadList({
    threads,
    selectedThreadId,
    onSelectThread,
    searchTerm,
    onSearchChange,
    filterChannel,
    onFilterChange,
}: ThreadListProps) {
    const filteredThreads = threads.filter((thread) => {
        const patientName = `${thread.patient_first_name || ''} ${thread.patient_last_name || ''}`.trim() || thread.contact_name || 'Unknown'
        const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterChannel === "all" || thread.channel === filterChannel
        return matchesSearch && matchesFilter
    })

    // Helper for channel icon
    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case "sms": return <Phone className="h-3 w-3" />
            case "email": return <Mail className="h-3 w-3" />
            case "whatsapp": return <MessageSquare className="h-3 w-3" />
            default: return <MessageSquare className="h-3 w-3" />
        }
    }

    return (
        <div className="flex flex-col h-full border-r border-border/40 bg-muted/5">
            <div className="p-4 border-b border-border/40 space-y-3">
                <h2 className="font-bold text-lg px-1 tracking-tight">Inbox</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search patients..."
                        className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 text-xs overflow-x-auto pb-1 no-scrollbar">
                    {["all", "sms", "whatsapp", "email"].map((type) => (
                        <button
                            key={type}
                            onClick={() => onFilterChange(type)}
                            className={cn(
                                "px-3 py-1.5 rounded-full border transition-all whitespace-nowrap font-medium text-[11px]",
                                filterChannel === type
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                                    : "bg-background border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredThreads.map((thread) => {
                    const patientName = `${thread.patient_first_name || ''} ${thread.patient_last_name || ''}`.trim() || thread.contact_name || 'Unknown'
                    const isUnread = (thread.unread_count || 0) > 0

                    return (
                        <div
                            key={thread.id}
                            onClick={() => onSelectThread(thread)}
                            className={cn(
                                "flex flex-col gap-1 p-3 rounded-xl cursor-pointer transition-all border border-transparent",
                                selectedThreadId === thread.id
                                    ? "bg-primary/10 border-primary/20 shadow-sm"
                                    : "hover:bg-muted/40 hover:border-border/30"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className={cn("font-medium text-sm truncate max-w-[140px]", isUnread && "font-bold text-foreground")}>
                                    {patientName}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium">
                                    {thread.last_message_at ? formatDistanceToNow(new Date(thread.last_message_at), { addSuffix: true }).replace('about ', '') : ''}
                                </span>
                            </div>

                            <p className={cn("text-xs line-clamp-1 h-4", isUnread ? "text-foreground font-medium" : "text-muted-foreground")}>
                                {thread.last_message_content || "No messages yet"}
                            </p>

                            <div className="flex items-center gap-2 mt-1.5">
                                <Badge variant="secondary" className="h-5 px-1.5 gap-1 text-[10px] font-medium bg-background border-border/50 text-muted-foreground">
                                    {getChannelIcon(thread.channel)}
                                    {thread.channel.toUpperCase()}
                                </Badge>
                                {isUnread && (
                                    <Badge className="h-5 px-1.5 text-[10px] bg-primary text-primary-foreground shadow-sm shadow-primary/20 animate-pulse">
                                        {thread.unread_count} new
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )
                })}

                {filteredThreads.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-3 mt-10 opacity-60">
                        <MessageSquare className="h-10 w-10 stroke-1" />
                        <p>No conversations found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
