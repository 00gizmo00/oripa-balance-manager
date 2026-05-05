import type { CardWithRelations, DashboardMetrics, SpendLogWithApp } from "@/lib/supabase/types";
import { safeNumber } from "@/lib/utils";

function getAppKey(cardOrLogAppId: string | null | undefined) {
  return cardOrLogAppId ?? "unassigned";
}

function getAppName(appName: string | null | undefined) {
  return appName ?? "未分類";
}

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
  const profitByAppMap = new Map<
    string,
    {
      appId: string;
      appName: string;
      spendAmount: number;
      salesNet: number;
      holdingValue: number;
      balance: number;
      holdingCount: number;
      soldCount: number;
    }
  >();

  const ensureAppMetric = (appId: string, appName: string) => {
    const current = profitByAppMap.get(appId);
    if (current) {
      return current;
    }

    const next = {
      appId,
      appName,
      spendAmount: 0,
      salesNet: 0,
      holdingValue: 0,
      balance: 0,
      holdingCount: 0,
      soldCount: 0,
    };

    profitByAppMap.set(appId, next);
    return next;
  };

  for (const log of spendLogs) {
    const appId = getAppKey(log.oripa_app?.id ?? log.oripa_app_id);
    const appName = getAppName(log.oripa_app?.name);
    const current = spendByAppMap.get(appId);
    const metric = ensureAppMetric(appId, appName);

    if (current) {
      current.totalAmount += safeNumber(log.amount);
    } else {
      spendByAppMap.set(appId, {
        appId,
        appName,
        totalAmount: safeNumber(log.amount),
      });
    }

    metric.spendAmount += safeNumber(log.amount);
  }

  for (const card of cards) {
    const appId = getAppKey(card.oripa_app?.id ?? card.oripa_app_id);
    const appName = getAppName(card.oripa_app?.name);
    const metric = ensureAppMetric(appId, appName);
    const quantity = safeNumber(card.quantity);
    const holdingValue = safeNumber(card.current_market_price) * quantity;
    const salesNet =
      card.sales?.reduce((sum, sale) => {
        return sum + safeNumber(sale.sold_price) - safeNumber(sale.fee) - safeNumber(sale.shipping);
      }, 0) ?? 0;

    metric.salesNet += salesNet;

    if (card.status === "holding") {
      metric.holdingValue += holdingValue;
      metric.holdingCount += quantity;
    } else {
      metric.soldCount += quantity;
    }
  }

  const profitByApp = Array.from(profitByAppMap.values())
    .map((metric) => ({
      ...metric,
      balance: metric.salesNet + metric.holdingValue - metric.spendAmount,
    }))
    .sort((a, b) => b.balance - a.balance);

  return {
    totalSpend,
    totalSalesNet,
    totalHoldingValue,
    balance: totalSalesNet + totalHoldingValue - totalSpend,
    spendByApp: Array.from(spendByAppMap.values()).sort((a, b) => b.totalAmount - a.totalAmount),
    profitByApp,
  };
}
