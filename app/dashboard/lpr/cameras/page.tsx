"use client";

import { useMemo, useState, useEffect } from "react";

import { PillTabs, StatRow, SectionCard, LPR_TABS } from "@/shared/ui/voom";

import CameraCRUD from "@/components/cameras/CameraCRUD";

import { getCameras } from "@/services/cameras";

import { Camera } from "@/modules/types/camera";

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
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

  /* ================= LPR CAMERA STATS ================= */

  const cameraStats = useMemo(() => {
    // Only LPR cameras
    const lprCameras = cameras.filter((camera) => camera.camera_type === "LPR");

    const totalCameras = lprCameras.length;

    const onlineCameras = lprCameras.filter(
      (camera) => camera.is_active === true,
    ).length;

    const inactiveCameras = lprCameras.filter(
      (camera) => camera.is_active === false,
    ).length;

    const camerasWithLatency = lprCameras.filter(
      (camera) =>
        camera.latency !== null &&
        camera.latency !== undefined &&
        !Number.isNaN(Number(camera.latency)),
    );

    const avgLatency =
      camerasWithLatency.length > 0
        ? Math.round(
            camerasWithLatency.reduce(
              (sum, camera) => sum + Number(camera.latency),
              0,
            ) / camerasWithLatency.length,
          )
        : 0;

    return {
      totalCameras,
      onlineCameras,
      inactiveCameras,
      avgLatency,
    };
  }, [cameras]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
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
            value: cameraStats.totalCameras,
          },
          {
            label: "ONLINE",
            value: cameraStats.onlineCameras,
          },
          {
            label: "INACTIVE",
            value: cameraStats.inactiveCameras,
          },
          {
            label: "AVG LATENCY",
            value: `3 ms`,
          },
        ]}
      />

      <SectionCard>
        <CameraCRUD />
      </SectionCard>
    </div>
  );
}
