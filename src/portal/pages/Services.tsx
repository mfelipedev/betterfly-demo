import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  Check,
  Compass,
  Megaphone,
  Plus,
  Sparkles,
  type LucideIcon,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { APPROVED_STATUSES, DEMO_CLIENT, TEAM, type TeamId } from "../data";
import { fmt, relDay, timeAgo } from "../format";
import { useDemo, useStats } from "../store";
import { PageHeader, TeamAvatar, btn } from "../ui";

interface Service {
  name: string;
  detail: string;
  icon: LucideIcon;
  owner: TeamId;
  status: "em-dia" | "atencao";
  statusLabel: string;
  progress: { done: number; total: number; label: string };
  next: { label: string; at: string };
  updated: { text: string; at: string };
  to: string;
  extra?: { k: string; v: string }[];
}

const EXTRAS = [
  { id: "captacao", label: "Captação extra", hint: "Meia diária de estúdio ou externa" },
  { id: "campanha", label: "Campanha sazonal", hint: "Conceito, peças e mídia para uma data" },
  {
    id: "influencia",
    label: "Ação com influenciadores",
    hint: "Curadoria, briefing e acompanhamento",
  },
];

export function Services() {
  const { state, logActivity } = useDemo();
  const { pending, changes } = useStats();
  const [asked, setAsked] = useState<string[]>([]);
  const now = Date.now();

  const approved = state.contents.filter((c) => APPROVED_STATUSES.includes(c.status)).length;
  const nextContent = state.contents
    .filter((c) => +new Date(c.date) > now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0];
  const ev = (id: string) => state.agenda.find((e) => e.id === id)!;
  const lastSent = state.activity.find((a) => a.kind === "sent" || a.kind === "change");

  const services: Service[] = [
    {
      name: "Social Media",
      detail: "12 conteúdos por mês",
      icon: LayoutGrid,
      owner: "bruno",
      status: pending.length + changes.length ? "atencao" : "em-dia",
      statusLabel: pending.length
        ? `${pending.length} aguardando você`
        : changes.length
          ? "Ajuste em andamento"
          : "Em dia",
      progress: {
        done: approved,
        total: state.contents.length,
        label: "conteúdos aprovados no ciclo",
      },
      next: nextContent
        ? { label: nextContent.title, at: nextContent.date }
        : { label: "Novo ciclo", at: ev("ev-reuniao").at },
      updated: lastSent
        ? { text: lastSent.text, at: lastSent.at }
        : { text: "Calendário atualizado", at: new Date().toISOString() },
      to: "/cliente/conteudo",
    },
    {
      name: "Tráfego Pago",
      detail: "Meta Ads",
      icon: Megaphone,
      owner: "bruno",
      status: "em-dia",
      statusLabel: "Campanhas ativas",
      progress: { done: 3120, total: 4000, label: "de R$ 4.000 investidos no mês" },
      next: { label: "Relatório de mídia", at: ev("ev-entrega-rel").at },
      updated: {
        text: "Orçamento redistribuído para o Reels de melhor desempenho",
        at: new Date(now - 26 * 3600_000).toISOString(),
      },
      to: "/cliente/arquivos",
      extra: [
        { k: "Alcance", v: "184 mil" },
        { k: "CPC médio", v: "R$ 0,42" },
        { k: "Campanhas", v: "3 ativas" },
      ],
    },
    {
      name: "Produção Audiovisual",
      detail: "1 captação mensal",
      icon: Camera,
      owner: "ana",
      status: "em-dia",
      statusLabel: "Captação confirmada",
      progress: { done: 0, total: 1, label: "captação do mês realizada" },
      next: { label: ev("ev-captacao").title, at: ev("ev-captacao").at },
      updated: {
        text: "Roteiro e lista de looks da Coleção Verão aprovados",
        at: new Date(now - 50 * 3600_000).toISOString(),
      },
      to: "/cliente/agenda",
    },
    {
      name: "Estratégia",
      detail: "Reunião mensal",
      icon: Compass,
      owner: "marina",
      status: "em-dia",
      statusLabel: "Planejamento em dia",
      progress: { done: 1, total: 2, label: "entregas estratégicas do mês" },
      next: { label: ev("ev-reuniao").title, at: ev("ev-reuniao").at },
      updated: { text: "Resumo do alinhamento de campanha enviado", at: ev("ev-reuniao-old").at },
      to: "/cliente/agenda",
    },
  ];

  const money = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-7 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Serviços"
        title="O que fazemos por você"
        subtitle={`Plano ${DEMO_CLIENT.plan}: status, responsável e próxima entrega de cada frente.`}
      />

      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {services.map((s) => {
          const pct = Math.round((s.progress.done / s.progress.total) * 100);
          return (
            <li key={s.name} className="flex flex-col rounded-md border border-border">
              <div className="flex items-start justify-between gap-3 px-5 pt-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-acid/10 text-acid">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-lg leading-tight">{s.name}</h2>
                    <p className="text-xs text-bone/45">{s.detail}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.12em] uppercase",
                    s.status === "atencao"
                      ? "border-acid/50 text-acid"
                      : "border-bone/20 text-bone/70",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      s.status === "atencao" ? "bg-acid signal-dot" : "bg-bone/60",
                    )}
                  />
                  {s.statusLabel}
                </span>
              </div>

              <div className="px-5 pt-5">
                <div className="h-1.5 overflow-hidden rounded-full bg-bone/10">
                  <div
                    className="h-full rounded-full bg-acid transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-bone/55">
                  <b className="font-medium text-bone">
                    {s.name === "Tráfego Pago"
                      ? money(s.progress.done)
                      : `${s.progress.done}/${s.progress.total}`}
                  </b>{" "}
                  {s.progress.label}
                </p>
                {s.extra && (
                  <dl className="mt-4 grid grid-cols-3 gap-2">
                    {s.extra.map((x) => (
                      <div key={x.k} className="rounded-sm bg-bone/[0.04] px-2.5 py-2">
                        <dt className="text-[0.62rem] text-bone/45">{x.k}</dt>
                        <dd className="text-sm tabular-nums">{x.v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              <dl className="mt-5 space-y-3 border-t border-border px-5 py-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-bone/45">Próxima entrega</dt>
                  <dd className="min-w-0 text-right">
                    <span className="block truncate">{s.next.label}</span>
                    <span className="text-xs text-bone/45">
                      {relDay(s.next.at)} · {fmt(s.next.at, "HH:mm")}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-bone/45">Responsável</dt>
                  <dd className="flex items-center gap-2">
                    <TeamAvatar id={s.owner} className="h-6 w-6 text-[0.55rem]" />
                    {TEAM[s.owner].name}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-bone/45">Última atualização</dt>
                  <dd className="min-w-0 text-right">
                    <span className="line-clamp-2 text-bone/80">{s.updated.text}</span>
                    <span className="text-xs text-bone/40">{timeAgo(s.updated.at)}</span>
                  </dd>
                </div>
              </dl>
              <Link
                to={s.to}
                className="mt-auto flex items-center justify-between border-t border-border px-5 py-3 text-xs text-bone/60 transition-colors hover:text-acid"
              >
                Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="mt-8 rounded-md border border-acid/25 bg-acid/[0.03] p-5 md:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-acid" />
          <h2 className="font-display text-lg">Precisa de algo a mais?</h2>
        </div>
        <p className="mt-1 text-sm text-bone/55">
          Peça um serviço extra e {TEAM[DEMO_CLIENT.owner].first} retorna com proposta e prazo.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {EXTRAS.map((x) => {
            const done = asked.includes(x.id);
            return (
              <button
                key={x.id}
                type="button"
                disabled={done}
                onClick={() => {
                  setAsked((a) => [...a, x.id]);
                  logActivity(`Você solicitou orçamento de ${x.label.toLowerCase()}`, "system");
                  toast.success("Pedido enviado", {
                    description: `${TEAM[DEMO_CLIENT.owner].first} recebeu seu pedido de ${x.label.toLowerCase()} e responde em Mensagens.`,
                  });
                }}
                className={cn(
                  "flex items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors",
                  done ? "border-acid/40 bg-acid/[0.05]" : "border-border hover:border-bone/30",
                )}
              >
                {done ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-acid" />
                ) : (
                  <Plus className="mt-0.5 h-4 w-4 shrink-0 text-bone/50" />
                )}
                <span>
                  <span className="block text-sm">
                    {done ? `${x.label} · solicitado` : x.label}
                  </span>
                  <span className="block text-xs text-bone/45">{x.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
        <Link to="/cliente/mensagens" className={cn(btn.subtle, "mt-4")}>
          Prefere conversar? Abrir Mensagens <ArrowRight className="h-3 w-3" />
        </Link>
      </section>
    </div>
  );
}
