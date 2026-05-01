"use client";

import { format } from "date-fns";
import { useState } from "react";

import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import type { OripaApp, SpendLogWithApp } from "@/lib/supabase/types";

interface SpendLogFormProps {
  apps: OripaApp[];
  initialValue?: SpendLogWithApp;
  onSubmit: (payload: { oripa_app_id: string; amount: number; spend_date: string; memo?: string | null }) => Promise<void>;
  onCancel?: () => void;
}

export function SpendLogForm({ apps, initialValue, onSubmit, onCancel }: SpendLogFormProps) {
  const [form, setForm] = useState({
    oripa_app_id: initialValue?.oripa_app_id ?? apps[0]?.id ?? "",
    amount: initialValue?.amount?.toString() ?? "",
    spend_date: initialValue?.spend_date ?? format(new Date(), "yyyy-MM-dd"),
    memo: initialValue?.memo ?? "",
  });
  const [submitting, setSubmitting] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialValue ? "課金ログを編集" : "課金ログを追加"}</CardTitle>
        <CardDescription>原価はカード単位ではなく、ここで登録した課金合計のみを使います。</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            try {
              await onSubmit({
                oripa_app_id: form.oripa_app_id,
                amount: Number(form.amount),
                spend_date: form.spend_date,
                memo: form.memo || null,
              });

              if (!initialValue) {
                setForm({
                  oripa_app_id: apps[0]?.id ?? "",
                  amount: "",
                  spend_date: format(new Date(), "yyyy-MM-dd"),
                  memo: "",
                });
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Field label="オリパアプリ">
            <SelectField
              options={apps.map((app) => ({ label: app.name, value: app.id }))}
              required
              value={form.oripa_app_id}
              onChange={(event) => setForm((prev) => ({ ...prev, oripa_app_id: event.target.value }))}
            />
          </Field>
          <Field label="課金額">
            <Input
              inputMode="numeric"
              min={0}
              required
              type="number"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
            />
          </Field>
          <Field label="課金日">
            <Input
              required
              type="date"
              value={form.spend_date}
              onChange={(event) => setForm((prev) => ({ ...prev, spend_date: event.target.value }))}
            />
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
