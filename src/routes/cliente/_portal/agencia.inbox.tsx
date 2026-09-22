import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "@/portal/pages/Inbox";

export const Route = createFileRoute("/cliente/_portal/agencia/inbox")({
  head: () => ({ meta: [{ title: "Inbox · Portal Betterfly" }] }),
  component: Inbox,
});
