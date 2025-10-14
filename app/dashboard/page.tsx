// app/dashboard/page.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function DashboardHome() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-8">Loading session…</div>;
  }

  // Not signed in -> show sign-in CTA and the protected-note
  if (!session) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div>
            <button
              onClick={() => signIn("google")}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Sign in
            </button>
          </div>
        </div>

        <section className="mt-8">
          <p className="text-gray-700">
            This is a protected dashboard area — only visible when signed in.
          </p>
        </section>
      </div>
    );
  }

  // Signed in -> show real dashboard content (hide the protected-note)
  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <span className="mr-4 text-sm text-gray-600">
            {session.user?.name ?? session.user?.email}
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
        <p className="text-gray-700">
          Welcome back — this content is visible because you are signed in.
        </p>

        {/* TODO: Add Patients, Campaigns, Appointments UI here */}
      </section>
    </div>
  );
}
