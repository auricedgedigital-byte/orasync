"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Sparkles, MoreVertical, Phone, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message, PatientProfile, Thread } from "@/lib/mock-inbox-data"

interface ChatInterfaceProps {
    thread: Thread
    messages: Message[]
    patient: PatientProfile
    onSendMessage: (text: string) => void
}

export function ChatInterface({ thread, messages, patient, onSendMessage }: ChatInterfaceProps) {
    const [inputText, setInputText] = useState("")

    const handleSend = () => {
        if (!inputText.trim()) return
        onSendMessage(inputText)
        setInputText("")
    }

    const aiSuggestions = [
        "I can book that for you right now.",
        "Do you have insurance we should file?",
        "Please bring your ID to the appointment."
    ]

    return (
        <div className="flex flex-col h-full bg-background relative">
            {/* Header */}
            <div className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm leading-none">{patient.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">{thread.channel} • {patient.status}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => {
                    const isMe = msg.sender === "staff" || msg.sender === "ai"
                    const isAi = msg.sender === "ai"

                    return (
                        <div key={msg.id} className={cn("flex flex-col gap-1 max-w-[80%]", isMe ? "ml-auto items-end" : "")}>
                            <div
                                className={cn(
                                    "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                                    isMe
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted text-foreground rounded-tl-none",
                                    isAi && "bg-indigo-600/10 text-indigo-900 border border-indigo-200 shadow-none dark:text-indigo-300"
                                )}
                            >
                                {msg.content}
                            </div>
                            <div className="flex items-center gap-2 px-1">
                                {isAi && <Sparkles className="h-3 w-3 text-indigo-500" />}
                                <span className="text-[10px] text-muted-foreground/60">{msg.timestamp}</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t space-y-4 bg-muted/5">

                {/* AI Suggestions Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {aiSuggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => setInputText(suggestion)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                        >
                            <Sparkles className="h-3 w-3" />
                            {suggestion}
                        </button>
                    ))}
                </div>

                <div className="relative flex gap-2">
                    <Input
                        className="pr-12 bg-background border-muted-foreground/20 focus-visible:ring-primary/20"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <Button
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8 bg-primary hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                        onClick={handleSend}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
