"use client";

import { useEffect, useState } from "react";

import { PillTabs, StatRow, SectionCard, LPR_TABS } from "@/shared/ui/voom";

import GateCRUD from "@/components/gates/GateCRUD";

import { getGates } from "@/services/gate";

import { Gate } from "@/modules/types/gate";

export default function GatesPage() {
  const [gates, setGates] = useState<Gate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGates = async () => {
      try {
        const data = await getGates();

        setGates(data);
      } catch (error) {
        console.error("Error fetching gates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGates();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  const totalGates = gates.length;

  const entryGates = gates.filter(
    (gate) => gate.type?.toLowerCase() === "entry",
  ).length;

  const exitGates = gates.filter(
    (gate) => gate.type?.toLowerCase() === "exit",
  ).length;
  const offlineGates = gates.filter((gate) => gate.active === false).length;

  return (
    <div className="space-y-4">
      {/* =========================
          LPR TABS
      ========================= */}

      <PillTabs tabs={LPR_TABS} activeValue="/dashboard/lpr/gates" />

      {/* =========================
          STATS
      ========================= */}

      <StatRow
        items={[
          {
            label: "Total Gates",
            value: totalGates,
          },
          {
            label: "Entry Gates",
            value: entryGates,
          },
          {
            label: "Exit Gates",
            value: exitGates,
          },
          {
            label: "Offline",
            value: offlineGates,
          },
        ]}
      />

      {/* =========================
          GATES CRUD
      ========================= */}

      <SectionCard>
        <GateCRUD />
      </SectionCard>
    </div>
  );
}
