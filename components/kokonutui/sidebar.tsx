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
        className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-background shadow-md border"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-muted-foreground" />
      </button>
      <nav
        className={`
          fixed inset-y-0 left-0 z-[70] w-64 bg-sidebar transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:w-64 border-r border-sidebar-border
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center mb-4">
            <Link href="/dashboard">
              <OrasyncLogo />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-7">
            {/* Core Sections */}
            <div>
              <div className="px-3 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                Main
              </div>
              <div className="space-y-1">
                <NavItem href="/dashboard" icon={Home}>Dashboard</NavItem>
                <NavItem href="/unified-inbox" icon={MessageSquare}>Messages</NavItem>
                <NavItem href="/appointments" icon={Calendar}>Calendar</NavItem>
              </div>
            </div>

            <div>
              <div className="px-3 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                Growth & Marketing
              </div>
              <div className="space-y-1">
                <NavItem href="/patient-engagement" icon={Megaphone}>Campaigns</NavItem>
                <NavItem href="/patient-crm" icon={Users}>Patients</NavItem>
                <NavItem href="/reputation-management" icon={Star}>Reviews</NavItem>
                <NavItem href="/ai-chatbot" icon={Zap}>AI Assistant</NavItem>
              </div>
            </div>

            <div>
              <div className="px-3 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                Practice Tools
              </div>
              <div className="space-y-1">
                <NavItem href="/analytics-reporting" icon={BarChart2}>Analytics</NavItem>
                <NavItem href="/billing-finance" icon={CreditCard}>Billing</NavItem>
                <NavItem href="/settings" icon={Settings}>Settings</NavItem>
              </div>
            </div>
          </div>

          {/* Credits Status Footer (Matching uploaded_media_3) */}
          <div className="p-4 mt-auto">
            <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground">Credits Status</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">FREE TRIAL</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-foreground leading-none">185 <span className="text-xs font-normal text-muted-foreground">/ 200</span></span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[92.5%]" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                  Your trial ends in 3 days. Upgrade to unlock unlimited messaging.
                </p>
                <Link href="/billing-finance" className="block mt-3">
                  <button className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition shadow-sm">
                    Upgrade Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
