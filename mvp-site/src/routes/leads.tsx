import { createFileRoute } from "@tanstack/react-router";
import { AreaScreen } from "~/components/screens";
export const Route = createFileRoute("/leads")({
  component: () => <AreaScreen area="leads" />,
});
