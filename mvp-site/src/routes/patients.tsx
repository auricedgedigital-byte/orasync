import { createFileRoute } from "@tanstack/react-router";
import { AreaScreen } from "~/components/screens";
export const Route = createFileRoute("/patients")({
  component: () => <AreaScreen area="patients" />,
});
