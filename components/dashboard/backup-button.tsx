"use client";

import { Download } from "lucide-react";
import { useState } from "react";

import { useAppData } from "@/components/layout/app-data-provider";
import { Button } from "@/components/ui/button";

export function BackupButton() {
  const { apps, spendLogs, cards, metrics } = useAppData();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        apps,
        spendLogs,
        cards,
        metrics,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `oripa-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button disabled={downloading} onClick={() => void handleDownload()} variant="outline">
      <Download className="mr-2 size-4" />
      {downloading ? "バックアップ作成中..." : "バックアップ"}
    </Button>
  );
}
