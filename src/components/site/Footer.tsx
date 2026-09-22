import { Link } from "@tanstack/react-router";
import logo from "@/assets/betterfly-logo-clean.png.asset.json";

const LINKS = [
  { label: "Instagram", href: "https://instagram.com/betterfly" },
  { label: "WhatsApp", href: "https://wa.me/5500000000000" },
  { label: "E-mail", href: "mailto:contato@betterfly.com.br" },
];

export function Footer() {
  return (
    <footer className="border-t border-border px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <img
              src={logo.url}
              alt="Betterfly"
              width={1003}
              height={464}
              loading="lazy"
              className="h-10 w-auto md:h-12"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-foreground/50">
              Branding, conteúdo &amp; performance. Estratégia e produção para marcas que decidiram
              evoluir.
            </p>
          </div>

          <nav className="flex flex-col gap-3 md:items-end" aria-label="Contato e redes">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer noopener"
                className="hover-acid text-sm text-foreground/70"
              >
                {l.label}
              </a>
            ))}
            <Link to="/cliente" className="hover-acid text-sm text-acid">
              Área do cliente
            </Link>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <p className="label-xs">© {new Date().getFullYear()} Betterfly · Desde 2017</p>
          <p className="label-xs">Demonstração visual · conteúdo conceitual</p>
        </div>
      </div>
    </footer>
  );
}
