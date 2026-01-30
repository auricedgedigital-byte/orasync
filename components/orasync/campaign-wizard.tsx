"use client"

import { useState } from "react"
import { StepUpload } from "./step-upload"
import { StepTemplate } from "./step-template"
import { StepPreview } from "./step-preview"
import type { CampaignState, Lead, CampaignTemplate } from "./types"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CampaignWizard() {
    const [complete, setComplete] = useState(false)
    const [state, setState] = useState<CampaignState>({
        step: 1,
        leads: [],
        selectedTemplate: null,
        campaignName: "",
        scheduledDate: null
    })

    const handleLeadsUploaded = (leads: Lead[]) => {
        setState(prev => ({ ...prev, leads, step: 2 }))
    }

    const handleTemplateSelected = (template: CampaignTemplate) => {
        setState(prev => ({ ...prev, selectedTemplate: template, step: 3 }))
    }

    const handleLaunch = () => {
        // API Call would go here
        setComplete(true)
    }

    const renderCurrentStep = () => {
        switch (state.step) {
            case 1:
                return <StepUpload onNext={handleLeadsUploaded} initialLeads={state.leads} />
            case 2:
                return (
                    <StepTemplate
                        onBack={() => setState(prev => ({ ...prev, step: 1 }))}
                        onNext={handleTemplateSelected}
                        initialTemplate={state.selectedTemplate}
                    />
                )
            case 3:
                return (
                    <StepPreview
                        onBack={() => setState(prev => ({ ...prev, step: 2 }))}
                        onLaunch={handleLaunch}
                        state={state}
                    />
                )
            default:
                return null
        }
    }

    if (complete) {
        return (
            <div className="max-w-md mx-auto text-center space-y-6 pt-20 animate-in zoom-in-50 duration-500">
                <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold mb-2">Campaign Launched!</h2>
                    <p className="text-muted-foreground">
                        We are processing {state.leads.filter(l => l.status === "valid").length} messages.
                        You can track performance in the dashboard.
                    </p>
                </div>
                <div className="flex gap-4 justify-center">
                    <Link href="/dashboard">
                        <Button variant="outline">Return to Dashboard</Button>
                    </Link>
                    <Link href="/unified-inbox">
                        <Button>Go to Inbox</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Progress Stepper */}
            <div className="flex items-center justify-center mb-12">
                {[1, 2, 3].map((step) => {
                    const isActive = state.step >= step
                    const isCurrent = state.step === step
                    return (
                        <div key={step} className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${isActive ? "bg-primary border-primary text-primary-foreground" : "border-muted text-muted-foreground"
                                    }`}
                            >
                                {step}
                            </div>
                            {step < 3 && (
                                <div
                                    className={`w-16 h-0.5 mx-2 transition-colors ${state.step > step ? "bg-primary" : "bg-muted"
                                        }`}
                                />
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="min-h-[400px]">
                {renderCurrentStep()}
            </div>
        </div>
    )
}
