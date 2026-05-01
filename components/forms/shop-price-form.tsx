"use client";

import { format } from "date-fns";
import { useState } from "react";

import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ShopPriceFormProps {
  cardId: string;
  onSubmit: (payload: {
    card_id: string;
    shop_name: string;
    buy_price?: number | null;
    sell_price?: number | null;
    price_date: string;
    memo?: string | null;
  }) => Promise<void>;
}

export function ShopPriceForm({ cardId, onSubmit }: ShopPriceFormProps) {
  const [form, setForm] = useState({
    shop_name: "",
    buy_price: "",
    sell_price: "",
    price_date: format(new Date(), "yyyy-MM-dd"),
    memo: "",
  });
  const [submitting, setSubmitting] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>店舗価格メモを追加</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            try {
              await onSubmit({
                card_id: cardId,
                shop_name: form.shop_name,
                buy_price: form.buy_price ? Number(form.buy_price) : null,
                sell_price: form.sell_price ? Number(form.sell_price) : null,
                price_date: form.price_date,
                memo: form.memo || null,
              });
              setForm({
                shop_name: "",
                buy_price: "",
                sell_price: "",
                price_date: format(new Date(), "yyyy-MM-dd"),
                memo: "",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Field label="店舗名">
            <Input required value={form.shop_name} onChange={(event) => setForm((prev) => ({ ...prev, shop_name: event.target.value }))} />
          </Field>
          <Field label="確認日">
            <Input
              required
              type="date"
              value={form.price_date}
              onChange={(event) => setForm((prev) => ({ ...prev, price_date: event.target.value }))}
            />
          </Field>
          <Field label="買取価格">
            <Input
              inputMode="numeric"
              min={0}
              type="number"
              value={form.buy_price}
              onChange={(event) => setForm((prev) => ({ ...prev, buy_price: event.target.value }))}
            />
          </Field>
          <Field label="販売価格">
            <Input
              inputMode="numeric"
              min={0}
              type="number"
              value={form.sell_price}
              onChange={(event) => setForm((prev) => ({ ...prev, sell_price: event.target.value }))}
            />
          </Field>
          <Field className="sm:col-span-2" label="メモ">
            <Textarea value={form.memo} onChange={(event) => setForm((prev) => ({ ...prev, memo: event.target.value }))} />
          </Field>
          <div className="sm:col-span-2">
            <Button disabled={submitting} type="submit">
              {submitting ? "保存中..." : "店舗価格を追加"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
