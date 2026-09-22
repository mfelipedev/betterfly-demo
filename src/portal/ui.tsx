import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  STATUS_LABEL,
  TEAM,
  TYPE_LABEL,
  type Content,
  type ContentStatus,
  type ContentType,
  type ConvoStatus,
  type TeamId,
  type Thumb as ThumbT,
} from "./data";

/* ---------- Status de conteúdo ---------- */

export const STATUS_STYLE: Record<ContentStatus, { dot: string; chip: string }> = {
  ideia: { dot: "bg-bone/35", chip: "border-bone/15 text-bone/60" },
  producao: { dot: "bg-amber-300/80", chip: "border-amber-300/25 text-amber-200/90" },
  aguardando: { dot: "bg-acid signal-dot", chip: "border-acid/50 text-acid bg-acid/[0.06]" },
  ajuste: { dot: "bg-orange-400", chip: "border-orange-400/35 text-orange-300" },
  aprovado: { dot: "bg-acid", chip: "border-acid/25 text-acid/90" },
  programado: { dot: "bg-bone/80", chip: "border-bone/25 text-bone/85" },
  publicado: { dot: "bg-bone/40", chip: "border-bone/12 text-bone/50" },
};

export function StatusBadge({ status, className }: { status: ContentStatus; className?: string }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.14em] whitespace-nowrap uppercase",
        s.chip,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function TypeTag({ type, className }: { type: ContentType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm bg-bone/[0.07] px-1.5 py-0.5 text-[0.6rem] font-medium tracking-[0.16em] text-bone/70 uppercase",
        className,
      )}
    >
      {TYPE_LABEL[type]}
    </span>
  );
}

/* ---------- Status de conversa ---------- */

export const CONVO_BADGE: Record<ConvoStatus, { label: string; cls: string }> = {
  ia: { label: "IA", cls: "border-acid/40 text-acid" },
  aguardando: { label: "Aguardando", cls: "border-orange-400/40 text-orange-300" },
  humano: { label: "Humano", cls: "border-bone/30 text-bone/85" },
  resolvida: { label: "Resolvida", cls: "border-bone/10 text-bone/40" },
};

export function ConvoBadge({ status, className }: { status: ConvoStatus; className?: string }) {
  const b = CONVO_BADGE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[0.58rem] font-medium tracking-[0.16em] uppercase",
        b.cls,
        className,
      )}
    >
      {b.label}
    </span>
  );
}

/* ---------- Miniaturas ---------- */

const ART_TONE = {
  acid: "bg-acid text-ink",
  bone: "bg-bone text-ink",
  ink: "bg-[oklch(0.2_0_0)] text-bone",
};

export function Thumb({
  thumb,
  className,
  big = false,
  dim = false,
}: {
  thumb: ThumbT;
  className?: string | undefined;
  big?: boolean;
  dim?: boolean;
}) {
  if (thumb.kind === "photo") {
    return (
      <div className={cn("relative overflow-hidden bg-surface", className)}>
        <img
          src={thumb.src}
          alt=""
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-all duration-500",
            dim && "opacity-40 grayscale",
          )}
          style={{ objectPosition: thumb.pos ?? "center" }}
        />
      </div>
    );
  }
  const producing = thumb.text === "Em produção";
  return (
    <div
      className={cn(
        "@container relative flex overflow-hidden",
        ART_TONE[thumb.tone],
        producing ? "items-center justify-center" : "items-end",
        className,
      )}
    >
      {producing ? (
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80 @[7rem]:hidden" />
          <span className={cn("label-xs hidden items-center gap-2 @[7rem]:flex", big && "text-sm")}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />
            Em produção
          </span>
        </>
      ) : (
        <>
          {/* Miniaturas pequenas mostram só o monograma; o texto aparece quando há espaço. */}
          <span className="absolute inset-0 flex items-center justify-center font-display text-[0.7rem] font-semibold opacity-70 @[5rem]:hidden">
            N
          </span>
          <span className="absolute top-[8%] left-[8%] hidden font-display text-[0.55rem] tracking-[0.2em] uppercase opacity-60 @[5rem]:block">
            North
          </span>
          <span
            className={cn(
              "hidden w-full p-[8%] font-display leading-[0.95] font-medium tracking-tight whitespace-pre-line @[5rem]:block",
              big ? "text-4xl md:text-5xl" : "text-[0.8rem]",
              dim && "opacity-40",
            )}
          >
            {thumb.text}
          </span>
        </>
      )}
    </div>
  );
}

