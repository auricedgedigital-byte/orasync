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
} from "lucide-react"

import { Home } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    href,
    icon: Icon,
    children,
    isActive = false,
  }: {
    href: string
    icon: any
    children: React.ReactNode
    isActive?: boolean
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
                fixed inset-y-0 left-0 z-[70] w-64 bg-background transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-border
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 px-6 flex items-center border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Orasync</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Overview
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Home} isActive={false}>
                    Dashboard
                  </NavItem>
                  <NavItem href="#" icon={BarChart2}>
                    Analytics & Reports
                  </NavItem>
                  <NavItem href="#" icon={Calendar}>
                    Appointments
                  </NavItem>
                  <NavItem href="#" icon={Users}>
                    Patient CRM
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Patient Engagement
                </div>
                <div className="space-y-1">
                  <NavItem href="/patient-engagement" icon={Megaphone} isActive={true}>
                    Marketing Campaigns
                  </NavItem>
                  <NavItem href="#" icon={MessageSquare}>
                    Unified Inbox
                  </NavItem>
                  <NavItem href="#" icon={Zap}>
                    AI Chatbot
                  </NavItem>
                  <NavItem href="#" icon={Star}>
                    Reputation Management
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Online Presence
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={Globe}>
                    Website Builder
                  </NavItem>
                  <NavItem href="#" icon={BarChart2}>
                    Conversion Insights
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Practice Operations
                </div>
                <div className="space-y-1">
                  <NavItem href="/practice-operations" icon={UserCheck} isActive={true}>
                    Treatment Planning
                  </NavItem>
                  <NavItem href="#" icon={CreditCard}>
                    Billing & Finance
                  </NavItem>
                  <NavItem href="#" icon={Shield}>
                    HIPAA Compliance
                  </NavItem>
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Training & Support
                </div>
                <div className="space-y-1">
                  <NavItem href="#" icon={BookOpen}>
                    Training Videos
                  </NavItem>
                  <NavItem href="#" icon={HelpCircle}>
                    AI Help Assistant
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-border">
            <div className="space-y-1">
              <NavItem href="#" icon={Settings}>
                Settings
              </NavItem>
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
