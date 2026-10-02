import { createFileRoute } from "@tanstack/react-router";
import { SettingsScreen } from "~/components/screens";
export const Route = createFileRoute("/settings")({
  component: SettingsScreen,
});
