import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal, RevealWords, SectionLabel } from "./Reveal";

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.2, 1]);

  return (
    <section id="sobre" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionLabel index="01">Manifesto</SectionLabel>

        <ScrollWords
          className="display-lg mt-10 max-w-[22ch]"
          segments={[
            { text: "Marketing não é" },
            { text: "publicar conteúdo.", dim: true },
            { text: "É construir direção." },
          ]}
        />


        <div className="mt-14 grid gap-12 border-t border-border pt-10 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="text-lg leading-relaxed text-foreground/75">
              Postar todos os dias não move uma marca. O que move é decisão: saber onde você está,
              onde quer chegar e o que precisa mudar no caminho.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-4 md:col-start-7">
            <p className="leading-relaxed text-foreground/60">
              A Betterfly trabalha em ciclos de evolução. Cada mês a marca sai de um patamar e entra
              em outro, com estética própria, narrativa clara e presença consistente nos lugares em
              que decide estar.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="md:col-span-2 md:col-start-11">
            <p className="label-xs">Desde</p>
            <p className="mt-2 font-display text-5xl">2017</p>
            <p className="mt-3 text-sm text-foreground/50">9 anos acompanhando jornadas de marca.</p>
          </Reveal>
        </div>
      </div>

      {/* A origem do nome, composicao tipográfica */}
      <div ref={ref} className="mx-auto mt-24 max-w-[1600px] px-5 md:mt-32 md:px-10">
        <div className="flex items-baseline justify-between border-t border-border pt-8">
          <p className="label-xs">A origem do nome</p>
          <motion.p style={{ opacity }} className="label-xs text-foreground/40">
            2017 / hoje
          </motion.p>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-5">
            <p className="label-xs text-foreground/40">01 / O começo</p>
            <h3 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] tracking-[-0.03em]">
              Nascemos como <span className="text-outline">Butterfly</span>, em 2017
            </h3>
            <p className="mt-5 max-w-[38ch] leading-relaxed text-foreground/65">
              O nome vinha da metamorfose: marcas que chegavam de um jeito e saíam de outro. Com o
              tempo, percebemos que faltava dizer o que realmente entregávamos.
            </p>
          </Reveal>

          <div className="md:col-span-6 md:col-start-7">
            <div className="grid grid-cols-2 gap-6 border-t border-border pt-8 md:gap-10">
              <Reveal>
                <p className="label-xs text-foreground/40">02</p>
                <p className="mt-3 font-display text-[clamp(2.25rem,5vw,4rem)] leading-none tracking-[-0.04em] text-acid">
                  Better
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                  Do inglês, <span className="text-foreground">melhor</span>. O padrão que a marca
                  passa a ocupar depois de cada ciclo.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="label-xs text-foreground/40">03</p>
                <p className="mt-3 font-display text-[clamp(2.25rem,5vw,4rem)] leading-none tracking-[-0.04em] text-outline-acid">
                  Fly
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                  Do inglês, <span className="text-foreground">voar</span>. A direção e a altitude
                  que a presença digital ganha.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14 border-t border-border pt-10 md:mt-20">
            <p className="label-xs text-foreground/40">04 / O que ficou</p>
            <p className="mt-5 max-w-[30ch] font-display text-[clamp(1.5rem,3.4vw,3rem)] leading-[1.06] tracking-[-0.03em] md:max-w-[34ch]">
              Ser o seu melhor voo no universo midiático.
            </p>
            <p className="mt-6 max-w-[46ch] leading-relaxed text-foreground/60">
              Betterfly é a junção das duas palavras, e a promessa de que cada entrega deixe a marca
              um patamar acima de onde começou.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
