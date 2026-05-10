"use client"

import { Bell, Search, Command, ChevronDown, Sparkles, LogOut } from "lucide-react"
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
import { ThemeToggle } from "@/components/theme-toggle"
import { useUser } from "@/hooks/use-user"
import { signOut } from "next-auth/react"

export function Header() {
    const { user } = useUser()

    const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
        if (name) {
            const parts = name.split(" ")
            if (parts.length >= 2) {
                return (parts[0][0] + parts[1][0]).toUpperCase()
            }
            return name.slice(0, 2).toUpperCase()
        }
        if (email) {
            return email.slice(0, 2).toUpperCase()
        }
        return "DS"
    }

    const clinicName = user?.name ? `${user.name.split(" ")[0]}'s Clinic` : "My Dental Practice"
    const clinicId = user?.clinic_id || user?.id || "demo"

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl transition-colors duration-500">
            <div className="flex h-20 items-center px-6 gap-6">
                {/* Clinic Context Switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 h-12 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-black text-xs">{clinicName.slice(0, 2).toUpperCase()}</span>
                            </div>
                            <div className="flex flex-col items-start gap-0">
                                <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">{clinicName}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Clinic ID: #{clinicId.slice(0, 8)}</span>
                            </div>
                            <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[240px] rounded-2xl border-slate-200 dark:border-white/10 p-2 shadow-2xl">
                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Switch Clinic</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 my-1" />
                        <DropdownMenuItem className="rounded-xl py-2 px-3 focus:bg-primary/10 focus:text-primary cursor-pointer font-bold">
                            {clinicName}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 my-1" />
                        <DropdownMenuItem className="rounded-xl py-2 px-3 focus:bg-red-500/10 focus:text-red-500 cursor-pointer font-bold text-red-500">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Global Search */}
                <div className="flex-1 flex max-w-xl relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search or ask Nova..."
                        className="pl-11 h-12 w-full bg-slate-50 dark:bg-white/5 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-white/10 transition-all rounded-2xl font-medium text-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5">
                        <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-2 font-mono text-[10px] font-black text-slate-400">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* AI Status */}
                    <div className="hidden lg:flex items-center gap-2.5 px-4 h-10 bg-primary/10 rounded-2xl border border-primary/20">
                        <div className="relative">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                        </div>
                        <span className="text-xs font-black text-primary uppercase tracking-widest">Nova Soul Active</span>
                    </div>

                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                        <Bell className="h-5 w-5" />
                    </Button>

                    <div className="h-10 w-px bg-slate-100 dark:bg-white/5 mx-1" />

                    {/* User Avatar with Sign Out */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="h-10 w-10 rounded-2xl ring-2 ring-white dark:ring-white/10 shadow-sm cursor-pointer hover:ring-primary transition-all">
                                <AvatarImage src="/avatar-placeholder.png" alt={user?.name || "User"} />
                                <AvatarFallback className="bg-slate-200 dark:bg-white/10 text-primary font-black text-xs">
                                    {getInitials(user?.name, user?.email)}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded-2xl border-slate-200 dark:border-white/10 p-2 shadow-2xl">
                            <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-slate-400">
                                {user?.name || user?.email || "User"}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 my-1" />
                            <DropdownMenuItem 
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="rounded-xl py-2 px-3 focus:bg-red-500/10 focus:text-red-500 cursor-pointer font-bold text-red-500"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
