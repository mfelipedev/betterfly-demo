import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Camera,
  CheckCircle2,
  MessageSquare,
  RefreshCw,
  Send,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APPROVED_STATUSES, DEMO_CLIENT, TEAM, type Activity, type ContentStatus } from "../data";
import { fmt, greeting, pad2, relDay, timeAgo } from "../format";
import { useDemo, useStats } from "../store";
import { ContentRow, Panel, Thumb, btn } from "../ui";

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as const },
});

export function ClientHome() {
  const { state } = useDemo();
  const stats = useStats();
  const captacao = state.agenda.find((e) => e.kind === "captacao")!;
  const reuniao = state.agenda.find((e) => e.kind === "reuniao")!;

  const cards = [
    { n: state.contents.length, label: "Conteúdos planejados", to: "/cliente/conteudo", tone: "" },
    {
      n: stats.pending.length,
      label: "Aguardando sua aprovação",
      to: "/cliente/aprovacoes",
      tone: "acid",
    },
    { n: stats.approved.length, label: "Aprovados", to: "/cliente/conteudo", tone: "" },
    { n: stats.production.length, label: "Em produção", to: "/cliente/conteudo", tone: "" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-7 md:px-8 md:py-10">
      <motion.div
        {...fadeUp(0)}
        className="flex flex-col justify-between gap-3 md:flex-row md:items-end"
      >
        <div>
          <p className="label-xs">{fmt(new Date(), "EEEE, d 'de' MMMM")}</p>
          <h1 className="mt-3 font-display text-[2rem] leading-[1.02] font-medium md:text-5xl">
            {greeting()}, <span className="text-acid">{DEMO_CLIENT.name}.</span>
          </h1>
          <p className="mt-3 text-sm text-bone/55">
            Aqui está o que está acontecendo com sua marca.
          </p>
        </div>
      </motion.div>

      {/* Números principais */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} {...fadeUp(i + 1)}>
            <Link
              to={c.to}
              className={cn(
                "group relative flex h-full flex-col justify-between overflow-hidden rounded-md border p-4 transition-colors md:p-5",
                c.tone === "acid" && c.n > 0
                  ? "border-acid/40 bg-acid/[0.06] hover:border-acid"
                  : "border-border bg-surface/40 hover:border-bone/25",
              )}
            >
              <span
                className={cn(
                  "font-display text-4xl leading-none font-medium tabular-nums md:text-[3.25rem]",
                  c.tone === "acid" && c.n > 0 && "text-acid",
                )}
              >
                {pad2(c.n)}
              </span>
              <span className="mt-5 flex items-end justify-between gap-2 text-xs text-bone/60 md:text-sm">
                {c.label}
                <ArrowUpRight className="h-4 w-4 shrink-0 text-bone/25 transition-colors group-hover:text-acid" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <motion.div {...fadeUp(5)}>
            <Pendencias />
          </motion.div>
          <motion.div {...fadeUp(6)}>
            <SeuCiclo />
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div {...fadeUp(5)} className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <NextEvent
              icon={Camera}
              label="Próxima captação"
              at={captacao.at}
              title={captacao.title}
              meta={`${captacao.place} · ${TEAM[captacao.owner].first}`}
              highlight
            />
            <NextEvent
              icon={Video}
              label="Próxima reunião"
              at={reuniao.at}
              title={reuniao.title}
              meta={`${reuniao.place} · ${TEAM[reuniao.owner].first}`}
            />
          </motion.div>
          <motion.div {...fadeUp(7)}>
            <Atividade items={state.activity.slice(0, 5)} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Pendencias() {
  const stats = useStats();
  const { state } = useDemo();
  const north = state.convos.find((c) => c.id === "cv-north")!;
  const lastAgent = north.messages.at(-1)?.from === "agent";

  return (
    <Panel
      title="Pendências"
      action={
        stats.pending.length > 0 && (
          <Link to="/cliente/aprovacoes" className={btn.subtle}>
            Ver todas <ArrowRight className="h-3 w-3" />
          </Link>
        )
      }
    >
      {stats.pending.length > 0 ? (
        <>
          <div className="flex items-center gap-3 px-5 pt-4 pb-2">
            <span className="signal-dot h-2 w-2 rounded-full bg-acid" />
            <p className="text-sm">
              <span className="font-medium text-acid">
                {stats.pending.length} {stats.pending.length === 1 ? "conteúdo" : "conteúdos"}
              </span>{" "}
              {stats.pending.length === 1 ? "aguarda" : "aguardam"} sua aprovação
            </p>
          </div>
          <div className="divide-y divide-border">
            {stats.pending.map((c) => (
              <ContentRow
                key={c.id}
                c={c}
                right={
                  <span className="hidden shrink-0 text-right text-xs text-bone/45 sm:block">
                    Publicação
                    <span className="block text-bone/80">{relDay(c.date)}</span>
                  </span>
                }
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3 px-5 py-5">
          <CheckCircle2 className="h-5 w-5 text-acid" />
          <p className="text-sm text-bone/80">
            Nenhum conteúdo aguardando sua aprovação. Tudo em dia.
          </p>
        </div>
      )}
      <div className="space-y-px border-t border-border">
        {stats.changes.map((c) => (
          <Link
            key={c.id}
            to="/cliente/conteudo/$id"
            params={{ id: c.id }}
            className="flex items-center gap-3 px-5 py-3.5 text-sm text-bone/70 transition-colors hover:bg-bone/[0.03]"
          >
            <RefreshCw className="h-4 w-4 shrink-0 text-orange-300" />
            <span className="min-w-0 flex-1 truncate">
              {TEAM[c.owner].first} está ajustando “{c.title}”
            </span>
            <span className="shrink-0 text-xs text-bone/40">nova versão em breve</span>
          </Link>
        ))}
        {lastAgent && (
          <Link
            to="/cliente/mensagens"
            className="flex items-center gap-3 px-5 py-3.5 text-sm text-bone/70 transition-colors hover:bg-bone/[0.03]"
          >
            <MessageSquare className="h-4 w-4 shrink-0 text-acid" />
            <span className="flex-1">{TEAM.marina.first} respondeu sua mensagem</span>
            <ArrowRight className="h-3.5 w-3.5 text-bone/30" />
          </Link>
        )}
      </div>
    </Panel>
  );
}

const STAGES: { key: string; label: string; statuses: ContentStatus[]; color: string }[] = [
  { key: "plan", label: "Planejamento", statuses: ["ideia"], color: "bg-bone/30" },
  { key: "prod", label: "Produção", statuses: ["producao"], color: "bg-amber-300/80" },
  { key: "appr", label: "Aprovação", statuses: ["aguardando", "ajuste"], color: "bg-acid" },
  { key: "pub", label: "Publicação", statuses: APPROVED_STATUSES, color: "bg-bone" },
];

function SeuCiclo() {
  const { state } = useDemo();
  const total = state.contents.length;
  const published = state.contents.filter((c) => c.status === "publicado").length;

  return (
    <Panel
      title="Seu mês"
      action={
        <span className="text-xs text-bone/45">
          {published} de {total} publicados
        </span>
      }
    >
      <div className="p-5">
        {/* Barra segmentada */}
        <div className="flex h-2 gap-1 overflow-hidden rounded-full">
          {STAGES.map((s) => {
            const n = state.contents.filter((c) => s.statuses.includes(c.status)).length;
            return n ? (
              <motion.span
                key={s.key}
                layout
                className={cn("h-full rounded-full", s.color)}
                style={{ flexGrow: n }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : null;
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
          {STAGES.map((s) => {
            const items = state.contents.filter((c) => s.statuses.includes(c.status));
            return (
              <div key={s.key} className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("h-1.5 w-1.5 rounded-full", s.color)} />
                  <span className="label-xs">{s.label}</span>
                </div>
                <p className="mt-2 font-display text-3xl font-medium tabular-nums">
                  {pad2(items.length)}
                </p>
                <div className="mt-3 flex -space-x-2">
                  {items.slice(0, 5).map((c) => (
                    <Link
                      key={c.id}
                      to="/cliente/conteudo/$id"
                      params={{ id: c.id }}
                      title={c.title}
                      className="transition-transform hover:-translate-y-0.5"
                    >
                      <Thumb
                        thumb={c.thumb}
                        className="h-9 w-7 rounded-[3px] ring-2 ring-background"
                      />
                    </Link>
                  ))}
                  {items.length === 0 && (
                    <span className="text-xs text-bone/35">Nada nesta etapa</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function NextEvent({
  icon: Icon,
  label,
  at,
  title,
  meta,
  highlight,
}: {
  icon: typeof Camera;
  label: string;
  at: string;
  title: string;
  meta: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border p-4 md:p-5",
        highlight ? "border-acid/30" : "border-border",
        "bg-surface/40",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="label-xs">{label}</p>
        <Icon className={cn("h-4 w-4", highlight ? "text-acid" : "text-bone/40")} />
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-display text-3xl leading-none font-medium uppercase md:text-4xl">
          {fmt(at, "dd MMM")}
        </span>
        <span className={cn("font-display text-lg", highlight ? "text-acid" : "text-bone/70")}>
          {fmt(at, "HH:mm")}
        </span>
      </div>
      <p className="mt-3 truncate text-sm text-bone/80">{title}</p>
      <p className="mt-1 truncate text-xs text-bone/40">{meta}</p>
    </div>
  );
}

const ACTIVITY_ICON: Record<Activity["kind"], typeof Send> = {
  sent: Send,
  change: RefreshCw,
  approved: CheckCircle2,
  calendar: CalendarClock,
  message: MessageSquare,
  system: CalendarClock,
};

function Atividade({ items }: { items: Activity[] }) {
  return (
    <Panel title="Atividade recente">
      <ol className="relative px-5 py-4">
        <span className="absolute top-6 bottom-6 left-[31px] w-px bg-border" aria-hidden />
        {items.map((a) => {
          const Icon = ACTIVITY_ICON[a.kind];
          const inner = (
            <>
              <span
                className={cn(
                  "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background",
                  a.kind === "approved" ? "border-acid/50 text-acid" : "border-border text-bone/50",
                )}
              >
                <Icon className="h-3 w-3" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm leading-snug text-bone/80">{a.text}</span>
                <span className="mt-1 block text-[0.7rem] text-bone/40">{timeAgo(a.at)}</span>
              </span>
            </>
          );
          return (
            <li key={a.id} className="py-2">
              {a.contentId ? (
                <Link
                  to="/cliente/conteudo/$id"
                  params={{ id: a.contentId }}
                  className="flex gap-3 hover:[&_span.block:first-child]:text-bone"
                >
                  {inner}
                </Link>
              ) : (
                <div className="flex gap-3">{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
