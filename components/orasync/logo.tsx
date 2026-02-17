"use client"

import Image from "next/image"

export default function OrasyncLogo({ className = "w-8 h-8", textClassName = "text-xl", showText = true }: { className?: string, textClassName?: string, showText?: boolean }) {
    return (
        <div className="flex items-center gap-2.5 group">
            <div className={`relative flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 ${className}`}>
                <Image
                    src="/logo.png"
                    alt="Orasync Logo"
                    fill
                    className="object-contain drop-shadow-lg"
                />
            </div>
            {showText && (
                <span className={`font-black tracking-tighter text-foreground transition-colors group-hover:text-primary ${textClassName}`}>
                    OraSync
                </span>
            )}
        </div>
    )
}
