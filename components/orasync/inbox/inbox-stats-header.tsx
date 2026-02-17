"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/use-user"
import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, Calendar, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface InboxStats {
    totalMessages: number
    unreadMessages: number
    responses: number
    bookings: number
    channels: Array<{
        channel: string
        count: number
        latestMessage: string
        preview: string
    }>
}

export function InboxStatsHeader() {
    const { user } = useUser()
    const [stats, setStats] = useState<InboxStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user?.id) return

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/v1/clinics/${user.id}/inbox/stats`)
                if (res.ok) {
                    const data = await res.json()
                    setStats(data)
                }
            } catch (error) {
                console.error('Failed to fetch inbox stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [user?.id])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="glass-card p-6 animate-pulse">
                        <div className="h-16 bg-muted/20 rounded" />
                    </Card>
                ))}
            </div>
        )
    }

    const metrics = [
        {
            label: "Total Messages",
            value: stats?.totalMessages.toLocaleString() || "0",
            icon: Mail,
            iconColor: "text-blue-500",
            bgGradient: "from-blue-500/10 to-blue-600/10",
            description: "All conversations"
        },
        {
            label: "Unread Messages",
            value: stats?.unreadMessages.toLocaleString() || "0",
            icon: MessageSquare,
            iconColor: "text-purple-500",
            bgGradient: "from-purple-500/10 to-purple-600/10",
            description: "Needs attention",
            badge: stats?.unreadMessages ? stats.unreadMessages > 0 : false
        },
        {
            label: "Responses",
            value: stats?.responses.toLocaleString() || "0",
            icon: CheckCircle2,
            iconColor: "text-green-500",
            bgGradient: "from-green-500/10 to-green-600/10",
            description: "Staff replies sent"
        },
        {
            label: "Bookings",
            value: stats?.bookings.toLocaleString() || "0",
            icon: Calendar,
            iconColor: "text-orange-500",
            bgGradient: "from-orange-500/10 to-orange-600/10",
            description: "From inbox leads"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => (
                <Card
                    key={index}
                    className={cn(
                        "glass-card relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer",
                        "border-border/50 hover:border-primary/30"
                    )}
                >
                    {/* Background gradient glow */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        metric.bgGradient
                    )} />

                    <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(
                                "p-3 rounded-xl bg-background/80 backdrop-blur-sm shadow-lg",
                                "group-hover:scale-110 transition-transform duration-300"
                            )}>
                                <metric.icon className={cn("h-6 w-6", metric.iconColor)} />
                            </div>

                            {metric.badge && (
                                <span className="px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-bold animate-pulse">
                                    New
                                </span>
                            )}
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight text-foreground">
                                {metric.value}
                            </h3>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                                {metric.label}
                            </p>
                            <p className="text-xs text-muted-foreground/70 font-medium">
                                {metric.description}
                            </p>
                        </div>
                    </div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </Card>
            ))}
        </div>
    )
}
