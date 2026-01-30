"use client"

import { AdsDashboard } from "@/components/orasync/ads/ads-dashboard"
import { WebhookGenerator } from "@/components/orasync/ads/webhook-generator"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdsPage() {
    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ads Manager</h1>
                    <p className="text-muted-foreground mt-2">
                        Track ROI from Facebook & Google Ads and automate lead ingestion.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Connect Ad Account
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AdsDashboard />
                </div>
                <div className="space-y-6">
                    <WebhookGenerator />

                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/20 text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-semibold mb-1">💡 Pro Tip</p>
                        <p>Leads captured via the webhook will automatically appear in your <strong>Unified Inbox</strong> with a "New Lead" tag.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
