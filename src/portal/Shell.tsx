import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  CalendarClock,
  CalendarRange,
  CheckCircle2,
  ChevronsLeft,
  FolderOpen,
  Inbox,
  LayoutGrid,
  Layers,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  RotateCcw,
  Sparkles,
  UserRound,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/betterfly-logo-clean.png";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DEMO_CLIENT, TEAM } from "./data";
import { timeAgo } from "./format";
import { useDemo, useStats } from "./store";
import { AiMark, Avatar } from "./ui";

type Mode = "client" | "agency";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutGrid;
  badge?: number;
  dot?: boolean;
  exact?: boolean;
}

function useNav(mode: Mode): NavItem[] {
  const { state } = useDemo();
  const stats = useStats();
  const northUnread =
    state.convos.find((c) => c.id === "cv-north")?.messages.at(-1)?.from === "agent";
  if (mode === "client") {
    return [
      { label: "Visão geral", to: "/cliente/inicio", icon: LayoutGrid },
      { label: "Conteúdo", to: "/cliente/conteudo", icon: CalendarRange },
      {
        label: "Aprovações",
        to: "/cliente/aprovacoes",
        icon: CheckCircle2,
        badge: stats.pending.length,
      },
      { label: "Arquivos", to: "/cliente/arquivos", icon: FolderOpen },
      { label: "Mensagens", to: "/cliente/mensagens", icon: MessageSquare, dot: northUnread },
      { label: "Serviços", to: "/cliente/servicos", icon: Layers },
      { label: "Agenda", to: "/cliente/agenda", icon: CalendarClock },
      { label: "Notificações", to: "/cliente/notificacoes", icon: Bell },
    ];
  }
  return [
    { label: "Visão geral", to: "/cliente/agencia", icon: LayoutGrid, exact: true },
    { label: "Clientes", to: "/cliente/agencia/clientes", icon: UsersRound },
    { label: "Conteúdo", to: "/cliente/agencia/conteudo", icon: CalendarRange },
    {
      label: "Aprovações",
      to: "/cliente/agencia/aprovacoes",
      icon: CheckCircle2,
      badge: stats.agency.approvals,
    },
    { label: "Inbox", to: "/cliente/agencia/inbox", icon: Inbox, badge: stats.agency.waiting },
    { label: "Agenda", to: "/cliente/agencia/agenda", icon: CalendarClock },
    { label: "Equipe", to: "/cliente/agencia/equipe", icon: Users },
    { label: "Automação", to: "/cliente/agencia/automacao", icon: Sparkles },
    { label: "Arquivos", to: "/cliente/agencia/arquivos", icon: FolderOpen },
  ];
}

const isActive = (path: string, item: NavItem) =>
  item.exact
    ? path === item.to || path === `${item.to}/`
    : path === item.to || path.startsWith(`${item.to}/`);

