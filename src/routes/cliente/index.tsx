import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import logo from "@/assets/betterfly-logo-clean.png";
import prod1 from "@/assets/prod-1.jpg";
import { DEMO_CLIENT } from "@/portal/data";
import { btn } from "@/portal/ui";

export const Route = createFileRoute("/cliente/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<"form" | "demo" | null>(null);

  const enter = (kind: "form" | "demo") => {
    setLoading(kind);
    window.setTimeout(() => navigate({ to: "/cliente/inicio" }), 900);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    enter("form");
  };

  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-[1.1fr_1fr]">
      {/* Painel de marca */}
      <section className="relative hidden overflow-hidden border-r border-border lg:block">
        <img
          src={prod1}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        <div className="grid-lines absolute inset-0 opacity-40" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" aria-label="Voltar para o site">
            <img src={logo} alt="Betterfly" className="h-10 w-auto" />
          </Link>
          <div>
            <p className="label-xs">Portal Betterfly</p>
            <p className="mt-6 max-w-lg font-display text-5xl leading-[0.98] font-medium tracking-tight">
              Tudo o que estamos construindo para sua marca,{" "}
              <span className="text-acid">em um só lugar.</span>
            </p>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6 text-sm text-bone/60">
              <span>Conteúdo e calendário</span>
              <span>Aprovações e versões</span>
              <span>Atendimento com IA e equipe</span>
            </div>
          </div>
        </div>
      </section>

      {/* Acesso */}
      <section className="flex flex-col px-6 pt-8 pb-16 sm:px-12 lg:pb-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="lg:hidden" aria-label="Voltar para o site">
            <img src={logo} alt="Betterfly" className="h-8 w-auto" />
          </Link>
          <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-acid/30 px-3 py-1 text-[0.58rem] font-medium tracking-[0.22em] text-acid uppercase">
            <span className="signal-dot h-1.5 w-1.5 rounded-full bg-acid" />
            Demo experience - MARCIO IA
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12"
        >
          <p className="label-xs">Portal Betterfly</p>
          <h1 className="mt-4 font-display text-4xl font-medium">Área do cliente</h1>
          <p className="mt-3 text-sm text-bone/55 lg:hidden">
            Tudo o que estamos construindo para sua marca, em um só lugar.
          </p>

          <button
            type="button"
            onClick={() => enter("demo")}
            disabled={!!loading}
            className={`${btn.primary} mt-10 w-full py-4`}
          >
            {loading === "demo" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Explorar demonstração <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-bone/40">
            Entrar como {DEMO_CLIENT.contact}, da {DEMO_CLIENT.name} (cliente fictício)
          </p>

          <div className="my-9 flex items-center gap-4 text-[0.65rem] tracking-[0.2em] text-bone/30 uppercase">
            <span className="h-px flex-1 bg-border" />
            ou acesse com sua conta
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="label-xs">E-mail</span>
              <input
                type="email"
                defaultValue={DEMO_CLIENT.email}
                className="mt-2 w-full rounded-md border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-bone/30 focus:border-acid/60"
              />
            </label>
            <label className="block">
              <span className="label-xs">Senha</span>
              <input
                type="password"
                defaultValue="demonstracao"
                className="mt-2 w-full rounded-md border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-acid/60"
              />
            </label>
            <button type="submit" disabled={!!loading} className={`${btn.ghost} w-full py-3.5`}>
              {loading === "form" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
            </button>
          </form>
        </motion.div>

        <p className="text-center text-[0.7rem] text-bone/30">
          Ambiente de demonstração com dados fictícios. Nenhuma informação é enviada.
        </p>
      </section>
    </main>
  );
}
