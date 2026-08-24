"use client";

import { useEffect, useState } from "react";

import { PillTabs, StatRow, SectionCard } from "@/shared/ui/voom";

import ResidentCRUD from "@/modules/sharedComponents/residents/ResidentCRUD";

import { getResidents } from "@/services/resident";

import { Resident } from "@/modules/types/resident";

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const data = await getResidents();
        setResidents(data);
      } catch (error) {
        console.error("Error fetching residents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  const totalResidents = residents.length;

  const activeResidents = residents.filter(
    (resident) => resident.status?.toLowerCase() === "active",
  ).length;

  const inactiveResidents = residents.filter(
    (resident) => resident.status?.toLowerCase() === "inactive",
  ).length;

  return (
    <div className="space-y-4">
      {/* =========================
          STATS
      ========================= */}
      <StatRow
        items={[
          {
            label: "Total Residents",
            value: totalResidents,
          },
          {
            label: "ALLOWED",
            value: 0,
          },
          {
            label: "NOT ALLOWED",
            value: 0,
          },
          {
            label: "WITH CREDENTIALS",
            value: 0,
          },
        ]}
      />

      {/* =========================
          RESIDENTS CRUD
      ========================= */}
      <SectionCard>
        <ResidentCRUD />
      </SectionCard>
    </div>
  );
}