export function PortalShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const mode: Mode = path.startsWith("/cliente/agencia") ? "agency" : "client";
  const nav = useNav(mode);
  const [collapsed, setCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem("bf-sidebar") === "1");
    } catch {
      /* ignorar */
    }
  }, []);
  const toggle = () => {
    setCollapsed((c) => {
      try {
        window.localStorage.setItem("bf-sidebar", c ? "0" : "1");
      } catch {
        /* ignorar */
      }
      return !c;
    });
  };

  useEffect(() => setMoreOpen(false), [path]);

  const mobileMain = mode === "client" ? [0, 1, 2, 4] : [0, 4, 1, 3];
  const mobileItems = mobileMain.map((i) => nav[i]!);
  const moreItems = nav.filter((_, i) => !mobileMain.includes(i));

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-bone">
      {/* Sidebar desktop */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-border bg-[oklch(0.125_0_0)] transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex",
          collapsed ? "w-[72px]" : "w-[248px]",
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center",
            collapsed ? "justify-center" : "justify-between px-5",
          )}
        >
          {!collapsed && (
            <Link to="/" aria-label="Site Betterfly">
              <img src={logo} alt="Betterfly" className="h-7 w-auto" />
            </Link>
          )}
          <button
            type="button"
            onClick={toggle}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            className="flex h-8 w-8 items-center justify-center rounded-md text-bone/40 transition-colors hover:bg-bone/[0.06] hover:text-bone"
          >
            <ChevronsLeft
              className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>

        <AccountBlock mode={mode} collapsed={collapsed} />

        <nav
          className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-3"
          aria-label="Navegação do portal"
        >
          {nav.map((item) => (
            <SideLink
              key={item.to}
              item={item}
              active={isActive(path, item)}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-border p-3">
          <SideButton
            icon={UserRound}
            label="Perfil"
            collapsed={collapsed}
            onClick={() =>
              toast("Perfil", {
                description:
                  "Dados da conta e preferências de notificação entram na etapa 3 da demo.",
              })
            }
          />
          <Link
            to="/cliente"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-bone/55 transition-colors hover:bg-bone/[0.05] hover:text-bone",
              collapsed && "justify-center px-0",
            )}
            title="Sair"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Sair"}
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar mode={mode} />
        <main className="relative min-h-0 flex-1 overflow-y-auto pb-[76px] md:pb-0">
          {children}
        </main>
      </div>

      {/* Navegação mobile */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-[oklch(0.125_0_0)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
        aria-label="Navegação principal"
      >
        {mobileItems.map((item) => {
          const active = isActive(path, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-[0.62rem]",
                active ? "text-acid" : "text-bone/50",
              )}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {(item.badge ?? 0) > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-acid px-1 text-[0.55rem] font-bold text-ink">
                    {item.badge}
                  </span>
                )}
                {item.dot && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-acid" />
                )}
              </span>
              {item.label === "Visão geral" ? "Início" : item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn(
            "flex flex-col items-center gap-1 py-2.5 text-[0.62rem]",
            moreOpen ? "text-acid" : "text-bone/50",
          )}
        >
          <MoreHorizontal className="h-5 w-5" />
          Mais
        </button>
      </nav>

      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-border bg-[oklch(0.15_0_0)] p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] md:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <AccountBlock mode={mode} collapsed={false} bare />
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  aria-label="Fechar"
                  className="p-2 text-bone/50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex flex-col items-center gap-2 rounded-lg border border-border px-2 py-4 text-xs text-bone/80"
                    >
                      <Icon className="h-5 w-5 text-bone/60" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <Link
                to="/cliente"
                className="mt-4 flex items-center justify-center gap-2 py-2 text-sm text-bone/50"
              >
                <LogOut className="h-4 w-4" /> Sair da demonstração
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccountBlock({
  mode,
  collapsed,
  bare,
}: {
  mode: Mode;
  collapsed: boolean;
  bare?: boolean;
}) {
  const content =
    mode === "client" ? (
      <>
        <Avatar initials="NS" tone="acid" className="h-9 w-9" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{DEMO_CLIENT.name}</p>
            <p className="truncate text-[0.7rem] text-bone/45">{DEMO_CLIENT.plan}</p>
          </div>
        )}
      </>
    ) : (
      <>
        <Avatar initials="MS" className="h-9 w-9" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{TEAM.marina.name}</p>
            <p className="truncate text-[0.7rem] text-bone/45">
              Equipe Betterfly · {TEAM.marina.role}
            </p>
          </div>
        )}
      </>
    );
  if (bare) return <div className="flex items-center gap-3">{content}</div>;
  return (
    <div
      className={cn(
        "mx-3 flex items-center gap-3 rounded-md border border-border p-2.5",
        collapsed && "justify-center border-0 p-0 py-2",
      )}
    >
      {content}
    </div>
  );
}

function SideLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active ? "bg-bone/[0.07] text-bone" : "text-bone/55 hover:bg-bone/[0.04] hover:text-bone",
        collapsed && "justify-center px-0",
      )}
    >
      {active && (
        <span className="absolute top-1/2 left-0 h-4 w-[2px] -translate-y-1/2 rounded-full bg-acid" />
      )}
      <span className="relative">
        <Icon className={cn("h-4 w-4 shrink-0", active && "text-acid")} />
        {collapsed && ((item.badge ?? 0) > 0 || item.dot) && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-acid" />
        )}
      </span>
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && (item.badge ?? 0) > 0 && (
        <span className="rounded-full bg-acid px-1.5 py-px text-[0.62rem] font-bold text-ink">
          {item.badge}
        </span>
      )}
      {!collapsed && item.dot && <span className="h-2 w-2 rounded-full bg-acid" />}
    </Link>
  );
}

