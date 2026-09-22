import { Link } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import logo from "@/assets/betterfly-logo-clean.png";

const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Projetos", href: "#projetos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open ? "bg-background/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 transition-all duration-500 md:px-10 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <a href="#inicio" className="flex min-w-0 items-center" aria-label="Betterfly, início">
          <img
            src={logo}
            alt="Betterfly"
            width={1003}
            height={464}
            className="h-9 w-auto shrink-0 md:h-11"
          />
        </a>

        <div className="group hidden items-center justify-end lg:flex">
          <nav
            aria-label="Navegação principal"
            className="flex max-w-0 items-center overflow-hidden opacity-0 transition-[max-width,opacity] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-[560px] group-hover:opacity-100 group-focus-within:max-w-[560px] group-focus-within:opacity-100"
          >
            <span className="flex items-center gap-8 pr-8 whitespace-nowrap">
              {NAV.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{ transitionDelay: `${180 + i * 90}ms` }}
                  className="hover-acid relative translate-x-4 text-sm text-foreground/75 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-focus-within:translate-x-0"

                >
                  {item.label}
                </a>
              ))}
            </span>
          </nav>
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 cursor-default flex-col items-center justify-center gap-[5px] rounded-full border border-border transition-colors duration-500 group-hover:border-acid"
          >
            <span className="h-px w-4 bg-foreground transition-all duration-500 group-hover:w-5 group-hover:bg-acid" />
            <span className="h-px w-4 bg-foreground transition-all duration-500 group-hover:w-3 group-hover:bg-acid" />
            <span className="h-px w-4 bg-foreground transition-all duration-500 group-hover:w-5 group-hover:bg-acid" />
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/cliente"
            className="group relative hidden overflow-hidden rounded-full border border-acid px-5 py-2.5 text-[0.7rem] font-medium tracking-[0.18em] text-acid uppercase sm:inline-flex"
          >
            <span className="absolute inset-0 -translate-y-full bg-acid transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            <span className="relative transition-colors duration-300 group-hover:text-ink">
              Área do cliente
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Abrir menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-border lg:hidden"
          >
            <span
              className={`h-px w-4 bg-foreground transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-4 bg-foreground transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      <motion.nav
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden border-t border-border lg:hidden"
        aria-label="Navegação móvel"
      >
        <div className="flex flex-col px-5 py-4">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-border py-4 font-display text-2xl last:border-0"
            >
              <span className="label-xs">0{i + 1}</span>
              {item.label}
            </a>
          ))}
          <Link
            to="/cliente"
            onClick={() => setOpen(false)}
            className="mt-5 rounded-full bg-acid px-5 py-3 text-center text-[0.7rem] font-semibold tracking-[0.18em] text-ink uppercase"
          >
            Área do cliente
          </Link>
        </div>
      </motion.nav>
    </header>
  );
}
