import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { DemoProvider } from "@/portal/store";

export const Route = createFileRoute("/cliente")({
  // A demo usa datas relativas e estado salvo no navegador: renderizar só no cliente.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Portal Betterfly" },
      {
        name: "description",
        content:
          "Demonstração do Portal Betterfly: conteúdo, aprovações, agenda e atendimento em um só lugar.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClienteLayout,
  pendingComponent: () => <div className="h-dvh bg-background" />,
});

function ClienteLayout() {
  const isMobile = useIsMobile();
  return (
    <DemoProvider>
      <Outlet />
      <Toaster
        theme="dark"
        position={isMobile ? "top-center" : "bottom-right"}
        toastOptions={{
          classNames: {
            toast: "!bg-[oklch(0.17_0_0)] !border-border !text-bone !rounded-md",
            description: "!text-bone/55",
            success: "[&_[data-icon]]:!text-acid",
          },
        }}
      />
    </DemoProvider>
  );
}
