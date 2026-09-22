import { Reveal, ScrollWords, SectionLabel } from "./Reveal";

export function Manifesto() {
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

        <QuoteRow />
      </div>
    </section>
  );
}

/** Citação em destaque com o texto de apoio ao lado. */
function QuoteRow() {
  return (
    <div className="mt-14 grid gap-10 border-t border-border pt-10 md:grid-cols-12 md:gap-8">
      <Reveal className="md:col-span-7">
        <p className="font-display text-[clamp(1.75rem,3.4vw,3.25rem)] leading-[1.08] tracking-[-0.03em]">
          Postar todos os dias não move uma marca. O que move é <span className="text-acid">decisão</span>.
        </p>
      </Reveal>
      <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:pt-2">
        <p className="text-lg leading-relaxed text-foreground/75">
          Saber onde você está, onde quer chegar e o que precisa mudar no caminho.
        </p>
        <p className="mt-5 leading-relaxed text-foreground/50">
          A Betterfly trabalha em ciclos de evolução, com estética própria, narrativa clara e
          presença consistente nos lugares em que a marca decide estar.
        </p>
      </Reveal>
    </div>
  );
}
