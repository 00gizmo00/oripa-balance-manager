"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";

import { CardForm } from "@/components/forms/card-form";
import { CardImage } from "@/components/cards/card-image";
import { EmptyState } from "@/components/layout/empty-state";
import { useAppData } from "@/components/layout/app-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

export function CardManager() {
  const { apps, cards, createCard, updateCard, deleteCard, createShopPrice } = useAppData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "holding" | "sold">("all");

  const editingCard = cards.find((card) => card.id === editingId);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesQuery =
        query.length === 0 ||
        [card.name, card.rarity, card.model_number].some((value) => value?.toLowerCase().includes(query.toLowerCase()));
      const matchesStatus = statusFilter === "all" ? true : card.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [cards, query, statusFilter]);

  return (
    <div className="space-y-6">
      <CardForm
        apps={apps}
        initialValue={editingCard}
        onCancel={editingCard ? () => setEditingId(null) : undefined}
        onSubmit={async (payload) => {
          const { shop_prices, ...cardPayload } = payload;

          if (editingCard) {
            await updateCard(editingCard.id, cardPayload);
            for (const shopPrice of shop_prices) {
              await createShopPrice({
                card_id: editingCard.id,
                ...shopPrice,
              });
            }
            setEditingId(null);
            return;
          }
          const createdCard = await createCard(cardPayload);
          if (createdCard) {
            for (const shopPrice of shop_prices) {
              await createShopPrice({
                card_id: createdCard.id,
                ...shopPrice,
              });
            }
          }
        }}
      />

      <Card>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-10" placeholder="カード名 / レア / 型番で検索" value={query} onChange={(event) => setQuery(event.target.value)} />
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
        </CardContent>
      </Card>

      {filteredCards.length === 0 ? (
        <EmptyState title="該当カードがありません" description="検索条件を変えるか、新しいカードを登録してください。" />
      ) : (
        <>
          <div className="grid gap-4 lg:hidden">
            {filteredCards.map((card) => (
              <Card key={card.id}>
                <CardContent className="space-y-4 p-4">
                  <div className="grid grid-cols-[88px_1fr] gap-4">
                    <CardImage alt={card.name} src={card.image_url} />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-slate-900">{card.name}</h3>
                        <Badge>{card.status === "holding" ? "所持中" : "売却済"}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {card.rarity || "レア未入力"} / {card.model_number || "型番未入力"}
                      </p>
                      <p className="text-sm text-slate-600">枚数 {card.quantity} / 状態 {card.condition || "未入力"}</p>
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(card.current_market_price)} / 枚</p>
                      <p className="text-xs text-slate-500">{card.oripa_app?.name ?? "未分類"}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/cards/${card.id}`}>
                        <Eye className="mr-2 size-4" />
                        詳細
                      </Link>
                    </Button>
                    <Button onClick={() => setEditingId(card.id)} size="sm" variant="outline">
                      <Pencil className="mr-2 size-4" />
                      編集
                    </Button>
                    <Button onClick={() => void deleteCard(card.id)} size="sm" variant="destructive">
                      <Trash2 className="mr-2 size-4" />
                      削除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="hidden lg:block">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>カード名</TableHead>
                      <TableHead>アプリ</TableHead>
                      <TableHead>状態</TableHead>
                      <TableHead>枚数</TableHead>
                      <TableHead>相場</TableHead>
                      <TableHead>条件</TableHead>
                      <TableHead className="w-40">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCards.map((card) => (
                      <TableRow key={card.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{card.name}</p>
                            <p className="text-xs text-slate-500">
                              {card.rarity || "-"} / {card.model_number || "-"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{card.oripa_app?.name ?? "未分類"}</TableCell>
                        <TableCell>{card.status === "holding" ? "所持中" : "売却済"}</TableCell>
                        <TableCell>{card.quantity}</TableCell>
                        <TableCell>{formatCurrency(card.current_market_price)}</TableCell>
                        <TableCell>{card.condition ?? "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button asChild size="icon" variant="outline">
                              <Link href={`/cards/${card.id}`}>
                                <Eye className="size-4" />
                              </Link>
                            </Button>
                            <Button onClick={() => setEditingId(card.id)} size="icon" variant="outline">
                              <Pencil className="size-4" />
                            </Button>
                            <Button onClick={() => void deleteCard(card.id)} size="icon" variant="destructive">
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
