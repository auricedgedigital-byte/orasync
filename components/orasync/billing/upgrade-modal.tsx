"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const PLANS = [
    {
        id: "starter_plan",
        name: "Starter",
        price: "$149",
        period: "month",
        description: "Perfect for solo dentists testing automated growth.",
        features: [
            "Core CRM & Inbox",
            "3 Campaigns / month",
            "1,000 Email credits",
            "100 SMS credits",
            "Basic AI Assistant",
            "Standard Support"
        ],
        highlight: false
    },
    {
        id: "growth_plan",
        name: "Growth",
        price: "$349",
        period: "month",
        description: "The AI Revenue Engine for high-volume practices.",
        features: [
            "Unlimited Campaigns",
            "5,000 Email credits",
            "500 SMS credits",
            "WhatsApp & Booking Automation",
            "Nova AI Assistant (Pro)",
            "Revenue Dashboard",
            "Priority Support (24/7)"
        ],
        highlight: true,
        badge: "Most Popular"
    },
    {
        id: "pro_plan",
        name: "Pro",
        price: "$699",
        period: "month",
        description: "Custom automation for multi-location groups.",
        features: [
            "Everything in Growth",
            "Multi-branch Support",
            "Custom Workflow Design",
            "Dedicated Onboarding",
            "Advanced AI Logic",
            "Ads Integration Support"
        ],
        highlight: false
    }
]

export function UpgradeModal({ open, onOpenChange, onUpgrade }: { open: boolean, onOpenChange: (open: boolean) => void, onUpgrade: (planId: string) => void }) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>("growth_plan")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl bg-slate-900 border-slate-800 text-slate-100 p-0 overflow-hidden shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={cn(
                                "p-8 flex flex-col relative transition-all cursor-pointer group",
                                selectedPlan === plan.id ? "bg-slate-800/50" : "bg-transparent hover:bg-slate-800/30",
                                plan.highlight && "md:border-l border-slate-800"
                            )}
                        >
                            {plan.badge && (
                                <Badge className="absolute top-4 right-4 bg-blue-600 text-white border-none shadow-lg shadow-blue-600/20">
                                    {plan.badge}
                                </Badge>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-slate-400 text-sm">/{plan.period}</span>
                                </div>
                                <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                            </div>

                            <div className="space-y-3 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <div className={cn(
                                            "p-0.5 rounded-full",
                                            selectedPlan === plan.id ? "bg-blue-600/20 text-blue-400" : "bg-slate-800 text-slate-500"
                                        )}>
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <span className={selectedPlan === plan.id ? "text-slate-200" : "text-slate-400"}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8">
                                <div className={cn(
                                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                                    selectedPlan === plan.id ? "border-blue-500 bg-blue-500" : "border-slate-700 bg-transparent"
                                )}>
                                    {selectedPlan === plan.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter className="p-6 bg-slate-950/50 border-t border-slate-800 flex sm:justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Secured by Stripe & PayPal. Cancel anytime.
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-500 px-8 h-11 text-base font-semibold shadow-lg shadow-blue-600/20"
                            onClick={() => selectedPlan && onUpgrade(selectedPlan)}
                        >
                            Upgrade Now
                            <Zap className="w-4 h-4 ml-2 fill-current" />
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
