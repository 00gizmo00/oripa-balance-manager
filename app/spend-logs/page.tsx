"use client";

import { SpendLogManager } from "@/components/spend-log-manager";
import { useAppData } from "@/components/layout/app-data-provider";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorBanner, MissingEnvBanner } from "@/components/layout/status-banner";

export default function SpendLogsPage() {
  const { isConfigured, error } = useAppData();

  return (
    <div className="page-shell">
      <PageHeader
        description="課金ログの合計だけを原価として使います。カードごとの取得原価は持たず、収支計算をシンプルに保ちます。"
        title="課金ログ"
      />
      {!isConfigured ? <MissingEnvBanner /> : null}
      {error ? <ErrorBanner message={error} /> : null}
      <SpendLogManager />
    </div>
  );
}
