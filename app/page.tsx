"use client";

import { BackupButton } from "@/components/dashboard/backup-button";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { useAppData } from "@/components/layout/app-data-provider";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorBanner, MissingEnvBanner } from "@/components/layout/status-banner";

export default function HomePage() {
  const { isConfigured, error } = useAppData();

  return (
    <div className="page-shell">
      <PageHeader
        action={<BackupButton />}
        description="総課金額、売却総額、所持カード相場合計、総合収支をまとめて確認できます。まずはオリパアプリごとの支出とカード情報を入れて、全体の回収状況を追える状態にします。"
        title="ダッシュボード"
      />
      {!isConfigured ? <MissingEnvBanner /> : null}
      {error ? <ErrorBanner message={error} /> : null}
      <DashboardOverview />
    </div>
  );
}
