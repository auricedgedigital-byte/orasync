'use client'
import React, { useMemo } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  // Avoid next/navigation hooks during build by using window at runtime:
  const error = useMemo(() => {
    if (typeof window === 'undefined') return null
    return new URLSearchParams(window.location.search).get('error')
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Sign in to Orasync</h1>
          <p className="text-sm text-gray-500 mt-2">
            Welcome — sign in with Google or create a free account.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 p-3 text-sm text-red-700 bg-red-50">
            Error: {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => signIn('google')}
            className="w-full px-4 py-2 rounded bg-indigo-600 text-white hover:opacity-95"
            type="button"
          >
            Sign in with Google
          </button>

          <a
            href="/signup"
            className="block text-center w-full px-4 py-2 border rounded"
          >
            Create new account / Start free trial
          </a>

          <a
            href="/"
            className="block text-center w-full px-4 py-2 text-sm text-gray-600"
          >
            Back to landing page
          </a>
        </div>
      </div>
    </main>
  )
}
