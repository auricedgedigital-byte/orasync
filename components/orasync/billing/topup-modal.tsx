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
import { MessageSquare, Mail, Sparkles, Zap, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const TOPUP_PACKS = [
    {
        id: "sms_pack",
        name: "SMS Booster",
        amount: "1,000 SMS",
        price: "$20",
        icon: MessageSquare,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        description: "Direct patient reactivation via SMS."
    },
    {
        id: "email_pack",
        name: "Email Bulk",
        amount: "5,000 Emails",
        price: "$15",
        icon: Mail,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        description: "High-volume email outreach."
    },
    {
        id: "ai_pack",
        name: "Nova AI Pack",
        amount: "AI Content Gen",
        price: "$29",
        icon: Sparkles,
        color: "text-indigo-400",
        bg: "bg-indigo-400/10",
        description: "Unlock advanced AI message generation."
    },
    {
        id: "automation_pack",
        name: "Workflow Pack",
        amount: "Extra Automation",
        price: "$49",
        icon: Zap,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        description: "Advanced internal automation triggers."
    }
]

export function TopupModal({ open, onOpenChange, onPurchase }: { open: boolean, onOpenChange: (open: boolean) => void, onPurchase: (packId: string) => void }) {
    const [selectedPack, setSelectedPack] = useState<string | null>("sms_pack")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl bg-slate-900 border-slate-800 text-slate-100 p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="p-6 border-b border-slate-800">
                    <DialogTitle className="text-xl font-bold">Top-up Credits</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Add more fuel to your AI Revenue Engine. Credits never expire.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TOPUP_PACKS.map((pack) => (
                        <div
                            key={pack.id}
                            onClick={() => setSelectedPack(pack.id)}
                            className={cn(
                                "p-4 rounded-xl border transition-all cursor-pointer group flex items-start gap-4",
                                selectedPack === pack.id
                                    ? "bg-slate-800 border-blue-500 shadow-lg shadow-blue-500/10"
                                    : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                            )}
                        >
                            <div className={cn("p-3 rounded-lg flex-shrink-0", pack.bg, pack.color)}>
                                <pack.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-slate-100">{pack.name}</h3>
                                    <span className="text-lg font-bold text-slate-200">{pack.price}</span>
                                </div>
                                <p className="text-sm font-medium text-blue-400 mb-1">{pack.amount}</p>
                                <p className="text-xs text-slate-500 leading-tight">{pack.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter className="p-6 bg-slate-950/50 border-t border-slate-800 flex sm:justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        One-time purchase. Securely processed.
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-500 px-8 h-10 font-semibold shadow-lg shadow-blue-600/20"
                            onClick={() => selectedPack && onPurchase(selectedPack)}
                        >
                            Purchase Pack
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
