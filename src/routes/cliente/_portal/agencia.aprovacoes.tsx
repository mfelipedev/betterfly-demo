import { createFileRoute } from "@tanstack/react-router";
import { AgencyApprovals } from "@/portal/pages/AgencyWork";

export const Route = createFileRoute("/cliente/_portal/agencia/aprovacoes")({
  head: () => ({ meta: [{ title: "Aprovações · Portal Betterfly" }] }),
  component: AgencyApprovals,
});
