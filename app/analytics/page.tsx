"use client"

import { useState } from "react"
import { ReportBuilder } from "@/components/orasync/analytics/report-builder"
import { ReportVisualizer } from "@/components/orasync/analytics/report-visualizer"
import type { ReportConfig } from "@/components/orasync/analytics/types"
import { subDays } from "date-fns"

export default function AnalyticsPage() {
    const [config, setConfig] = useState<ReportConfig>({
        type: "production",
        dateRange: { from: subDays(new Date(), 30), to: new Date() },
        includeCharts: true
    })

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
                <p className="text-muted-foreground mt-2">
                    Deep-dive insights into practice performance, collections, and marketing ROI.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Configuration */}
                <div className="lg:col-span-1">
                    <ReportBuilder onGenerate={setConfig} />
                </div>

                {/* Main: Visualization */}
                <div className="lg:col-span-3">
                    <ReportVisualizer config={config} />
                </div>
            </div>
        </div>
    )
}
