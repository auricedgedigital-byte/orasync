"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Zap } from "lucide-react"
import { UpgradeModal } from "./upgrade-modal"

interface TrialCredits {
  reactivation_emails: number
  reactivation_sms: number
  reactivation_whatsapp: number
  campaigns_started: number
  lead_upload_rows: number
  booking_confirms: number
  ai_suggestions: number
  seo_applies: number
  chatbot_installs: number
}

interface CreditLimit {
  reactivation_emails: number
  reactivation_sms: number
  reactivation_whatsapp: number
  campaigns_started: number
  lead_upload_rows: number
  booking_confirms: number
  ai_suggestions: number
  seo_applies: number
  chatbot_installs: number
}

const CREDIT_LIMITS: CreditLimit = {
  reactivation_emails: 200,
  reactivation_sms: 50,
  reactivation_whatsapp: 20,
  campaigns_started: 3,
  lead_upload_rows: 1000,
  booking_confirms: 50,
  ai_suggestions: 100,
  seo_applies: 1,
  chatbot_installs: 1,
}

export function TrialCreditsHeader() {
  const [credits, setCredits] = useState<TrialCredits | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [lowCreditWarning, setLowCreditWarning] = useState<string | null>(null)
  const [clinicId, setClinicId] = useState<string>("00000000-0000-0000-0000-000000000001") // Test clinic UUID

  const fetchCredits = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/clinics/${clinicId}/trial-check`)
      if (response.ok) {
        const data = await response.json()
        setCredits(data.remaining)
        checkLowCredits(data.remaining)
      }
    } catch (error) {
      console.error("Error fetching trial credits:", error)
    }
  }, [clinicId])

  useEffect(() => {
    fetchCredits()
    const interval = setInterval(fetchCredits, 30000)
    return () => clearInterval(interval)
  }, [fetchCredits])

  const checkLowCredits = (creds: TrialCredits) => {
    const emailUsage =
      (CREDIT_LIMITS.reactivation_emails - creds.reactivation_emails) / CREDIT_LIMITS.reactivation_emails
    const smsUsage = (CREDIT_LIMITS.reactivation_sms - creds.reactivation_sms) / CREDIT_LIMITS.reactivation_sms

    if (emailUsage > 0.8 || smsUsage > 0.8) {
      setLowCreditWarning("Low credits - buy more to avoid campaign pauses")
    } else {
      setLowCreditWarning(null)
    }
  }

  const handleUpgradeSuccess = () => {
    fetchCredits()
    setShowUpgradeModal(false)
  }

  if (!credits) {
    return null
  }

  const emailUsagePercent =
    ((CREDIT_LIMITS.reactivation_emails - credits.reactivation_emails) / CREDIT_LIMITS.reactivation_emails) * 100
  const smsUsagePercent =
    ((CREDIT_LIMITS.reactivation_sms - credits.reactivation_sms) / CREDIT_LIMITS.reactivation_sms) * 100
  const campaignUsagePercent =
    ((CREDIT_LIMITS.campaigns_started - credits.campaigns_started) / CREDIT_LIMITS.campaigns_started) * 100

  return (
    <>
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary" />
            <div className="text-sm font-medium">Trial Credits</div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Emails:</div>
              <div className="text-sm font-semibold">
                {credits.reactivation_emails}/{CREDIT_LIMITS.reactivation_emails}
              </div>
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${emailUsagePercent > 80 ? "bg-red-500" : "bg-green-500"}`}
                  style={{ width: `${emailUsagePercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">SMS:</div>
              <div className="text-sm font-semibold">
                {credits.reactivation_sms}/{CREDIT_LIMITS.reactivation_sms}
              </div>
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${smsUsagePercent > 80 ? "bg-red-500" : "bg-green-500"}`}
                  style={{ width: `${smsUsagePercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Campaigns:</div>
              <div className="text-sm font-semibold">
                {credits.campaigns_started}/{CREDIT_LIMITS.campaigns_started}
              </div>
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${campaignUsagePercent > 80 ? "bg-red-500" : "bg-green-500"}`}
                  style={{ width: `${campaignUsagePercent}%` }}
                />
              </div>
            </div>

            {lowCreditWarning && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-yellow-700">{lowCreditWarning}</span>
              </div>
            )}

            <Button size="sm" onClick={() => setShowUpgradeModal(true)}>
              Buy More
            </Button>
          </div>
        </div>
      </Card>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        onUpgradeSuccess={handleUpgradeSuccess}
      />
    </>
  )
}
