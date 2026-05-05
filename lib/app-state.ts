"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { buildDashboardMetrics } from "@/lib/dashboard";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  createCard,
  createOripaApp,
  createSale,
  createShopPrice,
  createSpendLog,
  deleteCard,
  deleteOripaApp,
  deleteSale,
  deleteShopPrice,
  deleteSpendLog,
  fetchCards,
  fetchOripaApps,
  fetchSpendLogs,
  updateCard,
  updateOripaApp,
  updateSpendLog,
} from "@/lib/supabase/repository";
import type {
  CardInsert,
  CardUpdate,
  CardWithRelations,
  DashboardMetrics,
  OripaApp,
  OripaAppInsert,
  OripaAppUpdate,
  SaleInsert,
  ShopPriceInsert,
  SpendLogInsert,
  SpendLogUpdate,
  SpendLogWithApp,
} from "@/lib/supabase/types";

interface AppStateResult {
  isConfigured: boolean;
  loading: boolean;
  error: string | null;
  apps: OripaApp[];
  spendLogs: SpendLogWithApp[];
  cards: CardWithRelations[];
  metrics: DashboardMetrics;
  refreshAll: () => Promise<void>;
  createApp: (payload: OripaAppInsert) => Promise<void>;
  updateApp: (id: string, payload: OripaAppUpdate) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;
  createSpendLog: (payload: SpendLogInsert) => Promise<void>;
  updateSpendLog: (id: string, payload: SpendLogUpdate) => Promise<void>;
  deleteSpendLog: (id: string) => Promise<void>;
  createCard: (payload: CardInsert) => Promise<CardWithRelations | null>;
  updateCard: (id: string, payload: CardUpdate) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  createSale: (payload: SaleInsert) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  createShopPrice: (payload: ShopPriceInsert) => Promise<void>;
  deleteShopPrice: (id: string) => Promise<void>;
}

const EMPTY_METRICS: DashboardMetrics = {
  totalSpend: 0,
  totalSalesNet: 0,
  totalHoldingValue: 0,
  balance: 0,
  spendByApp: [],
  profitByApp: [],
};

export function useOripaAppState(): AppStateResult {
  const [apps, setApps] = useState<OripaApp[]>([]);
  const [spendLogs, setSpendLogs] = useState<SpendLogWithApp[]>([]);
  const [cards, setCards] = useState<CardWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAll = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [appsData, spendLogData, cardsData] = await Promise.all([
        fetchOripaApps(),
        fetchSpendLogs(),
        fetchCards(),
      ]);

      setApps(appsData);
      setSpendLogs(spendLogData);
      setCards(cardsData);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "データ取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  const wrapMutation = useCallback(
    async (action: () => Promise<unknown>) => {
      try {
        setError(null);
        await action();
        await refreshAll();
      } catch (mutationError) {
        setError(mutationError instanceof Error ? mutationError.message : "更新に失敗しました。");
        throw mutationError;
      }
    },
    [refreshAll],
  );

  const wrapMutationWithResult = useCallback(
    async <T,>(action: () => Promise<T>) => {
      try {
        setError(null);
        const result = await action();
        await refreshAll();
        return result;
      } catch (mutationError) {
        setError(mutationError instanceof Error ? mutationError.message : "更新に失敗しました。");
        throw mutationError;
      }
    },
    [refreshAll],
  );

  const metrics = useMemo(() => buildDashboardMetrics(cards, spendLogs), [cards, spendLogs]);

  return {
    isConfigured: isSupabaseConfigured,
    loading,
    error,
    apps,
    spendLogs,
    cards,
    metrics: isSupabaseConfigured ? metrics : EMPTY_METRICS,
    refreshAll,
    createApp: async (payload) => wrapMutation(() => createOripaApp(payload)),
    updateApp: async (id, payload) => wrapMutation(() => updateOripaApp(id, payload)),
    deleteApp: async (id) => wrapMutation(() => deleteOripaApp(id)),
    createSpendLog: async (payload) => wrapMutation(() => createSpendLog(payload)),
    updateSpendLog: async (id, payload) => wrapMutation(() => updateSpendLog(id, payload)),
    deleteSpendLog: async (id) => wrapMutation(() => deleteSpendLog(id)),
    createCard: async (payload) =>
      (wrapMutationWithResult(() => createCard(payload)) as unknown as Promise<CardWithRelations | null>),
    updateCard: async (id, payload) => wrapMutation(() => updateCard(id, payload)),
    deleteCard: async (id) => wrapMutation(() => deleteCard(id)),
    createSale: async (payload) =>
      wrapMutation(async () => {
        await createSale(payload);
        await updateCard(payload.card_id, {
          status: "sold",
          sold_at: payload.sold_date,
        });
      }),
    deleteSale: async (id) => wrapMutation(() => deleteSale(id)),
    createShopPrice: async (payload) => wrapMutation(() => createShopPrice(payload)),
    deleteShopPrice: async (id) => wrapMutation(() => deleteShopPrice(id)),
  };
}
