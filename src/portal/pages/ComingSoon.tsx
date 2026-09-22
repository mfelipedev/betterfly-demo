import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { btn } from "../ui";

const SECTIONS: Record<string, { title: string; stage: 2 | 3; items: string[] }> = {
  arquivos: {
    title: "Arquivos",
    stage: 2,
    items: [
      "Captações, fotos, vídeos e artes organizados",
      "Grade e lista com busca",
      "Materiais aprovados sempre à mão",
    ],
  },
  servicos: {
    title: "Serviços",
    stage: 3,
    items: [
      "Serviços contratados e status",
      "Próxima entrega e responsável",
      "Última atualização de cada frente",
    ],
  },
  agenda: {
    title: "Agenda",
    stage: 2,
    items: [
      "Captações, reuniões, entregas e publicações",
      "Detalhes de cada evento",
      "Adicionar ao seu calendário",
    ],
  },
  notificacoes: {
    title: "Notificações",
    stage: 3,
    items: [
      "Central agrupada por Hoje, Esta semana e Anteriores",
      "Aprovações, versões, mensagens e agenda",
    ],
  },
  clientes: {
    title: "Clientes",
    stage: 2,
    items: [
      "Lista com plano, responsável e pendências",
      "Filtros por status",
      "Visão 360 de cada cliente",
    ],
  },
  conteudo: {
    title: "Conteúdo",
    stage: 2,
    items: ["Calendário de todos os clientes", "Filtro por cliente, formato e status"],
  },
  aprovacoes: {
    title: "Aprovações",
    stage: 2,
    items: ["Todas as aprovações da operação", "Lembretes e prazos"],
  },
  equipe: {
    title: "Equipe",
    stage: 3,
    items: ["Membros e disponibilidade", "Clientes, conversas e pendências por pessoa"],
  },
  automacao: {
    title: "Automação",
    stage: 2,
    items: [
      "IA Betterfly e seus recursos",
      "Base de conhecimento",
      "Regras de transferência para humano",
    ],
  },
};

export function ComingSoon({ section, agency }: { section: string; agency?: boolean }) {
  const s = SECTIONS[section] ?? { title: "Em breve", stage: 2 as const, items: [] };
  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center px-6 py-16">
      <p className="label-xs">Etapa {s.stage} da demonstração</p>
      <h1 className="mt-4 font-display text-4xl font-medium md:text-5xl">{s.title}</h1>
      <p className="mt-4 text-bone/55">
        Este módulo entra na próxima etapa da demo. Ele vai reunir:
      </p>
      <ul className="mt-6 space-y-3 border-t border-border pt-6">
        {s.items.map((it) => (
          <li key={it} className="flex items-center gap-3 text-sm text-bone/80">
            <span className="h-1.5 w-1.5 rounded-full bg-acid" /> {it}
          </li>
        ))}
      </ul>
      <Link
        to={agency ? "/cliente/agencia" : "/cliente/inicio"}
        className={`${btn.ghost} mt-10 self-start`}
      >
        Voltar para a visão geral <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
