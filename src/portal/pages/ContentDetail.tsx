import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Pause,
  Play,
  RefreshCw,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { TEAM, TYPE_LABEL, type Content } from "../data";
import { fmt, pad2, timeAgo } from "../format";
import { useDemo } from "../store";
import { Avatar, EmptyState, StatusBadge, TeamAvatar, Thumb, aspectFor, btn } from "../ui";

export function ContentDetail({ id }: { id: string }) {
  const { state, approve, requestChange } = useDemo();
  const c = state.contents.find((x) => x.id === id);
  const [version, setVersion] = useState<number | null>(null);
  const [tab, setTab] = useState<"caption" | "script" | "goal" | "notes">("caption");
  const [changeOpen, setChangeOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    setVersion(null);
  }, [id]);

  if (!c) {
    return (
      <div className="px-4 py-16">
        <EmptyState title="Conteúdo não encontrado" text="Ele pode ter sido removido do plano." />
        <div className="text-center">
          <Link to="/cliente/conteudo" className={btn.ghost}>
            Voltar ao plano
          </Link>
        </div>
      </div>
    );
  }

  const current = c.versions.at(-1)?.n ?? 0;
  const shown = version ?? current;
  const isOld = shown !== current;

  const onApprove = () => {
    approve(c.id);
    setCelebrate(true);
    window.setTimeout(() => setCelebrate(false), 1900);
    toast.success("Conteúdo aprovado ✓", {
      description: `${TEAM[c.owner].first} já recebeu o aviso e o conteúdo segue para programação.`,
    });
  };

  const TABS = [
    ["caption", "Legenda"],
    ["script", "Roteiro"],
    ["goal", "Objetivo"],
    ["notes", "Observações"],
  ] as const;
  const tabText = { caption: c.caption, script: c.script, goal: c.goal, notes: c.notes }[tab];

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-5 md:px-8 md:pt-8">
      <Link to="/cliente/conteudo" className={btn.subtle}>
        <ArrowLeft className="h-3.5 w-3.5" /> Plano de conteúdo
      </Link>

      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-12">
        {/* Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Preview c={c} dim={isOld} key={`${c.id}-${shown}`} />
          {c.versions.length > 0 && (
            <div className="mt-4">
              <p className="label-xs mb-2">Versões</p>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
                {c.versions.map((v) => (
                  <button
                    key={v.n}
                    type="button"
                    onClick={() => setVersion(v.n)}
                    className={cn(
                      "min-w-[128px] flex-1 shrink-0 rounded-md border px-3 py-2 text-left transition-colors",
                      shown === v.n
                        ? "border-acid/60 bg-acid/[0.06]"
                        : "border-border hover:border-bone/30",
                    )}
                  >
                    <span
                      className={cn(
                        "block text-xs font-medium",
                        shown === v.n ? "text-acid" : "text-bone/80",
                      )}
                    >
                      Versão {pad2(v.n)}{" "}
                      {v.n === current && <span className="text-bone/45">· atual</span>}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.68rem] text-bone/40">
                      {v.note}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={c.status} />
            <span className="text-xs text-bone/40">
              {TYPE_LABEL[c.type]} · {c.channel}
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl leading-[1.05] font-medium md:text-[2.5rem]">
            {c.title}
          </h1>

          <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
            {[
              ["Canal", c.channel],
              ["Publicação prevista", fmt(c.date, "dd/MM/yyyy")],
              ["Formato", TYPE_LABEL[c.type]],
              ["Responsável", `${TEAM[c.owner].first} / Betterfly`],
            ].map(([k, v]) => (
              <div key={k} className="bg-background p-4">
                <dt className="label-xs">{k}</dt>
                <dd className="mt-2 text-sm">{v}</dd>
              </div>
            ))}
          </dl>

          {/* Textos */}
          <div className="mt-8">
            <div className="flex gap-5 border-b border-border" role="tablist">
              {TABS.map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={cn(
                    "relative -mb-px pb-3 text-sm transition-colors",
                    tab === k ? "text-bone" : "text-bone/45 hover:text-bone/80",
                  )}
                >
                  {label}
                  {tab === k && (
                    <motion.span
                      layoutId="tab-line"
                      className="absolute inset-x-0 bottom-0 h-px bg-acid"
                    />
                  )}
                </button>
              ))}
            </div>
            <p className="min-h-[96px] py-5 text-sm leading-relaxed whitespace-pre-line text-bone/75">
              {tabText || <span className="text-bone/35">Ainda não preenchido.</span>}
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            {/* Histórico */}
            <section>
              <p className="label-xs mb-4">Histórico</p>
              <ol className="relative space-y-4 pl-6">
                <span
                  className="absolute top-1.5 bottom-1.5 left-[5px] w-px bg-border"
                  aria-hidden
                />
                {c.history.map((h) => (
                  <li key={h.id} className="relative">
                    <span
                      className={cn(
                        "absolute top-1.5 -left-6 h-[11px] w-[11px] rounded-full border-2 border-background",
                        h.kind === "approved"
                          ? "bg-acid"
                          : h.kind === "change"
                            ? "bg-orange-400"
                            : "bg-bone/40",
                      )}
                    />
                    <p className="text-sm text-bone/85">{h.text}</p>
                    <p className="mt-0.5 text-[0.7rem] text-bone/40">
                      {fmt(h.at, "dd/MM · HH:mm")}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <Comments c={c} />
          </div>
        </div>
      </div>

      {/* Barra de ações */}
      <div className="sticky bottom-0 z-30 -mx-4 mt-12 border-t border-border bg-background/90 backdrop-blur-xl md:-mx-8">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-8">
          <ActionStatus c={c} />
          {c.status === "aguardando" && (
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setChangeOpen(true)}
                className={cn(btn.ghost, "px-4 md:px-5")}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Solicitar alteração</span>
                <span className="sm:hidden">Alterar</span>
              </button>
              <button type="button" onClick={onApprove} className={cn(btn.primary, "px-4 md:px-6")}>
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Aprovar conteúdo</span>
                <span className="sm:hidden">Aprovar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <ChangeDialog
        open={changeOpen}
        onOpenChange={setChangeOpen}
        c={c}
        onSubmit={(text) => {
          requestChange(c.id, text);
          setChangeOpen(false);
          toast("Solicitação enviada", {
            description: `${TEAM[c.owner].first} recebeu seu pedido junto com este conteúdo.`,
          });
        }}
      />

      <AnimatePresence>
        {celebrate && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 260 }}
              className="flex flex-col items-center text-center"
            >
              <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-acid text-ink">
                <motion.span
                  className="absolute inset-0 rounded-full border border-acid"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <Check className="h-11 w-11" strokeWidth={2.5} />
              </span>
              <p className="mt-6 font-display text-3xl font-medium">Conteúdo aprovado</p>
              <p className="mt-2 text-sm text-bone/60">Segue para programação na data prevista.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionStatus({ c }: { c: Content }) {
  if (c.status === "aguardando")
    return (
      <p className="min-w-0 text-xs text-bone/55 md:text-sm">
        <span className="hidden md:inline">
          Versão {pad2(c.versions.at(-1)?.n ?? 1)} aguardando sua decisão.
        </span>
        <span className="md:hidden">Aguardando você</span>
      </p>
    );
  if (c.status === "ajuste")
    return (
      <p className="flex items-center gap-2 text-sm text-orange-300">
        <RefreshCw className="h-4 w-4" /> Ajuste solicitado. {TEAM[c.owner].first} está preparando
        uma nova versão.
      </p>
    );
  if (c.status === "producao" || c.status === "ideia")
    return (
      <p className="text-sm text-bone/55">
        Em produção. Você será avisado quando estiver pronto para aprovação.
      </p>
    );
  return (
    <p className="flex items-center gap-2 text-sm text-acid">
      <Check className="h-4 w-4" />
      {c.approvedAt ? `Aprovado em ${fmt(c.approvedAt, "dd/MM 'às' HH:mm")}` : "Aprovado"}
      {c.status === "publicado" && (
        <span className="text-bone/45">· publicado em {fmt(c.date, "dd/MM")}</span>
      )}
    </p>
  );
}

function Preview({ c, dim }: { c: Content; dim: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [slide, setSlide] = useState(0);
  const isMotion = c.type === "reels" || c.type === "stories" || c.type === "video";
  const slides = c.type === "carrossel" ? c.script.split("\n").filter(Boolean) : [];

  return (
    <div
      className={cn(
        "relative mx-auto overflow-hidden rounded-lg border border-border bg-surface",
        aspectFor(c.type),
        c.type !== "video" && "max-w-[280px] sm:max-w-[400px]",
      )}
    >
      {slide === 0 || !slides.length ? (
        <Thumb thumb={c.thumb} big className="absolute inset-0" dim={dim} />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between bg-[oklch(0.2_0_0)] p-8">
          <span className="label-xs">
            {pad2(slide + 1)} / {pad2(slides.length)}
          </span>
          <p className="font-display text-3xl leading-tight font-medium">
            {(slides[slide] ?? "").replace(/^Slides? [\d–-]+ · /, "")}
          </p>
          <span className="font-display text-xs tracking-[0.2em] text-acid uppercase">
            North Studio
          </span>
        </div>
      )}

      {dim && (
        <span className="absolute top-3 left-3 rounded-full bg-background/80 px-3 py-1 text-[0.62rem] tracking-[0.16em] text-bone/70 uppercase backdrop-blur">
          Versão anterior
        </span>
      )}

      {isMotion && c.versions.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pausar" : "Reproduzir"}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full bg-background/60 backdrop-blur transition-opacity",
                playing && "opacity-0 hover:opacity-100",
              )}
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6" />}
            </span>
          </button>
          <div className="absolute inset-x-4 bottom-4 h-0.5 overflow-hidden rounded-full bg-bone/20">
            <motion.span
              className="block h-full bg-acid"
              initial={{ width: "0%" }}
              animate={{ width: playing ? "100%" : "0%" }}
              transition={{ duration: playing ? 30 : 0.3, ease: "linear" }}
              onAnimationComplete={() => playing && setPlaying(false)}
            />
          </div>
        </>
      )}

      {c.type === "reels" && c.versions.length > 0 && (
        <div className="pointer-events-none absolute right-3 bottom-10 flex flex-col items-center gap-4 text-bone/80">
          <Heart className="h-5 w-5" />
          <MessageCircle className="h-5 w-5" />
          <Send className="h-5 w-5" />
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-background/60 p-1.5 backdrop-blur"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Próximo slide"
            onClick={() => setSlide((s) => (s + 1) % slides.length)}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-background/60 p-1.5 backdrop-blur"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1">
            {slides.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all",
                  i === slide ? "w-4 bg-acid" : "w-1 bg-bone/40",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Comments({ c }: { c: Content }) {
  const { comment } = useDemo();
  const [text, setText] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    comment(c.id, text.trim(), "client");
    setText("");
  };

  return (
    <section>
      <p className="label-xs mb-4">Comentários · {c.comments.length}</p>
      <div className="space-y-4">
        {c.comments.length === 0 && (
          <p className="text-sm text-bone/40">
            Nenhum comentário ainda. As conversas sobre este conteúdo ficam aqui.
          </p>
        )}
        <AnimatePresence initial={false}>
          {c.comments.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              {m.role === "client" ? (
                <Avatar initials="LA" tone="acid" className="h-7 w-7 text-[0.6rem]" />
              ) : (
                <TeamAvatar id={c.owner} className="h-7 w-7 text-[0.6rem]" />
              )}
              <div className="min-w-0">
                <p className="text-xs">
                  <span className="font-medium">{m.author}</span>
                  <span className="ml-2 text-bone/35">{timeAgo(m.at)}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-bone/75">{m.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <form
        onSubmit={submit}
        className="mt-5 flex items-center gap-2 rounded-full border border-border py-1 pr-1 pl-4 focus-within:border-bone/30"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Comentar neste conteúdo…"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-bone/35"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Enviar comentário"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-acid text-ink transition-opacity disabled:opacity-30"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </section>
  );
}

function ChangeDialog({
  open,
  onOpenChange,
  c,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  c: Content;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    if (open) {
      setText("");
      setError(false);
    }
  }, [open]);

  const suggestions = [
    "Ajustar o texto de abertura",
    "Trocar a trilha",
    "Mudar a capa",
    "Revisar a legenda",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-[oklch(0.16_0_0)] sm:max-w-lg">
        <DialogTitle className="font-display text-2xl font-medium">
          O que gostaria de alterar?
        </DialogTitle>
        <DialogDescription className="text-bone/55">
          Seu pedido fica registrado neste conteúdo e vai direto para {TEAM[c.owner].first}, com a
          versão {pad2(c.versions.at(-1)?.n ?? 1)} como referência.
        </DialogDescription>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setText((t) => (t ? `${t} ${s.toLowerCase()}.` : `${s}.`));
                setError(false);
              }}
              className="rounded-full border border-border px-3 py-1 text-xs text-bone/65 transition-colors hover:border-acid/50 hover:text-acid"
            >
              + {s}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(false);
          }}
          rows={4}
          autoFocus
          placeholder="Descreva o ajuste. Ex.: gostaria que a abertura fosse mais direta…"
          className={cn(
            "w-full resize-none rounded-md border bg-transparent p-3 text-sm outline-none transition-colors placeholder:text-bone/30",
            error ? "border-orange-400/70" : "border-border focus:border-acid/60",
          )}
        />
        {error && (
          <p className="-mt-2 text-xs text-orange-300">
            Conte rapidamente o que precisa mudar para a equipe entender o ajuste.
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => onOpenChange(false)} className={btn.ghost}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => (text.trim().length < 4 ? setError(true) : onSubmit(text.trim()))}
            className={btn.primary}
          >
            Enviar solicitação
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
