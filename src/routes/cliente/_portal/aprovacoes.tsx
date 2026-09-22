import { createFileRoute } from "@tanstack/react-router";
import { Approvals } from "@/portal/pages/Approvals";

export const Route = createFileRoute("/cliente/_portal/aprovacoes")({
  head: () => ({ meta: [{ title: "Aprovações · Portal Betterfly" }] }),
  component: Approvals,
});
