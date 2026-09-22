import { createFileRoute } from "@tanstack/react-router";
import { Clients } from "@/portal/pages/Clients";

export const Route = createFileRoute("/cliente/_portal/agencia/clientes/")({
  head: () => ({ meta: [{ title: "Clientes · Portal Betterfly" }] }),
  component: Clients,
});
