import { Link } from "@tanstack/react-router";
import { Reveal, SectionLabel } from "./Reveal";

const PILLARS = [
  { t: "Estratégia", d: "Direção definida antes de qualquer publicação." },
  { t: "Organização", d: "Calendário, aprovações e prazos sempre visíveis." },
  { t: "Produção", d: "Equipe de foto, vídeo, design e texto na mesma mesa." },
  { t: "Acompanhamento", d: "Leitura periódica do que avançou e do que muda." },
  { t: "Comunicação", d: "Canal direto, respostas rápidas, sem ruído." },
];

const PORTAL_ROWS = [
  ["Ciclo atual", "Evolução · trimestre em curso"],
  ["Calendário", "Conteúdos planejados e aprovados"],
  ["Produções", "Agenda de captação e entregas"],
  ["Materiais", "Fotos, vídeos e artes liberadas"],
];

export function Experience() {
  return (
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionLabel index="06">Experiência Betterfly</SectionLabel>
        <h2 className="display-lg mt-8 max-w-[18ch]">O que acontece quando você entra</h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <ul className="border-t border-border">
              {PILLARS.map((p, i) => (
                <Reveal key={p.t} delay={i * 0.05}>
                  <li className="group grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-5 border-b border-border py-6 md:gap-8">
                    <span className="font-display text-xs text-acid">0{i + 1}</span>
                    <div className="min-w-0">
                      <h3 className="font-display text-xl transition-transform duration-500 group-hover:translate-x-1.5 md:text-2xl">
                        {p.t}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/55">{p.d}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Prévia conceitual do Portal */}
          <Reveal delay={0.15} className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-sm border border-border bg-card/60 p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-acid" />
                  <p className="label-xs">Portal Betterfly · prévia conceitual</p>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-[0.6rem] tracking-[0.18em] text-foreground/50 uppercase">
                  Em breve
                </span>
              </div>

              <p className="mt-8 font-display text-3xl leading-tight md:text-4xl">
                Sua marca em um só painel<span className="text-acid">.</span>
              </p>

              <ul className="mt-8 border-t border-border">
                {PORTAL_ROWS.map(([k, v]) => (
                  <li
                    key={k}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border py-4"
                  >
                    <span className="min-w-0 truncate text-sm text-foreground/75">{k}</span>
                    <span className="text-xs text-foreground/45">{v}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/cliente"
                  className="group inline-flex items-center gap-3 rounded-full border border-acid px-5 py-3 text-[0.7rem] font-medium tracking-[0.18em] text-acid uppercase transition-colors duration-300 hover:bg-acid hover:text-ink"
                >
                  Área do cliente
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </Link>
                <p className="text-xs text-foreground/40">
                  Um ambiente próprio para nossos clientes
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