export const aspectFor = (type: ContentType) =>
  type === "reels" || type === "stories"
    ? "aspect-[9/16]"
    : type === "video"
      ? "aspect-video"
      : "aspect-[4/5]";

/* ---------- Pessoas ---------- */

export function Avatar({
  initials,
  className,
  tone = "bone",
}: {
  initials: string;
  className?: string | undefined;
  tone?: "bone" | "acid" | "ink";
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[0.7rem] font-semibold tracking-wide",
        tone === "acid" && "bg-acid text-ink",
        tone === "bone" && "bg-bone/[0.1] text-bone",
        tone === "ink" && "border border-border bg-ink text-bone",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function TeamAvatar({ id, className }: { id: TeamId; className?: string | undefined }) {
  return <Avatar initials={TEAM[id].initials} className={className} />;
}

/** Marca da IA: borboleta estilizada em círculo verde. */
export function AiMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-acid text-ink",
        className,
      )}
      aria-label="IA Betterfly"
    >
      <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="currentColor" aria-hidden>
        <path d="M11.3 12c-.6-3.7-3.3-7.2-6.8-7.9C2.6 3.7 1.6 5 2.2 7.4c.6 2.6 2.8 4.3 5.3 4.6-2.3.7-3.8 2.6-3.4 4.8.4 2.2 2.3 2.9 4 1.9 1.6-.9 2.7-3.3 3.2-6.7Zm1.4 0c.6-3.7 3.3-7.2 6.8-7.9 1.9-.4 2.9.9 2.3 3.3-.6 2.6-2.8 4.3-5.3 4.6 2.3.7 3.8 2.6 3.4 4.8-.4 2.2-2.3 2.9-4 1.9-1.6-.9-2.7-3.3-3.2-6.7Z" />
      </svg>
    </span>
  );
}

/* ---------- Layout de página ---------- */

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="label-xs mb-3">{eyebrow}</p>}
        <h1 className="font-display text-3xl leading-[1.05] font-medium md:text-[2.6rem]">
          {title}
        </h1>
        {subtitle && <p className="mt-3 max-w-xl text-sm text-bone/55">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <section className={cn("rounded-md border border-border bg-surface/40", className)}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <h2 className="label-xs !text-bone/70">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  text,
  icon,
}: {
  title: string;
  text?: string | undefined;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon && <div className="mb-4 text-acid">{icon}</div>}
      <p className="font-display text-lg">{title}</p>
      {text && <p className="mt-2 max-w-xs text-sm text-bone/50">{text}</p>}
    </div>
  );
}

export function ContentRow({ c, right }: { c: Content; right?: ReactNode }) {
  return (
    <Link
      to="/cliente/conteudo/$id"
      params={{ id: c.id }}
      className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-bone/[0.03]"
    >
      <Thumb thumb={c.thumb} className="h-14 w-11 shrink-0 rounded-sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <TypeTag type={c.type} />
          <span className="text-[0.7rem] text-bone/40">{c.channel}</span>
        </div>
        <p className="mt-1.5 truncate text-sm text-bone/90 group-hover:text-bone">{c.title}</p>
      </div>
      {right}
    </Link>
  );
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-acid px-5 py-2.5 text-[0.7rem] font-semibold tracking-[0.16em] text-ink uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-[0.7rem] font-medium tracking-[0.16em] text-bone/85 uppercase transition-colors hover:border-bone/40 hover:text-bone active:scale-[0.98]",
  subtle: "inline-flex items-center gap-1.5 text-xs text-bone/55 transition-colors hover:text-acid",
};
