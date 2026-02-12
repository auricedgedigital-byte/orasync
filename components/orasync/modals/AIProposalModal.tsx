'use client'

import { X, Zap, Wallet } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

interface AIProposalModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AIProposalModal({ isOpen, onClose }: AIProposalModalProps) {
  const [approved, setApproved] = useState(false)

  if (!isOpen) return null

  if (approved) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Campaign Approved!</h3>
          <p className="text-muted-foreground mb-6">
            Your 'Reactivation Campaign' has been approved and is now launching.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 rounded-2xl max-w-md w-full overflow-hidden shadow-xl">
        {/* Header with Nova */}
        <div className="relative p-6 border-b border-blue-200 dark:border-blue-700/50 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-blue-200/50 dark:hover:bg-blue-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              N
            </div>
            <div>
              <h2 className="text-center font-bold text-foreground">ORASYNC AI</h2>
              <p className="text-xs text-muted-foreground text-center mt-1">Campaign Proposal</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Time Availability */}
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Mon-Fri, 8 AM - 5 PM.</p>
          </div>

          {/* Proposal Message */}
          <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                N
              </div>
              <div>
                <p className="text-sm text-foreground leading-relaxed">
                  Based on your inputs, I propose the{' '}
                  <span className="font-semibold">"Reactivation Campaign"</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Estimate Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-sm">Estimate</h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">1,200</p>
                <p className="text-xs text-muted-foreground">Target Patients</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">1,200</p>
                <p className="text-xs text-muted-foreground">Emails</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">200</p>
                <p className="text-xs text-muted-foreground">SMS</p>
              </div>
            </div>

            {/* Credits Used */}
            <div className="bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-foreground">
                  Estimated Credits Used: <span className="text-lg">1,400</span>
                </span>
              </div>
            </div>

            {/* Typical Results */}
            <p className="text-sm text-foreground text-center py-2">
              Typical Bookings: 6–18 in first 30 days.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setApproved(true)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full hover:shadow-lg transition-all transform hover:scale-105"
            >
              Approve
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-blue-400 dark:border-blue-700 text-foreground font-bold rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Modify
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
