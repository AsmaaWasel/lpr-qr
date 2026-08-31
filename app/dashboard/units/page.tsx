"use client";

import { useEffect, useState } from "react";

import { StatRow, SectionCard } from "@/shared/ui/voom";
import { Unit } from "@/modules/types/units";
import { getUnits } from "@/services/units";
import UnitCRUD from "@/components/units/UnitCRUD";

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await getUnits();
        setUnits(data);
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  // =========================================================
  // STATS
  // =========================================================

  const totalUnits = units.length;

  // لو عندك status في الـ Unit
  const activeUnits = units.filter(
    (unit) => unit.status?.toLowerCase() === "active",
  ).length;

  const inactiveUnits = units.filter(
    (unit) => unit.status?.toLowerCase() === "inactive",
  ).length;

  return (
    <div className="space-y-4">
      {/* =====================================================
          STATS
      ====================================================== */}

      <StatRow
        items={[
          {
            label: "Total Units",
            value: totalUnits,
          },
          {
            label: "Active Units",
            value: activeUnits,
          },
          {
            label: "Inactive Units",
            value: inactiveUnits,
          },
        ]}
      />

      {/* =====================================================
          UNITS CRUD
      ====================================================== */}

      <SectionCard>
        <UnitCRUD />
      </SectionCard>
    </div>
  );
}
