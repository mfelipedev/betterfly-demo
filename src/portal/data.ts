/*
 * Dados fictícios da demo do Portal Betterfly.
 * Fonte única: todas as telas derivam seus números daqui (via store).
 * As datas são relativas ao dia em que a demo é aberta, para nunca "envelhecerem".
 */
import case1 from "@/assets/case-1.jpg";
import case3 from "@/assets/case-3.jpg";
import case4 from "@/assets/case-4.jpg";
import prod1 from "@/assets/prod-1.jpg";
import prod3 from "@/assets/prod-3.jpg";

export type ContentType = "reels" | "carrossel" | "stories" | "foto" | "video";
export type ContentStatus =
  "ideia" | "producao" | "aguardando" | "ajuste" | "aprovado" | "programado" | "publicado";

export type Thumb =
  | { kind: "photo"; src: string; pos?: string }
  | { kind: "art"; text: string; tone: "acid" | "bone" | "ink" };

export type TeamId = "marina" | "bruno" | "ana";

export interface Version {
  n: number;
  at: string;
  note: string;
}

export interface HistoryEvent {
  id: string;
  at: string;
  text: string;
  kind: "sent" | "change" | "approved" | "comment" | "created";
}

export interface Comment {
  id: string;
  author: string;
  role: "client" | "agency";
  text: string;
  at: string;
}

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  channel: string;
  date: string;
  status: ContentStatus;
  owner: TeamId;
  thumb: Thumb;
  caption: string;
  script: string;
  goal: string;
  notes: string;
  versions: Version[];
  history: HistoryEvent[];
  comments: Comment[];
  approvedAt?: string;
}

export type MessageFrom = "client" | "ai" | "agent" | "system";

export interface Attachment {
  name: string;
  size: number;
  kind: "image" | "video" | "file";
  /** URL local (object URL) só para pré-visualizar imagens na sessão atual. */
  url?: string | undefined;
}

export interface Message {
  id: string;
  from: MessageFrom;
  agent?: TeamId;
  text: string;
  at: string;
  cards?: string[];
  links?: { label: string; to: string }[];
  actions?: "handoff";
  actionsDone?: boolean;
  attachment?: Attachment | undefined;
}

export type ConvoStatus = "ia" | "aguardando" | "humano" | "resolvida";

export interface Convo {
  id: string;
  clientId: string;
  contact: string;
  subject: string;
  status: ConvoStatus;
  agent?: TeamId | undefined;
  urgent?: boolean;
  unread?: boolean;
  typing?: MessageFrom | null;
  summary?: string;
  topics: string[];
  pendingOffer?: boolean;
  /** Última regra de transferência acionada pela IA. */
  rule?: string | undefined;
  messages: Message[];
}

export interface Client {
  id: string;
  name: string;
  initials: string;
  segment: string;
  plan: "Gestão Essencial" | "Essencial + Automação";
  owner: TeamId;
  approvals: number;
  changes: number;
  contact: string;
  since: string;
  /** Conteúdos planejados e publicados no ciclo atual. */
  planned: number;
  published: number;
  nextDelivery: string;
  nextDeliveryLabel: string;
  services: string[];
}

export interface Activity {
  id: string;
  at: string;
  text: string;
  kind: "sent" | "change" | "approved" | "calendar" | "message" | "system";
  contentId?: string;
}

export interface AgendaEvent {
  id: string;
  kind: "captacao" | "reuniao" | "entrega" | "publicacao";
  title: string;
  at: string;
  /** Duração em minutos. */
  duration: number;
  owner: TeamId;
  place: string;
  clientId: string;
  notes?: string;
  contentId?: string;
}

export type FolderId = "captacoes" | "aprovados" | "marca" | "relatorios" | "enviados";

export const FOLDERS: { id: FolderId; label: string; hint: string }[] = [
  { id: "captacoes", label: "Captações", hint: "Brutos e selecionados das sessões" },
  { id: "aprovados", label: "Aprovados", hint: "Peças finais prontas para publicar" },
  { id: "marca", label: "Identidade", hint: "Logotipos, fontes e guias" },
  { id: "relatorios", label: "Relatórios", hint: "Resultados e planejamentos" },
  { id: "enviados", label: "Enviados pelo cliente", hint: "O que o cliente compartilhou" },
];

export interface FileItem {
  id: string;
  clientId: string;
  folder: FolderId;
  name: string;
  kind: "image" | "video" | "file";
  size: number;
  at: string;
  by: string;
  src?: string | undefined;
  pos?: string | undefined;
}

export interface TransferRule {
  id: string;
  label: string;
  description: string;
  /** Expressão usada pela IA simulada para reconhecer o assunto. */
  pattern: string;
  examples: string[];
  on: boolean;
  to: TeamId | "responsavel";
  urgent: boolean;
  reply: string;
  hits: number;
}

export interface AiSettings {
  enabled: boolean;
  tone: "proximo" | "formal";
  afterHours: boolean;
}

export const TEAM: Record<TeamId, { name: string; first: string; role: string; initials: string }> =
  {
    marina: { name: "Marina Santos", first: "Marina", role: "Estratégia", initials: "MS" },
    bruno: { name: "Bruno Lima", first: "Bruno", role: "Social Media", initials: "BL" },
    ana: { name: "Ana Costa", first: "Ana", role: "Audiovisual", initials: "AC" },
  };

export const DEMO_CLIENT_ID = "north";

export const DEMO_CLIENT = {
  id: DEMO_CLIENT_ID,
  name: "North Studio",
  contact: "Lucas Andrade",
  contactFirst: "Lucas",
  email: "lucas@northstudio.com.br",
  segment: "Moda de movimento e lifestyle",
  plan: "Essencial + Automação" as const,
  owner: "marina" as TeamId,
  services: [
    { name: "Social Media", detail: "12 conteúdos por mês" },
    { name: "Tráfego Pago", detail: "Meta Ads" },
    { name: "Produção Audiovisual", detail: "1 captação mensal" },
    { name: "Estratégia", detail: "Reunião mensal" },
  ],
};

