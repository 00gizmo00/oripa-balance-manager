"use client";

import Link from "next/link";
import { ArrowUpRight, Coins, HandCoins, Landmark, Layers3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/components/layout/app-data-provider";
import { EmptyState } from "@/components/layout/empty-state";
import { formatCurrency } from "@/lib/utils";

const summaryItems = [
  {
    key: "totalSpend",
    label: "総課金額",
    icon: Coins,
    color: "text-orange-700",
  },
  {
    key: "totalSalesNet",
    label: "売却総額",
    icon: HandCoins,
    color: "text-teal-700",
  },
  {
    key: "totalHoldingValue",
    label: "所持カード相場合計",
    icon: Layers3,
    color: "text-amber-700",
  },
  {
    key: "balance",
    label: "総合収支",
    icon: Landmark,
    color: "text-slate-900",
  },
] as const;

export function DashboardOverview() {
  const { metrics, cards, spendLogs } = useAppData();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => {
          const Icon = item.icon;
          const value = metrics[item.key];
          return (
            <Card key={item.key}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{item.label}</p>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{formatCurrency(value)}</p>
                  </div>
                  <div className="rounded-2xl bg-muted p-3">
                    <Icon className={`size-5 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>アプリ別課金額</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.spendByApp.length === 0 ? (
              <EmptyState title="課金ログがまだありません" description="まずはオリパアプリと課金ログを登録すると集計が始まります。" />
            ) : (
              metrics.spendByApp.map((app) => (
                <div key={app.appId} className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{app.appName}</p>
                    <p className="text-xs text-slate-500">課金ログから自動集計</p>
                  </div>
                  <p className="font-semibold text-slate-900">{formatCurrency(app.totalAmount)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>クイック導線</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-4 transition-colors hover:bg-muted"
              href="/spend-logs"
            >
              <div>
                <p className="font-medium text-slate-900">課金ログを追加</p>
                <p className="text-sm text-slate-600">総課金額の元データを入力</p>
              </div>
              <ArrowUpRight className="size-4 text-slate-500" />
            </Link>
            <Link
              className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-4 transition-colors hover:bg-muted"
              href="/cards"
            >
              <div>
                <p className="font-medium text-slate-900">カードを登録</p>
                <p className="text-sm text-slate-600">所持中と売却済をまとめて管理</p>
              </div>
              <ArrowUpRight className="size-4 text-slate-500" />
            </Link>
            <div className="rounded-2xl bg-muted/60 px-4 py-4">
              <p className="font-medium text-slate-900">登録状況</p>
              <p className="mt-2 text-sm text-slate-600">課金ログ {spendLogs.length} 件 / カード {cards.length} 件</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
