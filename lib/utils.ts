import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CardWithRelations } from "@/lib/supabase/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

export function safeNumber(value: number | null | undefined) {
  return typeof value === "number" && !Number.isNaN(value) ? value : 0;
}

export function getDisplayedCardPrice(card: Pick<CardWithRelations, "status" | "current_market_price" | "sales">) {
  if (card.status === "sold" && card.sales?.length) {
    const latestSale = [...card.sales].sort((a, b) => b.sold_date.localeCompare(a.sold_date))[0];

    return {
      label: "売却価格",
      value: safeNumber(latestSale?.sold_price),
    };
  }

  return {
    label: "現在相場",
    value: safeNumber(card.current_market_price),
  };
}
