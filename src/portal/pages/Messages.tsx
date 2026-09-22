import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Composer, Thread } from "../chat";
import { TEAM } from "../data";
import { useDemo } from "../store";
import { AiMark, TeamAvatar } from "../ui";

const SUGGESTIONS = [
  "Tenho algo para aprovar?",
  "Quando é minha próxima captação?",
  "Como está meu calendário?",
  "Quero conversar sobre mudar a estratégia do próximo mês.",
  "Quero falar com a equipe.",
];

export function Messages() {
  const { state, sendClientMessage, answerHandoff } = useDemo();
  const convo = state.convos.find((c) => c.id === "cv-north")!;
  const agent = convo.agent ? TEAM[convo.agent] : null;
  const busy = !!convo.typing;

  return (
    <div className="flex h-full flex-col">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={convo.status === "humano" ? "h" : "ai"}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
            >
              {convo.status === "humano" && convo.agent ? (
                <TeamAvatar id={convo.agent} className="h-10 w-10" />
              ) : (
                <AiMark className="h-10 w-10" />
              )}
            </motion.span>
          </AnimatePresence>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-medium tracking-wide uppercase">
              {convo.status === "humano" && agent ? agent.name : "Betterfly Assist"}
            </p>
            <StatusLine status={convo.status} agent={agent?.first} />
          </div>
        </div>
        <p className="hidden max-w-xs text-right text-xs text-bone/40 lg:block">
          Pode perguntar sobre seus conteúdos, agenda, entregas ou falar com nossa equipe.
        </p>
      </div>

      {/* Conversa */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          <Thread
            convo={convo}
            perspective="client"
            contactInitials="LA"
            onHandoff={(mid, ok) => answerHandoff(convo.id, mid, ok)}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <Composer
          onSend={(t) => sendClientMessage(convo.id, t)}
          disabled={busy}
          placeholder={
            convo.status === "humano"
              ? `Responder para ${agent?.first ?? "a equipe"}…`
              : "Pergunte algo ou peça para falar com a equipe…"
          }
          before={
            <>
              {convo.status === "aguardando" && (
                <div className="mb-3 flex items-start gap-3 rounded-lg border border-orange-400/25 bg-orange-400/[0.05] p-3 text-xs text-bone/70">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
                  <span className="flex-1">
                    {TEAM.marina.first} já recebeu esta conversa com todo o histórico. Você não
                    precisa repetir nada.
                    <Link
                      to="/cliente/agencia/inbox"
                      className="mt-1.5 flex items-center gap-1 text-acid hover:underline"
                    >
                      Na demonstração: ver como a equipe recebe <ArrowRight className="h-3 w-3" />
                    </Link>
                  </span>
                </div>
              )}
              {convo.status === "ia" && (
                <div className="-mx-3 mb-3 flex gap-2 overflow-x-auto px-3 pb-0.5 md:mx-0 md:flex-wrap md:px-0">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={busy}
                      onClick={() => sendClientMessage(convo.id, s)}
                      className="shrink-0 rounded-full border border-border px-3.5 py-1.5 text-xs text-bone/70 transition-colors hover:border-acid/50 hover:text-acid disabled:opacity-40"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </>
          }
        />
      </div>
    </div>
  );
}

function StatusLine({ status, agent }: { status: string; agent?: string | undefined }) {
  const map: Record<string, { text: string; dot: string }> = {
    ia: { text: "IA online", dot: "bg-acid signal-dot" },
    aguardando: { text: "Aguardando equipe", dot: "bg-orange-400 signal-dot" },
    humano: { text: `${agent ?? "Equipe"} está atendendo você · Equipe Betterfly`, dot: "bg-bone" },
    resolvida: { text: "Conversa encerrada", dot: "bg-bone/40" },
  };
  const s = map[status] ?? map["ia"]!;
  return (
    <motion.p
      key={status}
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("mt-0.5 flex items-center gap-1.5 text-xs text-bone/55")}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.text}
    </motion.p>
  );
}
