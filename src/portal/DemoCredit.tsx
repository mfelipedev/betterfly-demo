import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Selo flutuante de autoria (site e portal), no canto inferior direito.
 * O texto completo abre ao passar o mouse ou clicar.
 */
export function DemoCredit() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  // No portal, o celular tem a barra de navegação inferior
  const portal = path.startsWith("/cliente/");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className={cn(
            "fixed right-4 bottom-4 z-30 inline-flex items-center gap-1.5 rounded-full border border-border bg-[oklch(0.15_0_0)]/90 px-3 py-1.5 text-[0.65rem] tracking-wide text-bone/50 opacity-80 backdrop-blur-md transition hover:border-acid/40 hover:text-bone hover:opacity-100",
            portal && "bottom-[calc(env(safe-area-inset-bottom)+84px)] md:bottom-4",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-acid/70" />
          Demo · MARCIO IA
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-auto max-w-[280px] border-border bg-[oklch(0.15_0_0)] px-3.5 py-2.5 text-xs text-bone/70"
      >
        Projeto em demo desenvolvido por <span className="text-acid">MARCIO IA</span>. Todos os
        direitos reservados.
      </PopoverContent>
    </Popover>
  );
}
