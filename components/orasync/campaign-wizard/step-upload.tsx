"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileDown, CheckCircle, AlertCircle, Users } from "lucide-react"
import type { CampaignState, Lead } from "./types"
import { cn } from "@/lib/utils"

interface StepUploadProps {
    onNext: (leads: Lead[]) => void
    initialLeads: Lead[]
}

export function StepUpload({ onNext, initialLeads }: StepUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [uploadedLeads, setUploadedLeads] = useState<Lead[]>(initialLeads)

    const simulateUpload = () => {
        setAnalyzing(true)
        // Simulating CSV parsing and deduping
        setTimeout(() => {
            const mockLeads: Lead[] = Array.from({ length: 154 }).map((_, i) => ({
                id: `l${i}`,
                name: i % 2 === 0 ? "John Doe" : "Jane Smith",
                phone: "+1555000000",
                email: "patient@example.com",
                status: i < 4 ? "duplicate" : "valid", // Simulate some dupes
                lastVisit: "8 months ago"
            }))
            setUploadedLeads(mockLeads)
            setAnalyzing(false)
        }, 1500)
    }

    const validLeads = uploadedLeads.filter(l => l.status === "valid")
    const duplicateLeads = uploadedLeads.filter(l => l.status === "duplicate")

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Import Patients</h2>
                <p className="text-muted-foreground">Upload your patient list to start a reactivation campaign.</p>
            </div>

            <div
                className={cn(
                    "border-2 border-dashed rounded-2xl p-10 transition-all text-center cursor-pointer",
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50",
                    uploadedLeads.length > 0 ? "bg-muted/10 border-green-500/20" : ""
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); simulateUpload() }}
                onClick={() => { if (uploadedLeads.length === 0) simulateUpload() }}
            >
                {analyzing ? (
                    <div className="space-y-4">
                        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                        <p className="text-sm font-medium">Normalizing phone numbers and checking duplicates...</p>
                    </div>
                ) : uploadedLeads.length > 0 ? (
                    <div className="space-y-4">
                        <div className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold">{validLeads.length} Patients Ready</h3>
                        <p className="text-sm text-muted-foreground">
                            We found {uploadedLeads.length} rows. {duplicateLeads.length} were identified as duplicates.
                        </p>
                        <div className="flex justify-center gap-4 pt-2">
                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setUploadedLeads([]) }}>
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                            <Upload className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg">Drop your CSV here</p>
                            <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                        </div>
                        <div className="pt-4 flex justify-center gap-4">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <FileDown className="h-3 w-3" />
                                Template.csv
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {uploadedLeads.length > 0 && (
                <Card className="p-4 bg-muted/30 border-none">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Credit Usage Estimate</p>
                                <p className="text-xs text-muted-foreground">Based on {validLeads.length} valid contacts</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">{validLeads.length}</p>
                            <p className="text-xs text-muted-foreground">credits</p>
                        </div>
                    </div>
                </Card>
            )}

            <div className="flex justify-end pt-4">
                <Button
                    size="lg"
                    disabled={validLeads.length === 0 || analyzing}
                    onClick={() => onNext(validLeads)}
                    className="w-full sm:w-auto px-8"
                >
                    Continue to Template
                </Button>
            </div>
        </div>
    )
}
