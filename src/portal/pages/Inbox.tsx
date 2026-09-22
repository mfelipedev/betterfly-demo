import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Bot, Camera, CheckCircle2, Info, Sparkles, UserCheck, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Composer, Thread } from "../chat";
import { DEMO_CLIENT, DEMO_CLIENT_ID, TEAM, type Convo, type ConvoStatus } from "../data";
import { fmt, nextMonthName } from "../format";
import { useDemo, useStats } from "../store";
import { AiMark, Avatar, ConvoBadge, EmptyState, TeamAvatar, Thumb, btn } from "../ui";

type Filter = "todas" | ConvoStatus;
const FILTERS: [Filter, string][] = [
  ["todas", "Todas"],
  ["ia", "IA atendendo"],
  ["aguardando", "Aguardando humano"],
  ["humano", "Em atendimento"],
  ["resolvida", "Resolvidas"],
];

const ME = "marina" as const;

export function Inbox() {
  const { state, markRead } = useDemo();
  const [filter, setFilter] = useState<Filter>("todas");
  const [selected, setSelected] = useState<string | null>(null);
  const [pane, setPane] = useState<"list" | "chat" | "context">("list");
  const [contextOpen, setContextOpen] = useState(true);

  const sorted = useMemo(() => {
    const rank = (c: Convo) =>
      c.status === "aguardando" ? (c.urgent ? 0 : 1) : c.status === "resolvida" ? 3 : 2;
    return [...state.convos].sort(
      (a, b) =>
        rank(a) - rank(b) || +new Date(b.messages.at(-1)!.at) - +new Date(a.messages.at(-1)!.at),
    );
  }, [state.convos]);

  const list = sorted.filter((c) =>
    filter === "todas" ? c.status !== "resolvida" : c.status === filter,
  );

  // Seleção inicial: a conversa da North se estiver aguardando (fluxo da demo), senão a primeira.
  useEffect(() => {
    if (selected) return;
    const north = state.convos.find((c) => c.id === "cv-north");
    setSelected(north && north.status !== "ia" ? north.id : (sorted[0]?.id ?? null));
  }, [selected, sorted, state.convos]);

  const convo = state.convos.find((c) => c.id === selected) ?? null;

  const open = (id: string) => {
    setSelected(id);
    setPane("chat");
    markRead(id);
  };

  return (
    <div className="flex h-full min-h-0">
      {/* Coluna 1: lista */}
      <aside
        className={cn(
          "w-full shrink-0 flex-col border-r border-border md:flex md:w-[300px] xl:w-[340px]",
          pane === "list" ? "flex" : "hidden",
        )}
      >
        <div className="border-b border-border px-4 pt-5 pb-3">
          <div className="flex items-baseline justify-between">
            <h1 className="font-display text-2xl font-medium">Inbox</h1>
            <span className="text-xs text-bone/40">
              {state.convos.filter((c) => c.status !== "resolvida").length} abertas
            </span>
          </div>
          <div className="-mx-4 mt-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
            {FILTERS.map(([k, label]) => {
              const n =
                k === "todas"
                  ? state.convos.filter((c) => c.status !== "resolvida").length
                  : state.convos.filter((c) => c.status === k).length;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] transition-colors",
                    filter === k
                      ? "border-acid bg-acid/10 text-acid"
                      : "border-border text-bone/55 hover:text-bone",
                  )}
                >
                  {label}
                  <span className="tabular-nums opacity-60">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto">
          <AnimatePresence initial={false}>
            {list.map((c) => (
              <motion.li
                key={c.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ConvoItem c={c} active={c.id === selected} onClick={() => open(c.id)} />
              </motion.li>
            ))}
          </AnimatePresence>
          {list.length === 0 && (
            <EmptyState
              title="Nenhuma conversa aqui"
              text="Conversas com este status aparecem nesta lista."
            />
          )}
        </ul>
      </aside>

      {/* Coluna 2: conversa */}
      <section
        className={cn("min-w-0 flex-1 flex-col md:flex", pane === "chat" ? "flex" : "hidden")}
      >
        {convo ? (
          <ConversationPane
            convo={convo}
            onBack={() => setPane("list")}
            onContext={() => {
              setContextOpen(true);
              setPane("context");
            }}
            contextOpen={contextOpen}
            toggleContext={() => setContextOpen((o) => !o)}
          />
        ) : (
          <EmptyState title="Selecione uma conversa" />
        )}
      </section>

      {/* Coluna 3: contexto */}
      {convo && (
        <aside
          className={cn(
            "w-full shrink-0 flex-col overflow-y-auto border-l border-border bg-[oklch(0.125_0_0)] md:w-[320px] xl:w-[360px]",
            pane === "context" ? "flex" : "hidden",
            contextOpen ? "lg:flex" : "lg:hidden",
          )}
        >
          <ContextPane
            convo={convo}
            onBack={() => setPane("chat")}
            onClose={() => setContextOpen(false)}
          />
        </aside>
      )}
    </div>
  );
}

function ConvoItem({ c, active, onClick }: { c: Convo; active: boolean; onClick: () => void }) {
  const { state } = useDemo();
  const client = state.clients.find((cl) => cl.id === c.clientId)!;
  const last = c.messages.at(-1)!;
  const prefix =
    last.from === "ai" ? "IA: " : last.from === "agent" ? `${TEAM[last.agent!].first}: ` : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex w-full gap-3 border-b border-border px-4 py-3.5 text-left transition-colors",
        active ? "bg-bone/[0.06]" : "hover:bg-bone/[0.03]",
      )}
    >
      {active && <span className="absolute inset-y-0 left-0 w-[2px] bg-acid" />}
      <Avatar
        initials={client.initials}
        tone={client.id === DEMO_CLIENT_ID ? "acid" : "bone"}
        className="h-9 w-9"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-sm",
              c.unread ? "font-semibold text-bone" : "text-bone/85",
            )}
          >
            {client.name}
          </span>
          <span className="shrink-0 text-[0.65rem] text-bone/40">{fmt(last.at, "HH:mm")}</span>
        </span>
        <span className="mt-0.5 block truncate text-xs text-bone/50">
          {prefix}
          {last.text || (last.attachment ? `Anexo: ${last.attachment.name}` : "")}
        </span>
        <span className="mt-2 flex items-center gap-1.5">
          <ConvoBadge status={c.status} />
          {c.urgent && c.status !== "resolvida" && (
            <span className="rounded-full bg-orange-500/90 px-2 py-0.5 text-[0.55rem] font-semibold tracking-[0.14em] text-ink uppercase">
              Urgente
            </span>
          )}
          {c.status === "humano" && c.agent && (
            <span className="text-[0.65rem] text-bone/40">{TEAM[c.agent].first}</span>
          )}
          {c.unread && <span className="ml-auto h-2 w-2 rounded-full bg-acid" />}
        </span>
      </span>
    </button>
  );
}

