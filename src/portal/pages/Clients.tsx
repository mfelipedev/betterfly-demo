import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEAM, type TeamId } from "../data";
import { relDay } from "../format";
import { useDemo, useStats } from "../store";
import { Avatar, EmptyState, PageHeader, TeamAvatar } from "../ui";

type Filter = "todos" | "pendencias" | "automacao" | "conversas";

export function Clients() {
  const { state } = useDemo();
  const { clients } = useStats();
  const [filter, setFilter] = useState<Filter>("todos");
  const [owner, setOwner] = useState<TeamId | "todos">("todos");
  const [q, setQ] = useState("");

  const openConvos = (id: string) =>
    state.convos.filter((c) => c.clientId === id && c.status !== "resolvida");

  const term = q.trim().toLowerCase();
  const list = clients
    .filter((c) => owner === "todos" || c.owner === owner)
    .filter((c) => !term || `${c.name} ${c.segment} ${c.contact}`.toLowerCase().includes(term))
    .filter((c) =>
      filter === "pendencias"
        ? c.approvals + c.changes > 0
        : filter === "automacao"
          ? c.plan === "Essencial + Automação"
          : filter === "conversas"
            ? openConvos(c.id).some((v) => v.status === "aguardando" || v.status === "humano")
            : true,
    )
    .sort(
      (a, b) =>
        b.approvals + b.changes - (a.approvals + a.changes) ||
        +new Date(a.nextDelivery) - +new Date(b.nextDelivery),
    );

  const filters: [Filter, string, number][] = [
    ["todos", "Todos", clients.length],
    ["pendencias", "Com pendências", clients.filter((c) => c.approvals + c.changes > 0).length],
    [
      "conversas",
      "Com a equipe",
      clients.filter((c) =>
        openConvos(c.id).some((v) => v.status === "aguardando" || v.status === "humano"),
      ).length,
    ],
    ["automacao", "Plano com IA", clients.filter((c) => c.plan === "Essencial + Automação").length],
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Clientes"
        title="Carteira de clientes"
        subtitle="Plano, responsável, pendências e próxima entrega de cada conta. Clique para ver a visão 360."
      />

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {filters.map(([k, label, n]) => (
          <button
            key={k}
            type="button"
            aria-pressed={filter === k}
            onClick={() => setFilter(k)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
              filter === k
                ? "border-acid/50 bg-acid/[0.06] text-acid"
                : "border-border text-bone/60 hover:text-bone",
            )}
          >
            {label}
            <span className="tabular-nums opacity-70">{n}</span>
          </button>
        ))}
        <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
          <label className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-bone/35" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar cliente"
              className="w-full rounded-full border border-border bg-transparent py-1.5 pr-3 pl-9 text-sm placeholder:text-bone/35 focus:border-bone/35 focus:outline-none"
            />
          </label>
          <select
            value={owner}
            onChange={(e) => setOwner(e.target.value as TeamId | "todos")}
            aria-label="Responsável"
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-bone/80 focus:outline-none"
          >
            <option value="todos">Todos</option>
            {(Object.keys(TEAM) as TeamId[]).map((id) => (
              <option key={id} value={id}>
                {TEAM[id].first}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!list.length ? (
        <EmptyState title="Nenhum cliente encontrado" text="Ajuste os filtros ou a busca." />
      ) : (
        <div className="mt-5 overflow-hidden rounded-md border border-border">
          <div className="hidden grid-cols-[1.6fr_1fr_0.9fr_0.9fr_1.2fr_24px] gap-4 border-b border-border px-5 py-2.5 text-[0.62rem] tracking-[0.16em] text-bone/40 uppercase md:grid">
            <span>Cliente</span>
            <span>Plano</span>
            <span>Responsável</span>
            <span>Pendências</span>
            <span>Próxima entrega</span>
            <span />
          </div>
          <ul className="divide-y divide-border">
            {list.map((c) => {
              const waiting = openConvos(c.id).filter((v) => v.status === "aguardando").length;
              return (
                <li key={c.id}>
                  <Link
                    to="/cliente/agencia/clientes/$id"
                    params={{ id: c.id }}
                    className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-3.5 transition-colors hover:bg-bone/[0.03] md:grid-cols-[1.6fr_1fr_0.9fr_0.9fr_1.2fr_24px]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar initials={c.initials} tone={c.id === "north" ? "acid" : "bone"} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm">{c.name}</span>
                        <span className="block truncate text-xs text-bone/45">{c.segment}</span>
                      </span>
                    </span>
                    <span className="hidden items-center gap-1.5 text-xs text-bone/70 md:flex">
                      {c.plan === "Essencial + Automação" && (
                        <Sparkles className="h-3 w-3 shrink-0 text-acid" />
                      )}
                      {c.plan}
                    </span>
                    <span className="hidden items-center gap-2 text-xs text-bone/70 md:flex">
                      <TeamAvatar id={c.owner} className="h-6 w-6 text-[0.55rem]" />
                      {TEAM[c.owner].first}
                    </span>
                    <span className="flex flex-wrap items-center justify-end gap-1.5 md:justify-start">
                      {c.approvals > 0 && (
                        <span className="rounded-full border border-acid/40 px-2 py-0.5 text-[0.65rem] text-acid tabular-nums">
                          {c.approvals} aprov.
                        </span>
                      )}
                      {c.changes > 0 && (
                        <span className="rounded-full border border-orange-400/40 px-2 py-0.5 text-[0.65rem] text-orange-300 tabular-nums">
                          {c.changes} ajuste{c.changes > 1 ? "s" : ""}
                        </span>
                      )}
                      {waiting > 0 && (
                        <span className="rounded-full bg-orange-400/15 px-2 py-0.5 text-[0.65rem] text-orange-200">
                          chat
                        </span>
                      )}
                      {c.approvals + c.changes + waiting === 0 && (
                        <span className="text-xs text-bone/35">Em dia</span>
                      )}
                    </span>
                    <span className="col-span-2 min-w-0 text-xs md:col-span-1">
                      <span className="text-bone/80">{relDay(c.nextDelivery)}</span>
                      <span className="block truncate text-bone/40">{c.nextDeliveryLabel}</span>
                    </span>
                    <ArrowRight className="hidden h-4 w-4 text-bone/25 transition-colors group-hover:text-acid md:block" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
