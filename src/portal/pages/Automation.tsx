import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { BookOpen, CheckCircle2, FlaskConical, Hand, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { botReply } from "../bot";
import { DEMO_CLIENT, TEAM, type Convo, type TeamId, type TransferRule } from "../data";
import { useDemo, useStats } from "../store";
import { AiMark, PageHeader, Panel } from "../ui";

function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        on ? "bg-acid" : "bg-bone/15",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full shadow transition-transform",
          on ? "translate-x-[22px] bg-ink" : "translate-x-0.5 bg-bone/70",
        )}
      />
    </button>
  );
}

const KNOWLEDGE = [
  { name: "Calendário de conteúdo", detail: "Datas, status e legendas", sync: "tempo real" },
  { name: "Agenda", detail: "Captações, reuniões e entregas", sync: "tempo real" },
  { name: "Serviços contratados", detail: "Plano, escopo e responsáveis", sync: "tempo real" },
  { name: "Guia de marca", detail: "Tom de voz e identidade de cada cliente", sync: "há 3 dias" },
  {
    name: "Perguntas frequentes",
    detail: "24 respostas aprovadas pela equipe",
    sync: "há 1 semana",
  },
];

export function Automation() {
  const { state, setAi, updateRule } = useDemo();
  const { agency } = useStats();
  const { ai, rules } = state;
  const transfers = rules.reduce((s, r) => s + r.hits, 0);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-7 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Automação"
        title="IA Betterfly"
        subtitle="A IA faz o atendimento inicial com as informações do portal e transfere para a equipe seguindo as regras abaixo."
        actions={
          <div className="flex items-center gap-3 rounded-full border border-border py-1.5 pr-2 pl-4">
            <span className="text-xs text-bone/70">{ai.enabled ? "IA ativa" : "IA pausada"}</span>
            <Switch
              on={ai.enabled}
              label="Ativar IA"
              onChange={(v) => {
                setAi({ enabled: v });
                toast(v ? "IA Betterfly reativada" : "IA pausada", {
                  description: v
                    ? "Novas mensagens voltam a ser respondidas na hora."
                    : "Novas mensagens dos clientes vão direto para a Inbox da equipe.",
                });
              }}
            />
          </div>
        }
      />

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { n: agency.aiResolvedToday, label: "Resolvidas pela IA hoje", ai: true },
          { n: "8s", label: "Tempo médio de resposta" },
          { n: transfers, label: "Transferências no mês" },
          { n: rules.filter((r) => r.on).length, label: "Regras ativas" },
        ].map((k) => (
          <div key={k.label} className="rounded-md border border-border p-4">
            <p className={cn("font-display text-3xl tabular-nums", k.ai && "text-acid")}>{k.n}</p>
            <p className="mt-1 text-xs text-bone/50">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Panel
          title="Regras de transferência para humano"
          action={<span className="text-xs text-bone/40">Verificadas em ordem</span>}
        >
          <ul className="divide-y divide-border">
            {rules.map((r, i) => (
              <RuleRow key={r.id} r={r} n={i + 1} onChange={(patch) => updateRule(r.id, patch)} />
            ))}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Tester />

          <Panel title="Base de conhecimento">
            <ul className="divide-y divide-border">
              {KNOWLEDGE.map((k) => (
                <li key={k.name} className="flex items-center gap-3 px-5 py-3">
                  <BookOpen className="h-4 w-4 shrink-0 text-acid" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm">{k.name}</span>
                    <span className="block truncate text-xs text-bone/45">{k.detail}</span>
                  </span>
                  <span className="shrink-0 text-[0.65rem] text-bone/40">{k.sync}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Comportamento">
            <div className="space-y-5 px-5 py-4">
              <div>
                <p className="text-sm">Tom de voz</p>
                <div className="mt-2 grid grid-cols-2 gap-1 rounded-full border border-border p-1">
                  {(
                    [
                      ["proximo", "Próximo"],
                      ["formal", "Formal"],
                    ] as const
                  ).map(([v, label]) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={ai.tone === v}
                      onClick={() => setAi({ tone: v })}
                      className={cn(
                        "rounded-full py-1.5 text-xs transition-colors",
                        ai.tone === v ? "bg-bone/10 text-bone" : "text-bone/45 hover:text-bone",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span>
                  <span className="block text-sm">Atender fora do horário</span>
                  <span className="block text-xs text-bone/45">
                    À noite e nos fins de semana, a IA responde e deixa a transferência para o
                    próximo dia útil.
                  </span>
                </span>
                <Switch
                  on={ai.afterHours}
                  label="Atender fora do horário"
                  onChange={(v) => setAi({ afterHours: v })}
                />
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function RuleRow({
  r,
  n,
  onChange,
}: {
  r: TransferRule;
  n: number;
  onChange: (patch: Partial<TransferRule>) => void;
}) {
  return (
    <li className={cn("px-5 py-4 transition-opacity", !r.on && "opacity-55")}>
      <div className="flex items-start gap-4">
        <span className="mt-0.5 w-5 shrink-0 font-display text-sm text-bone/35 tabular-nums">
          {String(n).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{r.label}</p>
            {r.urgent && (
              <span className="rounded-full border border-orange-400/40 px-1.5 py-px text-[0.55rem] tracking-[0.14em] text-orange-300 uppercase">
                Prioridade
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-bone/50">{r.description}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {r.examples.map((ex) => (
              <span
                key={ex}
                className="rounded-full bg-bone/[0.05] px-2 py-0.5 text-[0.68rem] text-bone/60 italic"
              >
                “{ex}”
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-bone/55">
            <label className="flex items-center gap-2">
              Encaminhar para
              <select
                value={r.to}
                onChange={(e) => onChange({ to: e.target.value as TeamId | "responsavel" })}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-bone/85 focus:outline-none"
              >
                <option value="responsavel">Responsável pela conta</option>
                {(Object.keys(TEAM) as TeamId[]).map((id) => (
                  <option key={id} value={id}>
                    {TEAM[id].name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={r.urgent}
                onChange={(e) => onChange({ urgent: e.target.checked })}
                className="accent-[#BBD705]"
              />
              Prioridade alta
            </label>
            <span className="tabular-nums">
              {r.hits} {r.hits === 1 ? "vez" : "vezes"} no mês
            </span>
          </div>
        </div>
        <Switch
          on={r.on}
          label={r.label}
          onChange={(v) => {
            onChange({ on: v });
            toast(v ? "Regra ativada" : "Regra desativada", { description: r.label });
          }}
        />
      </div>
    </li>
  );
}

const SAMPLES = [
  "Quando é a próxima captação?",
  "Quero mudar a estratégia do mês que vem",
  "Preciso da segunda via do boleto",
  "Publicaram o post com o preço errado",
];

/** Simula a resposta da IA com as regras atuais, sem mexer em nenhuma conversa real. */
function Tester() {
  const { state } = useDemo();
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ q: string; rule?: TransferRule; reply: string } | null>(
    null,
  );

  const run = (q: string) => {
    const t = q.trim();
    if (!t) return;
    const fake: Convo = {
      id: "teste",
      clientId: DEMO_CLIENT.id,
      contact: DEMO_CLIENT.contact,
      subject: "",
      status: "ia",
      topics: [],
      messages: [],
    };
    const r = botReply(t, state, fake);
    const reply = r.messages.map((m) => m.text).join(" ");
    const rule = state.rules.find((x) => x.id === r.rule && x.on);
    setResult(rule ? { q: t, rule, reply } : { q: t, reply });
    setText("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(text);
  };

  const target = (r: TransferRule) =>
    r.to === "responsavel" ? "Responsável pela conta" : TEAM[r.to].name;

  return (
    <Panel title="Testar a IA">
      <div className="px-5 py-4">
        <p className="text-xs text-bone/50">
          Escreva como um cliente escreveria e veja o que a IA faria com as regras atuais.
        </p>
        <form onSubmit={submit} className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ex.: preciso da segunda via do boleto"
            className="min-w-0 flex-1 rounded-full border border-border bg-transparent px-4 py-2 text-sm placeholder:text-bone/35 focus:border-bone/35 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Testar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-acid text-ink disabled:opacity-40"
            disabled={!text.trim()}
          >
            <FlaskConical className="h-4 w-4" />
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => run(s)}
              className="rounded-full border border-border px-2.5 py-1 text-[0.68rem] text-bone/60 transition-colors hover:border-bone/30 hover:text-bone"
            >
              {s}
            </button>
          ))}
        </div>

        {result && (
          <motion.div
            key={result.q + (result.rule?.id ?? "")}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-3 border-t border-border pt-4"
          >
            <p className="text-sm text-bone/85">“{result.q}”</p>
            <div className="flex items-start gap-2.5">
              <AiMark className="h-6 w-6" />
              <p className="rounded-2xl rounded-tl-sm bg-bone/[0.06] px-3 py-2 text-xs leading-relaxed text-bone/80">
                {result.reply}
              </p>
            </div>
            {result.rule ? (
              <p className="flex items-start gap-2 rounded-md border border-orange-400/30 bg-orange-400/[0.05] px-3 py-2 text-xs text-orange-200">
                <Hand className="mt-px h-3.5 w-3.5 shrink-0" />
                <span>
                  Regra “{result.rule.label}” · oferece transferência para {target(result.rule)}
                  {result.rule.urgent ? " com prioridade alta" : ""}
                </span>
              </p>
            ) : (
              <p className="flex items-start gap-2 rounded-md border border-acid/30 bg-acid/[0.05] px-3 py-2 text-xs text-acid">
                <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" />
                Resolvido pela IA, sem transferência
              </p>
            )}
          </motion.div>
        )}
        {!result && (
          <p className="mt-4 flex items-center gap-2 text-[0.7rem] text-bone/35">
            <Zap className="h-3 w-3" /> Desligue uma regra e teste de novo para ver a diferença.
          </p>
        )}
      </div>
    </Panel>
  );
}