function ConversationPane({
  convo,
  onBack,
  onContext,
  contextOpen,
  toggleContext,
}: {
  convo: Convo;
  onBack: () => void;
  onContext: () => void;
  contextOpen: boolean;
  toggleContext: () => void;
}) {
  const { state, assume, returnToAI, sendAgentMessage } = useDemo();
  const client = state.clients.find((cl) => cl.id === convo.clientId)!;
  const [prefill, setPrefill] = useState<string>();
  useEffect(() => setPrefill(undefined), [convo.id]);

  const suggestion =
    convo.id === "cv-north"
      ? `Oi, Lucas! Vi o contexto da conversa. Podemos revisar a estratégia de ${nextMonthName()} juntos. Tenho horário amanhã às 15h ou quinta às 10h, qual fica melhor?`
      : `Oi, ${convo.contact.split(" ")[0]}! Já estou com o contexto aqui e vou cuidar disso pessoalmente.`;

  const statusLabel =
    convo.status === "ia"
      ? "IA atendendo"
      : convo.status === "aguardando"
        ? "Aguardando equipe"
        : convo.status === "humano"
          ? `${TEAM[convo.agent!].first} atendendo`
          : "Resolvida";

  return (
    <>
      <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={onBack}
          className="-ml-1 p-1 text-bone/60 md:hidden"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{client.name}</p>
          <motion.p
            key={statusLabel}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-0.5 flex items-center gap-1.5 text-[0.68rem] tracking-[0.14em] whitespace-nowrap uppercase"
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                convo.status === "ia"
                  ? "signal-dot bg-acid"
                  : convo.status === "aguardando"
                    ? "signal-dot bg-orange-400"
                    : convo.status === "humano"
                      ? "bg-bone"
                      : "bg-bone/30",
              )}
            />
            <span
              className={cn(
                convo.status === "ia"
                  ? "text-acid"
                  : convo.status === "aguardando"
                    ? "text-orange-300"
                    : "text-bone/70",
              )}
            >
              {statusLabel}
            </span>
            <span className="hidden truncate text-bone/30 normal-case tracking-normal 2xl:inline">
              · {convo.subject}
            </span>
          </motion.p>
        </div>
        <div className="flex items-center gap-2">
          {(convo.status === "ia" || convo.status === "aguardando") && (
            <button
              type="button"
              onClick={() => {
                assume(convo.id, ME);
                setPrefill(suggestion);
                toast.success("Você assumiu a conversa", {
                  description: `A IA pausou e ${client.name} já vê que ${TEAM[ME].first} está atendendo.`,
                });
              }}
              className={cn(btn.primary, "px-3.5 md:px-5")}
            >
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Assumir conversa</span>
              <span className="sm:hidden">Assumir</span>
            </button>
          )}
          {convo.status === "humano" && (
            <button
              type="button"
              onClick={() => {
                returnToAI(convo.id);
                toast("Conversa devolvida para a IA");
              }}
              className={cn(btn.ghost, "px-3.5")}
            >
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Devolver para IA</span>
            </button>
          )}
          <button
            type="button"
            onClick={onContext}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-bone/60 lg:hidden"
            aria-label="Contexto do cliente"
          >
            <Info className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={toggleContext}
            className={cn(
              "hidden h-9 w-9 items-center justify-center rounded-full border text-bone/60 lg:flex",
              contextOpen ? "border-acid/40 text-acid" : "border-border",
            )}
            aria-label="Mostrar contexto"
            title="Contexto do cliente"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          <Thread convo={convo} perspective="agency" contactInitials={client.initials} />
        </div>
      </div>

      {convo.status === "humano" ? (
        <Composer
          prefill={prefill}
          placeholder={`Responder ${convo.contact.split(" ")[0]}…`}
          onSend={(t, a) => {
            sendAgentMessage(convo.id, t, convo.agent ?? ME, a);
            setPrefill(undefined);
          }}
          before={
            !convo.messages.some((m) => m.from === "agent") && (
              <button
                type="button"
                onClick={() => setPrefill(suggestion + " ")}
                className="mb-3 flex w-full items-start gap-2 rounded-lg border border-acid/25 bg-acid/[0.04] p-3 text-left text-xs text-bone/70 transition-colors hover:border-acid/50"
              >
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-acid" />
                <span>
                  <span className="text-acid">Sugestão de resposta · </span>
                  {suggestion}
                </span>
              </button>
            )
          }
        />
      ) : convo.status === "resolvida" ? (
        <div className="flex items-center justify-center gap-2 border-t border-border px-6 py-4 text-xs text-bone/45">
          <CheckCircle2 className="h-4 w-4 text-acid" /> Conversa resolvida pela IA, sem necessidade
          de atendimento humano.
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-4 text-center sm:flex-row sm:text-left md:px-6">
          <p className="flex items-center gap-2 text-xs text-bone/55">
            <AiMark className="h-5 w-5" />
            {convo.status === "ia"
              ? "A IA está conduzindo esta conversa. Assuma para responder."
              : "O cliente aguarda a equipe. Assuma para responder com todo o contexto."}
          </p>
        </div>
      )}
    </>
  );
}

