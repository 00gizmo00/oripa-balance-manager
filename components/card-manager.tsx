"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye, Plus, Search, Sparkles, Trash2 } from "lucide-react";

import { CardImage } from "@/components/cards/card-image";
import { CardForm } from "@/components/forms/card-form";
import { EmptyState } from "@/components/layout/empty-state";
import { useAppData } from "@/components/layout/app-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";

type FormMode = "create" | "edit" | null;

const HIGH_VALUE_THRESHOLD = 100000;

function getRarityBadgeClass(rarity?: string | null) {
  if (!rarity) {
    return "bg-slate-200 text-slate-700";
  }

  const normalized = rarity.toUpperCase();

  if (normalized.includes("SAR")) {
    return "border border-fuchsia-200 bg-fuchsia-100 text-fuchsia-900";
  }
  if (normalized.includes("UR")) {
    return "border border-amber-200 bg-amber-100 text-amber-900";
  }
  if (normalized.includes("AR")) {
    return "border border-sky-200 bg-sky-100 text-sky-900";
  }
  if (normalized.includes("SR")) {
    return "border border-violet-200 bg-violet-100 text-violet-900";
  }
  if (normalized.includes("CHR") || normalized.includes("CSR")) {
    return "border border-rose-200 bg-rose-100 text-rose-900";
  }
  if (normalized.includes("RRR")) {
    return "border border-orange-200 bg-orange-100 text-orange-900";
  }
  if (normalized.includes("RR")) {
    return "border border-emerald-200 bg-emerald-100 text-emerald-900";
  }
  if (normalized.includes("R")) {
    return "border border-blue-200 bg-blue-100 text-blue-900";
  }

  return "border border-slate-300 bg-slate-200 text-slate-700";
}

function formatShortDate(date?: string | null) {
  if (!date) {
    return null;
  }

  return new Date(date).toLocaleDateString("ja-JP");
}

