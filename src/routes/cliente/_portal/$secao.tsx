import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/portal/pages/ComingSoon";

export const Route = createFileRoute("/cliente/_portal/$secao")({
  component: function SectionRoute() {
    const { secao } = Route.useParams();
    return <ComingSoon section={secao} />;
  },
});
