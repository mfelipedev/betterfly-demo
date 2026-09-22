import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { RevealWords } from "./Reveal";
import mark from "@/assets/betterfly-mark.png.asset.json";

export function CTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 80, reduce ? 0 : -80]);

  return (
    <section
      id="contato"
      ref={ref}
      className="relative overflow-hidden border-t border-border py-28 md:py-40"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(55%_60%_at_50%_100%,color-mix(in_oklab,var(--acid)_16%,transparent),transparent_75%)]"
        aria-hidden
      />
      <motion.img
        src={mark.url}
        alt=""
        aria-hidden
        width={1254}
        height={1254}
        style={{ y }}
        className="pointer-events-none absolute -bottom-24 left-1/2 w-[70vw] max-w-[620px] -translate-x-1/2 opacity-[0.06] mix-blend-screen"
      />

      <div className="relative mx-auto max-w-[1600px] px-5 text-center md:px-10">
        <p className="label-xs">Próximo ciclo</p>
        <h2 className="display-xl mx-auto mt-8 max-w-[16ch]">
          <RevealWords text="Voar mais alto" />
          <br />
          <span className="text-acid">
            <RevealWords text="começa com direção." delay={0.14} />
          </span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl leading-relaxed text-foreground/60">
          Conte onde sua marca está hoje. Nós desenhamos o caminho para o patamar seguinte, com
          estratégia, produção e consistência.
        </p>

        <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noreferrer noopener"
            className="group relative w-full overflow-hidden rounded-full bg-bone px-8 py-4 text-[0.72rem] font-semibold tracking-[0.18em] text-ink uppercase sm:w-auto"
          >
            <span className="absolute inset-0 translate-y-full bg-acid transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            <span className="relative">Falar com a Betterfly</span>
          </a>
          <a
            href="mailto:contato@betterfly.com.br"
            className="hover-acid border-b border-border pb-1 text-sm text-foreground/70"
          >
            contato@betterfly.com.br
          </a>
        </div>
      </div>
    </section>
  );
}