export function CardManager() {
  const router = useRouter();
  const { apps, cards, createCard, updateCard, deleteCard, createShopPrice } = useAppData();
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "holding" | "sold">("all");

  const editingCard = cards.find((card) => card.id === editingId);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesQuery =
        query.length === 0 ||
        [card.name, card.rarity, card.model_number, card.condition, card.oripa_app?.name].some((value) =>
          value?.toLowerCase().includes(query.toLowerCase()),
        );
      const matchesStatus = statusFilter === "all" ? true : card.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [cards, query, statusFilter]);

  const holdingCount = filteredCards.filter((card) => card.status === "holding").length;
  const soldCount = filteredCards.length - holdingCount;

  const closeDialog = () => {
    setFormMode(null);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-slate-700">
                <Sparkles className="size-3.5" />
                コレクション表示
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">カードコレクション</h3>
                <p className="mt-2 text-sm text-slate-600">
                  一覧を先に眺められるようにしつつ、検索・状態フィルター・追加・編集をここからまとめて扱えます。
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="pl-10"
                    placeholder="カード名 / レアリティ / 型番 / 状態 / アプリ"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <SelectField
                  options={[
                    { label: "すべて", value: "all" },
                    { label: "所持中", value: "holding" },
                    { label: "売却済", value: "sold" },
                  ]}
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as "all" | "holding" | "sold")}
                />
              </div>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingId(null);
                  setFormMode("create");
                }}
                size="lg"
              >
                <Plus className="mr-2 size-4" />
                カードを追加
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">表示件数</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{filteredCards.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">所持中</p>
              <p className="mt-2 text-2xl font-bold text-emerald-900">{holdingCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-600">売却済</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{soldCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={formMode !== null} onOpenChange={(open) => (!open ? closeDialog() : null)}>
        <DialogContent className="p-0">
          <DialogHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
            <DialogTitle>{formMode === "edit" ? "カードを編集" : "カードを追加"}</DialogTitle>
            <DialogDescription>
              {formMode === "edit"
                ? "既存カードの情報を更新します。必要なら店舗価格メモもまとめて追加できます。"
                : "新しいカードをコレクションに追加します。"}
            </DialogDescription>
          </DialogHeader>
          <div className="px-1 pb-1 sm:px-2 sm:pb-2">
            <CardForm
              apps={apps}
              initialValue={editingCard}
              onCancel={closeDialog}
              onSubmit={async (payload) => {
                const { shop_prices, ...cardPayload } = payload;
                const normalizedCardPayload = {
                  ...cardPayload,
                  sold_at:
                    cardPayload.status === "sold"
                      ? editingCard?.sold_at ?? new Date().toISOString().slice(0, 10)
                      : null,
                };

                if (editingCard) {
                  await updateCard(editingCard.id, normalizedCardPayload);
                  for (const shopPrice of shop_prices) {
                    await createShopPrice({
                      card_id: editingCard.id,
                      ...shopPrice,
                    });
                  }
                  closeDialog();
                  return;
                }

                const createdCard = await createCard(normalizedCardPayload);
                if (createdCard) {
                  for (const shopPrice of shop_prices) {
                    await createShopPrice({
                      card_id: createdCard.id,
                      ...shopPrice,
                    });
                  }
                }
                closeDialog();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {filteredCards.length === 0 ? (
        <EmptyState
          title="表示できるカードがありません"
          description="検索条件を変えるか、上の「カードを追加」からコレクションに新しいカードを登録してください。"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:hidden">
            {filteredCards.map((card) => {
              const soldAt = formatShortDate(card.sold_at);

              return (
                <article
                  key={card.id}
                  className={cn(
                    "cursor-pointer overflow-hidden rounded-[1.75rem] border shadow-soft transition hover:-translate-y-0.5 active:scale-[0.99]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    card.status === "holding"
                      ? "border-emerald-200 bg-white"
                      : "border-slate-200 bg-slate-100/90 opacity-70 saturate-[0.75]",
                    card.current_market_price >= HIGH_VALUE_THRESHOLD
                      ? "ring-2 ring-amber-300 ring-offset-2 ring-offset-background"
                      : "",
                  )}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/cards/${card.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(`/cards/${card.id}`);
                    }
                  }}
                >
                  <div className="relative">
                    <CardImage alt={card.name} src={card.image_url} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge className={card.status === "holding" ? "bg-emerald-500 text-white" : "bg-slate-700 text-white"}>
                          {card.status === "holding" ? "所持中" : "売却済"}
                        </Badge>
                        {card.condition ? <Badge className="bg-white/90 text-slate-900">{card.condition}</Badge> : null}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="space-y-1">
                      <h3 className="line-clamp-2 min-h-[3rem] text-sm font-bold leading-6 text-slate-900">{card.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getRarityBadgeClass(card.rarity)}>{card.rarity || "レアリティ未入力"}</Badge>
                        <Badge className="bg-white/80 text-slate-700">{card.model_number || "型番未入力"}</Badge>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <div
                        className={cn(
                          "rounded-2xl px-3 py-2",
                          card.current_market_price >= HIGH_VALUE_THRESHOLD ? "bg-amber-100 text-amber-950" : "bg-muted/60",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">現在相場</p>
                          {card.current_market_price >= HIGH_VALUE_THRESHOLD ? (
                            <Badge className="bg-amber-500 text-white">高額</Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 text-base font-bold text-slate-900">{formatCurrency(card.current_market_price)}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>枚数 {card.quantity}</span>
                        <span>{card.oripa_app?.name ?? "未分類"}</span>
                      </div>
                      {soldAt ? <p className="text-xs text-slate-500">売却状態記録日 {soldAt}</p> : null}
                    </div>

                    <div className="grid gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/cards/${card.id}`}>
                          <Eye className="mr-2 size-4" />
                          詳細
                        </Link>
                      </Button>
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          setEditingId(card.id);
                          setFormMode("edit");
                        }}
                        size="sm"
                        variant="outline"
                      >
                        編集
                      </Button>
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          void deleteCard(card.id);
                        }}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="mr-2 size-4" />
                        削除
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <Card className="hidden lg:block">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[88px]">画像</TableHead>
                      <TableHead>カード情報</TableHead>
                      <TableHead>状態</TableHead>
                      <TableHead>枚数</TableHead>
                      <TableHead>現在相場</TableHead>
                      <TableHead>アプリ</TableHead>
                      <TableHead className="w-36">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCards.map((card) => {
                      const soldAt = formatShortDate(card.sold_at);

                      return (
                        <TableRow
                          key={card.id}
                          className={cn(
                            "cursor-pointer",
                            card.status === "sold" ? "bg-slate-50/80 text-slate-500" : "",
                            card.current_market_price >= HIGH_VALUE_THRESHOLD ? "bg-amber-50/60" : "",
                          )}
                          onClick={() => router.push(`/cards/${card.id}`)}
                        >
                          <TableCell>
                            <div className="w-14 overflow-hidden rounded-xl">
                              <CardImage alt={card.name} src={card.image_url} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div>
                                <p className="font-semibold text-slate-900">{card.name}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Badge className={getRarityBadgeClass(card.rarity)}>{card.rarity || "レアリティ未入力"}</Badge>
                                  <Badge className="bg-slate-100 text-slate-700">{card.model_number || "型番未入力"}</Badge>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {card.condition ? <Badge className="bg-amber-100 text-amber-900">{card.condition}</Badge> : null}
                                <Badge className={card.status === "holding" ? "bg-emerald-100 text-emerald-900" : "bg-slate-200 text-slate-800"}>
                                  {card.status === "holding" ? "所持中" : "売却済"}
                                </Badge>
                              </div>
                              {soldAt ? <p className="text-xs text-slate-500">売却状態記録日 {soldAt}</p> : null}
                            </div>
                          </TableCell>
                          <TableCell>{card.condition || "-"}</TableCell>
                          <TableCell>{card.quantity}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold text-slate-900">{formatCurrency(card.current_market_price)}</p>
                              <p className="text-xs text-slate-500">1枚あたり</p>
                            </div>
                            {card.current_market_price >= HIGH_VALUE_THRESHOLD ? (
                              <Badge className="mt-2 bg-amber-500 text-white">高額カード</Badge>
                            ) : null}
                          </TableCell>
                          <TableCell>{card.oripa_app?.name ?? "未分類"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button asChild size="icon" variant="outline">
                                <Link href={`/cards/${card.id}`}>
                                  <Eye className="size-4" />
                                </Link>
                              </Button>
                              <Button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setEditingId(card.id);
                                  setFormMode("edit");
                                }}
                                size="icon"
                                variant="outline"
                              >
                                編集
                              </Button>
                              <Button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  void deleteCard(card.id);
                                }}
                                size="icon"
                                variant="destructive"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
