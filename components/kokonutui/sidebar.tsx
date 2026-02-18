"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  MessageSquare,
  CalendarDays,
  Users,
  Megaphone,
  Star,
  Bot,
  BarChart3,
  Wallet,
  Settings,
  ChevronLeft,
  Plus,
  LogOut,
  Sparkles,
  MousePointerClick
} from "lucide-react"
import OrasyncLogo from "@/components/orasync/logo"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const NAV_ITEMS = [
  {
    group: "Operating System",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
      { href: "/unified-inbox", icon: MessageSquare, label: "Inbox", badge: "3" },
      { href: "/appointments", icon: CalendarDays, label: "Schedule" },
    ]
  },
  {
    group: "Growth Engine",
    items: [
      { href: "/campaign-builder", icon: Megaphone, label: "Campaigns" },
      { href: "/patient-crm", icon: Users, label: "Patients" },
      { href: "/reputation-management", icon: Star, label: "Reviews" },
      { href: "/ai-chatbot", icon: Bot, label: "Nova Soul", special: true },
    ]
  },
  {
    group: "Practice Health",
    items: [
      { href: "/analytics-reporting", icon: BarChart3, label: "Analytics" },
      { href: "/billing-finance", icon: Wallet, label: "Financials" },
      { href: "/settings", icon: Settings, label: "Settings" },
    ]
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  if (!mounted) return null

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="relative z-50 h-screen border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#020617] hidden lg:flex flex-col overflow-hidden transition-colors duration-500"
    >
      {/* Background Glow (Dark Mode only) */}
      <div className="absolute top-0 left-0 w-full h-32 bg-primary/5 blur-3xl pointer-events-none hidden dark:block" />

      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 mb-2 relative border-b border-transparent">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          {collapsed ? (
            <OrasyncLogo showText={false} className="w-8 h-8" />
          ) : (
            <OrasyncLogo className="w-8 h-8" textClassName="text-xl font-black tracking-tighter" />
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 z-50 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={`h-3 w-3 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 gap-8 flex flex-col scrollbar-none">
        <TooltipProvider delayDuration={0}>
          {NAV_ITEMS.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              {!collapsed && (
                <h4 className="px-3 text-[10px] font-black uppercase text-slate-400 dark:text-white/20 tracking-widest mb-3">
                  {group.group}
                </h4>
              )}

              {group.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon

                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={`
                          relative flex items-center ${collapsed ? "justify-center p-2.5" : "px-4 py-3"} 
                          rounded-2xl transition-all duration-300 group
                          ${active
                            ? "bg-slate-100 dark:bg-white/5 text-primary dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                          }
                        `}
                      >
                        {/* Active Indicator Bar */}
                        {active && (
                          <motion.div
                            layoutId="active-bar"
                            className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                          />
                        )}

                        <div className={`relative ${item.special ? "p-0.5" : ""}`}>
                          {item.special && (
                            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse" />
                          )}
                          <Icon className={`
                                h-5 w-5 transition-transform duration-300 
                                ${active ? "scale-105" : "group-hover:scale-110"}
                                ${item.special ? "text-primary dark:text-white" : ""}
                            `} />
                        </div>

                        {!collapsed && (
                          <span className={`ml-3 font-bold text-sm tracking-tight flex-1 ${active ? "font-black" : ""}`}>
                            {item.label}
                          </span>
                        )}

                        {/* Badge */}
                        {!collapsed && item.badge && (
                          <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-slate-200 dark:bg-white/10 text-[10px] font-black group-hover:bg-primary group-hover:text-white transition-colors">
                            {item.badge}
                          </span>
                        )}

                        {/* Collapsed Badge Dot */}
                        {collapsed && item.badge && (
                          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                        )}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                )
              })}
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* Footer Profile & Actions */}
      <div className="p-4 mt-auto border-t border-slate-100 dark:border-white/5">
        {!collapsed ? (
          <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-5 border border-slate-200 dark:border-white/5 relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-all duration-700" />

            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-white/10 shadow-sm">
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback className="bg-slate-200 dark:bg-white/10 text-xs font-black">DS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-900 dark:text-white">Dr. Smith</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PRO PLAN</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <Button className="w-full h-10 rounded-2xl text-xs font-black bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <Button size="icon" className="h-12 w-12 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
              <Plus className="h-6 w-6" />
            </Button>
            <Avatar className="h-10 w-10 ring-2 ring-slate-200 dark:ring-white/10 cursor-pointer hover:ring-primary transition-all shadow-sm">
              <AvatarFallback className="bg-slate-100 dark:bg-white/5 text-xs font-black">DS</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
