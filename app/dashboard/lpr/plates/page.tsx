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

  // =========================
  // DYNAMIC STATS
  // =========================

  const totalPlates = plates.length;

  const insideNow = plates.filter((plate) => plate.is_inside === true).length;

  const outsideNow = plates.filter((plate) => plate.is_inside === false).length;

  const today = new Date();

  const enteredToday = plates.filter((plate) => {
    if (!plate.last_entry_at) return false;

    const entryDate = new Date(plate.last_entry_at);

    return (
      entryDate.getFullYear() === today.getFullYear() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getDate() === today.getDate()
    );
  }).length;
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
          // {
          //   label: "INSIDE NOW",
          //   value: insideNow,
          // },
          // {
          //   label: "OUTSIDE",
          //   value: outsideNow,
          // },
          // {
          //   label: "ENTERED TODAY",
          //   value: enteredToday,
          // },
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