function SideButton({
  icon: Icon,
  label,
  collapsed,
  onClick,
}: {
  icon: typeof LayoutGrid;
  label: string;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-bone/55 transition-colors hover:bg-bone/[0.05] hover:text-bone",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && label}
    </button>
  );
}

function TopBar({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const { reset } = useDemo();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 md:h-16 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Link to="/" className="md:hidden" aria-label="Site Betterfly">
          <img src={logo} alt="Betterfly" className="h-6 w-auto" />
        </Link>
        <span className="hidden items-center gap-2 rounded-full border border-acid/30 px-2.5 py-1 text-[0.58rem] font-medium tracking-[0.2em] text-acid uppercase sm:inline-flex">
          <span className="signal-dot h-1.5 w-1.5 rounded-full bg-acid" />
          Demo experience
        </span>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        <div className="flex items-center gap-2">
          <span className="hidden text-[0.7rem] text-bone/40 lg:inline">Visualizar como</span>
          <div
            className="flex rounded-full border border-border p-0.5 text-[0.68rem] font-medium"
            role="tablist"
            aria-label="Visualizar como"
          >
            {(
              [
                ["client", "Cliente", "/cliente/inicio"],
                ["agency", "Betterfly", "/cliente/agencia"],
              ] as const
            ).map(([m, label, to]) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                type="button"
                onClick={() => navigate({ to })}
                className={cn(
                  "rounded-full px-3 py-1.5 transition-all md:px-4",
                  mode === m ? "bg-bone text-ink" : "text-bone/55 hover:text-bone",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <NotificationsBell mode={mode} />

        <button
          type="button"
          title="Reiniciar demonstração"
          aria-label="Reiniciar demonstração"
          onClick={() => {
            reset();
            navigate({ to: mode === "client" ? "/cliente/inicio" : "/cliente/agencia" });
            toast.success("Demonstração reiniciada", {
              description: "Todos os dados voltaram ao estado inicial.",
            });
          }}
          className="hidden h-9 w-9 items-center justify-center rounded-full text-bone/40 transition-colors hover:bg-bone/[0.06] hover:text-bone sm:flex"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function NotificationsBell({ mode }: { mode: Mode }) {
  const { state } = useDemo();
  const stats = useStats();
  const [seen, setSeen] = useState(0);

  const items =
    mode === "client"
      ? [
          ...(stats.pending.length
            ? [
                {
                  id: "p",
                  text: `${stats.pending.length} conteúdos precisam da sua aprovação`,
                  at: new Date().toISOString(),
                  to: "/cliente/aprovacoes",
                },
              ]
            : []),
          ...state.activity.slice(0, 5).map((a) => ({
            id: a.id,
            text: a.text,
            at: a.at,
            to: a.contentId
              ? `/cliente/conteudo/${a.contentId}`
              : a.kind === "message"
                ? "/cliente/mensagens"
                : "/cliente/conteudo",
          })),
        ]
      : state.convos
          .filter((c) => c.status === "aguardando")
          .map((c) => ({
            id: c.id,
            text: `${state.clients.find((cl) => cl.id === c.clientId)?.name} aguarda atendimento: ${c.subject}`,
            at: c.messages.at(-1)!.at,
            to: "/cliente/agencia/inbox",
          }));

  const count = Math.max(0, items.length - seen);

  return (
    <Popover onOpenChange={(o) => o && setSeen(items.length)}>
      <PopoverTrigger
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-bone/60 transition-colors hover:bg-bone/[0.06] hover:text-bone"
        aria-label="Notificações"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-acid ring-2 ring-background" />
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] border-border bg-[oklch(0.16_0_0)] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="label-xs !text-bone/70">Notificações</p>
          {mode === "agency" && <AiMark className="h-5 w-5" />}
        </div>
        <ul className="max-h-[360px] overflow-y-auto">
          {items.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-bone/45">Tudo em dia por aqui.</li>
          )}
          {items.map((n) => (
            <li key={n.id}>
              <Link
                to={n.to}
                className="flex gap-3 px-4 py-3 transition-colors hover:bg-bone/[0.04]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-acid" />
                <span className="min-w-0">
                  <span className="block text-sm leading-snug text-bone/85">{n.text}</span>
                  <span className="mt-1 block text-[0.7rem] text-bone/40">{timeAgo(n.at)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
