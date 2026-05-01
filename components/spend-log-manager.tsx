"use client";

import { format } from "date-fns";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { SpendLogForm } from "@/components/forms/spend-log-form";
import { EmptyState } from "@/components/layout/empty-state";
import { useAppData } from "@/components/layout/app-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

export function SpendLogManager() {
  const { apps, spendLogs, createSpendLog, updateSpendLog, deleteSpendLog } = useAppData();
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingLog = spendLogs.find((log) => log.id === editingId);

  if (apps.length === 0) {
    return <EmptyState title="先にアプリを登録してください" description="課金ログはオリパアプリに紐づくため、最初にアプリ管理から登録が必要です。" />;
  }

  return (
    <div className="space-y-6">
      <SpendLogForm
        apps={apps}
        initialValue={editingLog}
        onCancel={editingLog ? () => setEditingId(null) : undefined}
        onSubmit={async (payload) => {
          if (editingLog) {
            await updateSpendLog(editingLog.id, payload);
            setEditingId(null);
            return;
          }
          await createSpendLog(payload);
        }}
      />

      {spendLogs.length === 0 ? (
        <EmptyState title="課金ログがまだありません" description="1件ずつ追加すると、ダッシュボードの総課金額に反映されます。" />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {spendLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{log.oripa_app?.name ?? "未分類"}</p>
                      <p className="text-sm text-slate-600">{format(new Date(log.spend_date), "yyyy/MM/dd")}</p>
                    </div>
                    <Badge>{formatCurrency(log.amount)}</Badge>
                  </div>
                  {log.memo ? <p className="text-sm text-slate-600">{log.memo}</p> : null}
                  <div className="flex gap-2">
                    <Button onClick={() => setEditingId(log.id)} size="sm" variant="outline">
                      <Pencil className="mr-2 size-4" />
                      編集
                    </Button>
                    <Button onClick={() => void deleteSpendLog(log.id)} size="sm" variant="destructive">
                      <Trash2 className="mr-2 size-4" />
                      削除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="hidden md:block">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日付</TableHead>
                      <TableHead>アプリ</TableHead>
                      <TableHead>金額</TableHead>
                      <TableHead>メモ</TableHead>
                      <TableHead className="w-32">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {spendLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{format(new Date(log.spend_date), "yyyy/MM/dd")}</TableCell>
                        <TableCell>{log.oripa_app?.name ?? "未分類"}</TableCell>
                        <TableCell>{formatCurrency(log.amount)}</TableCell>
                        <TableCell>{log.memo ?? "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button onClick={() => setEditingId(log.id)} size="icon" variant="outline">
                              <Pencil className="size-4" />
                            </Button>
                            <Button onClick={() => void deleteSpendLog(log.id)} size="icon" variant="destructive">
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
