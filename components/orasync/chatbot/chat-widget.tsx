"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Send, MessageCircle, Sparkles, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage, ChatConfig } from "./types"

interface ChatWidgetProps {
    config: ChatConfig
}

export function ChatWidget({ config }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            text: config.welcomeMessage,
            sender: "ai",
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen, isTyping])

    const handleSend = async () => {
        if (!inputValue.trim()) return

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsTyping(true)

        // Simulate AI delay and response
        setTimeout(() => {
            let aiText = "I can help with that. Could you please provide your phone number so we can look up your file?"
            let intent: ChatMessage["intent"] = "QUESTION"

            const lowerInput = userMsg.text.toLowerCase()
            if (lowerInput.includes("book") || lowerInput.includes("appointment")) {
                aiText = "I'd be happy to schedule an appointment. We have openings for tomorrow at 2 PM or 4 PM. Do either of those work?"
                intent = "BOOKING"
            } else if (lowerInput.includes("price") || lowerInput.includes("cost")) {
                aiText = "Our basic exam starts at $99. Do you have insurance we should verify?"
                intent = "QUESTION"
            }

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: "ai",
                timestamp: new Date(),
                intent
            }

            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {isOpen && (
                <Card className="w-[350px] h-[500px] shadow-2xl border-2 border-primary/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div
                        className="p-4 flex items-center justify-between text-white"
                        style={{ backgroundColor: config.primaryColor }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-none">{config.botName}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] opacity-90">Online Now</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-white hover:bg-white/20"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col max-w-[85%]",
                                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                                        msg.sender === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-white border text-foreground rounded-bl-none"
                                    )}
                                >
                                    {msg.text}
                                </div>
                                {msg.intent === "BOOKING" && msg.sender === "ai" && (
                                    <div className="mt-1 flex gap-2">
                                        <span className="text-[10px] font-medium text-primary px-2 py-0.5 bg-primary/5 rounded-full border border-primary/20 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Booking Intent
                                        </span>
                                    </div>
                                )}
                                <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-70">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-1 bg-muted/20 px-3 py-2 rounded-xl w-fit">
                                <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-background border-t">
                        <div className="relative">
                            <Input
                                placeholder="Type a message..."
                                className="pr-10 bg-muted/20 border-muted-foreground/10 focus-visible:ring-primary/20"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <Button
                                size="icon"
                                className="absolute right-1 top-1 h-8 w-8 shadow-none"
                                onClick={handleSend}
                                style={{ backgroundColor: config.primaryColor }}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                                Powered by <Sparkles className="h-3 w-3 text-primary" /> <strong>Orasync AI</strong>
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Toggle Button */}
            <Button
                size="lg"
                className="h-14 w-14 rounded-full shadow-xl hover:scale-105 transition-all p-0 flex items-center justify-center relative overflow-hidden"
                onClick={() => setIsOpen(!isOpen)}
                style={{ backgroundColor: config.primaryColor }}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-7 w-7" />
                )}
            </Button>
        </div>
    )
}
