import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal, RevealWords, SectionLabel } from "./Reveal";
import prod1 from "@/assets/prod-1.jpg";
import prod2 from "@/assets/prod-2.jpg";
import prod3 from "@/assets/prod-3.jpg";

export function Audiovisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60]);
  const yB = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -40, reduce ? 0 : 80]);

  return (
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionLabel index="03">Foto &amp; vídeo</SectionLabel>
        <h2 className="display-lg mt-8 max-w-[20ch]">
          <RevealWords text="A imagem da sua marca" />{" "}
          <span className="text-acid">
            <RevealWords text="não se improvisa." delay={0.14} />
          </span>
        </h2>
      </div>

      <div ref={ref} className="mx-auto mt-16 max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-5 md:grid-cols-12 md:gap-6">
          <motion.figure
            style={{ y: yA }}
            className="group relative overflow-hidden rounded-sm md:col-span-7"
          >
            <img
              src={prod1}
              alt="Bastidores de gravação: câmera de cinema e equipe em set"
              width={1280}
              height={1600}
              loading="lazy"
              className="h-[62vh] w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] md:h-[78vh]"
            />
            <figcaption className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-background/70 px-4 py-2 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-acid" />
              <span className="label-xs text-foreground/80">Set · direção de cena</span>
            </figcaption>
          </motion.figure>

          <div className="flex flex-col gap-5 md:col-span-5 md:gap-6">
            <motion.figure style={{ y: yB }} className="group overflow-hidden rounded-sm">
              <img
                src={prod2}
                alt="Estúdio de fotografia com iluminação para still de produto"
                width={1280}
                height={912}
                loading="lazy"
                className="h-[34vh] w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] md:h-[38vh]"
              />
            </motion.figure>

            <Reveal className="flex-1">
              <div className="flex h-full flex-col justify-between gap-8 rounded-sm border border-border p-6 md:p-8">
                <p className="leading-relaxed text-foreground/70">
                  Produção audiovisual é o coração da Betterfly. Planejamos o roteiro, dirigimos a
                  cena, captamos em estúdio ou em locação e entregamos material pronto para
                  sustentar meses de comunicação.
                </p>
                <ul className="grid gap-3">
                  {[
                    "Direção de cena e roteiro",
                    "Captação de foto e vídeo",
                    "Bastidores e conteúdo vertical",
                    "Edição, cor e finalização",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between border-b border-border pb-3 text-sm text-foreground/70 last:border-0 last:pb-0"
                    >
                      {item}
                      <span className="text-acid" aria-hidden>
                        ↗
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <motion.figure
            style={{ y: yB }}
            className="group overflow-hidden rounded-sm md:col-span-5"
          >
            <img
              src={prod3}
              alt="Gravação de conteúdo vertical com smartphone em evento"
              width={1024}
              height={1280}
              loading="lazy"
              className="h-[40vh] w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] md:h-[46vh]"
            />
          </motion.figure>

          <Reveal className="md:col-span-7 md:self-end">
            <div className="grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {[
                ["Estúdio", "Still, retrato e produto"],
                ["Locação", "Cenas reais, rotina e bastidores"],
                ["Vertical", "Reels, cortes e formatos sociais"],
                ["Institucional", "Marca, equipe e processos"],
              ].map(([t, d]) => (
                <div key={t}>
                  <p className="font-display text-base">{t}</p>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/50">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
