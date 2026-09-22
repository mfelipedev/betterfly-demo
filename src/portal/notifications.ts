/*
 * Notificações derivadas do estado da demo (nada é armazenado à parte):
 * o sino do topo e a central de notificações leem a mesma lista.
 */
import { useMemo } from "react";
import { DEMO_CLIENT_ID, TEAM, type Seed } from "./data";
import { useDemo } from "./store";

export type NotifKind = "aprovacao" | "versao" | "mensagem" | "agenda" | "arquivo" | "sistema";

export interface Notif {
  id: string;
  kind: NotifKind;
  text: string;
  meta?: string;
  at: string;
  to: string;
  urgent?: boolean;
}

export const NOTIF_LABEL: Record<NotifKind, string> = {
  aprovacao: "Aprovações",
  versao: "Versões",
  mensagem: "Mensagens",
  agenda: "Agenda",
  arquivo: "Arquivos",
  sistema: "Sistema",
};

const DAY = 86_400_000;

function clientNotifs(s: Seed): Notif[] {
  const out: Notif[] = [];
  const now = Date.now();

  for (const a of s.activity) {
    out.push({
      id: a.id,
      kind:
        a.kind === "sent" || a.kind === "approved"
          ? "aprovacao"
          : a.kind === "change"
            ? "versao"
            : a.kind === "message"
              ? "mensagem"
              : a.kind === "calendar"
                ? "agenda"
                : a.text.includes("Arquivos") || a.text.includes("disponíve")
                  ? "arquivo"
                  : "sistema",
      text: a.text,
      at: a.at,
      to: a.contentId
        ? `/cliente/conteudo/${a.contentId}`
        : a.kind === "message"
          ? "/cliente/mensagens"
          : a.kind === "calendar"
            ? "/cliente/agenda"
            : "/cliente/arquivos",
    });
  }

  // Lembretes de eventos nos próximos 3 dias
  for (const e of s.agenda) {
    const t = new Date(e.at).getTime();
    if (e.clientId !== DEMO_CLIENT_ID || t < now || t - now > 3 * DAY) continue;
    out.push({
      id: `ev-${e.id}`,
      kind: "agenda",
      text: `Lembrete: ${e.title}`,
      meta: `${e.place} · com ${TEAM[e.owner].first}`,
      at: new Date(now - 45 * 60_000).toISOString(),
      to: "/cliente/agenda",
    });
  }

  // Arquivos novos enviados pela equipe
  const fresh = s.files.filter(
    (f) =>
      f.clientId === DEMO_CLIENT_ID && f.folder === "captacoes" && now - +new Date(f.at) < 2 * DAY,
  );
  if (fresh.length) {
    out.push({
      id: "files-fresh",
      kind: "arquivo",
      text: `${fresh.length} arquivos novos em Captações`,
      meta: "Coleção Verão · Ana Costa",
      at: fresh.reduce((m, f) => (f.at > m ? f.at : m), fresh[0]!.at),
      to: "/cliente/arquivos",
    });
  }

  // Respostas da equipe no chat
  const north = s.convos.find((c) => c.id === "cv-north");
  const lastAgent = north?.messages.filter((m) => m.from === "agent").at(-1);
  if (lastAgent?.agent) {
    out.push({
      id: `msg-${lastAgent.id}`,
      kind: "mensagem",
      text: `${TEAM[lastAgent.agent].first} respondeu no chat`,
      meta: lastAgent.text.slice(0, 80),
      at: lastAgent.at,
      to: "/cliente/mensagens",
    });
  }
  return out;
}

function agencyNotifs(s: Seed): Notif[] {
  const out: Notif[] = [];
  const name = (id: string) => s.clients.find((c) => c.id === id)?.name ?? "";
  const now = Date.now();

  for (const c of s.convos) {
    const last = c.messages.at(-1);
    if (!last) continue;
    if (c.status === "aguardando")
      out.push({
        id: `wait-${c.id}`,
        kind: "mensagem",
        text: `${name(c.clientId)} aguarda atendimento`,
        meta: c.subject,
        at: last.at,
        to: "/cliente/agencia/inbox",
        urgent: !!c.urgent,
      });
    else if (c.status === "resolvida")
      out.push({
        id: `done-${c.id}`,
        kind: "mensagem",
        text: `Conversa resolvida · ${name(c.clientId)}`,
        meta: c.subject,
        at: last.at,
        to: "/cliente/agencia/inbox",
      });
  }

  for (const a of s.activity) {
    if (!a.text.startsWith("Você")) continue;
    out.push({
      id: `ag-${a.id}`,
      kind: a.kind === "change" ? "versao" : a.kind === "calendar" ? "agenda" : "aprovacao",
      text: a.text
        .replace("Você aprovou", "Lucas (North Studio) aprovou")
        .replace("Você solicitou", "Lucas (North Studio) solicitou")
        .replace("Você pediu", "Lucas (North Studio) pediu"),
      at: a.at,
      to: a.contentId ? `/cliente/conteudo/${a.contentId}` : "/cliente/agencia/agenda",
    });
  }

  for (const f of s.files) {
    if (f.folder !== "enviados") continue;
    out.push({
      id: `file-${f.id}`,
      kind: "arquivo",
      text: `${f.by} enviou “${f.name}”`,
      meta: name(f.clientId),
      at: f.at,
      to: "/cliente/agencia/arquivos",
    });
  }

  for (const e of s.agenda) {
    const t = new Date(e.at).getTime();
    if (t < now || t - now > 2 * DAY) continue;
    out.push({
      id: `ev-${e.id}`,
      kind: "agenda",
      text: `${e.title} · ${name(e.clientId)}`,
      meta: `${TEAM[e.owner].first} · ${e.place}`,
      at: new Date(now - 30 * 60_000).toISOString(),
      to: "/cliente/agencia/agenda",
    });
  }
  return out;
}

export function useNotifications(mode: "client" | "agency") {
  const { state } = useDemo();
  return useMemo(() => {
    const items = (mode === "client" ? clientNotifs(state) : agencyNotifs(state))
      .filter((n) => +new Date(n.at) <= Date.now() + 60_000)
      .sort((a, b) => +new Date(b.at) - +new Date(a.at));
    const readAt = +new Date(state.readAt[mode]);
    const isUnread = (n: Notif) => +new Date(n.at) > readAt;
    return { items, isUnread, unread: items.filter(isUnread).length };
  }, [state, mode]);
}
