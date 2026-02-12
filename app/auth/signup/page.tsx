'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    practice: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-blue-200/20 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Orasync</span>
          </Link>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account? <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Sign in</Link>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur rounded-2xl shadow-lg border border-blue-100 dark:border-slate-700 p-8 space-y-8">
            {/* Heading */}
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Get Started</h1>
              <p className="text-slate-600 dark:text-slate-400">Create your Orasync account in minutes</p>
            </div>

            {/* Form */}
            <form className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Practice */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Practice Name</label>
                <input
                  type="text"
                  name="practice"
                  value={formData.practice}
                  onChange={handleChange}
                  placeholder="Smile Dental Care"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@dental.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-2">
                <input type="checkbox" id="terms" className="mt-1 rounded" />
                <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400">
                  I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
                </label>
              </div>

              {/* Sign Up Button */}
              <Link href="/orasync-dashboard">
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
                >
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or sign up with</span>
              </div>
            </div>

            {/* Social Signup */}
            <button className="w-full border border-slate-200 dark:border-slate-700 rounded-lg py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              Google
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account? <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Sign in</Link>
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">HIPAA Compliant</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">99.9% Uptime</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
