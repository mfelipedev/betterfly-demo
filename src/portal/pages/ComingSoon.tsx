import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { btn } from "../ui";

/** Fallback para endereços do portal que não existem. */
export function ComingSoon({ agency }: { section?: string; agency?: boolean }) {
  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center px-6 py-16">
      <p className="label-xs">Página não encontrada</p>
      <h1 className="mt-4 font-display text-4xl font-medium md:text-5xl">Nada por aqui.</h1>
      <p className="mt-4 text-bone/55">
        Este endereço não existe no portal. Use o menu ou a busca para encontrar o que procura.
      </p>
      <Link
        to={agency ? "/cliente/agencia" : "/cliente/inicio"}
        className={`${btn.ghost} mt-10 self-start`}
      >
        Voltar para a visão geral <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
