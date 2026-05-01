"use client";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { useAppData } from "@/components/layout/app-data-provider";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorBanner, MissingEnvBanner } from "@/components/layout/status-banner";

export default function HomePage() {
  const { isConfigured, error } = useAppData();

  return (
    <div className="page-shell">
      <PageHeader
        description="総課金額、売却総額、所持カード相場、総合収支をひと目で確認できます。カード原価は持たず、課金ログの合計だけをコストとして扱います。"
        title="ダッシュボード"
      />
      {!isConfigured ? <MissingEnvBanner /> : null}
      {error ? <ErrorBanner message={error} /> : null}
      <DashboardOverview />
    </div>
  );
}
