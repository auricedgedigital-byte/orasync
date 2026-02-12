'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Zap, Users, BarChart3, Mail, Calendar, Star, MessageSquare, CheckCircle2, Lock, Cloud, Clock } from 'lucide-react'

const features = [
  {
    icon: Mail,
    title: 'Reactivation Campaigns',
    description: 'Use Ease: Automated campaigns for dormant patients and more engagement',
    benefits: 'Benefit: Increases appointment frequency and revenue affiliated by 20-40%'
  },
  {
    icon: MessageSquare,
    title: 'Unified Inbox',
    description: 'Use Ease: Consolidate all patient communications across Email, SMS, WhatsApp',
    benefits: 'Benefit: Free up 5+ hours a week cutting down repetitive communications'
  },
  {
    icon: Zap,
    title: 'AI Chatbot',
    description: 'Use Ease: Automate common conversations and patient questions about scheduling',
    benefits: 'Benefit: Highly intelligent: Better NPS scores and time-saving'
  },
  {
    icon: Star,
    title: 'Reputation Management',
    description: 'Use Ease: Automatically monitors and manages your reviews and ratings on platforms',
    benefits: 'Benefit: Improves Google reviews significantly.'
  },
]

const trustProfiles = [
  {
    name: 'Dr. Anya Sharma',
    specialty: 'Cosmetic Dental Care',
    quote: 'Orasync has transformed our practice. We schedule more appointments, follow ups, and the reactivation campaigns are incredibly effective. Our practice doubles patient engagement now.',
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'Advanced Smiles Orthodontics',
    quote: 'The unified inbox saves us hours every week. We can now consolidate all patient communication in one place, making it easier for our team to manage everything seamlessly.',
  },
  {
    name: 'Dr. Emily Davis',
    specialty: 'Family Dental Wellness',
    quote: 'Integration was a breeze, and the time-saving has been remarkable. I cannot imagine working without it now. Our practice has also seen significant improvement in Google reviews significantly.',
  },
]

const pages = [
  { name: 'Dashboard', path: '/orasync-dashboard', icon: '📊' },
  { name: 'Campaigns', path: '/campaigns-orasync', icon: '📢' },
  { name: 'Inbox', path: '/unified-inbox', icon: '📧' },
  { name: 'AI Chatbot', path: '/ai-chatbot-orasync', icon: '🤖' },
  { name: 'Reputation', path: '/reputation-management', icon: '⭐' },
  { name: 'Analytics', path: '/analytics', icon: '📈' },
  { name: 'Billing', path: '/billing-finance', icon: '💳' },
]

export default function OrasyncPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-blue-200/20 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Orasync</span>
          </div>
          <nav className="hidden md:flex items-center gap-12">
            <a href="#about" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition">About Us</a>
            <a href="#features" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition">Features</a>
            <a href="#pricing" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition">Pricing</a>
            <a href="#support" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition">Support</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <button className="font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition">Log In</button>
            </Link>
            <Link href="/orasync-dashboard">
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold px-6 py-2">Get Started</button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Reclaim Time & Revenue for Dental Practice
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                AI-powered patient reactivation, unified messaging, and reputation management in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/orasync-dashboard">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-lg font-semibold text-base">
                    Get Started Free
                  </button>
                </Link>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-lg p-6 w-fit">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Credit Balance</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">50 Credits</p>
              </div>
            </div>

            {/* Right: Doctor Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-200/40 to-transparent rounded-3xl blur-3xl" />
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-3xl shadow-2xl flex items-center justify-center">
                <span className="text-6xl">👨‍⚕️👩‍⚕️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Key Features & Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div key={idx} className="p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur border border-blue-200/40 dark:border-blue-800/40 rounded-xl hover:shadow-lg transition-all">
                    <div className="w-12 h-12 rounded-lg bg-blue-200 dark:bg-blue-800 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">{feature.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{feature.description}</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{feature.benefits}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Trusted by Dentists</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trustProfiles.map((profile, idx) => (
                <div key={idx} className="p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur border border-blue-200/40 dark:border-blue-800/40 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                      {profile.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{profile.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{profile.specialty}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{profile.quote}"</p>
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pages Section */}
        <section id="pages" className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Key Features & Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pages.map((page, idx) => (
                <Link
                  key={idx}
                  href={page.path}
                  className="group p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur border border-blue-200/40 dark:border-blue-800/40 rounded-xl hover:shadow-lg hover:border-blue-400 transition-all"
                >
                  <div className="text-4xl mb-3">{page.icon}</div>
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {page.name}
                  </h3>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                    <span className="text-sm font-medium">Explore</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Billing Plans Section */}
        <section id="pricing" className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Flexible Billing & Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white/40 dark:bg-slate-800/40 backdrop-blur border border-blue-200/40 dark:border-blue-800/40 rounded-xl text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Starter Credit Pack</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">$49/month</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Most for small practices</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold mb-4">Buy Now</button>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 text-left">
                  <li>✓ Included lower features and limited usage</li>
                </ul>
              </div>
              <div className="p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur border border-blue-400/60 dark:border-blue-400/60 rounded-xl text-center ring-2 ring-blue-400/30">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Growth Subscription</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">$193/month</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Perfect for growing clinics</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold mb-4">Upgrade</button>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 text-left">
                  <li>✓ Includes all standard features and priority support</li>
                </ul>
              </div>
              <div className="p-8 bg-white/40 dark:bg-slate-800/40 backdrop-blur border border-blue-200/40 dark:border-blue-800/40 rounded-xl text-center">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enterprise Solution</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">Custom</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Custom Credits & entire emission and dedicated account manager</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">Contact us</button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Reliability */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Trust & Reliability</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white/40 dark:bg-slate-800/40 backdrop-blur border border-blue-200/40 dark:border-blue-800/40 rounded-xl text-center">
                <Lock className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">HIPAA Compliant</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Secure patient data protected per HIPAA regulations</p>
              </div>
              <div className="p-8 bg-white/40 dark:bg-slate-800/40 backdrop-blur border border-blue-200/40 dark:border-blue-800/40 rounded-xl text-center">
                <Cloud className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">99.9% Uptime</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Reliable service ensures your practice never stops</p>
              </div>
              <div className="p-8 bg-white/40 dark:bg-slate-800/40 backdrop-blur border border-blue-200/40 dark:border-blue-800/40 rounded-xl text-center">
                <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">24/7 Support</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Dedicated expert assistance always available</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Ready to Transform Your Practice?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Join hundreds of dental practices that are reclaiming time and revenue with Orasync
            </p>
            <Link href="/orasync-dashboard">
              <button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-lg font-semibold text-base inline-flex items-center gap-2">
                Get Started Free <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-4">Your Credit Balance: 50 Credits</p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-200/20 dark:border-slate-800 py-8 mt-16 bg-white/30 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">About Us</a>
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Features</a>
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Pricing</a>
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Support</a>
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Blog</a>
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Contact</a>
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Privacy Policy</a>
          </div>
          <div className="flex justify-center gap-4 text-2xl">
            <a href="#" className="hover:opacity-70 transition">𝕏</a>
            <a href="#" className="hover:opacity-70 transition">f</a>
            <a href="#" className="hover:opacity-70 transition">in</a>
            <a href="#" className="hover:opacity-70 transition">▶</a>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">© 2024 Orasync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
