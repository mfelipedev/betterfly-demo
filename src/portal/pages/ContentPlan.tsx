import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight, List } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  STATUS_LABEL,
  TYPE_LABEL,
  type Content,
  type ContentStatus,
  type ContentType,
} from "../data";
import { fmt, relDay } from "../format";
import { useDemo } from "../store";
import { EmptyState, PageHeader, STATUS_STYLE, StatusBadge, Thumb, TypeTag } from "../ui";

const TYPES: (ContentType | "todos")[] = [
  "todos",
  "reels",
  "carrossel",
  "stories",
  "foto",
  "video",
];
const LEGEND: ContentStatus[] = [
  "producao",
  "aguardando",
  "ajuste",
  "aprovado",
  "programado",
  "publicado",
];

export function ContentPlan() {
  const { state } = useDemo();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [type, setType] = useState<ContentType | "todos">("todos");
  const [month, setMonth] = useState(() => startOfMonth(new Date()));

  const items = useMemo(
    () =>
      state.contents
        .filter((c) => type === "todos" || c.type === type)
        .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    [state.contents, type],
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-7 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Plano de conteúdo"
        title="Seu calendário editorial"
        subtitle="Tudo o que está sendo planejado, produzido e publicado para a North Studio."
        actions={
          <div className="flex rounded-full border border-border p-0.5 text-xs" role="tablist">
            {(
              [
                ["calendar", "Calendário", CalendarDays],
                ["list", "Lista", List],
              ] as const
            ).map(([v, label, Icon]) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 transition-colors",
                  view === v ? "bg-bone text-ink" : "text-bone/55 hover:text-bone",
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                type === t
                  ? "border-acid bg-acid/10 text-acid"
                  : "border-border text-bone/60 hover:text-bone",
              )}
            >
              {t === "todos" ? "Todos" : TYPE_LABEL[t]}
            </button>
          ))}
        </div>
        <div className="hidden flex-wrap gap-x-4 gap-y-2 md:flex">
          {LEGEND.map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-[0.7rem] text-bone/50">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  STATUS_STYLE[s].dot.replace("signal-dot", ""),
                )}
              />
              {STATUS_LABEL[s]}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        key={view}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-5"
      >
        {view === "calendar" ? (
          <>
            <div className="hidden md:block">
              <MonthGrid month={month} setMonth={setMonth} items={items} />
            </div>
            <div className="md:hidden">
              <ListView items={items} />
            </div>
          </>
        ) : (
          <ListView items={items} />
        )}
      </motion.div>
    </div>
  );
}

function MonthGrid({
  month,
  setMonth,
  items,
}: {
  month: Date;
  setMonth: (d: Date) => void;
  items: Content[];
}) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });
  const inMonth = items.filter((c) => isSameMonth(new Date(c.date), month)).length;

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-xl capitalize">{fmt(month, "MMMM yyyy")}</h2>
          <span className="text-xs text-bone/40">{inMonth} conteúdos</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMonth(startOfMonth(new Date()))}
            className="rounded-full px-3 py-1.5 text-xs text-bone/60 transition-colors hover:bg-bone/[0.06] hover:text-bone"
          >
            Hoje
          </button>
          <button
            type="button"
            aria-label="Mês anterior"
            onClick={() => setMonth(addMonths(month, -1))}
            className="rounded-full p-1.5 text-bone/60 hover:bg-bone/[0.06] hover:text-bone"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Próximo mês"
            onClick={() => setMonth(addMonths(month, 1))}
            className="rounded-full p-1.5 text-bone/60 hover:bg-bone/[0.06] hover:text-bone"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-border">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
          <div key={d} className="label-xs px-3 py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayItems = items.filter((c) => isSameDay(new Date(c.date), day));
          const out = !isSameMonth(day, month);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[118px] border-r border-b border-border p-1.5 [&:nth-child(7n)]:border-r-0",
                out && "bg-bone/[0.015]",
              )}
            >
              <span
                className={cn(
                  "mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isToday(day)
                    ? "bg-acid font-semibold text-ink"
                    : out
                      ? "text-bone/20"
                      : "text-bone/55",
                )}
              >
                {day.getDate()}
              </span>
              <div className="space-y-1">
                {dayItems.map((c) => (
                  <Link
                    key={c.id}
                    to="/cliente/conteudo/$id"
                    params={{ id: c.id }}
                    title={`${c.title} · ${STATUS_LABEL[c.status]}`}
                    className={cn(
                      "group flex items-center gap-1.5 rounded-sm border-l-2 bg-bone/[0.04] p-1 pr-1.5 transition-colors hover:bg-bone/[0.09]",
                      c.status === "aguardando"
                        ? "border-acid"
                        : c.status === "ajuste"
                          ? "border-orange-400"
                          : c.status === "producao"
                            ? "border-amber-300/70"
                            : (APPROVED_BORDER[c.status] ?? "border-bone/30"),
                      out && "opacity-50",
                    )}
                  >
                    <Thumb thumb={c.thumb} className="h-7 w-5 shrink-0 rounded-[2px]" />
                    <span className="min-w-0">
                      <span className="block text-[0.58rem] tracking-[0.12em] text-bone/45 uppercase">
                        {TYPE_LABEL[c.type]} · {fmt(c.date, "HH:mm")}
                      </span>
                      <span className="block truncate text-[0.7rem] leading-tight text-bone/85">
                        {c.title}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const APPROVED_BORDER: Partial<Record<ContentStatus, string>> = {
  aprovado: "border-acid/50",
  programado: "border-bone/70",
  publicado: "border-bone/20",
};

function ListView({ items }: { items: Content[] }) {
  if (!items.length)
    return (
      <EmptyState
        title="Nenhum conteúdo deste tipo"
        text="Ajuste o filtro para ver outros formatos."
      />
    );

  const groups = items.reduce<Record<string, Content[]>>((acc, c) => {
    const k = fmt(c.date, "yyyy-MM-dd");
    (acc[k] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="overflow-hidden rounded-md border border-border">
      {Object.entries(groups).map(([k, list]) => (
        <div key={k} className="border-b border-border last:border-0">
          <div className="flex items-baseline gap-3 bg-bone/[0.02] px-5 py-2.5">
            <span className="font-display text-sm capitalize">{relDay(list[0]!.date)}</span>
            <span className="text-xs text-bone/35">{fmt(list[0]!.date, "dd/MM")}</span>
          </div>
          {list.map((c) => (
            <Link
              key={c.id}
              to="/cliente/conteudo/$id"
              params={{ id: c.id }}
              className="flex items-center gap-4 border-t border-border/60 px-5 py-3.5 transition-colors hover:bg-bone/[0.03]"
            >
              <Thumb thumb={c.thumb} className="h-14 w-11 shrink-0 rounded-sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <TypeTag type={c.type} />
                  <span className="text-[0.7rem] text-bone/40">
                    {c.channel} · {fmt(c.date, "HH:mm")}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-sm">{c.title}</p>
                <StatusBadge status={c.status} className="mt-2 sm:hidden" />
              </div>
              <StatusBadge status={c.status} className="hidden sm:inline-flex" />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
