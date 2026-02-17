"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Play,
    Pause,
    CheckCircle2,
    XCircle,
    MessageCircle,
    Calendar,
    Loader2,
    Sparkles,
    TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"

interface CampaignStats {
    id: string
    name: string
    status: string
    progress: number
    total_recipients: number
    sent_count: number
    failed_count: number
    reply_count: number
    booking_count: number
    started_at: string | null
    completed_at: string | null
    paused_reason: string | null
    estimated_completion: string | null
    progress_percentage: number
    success_rate: number
    reply_rate: number
    booking_rate: number
}

interface CampaignMonitorProps {
    campaignId: string
}

export function CampaignMonitor({ campaignId }: CampaignMonitorProps) {
    const { user } = useUser()
    const [stats, setStats] = useState<CampaignStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        if (!user?.id || !campaignId) return

        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/v1/clinics/${user.id}/campaigns/${campaignId}/stats`)
                if (res.ok) {
                    const data = await res.json()
                    setStats(data)
                }
            } catch (error) {
                console.error('Failed to fetch campaign stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()

        // Poll every 5 seconds if campaign is running
        let interval: NodeJS.Timeout
        if (stats?.status === 'running') {
            interval = setInterval(fetchStats, 5000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [user?.id, campaignId, stats?.status])

    const handleRun = async () => {
        if (!user?.id) return
        setActionLoading('run')
        try {
            const res = await fetch(`/api/v1/clinics/${user.id}/campaigns/${campaignId}/run`, {
                method: 'POST'
            })
            if (res.ok) {
                // Refresh stats
                const statsRes = await fetch(`/api/v1/clinics/${user.id}/campaigns/${campaignId}/stats`)
                if (statsRes.ok) {
                    setStats(await statsRes.json())
                }
            }
        } catch (error) {
            console.error('Failed to run campaign:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const handlePause = async () => {
        if (!user?.id) return
        setActionLoading('pause')
        try {
            const res = await fetch(`/api/v1/clinics/${user.id}/campaigns/${campaignId}/pause`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'Manual pause' })
            })
            if (res.ok) {
                const statsRes = await fetch(`/api/v1/clinics/${user.id}/campaigns/${campaignId}/stats`)
                if (statsRes.ok) {
                    setStats(await statsRes.json())
                }
            }
        } catch (error) {
            console.error('Failed to pause campaign:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const handleResume = async () => {
        if (!user?.id) return
        setActionLoading('resume')
        try {
            const res = await fetch(`/api/v1/clinics/${user.id}/campaigns/${campaignId}/resume`, {
                method: 'POST'
            })
            if (res.ok) {
                const statsRes = await fetch(`/api/v1/clinics/${user.id}/campaigns/${campaignId}/stats`)
                if (statsRes.ok) {
                    setStats(await statsRes.json())
                }
            }
        } catch (error) {
            console.error('Failed to resume campaign:', error)
        } finally {
            setActionLoading(null)
        }
    }

    if (loading) {
        return (
            <Card className="glass-card p-10 text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground mt-4">Loading campaign data...</p>
            </Card>
        )
    }

    if (!stats) {
        return (
            <Card className="glass-card p-10 text-center">
                <p className="text-sm text-muted-foreground">Campaign not found</p>
            </Card>
        )
    }

    const statusConfig = {
        draft: { color: "bg-muted text-muted-foreground", label: "Draft" },
        running: { color: "bg-green-500 text-white animate-pulse", label: "Running" },
        paused: { color: "bg-yellow-500 text-white", label: "Paused" },
        completed: { color: "bg-blue-500 text-white", label: "Completed" },
        failed: { color: "bg-destructive text-white", label: "Failed" }
    }

    const status = statusConfig[stats.status as keyof typeof statusConfig] || statusConfig.draft

    const getNovaCommentary = () => {
        if (stats.status === 'completed') {
            return `Campaign complete! Sent ${stats.sent_count} messages with ${stats.reply_rate}% reply rate. ${stats.booking_count} bookings generated! 🎉`
        }
        if (stats.status === 'running') {
            const batchesRemaining = Math.ceil((stats.total_recipients - stats.sent_count) / 50)
            return `Sending in batches... ${batchesRemaining} more batches to go. ${stats.reply_count} replies so far!`
        }
        if (stats.status === 'paused') {
            return stats.paused_reason || 'Campaign paused'
        }
        return 'Ready to launch your campaign!'
    }

    return (
        <div className="space-y-6">
            {/* Header with Status */}
            <Card className="glass-card p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-black">{stats.name}</h2>
                            <Badge className={cn("text-xs font-bold", status.color)}>
                                {status.label}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {stats.total_recipients.toLocaleString()} recipients
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {stats.status === 'draft' && (
                            <Button
                                onClick={handleRun}
                                disabled={actionLoading === 'run'}
                                className="bg-primary hover:bg-primary/90"
                            >
                                {actionLoading === 'run' ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Starting...
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Run Campaign
                                    </>
                                )}
                            </Button>
                        )}

                        {stats.status === 'running' && (
                            <Button
                                onClick={handlePause}
                                disabled={actionLoading === 'pause'}
                                variant="outline"
                            >
                                {actionLoading === 'pause' ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Pausing...
                                    </>
                                ) : (
                                    <>
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pause
                                    </>
                                )}
                            </Button>
                        )}

                        {stats.status === 'paused' && (
                            <Button
                                onClick={handleResume}
                                disabled={actionLoading === 'resume'}
                                className="bg-primary hover:bg-primary/90"
                            >
                                {actionLoading === 'resume' ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Resuming...
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Resume
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                {(stats.status === 'running' || stats.status === 'paused' || stats.status === 'completed') && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-foreground">
                                {stats.sent_count} / {stats.total_recipients} sent
                            </span>
                            <span className="text-muted-foreground">
                                {stats.progress_percentage}% complete
                            </span>
                        </div>
                        <Progress value={stats.progress_percentage} className="h-3" />
                        {stats.estimated_completion && stats.status === 'running' && (
                            <p className="text-xs text-muted-foreground">
                                Estimated completion: {new Date(stats.estimated_completion).toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                )}

                {/* Nova Commentary */}
                <Card className="mt-4 p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                                {getNovaCommentary()}
                            </p>
                        </div>
                    </div>
                </Card>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-2xl font-black text-foreground">
                                {stats.sent_count - stats.failed_count}
                            </p>
                            <p className="text-xs text-muted-foreground">Delivered</p>
                        </div>
                    </div>
                    <div className="text-xs text-green-500 font-bold">
                        {stats.success_rate}% success rate
                    </div>
                </Card>

                <Card className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-destructive/10">
                            <XCircle className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                            <p className="text-2xl font-black text-foreground">
                                {stats.failed_count}
                            </p>
                            <p className="text-xs text-muted-foreground">Failed</p>
                        </div>
                    </div>
                </Card>

                <Card className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <MessageCircle className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-2xl font-black text-foreground">
                                {stats.reply_count}
                            </p>
                            <p className="text-xs text-muted-foreground">Replies</p>
                        </div>
                    </div>
                    <div className="text-xs text-blue-500 font-bold">
                        {stats.reply_rate}% reply rate
                    </div>
                </Card>

                <Card className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <Calendar className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-2xl font-black text-foreground">
                                {stats.booking_count}
                            </p>
                            <p className="text-xs text-muted-foreground">Bookings</p>
                        </div>
                    </div>
                    <div className="text-xs text-purple-500 font-bold flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {stats.booking_rate}% conversion
                    </div>
                </Card>
            </div>
        </div>
    )
}
