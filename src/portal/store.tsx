/*
 * Estado único da demo, compartilhado entre as visões Cliente e Betterfly.
 * Persistido no navegador para sobreviver a recarregamentos; "Reiniciar demo" volta ao início.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { botReply, buildSummary } from "./bot";
import {
  APPROVED_STATUSES,
  DEMO_CLIENT,
  DEMO_CLIENT_ID,
  TEAM,
  buildSeed,
  todayKey,
  type Activity,
  type Attachment,
  type Content,
  type Convo,
  type Message,
  type Seed,
  type TeamId,
} from "./data";
import { fmt } from "./format";

const STORAGE_KEY = "betterfly-demo-v1";

type Action =
  | { type: "replace"; state: Seed }
  | { type: "content"; id: string; patch: (c: Content) => Content }
  | { type: "convo"; id: string; patch: (c: Convo) => Convo }
  | { type: "activity"; item: Activity };

function reducer(state: Seed, action: Action): Seed {
  switch (action.type) {
    case "replace":
      return action.state;
    case "content":
      return {
        ...state,
        contents: state.contents.map((c) => (c.id === action.id ? action.patch(c) : c)),
      };
    case "convo":
      return {
        ...state,
        convos: state.convos.map((c) => (c.id === action.id ? action.patch(c) : c)),
      };
    case "activity":
      return { ...state, activity: [action.item, ...state.activity] };
  }
}

let uid = 0;
const newId = (p: string) => `${p}-${Date.now().toString(36)}-${++uid}`;
const nowIso = () => new Date().toISOString();

function loadInitial(): Seed {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Seed;
      if (parsed.seedDay === todayKey()) {
        // Nunca restaurar indicador de digitação pendente
        parsed.convos = parsed.convos.map((c) => ({ ...c, typing: null }));
        return parsed;
      }
    }
  } catch {
    /* armazenamento indisponível: segue com dados novos */
  }
  return buildSeed();
}

interface DemoApi {
  state: Seed;
  approve: (id: string) => void;
  requestChange: (id: string, text: string) => void;
  comment: (id: string, text: string, role: "client" | "agency") => void;
  sendClientMessage: (convoId: string, text: string, attachment?: Attachment) => void;
  answerHandoff: (convoId: string, messageId: string, accept: boolean) => void;
  assume: (convoId: string, agent: TeamId) => void;
  returnToAI: (convoId: string) => void;
  sendAgentMessage: (convoId: string, text: string, agent: TeamId, attachment?: Attachment) => void;
  markRead: (convoId: string) => void;
  reset: () => void;
}

