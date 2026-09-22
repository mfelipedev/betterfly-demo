import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { RevealWords } from "./Reveal";
import mark from "@/assets/betterfly-mark.png.asset.json";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.15]);

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-32 pb-10"
    >
      {/* subtle grid + horizon */}
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[60vh] bg-[radial-gradient(60%_50%_at_50%_100%,color-mix(in_oklab,var(--acid)_14%,transparent),transparent_70%)]"
        aria-hidden
      />

      <motion.div style={{ y, opacity: fade }} className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10">
        <div className="flex items-center gap-4">
          <span className="h-1.5 w-1.5 rounded-full bg-acid" />
          <p className="label-xs">Agência de marketing · desde 2017</p>
        </div>

        <h1 className="display-xl mt-8 max-w-[18ch]">
          <RevealWords text="Marcas que" />
          <br />
          <RevealWords text="sobem de" delay={0.12} />
          <br />
          <span className="text-acid">
            <RevealWords text="altitude." delay={0.24} />
          </span>
        </h1>

        <div className="mt-12 grid gap-10 border-t border-border pt-8 md:grid-cols-[1.1fr_auto] md:items-end">
          <motion.p
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg"
          >
            Estratégia, conteúdo e produção audiovisual trabalhando na mesma direção. A Betterfly
            existe para tirar a sua marca do piloto automático e colocá-la em movimento — com
            decisão, estética e consistência.
          </motion.p>

          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-wrap items-center gap-6"
          >
            <a
              href="#contato"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-bone px-7 py-4 text-[0.72rem] font-semibold tracking-[0.18em] text-ink uppercase"
            >
              <span className="absolute inset-0 translate-y-full bg-acid transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative">Começar a decolagem</span>
              <span className="relative transition-transform duration-400 group-hover:translate-x-1" aria-hidden>
                ↗
              </span>
            </a>
            <a href="#servicos" className="hover-acid text-sm text-foreground/60">
              Ver o que fazemos
            </a>
          </motion.div>
        </div>

        <div className="mt-10 hidden items-end justify-between border-t border-border pt-6 md:flex">
          {[
            ["01", "Estratégia & posicionamento"],
            ["02", "Social media & conteúdo"],
            ["03", "Tráfego pago"],
            ["04", "Foto & vídeo"],
          ].map(([n, label], i) => (
            <motion.div
              key={n}
              initial={reduce ? undefined : { opacity: 0, y: 14 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 + i * 0.08, ease: EASE }}
              className="flex items-baseline gap-3"
            >
              <span className="font-display text-sm text-acid">{n}</span>
              <span className="text-sm text-foreground/60">{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.img
        src={mark.url}
        alt=""
        aria-hidden
        width={1254}
        height={1254}
        style={{ opacity: reduce ? 0.06 : undefined }}
        initial={reduce ? undefined : { opacity: 0, scale: 1.1 }}
        animate={reduce ? undefined : { opacity: 0.07, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="pointer-events-none absolute -top-16 right-[-8%] w-[60vw] max-w-[720px] mix-blend-screen md:-top-24"
      />
    </section>
  );
}
