"use client"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Phone, Mail } from "lucide-react"
import type { Thread } from "@/lib/mock-inbox-data"
import { cn } from "@/lib/utils"

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
        const matchesSearch = thread.patientName.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex flex-col h-full border-r bg-muted/10">
            <div className="p-4 border-b space-y-3">
                <h2 className="font-semibold text-lg px-1">Inbox</h2>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search patients..."
                        className="pl-9 bg-background"
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
                                "px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap",
                                filterChannel === type
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted"
                            )}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredThreads.map((thread) => (
                    <div
                        key={thread.id}
                        onClick={() => onSelectThread(thread)}
                        className={cn(
                            "flex flex-col gap-1 p-3 rounded-xl cursor-pointer transition-all border border-transparent",
                            selectedThreadId === thread.id
                                ? "bg-primary/10 border-primary/20"
                                : "hover:bg-muted/50"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <span className={cn("font-medium text-sm", thread.unreadCount > 0 && "font-bold")}>
                                {thread.patientName}
                            </span>
                            <span className="text-xs text-muted-foreground">{thread.timestamp}</span>
                        </div>

                        <p className={cn("text-xs line-clamp-1", thread.unreadCount > 0 ? "text-foreground" : "text-muted-foreground")}>
                            {thread.lastMessage}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="h-5 px-1.5 gap-1 text-[10px] font-normal">
                                {getChannelIcon(thread.channel)}
                                {thread.channel.toUpperCase()}
                            </Badge>
                            {thread.unreadCount > 0 && (
                                <Badge className="h-5 px-1.5 text-[10px] bg-primary text-primary-foreground">
                                    {thread.unreadCount} new
                                </Badge>
                            )}
                        </div>
                    </div>
                ))}

                {filteredThreads.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        No conversations found.
                    </div>
                )}
            </div>
        </div>
    )
}
