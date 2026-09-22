import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Eye, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { APPROVED_STATUSES, DEMO_CLIENT, DEMO_CLIENT_ID, FOLDERS, TEAM } from "../data";
import { fmt, relDay } from "../format";
import { FileIcon, formatSize } from "../chat";
import { useDemo, useStats } from "../store";
import {
  AiMark,
  Avatar,
  ContentRow,
  ConvoBadge,
  EmptyState,
  Panel,
  StatusBadge,
  TeamAvatar,
  btn,
} from "../ui";

export function Client360({ id }: { id: string }) {
  const { state } = useDemo();
  const { clients } = useStats();
  const c = clients.find((x) => x.id === id);

  if (!c) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20">
        <EmptyState title="Cliente não encontrado" text="Volte para a carteira e escolha outro." />
        <div className="text-center">
          <Link to="/cliente/agencia/clientes" className={btn.ghost}>
            Ver clientes
          </Link>
        </div>
      </div>
    );
  }

  const isNorth = c.id === DEMO_CLIENT_ID;
  const convos = state.convos
    .filter((v) => v.clientId === c.id)
    .sort((a, b) => +new Date(b.messages.at(-1)?.at ?? 0) - +new Date(a.messages.at(-1)?.at ?? 0));
  const open = convos.filter((v) => v.status !== "resolvida");
  const events = state.agenda
    .filter((e) => e.clientId === c.id && new Date(e.at).getTime() > Date.now())
    .sort((a, b) => +new Date(a.at) - +new Date(b.at));
  const files = state.files
    .filter((f) => f.clientId === c.id)
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, 4);

  const approved = isNorth
    ? state.contents.filter((x) => APPROVED_STATUSES.includes(x.status)).length
    : c.planned - c.approvals - c.changes - Math.max(1, Math.round(c.planned / 4));
  const planned = isNorth ? state.contents.length : c.planned;
  const upcoming = state.contents
    .filter((x) => new Date(x.date).getTime() > Date.now())
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 5);
  const services = isNorth
    ? DEMO_CLIENT.services
    : c.services.map((s) => ({
        name: s,
        detail: s === "Social Media" ? `${c.planned} conteúdos por mês` : "Ativo",
      }));
  const since = fmt(`${c.since}-15T12:00:00`, "MMMM 'de' yyyy");

  const kpis = [
    { n: c.approvals, label: "Aguardando aprovação", tone: c.approvals ? "text-acid" : "" },
    { n: c.changes, label: "Ajustes solicitados", tone: c.changes ? "text-orange-300" : "" },
    { n: `${approved}/${planned}`, label: "Aprovados no ciclo", tone: "" },
    { n: open.length, label: "Conversas abertas", tone: "" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 md:px-8 md:py-10">
      <Link to="/cliente/agencia/clientes" className={btn.subtle}>
        <ArrowLeft className="h-3.5 w-3.5" /> Clientes
      </Link>

      <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            initials={c.initials}
            tone={isNorth ? "acid" : "bone"}
            className="h-14 w-14 text-base"
          />
          <div className="min-w-0">
            <h1 className="font-display text-3xl leading-tight font-medium md:text-[2.4rem]">
              {c.name}
            </h1>
            <p className="mt-1 text-sm text-bone/50">
              {c.segment} · cliente desde {since}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/cliente/agencia/inbox" className={btn.ghost}>
            <MessageSquare className="h-3.5 w-3.5" /> Conversas
          </Link>
          {isNorth && (
            <Link to="/cliente/inicio" className={btn.primary}>
              <Eye className="h-3.5 w-3.5" /> Ver como cliente
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-md border border-border p-4">
            <p className={cn("font-display text-3xl tabular-nums", k.tone)}>{k.n}</p>
            <p className="mt-1 text-xs text-bone/50">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <Panel
            title="Conteúdo"
            action={
              <span className="text-xs text-bone/40">
                Próxima entrega {relDay(c.nextDelivery).toLowerCase()}
              </span>
            }
          >
            {isNorth ? (
              <ul className="divide-y divide-border">
                {upcoming.map((x) => (
                  <li key={x.id}>
                    <ContentRow
                      c={x}
                      right={<StatusBadge status={x.status} className="hidden sm:inline-flex" />}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-5 py-5">
                <div className="flex h-2 gap-1 overflow-hidden rounded-full">
                  <span
                    className="rounded-full bg-acid"
                    style={{ flexGrow: Math.max(approved, 0) }}
                  />
                  <span
                    className="rounded-full bg-acid/40"
                    style={{ flexGrow: c.approvals || 0.001 }}
                  />
                  <span
                    className="rounded-full bg-orange-400"
                    style={{ flexGrow: c.changes || 0.001 }}
                  />
                  <span
                    className="rounded-full bg-bone/15"
                    style={{
                      flexGrow: Math.max(planned - approved - c.approvals - c.changes, 0.001),
                    }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-bone/55">
                  <span>
                    <b className="font-medium text-acid">{approved}</b> aprovados
                  </span>
                  <span>
                    <b className="font-medium text-bone">{c.approvals}</b> aguardando
                  </span>
                  <span>
                    <b className="font-medium text-orange-300">{c.changes}</b> em ajuste
                  </span>
                  <span>
                    <b className="font-medium text-bone">{c.published}</b> publicados
                  </span>
                </div>
                <p className="mt-4 border-t border-border pt-3 text-sm">
                  <span className="text-bone/45">Próxima entrega · </span>
                  {c.nextDeliveryLabel}
                  <span className="text-bone/45"> · {fmt(c.nextDelivery, "dd/MM")}</span>
                </p>
              </div>
            )}
          </Panel>

          <Panel
            title="Conversas"
            action={<span className="text-xs text-bone/40">{convos.length}</span>}
          >
            {!convos.length ? (
              <p className="px-5 py-6 text-sm text-bone/45">Nenhuma conversa recente.</p>
            ) : (
              <ul className="divide-y divide-border">
                {convos.map((v) => {
                  const last = v.messages.at(-1);
                  return (
                    <li key={v.id}>
                      <Link
                        to="/cliente/agencia/inbox"
                        className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-bone/[0.03]"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm">{v.subject}</span>
                            <ConvoBadge status={v.status} />
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-bone/45">
                            {v.contact}:{" "}
                            {last?.text ||
                              (last?.attachment ? `Anexo: ${last.attachment.name}` : "")}
                          </span>
                        </span>
                        {last && (
                          <span className="shrink-0 text-xs text-bone/35">{relDay(last.at)}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel
            title="Agenda"
            action={
              <Link to="/cliente/agencia/agenda" className={btn.subtle}>
                Abrir agenda
              </Link>
            }
          >
            {!events.length ? (
              <p className="px-5 py-6 text-sm text-bone/45">Nada marcado nas próximas semanas.</p>
            ) : (
              <ul className="divide-y divide-border">
                {events.map((e) => (
                  <li key={e.id} className="flex items-center gap-4 px-5 py-3.5">
                    <span className="w-10 shrink-0 text-center">
                      <span className="block text-[0.58rem] tracking-[0.16em] text-bone/45 uppercase">
                        {fmt(e.at, "MMM")}
                      </span>
                      <span className="block font-display text-xl leading-none">
                        {fmt(e.at, "d")}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{e.title}</span>
                      <span className="block truncate text-xs text-bone/45">
                        {fmt(e.at, "HH:mm")} · {e.place}
                      </span>
                    </span>
                    <TeamAvatar id={e.owner} className="h-6 w-6 text-[0.55rem]" />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Conta">
            <dl className="space-y-3 px-5 py-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-bone/45">Contato</dt>
                <dd className="text-right">{c.contact}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-bone/45">Responsável</dt>
                <dd className="flex items-center gap-2">
                  <TeamAvatar id={c.owner} className="h-6 w-6 text-[0.55rem]" />
                  {TEAM[c.owner].name}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-bone/45">Plano</dt>
                <dd className="text-right">{c.plan}</dd>
              </div>
            </dl>
            <ul className="space-y-2 border-t border-border px-5 py-4">
              {services.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-acid" /> {s.name}
                  </span>
                  <span className="text-xs text-bone/45">{s.detail}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <div
            className={cn(
              "rounded-md border p-5",
              c.plan === "Essencial + Automação"
                ? "border-acid/25 bg-acid/[0.04]"
                : "border-border",
            )}
          >
            <div className="flex items-center gap-3">
              <AiMark
                className={cn(c.plan !== "Essencial + Automação" && "opacity-40 grayscale")}
              />
              <div>
                <p className="text-sm font-medium">IA Betterfly</p>
                <p className="text-xs text-bone/50">
                  {c.plan === "Essencial + Automação"
                    ? "Atende este cliente no chat do portal"
                    : "Não incluída no plano atual"}
                </p>
              </div>
            </div>
            {c.plan === "Essencial + Automação" ? (
              <Link to="/cliente/agencia/automacao" className={cn(btn.subtle, "mt-4")}>
                Regras de transferência <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <p className="mt-4 flex items-center gap-1.5 text-xs text-bone/45">
                <Sparkles className="h-3 w-3 text-acid" /> Oportunidade: upgrade para Essencial +
                Automação
              </p>
            )}
          </div>

          <Panel
            title="Arquivos recentes"
            action={
              <Link to="/cliente/agencia/arquivos" className={btn.subtle}>
                Ver todos
              </Link>
            }
          >
            {!files.length ? (
              <p className="px-5 py-6 text-sm text-bone/45">Nenhum arquivo ainda.</p>
            ) : (
              <ul className="divide-y divide-border">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-surface text-acid">
                      {f.src && f.kind !== "file" ? (
                        <img src={f.src} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <FileIcon kind={f.kind} className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{f.name}</span>
                      <span className="block truncate text-xs text-bone/40">
                        {FOLDERS.find((x) => x.id === f.folder)?.label} · {formatSize(f.size)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
