"use client";

import { useMemo, useState, useEffect } from "react";
import { PillTabs, StatRow, SectionCard, LPR_TABS } from "@/shared/ui/voom";
import CameraCRUD from "@/components/cameras/CameraCRUD";
import { getCameras } from "@/services/cameras";

export default function CamerasPage() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await getCameras();
        setCameras(data);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCameras();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PillTabs tabs={LPR_TABS} activeValue="/dashboard/lpr/cameras" />

      <StatRow
        items={[
          {
            label: "Total Cameras",
            value: 0,
          },
          {
            label: "ONLINE",
            value: 1,
          },
          {
            label: "DEGRADED",
            value: 0,
          },
          {
            label: "AVG LATENCY",
            value: 16,
          },
        ]}
      />

      <SectionCard>
        <CameraCRUD />
      </SectionCard>
    </div>
  );
}
