import type { ReactNode } from "react";
import type { Metadata } from "next";

import "@/app/globals.css";

import { AppDataProvider } from "@/components/layout/app-data-provider";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "オリパ収支管理 MVP",
  description: "ポケカ・オリパの課金額、売却額、所持カード相場をまとめて管理する個人用アプリ",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <AppDataProvider>
          <AppShell>{children}</AppShell>
        </AppDataProvider>
      </body>
    </html>
  );
}
