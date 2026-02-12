'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Zap, Users, BarChart3, Mail, Calendar, Star, MessageSquare } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Unified Inbox',
    description: 'Manage all patient communications across Email, SMS, WhatsApp in one place',
  },
  {
    icon: Zap,
    title: 'AI Chatbot',
    description: 'Nova AI handles scheduling, FAQs, and patient engagement 24/7',
  },
  {
    icon: Mail,
    title: 'Smart Campaigns',
    description: 'Automated reactivation campaigns with AI-powered personalization',
  },
  {
    icon: Star,
    title: 'Reputation Management',
    description: 'Monitor reviews, sentiment analysis, and automatic response suggestions',
  },
  {
    icon: Calendar,
    title: 'Appointment Management',
    description: 'Seamless booking, scheduling, and patient confirmations',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time dashboards showing campaign performance and ROI metrics',
  },
]

const pages = [
  { name: 'Dashboard', path: '/orasync-dashboard', icon: '📊' },
  { name: 'Campaigns', path: '/campaigns-orasync', icon: '📢' },
  { name: 'Inbox', path: '/inbox-orasync', icon: '📧' },
  { name: 'AI Chatbot', path: '/ai-chatbot-orasync', icon: '🤖' },
  { name: 'Reputation', path: '/reputation-orasync', icon: '⭐' },
  { name: 'Analytics', path: '/analytics-orasync', icon: '📈' },
  { name: 'Billing', path: '/billing-orasync', icon: '💳' },
]

export default function OrasyncPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/orasync-logo.png"
              alt="Orasync"
              width={40}
              height={40}
              priority
              className="rounded"
            />
            <span className="text-2xl font-bold text-foreground">Orasync</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#pages" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Pages
            </a>
            <a href="#themes" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Themes
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            Orasync: The AI-Powered Dental Operating System
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Transform your dental practice with unified messaging, AI-powered campaigns, reputation management, and advanced analytics - all in one elegant platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/orasync-dashboard"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Launch Dashboard →
            </Link>
            <button className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-16 space-y-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="p-6 bg-card border border-border rounded-lg hover:shadow-lg hover:border-primary transition-all">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Pages Section */}
        <section id="pages" className="py-16 space-y-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Explore All Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pages.map((page, idx) => (
              <Link
                key={idx}
                href={page.path}
                className="group p-6 bg-gradient-to-br from-card to-secondary border border-border rounded-lg hover:shadow-lg hover:border-primary transition-all hover:scale-105"
              >
                <div className="text-4xl mb-3">{page.icon}</div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {page.name}
                </h3>
                <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                  <span className="text-sm font-medium">Visit</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Theme Section */}
        <section id="themes" className="py-16 space-y-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Theme Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-blue-200 dark:bg-blue-800 flex items-center justify-center mb-4">
                ☀️
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Light Mode</h3>
              <p className="text-sm text-muted-foreground">
                Clean, bright interface with cool blue tones perfect for daytime use and professional environments.
              </p>
            </div>
            <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                🌙
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dark Mode</h3>
              <p className="text-sm text-slate-400">
                Eye-friendly dark interface with glowing cyan accents for extended use and modern aesthetics.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center space-y-6 bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20 rounded-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-foreground">Ready to Transform Your Dental Practice?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of unified patient management, AI-powered automation, and intelligent analytics.
          </p>
          <Link
            href="/orasync-dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Start Your Demo <ChevronRight className="w-5 h-5" />
          </Link>
        </section>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Orasync © 2024 • AI-Powered Dental Operating System • All Rights Reserved</p>
        </div>
      </footer>
    </div>
  )
}
