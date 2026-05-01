import { AlertCircle, DatabaseZap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function MissingEnvBanner() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex items-start gap-3 p-5">
        <DatabaseZap className="mt-0.5 size-5 text-amber-700" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">Supabase 未接続です</p>
          <p className="text-sm text-slate-600">
            `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定すると、CRUD が有効になります。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <Card className="border-destructive/30 bg-red-50">
      <CardContent className="flex items-start gap-3 p-5">
        <AlertCircle className="mt-0.5 size-5 text-destructive" />
        <div className="space-y-1">
          <p className="font-semibold text-red-900">データ処理でエラーが発生しました</p>
          <p className="text-sm text-red-800">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
