"use client";

import { useEffect, useState } from "react";

import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { OripaApp } from "@/lib/supabase/types";

interface OripaAppFormProps {
  initialValue?: OripaApp;
  onSubmit: (payload: { name: string }) => Promise<void>;
  onCancel?: () => void;
}

export function OripaAppForm({ initialValue, onSubmit, onCancel }: OripaAppFormProps) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(initialValue?.name ?? "");
  }, [initialValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialValue ? "アプリ名を編集" : "オリパアプリを追加"}</CardTitle>
        <CardDescription>課金集計の単位になるアプリ名を登録します。</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            try {
              await onSubmit({ name });
              if (!initialValue) {
                setName("");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Field htmlFor="app-name" label="アプリ名">
            <Input id="app-name" required value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <div className="flex gap-2">
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
