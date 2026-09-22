import { Reveal, SectionLabel } from "./Reveal";
import case1 from "@/assets/case-1.jpg";
import case2 from "@/assets/case-2.jpg";
import case3 from "@/assets/case-3.jpg";
import case4 from "@/assets/case-4.jpg";

const CASES = [
  {
    img: case2,
    name: "Vélora",
    seg: "Beleza & skincare",
    scope: "Posicionamento, still de produto e social",
    note: "Reconstrução da linguagem visual em torno de textura, sombra e silêncio.",
  },
  {
    img: case4,
    name: "Núcleo Movimento",
    seg: "Estúdio de treino",
    scope: "Conteúdo, vídeo vertical e tráfego",
    note: "Uma narrativa de progresso: corpo, disciplina e presença.",
  },
  {
    img: case3,
    name: "Casa Verde",
    seg: "Gastronomia",
    scope: "Direção de arte, foto e calendário editorial",
    note: "Do prato ao ambiente, uma mesa que comunica antes da primeira mordida.",
  },
  {
    img: case1,
    name: "Altiora",
    seg: "Arquitetura",
    scope: "Marca, editorial digital e institucional",
    note: "Linhas, luz e vazio como assinatura de marca.",
  },
];

export function Cases() {
  return (
    <section id="projetos" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="05">Projetos</SectionLabel>
            <h2 className="display-lg mt-8 max-w-[16ch]">Direção aplicada</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-foreground/55">
            Projetos conceituais criados para esta demonstração, com o mesmo padrão de direção
            criativa que aplicamos em marcas reais.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
          {CASES.map((c, i) => (
            <Reveal key={c.name} delay={(i % 2) * 0.08}>
              <article
                className={`group relative overflow-hidden rounded-sm border border-border ${i % 2 === 1 ? "md:mt-16" : ""}`}
              >
                <div className="overflow-hidden">
                  <img
                    src={c.img}
                    alt={`Projeto conceitual ${c.name}`}
                    width={1280}
                    height={1600}
                    loading="lazy"
                    className="h-[52vh] w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] md:h-[64vh]"
                  />
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 p-5 md:p-7">
                  <div className="min-w-0">
                    <p className="label-xs">{c.seg}</p>
                    <h3 className="mt-3 font-display text-3xl">{c.name}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground/55">
                      {c.note}
                    </p>
                    <p className="mt-4 text-xs text-foreground/40">{c.scope}</p>
                  </div>
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground/50 transition-all duration-400 group-hover:border-acid group-hover:text-acid"
                    aria-hidden
                  >
                    ↗
                  </span>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-px w-0 bg-acid transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-16 text-xs text-foreground/35">
            Projetos fictícios, criados apenas para fins de demonstração visual.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
