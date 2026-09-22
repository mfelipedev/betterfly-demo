import { createFileRoute } from "@tanstack/react-router";
import { ContentDetail } from "@/portal/pages/ContentDetail";

export const Route = createFileRoute("/cliente/_portal/conteudo/$id")({
  head: () => ({ meta: [{ title: "Conteúdo · Portal Betterfly" }] }),
  component: function ContentRoute() {
    const { id } = Route.useParams();
    return <ContentDetail id={id} />;
  },
});
