"use client";

import { useEffect, useState } from "react";

import { PillTabs, StatRow, SectionCard, LPR_TABS } from "@/shared/ui/voom";

import PlateCRUD from "@/components/plates/PlateCRUD";

import { Plate } from "@/modules/types/plate";
import { getPlates } from "@/services/plate";

export default function PlatesPage() {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlates = async () => {
      try {
        const data = await getPlates();
        setPlates(data);
      } catch (error) {
        console.error("Error fetching plates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlates();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  const totalPlates = plates.length;

  return (
    <div className="space-y-4">
      {/* =========================
          LPR TABS
      ========================= */}
      <PillTabs tabs={LPR_TABS} activeValue="/dashboard/lpr/plates" />

      {/* =========================
          STATS
      ========================= */}
      <StatRow
        items={[
          {
            label: "Total Plates",
            value: totalPlates,
          },
          {
            label: "ACTIVE",
            value: 0,
          },
          {
            label: "INACTIVE",
            value: 0,
          },
          {
            label: "TODAY",
            value: 0,
          },
        ]}
      />

      {/* =========================
          PLATES CRUD
      ========================= */}
      <SectionCard>
        <PlateCRUD />
      </SectionCard>
    </div>
  );
}
