"use client"

import { useState } from "react"
import { ChatWidget } from "@/components/orasync/chatbot/chat-widget"
import { ChatSettings } from "@/components/orasync/chatbot/chat-settings"
import { DEFAULT_CONFIG, type ChatConfig } from "@/components/orasync/chatbot/types"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export default function ChatbotPage() {
    const [config, setConfig] = useState<ChatConfig>(DEFAULT_CONFIG)

    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Virtual Front Desk</h1>
                    <p className="text-muted-foreground mt-2">
                        Configure your AI assistant to capture leads and book appointments 24/7.
                    </p>
                </div>
                <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live Site
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <ChatSettings config={config} onConfigChange={setConfig} />
                </div>

                <div className="space-y-4">
                    <div className="bg-muted/30 border-2 border-dashed rounded-3xl h-[600px] relative flex items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2068')] bg-cover bg-center opacity-90">
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px]" />

                        <div className="relative z-10 text-center space-y-4 max-w-sm p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl">
                            <h3 className="font-serif text-2xl font-bold text-gray-900">Bright Smile Dental</h3>
                            <p className="text-gray-600">This is a preview of how the widget looks on your actual website background.</p>
                            <Button>Book Appointment (Demo)</Button>
                        </div>

                        {/* The Widget lives here */}
                        <div className="absolute bottom-0 right-0 p-6 w-full h-full pointer-events-none">
                            <div className="pointer-events-auto h-full w-full">
                                <ChatWidget config={config} />
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        <p>Try interacting with the widget above to test the AI booking flow.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
