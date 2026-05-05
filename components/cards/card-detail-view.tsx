"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCcw, Trash2 } from "lucide-react";

import { CardImage } from "@/components/cards/card-image";
import { SaleForm } from "@/components/forms/sale-form";
import { ShopPriceForm } from "@/components/forms/shop-price-form";
import { EmptyState } from "@/components/layout/empty-state";
import { useAppData } from "@/components/layout/app-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

function formatDate(date?: string | null) {
  if (!date) {
    return "未記録";
  }

  return new Date(date).toLocaleDateString("ja-JP");
}

export function CardDetailView({ cardId }: { cardId: string }) {
  const { cards, createSale, deleteSale, createShopPrice, deleteShopPrice, updateCard } = useAppData();
  const card = cards.find((item) => item.id === cardId);

  if (!card) {
    return <EmptyState title="カードが見つかりません" description="一覧に戻って、カードが削除されていないか確認してください。" />;
  }

  const sortedSales = [...(card.sales ?? [])].sort((a, b) => b.sold_date.localeCompare(a.sold_date));
  const sortedShopPrices = [...(card.shop_prices ?? [])].sort((a, b) => b.price_date.localeCompare(a.price_date));

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost">
        <Link href="/cards">
          <ArrowLeft className="mr-2 size-4" />
          カード一覧へ戻る
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardContent className="space-y-4 p-5">
            <CardImage alt={card.name} src={card.image_url} />
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-slate-900">{card.name}</h2>
                <Badge>{card.status === "holding" ? "所持中" : "売却済"}</Badge>
              </div>
              <p className="text-sm text-slate-600">
                {card.rarity || "レアリティ未入力"} / {card.model_number || "型番未入力"}
              </p>
              <p className="text-sm text-slate-600">状態 {card.condition || "未入力"} / 枚数 {card.quantity}</p>
              <p className="text-sm text-slate-600">由来アプリ {card.oripa_app?.name ?? "未分類"}</p>
              <p className="text-sm text-slate-600">売却状態にした日 {formatDate(card.sold_at)}</p>
              <p className="text-lg font-semibold text-slate-900">{formatCurrency(card.current_market_price)} / 枚</p>
              <p className="text-sm text-slate-600">所持評価額 {formatCurrency(card.current_market_price * card.quantity)}</p>
              {card.memo ? <p className="rounded-2xl bg-muted/60 p-3 text-sm text-slate-700">{card.memo}</p> : null}
              {card.status === "holding" ? (
                <Button
                  onClick={() =>
                    void updateCard(card.id, {
                      status: "sold",
                      sold_at: new Date().toISOString().slice(0, 10),
                    })
                  }
                  variant="outline"
                >
                  売却済に変更
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    void updateCard(card.id, {
                      status: "holding",
                      sold_at: null,
                    })
                  }
                  variant="outline"
                >
                  所持中に戻す
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <SaleForm cardId={card.id} onSubmit={async (payload) => createSale(payload)} />

          <Card>
            <CardHeader>
              <CardTitle>売却履歴</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedSales.length ? (
                sortedSales.map((sale) => (
                  <div key={sale.id} className="flex items-start justify-between gap-3 rounded-2xl bg-muted/60 p-4">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">
                        {formatDate(sale.sold_date)} / {formatCurrency(sale.sold_price)}
                      </p>
                      <p className="text-sm text-slate-600">
                        手数料 {formatCurrency(sale.fee)} / 送料 {formatCurrency(sale.shipping)} / 売却先 {sale.sold_to || "未入力"}
                      </p>
                      {sale.memo ? <p className="text-sm text-slate-600">{sale.memo}</p> : null}
                    </div>
                    <Button onClick={() => void deleteSale(sale.id)} size="icon" variant="destructive">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <EmptyState title="売却履歴はまだありません" description="売却したらここに履歴が残り、売却日に合わせて状態も更新されます。" />
              )}
            </CardContent>
          </Card>

          <ShopPriceForm cardId={card.id} onSubmit={async (payload) => createShopPrice(payload)} />

          <Card>
            <CardHeader>
              <CardTitle>店舗価格メモ一覧</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedShopPrices.length ? (
                sortedShopPrices.map((shopPrice) => {
                  const candidatePrice = shopPrice.sell_price ?? shopPrice.buy_price ?? 0;

                  return (
                    <div key={shopPrice.id} className="space-y-3 rounded-2xl bg-muted/60 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900">
                            {shopPrice.shop_name} / {formatDate(shopPrice.price_date)}
                          </p>
                          <p className="text-sm text-slate-600">
                            買取 {shopPrice.buy_price ? formatCurrency(shopPrice.buy_price) : "-"} / 販売{" "}
                            {shopPrice.sell_price ? formatCurrency(shopPrice.sell_price) : "-"}
                          </p>
                          {shopPrice.memo ? <p className="text-sm text-slate-600">{shopPrice.memo}</p> : null}
                        </div>
                        <Button onClick={() => void deleteShopPrice(shopPrice.id)} size="icon" variant="destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          disabled={!candidatePrice}
                          onClick={() => void updateCard(card.id, { current_market_price: candidatePrice })}
                          size="sm"
                          variant="outline"
                        >
                          <RefreshCcw className="mr-2 size-4" />
                          この価格を現在相場に反映
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  title="店舗価格メモがありません"
                  description="ショップごとの買取・販売価格を登録しておくと、あとで現在相場に反映できます。"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
