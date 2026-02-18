"use client"

import Image from "next/image"

interface OrasyncLogoProps {
    className?: string
    textClassName?: string
    showText?: boolean
    iconOnly?: boolean
}

export default function OrasyncLogo({
    className = "w-8 h-8",
    textClassName = "text-xl",
    showText = true,
    iconOnly = false
}: OrasyncLogoProps) {
    // Determine visibility based on explicit prop or showText (useful for sidebar collapse)
    const displayOnlyIcon = iconOnly || !showText

    return (
        <div className="flex items-center gap-3 group">
            <div className={`relative flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 ${className}`}>
                {/* 
                  The user requested "name and tooth design" without the background.
                  We ensure no 'bg-' classes are here. 
                */}
                <Image
                    src="/logo.png"
                    alt="Orasync Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {!displayOnlyIcon && (
                <span className={`font-black tracking-tighter text-slate-900 dark:text-white transition-colors group-hover:text-primary ${textClassName}`}>
                    OraSync
                </span>
            )}
        </div>
    )
}
