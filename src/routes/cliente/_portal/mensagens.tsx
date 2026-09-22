import { createFileRoute } from "@tanstack/react-router";
import { Messages } from "@/portal/pages/Messages";

export const Route = createFileRoute("/cliente/_portal/mensagens")({
  head: () => ({ meta: [{ title: "Mensagens · Portal Betterfly" }] }),
  component: Messages,
});
