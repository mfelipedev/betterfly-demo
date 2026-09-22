import { createFileRoute } from "@tanstack/react-router";
import { Client360 } from "@/portal/pages/Client360";

export const Route = createFileRoute("/cliente/_portal/agencia/clientes/$id")({
  head: () => ({ meta: [{ title: "Cliente · Portal Betterfly" }] }),
  component: function ClientRoute() {
    const { id } = Route.useParams();
    return <Client360 id={id} />;
  },
});
