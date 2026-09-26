import { createFileRoute } from "@tanstack/react-router";
import { AreaScreen } from "~/components/screens";
export const Route = createFileRoute("/workflows")({
  component: () => <AreaScreen area="workflows" />,
});
