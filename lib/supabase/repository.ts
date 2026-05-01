"use client";

import { createSupabaseClient } from "@/lib/supabase/client";
import type {
  CardInsert,
  CardUpdate,
  CardWithRelations,
  OripaAppInsert,
  OripaAppUpdate,
  SaleInsert,
  ShopPriceInsert,
  SpendLogInsert,
  SpendLogUpdate,
  SpendLogWithApp,
} from "@/lib/supabase/types";

function getClient() {
  const client = createSupabaseClient();

  if (!client) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return client;
}

async function unwrap<T>(promise: PromiseLike<{ data: T | null; error: { message: string } | null }>) {
  const { data, error } = await promise;
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function fetchOripaApps() {
  return (
    (await unwrap(
      getClient().from("oripa_apps").select("*").order("created_at", { ascending: false }),
    )) ?? []
  );
}

export async function createOripaApp(payload: OripaAppInsert) {
  return unwrap(getClient().from("oripa_apps").insert(payload).select().single());
}

export async function updateOripaApp(id: string, payload: OripaAppUpdate) {
  return unwrap(getClient().from("oripa_apps").update(payload).eq("id", id).select().single());
}

export async function deleteOripaApp(id: string) {
  return unwrap(getClient().from("oripa_apps").delete().eq("id", id));
}

export async function fetchSpendLogs() {
  const data = await unwrap(
    getClient()
      .from("spend_logs")
      .select("*, oripa_app:oripa_apps(id, name)")
      .order("spend_date", { ascending: false }),
  );
  return (data as SpendLogWithApp[] | null) ?? [];
}

export async function createSpendLog(payload: SpendLogInsert) {
  return unwrap(getClient().from("spend_logs").insert(payload).select().single());
}

export async function updateSpendLog(id: string, payload: SpendLogUpdate) {
  return unwrap(getClient().from("spend_logs").update(payload).eq("id", id).select().single());
}

export async function deleteSpendLog(id: string) {
  return unwrap(getClient().from("spend_logs").delete().eq("id", id));
}

export async function fetchCards() {
  const data = await unwrap(
    getClient()
      .from("cards")
      .select("*, oripa_app:oripa_apps(id, name), sales(*), shop_prices(*)")
      .order("created_at", { ascending: false }),
  );
  return (data as CardWithRelations[] | null) ?? [];
}

export async function fetchCardById(id: string) {
  const data = await unwrap(
    getClient()
      .from("cards")
      .select("*, oripa_app:oripa_apps(id, name), sales(*), shop_prices(*)")
      .eq("id", id)
      .single(),
  );
  return data as unknown as CardWithRelations;
}

export async function createCard(payload: CardInsert) {
  return unwrap(getClient().from("cards").insert(payload).select().single());
}

export async function updateCard(id: string, payload: CardUpdate) {
  return unwrap(getClient().from("cards").update(payload).eq("id", id).select().single());
}

export async function deleteCard(id: string) {
  return unwrap(getClient().from("cards").delete().eq("id", id));
}

export async function createSale(payload: SaleInsert) {
  return unwrap(getClient().from("sales").insert(payload).select().single());
}

export async function deleteSale(id: string) {
  return unwrap(getClient().from("sales").delete().eq("id", id));
}

export async function createShopPrice(payload: ShopPriceInsert) {
  return unwrap(getClient().from("shop_prices").insert(payload).select().single());
}

export async function deleteShopPrice(id: string) {
  return unwrap(getClient().from("shop_prices").delete().eq("id", id));
}
