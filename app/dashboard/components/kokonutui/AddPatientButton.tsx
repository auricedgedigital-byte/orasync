// app/dashboard/components/kokonutui/AddPatientButton.tsx
"use client";

import { useState } from "react";

export default function AddPatientButton() {
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    const name = prompt("Patient name:");
    if (!name) return;
    const email = prompt("Patient email:");
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Failed to create patient");
      } else {
        alert("Created patient: " + data.name);
        // Optionally you can trigger a re-fetch of patient list (if you add one)
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="px-3 py-1 rounded border bg-white dark:bg-[#111] text-sm"
    >
      {loading ? "Adding…" : "Add Patient"}
    </button>
  );
}
