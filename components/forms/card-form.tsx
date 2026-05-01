"use client";

import Image from "next/image";
import { ImageUp, Trash2 } from "lucide-react";
import { ChangeEvent, ClipboardEvent, useEffect, useRef, useState } from "react";

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

function createDefaultForm(apps: OripaApp[], initialValue?: CardWithRelations) {
  return {
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
  };
}

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("画像の読み込みに失敗しました。"));
    reader.readAsDataURL(file);
  });
}

export function CardForm({ apps, initialValue, onSubmit, onCancel }: CardFormProps) {
  const [form, setForm] = useState(createDefaultForm(apps, initialValue));
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setForm(createDefaultForm(apps, initialValue));
  }, [apps, initialValue]);

  const setImageFromFile = async (file: File) => {
    setUploadingImage(true);
    try {
      const imageUrl = await readFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, image_url: imageUrl }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    await setImageFromFile(file);
    event.target.value = "";
  };

  const handlePaste = async (event: ClipboardEvent<HTMLDivElement>) => {
    const imageItem = Array.from(event.clipboardData.items).find((item) => item.type.startsWith("image/"));
    if (!imageItem) {
      return;
    }

    const file = imageItem.getAsFile();
    if (!file) {
      return;
    }

    event.preventDefault();
    await setImageFromFile(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialValue ? "カードを編集" : "カードを登録"}</CardTitle>
        <CardDescription>
          編集時は既存内容がフォームに入ります。複数店舗の相場は登録後に詳細画面から何件でも追加できます。
        </CardDescription>
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
                setForm(createDefaultForm(apps));
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
          <div className="sm:col-span-2">
            <Field label="画像ファイル / スクショ">
              <div
                className="space-y-3 rounded-2xl border border-dashed border-border bg-muted/40 p-4"
                onPaste={(event) => void handlePaste(event)}
              >
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    type="file"
                    onChange={(event) => void handleFileChange(event)}
                  />
                  <Button onClick={() => fileInputRef.current?.click()} type="button" variant="outline">
                    <ImageUp className="mr-2 size-4" />
                    画像を選択
                  </Button>
                  {form.image_url ? (
                    <Button onClick={() => setForm((prev) => ({ ...prev, image_url: "" }))} type="button" variant="outline">
                      <Trash2 className="mr-2 size-4" />
                      画像をクリア
                    </Button>
                  ) : null}
                </div>
                <p className="text-xs text-slate-600">
                  スクショ画像や写真を選択できます。PC ではこの枠に画像を貼り付けることもできます。
                </p>
                {uploadingImage ? <p className="text-xs text-slate-600">画像を読み込み中...</p> : null}
                {form.image_url ? (
                  <div className="relative h-40 w-28 overflow-hidden rounded-xl border border-border bg-white">
                    {form.image_url.startsWith("data:") ? (
                      <img alt="カード画像プレビュー" className="h-full w-full object-cover" src={form.image_url} />
                    ) : (
                      <Image alt="カード画像プレビュー" fill className="object-cover" sizes="112px" src={form.image_url} unoptimized />
                    )}
                  </div>
                ) : null}
              </div>
            </Field>
          </div>
          <Field className="sm:col-span-2" label="メモ">
            <Textarea value={form.memo} onChange={(event) => setForm((prev) => ({ ...prev, memo: event.target.value }))} />
          </Field>
          <div className="flex gap-2 sm:col-span-2">
            <Button disabled={submitting || uploadingImage} type="submit">
              {submitting ? "保存中..." : initialValue ? "更新する" : "追加する"}
            </Button>
            {onCancel ? (
              <Button disabled={submitting || uploadingImage} onClick={onCancel} type="button" variant="outline">
                キャンセル
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
