import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEAM, type TeamId } from "../data";
import { fmt, relDay } from "../format";
import { useDemo, useStats } from "../store";
import { AiMark, PageHeader, TeamAvatar, btn } from "../ui";

const STATUS: Record<TeamId, { label: string; tone: string; email: string }> = {
  marina: { label: "Disponível", tone: "bg-acid", email: "marina@betterfly.com.br" },
  bruno: { label: "Em reunião", tone: "bg-orange-400", email: "bruno@betterfly.com.br" },
  ana: { label: "Em edição", tone: "bg-amber-300/80", email: "ana@betterfly.com.br" },
};

export function Team() {
  const { state } = useDemo();
  const { clients, agency } = useStats();
  const now = Date.now();

  const members = (Object.keys(TEAM) as TeamId[]).map((id) => {
    const mine = clients.filter((c) => c.owner === id);
    const mineIds = new Set(mine.map((c) => c.id));
    const convos = state.convos.filter(
      (c) =>
        (c.status === "humano" && c.agent === id) ||
        (c.status === "aguardando" && mineIds.has(c.clientId)),
    );
    const events = state.agenda
      .filter((e) => e.owner === id && +new Date(e.at) > now)
      .sort((a, b) => +new Date(a.at) - +new Date(b.at));
    const approvals = mine.reduce((s, c) => s + c.approvals, 0);
    const changes = mine.reduce((s, c) => s + c.changes, 0);
    const base = { marina: 12, bruno: 22, ana: 8 }[id];
    const load = Math.min(
      100,
      base + mine.length * 6 + convos.length * 6 + changes * 5 + events.length * 3,
    );
    return { id, mine, convos, events, approvals, changes, load };
  });

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Equipe"
        title="Quem faz a Betterfly"
        subtitle="Clientes, conversas, pendências e agenda de cada pessoa, para distribuir o trabalho com clareza."
      />

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {members.map((m) => {
          const t = TEAM[m.id];
          return (
            <article key={m.id} className="flex flex-col rounded-md border border-border">
              <header className="flex items-center gap-3 px-5 pt-5">
                <span className="relative">
                  <TeamAvatar id={m.id} className="h-12 w-12 text-sm" />
                  <span
                    className={cn(
                      "absolute right-0 bottom-0 h-3 w-3 rounded-full ring-2 ring-background",
                      STATUS[m.id].tone,
                    )}
                  />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg leading-tight">{t.name}</h2>
                  <p className="text-xs text-bone/45">
                    {t.role} · {STATUS[m.id].label}
                  </p>
                </div>
              </header>

              <dl className="mt-5 grid grid-cols-4 border-y border-border text-center">
                {[
                  [m.mine.length, "clientes"],
                  [m.convos.length, "conversas"],
                  [m.approvals, "aprovações"],
                  [m.changes, "ajustes"],
                ].map(([n, l]) => (
                  <div key={l} className="border-r border-border py-3 last:border-r-0">
                    <dd className="font-display text-xl tabular-nums">{n}</dd>
                    <dt className="text-[0.62rem] text-bone/45">{l}</dt>
                  </div>
                ))}
              </dl>

              <div className="px-5 py-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-bone/45">Carga da semana</span>
                  <span className="tabular-nums">{m.load}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bone/10">
                  <div
                    className={cn("h-full rounded-full", m.load > 80 ? "bg-orange-400" : "bg-acid")}
                    style={{ width: `${m.load}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-border px-5 py-4">
                <p className="label-xs mb-2">Próximos compromissos</p>
                {!m.events.length ? (
                  <p className="text-sm text-bone/45">Agenda livre.</p>
                ) : (
                  <ul className="space-y-2">
                    {m.events.slice(0, 3).map((e) => (
                      <li key={e.id} className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate">{e.title}</span>
                        <span className="shrink-0 text-xs text-bone/45">
                          {relDay(e.at)} · {fmt(e.at, "HH:mm")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-border px-5 py-4">
                <p className="label-xs mb-2">Clientes</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.mine.map((c) => (
                    <Link
                      key={c.id}
                      to="/cliente/agencia/clientes/$id"
                      params={{ id: c.id }}
                      className="rounded-full border border-border px-2.5 py-1 text-xs text-bone/70 transition-colors hover:border-acid/40 hover:text-acid"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
              <a
                href={`mailto:${STATUS[m.id].email}`}
                className="mt-auto flex items-center justify-between border-t border-border px-5 py-3 text-xs text-bone/55 transition-colors hover:text-acid"
              >
                {STATUS[m.id].email} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </article>
          );
        })}
      </div>

      <section className="mt-6 flex flex-col gap-4 rounded-md border border-acid/25 bg-acid/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <AiMark className="h-11 w-11" />
          <div>
            <p className="font-display text-lg">IA Betterfly</p>
            <p className="text-xs text-bone/55">
              Atendimento inicial 24h · {agency.aiResolvedToday} conversas resolvidas hoje ·{" "}
              {agency.aiOpen} em andamento
            </p>
          </div>
        </div>
        <Link to="/cliente/agencia/automacao" className={btn.ghost}>
          Regras e configurações
        </Link>
      </section>
    </div>
  );
}
