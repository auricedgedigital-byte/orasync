'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function ClientLogin() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  return (
    <div className="max-w-md mx-auto py-8">
      {error && (
        <div className="mb-4 rounded border p-3 text-sm text-red-700 bg-red-50">
          Error: {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => signIn('google')}
          className="px-4 py-2 rounded bg-indigo-600 text-white"
        >
          Sign in with Google
        </button>

        <a href="/signup" className="px-4 py-2 rounded border">
          Sign up
        </a>
      </div>
    </div>
  );
}
