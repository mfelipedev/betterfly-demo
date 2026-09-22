/* Componentes de conversa compartilhados entre o chat do cliente e a Inbox da Betterfly. */
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, FileText, Film, ImageIcon, Loader2, Paperclip, Send, X } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, TEAM, type Attachment, type Convo, type Message } from "./data";
import { fmt } from "./format";
import { useDemo } from "./store";
import { AiMark, Avatar, TeamAvatar, Thumb } from "./ui";

type Perspective = "client" | "agency";

function dayLabel(iso: string) {
  const d = differenceInCalendarDays(new Date(), new Date(iso));
  if (d === 0) return "Hoje";
  if (d === 1) return "Ontem";
  return fmt(iso, "d 'de' MMMM");
}

export function Thread({
  convo,
  perspective,
  contactInitials,
  onHandoff,
}: {
  convo: Convo;
  perspective: Perspective;
  contactInitials: string;
  onHandoff?: ((messageId: string, accept: boolean) => void) | undefined;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [convo.messages.length, convo.typing]);

  let lastDay = "";
  return (
    <div className="space-y-1 px-4 py-6 md:px-6">
      {convo.messages.map((m, i) => {
        const day = dayLabel(m.at);
        const showDay = day !== lastDay;
        lastDay = day;
        const prev = convo.messages[i - 1];
        const grouped =
          !!prev &&
          !showDay &&
          prev.from === m.from &&
          prev.agent === m.agent &&
          m.from !== "system";
        return (
          <div key={m.id}>
            {showDay && (
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="label-xs">{day}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
            )}
            <Bubble
              m={m}
              perspective={perspective}
              grouped={grouped}
              contactInitials={contactInitials}
              contact={convo.contact}
              onHandoff={onHandoff}
            />
          </div>
        );
      })}
      <AnimatePresence>
        {convo.typing && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-3"
          >
            {convo.typing === "system" ? (
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-acid/30 bg-acid/[0.06] px-4 py-2 text-xs text-acid">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Encaminhando conversa com o
                  histórico…
                </span>
              </div>
            ) : (
              <div
                className={cn(
                  "flex items-end gap-2.5",
                  perspective === "agency" && "flex-row-reverse",
                )}
              >
                <AiMark className="h-7 w-7" />
                <span className="flex gap-1 rounded-2xl rounded-bl-sm bg-bone/[0.07] px-4 py-3.5">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-bone/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={endRef} />
    </div>
  );
}

function Bubble({
  m,
  perspective,
  grouped,
  contactInitials,
  contact,
  onHandoff,
}: {
  m: Message;
  perspective: Perspective;
  grouped: boolean;
  contactInitials: string;
  contact: string;
  onHandoff?: ((messageId: string, accept: boolean) => void) | undefined;
}) {
  const { state } = useDemo();

  if (m.from === "system") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center py-3"
      >
        <span className="max-w-md rounded-full border border-border px-4 py-1.5 text-center text-[0.72rem] leading-relaxed text-bone/60">
          {m.text}
        </span>
      </motion.div>
    );
  }

  // "Meu lado" à direita: cliente no chat do cliente; IA/equipe na Inbox.
  const mine = perspective === "client" ? m.from === "client" : m.from !== "client";
  const author =
    m.from === "client"
      ? contact
      : m.from === "ai"
        ? "IA Betterfly"
        : m.agent
          ? `${TEAM[m.agent].name} · Betterfly`
          : "Betterfly";

  const avatar =
    m.from === "client" ? (
      <Avatar initials={contactInitials} tone="acid" className="h-7 w-7 text-[0.6rem]" />
    ) : m.from === "ai" ? (
      <AiMark className="h-7 w-7" />
    ) : (
      <TeamAvatar id={m.agent ?? "marina"} className="h-7 w-7 text-[0.6rem]" />
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex items-end gap-2.5",
        mine && "flex-row-reverse",
        grouped ? "pt-1" : "pt-4",
      )}
    >
      <span className={cn("w-7 shrink-0", grouped && "invisible")}>{avatar}</span>
      <div
        className={cn(
          "flex max-w-[82%] flex-col md:max-w-[70%]",
          mine ? "items-end" : "items-start",
        )}
      >
        {!grouped && (
          <span className="mb-1.5 flex items-center gap-2 px-1 text-[0.68rem] text-bone/40">
            {author}
            {m.from === "ai" && (
              <span className="rounded-sm bg-acid/15 px-1 text-[0.55rem] font-semibold tracking-wider text-acid">
                IA
              </span>
            )}
            <span>{fmt(m.at, "HH:mm")}</span>
          </span>
        )}
        {m.attachment && <AttachmentView a={m.attachment} />}
        {m.text && (
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line",
              m.attachment && "mt-1.5",
              m.from === "client" && perspective === "client" && "rounded-br-sm bg-bone text-ink",
              m.from === "client" &&
                perspective === "agency" &&
                "rounded-bl-sm bg-bone/[0.08] text-bone/90",
              m.from === "ai" &&
                (mine
                  ? "rounded-br-sm border border-acid/20 bg-acid/[0.06]"
                  : "rounded-bl-sm border border-acid/15 bg-acid/[0.05]"),
              m.from === "agent" &&
                (mine
                  ? "rounded-br-sm bg-bone text-ink"
                  : "rounded-bl-sm bg-bone/[0.08] text-bone/90"),
            )}
          >
            {m.text}
          </div>
        )}

        {m.cards && m.cards.length > 0 && (
          <div className="mt-2 grid w-full min-w-[240px] gap-2 sm:min-w-[320px]">
            {m.cards.map((id) => {
              const c = state.contents.find((x) => x.id === id);
              if (!c) return null;
              return (
                <Link
                  key={id}
                  to="/cliente/conteudo/$id"
                  params={{ id }}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-background p-2 pr-3 transition-colors hover:border-acid/50"
                >
                  <Thumb thumb={c.thumb} className="h-12 w-9 shrink-0 rounded-[3px]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8rem]">{c.title}</span>
                    <span
                      className={cn(
                        "mt-0.5 block text-[0.65rem]",
                        c.status === "aguardando" ? "text-acid" : "text-bone/45",
                      )}
                    >
                      {STATUS_LABEL[c.status]}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-bone/30 transition-colors group-hover:text-acid" />
                </Link>
              );
            })}
          </div>
        )}

        {m.links?.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-acid hover:underline"
          >
            {l.label} <ArrowUpRight className="h-3 w-3" />
          </Link>
        ))}

        {m.actions === "handoff" && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {m.actionsDone || perspective === "agency" || !onHandoff ? (
              <span className="text-[0.7rem] text-bone/35">
                {m.actionsDone ? "Opção escolhida" : "Aguardando escolha do cliente"}
              </span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onHandoff(m.id, true)}
                  className="rounded-full bg-acid px-4 py-2 text-[0.68rem] font-semibold tracking-[0.12em] text-ink uppercase transition-all hover:brightness-110"
                >
                  Sim, falar com a equipe
                </button>
                <button
                  type="button"
                  onClick={() => onHandoff(m.id, false)}
                  className="rounded-full border border-border px-4 py-2 text-[0.68rem] font-medium tracking-[0.12em] text-bone/75 uppercase transition-colors hover:border-bone/40"
                >
                  Continuar com a IA
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;

const kindOf = (file: File): Attachment["kind"] =>
  file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file";

function FileIcon({ kind, className }: { kind: Attachment["kind"]; className?: string }) {
  const Icon = kind === "image" ? ImageIcon : kind === "video" ? Film : FileText;
  return <Icon className={className} />;
}

function AttachmentView({ a }: { a: Attachment }) {
  const [broken, setBroken] = useState(false);
  if (a.kind === "image" && a.url && !broken) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border">
        <img
          src={a.url}
          alt={a.name}
          onError={() => setBroken(true)}
          className="max-h-64 max-w-[260px] object-cover"
        />
        <p className="truncate bg-surface px-3 py-1.5 text-[0.68rem] text-bone/50">
          {a.name} · {formatSize(a.size)}
        </p>
      </div>
    );
  }
  return (
    <div className="flex max-w-[280px] items-center gap-3 rounded-2xl border border-border bg-surface/70 p-2.5 pr-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-acid/10 text-acid">
        <FileIcon kind={a.kind} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm text-bone/90">{a.name}</span>
        <span className="text-[0.68rem] text-bone/45">{formatSize(a.size)}</span>
      </span>
    </div>
  );
}