const CLIENT_EXTRA: Record<string, { contact: string; since: string }> = {
  north: { contact: "Lucas Andrade", since: "2024-03" },
  velora: { contact: "Camila Rocha", since: "2023-08" },
  nucleo: { contact: "Rafael Nunes", since: "2024-01" },
  casaverde: { contact: "Helena Prado", since: "2023-11" },
  altiora: { contact: "Pedro Alves", since: "2022-06" },
  mare: { contact: "Téo Martins", since: "2024-09" },
  lume: { contact: "Sofia Lemos", since: "2023-04" },
  brasa: { contact: "Diego Ferraz", since: "2025-02" },
  serra: { contact: "Júlia Serra", since: "2024-05" },
  nuvem: { contact: "Bianca Tavares", since: "2025-04" },
  kora: { contact: "Dr. André Kato", since: "2023-02" },
  vertice: { contact: "Renata Vieira", since: "2022-10" },
  linho: { contact: "Clara Menezes", since: "2025-01" },
  pulso: { contact: "Marta Ribeiro", since: "2024-11" },
  arco: { contact: "Fábio Arruda", since: "2022-03" },
  folego: { contact: "Igor Santana", since: "2025-06" },
  mira: { contact: "Paula Mira", since: "2024-07" },
  solar: { contact: "Chef Tomás Leal", since: "2025-03" },
};

export const STATUS_LABEL: Record<ContentStatus, string> = {
  ideia: "Ideia",
  producao: "Em produção",
  aguardando: "Aguardando aprovação",
  ajuste: "Ajuste solicitado",
  aprovado: "Aprovado",
  programado: "Programado",
  publicado: "Publicado",
};

export const TYPE_LABEL: Record<ContentType, string> = {
  reels: "Reels",
  carrossel: "Carrossel",
  stories: "Stories",
  foto: "Foto",
  video: "Vídeo",
};

export const APPROVED_STATUSES: ContentStatus[] = ["aprovado", "programado", "publicado"];

