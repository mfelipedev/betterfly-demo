import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/portal/pages/Services";

export const Route = createFileRoute("/cliente/_portal/servicos")({
  head: () => ({ meta: [{ title: "Serviços · Portal Betterfly" }] }),
  component: Services,
});
