import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | Record<string, boolean>)[]) {
  return twMerge(clsx(inputs));
}


export function moneyDhForma(m: number) {
  const formatteurMA = new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: 'MAD', // Code ISO pour le Dirham Marocain
        minimumFractionDigits: 2, // Afficher 2 décimales par défaut
        maximumFractionDigits: 2
        });
  return formatteurMA.format(m);
}