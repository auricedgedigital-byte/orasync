'use client'

import { Bell, Settings, LogOut, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="orasync-header">
      <div className="flex items-center gap-4">
        <Image
          src="/orasync-logo.png"
          alt="Orasync"
          width={40}
          height={40}
          priority
          className="rounded"
        />
        <h1 className="text-2xl font-bold text-foreground">Orasync</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <ThemeToggle />

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                AC
              </div>
              <span className="text-sm font-medium text-foreground">Alex Chen</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg p-2 z-50">
                <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-2">
                  alex.chen@dental.com
                </div>
                <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border">
            <span className="text-xs text-muted-foreground">Credits:</span>
            <span className="font-bold text-foreground">1,250</span>
          </div>
        </div>
      </div>
    </header>
  )
}
