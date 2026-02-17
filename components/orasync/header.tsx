"use client"

import { Bell, Search, Command, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="flex h-16 items-center px-4 gap-4">
                {/* Clinic Context Switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="hidden md:flex items-center gap-2 pl-2 pr-3 h-10 rounded-xl hover:bg-accent/50">
                            <Avatar className="h-6 w-6 rounded-lg bg-primary/20">
                                <AvatarFallback className="text-primary text-xs font-bold">SP</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start gap-0.5">
                                <span className="text-sm font-semibold leading-none">Smile Perfect Dental</span>
                                <span className="text-[10px] text-muted-foreground font-medium">Clinic ID: #8832</span>
                            </div>
                            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                        <DropdownMenuLabel>Switch Clinic</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Unknown Clinic</DropdownMenuItem>
                        <DropdownMenuItem>Add New Clinic...</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Global Search */}
                <div className="flex-1 flex max-w-xl ml-auto md:ml-0 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search patients, campaigns, or ask Nova..."
                        className="pl-9 h-10 w-full bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all rounded-xl"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {/* AI Status */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-ai-primary/10 rounded-full border border-ai-primary/20">
                        <Sparkles className="h-3.5 w-3.5 text-ai-primary animate-pulse" />
                        <span className="text-[11px] font-bold text-ai-primary">Nova Active</span>
                    </div>

                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
                        <Bell className="h-5 w-5" />
                    </Button>

                    <Avatar className="h-8 w-8 rounded-xl ring-2 ring-border cursor-pointer">
                        <AvatarImage src="/avatar-placeholder.png" alt="User" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">DR</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    )
}
