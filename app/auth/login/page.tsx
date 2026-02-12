'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-blue-200/20 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Orasync</span>
          </Link>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Don't have an account? <Link href="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Sign up</Link>
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
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
              <p className="text-slate-600 dark:text-slate-400">Sign in to your Orasync account</p>
            </div>

            {/* Form */}
            <form className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@dental.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <Link href="#" className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Sign In Button */}
              <Link href="/orasync-dashboard">
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  Sign In
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
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <button className="w-full border border-slate-200 dark:border-slate-700 rounded-lg py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              Google
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              New to Orasync? <Link href="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Create account</Link>
            </p>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-8">
            Protected by HIPAA • 99.9% Uptime • 24/7 Support
          </p>
        </div>
      </div>
    </div>
  )
}
