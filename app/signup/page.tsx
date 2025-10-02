'use client'
import React from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const handleGoogle = () => {
    const callback = (typeof window !== 'undefined') ? `${window.location.origin}/dashboard` : '/'
    signIn('google', { callbackUrl: callback })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Create your Orasync account</h1>
        <p className="text-sm text-gray-600 mb-6">Sign up with Google to get started. This is a temporary stub page; replace with your real signup form later.</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleGoogle}
            className="px-4 py-2 rounded border"
            aria-label="Sign in with Google"
          >
            Sign up / Sign in with Google
          </button>

          <Link href="/" className="px-4 py-2 rounded border">Back</Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">If you get redirected to an unreachable domain, make sure NEXTAUTH_URL and Google redirect URIs match the production alias (see instructions).</p>
      </div>
    </main>
  )
}
