"use client"

import { useSession, signOut } from "next-auth/react"

export default function DashboardHome() {
  const { data: session } = useSession()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <span className="mr-4 text-sm text-gray-600">
            {session?.user?.name ?? session?.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Sign out
          </button>
        </div>
      </div>

      <section className="mt-8">
        <p className="text-gray-700">This is a protected dashboard area — only visible when signed in.</p>
        {/* TODO: Add Patients, Campaigns, Appointments UI here */}
      </section>
    </div>
  )
}
