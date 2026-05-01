"use client";

import { use } from "react";

import { CardDetailView } from "@/components/cards/card-detail-view";
import { useAppData } from "@/components/layout/app-data-provider";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorBanner, MissingEnvBanner } from "@/components/layout/status-banner";

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  const { isConfigured, error } = useAppData();

  return (
    <div className="page-shell">
      <PageHeader description="カード単位で売却履歴と店舗価格メモを管理します。" title="カード詳細" />
      {!isConfigured ? <MissingEnvBanner /> : null}
      {error ? <ErrorBanner message={error} /> : null}
      <CardDetailView cardId={resolved.id} />
    </div>
  );
}
