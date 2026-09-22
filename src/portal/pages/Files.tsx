import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, LayoutGrid, List, Play, Search, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DEMO_CLIENT, DEMO_CLIENT_ID, FOLDERS, type FileItem, type FolderId } from "../data";
import { fmt, relDay } from "../format";
import { FileIcon, formatSize, kindOf } from "../chat";
import { useDemo } from "../store";
import { EmptyState, PageHeader, btn } from "../ui";

type View = "grid" | "list";

const extOf = (name: string) => name.split(".").pop()?.toUpperCase() ?? "";

export function Files({ agency = false }: { agency?: boolean }) {
  const { state, addFile } = useDemo();
  const [folder, setFolder] = useState<FolderId | "todos">("todos");
  const [client, setClient] = useState<string>(agency ? "todos" : DEMO_CLIENT_ID);
  const [q, setQ] = useState("");
  const [view, setView] = useState<View>("grid");
  const [open, setOpen] = useState<FileItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const clientName = (id: string) => state.clients.find((c) => c.id === id)?.name ?? id;
  const scoped = state.files.filter((f) => client === "todos" || f.clientId === client);
  const files = useMemo(() => {
    const term = q.trim().toLowerCase();
    return scoped
      .filter((f) => folder === "todos" || f.folder === folder)
      .filter((f) => !term || f.name.toLowerCase().includes(term))
      .sort((a, b) => +new Date(b.at) - +new Date(a.at));
  }, [scoped, folder, q]);

  const folderLabel = (id: FolderId) =>
    id === "enviados" && !agency ? "Enviados por você" : FOLDERS.find((f) => f.id === id)!.label;
  const clientsWithFiles = Array.from(new Set(state.files.map((f) => f.clientId)));

  const upload = (list: FileList | null) => {
    const f = list?.[0];
    if (!f) return;
    const kind = kindOf(f);
    const target = client === "todos" ? DEMO_CLIENT_ID : client;
    const destFolder: FolderId = agency ? (folder === "todos" ? "aprovados" : folder) : "enviados";
    addFile(
      target,
      destFolder,
      {
        name: f.name,
        size: f.size,
        kind,
        url: kind === "image" ? URL.createObjectURL(f) : undefined,
      },
      agency ? "Equipe Betterfly" : DEMO_CLIENT.contact,
    );
    setFolder(destFolder);
    toast.success(
      agency
        ? `“${f.name}” adicionado em ${clientName(target)} › ${folderLabel(destFolder)}`
        : `“${f.name}” enviado. A equipe Betterfly já tem acesso.`,
    );
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Arquivos"
        title={agency ? "Arquivos dos clientes" : "Seus arquivos"}
        subtitle={
          agency
            ? "Captações, peças aprovadas, identidade e relatórios de cada cliente, num só lugar."
            : "Tudo o que produzimos para a North Studio, organizado e sempre à mão."
        }
        actions={
          <>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
              onChange={(e) => {
                upload(e.target.files);
                e.target.value = "";
              }}
            />
            <button type="button" className={btn.primary} onClick={() => inputRef.current?.click()}>
              <Upload className="h-3.5 w-3.5" /> Enviar arquivo
            </button>
          </>
        }
      />

      {/* Pastas */}
      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {(["todos", ...FOLDERS.map((f) => f.id)] as const).map((id) => {
          const count =
            id === "todos" ? scoped.length : scoped.filter((f) => f.folder === id).length;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFolder(id)}
              className={cn(
                "rounded-md border px-4 py-3 text-left transition-colors",
                folder === id
                  ? "border-acid/50 bg-acid/[0.06]"
                  : "border-border hover:border-bone/25",
              )}
            >
              <span className={cn("block text-sm", folder === id ? "text-acid" : "text-bone/85")}>
                {id === "todos" ? "Todos" : folderLabel(id)}
              </span>
              <span className="mt-0.5 block text-xs text-bone/40 tabular-nums">
                {count} {count === 1 ? "arquivo" : "arquivos"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-bone/35" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar arquivo"
            className="w-full rounded-full border border-border bg-transparent py-2 pr-3 pl-9 text-sm placeholder:text-bone/35 focus:border-bone/35 focus:outline-none"
          />
        </label>
        {agency && (
          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="rounded-full border border-border bg-background px-3 py-2 text-sm text-bone/80 focus:outline-none"
            aria-label="Cliente"
          >
            <option value="todos">Todos os clientes</option>
            {clientsWithFiles.map((id) => (
              <option key={id} value={id}>
                {clientName(id)}
              </option>
            ))}
          </select>
        )}
        <div className="ml-auto flex rounded-full border border-border p-0.5">
          {(
            [
              ["grid", LayoutGrid, "Grade"],
              ["list", List, "Lista"],
            ] as const
          ).map(([v, Icon, label]) => (
            <button
              key={v}
              type="button"
              aria-label={label}
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-full p-1.5 transition-colors",
                view === v ? "bg-bone/10 text-bone" : "text-bone/40 hover:text-bone",
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {!files.length ? (
        <EmptyState
          title="Nenhum arquivo aqui"
          text={q ? "Tente outro termo de busca." : "Os arquivos desta pasta aparecem aqui."}
        />
      ) : view === "grid" ? (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {files.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => setOpen(f)}
                className="group block w-full overflow-hidden rounded-md border border-border text-left transition-colors hover:border-bone/30"
              >
                <Preview f={f} className="aspect-[4/3]" />
                <div className="px-3 py-2.5">
                  <p className="truncate text-sm text-bone/90">{f.name}</p>
                  <p className="mt-0.5 truncate text-[0.7rem] text-bone/40">
                    {agency && client === "todos" ? `${clientName(f.clientId)} · ` : ""}
                    {formatSize(f.size)} · {relDay(f.at)}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 overflow-hidden rounded-md border border-border">
          <ul className="divide-y divide-border">
            {files.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => setOpen(f)}
                  className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-bone/[0.03]"
                >
                  <Preview f={f} className="h-10 w-10 shrink-0 rounded-sm" small />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{f.name}</span>
                    <span className="block truncate text-xs text-bone/40">
                      {agency ? `${clientName(f.clientId)} · ` : ""}
                      {folderLabel(f.folder)} · {f.by}
                    </span>
                  </span>
                  <span className="hidden w-20 text-right text-xs text-bone/50 tabular-nums sm:block">
                    {formatSize(f.size)}
                  </span>
                  <span className="hidden w-24 text-right text-xs text-bone/50 sm:block">
                    {relDay(f.at)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <FileModal
            f={open}
            folder={folderLabel(open.folder)}
            client={agency ? clientName(open.clientId) : undefined}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Preview({ f, className, small }: { f: FileItem; className?: string; small?: boolean }) {
  const [broken, setBroken] = useState(false);
  const showImg = f.src && !broken && f.kind !== "file";
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-surface",
        className,
      )}
    >
      {showImg ? (
        <img
          src={f.src}
          alt=""
          loading="lazy"
          onError={() => setBroken(true)}
          className="h-full w-full object-cover"
          style={{ objectPosition: f.pos ?? "center" }}
        />
      ) : (
        <span className="flex flex-col items-center gap-1.5 text-acid">
          <FileIcon kind={f.kind} className={small ? "h-4 w-4" : "h-7 w-7"} />
          {!small && (
            <span className="text-[0.6rem] font-medium tracking-[0.18em] text-bone/45">
              {extOf(f.name)}
            </span>
          )}
        </span>
      )}
      {f.kind === "video" && showImg && (
        <span className="absolute inset-0 flex items-center justify-center bg-ink/25">
          <span
            className={cn(
              "flex items-center justify-center rounded-full bg-bone/90 text-ink",
              small ? "h-5 w-5" : "h-9 w-9",
            )}
          >
            <Play className={cn("fill-current", small ? "h-2.5 w-2.5" : "h-4 w-4")} />
          </span>
        </span>
      )}
    </div>
  );
}

function FileModal({
  f,
  folder,
  client,
  onClose,
}: {
  f: FileItem;
  folder: string;
  client?: string | undefined;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-label={f.name}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-t-xl border border-border bg-background sm:rounded-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <p className="truncate text-sm">{f.name}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-bone/50 hover:text-bone"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <Preview
          f={f}
          className="max-h-[60vh] min-h-56 [&_img]:max-h-[60vh] [&_img]:object-contain"
        />
        <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:flex sm:gap-6">
            {client && <Meta k="Cliente" v={client} />}
            <Meta k="Pasta" v={folder} />
            <Meta k="Tamanho" v={formatSize(f.size)} />
            <Meta k="Enviado" v={`${fmt(f.at, "dd/MM")} · ${f.by}`} />
          </dl>
          <button
            type="button"
            className={btn.primary}
            onClick={() => {
              if (f.src && f.kind === "image") {
                const a = document.createElement("a");
                a.href = f.src;
                a.download = f.name;
                a.click();
              } else {
                toast("Arquivo de demonstração", {
                  description: `Na versão final, “${f.name}” é baixado direto do armazenamento.`,
                });
              }
            }}
          >
            <Download className="h-3.5 w-3.5" /> Baixar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-bone/40">{k}</dt>
      <dd className="text-bone/85">{v}</dd>
    </div>
  );
}
