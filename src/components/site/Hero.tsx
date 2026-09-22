import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { RevealWords } from "./Reveal";
import mark from "@/assets/betterfly-mark.png.asset.json";

const EASE = [0.22, 1, 0.36, 1] as const;

const FRENTES = [
  "Estratégia & posicionamento",
  "Social media & conteúdo",
  "Tráfego pago",
  "Foto & vídeo",
  "Branding",
  "Produção audiovisual",
];

const READOUT = [
  ["EIXO", "Estratégia"],
  ["MODO", "Movimento contínuo"],
  ["CICLO", "Produzir · Distribuir · Evoluir"],
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.1]);

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-28 pb-0"
    >
      {/* technical grid + horizon */}
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--acid)_60%,transparent),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-[38%] h-[62vh] bg-[radial-gradient(70%_55%_at_50%_100%,color-mix(in_oklab,var(--acid)_13%,transparent),transparent_72%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-full overflow-hidden"
        aria-hidden
      >
        <div className="scanline h-[36vh] w-full bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--acid)_7%,transparent),transparent)]" />
      </div>

      <motion.img
        src={mark.url}
        alt=""
        aria-hidden
        width={1254}
        height={1254}
        initial={reduce ? false : { opacity: 0, scale: 1.12 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
        className="pointer-events-none absolute -top-10 right-[-10%] w-[62vw] max-w-[760px] mix-blend-screen md:-top-20"
      />

      <motion.div
        style={{ y, opacity: fade }}
        className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10"
      >
        {/* status bar */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <span className="flex items-center gap-3">
            <span className="signal-dot h-1.5 w-1.5 rounded-full bg-acid" />
            <span className="label-xs">Agência de marketing · desde 2017</span>
          </span>
          <span className="hidden h-px flex-1 bg-border md:block" />
          <span className="label-xs text-acid/80">BR · 09 ciclos</span>
        </motion.div>

        {/* headline */}
        <div className="relative mt-10 md:mt-14">
          <span
            className="pointer-events-none absolute -top-6 left-0 hidden label-xs md:block"
            aria-hidden
          >
            001 / Hero
          </span>
          <h1 className="display-xl max-w-[16ch]">
            <span className="block">
              <RevealWords text="Marcas" />{" "}
              <span className="text-outline">
                <RevealWords text="não" delay={0.08} />
              </span>{" "}
              <RevealWords text="param" delay={0.14} />
            </span>
            <span className="block">
              <RevealWords text="quando" delay={0.2} />{" "}
              <span className="text-acid">
                <RevealWords text="ganham" delay={0.26} />
              </span>
            </span>
            <span className="block">
              <span className="text-acid">
                <RevealWords text="altitude." delay={0.32} />
              </span>
            </span>
          </h1>
        </div>

        {/* readout + copy + cta */}
        <div className="mt-12 grid gap-10 border-t border-border pt-8 lg:grid-cols-[1fr_auto_auto] lg:items-end lg:gap-14">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg"
          >
            Estratégia, conteúdo e produção audiovisual operando como um único sistema. A Betterfly
            tira a sua marca do piloto automático e a mantém subindo — com decisão, estética e
            consistência.
          </motion.p>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.62, ease: EASE }}
            className="hidden w-[15rem] shrink-0 flex-col gap-3 border-l border-border pl-6 lg:flex"
          >
            {READOUT.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1">
                <dt className="label-xs text-[0.6rem]">{k}</dt>
                <dd className="font-display text-sm text-foreground/80">{v}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.74 }}
            className="flex flex-wrap items-center gap-6"
          >
            <a
              href="#contato"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-bone px-7 py-4 text-[0.72rem] font-semibold tracking-[0.18em] text-ink uppercase"
            >
              <span className="absolute inset-0 translate-y-full bg-acid transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative">Começar a decolagem</span>
              <span
                className="relative transition-transform duration-400 group-hover:translate-x-1"
                aria-hidden
              >
                ↗
              </span>
            </a>
            <a href="#servicos" className="hover-acid text-sm text-foreground/60">
              Ver o que fazemos
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* ticker */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative mt-12 overflow-hidden border-t border-border py-4"
        aria-hidden
      >
        <div className="marquee-track gap-10">
          {[...FRENTES, ...FRENTES].map((label, i) => (
            <span key={`${label}-${i}`} className="flex shrink-0 items-baseline gap-3">
              <span className="font-display text-xs text-acid">
                {String((i % FRENTES.length) + 1).padStart(2, "0")}
              </span>
              <span className="text-sm whitespace-nowrap text-foreground/55">{label}</span>
            </span>
          ))}
        </div>
      </motion.div>
      <p className="sr-only">
        Frentes de atuação: estratégia e posicionamento, social media e conteúdo, tráfego pago, foto
        e vídeo, branding e produção audiovisual.
      </p>
    </section>
  );
}
