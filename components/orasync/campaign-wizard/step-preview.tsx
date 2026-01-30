"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Zap, DollarSign, Users, Calendar } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { CampaignState } from "./types"

interface StepPreviewProps {
    onBack: () => void
    onLaunch: () => void
    state: CampaignState
}

export function StepPreview({ onBack, onLaunch, state }: StepPreviewProps) {
    const { leads, selectedTemplate } = state
    if (!selectedTemplate) return null

    const validLeads = leads.filter(l => l.status === "valid").length
    const estimatedCost = validLeads // 1 credit per lead
    const estimatedBookings = Math.floor(validLeads * (parseFloat(selectedTemplate.estimatedConversion) / 100))
    const estimatedRevenue = estimatedBookings * 150 // $150 avg value

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Ready to Launch?</h2>
                <p className="text-muted-foreground">Review your campaign details and estimated results.</p>
            </div>

            <Card className="overflow-hidden border-2 border-primary/10 shadow-lg">
                <div className="bg-primary/5 p-6 text-center border-b border-primary/10">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Projected Impact</p>
                    <div className="flex items-center justify-center gap-1 text-4xl font-bold text-primary">
                        <DollarSign className="h-8 w-8" />
                        {estimatedRevenue.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Estimated Revenue generated</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Total Recipients</p>
                            <div className="flex items-center gap-2 font-semibold">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {validLeads} patients
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Expected Bookings</p>
                            <div className="flex items-center gap-2 font-semibold">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                ~{estimatedBookings} appointments
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Message Preview ({selectedTemplate.channel.toUpperCase()})</p>
                        <div className="bg-muted p-4 rounded-xl text-sm italic border">
                            "{selectedTemplate.content.replace("{name}", "Sarah")}"
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex items-start gap-3 text-sm text-amber-800 dark:text-amber-200">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>This will consume <strong>{estimatedCost} credits</strong> immediately. Credits are non-refundable once the campaign is queued.</p>
                    </div>
                </div>
            </Card>

            <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={onBack}>
                    Back to Template
                </Button>
                <Button size="lg" onClick={onLaunch} className="px-8 shadow-xl shadow-primary/20">
                    <Zap className="mr-2 h-4 w-4 fill-current" />
                    Launch Campaign
                </Button>
            </div>
        </div>
    )
}
