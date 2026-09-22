import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
import { Services } from "@/components/site/Services";
import { Audiovisual } from "@/components/site/Audiovisual";
import { Process } from "@/components/site/Process";
import { Cases } from "@/components/site/Cases";
import { Experience } from "@/components/site/Experience";
import { Origin } from "@/components/site/Origin";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";

const TITLE = "Betterfly: Branding, conteúdo & performance";
const DESC =
  "Agência de marketing com estratégia, social media, tráfego pago e produção de foto e vídeo para marcas que decidiram evoluir.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Services />
        <Audiovisual />
        <Process />
        <Cases />
        <Origin />
        <Experience />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
