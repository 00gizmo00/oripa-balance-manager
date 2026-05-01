import type { CardWithRelations, DashboardMetrics, SpendLogWithApp } from "@/lib/supabase/types";
import { safeNumber } from "@/lib/utils";

export function buildDashboardMetrics(cards: CardWithRelations[], spendLogs: SpendLogWithApp[]): DashboardMetrics {
  const totalSpend = spendLogs.reduce((sum, log) => sum + safeNumber(log.amount), 0);
  const totalHoldingValue = cards
    .filter((card) => card.status === "holding")
    .reduce((sum, card) => sum + safeNumber(card.current_market_price) * safeNumber(card.quantity), 0);

  const totalSalesNet = cards.reduce((sum, card) => {
    const salesNet =
      card.sales?.reduce((salesSum, sale) => {
        return salesSum + safeNumber(sale.sold_price) - safeNumber(sale.fee) - safeNumber(sale.shipping);
      }, 0) ?? 0;
    return sum + salesNet;
  }, 0);

  const spendByAppMap = new Map<string, { appId: string; appName: string; totalAmount: number }>();

  for (const log of spendLogs) {
    const appId = log.oripa_app?.id ?? log.oripa_app_id;
    const appName = log.oripa_app?.name ?? "未分類";
    const current = spendByAppMap.get(appId);

    if (current) {
      current.totalAmount += safeNumber(log.amount);
    } else {
      spendByAppMap.set(appId, {
        appId,
        appName,
        totalAmount: safeNumber(log.amount),
      });
    }
  }

  return {
    totalSpend,
    totalSalesNet,
    totalHoldingValue,
    balance: totalSalesNet + totalHoldingValue - totalSpend,
    spendByApp: Array.from(spendByAppMap.values()).sort((a, b) => b.totalAmount - a.totalAmount),
  };
}
