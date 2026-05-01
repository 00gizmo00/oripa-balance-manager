"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, LayoutDashboard, Package2, ReceiptText } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/oripa-apps", label: "アプリ管理", icon: Package2 },
  { href: "/spend-logs", label: "課金ログ", icon: ReceiptText },
  { href: "/cards", label: "カード管理", icon: CreditCard },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-border/80 bg-white/80 px-4 py-4 backdrop-blur lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Oripa P/L</p>
              <h1 className="mt-1 text-xl font-bold text-slate-900">ポケカ収支管理</h1>
            </div>
            <p className="hidden text-sm text-slate-600 lg:block">
              課金総額、売却総額、所持相場をスマホでも見やすく整理します。
            </p>
          </div>

          <nav className="mt-4 grid grid-cols-2 gap-2 lg:mt-8 lg:grid-cols-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    active ? "bg-primary text-primary-foreground shadow-soft" : "bg-muted/60 text-slate-700 hover:bg-muted",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
