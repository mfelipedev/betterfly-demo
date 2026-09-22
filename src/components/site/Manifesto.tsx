import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal, RevealWords, SectionLabel } from "./Reveal";
import h1 from "@/assets/historia-1.png.asset.json";
import h2 from "@/assets/historia-2.png.asset.json";
import h3 from "@/assets/historia-3.png.asset.json";
import h4 from "@/assets/historia-4.png.asset.json";

const HISTORIA = [
  { src: h1.url, alt: "Em 2017 a agência nasceu com o nome Butterfly" },
  { src: h2.url, alt: "‘Better’ vem do inglês e significa melhor" },
  { src: h3.url, alt: "‘Fly’ vem do inglês e significa voar" },
  { src: h4.url, alt: "Queríamos ser o seu melhor voo no universo midiático" },
];

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", reduce ? "2%" : "-14%"]);

  return (
    <section id="sobre" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionLabel index="01">Manifesto</SectionLabel>

        <h2 className="display-lg mt-10 max-w-[22ch]">
          <RevealWords text="Marketing não é" />{" "}
          <span className="text-foreground/35">
            <RevealWords text="publicar conteúdo." delay={0.1} />
          </span>{" "}
          <RevealWords text="É construir direção." delay={0.2} />
        </h2>

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
              em outro — com estética própria, narrativa clara e presença consistente nos lugares em
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

      {/* Story strip — a Betterfly em quatro tempos */}
      <div ref={ref} className="mt-24 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <p className="label-xs">A origem do nome</p>
        </div>
        <motion.div style={{ x }} className="mt-8 flex gap-4 px-5 md:gap-6 md:px-10">
          {HISTORIA.map((item, i) => (
            <figure
              key={item.src}
              className="group relative w-[68vw] shrink-0 overflow-hidden rounded-sm border border-border sm:w-[42vw] lg:w-[26vw]"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <figcaption className="pointer-events-none absolute bottom-3 left-3 label-xs">
                0{i + 1}
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
