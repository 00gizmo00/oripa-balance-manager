"use client";

import { CardManager } from "@/components/card-manager";
import { useAppData } from "@/components/layout/app-data-provider";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorBanner, MissingEnvBanner } from "@/components/layout/status-banner";

export default function CardsPage() {
  const { isConfigured, error } = useAppData();

  return (
    <div className="page-shell">
      <PageHeader
        description="スマホではカード型、PCでは一覧テーブルで管理します。カード検索、所持中/売却済フィルター、画像プレースホルダーにも対応しています。"
        title="カード管理"
      />
      {!isConfigured ? <MissingEnvBanner /> : null}
      {error ? <ErrorBanner message={error} /> : null}
      <CardManager />
    </div>
  );
}
