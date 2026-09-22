import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  CalendarPlus,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Send,
  Users,
  X,
  type LucideIcon,
  FileCheck2,
} from "lucide-react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DEMO_CLIENT_ID, TEAM, TYPE_LABEL, type AgendaEvent, type TeamId } from "../data";
import { fmt, relDay } from "../format";
import { useDemo } from "../store";
import { EmptyState, PageHeader, TeamAvatar, btn } from "../ui";

const KIND: Record<
  AgendaEvent["kind"],
  { label: string; icon: LucideIcon; dot: string; chip: string }
> = {
  captacao: { label: "Captação", icon: Camera, dot: "bg-acid", chip: "border-acid/40 text-acid" },
  reuniao: {
    label: "Reunião",
    icon: Users,
    dot: "bg-bone/80",
    chip: "border-bone/30 text-bone/85",
  },
  entrega: {
    label: "Entrega",
    icon: FileCheck2,
    dot: "bg-orange-400",
    chip: "border-orange-400/40 text-orange-300",
  },
  publicacao: {
    label: "Publicação",
    icon: Send,
    dot: "bg-sky-300/80",
    chip: "border-sky-300/35 text-sky-200",
  },
};

const PUBLISHABLE = ["aguardando", "aprovado", "programado", "publicado"];

function useEvents(agency: boolean) {
  const { state } = useDemo();
  return useMemo(() => {
    const pubs: AgendaEvent[] = state.contents
      .filter((c) => PUBLISHABLE.includes(c.status))
      .map((c) => ({
        id: `pub-${c.id}`,
        kind: "publicacao",
        title: `${TYPE_LABEL[c.type]} · ${c.title}`,
        at: c.date,
        duration: 0,
        owner: c.owner,
        place: c.channel,
        clientId: DEMO_CLIENT_ID,
        contentId: c.id,
        notes:
          c.status === "aguardando"
            ? "Publicação depende da sua aprovação."
            : c.status === "publicado"
              ? "Publicado."
              : "Aprovado e programado.",
      }));
    return [...state.agenda, ...pubs]
      .filter((e) => agency || e.clientId === DEMO_CLIENT_ID)
      .sort((a, b) => +new Date(a.at) - +new Date(b.at));
  }, [state.agenda, state.contents, agency]);
}

