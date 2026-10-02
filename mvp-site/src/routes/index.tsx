import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardScreen, SetupScreen } from "~/components/screens";
import { readPracticeSetup } from "~/lib/demo";

export const Route = createFileRoute("/")({ component: HomeRoute });

function HomeRoute() {
  const [hasSetup, setHasSetup] = useState<boolean | null>(null);
  useEffect(() => setHasSetup(Boolean(readPracticeSetup())), []);
  if (hasSetup === null)
    return (
      <div className="route-loading">
        <div className="loading-mark" />
        <p>Preparing your workspace…</p>
      </div>
    );
  return hasSetup ? <DashboardScreen /> : <SetupScreen />;
}
