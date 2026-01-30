"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Zap } from "lucide-react"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionType?: string
  onUpgradeSuccess?: () => void
}

export function UpgradeModal({ open, onOpenChange, actionType, onUpgradeSuccess }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayPalCheckout = async (packType: string, amount: number) => {
    setIsProcessing(true)
    try {
      // In production, we don't need the clinicId in the URL path for this route 
      // as it's a global API route now: /api/paypal/create-order

      const orderResponse = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pack_type: packType,
          amount: amount,
        }),
      })

      const orderData = await orderResponse.json()

      if (orderData.approval_link) {
        window.location.href = orderData.approval_link
      } else {
        alert("Failed to create PayPal order: " + (orderData.message || "Unknown error"))
      }
    } catch (error) {
      console.error("PayPal checkout error:", error)
      alert("Error initiating PayPal checkout")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <div>
              <DialogTitle>Credits Exhausted</DialogTitle>
              <DialogDescription>
                {actionType ? `You don't have enough ${actionType} credits. ` : ""}Choose a plan or buy a one-off pack
                to continue.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plans Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Monthly Plans
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Starter Plan */}
              <div className="p-4 rounded-lg border-2 border-primary/50 bg-primary/5">
                <div className="font-medium mb-2">Starter</div>
                <div className="text-2xl font-bold mb-3">
                  $99<span className="text-sm font-normal">/mo</span>
                </div>
                <ul className="text-xs space-y-1 mb-4 text-muted-foreground">
                  <li>500 Emails</li>
                  <li>100 SMS</li>
                  <li>10 Campaigns</li>
                  <li>5,000 Leads</li>
                </ul>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    handlePayPalCheckout("starter_plan", 99)
                  }}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Upgrade to Starter"}
                </Button>
              </div>

              {/* Growth Plan */}
              <div className="p-4 rounded-lg border-2 border-primary bg-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Growth</div>
                  <Badge className="bg-primary">Popular</Badge>
                </div>
                <div className="text-2xl font-bold mb-3">
                  $299<span className="text-sm font-normal">/mo</span>
                </div>
                <ul className="text-xs space-y-1 mb-4 text-muted-foreground">
                  <li>2,000 Emails</li>
                  <li>500 SMS</li>
                  <li>Unlimited Campaigns</li>
                  <li>50,000 Leads</li>
                </ul>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handlePayPalCheckout("growth_plan", 299)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Upgrade to Growth"}
                </Button>
              </div>
            </div>
          </div>

          {/* One-off Packs Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">One-off Credit Packs</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border">
                <div className="font-medium text-sm mb-2">Email Pack</div>
                <div className="text-lg font-bold mb-2">$29</div>
                <div className="text-xs text-muted-foreground mb-3">+500 Emails</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handlePayPalCheckout("email_pack", 29)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "..." : "Buy Now"}
                </Button>
              </div>

              <div className="p-3 rounded-lg border">
                <div className="font-medium text-sm mb-2">SMS Pack</div>
                <div className="text-lg font-bold mb-2">$49</div>
                <div className="text-xs text-muted-foreground mb-3">+200 SMS</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handlePayPalCheckout("sms_pack", 49)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "..." : "Buy Now"}
                </Button>
              </div>

              <div className="p-3 rounded-lg border">
                <div className="font-medium text-sm mb-2">Campaign Pack</div>
                <div className="text-lg font-bold mb-2">$19</div>
                <div className="text-xs text-muted-foreground mb-3">+5 Campaigns</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handlePayPalCheckout("campaign_pack", 19)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "..." : "Buy Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
