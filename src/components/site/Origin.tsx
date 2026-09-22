import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { SectionLabel } from "./Reveal";

const BONE = "#F6F0EA";
const ACID = "#BBD705";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * A palavra Butterfly se transforma em Betterfly conforme o scroll:
 * o U dá lugar ao E, a palavra se abre em Better + Fly e fecha com a promessa.
 */
export function Origin() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Cópia "comum" do progresso: evita a aceleração nativa de scroll do motion,
  // que calculava o intervalo errado para opacidade/transform nesta seção.
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => p.set(v));

  // Largura do slot da 2ª letra, interpolada entre a largura do U e a do E (em em).
  const uRef = useRef<HTMLSpanElement>(null);
  const eRef = useRef<HTMLSpanElement>(null);
  const uW = useMotionValue(0.62);
  const eW = useMotionValue(0.52);
  useLayoutEffect(() => {
    const measure = () => {
      const u = uRef.current;
      const e = eRef.current;
      if (!u || !e) return;
      const fs = parseFloat(getComputedStyle(u).fontSize) || 1;
      uW.set(u.offsetWidth / fs);
      eW.set(e.offsetWidth / fs);
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [uW, eW]);

  // Fase 1: U -> E
  const swap = useTransform(p, [0.12, 0.3], [0, 1]);
  const slotWidth = useTransform(
    [swap, uW, eW],
    ([t, u, e]: number[]) => `${u + (e - u) * clamp01(t)}em`,
  );
  const uY = useTransform(swap, [0, 1], ["0%", "-105%"]);
  const eY = useTransform(swap, [0, 1], ["105%", "0%"]);
  const before = useTransform(p, [0.1, 0.22], [1, 0]);
  const after = useTransform(p, [0.24, 0.34], [0, 1]);

  // Fase 2: BETTER | FLY se separam
  const gap = useTransform(p, [0.38, 0.54], ["0em", "0.2em"]);
  const betterColor = useTransform(p, [0.38, 0.54], [BONE, ACID]);
  const flySolid = useTransform(p, [0.38, 0.54], [1, 0]);
  const flyOutline = useTransform(p, [0.38, 0.54], [0, 1]);
  const meanings = useTransform(p, [0.5, 0.62], [0, 1]);
  const meaningsY = useTransform(p, [0.5, 0.62], [12, 0]);

  // Fase 3: frase final
  const final = useTransform(p, [0.7, 0.84], [0, 1]);
  const finalY = useTransform(p, [0.7, 0.84], [24, 0]);

  // Dica de scroll (mobile): aparece no início da animação e some quando ela termina.
  const hint = useTransform(p, [0.01, 0.05, 0.62, 0.68], [0, 1, 1, 0]);

  const s = <T,>(animated: T, still: T) => (reduce ? still : animated);

  return (
    <section id="origem" className="relative">
      <div ref={ref} className={reduce ? "py-24 md:py-36" : "relative h-[280vh]"}>
        <div
          className={
            reduce
              ? "flex flex-col gap-16"
              : "sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden pb-16 pt-24 md:pb-20 md:pt-28"
          }
        >
          <div className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
            <SectionLabel index="02">A origem do nome</SectionLabel>
          </div>

          <div className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
            <div className="relative mb-3 h-4 md:mb-5">
              <motion.p style={{ opacity: s(before, 0) }} className="label-xs absolute inset-0 text-foreground/40">
                2017 · como tudo começou
              </motion.p>
              <motion.p style={{ opacity: s(after, 1) }} className="label-xs absolute inset-0 text-foreground/40">
                Hoje · <span className="text-acid">Betterfly</span>
              </motion.p>
            </div>

            <h2
              aria-label="Betterfly: Better, melhor, e Fly, voar"
              className="flex items-start whitespace-nowrap font-display text-[min(17vw,16rem)] font-medium leading-[0.9] tracking-[-0.03em]"
            >
              <span aria-hidden className="flex flex-col">
                <motion.span style={{ color: s(betterColor, ACID) }} className="flex">
                  B
                  <motion.span
                    style={{ width: s(slotWidth, "auto") }}
                    className="relative inline-block overflow-hidden"
                  >
                    <motion.span
                      ref={uRef}
                      style={{ y: s(uY, "-105%") }}
                      className="absolute left-0 top-0 inline-block text-foreground"
                    >
                      U
                    </motion.span>
                    <motion.span ref={eRef} style={{ y: s(eY, "0%") }} className="inline-block text-acid">
                      E
                    </motion.span>
                  </motion.span>
                  TTER
                </motion.span>
                <motion.span
                  style={{ opacity: s(meanings, 1), y: s(meaningsY, 0) }}
                  className="label-xs mt-3 text-foreground/60 md:mt-5"
                >
                  Better <span className="text-acid">/ melhor</span>
                </motion.span>
              </span>

              <motion.span aria-hidden style={{ marginLeft: s(gap, "0.2em") }} className="flex flex-col">
                <span className="relative inline-block">
                  <motion.span style={{ opacity: s(flyOutline, 1) }} className="inline-block text-outline-acid">
                    FLY
                  </motion.span>
                  <motion.span style={{ opacity: s(flySolid, 0) }} className="absolute inset-0 text-foreground">
                    FLY
                  </motion.span>
                </span>
                <motion.span
                  style={{ opacity: s(meanings, 1), y: s(meaningsY, 0) }}
                  className="label-xs mt-3 text-foreground/60 md:mt-5"
                >
                  Fly <span className="text-acid">/ voar</span>
                </motion.span>
              </motion.span>
            </h2>
          </div>

          <motion.p
            style={{ opacity: s(final, 1), y: s(finalY, 0) }}
            className="mx-auto w-full max-w-[1600px] px-5 font-display text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.06] tracking-[-0.03em] md:px-10"
          >
            Levar marcas a um <span className="text-acid">novo patamar.</span>
          </motion.p>

          {!reduce && (
            <motion.div
              aria-hidden
              style={{ opacity: hint }}
              className="pointer-events-none absolute inset-x-0 bottom-20 flex items-center justify-center gap-2 md:hidden"
            >
              <ArrowDown className="h-4 w-4 animate-bounce text-acid" strokeWidth={2.5} />
              <span className="label-xs text-foreground/60">Desça para continuar</span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
