"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import OrasyncLogo from '@/components/orasync/logo'
import {
  MessageSquare,
  Users,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  Star,
  CheckCircle2,
} from 'lucide-react'

export default function LandingPageNew() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-blue-200/20 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <OrasyncLogo />
          <div className="hidden md:flex items-center gap-12">
            <a href="#features" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition">About Us</a>
            <a href="#features" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition">Features</a>
            <a href="#pricing" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition">Pricing</a>
            <a href="#support" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition">Support</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="font-semibold">Log In</Button>
            </Link>
            <Link href="/auth/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
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
                <Link href="/auth/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-lg font-semibold text-base">
                    Get Started Free
                  </Button>
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
              <Image
                src="/doctors-landing.jpg"
                alt="Professional dental team"
                width={600}
                height={500}
                className="relative w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white/50 dark:bg-slate-800/50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">Trusted by Dentists</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Anya Sharma',
                title: 'Advanced Cosmetic Care',
                testimonial: 'Orasync has transformed our practice. We reactivate lost patients automatically, saving 5+ hours weekly on admin work.'
              },
              {
                name: 'Dr. Michael Chen',
                title: 'Advanced Smiles Orthodontics',
                testimonial: 'The unified inbox saved us hours every week. We can now manage all patient communications in one place.'
              },
              {
                name: 'Dr. Emily Davis',
                title: 'Family Dental Wellness',
                testimonial: 'Integration with our practice management software is seamless. The AI chatbot handles routine queries brilliantly!'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 italic">"{testimonial.testimonial}"</p>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-4">Key Features & Benefits</h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto">
            Everything you need to grow your dental practice
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageSquare, title: 'Reactivation Campaigns', desc: 'Automatically reach inactive patients' },
              { icon: Users, title: 'Unified Inbox', desc: 'All channels in one place (SMS, Email, WhatsApp)' },
              { icon: Zap, title: 'AI Chatbot', desc: 'Answer patient questions 24/7' },
              { icon: TrendingUp, title: 'Reputation Management', desc: 'Monitor and respond to reviews' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-blue-50 dark:bg-slate-800 rounded-2xl p-8 hover:shadow-lg transition">
                <div className="bg-blue-600/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Reliability Section */}
      <section className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-slate-800 dark:to-slate-900 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">Trust & Reliability</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: 'HIPAA Compliant', desc: 'Secure patient data protection you can trust' },
              { icon: Clock, title: '99.9% Uptime', desc: 'Reliable service around the clock' },
              { icon: Users, title: '24/7 Support', desc: 'Dedicated expert assistance whenever you need it' }
            ].map((trust, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-700 rounded-2xl p-8 text-center shadow-lg">
                <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <trust.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{trust.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{trust.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-4">Flexible Billing & Plans</h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-16">Choose the perfect plan for your practice</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter Credit Pack',
                credits: '1,000 Credits',
                price: '$49',
                features: ['Email Campaigns', 'SMS Messages', 'Basic Support']
              },
              {
                name: 'Growth Credit Pack',
                credits: '10,000 Credits',
                price: '$95',
                highlight: true,
                features: ['All Starter Features', 'Priority Support', 'Advanced Analytics']
              },
              {
                name: 'Pro Subscription',
                credits: 'Unlimited',
                price: 'Custom',
                features: ['All Features', 'Dedicated Manager', 'Custom Integration']
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 ${
                  plan.highlight
                    ? 'bg-blue-600 text-white shadow-xl scale-105'
                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlight ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>{plan.credits}</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full h-10 rounded-lg font-semibold ${
                    plan.highlight
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.highlight ? 'Upgrade' : 'Buy Now'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Practice?</h2>
          <p className="text-lg mb-10 text-blue-100">Join hundreds of dental practices using Orasync to grow faster</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-8 font-bold rounded-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8 font-bold rounded-lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-slate-200 dark:border-slate-800">
            <div>
              <OrasyncLogo />
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-6">AI-powered practice management for modern dentists.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Integrations'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'HIPAA', 'Compliance'] }
            ].map((column, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-slate-900 dark:text-white mb-6">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link, i) => (
                    <li key={i}><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 transition">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <p>&copy; 2024 Orasync. All rights reserved.</p>
            <div className="flex gap-6 mt-6 sm:mt-0">
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social, idx) => (
                <a key={idx} href="#" className="hover:text-blue-600 transition">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
