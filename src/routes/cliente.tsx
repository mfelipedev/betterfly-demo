import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/betterfly-logo.png";

export const Route = createFileRoute("/cliente")({
  head: () => ({
    meta: [
      { title: "Portal Betterfly: Área do cliente" },
      {
        name: "description",
        content:
          "A área do cliente da Betterfly está em construção: estratégia, produção e acompanhamento em um só lugar.",
      },
      { property: "og:title", content: "Portal Betterfly: Área do cliente" },
      {
        property: "og:description",
        content: "O portal de acompanhamento da Betterfly chega em breve.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientePage,
});

function ClientePage() {
  return (
    <main className="flex min-h-screen flex-col justify-between px-5 py-10 md:px-10">
      <img src={logo} alt="Betterfly" width={1670} height={940} className="h-10 w-auto" />

      <div className="max-w-3xl py-16">
        <p className="label-xs">Portal Betterfly, em construção</p>
        <h1 className="display-lg mt-6">
          Sua próxima altitude <span className="text-acid">começa aqui.</span>
        </h1>
        <p className="mt-6 max-w-xl text-foreground/70">
          Estamos construindo o ambiente onde você vai acompanhar estratégia, calendário de
          conteúdo, produções, entregas e evolução da sua marca, tudo em um só lugar. Enquanto
          isso, seguimos conversando pelos canais de sempre.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-3 border-b border-acid pb-1 text-sm text-acid"
        >
          Voltar para o site
          <span aria-hidden>→</span>
        </Link>
      </div>

      <p className="label-xs">Betterfly · Branding, conteúdo &amp; performance</p>
    </main>
  );
}
