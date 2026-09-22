// @ts-nocheck
"use client"
// @ts-nocheck

import { useEffect, useState } from "react";

import { useToast } from "@/shared/hooks/use-toast";

import {
  getCameras,
  createCamera,
  updateCamera,
  deleteCamera,
} from "@/services/cameras";

import { CrudShell } from "@/shared/ui/voom";

import { Camera, CameraFormData } from "@/modules/types/camera";

import ReaderForm from "./ReaderForm";
import ReaderTable from "./ReaderTable";

type ReaderStats = {
  totalDevices: number;
  totalCameras: number;
  totalQrReaders: number;
  offline: number;
};

type Props = {
  onStatsChange?: (stats: ReaderStats) => void;
};

export default function ReaderCRUD({ onStatsChange }: Props) {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Camera | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // =========================
  // UI STATES
  // =========================

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const toast = useToast();

  const selectedCamera =
    cameras.find((camera) => camera.id === selectedId) || null;

  // =========================
  // DRIVER CAMERAS
  // =========================

  const driverCameras = cameras.filter(
    (camera) => camera.camera_type?.toUpperCase() === "DRIVER",
  );

  // =========================
  // STATS
  // =========================

  useEffect(() => {
    // All DRIVER cameras
    const totalDevices = driverCameras.length;

    // DRIVER cameras with reader_type CAMERA
    const totalCameras = driverCameras.filter(
      (camera) => camera.reader_type?.toUpperCase() === "CAMERA",
    ).length;

    // DRIVER cameras with reader_type QRREADER
    const totalQrReaders = driverCameras.filter(
      (camera) => camera.reader_type?.toUpperCase() === "QRREADER",
    ).length;

    // DRIVER cameras that are inactive
    const offline = driverCameras.filter(
      (camera) => camera.is_active === false,
    ).length;

    onStatsChange?.({
      totalDevices,
      totalCameras,
      totalQrReaders,
      offline,
    });
  }, [cameras, onStatsChange]);

  // =========================
  // LOAD
  // =========================

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCameras();
        setCameras(data);
      } catch (error) {
        console.error("Load readers error:", error);
        toast.error("Failed to load cameras");
      }
    };

    load();
  }, []);

  // =========================
  // FILTERS
  // =========================

  const filteredCameras = driverCameras.filter((camera) => {
    const searchValue = search.toLowerCase();

    return (
      camera.location?.toLowerCase().includes(searchValue) ||
      camera.ip_address?.toLowerCase().includes(searchValue)
    );
  });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filteredCameras.length / pageSize);

  const paginatedCameras = filteredCameras.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // =========================
  // ACTIVE / INACTIVE
  // =========================

  const handleActiveChange = async (cameraId: number, active: boolean) => {
    try {
      // Update backend
      await updateCamera(cameraId, {
        is_active: active,
      });

      // Update local state immediately
      setCameras((prev) =>
        prev.map((camera) =>
          camera.id === cameraId
            ? {
                ...camera,
                is_active: active,
              }
            : camera,
        ),
      );

      toast.success(
        active
          ? "Reader activated successfully"
          : "Reader deactivated successfully",
      );
    } catch (error) {
      console.error("Failed to update reader active status:", error);

      toast.error("Failed to update reader status");

      throw error;
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (data: CameraFormData) => {
    try {
      if (editing) {
        await updateCamera(editing.id, data);
        toast.success("Reader updated successfully");
      } else {
        await createCamera(data);
        toast.success("Reader created successfully");
      }

      const refreshed = await getCameras();

      setCameras(refreshed);
      setOpen(false);
      setEditing(null);
      setSelectedId(null);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong");
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async () => {
    if (!selectedCamera) return;

    try {
      await deleteCamera(selectedCamera.id);

      toast.success("Reader deleted successfully");

      const refreshed = await getCameras();

      setCameras(refreshed);
      setSelectedId(null);
    } catch (error) {
      console.error("Delete reader error:", error);
      toast.error("Failed to delete reader");
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <>
      <CrudShell
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search by location or IP..."
        addLabel="Add Reader"
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
        onEdit={() => {
          if (!selectedCamera) return;

          setEditing(selectedCamera);
          setOpen(true);
        }}
        onDelete={handleDelete}
        hasSelected={!!selectedCamera}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredCameras.length}
        itemLabel="readers"
        onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))}
        onNext={() =>
          setCurrentPage((page) => Math.min(totalPages || 1, page + 1))
        }
      >
        <ReaderTable
          data={paginatedCameras}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
          onActiveChange={handleActiveChange}
        />
      </CrudShell>

      {open && (
        <ReaderForm
          editing={editing}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