function ContextPane({
  convo,
  onBack,
  onClose,
}: {
  convo: Convo;
  onBack: () => void;
  onClose: () => void;
}) {
  const { state } = useDemo();
  const stats = useStats();
  const client = stats.clients.find((cl) => cl.id === convo.clientId)!;
  const isNorth = convo.clientId === DEMO_CLIENT_ID;
  const captacao = state.agenda.find((e) => e.kind === "captacao")!;

  const lastChange = isNorth
    ? [...state.contents]
        .flatMap((c) => c.history.filter((h) => h.kind === "change").map((h) => ({ c, h })))
        .sort((a, b) => +new Date(b.h.at) - +new Date(a.h.at))[0]
    : null;

  const related = isNorth ? [...stats.pending, ...stats.changes].slice(0, 4) : [];
  const services = isNorth ? DEMO_CLIENT.services.map((s) => s.name) : client.services;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-bone/60 md:hidden"
        >
          <ArrowLeft className="h-4 w-4" /> Conversa
        </button>
        <p className="label-xs hidden md:block">Contexto do cliente</p>
        <button
          type="button"
          onClick={onClose}
          className="hidden p-1 text-bone/40 hover:text-bone lg:block"
          aria-label="Fechar contexto"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 px-5 pt-5">
        <Avatar initials={client.initials} tone={isNorth ? "acid" : "bone"} className="h-11 w-11" />
        <div className="min-w-0">
          <p className="truncate font-display text-lg">{client.name}</p>
          <p className="truncate text-xs text-bone/45">
            {convo.contact} · {client.plan}
          </p>
        </div>
      </div>

      {/* Resumo da IA */}
      {convo.summary && (
        <motion.div
          key={convo.summary}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 mt-5 rounded-lg border border-acid/25 bg-acid/[0.05] p-4"
        >
          <p className="flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.2em] text-acid uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Resumo da IA
          </p>
          <p className="mt-2 text-sm leading-relaxed text-bone/85">{convo.summary}</p>
        </motion.div>
      )}

      <dl className="mt-5 divide-y divide-border border-y border-border">
        <Row k="Responsável">
          <span className="flex items-center gap-2">
            <TeamAvatar id={client.owner} className="h-6 w-6 text-[0.55rem]" />{" "}
            {TEAM[client.owner].name}
          </span>
        </Row>
        <Row k="Serviços">
          <span className="flex flex-wrap gap-1.5">
            {services.map((s) => (
              <span
                key={s}
                className="rounded-sm bg-bone/[0.07] px-1.5 py-0.5 text-[0.7rem] text-bone/75"
              >
                {s}
              </span>
            ))}
          </span>
        </Row>
        {isNorth && (
          <Row k="Próxima captação">
            <span className="flex items-center gap-2">
              <Camera className="h-3.5 w-3.5 text-acid" /> {fmt(captacao.at, "dd/MM")} ·{" "}
              {fmt(captacao.at, "HH:mm")}
            </span>
          </Row>
        )}
        <Row k="Aprovações pendentes">
          <span
            className={cn("font-display text-lg tabular-nums", client.approvals > 0 && "text-acid")}
          >
            {String(client.approvals).padStart(2, "0")}
          </span>
        </Row>
        {lastChange && (
          <Row k="Última solicitação">
            <Link
              to="/cliente/conteudo/$id"
              params={{ id: lastChange.c.id }}
              className="hover:text-acid"
            >
              Alteração em “{lastChange.c.title}”
            </Link>
          </Row>
        )}
      </dl>

      {related.length > 0 && (
        <div className="px-5 py-5">
          <p className="label-xs mb-3">Conteúdos relacionados</p>
          <div className="space-y-2">
            {related.map((c) => (
              <Link
                key={c.id}
                to="/cliente/conteudo/$id"
                params={{ id: c.id }}
                className="flex items-center gap-3 rounded-md border border-border p-2 transition-colors hover:border-acid/40"
              >
                <Thumb thumb={c.thumb} className="h-11 w-8 shrink-0 rounded-[2px]" />
                <span className="min-w-0">
                  <span className="block truncate text-xs">{c.title}</span>
                  <span
                    className={cn(
                      "text-[0.65rem]",
                      c.status === "aguardando" ? "text-acid" : "text-orange-300",
                    )}
                  >
                    {c.status === "aguardando" ? "Aguardando aprovação" : "Ajuste solicitado"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <dt className="label-xs shrink-0 pt-0.5">{k}</dt>
      <dd className="text-right text-sm text-bone/85">{children}</dd>
    </div>
  );
}
