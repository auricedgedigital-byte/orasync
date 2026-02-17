"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Sparkles, MoreVertical, Phone, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message, Thread, Patient } from "@/types/inbox"
import { format } from "date-fns"

interface ChatInterfaceProps {
    thread: Thread
    messages: Message[]
    patient: Patient | null
    onSendMessage: (text: string) => void
}

export function ChatInterface({ thread, messages, patient, onSendMessage }: ChatInterfaceProps) {
    const [inputText, setInputText] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = () => {
        if (!inputText.trim()) return
        onSendMessage(inputText)
        setInputText("")
    }

    const aiSuggestions = [
        "I can book that for you right now.",
        "Do you have insurance we should file?",
        "Please bring your ID to the appointment.",
        "Our business hours are 9-5 Mon-Fri."
    ]

    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : thread.contact_name || 'Unknown'
    const patientInitials = patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

    return (
        <div className="flex flex-col h-full bg-background relative">
            {/* Header */}
            <div className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
                        <AvatarImage src={patient?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{patientInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-sm leading-none text-foreground">{patientName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-xs text-muted-foreground capitalize font-medium">{thread.channel} • Active</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 sm:px-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 space-y-2">
                        <Sparkles className="w-8 h-8" />
                        <p className="text-sm font-medium">Start the conversation with Nova AI assistance</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.sender_type === "staff" || msg.sender_type === "ai" || msg.sender_type === "system"
                    const isAi = msg.sender_type === "ai"
                    const isSystem = msg.sender_type === "system"

                    if (isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center my-4">
                                <span className="text-[10px] font-bold text-muted-foreground bg-muted/30 px-3 py-1 rounded-full uppercase tracking-wider">
                                    {msg.content}
                                </span>
                            </div>
                        )
                    }

                    return (
                        <div key={msg.id} className={cn("flex flex-col gap-1 max-w-[85%] sm:max-w-[70%]", isMe ? "ml-auto items-end" : "")}>
                            <div className="flex items-end gap-2">
                                {!isMe && (
                                    <Avatar className="h-6 w-6 mb-1 opacity-70">
                                        <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">{patientInitials}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                        "px-4 py-2.5 rounded-2xl text-sm shadow-sm relative group transition-all",
                                        isMe
                                            ? "bg-primary text-primary-foreground rounded-br-none hover:shadow-md hover:shadow-primary/10"
                                            : "bg-muted/80 text-foreground rounded-bl-none hover:bg-muted",
                                        isAi && "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 shadow-indigo-500/5"
                                    )}
                                >
                                    {msg.content}
                                    {isAi && (
                                        <div className="absolute -top-2 -right-2 bg-background rounded-full p-0.5 border border-indigo-100 shadow-sm">
                                            <Sparkles className="h-3 w-3 text-indigo-500 fill-indigo-500/20" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-1">
                                <span className="text-[10px] text-muted-foreground/60 font-medium">
                                    {format(new Date(msg.created_at), 'h:mm a')}
                                </span>
                                {isMe && (
                                    <span className="text-[10px] text-muted-foreground/60 font-medium capitalize">
                                        • {msg.sender_type}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border/40 space-y-4 bg-muted/5 backdrop-blur-sm">

                {/* AI Suggestions Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-linear-fade">
                    {aiSuggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => setInputText(suggestion)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-background hover:bg-primary/5 text-muted-foreground hover:text-primary text-xs font-medium rounded-full border border-border/50 transition-all whitespace-nowrap shadow-sm hover:shadow active:scale-95"
                        >
                            <Sparkles className="h-3 w-3 text-primary/70" />
                            {suggestion}
                        </button>
                    ))}
                </div>

                <div className="relative flex gap-2 items-end">
                    <Input
                        className="min-h-[44px] py-3 pr-12 bg-background border-border/50 focus-visible:ring-primary/20 rounded-2xl shadow-sm resize-none"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <Button
                        size="icon"
                        className={cn(
                            "h-11 w-11 rounded-xl transition-all shadow-md shadow-primary/20 shrink-0",
                            inputText.trim()
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground scale-100"
                                : "bg-muted text-muted-foreground"
                        )}
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Send className="h-5 w-5 ml-0.5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
