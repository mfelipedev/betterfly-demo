import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Check, CheckCircle2, ChevronRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TEAM, type Content } from "../data";
import { fmt, pad2, relDay } from "../format";
import { useDemo, useStats } from "../store";
import { EmptyState, PageHeader, StatusBadge, Thumb, TypeTag, btn } from "../ui";

type Tab = "pending" | "changes" | "approved";

export function Approvals() {
  const stats = useStats();
  const [tab, setTab] = useState<Tab>("pending");

  const lists: Record<Tab, Content[]> = {
    pending: stats.pending,
    changes: stats.changes,
    approved: [...stats.approved].sort(
      (a, b) => +new Date(b.approvedAt ?? b.date) - +new Date(a.approvedAt ?? a.date),
    ),
  };
  const tabs: [Tab, string][] = [
    ["pending", "Aguardando você"],
    ["changes", "Alteração solicitada"],
    ["approved", "Aprovados"],
  ];

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-7 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Aprovações"
        title="Minhas aprovações"
        subtitle="Revise e aprove em poucos cliques. Cada decisão fica registrada no histórico do conteúdo."
      />

      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-border" role="tablist">
        {tabs.map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn(
              "relative -mb-px flex shrink-0 items-center gap-2 px-3 pb-3 text-sm transition-colors",
              tab === k ? "text-bone" : "text-bone/45 hover:text-bone/80",
            )}
          >
            {label}
            <span
              className={cn(
                "rounded-full px-1.5 py-px text-[0.65rem] tabular-nums",
                k === "pending" && lists[k].length
                  ? "bg-acid font-bold text-ink"
                  : "bg-bone/10 text-bone/60",
              )}
            >
              {lists[k].length}
            </span>
            {tab === k && (
              <motion.span
                layoutId="appr-tab"
                className="absolute inset-x-0 bottom-0 h-px bg-acid"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {lists[tab].map((c) => (
            <ApprovalCard key={c.id} c={c} />
          ))}
        </AnimatePresence>
        {lists[tab].length === 0 && (
          <EmptyState
            icon={<CheckCircle2 className="h-8 w-8" />}
            title={
              tab === "pending"
                ? "Tudo aprovado por aqui"
                : tab === "changes"
                  ? "Nenhuma alteração em andamento"
                  : "Nenhum conteúdo aprovado ainda"
            }
            text={
              tab === "pending"
                ? "Quando a Betterfly enviar um novo conteúdo, ele aparece aqui e você recebe uma notificação."
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}

function ApprovalCard({ c }: { c: Content }) {
  const { approve } = useDemo();
  const version = c.versions.at(-1)?.n ?? 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
      className={cn(
        "group flex items-center gap-4 rounded-md border bg-surface/40 p-3 pr-4 transition-colors md:gap-5",
        c.status === "aguardando" ? "border-border hover:border-acid/40" : "border-border",
      )}
    >
      <Link to="/cliente/conteudo/$id" params={{ id: c.id }} className="shrink-0">
        <Thumb thumb={c.thumb} className="h-20 w-16 rounded-sm md:h-24 md:w-[76px]" />
      </Link>
      <Link to="/cliente/conteudo/$id" params={{ id: c.id }} className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <TypeTag type={c.type} />
          {version > 0 && (
            <span className="text-[0.7rem] text-bone/45">Versão {pad2(version)}</span>
          )}
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm font-medium md:text-base">{c.title}</p>
        <p className="mt-1.5 text-xs text-bone/45">
          Publicação{" "}
          {relDay(c.date).toLowerCase() === "hoje" ? "hoje" : `em ${fmt(c.date, "dd/MM")}`} ·{" "}
          {TEAM[c.owner].first}
        </p>
        {c.status === "ajuste" && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-orange-300">
            <RefreshCw className="h-3 w-3" /> Nova versão em preparação
          </p>
        )}
      </Link>
      <div className="flex shrink-0 items-center gap-2">
        {c.status === "aguardando" ? (
          <>
            <button
              type="button"
              onClick={() => {
                approve(c.id);
                toast.success("Conteúdo aprovado ✓", { description: c.title });
              }}
              className={cn(btn.primary, "px-3 md:px-4")}
              aria-label={`Aprovar ${c.title}`}
            >
              <Check className="h-4 w-4" />
              <span className="hidden md:inline">Aprovar</span>
            </button>
            <Link
              to="/cliente/conteudo/$id"
              params={{ id: c.id }}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-border text-bone/60 hover:text-bone sm:flex"
              aria-label="Revisar"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <StatusBadge status={c.status} className="hidden sm:inline-flex" />
        )}
      </div>
    </motion.div>
  );
}
