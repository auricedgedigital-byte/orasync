"use client"

import type React from "react"

import {
  BarChart2,
  Calendar,
  Users,
  MessageSquare,
  Globe,
  CreditCard,
  Shield,
  BookOpen,
  Settings,
  HelpCircle,
  Menu,
  Stethoscope,
  UserCheck,
  Megaphone,
  Star,
  Zap,
} from "@/components/icons"

import { Home } from "@/components/icons"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import OrasyncLogo from "@/components/orasync/logo"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/")
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string
    icon: any
    children: React.ReactNode
  }) {
    const active = isActive(href)
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${active
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
      >
        <Icon className={`h-5 w-5 mr-3 flex-shrink-0 transition-transform duration-200 ${active ? "" : "group-hover:scale-110"
          }`} />
        {children}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-xl bg-background/80 backdrop-blur-md shadow-lg border border-border"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[65] lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav
        className={`
          fixed inset-y-0 left-0 z-[70] w-72 bg-sidebar border-r border-border
          transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
          lg:translate-x-0 lg:static
          ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col p-4">
          {/* Brand Header */}
          <div className="h-20 flex items-center px-4 mb-2">
            <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
              <OrasyncLogo />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 px-2 scrollbar-hide">
            {/* Core Sections */}
            <div>
              <div className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Operating System
              </div>
              <div className="space-y-1">
                <NavItem href="/dashboard" icon={Home}>Overview</NavItem>
                <NavItem href="/unified-inbox" icon={MessageSquare}>Messages</NavItem>
                <NavItem href="/appointments" icon={Calendar}>Schedule</NavItem>
              </div>
            </div>

            <div>
              <div className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Growth Engine
              </div>
              <div className="space-y-1">
                <NavItem href="/patient-engagement" icon={Megaphone}>Campaigns</NavItem>
                <NavItem href="/patient-crm" icon={Users}>Patients</NavItem>
                <NavItem href="/reputation-management" icon={Star}>Reviews</NavItem>
                <NavItem href="/ai-chatbot" icon={Zap}>Nova AI</NavItem>
              </div>
            </div>

            <div>
              <div className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Practice Health
              </div>
              <div className="space-y-1">
                <NavItem href="/analytics-reporting" icon={BarChart2}>Analytics</NavItem>
                <NavItem href="/billing-finance" icon={CreditCard}>Financials</NavItem>
                <NavItem href="/settings" icon={Settings}>Settings</NavItem>
              </div>
            </div>
          </div>

          {/* Credits Status Footer */}
          <div className="mt-auto pt-4 px-2">
            <div className="bg-gradient-to-br from-sidebar-accent to-background rounded-2xl p-5 border border-border/50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-500" />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-xs font-bold text-foreground">Usage Credits</span>
                <span className="text-[10px] bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-bold shadow-sm">
                  TRIAL
                </span>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-black text-foreground tracking-tight">
                    185 <span className="text-xs font-semibold text-muted-foreground">/ 200</span>
                  </span>
                </div>

                <div className="h-2 w-full bg-border/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[92.5%] shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                </div>

                <p className="text-[10px] text-muted-foreground font-medium">
                  3 days remaining in trial.
                </p>

                <Link href="/billing-finance" className="block pt-2">
                  <button className="w-full py-2.5 bg-foreground text-background text-xs font-bold rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95">
                    Upgrade Plan
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
