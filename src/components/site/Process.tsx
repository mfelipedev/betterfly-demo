import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal, SectionLabel } from "./Reveal";

const STEPS = [
  { n: "01", t: "Estratégia", d: "Entendemos o negócio, o público e o ponto de partida. Definimos direção antes de produzir." },
  { n: "02", t: "Planejamento", d: "Linhas editoriais, calendário, formatos e prioridades do ciclo." },
  { n: "03", t: "Produção", d: "Foto, vídeo, design e copy criados com direção única." },
  { n: "04", t: "Distribuição", d: "Publicação orgânica e mídia paga trabalhando na mesma narrativa." },
  { n: "05", t: "Análise", d: "Leitura do que aconteceu: o que funcionou, o que sai e o que entra." },
  { n: "06", t: "Evolução", d: "O ciclo reinicia em um patamar acima. Nunca no mesmo lugar." },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="05">Processo</SectionLabel>
            <h2 className="display-lg mt-8 max-w-[14ch]">Seis tempos de ascensão</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-foreground/55">
            Um ciclo que não termina: cada volta devolve a marca mais madura, mais clara e mais
            preparada para o próximo passo.
          </p>
        </div>

        <div ref={ref} className="relative mt-16 pl-8 md:pl-0">
          {/* progress rail */}
          <div className="absolute top-0 left-[3px] h-full w-px bg-border md:left-[calc(16.66%-0.5px)]" aria-hidden />
          <motion.div
            style={{ scaleY: reduce ? 1 : scaleY }}
            className="absolute top-0 left-[3px] h-full w-px origin-top bg-acid md:left-[calc(16.66%-0.5px)]"
            aria-hidden
          />

          <ol className="space-y-0">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.04}>
                <li className="group relative grid gap-3 border-b border-border py-8 md:grid-cols-6 md:gap-8">
                  <div className="md:col-span-1 md:pr-10 md:text-right">
                    <span className="font-display text-sm text-acid">{s.n}</span>
                  </div>
                  <span
                    className="absolute top-[2.85rem] left-[-1.4rem] h-1.5 w-1.5 rounded-full bg-acid transition-transform duration-500 group-hover:scale-[2.2] md:left-[calc(16.66%-3px)]"
                    aria-hidden
                  />
                  <h3 className="font-display text-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 md:col-span-2 md:pl-10 md:text-3xl">
                    {s.t}
                  </h3>
                  <p className="max-w-xl text-sm leading-relaxed text-foreground/60 md:col-span-3">
                    {s.d}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
