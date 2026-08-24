// app/dashboard/qr/page.tsx
"use client";

import { useState } from "react";

import { useQRs } from "@/hooks/useQRs";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import QRTable from "@/modules/sharedComponents/qr/QRTable";

export default function QRPage() {
  const { data, loading, error, refetch } = useQRs();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">QR Codes</h1>
          <p className="text-muted-foreground text-2xl mt-1">
            Manage and monitor all generated QR codes
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand border-t-transparent" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <QRTable data={data} selectedId={selectedId} onSelect={handleSelect} />
      )}
    </div>
  );
}