export function Composer({
  onSend,
  placeholder,
  disabled,
  prefill,
  before,
}: {
  onSend: (text: string, attachment?: Attachment) => void;
  placeholder: string;
  disabled?: boolean;
  prefill?: string | undefined;
  before?: ReactNode;
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<Attachment | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (prefill) setText(prefill);
  }, [prefill]);

  const pick = (f: File | undefined) => {
    if (!f) return;
    const kind = kindOf(f);
    setFile({
      name: f.name,
      size: f.size,
      kind,
      url: kind === "image" ? URL.createObjectURL(f) : undefined,
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if ((!t && !file) || disabled) return;
    onSend(t, file ?? undefined);
    setText("");
    setFile(null);
  };

  return (
    <div className="border-t border-border bg-background px-3 pt-3 pb-3 md:px-6 md:pb-5">
      {before}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="mb-2 flex w-fit max-w-full items-center gap-3 rounded-xl border border-border bg-surface/70 p-2 pr-2"
          >
            {file.kind === "image" && file.url ? (
              <img src={file.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-acid/10 text-acid">
                <FileIcon kind={file.kind} className="h-5 w-5" />
              </span>
            )}
            <span className="min-w-0">
              <span className="block max-w-[220px] truncate text-xs text-bone/90">{file.name}</span>
              <span className="text-[0.65rem] text-bone/45">
                {formatSize(file.size)} · pronto para enviar
              </span>
            </span>
            <button
              type="button"
              onClick={() => setFile(null)}
              aria-label="Remover anexo"
              className="ml-1 rounded-full p-1.5 text-bone/45 transition-colors hover:bg-bone/[0.06] hover:text-bone"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <form
        onSubmit={submit}
        className="flex items-end gap-1.5 rounded-2xl border border-border bg-surface/50 p-1.5 transition-colors focus-within:border-bone/30"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          aria-label="Anexar imagem, vídeo ou arquivo"
          title="Anexar imagem, vídeo ou arquivo"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-bone/50 transition-colors hover:bg-bone/[0.06] hover:text-acid disabled:opacity-30"
        >
          <Paperclip className="h-[18px] w-[18px]" />
        </button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e);
            }
          }}
          rows={1}
          placeholder={placeholder}
          className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent py-2.5 text-sm outline-none placeholder:text-bone/35"
        />
        <button
          type="submit"
          disabled={(!text.trim() && !file) || disabled}
          aria-label="Enviar mensagem"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-acid text-ink transition-all hover:brightness-110 disabled:opacity-30"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
