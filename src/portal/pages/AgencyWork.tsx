import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BellRing, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DEMO_CLIENT_ID, TEAM, type TeamId } from "../data";
import { fmt, relDay } from "../format";
import { useDemo, useStats } from "../store";
import {
  Avatar,
  EmptyState,
  PageHeader,
  StatusBadge,
  TeamAvatar,
  Thumb,
  TypeTag,
  btn,
} from "../ui";

/** Aprovações de todos os clientes, com lembrete para quem está atrasado. */
export function AgencyApprovals() {
  const { pending, changes, clients } = useStats();
  const [reminded, setReminded] = useState<string[]>([]);
  const withPending = clients
    .filter((c) => c.approvals + c.changes > 0)
    .sort((a, b) => b.approvals - a.approvals);

  const remind = (id: string, name: string, contact: string) => {
    setReminded((r) => [...r, id]);
    toast.success(`Lembrete enviado para ${contact}`, {
      description: `${name} recebe o aviso no portal e por e-mail.`,
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Aprovações"
        title="Aprovações da operação"
        subtitle="O que está parado esperando o cliente, e o que voltou com pedido de ajuste."
      />

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [clients.reduce((s, c) => s + c.approvals, 0), "Aguardando clientes", "text-acid"],
          [clients.reduce((s, c) => s + c.changes, 0), "Ajustes para fazer", "text-orange-300"],
          [withPending.length, "Clientes com pendência", ""],
          ["1,4 dia", "Tempo médio de aprovação", ""],
        ].map(([n, l, tone]) => (
          <div key={l} className="rounded-md border border-border p-4">
            <p className={cn("font-display text-3xl tabular-nums", tone)}>{n}</p>
            <p className="mt-1 text-xs text-bone/50">{l}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 rounded-md border border-border">
          <header className="border-b border-border px-5 py-3.5">
            <h2 className="label-xs !text-bone/70">Por cliente</h2>
          </header>
          {!withPending.length ? (
            <EmptyState title="Nenhuma pendência" text="Todos os clientes estão em dia." />
          ) : (
            <ul className="divide-y divide-border">
              {withPending.map((c) => {
                const done = reminded.includes(c.id);
                return (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5"
                  >
                    <Link
                      to="/cliente/agencia/clientes/$id"
                      params={{ id: c.id }}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <Avatar
                        initials={c.initials}
                        tone={c.id === DEMO_CLIENT_ID ? "acid" : "bone"}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm">{c.name}</span>
                        <span className="block truncate text-xs text-bone/45">
                          {c.contact} · {TEAM[c.owner].first}
                        </span>
                      </span>
                    </Link>
                    <span className="flex items-center gap-1.5">
                      {c.approvals > 0 && (
                        <span className="rounded-full border border-acid/40 px-2 py-0.5 text-[0.65rem] text-acid">
                          {c.approvals} aguardando
                        </span>
                      )}
                      {c.changes > 0 && (
                        <span className="rounded-full border border-orange-400/40 px-2 py-0.5 text-[0.65rem] text-orange-300">
                          {c.changes} ajuste{c.changes > 1 ? "s" : ""}
                        </span>
                      )}
                    </span>
                    {c.approvals > 0 && (
                      <button
                        type="button"
                        disabled={done}
                        onClick={() => remind(c.id, c.name, c.contact)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                          done
                            ? "border-acid/30 text-acid"
                            : "border-border text-bone/70 hover:border-bone/40 hover:text-bone",
                        )}
                      >
                        {done ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <BellRing className="h-3.5 w-3.5" />
                        )}
                        {done ? "Lembrado" : "Lembrar"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-md border border-border">
          <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="label-xs !text-bone/70">North Studio · em detalhe</h2>
            <Link
              to="/cliente/agencia/clientes/$id"
              params={{ id: DEMO_CLIENT_ID }}
              className={btn.subtle}
            >
              Visão 360
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {[...pending, ...changes].map((c) => (
              <li key={c.id}>
                <Link
                  to="/cliente/conteudo/$id"
                  params={{ id: c.id }}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-bone/[0.03]"
                >
                  <Thumb thumb={c.thumb} className="h-12 w-10 shrink-0 rounded-sm" />
                  <span className="min-w-0 flex-1">
                    <TypeTag type={c.type} />
                    <span className="mt-1 block truncate text-sm">{c.title}</span>
                  </span>
                  <StatusBadge status={c.status} className="hidden sm:inline-flex" />
                </Link>
              </li>
            ))}
            {!pending.length && !changes.length && (
              <li className="px-5 py-6 text-sm text-bone/45">Tudo aprovado.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

/** Entregas de conteúdo de todos os clientes, por data. */
export function AgencyContent() {
  const { state } = useDemo();
  const { clients } = useStats();
  const [owner, setOwner] = useState<TeamId | "todos">("todos");
  const now = Date.now();

  const north = state.contents
    .filter((c) => +new Date(c.date) > now)
    .map((c) => ({
      id: c.id,
      client: clients.find((x) => x.id === DEMO_CLIENT_ID)!,
      label: c.title,
      type: c.type,
      at: c.date,
      owner: c.owner,
      status: c.status,
    }));
  const others = clients
    .filter((c) => c.id !== DEMO_CLIENT_ID)
    .map((c) => ({
      id: `x-${c.id}`,
      client: c,
      label: c.nextDeliveryLabel,
      type: null,
      at: c.nextDelivery,
      owner: c.owner,
      status: null,
    }));
  const rows = [...north, ...others]
    .filter((r) => owner === "todos" || r.owner === owner)
    .sort((a, b) => +new Date(a.at) - +new Date(b.at));

  const byDay = rows.reduce<Record<string, typeof rows>>((acc, r) => {
    const k = fmt(r.at, "yyyy-MM-dd");
    (acc[k] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-7 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Conteúdo"
        title="Entregas de todos os clientes"
        subtitle="Próximas publicações e entregas da operação, em ordem de data."
        actions={
          <select
            value={owner}
            onChange={(e) => setOwner(e.target.value as TeamId | "todos")}
            aria-label="Responsável"
            className="rounded-full border border-border bg-background px-3 py-2 text-xs text-bone/80 focus:outline-none"
          >
            <option value="todos">Toda a equipe</option>
            {(Object.keys(TEAM) as TeamId[]).map((id) => (
              <option key={id} value={id}>
                {TEAM[id].name}
              </option>
            ))}
          </select>
        }
      />

      <div className="mt-8 space-y-6">
        {Object.entries(byDay).map(([day, items]) => (
          <section key={day}>
            <h2 className="label-xs mb-2 capitalize">
              {relDay(items[0]!.at)} · {fmt(items[0]!.at, "d 'de' MMMM")}
            </h2>
            <ul className="divide-y divide-border overflow-hidden rounded-md border border-border">
              {items.map((r) => {
                const inner = (
                  <>
                    <Avatar
                      initials={r.client.initials}
                      tone={r.client.id === DEMO_CLIENT_ID ? "acid" : "bone"}
                      className="h-8 w-8"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        {r.type && <TypeTag type={r.type} />}
                        <span className="truncate text-xs text-bone/45">{r.client.name}</span>
                      </span>
                      <span className="mt-1 block truncate text-sm">{r.label}</span>
                    </span>
                    {r.status && (
                      <StatusBadge status={r.status} className="hidden sm:inline-flex" />
                    )}
                    <TeamAvatar id={r.owner} className="h-6 w-6 text-[0.55rem]" />
                    <ArrowRight className="hidden h-4 w-4 text-bone/25 sm:block" />
                  </>
                );
                const cls =
                  "flex items-center gap-3 px-5 py-3 transition-colors hover:bg-bone/[0.03]";
                return (
                  <li key={r.id}>
                    {r.status ? (
                      <Link to="/cliente/conteudo/$id" params={{ id: r.id }} className={cls}>
                        {inner}
                      </Link>
                    ) : (
                      <Link
                        to="/cliente/agencia/clientes/$id"
                        params={{ id: r.client.id }}
                        className={cls}
                      >
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
