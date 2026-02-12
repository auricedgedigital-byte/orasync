'use client'

import { Bell, Settings, LogOut, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Orasync</span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Credits Display */}
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Credits:</span>
            <span className="font-bold text-blue-900 dark:text-blue-100">1,250</span>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                AC
              </div>
              <span className="text-sm font-medium text-foreground">Alex Chen</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl p-2 z-50">
                <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-2">
                  alex.chen@dental.com
                </div>
                <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
