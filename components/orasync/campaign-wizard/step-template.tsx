"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mail, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { CAMPAIGN_TEMPLATES, type CampaignTemplate } from "./types"

interface StepTemplateProps {
    onBack: () => void
    onNext: (template: CampaignTemplate) => void
    initialTemplate: CampaignTemplate | null
}

export function StepTemplate({ onBack, onNext, initialTemplate }: StepTemplateProps) {
    const [selected, setSelected] = useState<CampaignTemplate | null>(initialTemplate)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Choose a Message</h2>
                <p className="text-muted-foreground">Select a high-converting template for your campaign.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CAMPAIGN_TEMPLATES.map((template) => {
                    const isSelected = selected?.id === template.id
                    return (
                        <Card
                            key={template.id}
                            className={cn(
                                "p-5 cursor-pointer transition-all relative border-2",
                                isSelected
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-transparent hover:border-primary/20 hover:bg-muted/50"
                            )}
                            onClick={() => setSelected(template)}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-3">
                                <Badge variant="outline" className={cn(
                                    "gap-1.5",
                                    template.channel === "sms" ? "border-blue-200 text-blue-700 bg-blue-50" : "border-purple-200 text-purple-700 bg-purple-50"
                                )}>
                                    {template.channel === "sms" ? <MessageSquare className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                                    {template.channel.toUpperCase()}
                                </Badge>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    ~{template.estimatedConversion} conv.
                                </span>
                            </div>

                            <h3 className="font-bold text-lg mb-1">{template.name}</h3>

                            <div className="bg-background rounded-lg p-3 text-sm text-muted-foreground border mt-3 italic mb-2">
                                "{template.content}"
                            </div>
                        </Card>
                    )
                })}
            </div>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button
                    onClick={() => selected && onNext(selected)}
                    disabled={!selected}
                    className="px-8"
                >
                    Review & Launch
                </Button>
            </div>
        </div>
    )
}
