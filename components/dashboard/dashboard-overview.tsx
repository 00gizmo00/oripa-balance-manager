"use client";

import Link from "next/link";
import { ArrowUpRight, Coins, HandCoins, Landmark, Layers3 } from "lucide-react";

import { useAppData } from "@/components/layout/app-data-provider";
import { EmptyState } from "@/components/layout/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
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
            <CardTitle>クイック操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-4 transition-colors hover:bg-muted"
              href="/spend-logs"
            >
              <div>
                <p className="font-medium text-slate-900">課金ログを追加</p>
                <p className="text-sm text-slate-600">総課金額の元データを登録</p>
              </div>
              <ArrowUpRight className="size-4 text-slate-500" />
            </Link>
            <Link
              className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-4 transition-colors hover:bg-muted"
              href="/cards"
            >
              <div>
                <p className="font-medium text-slate-900">カードを管理</p>
                <p className="text-sm text-slate-600">所持中と売却済をまとめて確認</p>
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

      <Card>
        <CardHeader>
          <CardTitle>アプリ別利益分析</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {metrics.profitByApp.length === 0 ? (
            <EmptyState
              title="分析できるデータがまだありません"
              description="課金ログとカードをアプリに紐づけると、アプリごとの回収状況を確認できます。"
            />
          ) : (
            metrics.profitByApp.map((app) => (
              <div key={app.appId} className="rounded-3xl border border-border bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-slate-900">{app.appName}</p>
                      <Badge className={app.balance >= 0 ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}>
                        {app.balance >= 0 ? "プラス収支" : "マイナス収支"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      所持 {app.holdingCount} 枚 / 売却済 {app.soldCount} 枚
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">収支</p>
                    <p className="mt-1 text-xl font-bold">{formatCurrency(app.balance)}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  <div className="rounded-2xl bg-orange-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-orange-700">課金</p>
                    <p className="mt-1 font-semibold text-slate-900">{formatCurrency(app.spendAmount)}</p>
                  </div>
                  <div className="rounded-2xl bg-teal-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-teal-700">売却</p>
                    <p className="mt-1 font-semibold text-slate-900">{formatCurrency(app.salesNet)}</p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-amber-700">所持評価</p>
                    <p className="mt-1 font-semibold text-slate-900">{formatCurrency(app.holdingValue)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-700">回収率の見方</p>
                    <p className="mt-1 text-sm text-slate-700">売却 + 所持評価 - 課金</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
