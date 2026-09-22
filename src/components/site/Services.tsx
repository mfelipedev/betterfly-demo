import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Reveal, SectionLabel } from "./Reveal";

const SERVICES = [
  {
    n: "01",
    title: "Estratégia & posicionamento",
    lead: "Onde a marca está, onde pode chegar e o que precisa mudar.",
    items: ["Diagnóstico de marca", "Territórios de comunicação", "Narrativa e tom de voz", "Plano de crescimento"],
  },
  {
    n: "02",
    title: "Social media",
    lead: "Presença com estética, ritmo e intenção em cada publicação.",
    items: ["Direção criativa", "Calendário editorial", "Copy e design", "Gestão de comunidade"],
  },
  {
    n: "03",
    title: "Tráfego pago",
    lead: "Mídia construída sobre estratégia, não sobre impulso.",
    items: ["Estrutura de campanhas", "Criativos para performance", "Testes e otimização", "Leitura de dados"],
  },
  {
    n: "04",
    title: "Audiovisual",
    lead: "Produção audiovisual própria, do roteiro à entrega final.",
    items: ["Direção e roteiro", "Captação em estúdio e locação", "Edição e finalização", "Bancos de conteúdo"],
  },
  {
    n: "05",
    title: "Conteúdo",
    lead: "Material que informa, posiciona e sustenta autoridade.",
    items: ["Linhas editoriais", "Roteiros para vídeo", "Textos e legendas", "Materiais institucionais"],
  },
];

export function Services() {
  const [active, setActive] = useState<string | null>("01");

  return (
    <section id="servicos" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="03">Serviços</SectionLabel>
            <h2 className="display-lg mt-8 max-w-[16ch]">Camadas de uma marca em movimento</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-foreground/55">
            Cada frente funciona sozinha, mas foi desenhada para trabalhar junto. É assim que a
            evolução deixa de ser sorte e passa a ser método.
          </p>
        </div>

        <div className="mt-16 border-t border-border">
          {SERVICES.map((s) => {
            const open = active === s.n;
            return (
              <Reveal key={s.n}>
                <div
                  className="group border-b border-border"
                  onMouseEnter={() => setActive(s.n)}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setActive(open ? null : s.n)}
                    className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 py-7 text-left md:gap-10"
                  >
                    <span
                      className={`font-display text-sm transition-colors duration-300 ${open ? "text-acid" : "text-foreground/35"}`}
                    >
                      {s.n}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block font-display text-2xl leading-tight transition-colors duration-300 md:text-4xl ${
                          open ? "text-foreground" : "text-foreground/60"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="mt-2 block text-sm text-foreground/45 md:hidden">
                        {s.lead}
                      </span>
                    </span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-400 ${
                        open ? "rotate-45 border-acid text-acid" : "border-border text-foreground/50"
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 pb-9 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10 md:pl-[3.4rem]">
                          <p className="hidden max-w-xs text-sm leading-relaxed text-foreground/60 md:block">
                            {s.lead}
                          </p>
                          <ul className="flex flex-wrap gap-x-8 gap-y-3">
                            {s.items.map((item) => (
                              <li
                                key={item}
                                className="flex items-center gap-2.5 text-sm text-foreground/70"
                              >
                                <span className="h-1 w-1 rounded-full bg-acid" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
