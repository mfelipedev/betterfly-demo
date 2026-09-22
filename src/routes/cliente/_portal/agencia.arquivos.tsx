import { createFileRoute } from "@tanstack/react-router";
import { Files } from "@/portal/pages/Files";

export const Route = createFileRoute("/cliente/_portal/agencia/arquivos")({
  head: () => ({ meta: [{ title: "Arquivos · Portal Betterfly" }] }),
  component: () => <Files agency />,
});
