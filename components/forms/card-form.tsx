"use client";

import { useState } from "react";

import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import type { CardWithRelations, OripaApp } from "@/lib/supabase/types";

interface CardFormProps {
  apps: OripaApp[];
  initialValue?: CardWithRelations;
  onSubmit: (payload: {
    name: string;
    rarity?: string | null;
    model_number?: string | null;
    quantity: number;
    condition?: string | null;
    oripa_app_id?: string | null;
    current_market_price: number;
    image_url?: string | null;
    memo?: string | null;
    status: "holding" | "sold";
  }) => Promise<void>;
  onCancel?: () => void;
}

export function CardForm({ apps, initialValue, onSubmit, onCancel }: CardFormProps) {
  const [form, setForm] = useState({
    name: initialValue?.name ?? "",
    rarity: initialValue?.rarity ?? "",
    model_number: initialValue?.model_number ?? "",
    quantity: initialValue?.quantity?.toString() ?? "1",
    condition: initialValue?.condition ?? "",
    oripa_app_id: initialValue?.oripa_app_id ?? "",
    current_market_price: initialValue?.current_market_price?.toString() ?? "0",
    image_url: initialValue?.image_url ?? "",
    memo: initialValue?.memo ?? "",
    status: initialValue?.status ?? ("holding" as const),
  });
  const [submitting, setSubmitting] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialValue ? "カードを編集" : "カードを登録"}</CardTitle>
        <CardDescription>所持枚数と現在相場を入力して、含み益の把握に使います。</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            try {
              await onSubmit({
                name: form.name,
                rarity: form.rarity || null,
                model_number: form.model_number || null,
                quantity: Number(form.quantity),
                condition: form.condition || null,
                oripa_app_id: form.oripa_app_id || null,
                current_market_price: Number(form.current_market_price),
                image_url: form.image_url || null,
                memo: form.memo || null,
                status: form.status,
              });

              if (!initialValue) {
                setForm({
                  name: "",
                  rarity: "",
                  model_number: "",
                  quantity: "1",
                  condition: "",
                  oripa_app_id: "",
                  current_market_price: "0",
                  image_url: "",
                  memo: "",
                  status: "holding",
                });
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Field label="カード名">
            <Input required value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </Field>
          <Field label="レアリティ">
            <Input value={form.rarity} onChange={(event) => setForm((prev) => ({ ...prev, rarity: event.target.value }))} />
          </Field>
          <Field label="型番">
            <Input
              value={form.model_number}
              onChange={(event) => setForm((prev) => ({ ...prev, model_number: event.target.value }))}
            />
          </Field>
          <Field label="状態">
            <Input value={form.condition} onChange={(event) => setForm((prev) => ({ ...prev, condition: event.target.value }))} />
          </Field>
          <Field label="枚数">
            <Input
              inputMode="numeric"
              min={0}
              required
              type="number"
              value={form.quantity}
              onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
            />
          </Field>
          <Field label="現在相場（1枚あたり）">
            <Input
              inputMode="numeric"
              min={0}
              required
              type="number"
              value={form.current_market_price}
              onChange={(event) => setForm((prev) => ({ ...prev, current_market_price: event.target.value }))}
            />
          </Field>
          <Field label="紐づくオリパアプリ">
            <SelectField
              options={apps.map((app) => ({ label: app.name, value: app.id }))}
              placeholder="未選択"
              value={form.oripa_app_id}
              onChange={(event) => setForm((prev) => ({ ...prev, oripa_app_id: event.target.value }))}
            />
          </Field>
          <Field label="ステータス">
            <SelectField
              options={[
                { label: "所持中", value: "holding" },
                { label: "売却済", value: "sold" },
              ]}
              required
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value as "holding" | "sold" }))
              }
            />
          </Field>
          <Field className="sm:col-span-2" label="画像URL">
            <Input value={form.image_url} onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))} />
          </Field>
          <Field className="sm:col-span-2" label="メモ">
            <Textarea value={form.memo} onChange={(event) => setForm((prev) => ({ ...prev, memo: event.target.value }))} />
          </Field>
          <div className="flex gap-2 sm:col-span-2">
            <Button disabled={submitting} type="submit">
              {submitting ? "保存中..." : initialValue ? "更新する" : "追加する"}
            </Button>
            {onCancel ? (
              <Button disabled={submitting} onClick={onCancel} type="button" variant="outline">
                キャンセル
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