const DemoContext = createContext<DemoApi | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);
  const stateRef = useRef(state);
  stateRef.current = state;
  const timers = useRef<number[]>([]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignorar */
    }
  }, [state]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const pushMessages = useCallback((convoId: string, msgs: Omit<Message, "id" | "at">[]) => {
    dispatch({
      type: "convo",
      id: convoId,
      patch: (c) => ({
        ...c,
        messages: [...c.messages, ...msgs.map((m) => ({ ...m, id: newId("m"), at: nowIso() }))],
      }),
    });
  }, []);

  const setConvo = useCallback((convoId: string, patch: Partial<Convo>) => {
    dispatch({ type: "convo", id: convoId, patch: (c) => ({ ...c, ...patch }) });
  }, []);

  const approve = useCallback((id: string) => {
    const at = nowIso();
    dispatch({
      type: "content",
      id,
      patch: (c) => ({
        ...c,
        status: "aprovado",
        approvedAt: at,
        history: [
          ...c.history,
          {
            id: newId("h"),
            at,
            text: `${DEMO_CLIENT.contactFirst} aprovou o conteúdo`,
            kind: "approved",
          },
        ],
      }),
    });
    const title = stateRef.current.contents.find((c) => c.id === id)?.title;
    dispatch({
      type: "activity",
      item: {
        id: newId("a"),
        at,
        text: `Você aprovou “${title}”`,
        kind: "approved",
        contentId: id,
      },
    });
  }, []);

  const requestChange = useCallback((id: string, text: string) => {
    const at = nowIso();
    dispatch({
      type: "content",
      id,
      patch: (c) => ({
        ...c,
        status: "ajuste",
        history: [
          ...c.history,
          {
            id: newId("h"),
            at,
            text: `${DEMO_CLIENT.contactFirst} solicitou alteração`,
            kind: "change",
          },
        ],
        comments: [
          ...c.comments,
          { id: newId("cm"), author: DEMO_CLIENT.contact, role: "client", text, at },
        ],
      }),
    });
    const title = stateRef.current.contents.find((c) => c.id === id)?.title;
    dispatch({
      type: "activity",
      item: {
        id: newId("a"),
        at,
        text: `Você solicitou alteração em “${title}”`,
        kind: "change",
        contentId: id,
      },
    });
  }, []);

  const comment = useCallback((id: string, text: string, role: "client" | "agency") => {
    dispatch({
      type: "content",
      id,
      patch: (c) => ({
        ...c,
        comments: [
          ...c.comments,
          {
            id: newId("cm"),
            author: role === "client" ? DEMO_CLIENT.contact : TEAM[c.owner].name,
            role,
            text,
            at: nowIso(),
          },
        ],
      }),
    });
  }, []);

  const sendClientMessage = useCallback(
    (convoId: string, text: string, attachment?: Attachment) => {
      pushMessages(convoId, [{ from: "client", text, attachment }]);
      const convo = stateRef.current.convos.find((c) => c.id === convoId);
      if (!convo) return;

      // Anexo com a IA atendendo: confirma o recebimento (e responde o texto, se houver).
      if (attachment && convo.status === "ia") {
        setConvo(convoId, { typing: "ai" });
        later(900, () => {
          pushMessages(convoId, [
            {
              from: "ai",
              text: `Recebi “${attachment.name}”. O arquivo fica salvo em Arquivos › Enviados por você, e a equipe Betterfly já tem acesso a ele.`,
            },
          ]);
          if (!text) setConvo(convoId, { typing: null });
        });
        if (!text) return;
      }

      // Com a equipe envolvida, a IA não responde por cima do humano.
      if (convo.status === "humano") {
        setConvo(convoId, { unread: true });
        return;
      }
      if (convo.status === "aguardando") {
        setConvo(convoId, { unread: true });
        later(900, () =>
          pushMessages(convoId, [
            {
              from: "ai",
              text: "Adicionei sua mensagem à conversa. A equipe já está com todo o contexto e responde em instantes.",
            },
          ]),
        );
        return;
      }

      const reply = botReply(text, stateRef.current, convo);
      setConvo(convoId, { typing: "ai" });
      reply.messages.forEach((m, i) => {
        later(900 + i * 1100 + (attachment ? 1100 : 0), () => {
          pushMessages(convoId, [{ from: "ai", ...m }]);
          if (i === reply.messages.length - 1) {
            dispatch({
              type: "convo",
              id: convoId,
              patch: (c) => ({
                ...c,
                typing: null,
                pendingOffer: reply.pendingOffer ?? false,
                topics: Array.from(new Set([...c.topics, ...reply.topics])),
              }),
            });
          }
        });
      });
    },
    [later, pushMessages, setConvo],
  );

  const answerHandoff = useCallback(
    (convoId: string, messageId: string, accept: boolean) => {
      dispatch({
        type: "convo",
        id: convoId,
        patch: (c) => ({
          ...c,
          pendingOffer: false,
          messages: c.messages.map((m) => (m.id === messageId ? { ...m, actionsDone: true } : m)),
        }),
      });
      if (!accept) {
        pushMessages(convoId, [{ from: "client", text: "Vou continuar com a IA." }]);
        setConvo(convoId, { typing: "ai" });
        later(900, () => {
          pushMessages(convoId, [
            {
              from: "ai",
              text: "Combinado! Sigo por aqui. Posso ajudar com conteúdos, agenda ou entregas.",
            },
          ]);
          setConvo(convoId, { typing: null });
        });
        return;
      }
      pushMessages(convoId, [{ from: "client", text: "Sim, quero falar com a equipe." }]);
      setConvo(convoId, { typing: "system" });
      later(1600, () => {
        const convo = stateRef.current.convos.find((c) => c.id === convoId)!;
        const owner = TEAM[DEMO_CLIENT.owner];
        pushMessages(convoId, [
          {
            from: "system",
            text: `Conversa encaminhada para a equipe Betterfly. ${owner.name} foi notificada com o histórico e um resumo do assunto.`,
          },
        ]);
        setConvo(convoId, {
          typing: null,
          status: "aguardando",
          unread: true,
          subject: convo.topics.includes("estrategia")
            ? "Estratégia do próximo mês"
            : "Atendimento com a equipe",
          summary: buildSummary(convo, stateRef.current),
        });
      });
    },
    [later, pushMessages, setConvo],
  );

  const assume = useCallback(
    (convoId: string, agent: TeamId) => {
      pushMessages(convoId, [
        {
          from: "system",
          text: `${TEAM[agent].first} assumiu o atendimento às ${fmt(new Date(), "HH:mm")}.`,
        },
      ]);
      setConvo(convoId, { status: "humano", agent, unread: false });
    },
    [pushMessages, setConvo],
  );

  const returnToAI = useCallback(
    (convoId: string) => {
      pushMessages(convoId, [{ from: "system", text: "Conversa devolvida para a IA Betterfly." }]);
      setConvo(convoId, { status: "ia", agent: undefined });
    },
    [pushMessages, setConvo],
  );

  const sendAgentMessage = useCallback(
    (convoId: string, text: string, agent: TeamId, attachment?: Attachment) => {
      pushMessages(convoId, [{ from: "agent", agent, text, attachment }]);
      if (convoId === "cv-north") {
        dispatch({
          type: "activity",
          item: {
            id: newId("a"),
            at: nowIso(),
            text: `${TEAM[agent].first} respondeu sua mensagem`,
            kind: "message",
          },
        });
      }
    },
    [pushMessages],
  );

  const markRead = useCallback(
    (convoId: string) => setConvo(convoId, { unread: false }),
    [setConvo],
  );

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    dispatch({ type: "replace", state: buildSeed() });
  }, []);

  const api = useMemo<DemoApi>(
    () => ({
      state,
      approve,
      requestChange,
      comment,
      sendClientMessage,
      answerHandoff,
      assume,
      returnToAI,
      sendAgentMessage,
      markRead,
      reset,
    }),
    [
      state,
      approve,
      requestChange,
      comment,
      sendClientMessage,
      answerHandoff,
      assume,
      returnToAI,
      sendAgentMessage,
      markRead,
      reset,
    ],
  );

  return <DemoContext.Provider value={api}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo precisa estar dentro de DemoProvider");
  return ctx;
}

/** Números derivados: garantem que todas as telas mostrem os mesmos valores. */
export function useStats() {
  const { state } = useDemo();
  return useMemo(() => {
    const cs = state.contents;
    const pending = cs.filter((c) => c.status === "aguardando");
    const changes = cs.filter((c) => c.status === "ajuste");
    const approved = cs.filter((c) => APPROVED_STATUSES.includes(c.status));
    const production = cs.filter((c) => c.status === "producao" || c.status === "ideia");

    const clients = state.clients.map((c) =>
      c.id === DEMO_CLIENT_ID ? { ...c, approvals: pending.length, changes: changes.length } : c,
    );
    const open = state.convos.filter((c) => c.status !== "resolvida");
    return {
      pending,
      changes,
      approved,
      production,
      clients,
      agency: {
        clients: clients.length,
        approvals: clients.reduce((s, c) => s + c.approvals, 0),
        changes: clients.reduce((s, c) => s + c.changes, 0),
        open: open.length,
        aiOpen: open.filter((c) => c.status === "ia").length,
        waiting: open.filter((c) => c.status === "aguardando").length,
        human: open.filter((c) => c.status === "humano").length,
        aiResolvedToday: 12,
      },
    };
  }, [state]);
}
