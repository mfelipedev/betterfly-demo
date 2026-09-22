/*
 * IA simulada da demo: respostas roteirizadas a partir dos dados do portal.
 * Não há IA real aqui; a intenção é mostrar como a IA usaria o contexto do cliente.
 */
import { APPROVED_STATUSES, DEMO_CLIENT, type Content, type Convo, type Seed } from "./data";
import { fmt, longDate, nextMonthName } from "./format";

export interface BotReply {
  messages: {
    text: string;
    cards?: string[];
    links?: { label: string; to: string }[];
    actions?: "handoff";
  }[];
  topics: string[];
  pendingOffer?: boolean;
  /** Regra de transferência que gerou a resposta. */
  rule?: string;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const pendingOf = (contents: Content[]) => contents.filter((c) => c.status === "aguardando");

export function botReply(text: string, state: Seed, convo: Convo): BotReply {
  const t = norm(text);
  const first = DEMO_CLIENT.contactFirst;
  const pending = pendingOf(state.contents);
  const captacao = state.agenda.find((e) => e.kind === "captacao")!;
  const reuniao = state.agenda.find((e) => e.kind === "reuniao")!;
  const hello = /^(oi|ola|opa|bom dia|boa tarde|boa noite|e ai)\b/.test(t);
  const hi = hello ? `Olá, ${first}. ` : "";

  const pendingMsg = () =>
    pending.length
      ? pending.length === 1
        ? "Também existe 1 conteúdo aguardando sua aprovação. Quer que eu abra para você?"
        : `Também existem ${pending.length} conteúdos aguardando sua aprovação. Quer que eu abra para você?`
      : "E seus conteúdos estão todos aprovados. 👌";

  // Aceitar a oferta anterior ("pode abrir", "sim"...)
  if (convo.pendingOffer && /^(sim|pode|abre|abrir|quero|claro|ok|por favor|manda)/.test(t)) {
    return {
      topics: ["aprovacoes"],
      messages: pending.length
        ? [
            {
              text: "Claro. Separei os conteúdos pendentes abaixo.",
              cards: pending.map((c) => c.id),
            },
          ]
        : [{ text: "Tudo certo: não há conteúdos aguardando sua aprovação agora." }],
    };
  }

  // Regras de transferência configuradas em Automação (na ordem da lista).
  for (const rule of state.rules) {
    if (!rule.pattern || !new RegExp(rule.pattern).test(t)) continue;
    if (!rule.on) {
      // Regra desligada: a IA só redireciona pedidos de atendimento humano para um recado.
      if (rule.id === "equipe")
        return {
          topics: ["equipe"],
          rule: rule.id,
          messages: [
            {
              text: "Por aqui o atendimento inicial é comigo. Me conta o que você precisa e eu deixo registrado para a equipe.",
            },
          ],
        };
      continue;
    }
    return {
      topics: [rule.id],
      rule: rule.id,
      messages:
        rule.id === "equipe"
          ? [{ text: rule.reply, actions: "handoff" }]
          : [{ text: rule.reply }, { text: "Posso encaminhar você agora?", actions: "handoff" }],
    };
  }

  if (/(captac|gravac|gravar|grava|filmag|shooting|sessao de fotos)/.test(t)) {
    return {
      topics: ["captacao"],
      pendingOffer: pending.length > 0,
      messages: [
        {
          text: `${hi}A próxima captação da North Studio está marcada para ${longDate(captacao.at)}, no ${captacao.place}.`,
        },
        { text: pendingMsg() },
      ],
    };
  }

  if (/(aprov|pendent|aguardando)/.test(t)) {
    return {
      topics: ["aprovacoes"],
      messages: pending.length
        ? [
            {
              text: `${hi}Você tem ${pending.length} ${pending.length === 1 ? "conteúdo aguardando" : "conteúdos aguardando"} aprovação:`,
              cards: pending.map((c) => c.id),
            },
          ]
        : [{ text: `${hi}Nenhum conteúdo aguardando aprovação agora. Tudo em dia! ✓` }],
    };
  }

  if (/(reuniao|reunir|meet)/.test(t)) {
    return {
      topics: ["reuniao"],
      messages: [
        { text: `${hi}A próxima reunião é ${longDate(reuniao.at)}, pelo ${reuniao.place}.` },
      ],
    };
  }

  if (/(calend|programad|publica|semana|postage|posts?\b)/.test(t)) {
    const now = Date.now();
    const upcoming = state.contents
      .filter((c) => new Date(c.date).getTime() > now && c.status !== "producao")
      .sort((a, b) => +new Date(a.date) - +new Date(b.date))
      .slice(0, 4);
    const lines = upcoming.map((c) => `• ${fmt(c.date, "dd/MM")}: ${c.title}`).join("\n");
    const approved = state.contents.filter((c) => APPROVED_STATUSES.includes(c.status)).length;
    return {
      topics: ["calendario"],
      messages: [
        {
          text: `${hi}Seu calendário tem ${state.contents.length} conteúdos neste ciclo, com ${approved} já aprovados. Os próximos são:\n${lines}`,
          links: [{ label: "Abrir plano de conteúdo", to: "/cliente/conteudo" }],
        },
      ],
    };
  }

  if (/(entrega|status|producao|andamento|prazo)/.test(t)) {
    const prod = state.contents.filter((c) => c.status === "producao" || c.status === "ajuste");
    const lines = prod
      .map((c) => `• ${c.title}: ${c.status === "ajuste" ? "em ajuste" : "em produção"}`)
      .join("\n");
    return {
      topics: ["entregas"],
      messages: [{ text: `${hi}Neste momento estão em andamento:\n${lines}` }],
    };
  }

  if (/(servic|plano|contrat|inclui)/.test(t)) {
    const list = DEMO_CLIENT.services.map((s) => `• ${s.name}: ${s.detail}`).join("\n");
    return {
      topics: ["servicos"],
      messages: [{ text: `${hi}Seu plano ${DEMO_CLIENT.plan} inclui:\n${list}` }],
    };
  }

  if (hello || /^(obrigad|valeu|show|perfeito|otimo)/.test(t)) {
    return {
      topics: [],
      messages: [
        {
          text: hello
            ? `Olá, ${first}! Posso ajudar com seus conteúdos, agenda, entregas ou chamar alguém da equipe.`
            : "Por nada! Sigo por aqui sempre que precisar.",
        },
      ],
    };
  }

  const fallback = state.rules.find((r) => r.id === "sem-resposta");
  if (fallback && !fallback.on) {
    return {
      topics: ["sem-resposta-ia"],
      messages: [
        {
          text: "Ainda não tenho essa informação no seu projeto. Deixei sua pergunta registrada e a equipe complementa por aqui.",
        },
      ],
    };
  }
  return {
    topics: ["sem-resposta"],
    rule: "sem-resposta",
    messages: [
      { text: fallback?.reply ?? "Prefere que eu encaminhe para a equipe?", actions: "handoff" },
    ],
  };
}

/** Resumo que a equipe recebe ao assumir a conversa. */
export function buildSummary(convo: Convo, state: Seed) {
  const captacao = state.agenda.find((e) => e.kind === "captacao")!;
  const parts: string[] = [];
  const has = (t: string) => convo.topics.includes(t);
  if (has("estrategia"))
    parts.push(`Cliente deseja discutir mudança na estratégia de ${nextMonthName()}.`);
  if (has("equipe") && !has("estrategia")) parts.push("Cliente pediu para falar com a equipe.");
  if (has("sem-resposta")) parts.push("A IA não encontrou resposta confiável para uma pergunta.");
  if (has("captacao"))
    parts.push(
      `Perguntou anteriormente sobre a próxima captação (${fmt(captacao.at, "dd/MM 'às' HH'h'")}).`,
    );
  if (has("aprovacoes")) parts.push("Consultou os conteúdos aguardando aprovação.");
  if (has("calendario")) parts.push("Consultou o calendário de publicações.");
  if (has("financeiro")) parts.push("Assunto financeiro: orçamento, contrato ou pagamento.");
  if (has("reclamacao")) parts.push("Cliente relatou um problema ou insatisfação.");
  if (has("urgente")) parts.push("Cliente sinalizou urgência.");
  if (!parts.length) parts.push("Cliente solicitou atendimento da equipe.");
  return parts.join(" ");
}
