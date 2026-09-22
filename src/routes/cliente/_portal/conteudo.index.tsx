import { createFileRoute } from "@tanstack/react-router";
import { ContentPlan } from "@/portal/pages/ContentPlan";

export const Route = createFileRoute("/cliente/_portal/conteudo/")({
  head: () => ({ meta: [{ title: "Plano de conteúdo · Portal Betterfly" }] }),
  component: ContentPlan,
});
