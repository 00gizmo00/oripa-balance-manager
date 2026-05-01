"use client";

import { format } from "date-fns";
import { useState } from "react";

import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SaleFormProps {
  cardId: string;
  onSubmit: (payload: {
    card_id: string;
    sold_price: number;
    sold_date: string;
    sold_to?: string | null;
    fee: number;
    shipping: number;
    memo?: string | null;
  }) => Promise<void>;
}

export function SaleForm({ cardId, onSubmit }: SaleFormProps) {
  const [form, setForm] = useState({
    sold_price: "",
    sold_date: format(new Date(), "yyyy-MM-dd"),
    sold_to: "",
    fee: "0",
    shipping: "0",
    memo: "",
  });
  const [submitting, setSubmitting] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>売却を登録</CardTitle>
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
                sold_price: Number(form.sold_price),
                sold_date: form.sold_date,
                sold_to: form.sold_to || null,
                fee: Number(form.fee),
                shipping: Number(form.shipping),
                memo: form.memo || null,
              });
              setForm({
                sold_price: "",
                sold_date: format(new Date(), "yyyy-MM-dd"),
                sold_to: "",
                fee: "0",
                shipping: "0",
                memo: "",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Field label="売却価格">
            <Input
              inputMode="numeric"
              min={0}
              required
              type="number"
              value={form.sold_price}
              onChange={(event) => setForm((prev) => ({ ...prev, sold_price: event.target.value }))}
            />
          </Field>
          <Field label="売却日">
            <Input
              required
              type="date"
              value={form.sold_date}
              onChange={(event) => setForm((prev) => ({ ...prev, sold_date: event.target.value }))}
            />
          </Field>
          <Field label="売却先">
            <Input value={form.sold_to} onChange={(event) => setForm((prev) => ({ ...prev, sold_to: event.target.value }))} />
          </Field>
          <Field label="手数料">
            <Input
              inputMode="numeric"
              min={0}
              required
              type="number"
              value={form.fee}
              onChange={(event) => setForm((prev) => ({ ...prev, fee: event.target.value }))}
            />
          </Field>
          <Field label="送料">
            <Input
              inputMode="numeric"
              min={0}
              required
              type="number"
              value={form.shipping}
              onChange={(event) => setForm((prev) => ({ ...prev, shipping: event.target.value }))}
            />
          </Field>
          <Field className="sm:col-span-2" label="メモ">
            <Textarea value={form.memo} onChange={(event) => setForm((prev) => ({ ...prev, memo: event.target.value }))} />
          </Field>
          <div className="sm:col-span-2">
            <Button disabled={submitting} type="submit">
              {submitting ? "保存中..." : "売却履歴を追加"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
