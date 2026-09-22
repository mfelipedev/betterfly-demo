import { createFileRoute } from "@tanstack/react-router";
import { Agenda } from "@/portal/pages/Agenda";

export const Route = createFileRoute("/cliente/_portal/agenda")({
  head: () => ({ meta: [{ title: "Agenda · Portal Betterfly" }] }),
  component: () => <Agenda />,
});
