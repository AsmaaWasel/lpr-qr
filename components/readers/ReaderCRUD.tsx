"use client";

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

  const selectedCamera = cameras.find((c) => c.id === selectedId) || null;

  // =========================
  // DRIVER CAMERAS
  // =========================

  const driverCameras = cameras.filter(
    (camera) => camera.camera_type === "DRIVER",
  );

  // =========================
  // STATS
  // =========================

  useEffect(() => {
    // All DRIVER cameras
    const totalDevices = driverCameras.length;

    // DRIVER cameras with reader_type CAMERA
    const totalCameras = driverCameras.filter(
      (camera) => camera.reader_type === "CAMERA",
    ).length;

    // DRIVER cameras with reader_type QRREADER
    const totalQrReaders = driverCameras.filter(
      (camera) => camera.reader_type === "QRREADER",
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
      } catch {
        toast.error("Failed to load cameras");
      }
    };

    load();
  }, []);

  // =========================
  // FILTERS
  // =========================

  const filteredCameras = driverCameras.filter((cam) => {
    const searchValue = search.toLowerCase();

    return (
      cam.location?.toLowerCase().includes(searchValue) ||
      cam.ip_address?.includes(searchValue)
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
  // SUBMIT
  // =========================

  const handleSubmit = async (data: CameraFormData) => {
    try {
      if (editing) {
        await updateCamera(editing.id, data);

        toast.success("Camera updated successfully");
      } else {
        await createCamera(data);

        toast.success("Camera created successfully");
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

      toast.success("Camera deleted successfully");

      const refreshed = await getCameras();

      setCameras(refreshed);
      setSelectedId(null);
    } catch {
      toast.error("Failed to delete camera");
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
        onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
      >
        <ReaderTable
          data={paginatedCameras}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
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
