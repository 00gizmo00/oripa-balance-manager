"use client";

import { OripaAppManager } from "@/components/oripa-app-manager";
import { useAppData } from "@/components/layout/app-data-provider";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorBanner, MissingEnvBanner } from "@/components/layout/status-banner";

export default function OripaAppsPage() {
  const { isConfigured, error } = useAppData();

  return (
    <div className="page-shell">
      <PageHeader description="オリパアプリ名を管理します。課金ログとカードに紐づけるベースマスタです。" title="オリパアプリ管理" />
      {!isConfigured ? <MissingEnvBanner /> : null}
      {error ? <ErrorBanner message={error} /> : null}
      <OripaAppManager />
    </div>
  );
}
