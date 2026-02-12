'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Megaphone,
  Mail,
  Zap,
  Star,
  BarChart3,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navigationItems = [
  { href: '/orasync-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/campaigns-orasync', label: 'Campaigns', icon: Megaphone },
  { href: '/inbox-orasync', label: 'Inbox', icon: Mail },
  { href: '/ai-chatbot-orasync', label: 'AI Chatbot', icon: Zap },
  { href: '/reputation-orasync', label: 'Reputation', icon: Star },
  { href: '/analytics-orasync', label: 'Analytics', icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 lg:hidden z-40 p-3 bg-primary text-white rounded-full shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-30 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 pt-6`}
      >
        <nav className="flex-1 space-y-2 px-4">
          {navigationItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== '/dashboard' && pathname.startsWith(href))

            return (
              <Link
                key={href}
                href={href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsOpen(false)
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-6 rounded-full bg-sidebar-primary-foreground"></div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Billing Card */}
        <div className="p-4 border-t border-sidebar-border">
          <Link
            href="/billing-orasync"
            className="block p-4 bg-sidebar-accent rounded-lg border border-sidebar-border hover:shadow-md transition-all"
          >
            <div className="text-xs text-sidebar-foreground mb-1">Credit Balance</div>
            <div className="text-xl font-bold text-sidebar-primary">1,250</div>
            <div className="text-xs text-sidebar-foreground/70 mt-2">Top up credits</div>
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}
