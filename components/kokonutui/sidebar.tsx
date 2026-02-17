"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
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
  Sparkles
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
      { href: "/ai-chatbot", icon: Bot, label: "Nova AI", special: true },
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="relative z-50 h-screen border-r border-border/40 bg-sidebar/50 backdrop-blur-xl hidden lg:flex flex-col"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 mb-2 relative">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          {/* If collapsed, show icon only, else show full logo */}
          {collapsed ? (
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 text-primary font-black text-xl">
              O
            </div>
          ) : (
            <OrasyncLogo />
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground z-50"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={`h-3 w-3 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 gap-6 flex flex-col scrollbar-none">
        <TooltipProvider delayDuration={0}>
          {NAV_ITEMS.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <h4 className="px-3 text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest mb-2">
                  {group.group}
                </h4>
              )}
              {collapsed && (
                <div className="h-px w-full bg-border/40 my-2 mx-1" />
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
                          relative flex items-center ${collapsed ? "justify-center p-2" : "px-3 py-2.5"} 
                          rounded-xl transition-all duration-300 group
                          ${active
                            ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                          }
                        `}
                      >
                        {/* Active Glow Indicator */}
                        {active && !collapsed && (
                          <motion.div
                            layoutId="active-nav"
                            className="absolute inset-0 bg-primary rounded-xl -z-10"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}

                        <div className={`relative ${item.special ? "p-1 md:p-0" : ""}`}>
                          {item.special && (
                            <div className="absolute inset-0 bg-ai-gradient opacity-20 blur-md rounded-full" />
                          )}
                          <Icon className={`
                                h-5 w-5 transition-transform duration-300 
                                ${active ? "scale-105" : "group-hover:scale-110"}
                                ${item.special ? "text-ai-primary" : ""}
                            `} />
                        </div>

                        {!collapsed && (
                          <span className="ml-3 font-medium text-sm tracking-tight flex-1">
                            {item.label}
                          </span>
                        )}

                        {/* Badge */}
                        {!collapsed && item.badge && (
                          <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-background/20 text-[10px] font-bold">
                            {item.badge}
                          </span>
                        )}

                        {/* Collapsed Badge Dot */}
                        {collapsed && item.badge && (
                          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-ai-secondary shadow-[0_0_8px_rgba(232,121,249,0.8)]" />
                        )}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="font-bold bg-popover text-popover-foreground border-border/50">
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
      <div className="p-3 mt-auto">
        {!collapsed ? (
          <div className="bg-card/40 backdrop-blur-md rounded-2xl p-4 border border-border/50 shadow-lg relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-all duration-700" />

            <div className="relative z-10 flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 ring-2 ring-border/50">
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Dr. Smith</span>
                  <span className="text-[10px] text-muted-foreground">Pro Plan</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>

            <Button className="w-full h-9 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              <Sparkles className="h-3 w-3 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <Button size="icon" className="h-10 w-10 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9 ring-2 ring-border/50 cursor-pointer hover:ring-primary transition-all">
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
