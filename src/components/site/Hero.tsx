import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { RevealWords } from "./Reveal";
import case1 from "@/assets/case-1.jpg";
import case2 from "@/assets/case-2.jpg";
import prod1 from "@/assets/prod-1.jpg";

const EASE = [0.22, 1, 0.36, 1] as const;

const FRENTES = ["Marketing", "Social media", "Tráfego pago", "Foto & vídeo", "Branding"];

const FEATURED = [
  { src: case1, title: "Reposicionamento de marca", tag: "Branding" },
  { src: prod1, title: "Direção de conteúdo", tag: "Foto & vídeo" },
  { src: case2, title: "Presença digital contínua", tag: "Social media" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const item = FEATURED[i]!;

  const go = (step: number) => setI((prev) => (prev + step + FEATURED.length) % FEATURED.length);

  return (
    <section id="inicio" className="relative overflow-hidden pt-32 md:pt-36">
      {/* acid light source, top-left, dissolving into ink */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_95%_at_0%_-10%,color-mix(in_oklab,var(--acid)_26%,transparent),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_10%_0%,color-mix(in_oklab,var(--acid)_14%,transparent),transparent_70%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.18]" aria-hidden />

      <div className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
          {/* headline */}
          <div>
            <motion.span
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex items-center gap-3"
            >
              <span className="signal-dot h-1.5 w-1.5 rounded-full bg-acid" />
              <span className="label-xs">Agência de marketing · desde 2017</span>
            </motion.span>

            <h1 className="font-display mt-8 max-w-[26ch] text-[clamp(1.6rem,3.6vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.03em] text-balance">
              <RevealWords text="Estratégia, conteúdo e produção" />{" "}
              <span className="text-acid">
                <RevealWords text="que levam sua marca mais alto." delay={0.12} />
              </span>
            </h1>

            <div className="mt-10 h-px w-full max-w-xl bg-border md:mt-12" />

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-6"
            >
              <a href="#contato" className="group inline-flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-acid text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45">
                  <span aria-hidden>↗</span>
                </span>
                <span className="relative overflow-hidden rounded-full bg-bone px-7 py-3.5 text-[0.72rem] font-semibold tracking-[0.16em] text-ink uppercase">
                  <span className="absolute inset-0 translate-y-full bg-acid transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                  <span className="relative">Vamos conversar</span>
                </span>
              </a>

              <div className="flex flex-col gap-1 border-l border-border pl-6">
                <span className="font-display text-xl">09 anos</span>
                <span className="label-xs text-[0.62rem]">de marcas em movimento</span>
              </div>
            </motion.div>
          </div>

          {/* featured card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="lg:mt-6"
          >
            <div className="rounded-lg border border-border bg-surface/70 p-3 backdrop-blur-sm">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                <motion.img
                  key={item.src}
                  src={item.src}
                  alt={item.title}
                  initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <span className="absolute top-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-[0.62rem] tracking-[0.18em] text-acid uppercase backdrop-blur-sm">
                  {item.tag}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 px-2 pt-4 pb-1">
                <p className="font-display text-base">{item.title}</p>
                <span className="label-xs text-[0.62rem]">
                  0{i + 1}/0{FEATURED.length}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Projeto anterior"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/70 transition-colors duration-300 hover:border-acid hover:text-acid"
              >
                <span aria-hidden>←</span>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próximo projeto"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/70 transition-colors duration-300 hover:border-acid hover:text-acid"
              >
                <span aria-hidden>→</span>
              </button>
            </div>
          </motion.div>
        </div>

      </div>

      {/* oversized wordmark, edge to edge */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
        className="relative mt-20 w-full md:mt-28"
        aria-hidden
      >
        <svg viewBox="0 0 1000 205" className="block w-full" preserveAspectRatio="xMidYMid meet">
          <text
            x="0"
            y="159"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="var(--bone)"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "152px",
              fontWeight: 500,
            }}
          >
            Betterfly
            <tspan fill="var(--acid)">.</tspan>
          </text>
        </svg>
      </motion.div>


      {/* label row */}
      <div className="relative mt-8 border-t border-border">
        <div className="mx-auto hidden w-full max-w-[1600px] items-center justify-between px-10 py-5 md:flex">
          {FRENTES.map((f, idx) => (
            <span key={f} className="flex items-center gap-8">
              {idx > 0 && <span className="h-1 w-1 rounded-full bg-acid/60" aria-hidden />}
              <span className="text-[0.68rem] tracking-[0.2em] text-foreground/55 uppercase">
                {f}
              </span>
            </span>
          ))}
        </div>
        <div className="overflow-hidden py-4 md:hidden" aria-hidden>
          <div className="marquee-track gap-8">
            {[...FRENTES, ...FRENTES].map((f, idx) => (
              <span
                key={`${f}-${idx}`}
                className="shrink-0 text-[0.68rem] tracking-[0.2em] whitespace-nowrap text-foreground/55 uppercase"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
        <p className="sr-only">
          Frentes de atuação: marketing, social media, tráfego pago, foto e vídeo e branding.
        </p>
      </div>
    </section>
  );
}
