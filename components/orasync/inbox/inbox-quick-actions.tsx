"use client"

import { Button } from "@/components/ui/button"
import { MessageSquareText, Send, CalendarPlus, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function InboxQuickActions() {
    const actions = [
        {
            label: "Create Campaign",
            description: "Start a new patient outreach",
            icon: Zap,
            href: "/patient-engagement",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            hoverBgColor: "hover:bg-purple-500/20"
        },
        {
            label: "Send Message",
            description: "Quick compose",
            icon: Send,
            href: "/unified-inbox?action=compose",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            hoverBgColor: "hover:bg-blue-500/20"
        },
        {
            label: "Book Appointment",
            description: "Schedule patient visit",
            icon: CalendarPlus,
            href: "/appointments?action=book",
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            hoverBgColor: "hover:bg-green-500/20"
        }
    ]

    return (
        <div className="flex items-center gap-3 flex-wrap">
            {actions.map((action, index) => {
                const Icon = action.icon

                return (
                    <Link key={index} href={action.href} className="flex-1 min-w-[180px]">
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full h-auto glass-card border-border/50 group hover:scale-[1.02] transition-all duration-300",
                                "hover:border-primary/30"
                            )}
                        >
                            <div className={cn(
                                "flex items-center gap-3 p-3 w-full",
                                action.hoverBgColor,
                                "rounded-lg transition-colors"
                            )}>
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    action.bgColor
                                )}>
                                    <Icon className={cn("h-5 w-5", action.color)} />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                        {action.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {action.description}
                                    </p>
                                </div>
                            </div>
                        </Button>
                    </Link>
                )
            })}
        </div>
    )
}
