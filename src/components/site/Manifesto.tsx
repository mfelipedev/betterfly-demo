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
    </section>
  );
}