export function Agenda({ agency = false }: { agency?: boolean }) {
  const { state } = useDemo();
  const all = useEvents(agency);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [day, setDay] = useState<Date | null>(null);
  const [kinds, setKinds] = useState<AgendaEvent["kind"][]>([]);
  const [person, setPerson] = useState<TeamId | "todos">("todos");
  const [open, setOpen] = useState<AgendaEvent | null>(null);

  const events = all.filter(
    (e) => (!kinds.length || kinds.includes(e.kind)) && (person === "todos" || e.owner === person),
  );
  const clientName = (id: string) => state.clients.find((c) => c.id === id)?.name ?? "";

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const out: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) out.push(d);
    return out;
  }, [month]);

  const today = new Date();
  const listed = day
    ? events.filter((e) => isSameDay(new Date(e.at), day))
    : events
        .filter((e) => new Date(e.at).getTime() >= new Date().setHours(0, 0, 0, 0))
        .slice(0, 12);

  const toggleKind = (k: AgendaEvent["kind"]) =>
    setKinds((ks) => (ks.includes(k) ? ks.filter((x) => x !== k) : [...ks, k]));

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Agenda"
        title={agency ? "Agenda da operação" : "Sua agenda"}
        subtitle={
          agency
            ? "Captações, reuniões, entregas e publicações de todos os clientes."
            : "Captações, reuniões, entregas e publicações da North Studio."
        }
      />

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {(Object.keys(KIND) as AgendaEvent["kind"][]).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={kinds.includes(k)}
            onClick={() => toggleKind(k)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
              kinds.includes(k) ? KIND[k].chip : "border-border text-bone/55 hover:text-bone",
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", KIND[k].dot)} />
            {KIND[k].label}
          </button>
        ))}
        {agency && (
          <select
            value={person}
            onChange={(e) => setPerson(e.target.value as TeamId | "todos")}
            aria-label="Responsável"
            className="ml-auto rounded-full border border-border bg-background px-3 py-1.5 text-xs text-bone/80 focus:outline-none"
          >
            <option value="todos">Toda a equipe</option>
            {(Object.keys(TEAM) as TeamId[]).map((id) => (
              <option key={id} value={id}>
                {TEAM[id].name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Calendário do mês */}
        <section className="min-w-0 rounded-md border border-border">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-display text-lg capitalize">{fmt(month, "MMMM yyyy")}</h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setMonth(startOfMonth(new Date()));
                  setDay(null);
                }}
                className="mr-1 rounded-full border border-border px-3 py-1 text-xs text-bone/70 hover:text-bone"
              >
                Hoje
              </button>
              <button
                type="button"
                aria-label="Mês anterior"
                onClick={() => setMonth((m) => addMonths(m, -1))}
                className="rounded-full p-1.5 text-bone/60 hover:bg-bone/5 hover:text-bone"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Próximo mês"
                onClick={() => setMonth((m) => addMonths(m, 1))}
                className="rounded-full p-1.5 text-bone/60 hover:bg-bone/5 hover:text-bone"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </header>
          <div className="grid grid-cols-7 border-b border-border text-center text-[0.62rem] tracking-[0.16em] text-bone/40 uppercase">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
              <span key={d} className="py-2">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((d) => {
              const evs = events.filter((e) => isSameDay(new Date(e.at), d));
              const selected = day && isSameDay(d, day);
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => setDay(selected ? null : d)}
                  className={cn(
                    "flex min-h-14 flex-col items-stretch gap-1 border-r border-b border-border p-1.5 text-left transition-colors last:border-r-0 md:min-h-24 [&:nth-child(7n)]:border-r-0",
                    !isSameMonth(d, month) && "opacity-35",
                    selected ? "bg-acid/[0.07]" : "hover:bg-bone/[0.03]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center self-start rounded-full text-xs tabular-nums",
                      isSameDay(d, today) ? "bg-acid font-semibold text-ink" : "text-bone/70",
                    )}
                  >
                    {d.getDate()}
                  </span>
                  {/* Celular: pontos. Desktop: títulos. */}
                  <span className="flex flex-wrap gap-1 md:hidden">
                    {evs.slice(0, 4).map((e) => (
                      <span
                        key={e.id}
                        className={cn("h-1.5 w-1.5 rounded-full", KIND[e.kind].dot)}
                      />
                    ))}
                  </span>
                  <span className="hidden flex-col gap-0.5 md:flex">
                    {evs.slice(0, 2).map((e) => (
                      <span
                        key={e.id}
                        className="flex items-center gap-1 truncate rounded-sm bg-bone/[0.05] px-1 py-0.5 text-[0.62rem] text-bone/75"
                      >
                        <span className={cn("h-1 w-1 shrink-0 rounded-full", KIND[e.kind].dot)} />
                        <span className="truncate">{e.title.replace(/^.+ · /, "")}</span>
                      </span>
                    ))}
                    {evs.length > 2 && (
                      <span className="px-1 text-[0.6rem] text-bone/40">+{evs.length - 2}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Lista */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="label-xs">
              {day ? (isSameDay(day, today) ? "Hoje" : fmt(day, "EEEE, d 'de' MMMM")) : "Próximos"}
            </h2>
            {day && (
              <button type="button" onClick={() => setDay(null)} className={btn.subtle}>
                Ver próximos
              </button>
            )}
          </div>
          {!listed.length ? (
            <EmptyState title="Nada marcado" text="Nenhum evento para este dia." />
          ) : (
            <ul className="mt-3 space-y-2">
              {listed.map((e) => (
                <li key={e.id}>
                  <EventCard
                    e={e}
                    client={agency ? clientName(e.clientId) : undefined}
                    onClick={() => setOpen(e)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <AnimatePresence>
        {open && (
          <EventDrawer
            e={open}
            agency={agency}
            client={clientName(open.clientId)}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function timeRange(e: AgendaEvent) {
  if (!e.duration) return fmt(e.at, "HH:mm");
  const end = new Date(new Date(e.at).getTime() + e.duration * 60_000);
  return `${fmt(e.at, "HH:mm")} – ${fmt(end, "HH:mm")}`;
}

function EventCard({
  e,
  client,
  onClick,
}: {
  e: AgendaEvent;
  client?: string | undefined;
  onClick: () => void;
}) {
  const k = KIND[e.kind];
  const past = new Date(e.at).getTime() < Date.now();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full gap-3 rounded-md border border-border p-3.5 text-left transition-colors hover:border-bone/30",
        past && "opacity-55",
      )}
    >
      <span className="w-12 shrink-0 text-center">
        <span className="block text-[0.6rem] tracking-[0.16em] text-bone/45 uppercase">
          {fmt(e.at, "MMM")}
        </span>
        <span className="block font-display text-2xl leading-none">{fmt(e.at, "d")}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.58rem] font-medium tracking-[0.14em] uppercase",
            k.chip,
          )}
        >
          <k.icon className="h-3 w-3" /> {k.label}
        </span>
        <span className="mt-1.5 block truncate text-sm">{e.title}</span>
        <span className="mt-0.5 block truncate text-xs text-bone/45">
          {client ? `${client} · ` : ""}
          {relDay(e.at)}, {timeRange(e)} · {e.place}
        </span>
      </span>
    </button>
  );
}

/** Gera um .ics simples para adicionar o evento ao calendário do usuário. */
function downloadIcs(e: AgendaEvent, client: string) {
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const start = new Date(e.at);
  const end = new Date(start.getTime() + Math.max(e.duration, 30) * 60_000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Betterfly//Portal//PT",
    "BEGIN:VEVENT",
    `UID:${e.id}@betterfly`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${e.title} · ${client}`,
    `LOCATION:${e.place}`,
    `DESCRIPTION:${(e.notes ?? "").replace(/\n/g, " ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.title
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function EventDrawer({
  e,
  agency,
  client,
  onClose,
}: {
  e: AgendaEvent;
  agency: boolean;
  client: string;
  onClose: () => void;
}) {
  const { logActivity } = useDemo();
  const k = KIND[e.kind];
  const future = new Date(e.at).getTime() > Date.now();
  const [asked, setAsked] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-ink/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.aside
        role="dialog"
        aria-label={e.title}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(ev) => ev.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-border bg-background"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.14em] uppercase",
              k.chip,
            )}
          >
            <k.icon className="h-3 w-3" /> {k.label}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-bone/50 hover:text-bone"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-6 px-6 py-6">
          <div>
            {agency && <p className="label-xs mb-2">{client}</p>}
            <h2 className="font-display text-2xl leading-tight">{e.title}</h2>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-bone/40" />
              <span>
                <span className="block capitalize">{fmt(e.at, "EEEE, d 'de' MMMM")}</span>
                <span className="text-bone/50">{timeRange(e)}</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bone/40" />
              {e.place}
            </li>
            <li className="flex items-center gap-3">
              <TeamAvatar id={e.owner} className="h-6 w-6 text-[0.55rem]" />
              <span>
                {TEAM[e.owner].name}
                <span className="text-bone/45"> · {TEAM[e.owner].role}</span>
              </span>
            </li>
          </ul>
          {e.notes && (
            <div className="rounded-md border border-border bg-surface/40 p-4 text-sm leading-relaxed text-bone/75">
              {e.notes}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 border-t border-border px-6 py-5">
          {e.contentId && (
            <Link to="/cliente/conteudo/$id" params={{ id: e.contentId }} className={btn.primary}>
              Abrir conteúdo
            </Link>
          )}
          {future && (
            <button
              type="button"
              className={e.contentId ? btn.ghost : btn.primary}
              onClick={() => downloadIcs(e, client)}
            >
              <CalendarPlus className="h-3.5 w-3.5" /> Adicionar ao meu calendário
            </button>
          )}
          {future && !agency && e.kind !== "publicacao" && (
            <button
              type="button"
              disabled={asked}
              className={cn(btn.ghost, "disabled:opacity-40")}
              onClick={() => {
                setAsked(true);
                logActivity(`Você pediu para reagendar “${e.title}”`, "calendar");
                toast.success(`Pedido enviado para ${TEAM[e.owner].first}`, {
                  description: "Você recebe a nova data por aqui e em Mensagens.",
                });
              }}
            >
              {asked ? "Reagendamento solicitado" : "Pedir para reagendar"}
            </button>
          )}
        </div>
      </motion.aside>
    </motion.div>
  );
}
