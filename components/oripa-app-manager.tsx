"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { useAppData } from "@/components/layout/app-data-provider";
import { EmptyState } from "@/components/layout/empty-state";
import { OripaAppForm } from "@/components/forms/oripa-app-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function OripaAppManager() {
  const { apps, createApp, updateApp, deleteApp } = useAppData();
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingApp = apps.find((app) => app.id === editingId);

  return (
    <div className="space-y-6">
      <OripaAppForm
        initialValue={editingApp}
        onCancel={editingApp ? () => setEditingId(null) : undefined}
        onSubmit={async (payload) => {
          if (editingApp) {
            await updateApp(editingApp.id, payload);
            setEditingId(null);
            return;
          }
          await createApp(payload);
        }}
      />

      {apps.length === 0 ? (
        <EmptyState title="アプリがまだありません" description="最初に使用しているオリパアプリ名を登録してください。" />
      ) : (
        <div className="grid gap-3">
          {apps.map((app) => (
            <Card key={app.id}>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{app.name}</p>
                  <p className="text-sm text-slate-600">登録日 {new Date(app.created_at).toLocaleDateString("ja-JP")}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setEditingId(app.id)} size="icon" variant="outline">
                    <Pencil className="size-4" />
                  </Button>
                  <Button onClick={() => void deleteApp(app.id)} size="icon" variant="destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
