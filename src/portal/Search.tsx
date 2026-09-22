import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CalendarClock,
  FileText,
  LayoutGrid,
  MessageSquare,
  Search as SearchIcon,
  UsersRound,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DEMO_CLIENT_ID, FOLDERS, STATUS_LABEL, TYPE_LABEL } from "./data";
import { fmt } from "./format";
import { FileIcon } from "./chat";
import { useDemo } from "./store";

type Mode = "client" | "agency";

const PAGES: Record<Mode, [string, string][]> = {
  client: [
    ["Visão geral", "/cliente/inicio"],
    ["Plano de conteúdo", "/cliente/conteudo"],
    ["Aprovações", "/cliente/aprovacoes"],
    ["Arquivos", "/cliente/arquivos"],
    ["Mensagens", "/cliente/mensagens"],
    ["Serviços", "/cliente/servicos"],
    ["Agenda", "/cliente/agenda"],
    ["Notificações", "/cliente/notificacoes"],
  ],
  agency: [
    ["Visão geral", "/cliente/agencia"],
    ["Clientes", "/cliente/agencia/clientes"],
    ["Conteúdo", "/cliente/agencia/conteudo"],
    ["Aprovações", "/cliente/agencia/aprovacoes"],
    ["Inbox", "/cliente/agencia/inbox"],
    ["Agenda", "/cliente/agencia/agenda"],
    ["Equipe", "/cliente/agencia/equipe"],
    ["Automação", "/cliente/agencia/automacao"],
    ["Arquivos", "/cliente/agencia/arquivos"],
    ["Notificações", "/cliente/agencia/notificacoes"],
  ],
};

/** Botão de busca do topo + paleta (Ctrl/⌘ K). */
export function GlobalSearch({ mode }: { mode: Mode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { state } = useDemo();
  const agency = mode === "agency";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };
  const clientName = (id: string) => state.clients.find((c) => c.id === id)?.name ?? "";
  const files = state.files.filter((f) => agency || f.clientId === DEMO_CLIENT_ID);
  const events = state.agenda.filter((e) => agency || e.clientId === DEMO_CLIENT_ID);
  const convos = agency ? state.convos : [];
  const itemCls =
    "flex items-center gap-3 px-3 py-2.5 data-[selected=true]:bg-bone/[0.08] data-[selected=true]:text-bone";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar"
        className="flex h-9 items-center gap-2 rounded-full text-bone/55 transition-colors hover:text-bone md:w-56 md:border md:border-border md:px-3 md:hover:border-bone/30 max-md:w-9 max-md:justify-center max-md:hover:bg-bone/[0.06]"
      >
        <SearchIcon className="h-4 w-4 shrink-0" />
        <span className="hidden flex-1 text-left text-xs md:inline">Buscar</span>
        <kbd className="hidden rounded border border-border px-1.5 py-px text-[0.6rem] text-bone/40 lg:inline">
          Ctrl K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={
            agency
              ? "Buscar clientes, conteúdos, arquivos, conversas…"
              : "Buscar conteúdos, arquivos, agenda…"
          }
        />
        <CommandList className="max-h-[min(420px,60vh)]">
          <CommandEmpty>Nada encontrado.</CommandEmpty>

          <CommandGroup heading="Páginas">
            {PAGES[mode].map(([label, to]) => (
              <CommandItem
                key={to}
                value={`página ${label}`}
                onSelect={() => go(to)}
                className={itemCls}
              >
                <LayoutGrid className="h-4 w-4 text-bone/40" /> {label}
              </CommandItem>
            ))}
          </CommandGroup>

          {agency && (
            <CommandGroup heading="Clientes">
              {state.clients.map((c) => (
                <CommandItem
                  key={c.id}
                  value={`cliente ${c.name} ${c.segment} ${c.contact}`}
                  onSelect={() => go(`/cliente/agencia/clientes/${c.id}`)}
                  className={itemCls}
                >
                  <UsersRound className="h-4 w-4 text-bone/40" />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-xs text-bone/40">{c.segment}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandGroup heading="Conteúdos">
            {state.contents.map((c) => (
              <CommandItem
                key={c.id}
                value={`conteúdo ${c.title} ${TYPE_LABEL[c.type]} ${STATUS_LABEL[c.status]}`}
                onSelect={() => go(`/cliente/conteudo/${c.id}`)}
                className={itemCls}
              >
                <FileText className="h-4 w-4 text-bone/40" />
                <span className="flex-1 truncate">{c.title}</span>
                <span className="shrink-0 text-xs text-bone/40">
                  {TYPE_LABEL[c.type]} · {fmt(c.date, "dd/MM")}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Arquivos">
            {files.map((f) => (
              <CommandItem
                key={f.id}
                value={`arquivo ${f.name} ${clientName(f.clientId)} ${f.id}`}
                onSelect={() => go(agency ? "/cliente/agencia/arquivos" : "/cliente/arquivos")}
                className={itemCls}
              >
                <FileIcon kind={f.kind} className="h-4 w-4 text-bone/40" />
                <span className="flex-1 truncate">{f.name}</span>
                <span className="shrink-0 text-xs text-bone/40">
                  {agency ? clientName(f.clientId) : FOLDERS.find((x) => x.id === f.folder)?.label}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Agenda">
            {events.map((e) => (
              <CommandItem
                key={e.id}
                value={`agenda ${e.title} ${clientName(e.clientId)} ${e.place}`}
                onSelect={() => go(agency ? "/cliente/agencia/agenda" : "/cliente/agenda")}
                className={itemCls}
              >
                <CalendarClock className="h-4 w-4 text-bone/40" />
                <span className="flex-1 truncate">{e.title}</span>
                <span className="shrink-0 text-xs text-bone/40">
                  {agency ? `${clientName(e.clientId)} · ` : ""}
                  {fmt(e.at, "dd/MM")}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          {convos.length > 0 && (
            <CommandGroup heading="Conversas">
              {convos.map((c) => (
                <CommandItem
                  key={c.id}
                  value={`conversa ${c.subject} ${c.contact} ${clientName(c.clientId)}`}
                  onSelect={() => go("/cliente/agencia/inbox")}
                  className={itemCls}
                >
                  <MessageSquare className="h-4 w-4 text-bone/40" />
                  <span className="flex-1 truncate">{c.subject}</span>
                  <span className="shrink-0 text-xs text-bone/40">{clientName(c.clientId)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
