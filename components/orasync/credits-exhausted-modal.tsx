"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface CreditsExhaustedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionType: string
  onUpgrade: () => void
}

export function CreditsExhaustedModal({ open, onOpenChange, actionType, onUpgrade }: CreditsExhaustedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <DialogTitle>Credits Exhausted</DialogTitle>
              <DialogDescription>You don't have enough credits to complete this action</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-900">
              Your trial credits for <strong>{actionType}</strong> have been exhausted. Choose a plan or buy a one-off
              pack to resume.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border">
              <div className="font-medium text-sm mb-2">Starter Plan</div>
              <div className="text-lg font-bold mb-2">$99/mo</div>
              <Button size="sm" className="w-full" onClick={onUpgrade}>
                Upgrade
              </Button>
            </div>

            <div className="p-3 rounded-lg border">
              <div className="font-medium text-sm mb-2">Buy Pack</div>
              <div className="text-lg font-bold mb-2">$29+</div>
              <Button size="sm" variant="outline" className="w-full bg-transparent" onClick={onUpgrade}>
                Buy Credits
              </Button>
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
