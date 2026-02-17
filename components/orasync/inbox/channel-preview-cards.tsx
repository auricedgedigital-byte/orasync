"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/use-user"
import { Card } from "@/components/ui/card"
import { MessageCircle, Mail, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface ChannelPreview {
    channel: string
    count: number
    latestMessage: string
    preview: string
}

const CHANNEL_CONFIG = {
    sms: {
        name: "SMS",
        icon: MessageCircle,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    whatsapp: {
        name: "WhatsApp",
        icon: Send,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20"
    },
    email: {
        name: "Email",
        icon: Mail,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
    },
    webchat: {
        name: "Web Chat",
        icon: MessageCircle,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20"
    }
}

export function ChannelPreviewCards({ channels }: { channels: ChannelPreview[] }) {
    if (!channels || channels.length === 0) {
        return null
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {channels.slice(0, 3).map((channel, index) => {
                const config = CHANNEL_CONFIG[channel.channel as keyof typeof CHANNEL_CONFIG] || CHANNEL_CONFIG.sms
                const Icon = config.icon

                const timeAgo = channel.latestMessage
                    ? formatDistanceToNow(new Date(channel.latestMessage), { addSuffix: true })
                    : "No recent messages"

                return (
                    <Card
                        key={index}
                        className={cn(
                            "glass-card relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer",
                            config.borderColor,
                            "border"
                        )}
                    >
                        {/* Background glow */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                            config.bgColor
                        )} />

                        <div className="relative p-5">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className={cn(
                                    "p-2 rounded-lg backdrop-blur-sm",
                                    config.bgColor
                                )}>
                                    <Icon className={cn("h-5 w-5", config.color)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                                        {config.name}
                                        <span className={cn(
                                            "w-2 h-2 rounded-full animate-pulse",
                                            config.color.replace('text-', 'bg-')
                                        )} />
                                    </h4>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        {timeAgo}
                                    </p>
                                </div>
                                <div className={cn(
                                    "px-2 py-1 rounded-md text-xs font-bold",
                                    config.bgColor,
                                    config.color
                                )}>
                                    {channel.count}
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="mt-3 pt-3 border-t border-border/30">
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {channel.preview || "No recent messages"}
                                </p>
                            </div>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    </Card>
                )
            })}
        </div>
    )
}
