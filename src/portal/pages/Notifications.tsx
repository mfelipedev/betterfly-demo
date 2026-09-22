import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  FolderOpen,
  MessageSquare,
  RefreshCw,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";
import { NOTIF_LABEL, useNotifications, type Notif, type NotifKind } from "../notifications";
import { timeAgo } from "../format";
import { useDemo } from "../store";
import { EmptyState, PageHeader, btn } from "../ui";

const ICON: Record<NotifKind, LucideIcon> = {
  aprovacao: CheckCircle2,
  versao: RefreshCw,
  mensagem: MessageSquare,
  agenda: CalendarClock,
  arquivo: FolderOpen,
  sistema: Bell,
};

const PREFS: { key: string; label: string; hint: string }[] = [
  {
    key: "aprovacao",
    label: "Novos conteúdos para aprovar",
    hint: "Assim que uma peça ou versão chega",
  },
  { key: "mensagem", label: "Respostas no chat", hint: "Quando a equipe responde você" },
  { key: "agenda", label: "Lembretes de agenda", hint: "Captações e reuniões, com antecedência" },
  { key: "arquivo", label: "Arquivos novos", hint: "Fotos, vídeos e relatórios disponíveis" },
];
const CHANNELS: { key: string; label: string }[] = [
  { key: "email", label: "E-mail" },
  { key: "whatsapp", label: "WhatsApp" },
];

function group(n: Notif) {
  const d = differenceInCalendarDays(new Date(), new Date(n.at));
  return d <= 0 ? "Hoje" : d < 7 ? "Esta semana" : "Anteriores";
}

export function Notifications({ agency = false }: { agency?: boolean }) {
  const mode = agency ? "agency" : "client";
  const { state, markAllRead, setPref } = useDemo();
  const { items, isUnread, unread } = useNotifications(mode);
  const [kind, setKind] = useState<NotifKind | "todas" | "nao-lidas">("todas");

  const kinds = Array.from(new Set(items.map((n) => n.kind)));
  const list = items.filter((n) =>
    kind === "todas" ? true : kind === "nao-lidas" ? isUnread(n) : n.kind === kind,
  );
  const groups = (["Hoje", "Esta semana", "Anteriores"] as const)
    .map((g) => ({ g, items: list.filter((n) => group(n) === g) }))
    .filter((x) => x.items.length);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-7 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Notificações"
        title="Central de notificações"
        subtitle={
          agency
            ? "O que aconteceu com os clientes e a operação, em ordem."
            : "Tudo o que aconteceu no seu projeto, sem precisar procurar."
        }
        actions={
          unread > 0 && (
            <button type="button" className={btn.ghost} onClick={() => markAllRead(mode)}>
              Marcar todas como lidas
            </button>
          )
        }
      />

      <div
        className={cn(
          "mt-8 grid grid-cols-1 gap-6",
          !agency && "lg:grid-cols-[minmax(0,1fr)_320px]",
        )}
      >
        <div className="min-w-0">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(["todas", "nao-lidas", ...kinds] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors",
                  kind === k
                    ? "border-acid/50 bg-acid/[0.06] text-acid"
                    : "border-border text-bone/60 hover:text-bone",
                )}
              >
                {k === "todas"
                  ? "Todas"
                  : k === "nao-lidas"
                    ? `Não lidas · ${unread}`
                    : NOTIF_LABEL[k]}
              </button>
            ))}
          </div>

          {!groups.length ? (
            <EmptyState
              icon={<CheckCircle2 className="h-8 w-8" />}
              title="Nada por aqui"
              text="Você está em dia com tudo."
            />
          ) : (
            groups.map(({ g, items: gi }) => (
              <section key={g} className="mt-6">
                <h2 className="label-xs mb-2">{g}</h2>
                <ul className="divide-y divide-border overflow-hidden rounded-md border border-border">
                  {gi.map((n) => {
                    const Icon = ICON[n.kind];
                    const unreadN = isUnread(n);
                    return (
                      <li key={n.id}>
                        <Link
                          to={n.to}
                          className={cn(
                            "flex items-start gap-4 px-4 py-3.5 transition-colors hover:bg-bone/[0.03] md:px-5",
                            unreadN && "bg-acid/[0.025]",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                              n.urgent
                                ? "bg-orange-400/15 text-orange-300"
                                : unreadN
                                  ? "bg-acid/15 text-acid"
                                  : "bg-bone/[0.06] text-bone/50",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block text-sm",
                                unreadN ? "text-bone" : "text-bone/70",
                              )}
                            >
                              {n.text}
                            </span>
                            {n.meta && (
                              <span className="mt-0.5 block truncate text-xs text-bone/45">
                                {n.meta}
                              </span>
                            )}
                          </span>
                          <span className="flex shrink-0 items-center gap-2 text-[0.7rem] text-bone/40">
                            {timeAgo(n.at)}
                            {unreadN && <span className="h-1.5 w-1.5 rounded-full bg-acid" />}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>

        {!agency && (
          <aside className="h-fit rounded-md border border-border">
            <header className="flex items-center gap-2 border-b border-border px-5 py-3.5">
              <Settings2 className="h-4 w-4 text-bone/50" />
              <h2 className="label-xs !text-bone/70">Preferências</h2>
            </header>
            <ul className="space-y-4 px-5 py-4">
              {PREFS.map((p) => (
                <li key={p.key}>
                  <label className="flex cursor-pointer items-start justify-between gap-3">
                    <span>
                      <span className="block text-sm">{p.label}</span>
                      <span className="block text-xs text-bone/45">{p.hint}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={!!state.prefs[p.key]}
                      onChange={(e) => setPref(p.key, e.target.checked)}
                      className="mt-1 h-4 w-4 accent-[#BBD705]"
                    />
                  </label>
                </li>
              ))}
            </ul>
            <div className="border-t border-border px-5 py-4">
              <p className="text-xs text-bone/45">Também avisar por</p>
              <div className="mt-2 flex gap-2">
                {CHANNELS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    aria-pressed={!!state.prefs[c.key]}
                    onClick={() => setPref(c.key, !state.prefs[c.key])}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors",
                      state.prefs[c.key]
                        ? "border-acid/50 bg-acid/[0.06] text-acid"
                        : "border-border text-bone/55 hover:text-bone",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
