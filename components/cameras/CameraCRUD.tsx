// CameraCRUD.tsx

"use client";

import { useEffect, useState } from "react";

import { useToast } from "@/shared/hooks/use-toast";

import {
  getCameras,
  createCamera,
  updateCamera,
  deleteCamera,
} from "@/services/cameras";

import CameraTable from "./CameraTable";
import { CrudShell, StatRow } from "@/shared/ui/voom";
import CameraForm from "./CameraForm";

import { Camera, CameraFormData } from "@/modules/types/camera";

export default function CameraCRUD() {
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

  const filteredCameras = cameras.filter((cam) => {
    return (
      cam.location?.toLowerCase().includes(search.toLowerCase()) ||
      cam.ip_address?.includes(search)
    );
  });

  const totalPages = Math.ceil(filteredCameras.length / pageSize);

  const paginatedCameras = filteredCameras.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // =========================
  // STATS
  // =========================

  const totalDevices = cameras.length;

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (data: CameraFormData) => {
    try {
      const payload = {
        ...data,
        port: Number(data.port),
      };

      if (editing) {
        await updateCamera(editing.id, payload);
        toast.success("Camera updated successfully");
      } else {
        await createCamera(payload);
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
      <div className="space-y-4">
        {/* =========================
            CAMERA CRUD
        ========================= */}

        <CrudShell
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search by location or IP..."
          addLabel="Add Camera"
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
          itemLabel="cameras"
          onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
        >
          <CameraTable
            data={paginatedCameras}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId((prev) => (prev === id ? null : id))
            }
          />
        </CrudShell>
      </div>

      {/* =========================
          CAMERA FORM
      ========================= */}

      {open && (
        <CameraForm
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
