import { createFileRoute } from "@tanstack/react-router";
import { ClientHome } from "@/portal/pages/ClientHome";

export const Route = createFileRoute("/cliente/_portal/inicio")({
  head: () => ({ meta: [{ title: "Visão geral · Portal Betterfly" }] }),
  component: ClientHome,
});
