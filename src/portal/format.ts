import { differenceInCalendarDays, format, formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";

export const fmt = (iso: string | Date, pattern: string) =>
  format(new Date(iso), pattern, { locale: ptBR });

/** "Hoje", "Amanhã", "Ontem" ou "qui, 24 set". */
export function relDay(iso: string) {
  const diff = differenceInCalendarDays(new Date(iso), new Date());
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  if (diff === -1) return "Ontem";
  return fmt(iso, "EEE, d MMM");
}

/** "quinta-feira, 24 de setembro, às 14h". */
export function longDate(iso: string) {
  const d = new Date(iso);
  const hour = d.getMinutes() ? fmt(d, "HH:mm") : `${d.getHours()}h`;
  return `${fmt(d, "EEEE, d 'de' MMMM")}, às ${hour}`;
}

export function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 60_000) return "agora";
  return `há ${formatDistanceToNowStrict(new Date(iso), { locale: ptBR })}`;
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 5) return "Boa noite";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const nextMonthName = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 1);
  return fmt(d, "MMMM");
};
