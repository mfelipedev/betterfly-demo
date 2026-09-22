import { createFileRoute } from "@tanstack/react-router";
import { Automation } from "@/portal/pages/Automation";

export const Route = createFileRoute("/cliente/_portal/agencia/automacao")({
  head: () => ({ meta: [{ title: "Automação · Portal Betterfly" }] }),
  component: Automation,
});
