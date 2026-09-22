import { createFileRoute } from "@tanstack/react-router";
import { Notifications } from "@/portal/pages/Notifications";

export const Route = createFileRoute("/cliente/_portal/agencia/notificacoes")({
  head: () => ({ meta: [{ title: "Notificações · Portal Betterfly" }] }),
  component: () => <Notifications agency />,
});
