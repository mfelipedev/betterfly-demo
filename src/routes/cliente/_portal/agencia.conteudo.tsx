import { createFileRoute } from "@tanstack/react-router";
import { AgencyContent } from "@/portal/pages/AgencyWork";

export const Route = createFileRoute("/cliente/_portal/agencia/conteudo")({
  head: () => ({ meta: [{ title: "Conteúdo · Portal Betterfly" }] }),
  component: AgencyContent,
});
