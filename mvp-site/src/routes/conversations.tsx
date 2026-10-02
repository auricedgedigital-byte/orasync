import { createFileRoute } from "@tanstack/react-router";
import { AreaScreen } from "~/components/screens";
export const Route = createFileRoute("/conversations")({
  component: () => <AreaScreen area="conversations" />,
});
