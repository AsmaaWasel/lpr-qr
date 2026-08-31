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

  // =========================
  // STATS
  // =========================

  const totalResidents = residents.length;

  const allowedResidents = residents.filter(
    (resident) => resident.status?.toLowerCase() === "allowed",
  ).length;

  const notAllowedResidents = residents.filter(
    (resident) => resident.status?.toLowerCase() !== "allowed",
  ).length;

  const residentsWithCredentials = residents.filter(
    (resident) =>
      Boolean(resident.face_id) ||
      Boolean(resident.driving_license) ||
      (resident.phone_numbers?.length ?? 0) > 0,
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
            value: allowedResidents,
          },
          {
            label: "NOT ALLOWED",
            value: notAllowedResidents,
          },
          {
            label: "WITH CREDENTIALS",
            value: residentsWithCredentials,
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
