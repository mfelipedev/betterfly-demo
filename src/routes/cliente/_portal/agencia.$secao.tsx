import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/portal/pages/ComingSoon";

export const Route = createFileRoute("/cliente/_portal/agencia/$secao")({
  component: function AgencySectionRoute() {
    const { secao } = Route.useParams();
    return <ComingSoon section={secao} agency />;
  },
});
