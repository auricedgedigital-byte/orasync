"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Copy, RefreshCw, Check, Globe } from "lucide-react"

export function WebhookGenerator() {
    const [copied, setCopied] = useState(false)
    const [webhookUrl] = useState("https://api.orasync.site/webhooks/v1/leads/ls_928374")
    const [lastPing, setLastPing] = useState<{ source: string, time: string } | null>(null)

    const handleCopy = () => {
        navigator.clipboard.writeText(webhookUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const simulatePing = () => {
        setLastPing({
            source: "Facebook Lead Ads",
            time: new Date().toLocaleTimeString()
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Lead Source Webhook
                </CardTitle>
                <CardDescription>
                    Paste this URL into Facebook Business Manager or Google Ads to instantly capture leads.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input value={webhookUrl} readOnly className="font-mono text-sm bg-muted/50" />
                    <Button variant="outline" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>

                <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                        <span>Recent Events</span>
                        <Button variant="ghost" size="sm" className="h-4 text-[10px] text-slate-400 p-0 hover:text-white" onClick={simulatePing}>
                            <RefreshCw className="h-3 w-3 mr-1" /> Test Event
                        </Button>
                    </div>
                    {lastPing ? (
                        <div className="text-green-400">
                            [{lastPing.time}] Received POST from {lastPing.source} (200 OK)
                        </div>
                    ) : (
                        <div className="text-slate-500 italic">Waiting for events...</div>
                    )}
                    <div className="text-slate-500">Listening on port 443...</div>
                </div>
            </CardContent>
        </Card>
    )
}
