"use client"

import { Tooth, Pulse } from "@/components/icons"

export default function OrasyncLogo({ className = "w-8 h-8", textClassName = "text-xl" }: { className?: string, textClassName?: string }) {
    return (
        <div className="flex items-center gap-2.5 group">
            <div className={`relative flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20 transition-all group-hover:scale-110 group-hover:rotate-3 ${className}`}>
                <Tooth className="w-1/2 h-1/2 text-primary-foreground absolute" />
                <Pulse className="w-3/4 h-3/4 text-primary-foreground/40 absolute animate-pulse" />
            </div>
            <span className={`font-black tracking-tighter text-foreground transition-colors group-hover:text-primary ${textClassName}`}>
                OraSync
            </span>
        </div>
    )
}
