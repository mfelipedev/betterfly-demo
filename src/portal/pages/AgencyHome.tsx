import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Clock,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_CLIENT, TEAM, type TeamId } from "../data";
import { fmt, greeting, pad2, relDay, timeAgo } from "../format";
import { useDemo, useStats } from "../store";
import { AiMark, Avatar, Panel, TeamAvatar, btn } from "../ui";

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] as const },
});

export function AgencyHome() {
  const { state } = useDemo();
  const { agency } = useStats();

  const tiles = [
    { n: agency.clients, label: "Clientes ativos", to: "/cliente/agencia/clientes" },
    { n: agency.approvals, label: "Aguardando aprovação", to: "/cliente/agencia/aprovacoes" },
    { n: agency.changes, label: "Alterações solicitadas", to: "/cliente/agencia/aprovacoes" },
    { n: agency.open, label: "Conversas abertas", to: "/cliente/agencia/inbox" },
    {
      n: agency.aiResolvedToday,
      label: "IA resolveu hoje",
      to: "/cliente/agencia/automacao",
      ai: true,
    },
    { n: agency.human, label: "Atendimento humano", to: "/cliente/agencia/inbox" },
  ];

  const captacao = state.agenda.find((e) => e.kind === "captacao")!;
  const shoots = [
    {
      client: DEMO_CLIENT.name,
      initials: "NS",
      title: captacao.title,
      at: captacao.at,
      owner: captacao.owner,
    },
    {
      client: "Casa Verde",
      initials: "CV",
      title: "Fotos do menu de primavera",
      at: offset(3, 9),
      owner: "ana" as TeamId,
    },
    {
      client: "Serra Café",
      initials: "SC",
      title: "Captação de grãos e baristas",
      at: offset(6, 15),
      owner: "ana" as TeamId,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-7 md:px-8 md:py-10">
      <motion.div {...fadeUp(0)}>
        <p className="label-xs">{fmt(new Date(), "EEEE, d 'de' MMMM")} · Operação Betterfly</p>
        <h1 className="mt-3 font-display text-[2rem] leading-[1.02] font-medium md:text-5xl">
          {greeting()}, <span className="text-acid">Marina.</span>
        </h1>
        <p className="mt-3 text-sm text-bone/55">
          Clientes, pendências, conteúdos e conversas, sem procurar em vários lugares.
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {tiles.map((t, i) => (
          <motion.div key={t.label} {...fadeUp(i + 1)}>
            <Link
              to={t.to}
              className={cn(
                "group flex h-full flex-col justify-between rounded-md border bg-surface/40 p-4 transition-colors",
                t.ai ? "border-acid/30 hover:border-acid/60" : "border-border hover:border-bone/25",
              )}
            >
              <span className="flex items-start justify-between">
                <span
                  className={cn(
                    "font-display text-4xl leading-none font-medium tabular-nums",
                    t.ai && "text-acid",
                  )}
                >
                  {pad2(t.n)}
                </span>
                {t.ai ? (
                  <AiMark className="h-6 w-6" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-bone/25 group-hover:text-acid" />
                )}
              </span>
              <span className="mt-5 text-xs text-bone/60">{t.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-6">
          <motion.div {...fadeUp(7)}>
            <Attention />
          </motion.div>
          <motion.div {...fadeUp(8)}>
            <Panel title="Próximas captações">
              <ul className="divide-y divide-border">
                {shoots.map((s) => (
                  <li key={s.client} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-14 shrink-0 text-center">
                      <p className="font-display text-2xl leading-none">{fmt(s.at, "dd")}</p>
                      <p className="label-xs mt-1">{fmt(s.at, "MMM")}</p>
                    </div>
                    <Avatar
                      initials={s.initials}
                      className="hidden sm:inline-flex"
                      tone={s.client === DEMO_CLIENT.name ? "acid" : "bone"}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{s.title}</p>
                      <p className="mt-0.5 text-xs text-bone/45">
                        {s.client} · {relDay(s.at)}, {fmt(s.at, "HH:mm")}
                      </p>
                    </div>
                    <span className="flex items-center gap-2 text-xs text-bone/50">
                      <TeamAvatar id={s.owner} className="h-6 w-6 text-[0.55rem]" />
                      <span className="hidden md:inline">{TEAM[s.owner].first}</span>
                    </span>
                    <Camera className="h-4 w-4 text-bone/30" />
                  </li>
                ))}
              </ul>
            </Panel>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div {...fadeUp(7)}>
            <AiCard />
          </motion.div>
          <motion.div {...fadeUp(8)}>
            <TeamActivity />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function offset(days: number, h: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(h, 0, 0, 0);
  return d.toISOString();
}

function Attention() {
  const { state } = useDemo();
  const { agency } = useStats();
  const waiting = state.convos.filter((c) => c.status === "aguardando");

  const items = [
    {
      icon: Clock,
      tone: "text-orange-300",
      text: "3 aprovações pendentes há mais de 48h",
      meta: "Núcleo Movimento · lembrete automático enviado ontem",
      to: "/cliente/agencia/aprovacoes",
    },
    ...(agency.waiting
      ? [
          {
            icon: MessageSquare,
            tone: "text-acid",
            text: `${agency.waiting} ${agency.waiting === 1 ? "conversa aguardando" : "conversas aguardando"} equipe`,
            meta: waiting
              .map((c) => state.clients.find((cl) => cl.id === c.clientId)?.name)
              .join(" · "),
            to: "/cliente/agencia/inbox",
          },
        ]
      : []),
    {
      icon: AlertTriangle,
      tone: "text-orange-300",
      text: "1 entrega próxima do prazo",
      meta: "Reels “Desafio 21 dias” · Núcleo Movimento · amanhã",
      to: "/cliente/agencia/clientes",
    },
  ];

  return (
    <Panel
      title="Precisa de atenção"
      action={<span className="text-xs text-bone/40">{items.length} itens</span>}
    >
      <ul className="divide-y divide-border">
        {items.map((it) => (
          <li key={it.text}>
            <Link
              to={it.to}
              className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-bone/[0.03]"
            >
              <it.icon className={cn("h-4 w-4 shrink-0", it.tone)} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm">{it.text}</span>
                <span className="mt-0.5 block truncate text-xs text-bone/45">{it.meta}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-bone/25 transition-colors group-hover:text-acid" />
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function AiCard() {
  const { agency } = useStats();
  const total = agency.aiResolvedToday + agency.human + agency.waiting;
  const pct = Math.round((agency.aiResolvedToday / total) * 100);
  return (
    <div className="rounded-md border border-acid/25 bg-acid/[0.04] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AiMark />
          <div>
            <p className="text-sm font-medium">IA Betterfly</p>
            <p className="flex items-center gap-1.5 text-xs text-acid">
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-acid" /> Ativa · atendimento
              inicial
            </p>
          </div>
        </div>
        <Link to="/cliente/agencia/$secao" params={{ secao: "automacao" }} className={btn.subtle}>
          Configurar
        </Link>
      </div>
      <div className="mt-5 flex h-1.5 gap-1 overflow-hidden rounded-full">
        <span className="rounded-full bg-acid" style={{ flexGrow: agency.aiResolvedToday }} />
        <span className="rounded-full bg-bone/70" style={{ flexGrow: agency.human }} />
        <span
          className="rounded-full bg-orange-400"
          style={{ flexGrow: agency.waiting || 0.001 }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <span>
          <span className="block font-display text-xl text-acid">{agency.aiResolvedToday}</span>
          <span className="text-bone/50">resolvidas pela IA</span>
        </span>
        <span>
          <span className="block font-display text-xl">{agency.human}</span>
          <span className="text-bone/50">com a equipe</span>
        </span>
        <span>
          <span className="block font-display text-xl text-orange-300">{agency.waiting}</span>
          <span className="text-bone/50">aguardando</span>
        </span>
      </div>
      <p className="mt-4 border-t border-acid/15 pt-3 text-xs text-bone/50">
        {pct}% dos atendimentos de hoje resolvidos sem espera, usando as informações e regras
        configuradas.
      </p>
    </div>
  );
}

function TeamActivity() {
  const { state } = useDemo();
  const north = state.convos.find((c) => c.id === "cv-north")!;
  const now = new Date().toISOString();

  const dynamic = [
    ...state.activity
      .filter((a) => (a.kind === "approved" || a.kind === "change") && a.text.startsWith("Você"))
      .slice(0, 3)
      .map((a) => ({
        id: a.id,
        who: "LA",
        text: a.text
          .replace("Você aprovou", "Lucas (North Studio) aprovou")
          .replace("Você solicitou", "Lucas (North Studio) solicitou"),
        at: a.at,
        client: true,
      })),
    ...(north.status === "humano"
      ? [
          {
            id: "north-assume",
            who: "MS",
            text: "Marina assumiu a conversa com a North Studio",
            at: now,
            client: false,
          },
        ]
      : []),
  ];

  const base = [
    {
      id: "t1",
      who: "BL",
      text: "Bruno enviou o carrossel “Desafio 21 dias” para Núcleo Movimento",
      at: new Date(Date.now() - 55 * 60_000).toISOString(),
      client: false,
    },
    {
      id: "t2",
      who: "AC",
      text: "Ana subiu 64 fotos da captação da Casa Verde",
      at: offset(-1, 18),
      client: false,
    },
    {
      id: "t3",
      who: "MS",
      text: "Marina atualizou o calendário da North Studio",
      at: offset(-2, 18),
      client: false,
    },
  ];

  const items = [...dynamic, ...base].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 6);

  return (
    <Panel title="Atividade da equipe">
      <ul className="divide-y divide-border">
        {items.map((it) => (
          <li key={it.id} className="flex gap-3 px-5 py-3">
            <Avatar
              initials={it.who}
              tone={it.client ? "acid" : "bone"}
              className="h-7 w-7 text-[0.6rem]"
            />
            <span className="min-w-0">
              <span className="block text-sm leading-snug text-bone/80">{it.text}</span>
              <span className="mt-0.5 block text-[0.7rem] text-bone/40">{timeAgo(it.at)}</span>
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
