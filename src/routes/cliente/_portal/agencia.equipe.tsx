import { createFileRoute } from "@tanstack/react-router";
import { Team } from "@/portal/pages/Team";

export const Route = createFileRoute("/cliente/_portal/agencia/equipe")({
  head: () => ({ meta: [{ title: "Equipe · Portal Betterfly" }] }),
  component: Team,
});
