import type { Database, TableInsert, TableRow, TableUpdate } from "@/lib/supabase/database.types";

export type OripaApp = TableRow<"oripa_apps">;
export type SpendLog = TableRow<"spend_logs">;
export type Card = TableRow<"cards">;
export type Sale = TableRow<"sales">;
export type ShopPrice = TableRow<"shop_prices">;

export type OripaAppInsert = TableInsert<"oripa_apps">;
export type SpendLogInsert = TableInsert<"spend_logs">;
export type CardInsert = TableInsert<"cards">;
export type SaleInsert = TableInsert<"sales">;
export type ShopPriceInsert = TableInsert<"shop_prices">;

export type OripaAppUpdate = TableUpdate<"oripa_apps">;
export type SpendLogUpdate = TableUpdate<"spend_logs">;
export type CardUpdate = TableUpdate<"cards">;
export type SaleUpdate = TableUpdate<"sales">;
export type ShopPriceUpdate = TableUpdate<"shop_prices">;

export type CardStatus = Database["public"]["Tables"]["cards"]["Row"]["status"];

export interface SpendLogWithApp extends SpendLog {
  oripa_app?: Pick<OripaApp, "id" | "name"> | null;
}

export interface CardWithRelations extends Card {
  oripa_app?: Pick<OripaApp, "id" | "name"> | null;
  sales?: Sale[];
  shop_prices?: ShopPrice[];
}

export interface DashboardMetrics {
  totalSpend: number;
  totalSalesNet: number;
  totalHoldingValue: number;
  balance: number;
  spendByApp: Array<{
    appId: string;
    appName: string;
    totalAmount: number;
  }>;
}