/** Dia base da demo (meia-noite local). */
export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function makeAt(base: Date) {
  return (days: number, h = 10, m = 0) => {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
}

/** Nome do mês (sem acento) relativo ao atual, para nomes de arquivo. */
function fmtMonth(offset: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset, 1);
  return d.toLocaleString("pt-BR", { month: "long" }).normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export interface Seed {
  seedDay: string;
  contents: Content[];
  convos: Convo[];
  clients: Client[];
  activity: Activity[];
  agenda: AgendaEvent[];
  files: FileItem[];
  rules: TransferRule[];
  ai: AiSettings;
  /** Até quando as notificações já foram lidas, por visão. */
  readAt: { client: string; agency: string };
  prefs: Record<string, boolean>;
}

export function buildSeed(now = new Date()): Seed {
  const base = new Date(now);
  base.setHours(0, 0, 0, 0);
  const at = makeAt(base);
  // Mensagens de "hoje" ficam sempre no passado recente, em qualquer horário da apresentação.
  const ago = (minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString();
  const hhmm = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  // Os primeiros eventos de cada tipo são os próximos da North Studio (usados na visão geral e pela IA).
  const agenda: AgendaEvent[] = [
    {
      id: "ev-captacao",
      kind: "captacao",
      title: "Captação Coleção Verão",
      at: at(2, 14),
      duration: 240,
      owner: "ana",
      place: "Estúdio Betterfly · Sala 2",
      clientId: "north",
      notes:
        "Looks da coleção Verão em movimento: 3 reels, 1 vídeo de campanha e fotos para carrossel. Levar 8 peças passadas e 2 modelos confirmados.",
    },
    {
      id: "ev-reuniao",
      kind: "reuniao",
      title: "Reunião de planejamento estratégico",
      at: at(8, 10),
      duration: 60,
      owner: "marina",
      place: "Google Meet",
      clientId: "north",
      notes: "Fechamento do mês, leitura de resultados e pauta do próximo ciclo.",
    },
    {
      id: "ev-entrega-rel",
      kind: "entrega",
      title: "Relatório mensal de resultados",
      at: at(10, 18),
      duration: 30,
      owner: "marina",
      place: "Portal · Arquivos",
      clientId: "north",
      notes: "Alcance, engajamento e investimento em mídia do ciclo, com recomendações.",
    },
    {
      id: "ev-entrega-edit",
      kind: "entrega",
      title: "Entrega da edição · Coleção Verão",
      at: at(6, 17),
      duration: 30,
      owner: "ana",
      place: "Portal · Aprovações",
      clientId: "north",
      notes: "Primeiros cortes dos reels captados, enviados para aprovação.",
    },
    {
      id: "ev-reuniao-old",
      kind: "reuniao",
      title: "Alinhamento de campanha",
      at: at(-6, 15),
      duration: 45,
      owner: "marina",
      place: "Google Meet",
      clientId: "north",
    },
    {
      id: "ev-captacao-old",
      kind: "captacao",
      title: "Captação Lifestyle Urbano",
      at: at(-12, 9),
      duration: 300,
      owner: "ana",
      place: "Centro histórico · externa",
      clientId: "north",
    },
    // Outros clientes (visíveis só na visão Betterfly)
    ...(
      [
        [
          "captacao",
          "Captação Menu Primavera",
          "casaverde",
          1,
          9,
          180,
          "ana",
          "Casa Verde · Pinheiros",
        ],
        ["reuniao", "Onboarding de campanha", "velora", 1, 16, 60, "marina", "Google Meet"],
        [
          "captacao",
          "Captação Drop de Verão",
          "mare",
          3,
          7,
          240,
          "ana",
          "Praia do Tombo · externa",
        ],
        ["reuniao", "Revisão de resultados", "nucleo", 4, 11, 45, "bruno", "Escritório Betterfly"],
        [
          "entrega",
          "Entrega do vídeo institucional",
          "altiora",
          5,
          18,
          30,
          "ana",
          "Portal · Aprovações",
        ],
        [
          "captacao",
          "Captação Grãos e Torra",
          "serra",
          6,
          8,
          180,
          "ana",
          "Serra Café · Torrefação",
        ],
        ["reuniao", "Planejamento trimestral", "vertice", 9, 14, 90, "marina", "Google Meet"],
        ["captacao", "Captação Enxoval", "linho", 11, 10, 180, "ana", "Estúdio Betterfly · Sala 1"],
        ["reuniao", "Kickoff de conteúdo", "folego", 13, 9, 60, "marina", "Google Meet"],
        ["reuniao", "Alinhamento mensal", "kora", -2, 10, 45, "marina", "Google Meet"],
        ["captacao", "Captação Aula Aberta", "pulso", -4, 7, 120, "ana", "Pulso Pilates"],
      ] as const
    ).map(([kind, title, clientId, d, h, duration, owner, place], i) => ({
      id: `ev-x${i}`,
      kind,
      title,
      at: at(d, h),
      duration,
      owner,
      place,
      clientId,
    })),
  ];

  const contents: Content[] = [
    {
      id: "c1",
      title: "Por que sua marca precisa parar de falar com todo mundo",
      type: "reels",
      channel: "Instagram",
      date: at(4, 18),
      status: "aguardando",
      owner: "marina",
      thumb: { kind: "photo", src: prod3 },
      caption:
        "Quem fala com todo mundo não é lembrado por ninguém. A North nasceu para quem vive em movimento, e é para essas pessoas que a gente cria. 🖤\n\nSalva esse vídeo e manda para quem precisa ouvir isso.\n\n#NorthStudio #MovimentoÉIdentidade",
      script:
        "00–03s · Gancho: “Sua marca fala com todo mundo? Então ela não fala com ninguém.”\n03–12s · Bastidores da North: peças em movimento, close em tecido.\n12–22s · Fala do Lucas sobre o público que inspira a marca.\n22–30s · Assinatura: “North Studio. Feita para quem se move.”",
      goal: "Reforçar o posicionamento da marca e aumentar salvamentos e compartilhamentos.",
      notes: "Versão 03 com a trilha nova aprovada na última conversa e a correção de cor final.",
      versions: [
        { n: 1, at: at(-5, 16), note: "Primeiro corte" },
        { n: 2, at: at(-3, 11), note: "Abertura mais rápida" },
        { n: 3, at: at(-1, 17, 20), note: "Trilha nova e correção de cor" },
      ],
      history: [
        { id: "h1", at: at(-5, 16), text: "Betterfly enviou a versão 01", kind: "sent" },
        { id: "h2", at: at(-4, 9, 40), text: "Lucas solicitou alteração", kind: "change" },
        { id: "h3", at: at(-3, 11), text: "Betterfly enviou a versão 02", kind: "sent" },
        { id: "h4", at: at(-2, 15, 10), text: "Lucas solicitou alteração", kind: "change" },
        { id: "h5", at: at(-1, 17, 20), text: "Betterfly enviou a versão 03", kind: "sent" },
      ],
      comments: [
        {
          id: "cm1",
          author: "Lucas Andrade",
          role: "client",
          text: "A abertura ainda está lenta. Dá para entrar direto na frase principal?",
          at: at(-4, 9, 40),
        },
        {
          id: "cm2",
          author: "Marina Santos",
          role: "agency",
          text: "Feito! Cortamos os 2 primeiros segundos na versão 02.",
          at: at(-3, 11, 5),
        },
        {
          id: "cm3",
          author: "Lucas Andrade",
          role: "client",
          text: "Ficou ótimo. Só queria uma trilha com mais energia.",
          at: at(-2, 15, 10),
        },
        {
          id: "cm4",
          author: "Marina Santos",
          role: "agency",
          text: "Trilha nova na versão 03, com a correção de cor também. 🙌",
          at: at(-1, 17, 22),
        },
      ],
    },
    {
      id: "c2",
      title: "Menos peças, mais intenção",
      type: "carrossel",
      channel: "Instagram",
      date: at(6, 12),
      status: "aguardando",
      owner: "bruno",
      thumb: { kind: "art", text: "Menos peças.\nMais intenção.", tone: "acid" },
      caption:
        "Um guarda-roupa de movimento não precisa de excesso. Precisa de peças que acompanham você do treino ao café. Arrasta para ver o guia. →",
      script:
        "Slide 1 · Capa: “Menos peças. Mais intenção.”\nSlide 2 · O problema do excesso\nSlides 3–6 · 4 peças essenciais da linha North\nSlide 7 · CTA: link na bio",
      goal: "Educar o público sobre a linha Essencial e gerar cliques para o site.",
      notes: "Fotos da captação de agosto. Textos revisados pelo time de conteúdo.",
      versions: [{ n: 1, at: at(-1, 10), note: "Primeira versão" }],
      history: [{ id: "h1", at: at(-1, 10), text: "Betterfly enviou a versão 01", kind: "sent" }],
      comments: [],
    },
    {
      id: "c3",
      title: "Bastidores da captação de verão",
      type: "stories",
      channel: "Instagram",
      date: at(3, 9),
      status: "aguardando",
      owner: "ana",
      thumb: { kind: "photo", src: prod1, pos: "40% center" },
      caption: "Sequência de 4 stories com enquete no último quadro.",
      script:
        "Story 1 · “Hoje tem captação 🎬”\nStory 2 · Set montado\nStory 3 · Prova de looks\nStory 4 · Enquete: “Qual look você quer ver primeiro?”",
      goal: "Gerar expectativa para a Coleção Verão e aumentar interação nos stories.",
      notes: "Stickers seguem o guia visual da North.",
      versions: [
        { n: 1, at: at(-3, 14), note: "Primeira versão" },
        { n: 2, at: at(-1, 12), note: "Enquete ajustada" },
      ],
      history: [
        { id: "h1", at: at(-3, 14), text: "Betterfly enviou a versão 01", kind: "sent" },
        { id: "h2", at: at(-2, 10), text: "Lucas solicitou alteração", kind: "change" },
        { id: "h3", at: at(-1, 12), text: "Betterfly enviou a versão 02", kind: "sent" },
      ],
      comments: [
        {
          id: "cm1",
          author: "Lucas Andrade",
          role: "client",
          text: "Na enquete, prefiro perguntar sobre looks em vez de cores.",
          at: at(-2, 10),
        },
      ],
    },
    {
      id: "c4",
      title: "Coleção Verão: o movimento começa",
      type: "reels",
      channel: "Instagram",
      date: at(7, 19),
      status: "ajuste",
      owner: "ana",
      thumb: { kind: "photo", src: case4, pos: "center 30%" },
      caption: "O verão da North começa em movimento. Coleção disponível em breve.",
      script:
        "00–05s · Atleta em silhueta, luz verde\n05–20s · Sequência de movimentos com as peças\n20–30s · Assinatura e data de lançamento",
      goal: "Anunciar a Coleção Verão e gerar lista de espera.",
      notes: "Ajuste em andamento: mais closes de tecido.",
      versions: [
        { n: 1, at: at(-4, 18), note: "Primeiro corte" },
        { n: 2, at: at(-2, 16), note: "Nova cor" },
      ],
      history: [
        { id: "h1", at: at(-4, 18), text: "Betterfly enviou a versão 01", kind: "sent" },
        { id: "h2", at: at(-3, 9), text: "Lucas solicitou alteração", kind: "change" },
        { id: "h3", at: at(-2, 16), text: "Betterfly enviou a versão 02", kind: "sent" },
        { id: "h4", at: at(-1, 11, 30), text: "Lucas solicitou alteração", kind: "change" },
      ],
      comments: [
        {
          id: "cm1",
          author: "Lucas Andrade",
          role: "client",
          text: "Quero ver mais o tecido em close, é o diferencial da coleção.",
          at: at(-1, 11, 30),
        },
        {
          id: "cm2",
          author: "Ana Costa",
          role: "agency",
          text: "Perfeito, vamos usar os takes macro da captação. Nova versão até amanhã.",
          at: at(-1, 14),
        },
      ],
    },
    {
      id: "c5",
      title: "Suba de nível: campanha Verão",
      type: "reels",
      channel: "Instagram",
      date: at(1, 19),
      status: "programado",
      owner: "marina",
      thumb: { kind: "photo", src: case1 },
      caption: "Cada degrau é uma escolha. Suba de nível com a North.",
      script: "Plano único em escada com linha de luz. Texto em tela e assinatura.",
      goal: "Abrir a campanha de verão com alcance.",
      notes: "Impulsionado no Meta Ads por 7 dias.",
      versions: [{ n: 1, at: at(-6, 15), note: "Versão final" }],
      history: [
        { id: "h1", at: at(-6, 15), text: "Betterfly enviou a versão 01", kind: "sent" },
        { id: "h2", at: at(-5, 10), text: "Lucas aprovou o conteúdo", kind: "approved" },
      ],
      comments: [],
      approvedAt: at(-5, 10),
    },
    {
      id: "c6",
      title: "Look do dia: linha Essencial",
      type: "foto",
      channel: "Instagram",
      date: at(2, 12),
      status: "programado",
      owner: "bruno",
      thumb: { kind: "photo", src: case4, pos: "center 70%" },
      caption: "Do treino à rua, sem trocar de roupa. Linha Essencial North.",
      script: "Foto única, recorte vertical.",
      goal: "Mostrar versatilidade da linha Essencial.",
      notes: "",
      versions: [{ n: 1, at: at(-5, 12), note: "Versão final" }],
      history: [
        { id: "h1", at: at(-5, 12), text: "Betterfly enviou a versão 01", kind: "sent" },
        { id: "h2", at: at(-4, 16), text: "Lucas aprovou o conteúdo", kind: "approved" },
      ],
      comments: [],
      approvedAt: at(-4, 16),
    },
    {
      id: "c7",
      title: "Tecidos que respiram",
      type: "carrossel",
      channel: "Instagram",
      date: at(-9, 12),
      status: "publicado",
      owner: "bruno",
      thumb: { kind: "art", text: "Tecidos\nque respiram", tone: "bone" },
      caption: "Por trás de cada peça North existe uma escolha de tecido. Arrasta para conhecer.",
      script: "6 slides educativos sobre os tecidos da marca.",
      goal: "Educar sobre qualidade de produto.",
      notes: "",
      versions: [{ n: 1, at: at(-14, 10), note: "Versão final" }],
      history: [
        { id: "h1", at: at(-14, 10), text: "Betterfly enviou a versão 01", kind: "sent" },
        { id: "h2", at: at(-13, 9), text: "Lucas aprovou o conteúdo", kind: "approved" },
      ],
      comments: [],
      approvedAt: at(-13, 9),
    },
    {
      id: "c8",
      title: "Jantar de lançamento North",
      type: "reels",
      channel: "Instagram",
      date: at(-6, 20),
      status: "publicado",
      owner: "ana",
      thumb: { kind: "photo", src: case3 },
      caption: "Uma noite para celebrar quem se move com a gente. Obrigado a todos que vieram. 🖤",
      script: "Recap de 30s do jantar de lançamento.",
      goal: "Relacionamento com comunidade e parceiros.",
      notes: "",
      versions: [{ n: 1, at: at(-8, 11), note: "Versão final" }],
      history: [
        { id: "h1", at: at(-8, 11), text: "Betterfly enviou a versão 01", kind: "sent" },
        { id: "h2", at: at(-8, 15), text: "Lucas aprovou o conteúdo", kind: "approved" },
      ],
      comments: [],
      approvedAt: at(-8, 15),
    },
    {
      id: "c9",
      title: "Enquete: qual look para o verão?",
      type: "stories",
      channel: "Instagram",
      date: at(-3, 9),
      status: "publicado",
      owner: "bruno",
      thumb: { kind: "art", text: "Qual look\npara o verão?", tone: "acid" },
      caption: "Stories com enquete de 2 opções.",
      script: "3 stories e enquete.",
      goal: "Pesquisa rápida com a audiência.",
      notes: "",
      versions: [{ n: 1, at: at(-5, 17), note: "Versão final" }],
      history: [
        { id: "h1", at: at(-5, 17), text: "Betterfly enviou a versão 01", kind: "sent" },
        { id: "h2", at: at(-4, 10), text: "Lucas aprovou o conteúdo", kind: "approved" },
      ],
      comments: [],
      approvedAt: at(-4, 10),
    },
    {
      id: "c10",
      title: "Manifesto North Studio",
      type: "video",
      channel: "YouTube",
      date: at(10, 18),
      status: "aprovado",
      owner: "marina",
      thumb: { kind: "art", text: "Movimento\né identidade", tone: "ink" },
      caption: "O manifesto da North, em 60 segundos.",
      script: "Narração em off sobre movimento, identidade e comunidade.",
      goal: "Peça institucional para site e YouTube.",
      notes: "Versão horizontal para site; recorte vertical sai em outro conteúdo.",
      versions: [{ n: 1, at: at(-3, 18), note: "Versão final" }],
      history: [
        { id: "h1", at: at(-3, 18), text: "Betterfly enviou a versão 01", kind: "sent" },
        { id: "h2", at: at(-2, 9), text: "Lucas aprovou o conteúdo", kind: "approved" },
      ],
      comments: [],
      approvedAt: at(-2, 9),
    },
    {
      id: "c11",
      title: "Rotina de treino com a linha Pro",
      type: "reels",
      channel: "Instagram",
      date: at(12, 18),
      status: "producao",
      owner: "ana",
      thumb: { kind: "art", text: "Em produção", tone: "ink" },
      caption: "",
      script: "Será gravado na captação desta semana.",
      goal: "Demonstrar performance da linha Pro.",
      notes: "Gravação prevista na próxima captação.",
      versions: [],
      history: [
        { id: "h1", at: at(-6, 10), text: "Pauta aprovada no planejamento", kind: "created" },
      ],
      comments: [],
    },
    {
      id: "c12",
      title: "Guia de tamanhos North",
      type: "carrossel",
      channel: "Instagram",
      date: at(14, 12),
      status: "producao",
      owner: "bruno",
      thumb: { kind: "art", text: "Em produção", tone: "ink" },
      caption: "",
      script: "Carrossel com tabela de medidas e dicas de caimento.",
      goal: "Reduzir dúvidas de compra no direct.",
      notes: "Aguardando tabela de medidas atualizada da North.",
      versions: [],
      history: [
        { id: "h1", at: at(-6, 10), text: "Pauta aprovada no planejamento", kind: "created" },
      ],
      comments: [],
    },
  ];

  const clients: Client[] = [
    [
      "north",
      "North Studio",
      "Moda e lifestyle",
      "Essencial + Automação",
      "marina",
      0,
      0,
      1,
      "Reels · Suba de nível",
    ],
    [
      "velora",
      "Vélora",
      "Beleza e skincare",
      "Essencial + Automação",
      "marina",
      2,
      1,
      1,
      "Carrossel · Rotina noturna",
    ],
    [
      "nucleo",
      "Núcleo Movimento",
      "Estúdio de treino",
      "Gestão Essencial",
      "bruno",
      3,
      1,
      2,
      "Reels · Desafio 21 dias",
    ],
    [
      "casaverde",
      "Casa Verde",
      "Gastronomia",
      "Essencial + Automação",
      "ana",
      1,
      0,
      3,
      "Fotos · Menu primavera",
    ],
    [
      "altiora",
      "Altiora",
      "Arquitetura",
      "Gestão Essencial",
      "marina",
      0,
      0,
      5,
      "Vídeo · Obra Jardins",
    ],
    [
      "mare",
      "Maré Surf Co.",
      "Surfwear",
      "Essencial + Automação",
      "bruno",
      2,
      1,
      1,
      "Stories · Drop de verão",
    ],
    [
      "lume",
      "Oficina Lume",
      "Iluminação e design",
      "Gestão Essencial",
      "ana",
      1,
      0,
      4,
      "Carrossel · Luminárias",
    ],
    [
      "brasa",
      "Brasa Burger Lab",
      "Hamburgueria",
      "Gestão Essencial",
      "bruno",
      0,
      0,
      2,
      "Reels · Novo smash",
    ],
    [
      "serra",
      "Serra Café",
      "Cafeteria",
      "Essencial + Automação",
      "ana",
      1,
      1,
      6,
      "Captação · Grãos",
    ],
    [
      "nuvem",
      "Atelier Nuvem",
      "Moda infantil",
      "Gestão Essencial",
      "bruno",
      0,
      0,
      3,
      "Fotos · Coleção",
    ],
    [
      "kora",
      "Kora Odonto",
      "Saúde",
      "Gestão Essencial",
      "marina",
      1,
      0,
      2,
      "Carrossel · Clareamento",
    ],
    [
      "vertice",
      "Vértice Imóveis",
      "Imobiliária",
      "Essencial + Automação",
      "marina",
      0,
      0,
      7,
      "Vídeo · Tour",
    ],
    [
      "linho",
      "Linho & Co.",
      "Casa e decoração",
      "Gestão Essencial",
      "bruno",
      0,
      0,
      4,
      "Fotos · Enxoval",
    ],
    [
      "pulso",
      "Pulso Pilates",
      "Bem-estar",
      "Gestão Essencial",
      "ana",
      0,
      0,
      3,
      "Reels · Aula aberta",
    ],
    [
      "arco",
      "Arco Engenharia",
      "Construção",
      "Gestão Essencial",
      "marina",
      0,
      0,
      9,
      "LinkedIn · Case",
    ],
    [
      "folego",
      "Fôlego Running",
      "Assessoria esportiva",
      "Essencial + Automação",
      "ana",
      0,
      0,
      5,
      "Reels · Treino longo",
    ],
    ["mira", "Mira Óptica", "Óptica", "Gestão Essencial", "bruno", 0, 0, 6, "Carrossel · Armações"],
    ["solar", "Solar Bistrô", "Gastronomia", "Gestão Essencial", "ana", 0, 0, 8, "Fotos · Brunch"],
  ].map(([id, name, segment, plan, owner, approvals, changes, days, label], i) => ({
    ...CLIENT_EXTRA[id as string]!,
    planned: id === "north" ? 12 : 8 + ((i * 5) % 9),
    published: id === "north" ? 0 : 2 + ((i * 3) % 5),
    id: id as string,
    name: name as string,
    initials: (name as string)
      .split(/\s+/)
      .filter((w) => /^[A-ZÀ-Ú]/.test(w))
      .slice(0, 2)
      .map((w) => w[0])
      .join(""),
    segment: segment as string,
    plan: plan as Client["plan"],
    owner: owner as TeamId,
    approvals: approvals as number,
    changes: changes as number,
    nextDelivery: at(days as number, 12),
    nextDeliveryLabel: label as string,
    services: ["Social Media", "Tráfego Pago", "Audiovisual"],
  }));

  let mid = 0;
  const msg = (m: Omit<Message, "id">): Message => ({ id: `seed-${++mid}`, ...m });

  const convos: Convo[] = [
    {
      id: "cv-north",
      clientId: "north",
      contact: DEMO_CLIENT.contact,
      subject: "Calendário da semana",
      status: "ia",
      topics: [],
      messages: [
        msg({
          from: "client",
          text: "Vocês já têm o calendário da próxima semana?",
          at: at(-1, 16, 2),
        }),
        msg({
          from: "ai",
          text: "Sim, Lucas. Estão programados o Reels “Suba de nível” e a foto da linha Essencial, além dos stories de bastidores da captação. Tudo aparece no seu Plano de Conteúdo.",
          at: at(-1, 16, 2),
          links: [{ label: "Abrir plano de conteúdo", to: "/cliente/conteudo" }],
        }),
        msg({ from: "client", text: "Perfeito, obrigado!", at: at(-1, 16, 4) }),
        msg({
          from: "ai",
          text: "Por nada! Sigo por aqui sempre que precisar.",
          at: at(-1, 16, 4),
        }),
      ],
    },
    {
      id: "cv-velora",
      clientId: "velora",
      contact: "Camila Rocha",
      subject: "Orçamento de captação extra",
      status: "aguardando",
      topics: [],
      unread: true,
      summary:
        "Cliente quer uma captação extra para o lançamento do sérum em outubro e pediu orçamento. Negociação comercial: fora das regras da IA, encaminhado para a equipe.",
      messages: [
        msg({
          from: "client",
          text: "Oi! Vamos lançar um sérum novo em outubro. Conseguimos uma captação extra?",
          at: ago(250),
        }),
        msg({
          from: "ai",
          text: "Oi, Camila! Seu plano inclui 1 captação por mês, e a de outubro está prevista para o dia 14. Uma captação extra envolve orçamento, então vou encaminhar para a equipe.",
          at: ago(250),
        }),
        msg({
          from: "system",
          text: "Conversa encaminhada para a equipe Betterfly.",
          at: ago(249),
        }),
      ],
    },
    {
      id: "cv-nucleo",
      clientId: "nucleo",
      contact: "Rafael Nunes",
      subject: "Legenda do carrossel",
      status: "humano",
      agent: "bruno",
      topics: [],
      summary: "Cliente pediu ajuste de tom na legenda do carrossel “Desafio 21 dias”.",
      messages: [
        msg({
          from: "client",
          text: "A legenda do carrossel ficou formal demais pra gente.",
          at: ago(190),
        }),
        msg({
          from: "ai",
          text: "Entendi, Rafael. Ajustes de texto passam pela equipe de conteúdo. Vou encaminhar com o contexto.",
          at: ago(190),
        }),
        msg({
          from: "system",
          text: `Bruno assumiu o atendimento às ${hhmm(ago(178))}.`,
          at: ago(178),
        }),
        msg({
          from: "agent",
          agent: "bruno",
          text: "Oi, Rafael! Já estou reescrevendo com um tom mais próximo. Te mando a nova versão ainda hoje.",
          at: ago(177),
        }),
      ],
    },
    {
      id: "cv-casaverde",
      clientId: "casaverde",
      contact: "Helena Prado",
      subject: "Datas de publicação",
      status: "ia",
      topics: [],
      messages: [
        msg({ from: "client", text: "Quando sai o post do menu de primavera?", at: ago(150) }),
        msg({
          from: "ai",
          text: "Oi, Helena! As fotos do menu de primavera estão programadas para daqui a 3 dias, às 12h.",
          at: ago(150),
        }),
      ],
    },
    {
      id: "cv-mare",
      clientId: "mare",
      contact: "Téo Martins",
      subject: "Post publicado com preço errado",
      status: "aguardando",
      urgent: true,
      unread: true,
      topics: [],
      summary:
        "Cliente relata que o post do drop de verão saiu com preço antigo. Situação sensível: requer correção imediata e resposta humana.",
      messages: [
        msg({
          from: "client",
          text: "O post de hoje saiu com o preço antigo da prancha!! Precisamos corrigir.",
          at: ago(40),
        }),
        msg({
          from: "ai",
          text: "Entendo a urgência, Téo. Já encaminhei para a equipe como prioridade, com o link do post.",
          at: ago(40),
        }),
        msg({
          from: "system",
          text: "Conversa encaminhada para a equipe Betterfly.",
          at: ago(39),
        }),
      ],
    },
    {
      id: "cv-serra",
      clientId: "serra",
      contact: "Júlia Serra",
      subject: "Reagendar captação",
      status: "humano",
      agent: "ana",
      topics: [],
      summary: "Cliente precisa mudar a data da captação de grãos por conta de um evento.",
      messages: [
        msg({
          from: "client",
          text: "Precisamos mudar a data da captação, teremos um evento na loja.",
          at: ago(300),
        }),
        msg({
          from: "system",
          text: `Ana assumiu o atendimento às ${hhmm(ago(289))}.`,
          at: ago(289),
        }),
        msg({
          from: "agent",
          agent: "ana",
          text: "Sem problemas, Júlia! Tenho horários na terça ou quinta. Qual fica melhor?",
          at: ago(288),
        }),
      ],
    },
    {
      id: "cv-altiora",
      clientId: "altiora",
      contact: "Pedro Alves",
      subject: "Arquivos da obra Jardins",
      status: "resolvida",
      topics: [],
      messages: [
        msg({ from: "client", text: "Onde encontro as fotos da obra Jardins?", at: at(-1, 14) }),
        msg({
          from: "ai",
          text: "Estão em Arquivos › Captações › Obra Jardins, com 48 fotos em alta resolução.",
          at: at(-1, 14),
        }),
        msg({ from: "client", text: "Achei, valeu!", at: at(-1, 14, 3) }),
      ],
    },
    {
      id: "cv-lume",
      clientId: "lume",
      contact: "Sofia Lemos",
      subject: "Próxima reunião",
      status: "resolvida",
      topics: [],
      messages: [
        msg({ from: "client", text: "Qual a data da nossa próxima reunião?", at: at(-1, 10) }),
        msg({
          from: "ai",
          text: "A próxima reunião mensal é daqui a 9 dias, às 15h, com a Ana.",
          at: at(-1, 10),
        }),
      ],
    },
  ];

  const activity: Activity[] = [
    {
      id: "a1",
      at: at(-1, 17, 20),
      text: "Nova versão do Reels “Por que sua marca precisa parar de falar com todo mundo” enviada para aprovação",
      kind: "sent",
      contentId: "c1",
    },
    {
      id: "a2",
      at: at(-1, 12),
      text: "Stories “Bastidores da captação de verão” atualizado com o ajuste solicitado",
      kind: "change",
      contentId: "c3",
    },
    {
      id: "a3",
      at: at(-1, 10),
      text: "Carrossel “Menos peças, mais intenção” enviado para aprovação",
      kind: "sent",
      contentId: "c2",
    },
    { id: "a4", at: at(-2, 18), text: "Calendário do próximo ciclo atualizado", kind: "calendar" },
    {
      id: "a5",
      at: at(-2, 9),
      text: "Você aprovou o vídeo “Manifesto North Studio”",
      kind: "approved",
      contentId: "c10",
    },
    {
      id: "a6",
      at: at(-6, 16),
      text: "Resumo do alinhamento de campanha disponível em Arquivos",
      kind: "system",
    },
    {
      id: "a7",
      at: at(-9, 11),
      text: "Fotos selecionadas da captação Lifestyle Urbano disponíveis",
      kind: "system",
    },
    {
      id: "a8",
      at: at(-14, 15),
      text: "Relatório mensal de resultados publicado",
      kind: "system",
    },
  ];

  const MB = 1024 * 1024;
  let fid = 0;
  const file = (
    clientId: string,
    folder: FolderId,
    name: string,
    kind: FileItem["kind"],
    sizeMb: number,
    days: number,
    by: string,
    src?: string,
    pos?: string,
  ): FileItem => ({
    id: `f${++fid}`,
    clientId,
    folder,
    name,
    kind,
    size: Math.round(sizeMb * MB),
    at: at(days, 9 + (fid % 8), (fid * 7) % 60),
    by,
    src,
    pos,
  });
  const files: FileItem[] = [
    file("north", "captacoes", "verao-look-01.jpg", "image", 8.4, -1, "Ana Costa", case1),
    file("north", "captacoes", "verao-look-02.jpg", "image", 7.9, -1, "Ana Costa", prod1),
    file(
      "north",
      "captacoes",
      "verao-look-03.jpg",
      "image",
      9.1,
      -1,
      "Ana Costa",
      case3,
      "center 30%",
    ),
    file("north", "captacoes", "bastidores-verao.mp4", "video", 412, -1, "Ana Costa", case4),
    file("north", "captacoes", "lifestyle-urbano-sel.jpg", "image", 6.2, -12, "Ana Costa", prod3),
    file("north", "captacoes", "lifestyle-urbano-bruto.zip", "file", 2380, -12, "Ana Costa"),
    file("north", "aprovados", "reels-drop-outono-final.mp4", "video", 96, -5, "Bruno Lima", case3),
    file("north", "aprovados", "carrossel-guia-de-caimento.pdf", "file", 14.2, -3, "Bruno Lima"),
    file("north", "aprovados", "campanha-outono-capa.jpg", "image", 5.6, -8, "Bruno Lima", case4),
    file(
      "north",
      "aprovados",
      "stories-bastidores-01.jpg",
      "image",
      3.1,
      -2,
      "Bruno Lima",
      prod1,
      "center 20%",
    ),
    file("north", "marca", "north-studio-logo.svg", "file", 0.04, -140, "Marina Santos"),
    file("north", "marca", "guia-de-marca-2025.pdf", "file", 18.7, -140, "Marina Santos"),
    file("north", "marca", "tipografia-north.zip", "file", 2.3, -140, "Marina Santos"),
    file("north", "relatorios", `relatorio-${fmtMonth(-1)}.pdf`, "file", 4.8, -20, "Marina Santos"),
    file("north", "relatorios", "planejamento-trimestral.pdf", "file", 6.1, -24, "Marina Santos"),
    file("north", "enviados", "briefing-colecao-verao.pdf", "file", 2.2, -15, "Lucas Andrade"),
    file(
      "north",
      "enviados",
      "referencias-verao.jpg",
      "image",
      1.9,
      -15,
      "Lucas Andrade",
      prod3,
      "center 70%",
    ),
    file(
      "velora",
      "captacoes",
      "rotina-noturna-01.jpg",
      "image",
      7.2,
      -3,
      "Ana Costa",
      case1,
      "center 60%",
    ),
    file(
      "velora",
      "relatorios",
      `relatorio-${fmtMonth(-1)}.pdf`,
      "file",
      3.9,
      -19,
      "Marina Santos",
    ),
    file(
      "casaverde",
      "captacoes",
      "menu-primavera-teste.jpg",
      "image",
      6.6,
      -2,
      "Ana Costa",
      prod3,
    ),
    file(
      "altiora",
      "aprovados",
      "obra-jardins-corte-final.mp4",
      "video",
      640,
      -1,
      "Ana Costa",
      case4,
      "center 80%",
    ),
    file("altiora", "enviados", "plantas-obra-jardins.pdf", "file", 22.4, -9, "Pedro Alves"),
    file(
      "mare",
      "aprovados",
      "drop-verao-stories.mp4",
      "video",
      48,
      -4,
      "Bruno Lima",
      case3,
      "center 60%",
    ),
    file("nucleo", "relatorios", "desafio-21-dias-roteiro.pdf", "file", 1.2, -2, "Bruno Lima"),
    file("serra", "enviados", "fotos-torra-celular.zip", "file", 164, -6, "Júlia Serra"),
  ];

  const rules: TransferRule[] = [
    {
      id: "equipe",
      label: "Cliente pede para falar com uma pessoa",
      description:
        "Sempre que o cliente pedir atendimento humano, a IA oferece a transferência na hora.",
      pattern:
        "(falar|conversar|atendimento).*(equipe|pessoa|humano|atendente|alguem|marina)|atendimento humano",
      examples: ["Quero falar com alguém da equipe", "Preciso de atendimento humano"],
      on: true,
      to: "responsavel",
      urgent: false,
      reply:
        "Claro! Posso encaminhar agora para a equipe Betterfly. Quem assumir já recebe todo o histórico desta conversa.",
      hits: 9,
    },
    {
      id: "estrategia",
      label: "Mudança de estratégia ou posicionamento",
      description: "Decisões de rumo da marca ficam com a estratégia, não com a IA.",
      pattern: "estrateg|mudar|mudanca|reposicion|posicionamento",
      examples: ["Quero mudar a estratégia do mês que vem", "Podemos repensar o posicionamento?"],
      on: true,
      to: "marina",
      urgent: false,
      reply: "Esse assunto merece uma conversa com nossa equipe estratégica.",
      hits: 4,
    },
    {
      id: "financeiro",
      label: "Orçamento, contrato ou pagamento",
      description: "Valores, propostas, notas e contratos nunca são respondidos pela IA.",
      pattern: "orcament|preco|valor|contrato|pagamento|boleto|nota fiscal|fatura|cancel",
      examples: ["Quanto custa uma captação extra?", "Preciso da segunda via do boleto"],
      on: true,
      to: "marina",
      urgent: false,
      reply: "Valores e contratos são tratados diretamente pela nossa equipe.",
      hits: 6,
    },
    {
      id: "reclamacao",
      label: "Reclamação, erro ou insatisfação",
      description: "Encaminha com prioridade alta e avisa o responsável pela conta.",
      pattern: "reclama|insatisf|errad|erro\\b|problema|chatead|decepcion|pessimo",
      examples: ["Publicaram o post com o preço errado", "Não gostei do resultado"],
      on: true,
      to: "responsavel",
      urgent: true,
      reply: "Sinto muito por isso. Vou levar agora para a equipe com prioridade.",
      hits: 2,
    },
    {
      id: "urgente",
      label: "Pedido urgente",
      description: "Mensagens com urgência explícita vão direto para a fila prioritária.",
      pattern: "urgente|urgencia|imediat|o quanto antes|agora mesmo",
      examples: ["É urgente, preciso tirar um post do ar", "Preciso disso o quanto antes"],
      on: false,
      to: "bruno",
      urgent: true,
      reply: "Entendi a urgência. Vou chamar a equipe agora mesmo.",
      hits: 0,
    },
    {
      id: "sem-resposta",
      label: "IA sem resposta confiável",
      description: "Quando a informação não está no portal, a IA prefere transferir a arriscar.",
      pattern: "",
      examples: ["Perguntas fora do contexto do projeto"],
      on: true,
      to: "responsavel",
      urgent: false,
      reply:
        "Não encontrei uma resposta confiável para isso nas informações do seu projeto. Prefere que eu encaminhe para a equipe?",
      hits: 3,
    },
  ];

  return {
    seedDay: todayKey(now),
    contents,
    convos,
    clients,
    activity,
    agenda,
    files,
    rules,
    ai: { enabled: true, tone: "proximo", afterHours: true },
    readAt: { client: at(-3), agency: at(-3) },
    prefs: {
      aprovacao: true,
      mensagem: true,
      agenda: true,
      arquivo: false,
      email: true,
      whatsapp: false,
    },
  };
}
