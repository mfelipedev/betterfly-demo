import { createFileRoute } from "@tanstack/react-router";
import { AgencyHome } from "@/portal/pages/AgencyHome";

export const Route = createFileRoute("/cliente/_portal/agencia/")({
  head: () => ({ meta: [{ title: "Betterfly · Portal Betterfly" }] }),
  component: AgencyHome,
});
