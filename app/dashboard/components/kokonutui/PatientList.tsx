// app/dashboard/components/kokonutui/PatientList.tsx
"use client";

import { useEffect, useState } from "react";

export default function PatientList() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPatients() {
    setLoading(true);
    try {
      const res = await fetch("/api/patients");
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchPatients error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <div>Loading patients…</div>;
  if (!patients.length) return <div>No patients yet</div>;

  return (
    <ul className="space-y-2">
      {patients.map((p) => (
        <li key={p.id} className="p-2 border rounded">
          <div className="font-medium">{p.name}</div>
          <div className="text-sm text-muted-foreground">{p.email}</div>
        </li>
      ))}
    </ul>
  );
}
