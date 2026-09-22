import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalShell } from "@/portal/Shell";

export const Route = createFileRoute("/cliente/_portal")({
  component: () => (
    <PortalShell>
      <Outlet />
    </PortalShell>
  ),
});
