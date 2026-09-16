"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { useToast } from "@/shared/hooks/use-toast";

import {
  getCameras,
  createCamera,
  updateCamera,
  deleteCamera,
} from "@/services/cameras";

import CameraTable from "./CameraTable";
import CameraForm from "./CameraForm";

import { CrudShell } from "@/shared/ui/voom";

import ConfirmDialog from "../ConfirmDialog";

import { Camera, CameraFormData } from "@/modules/types/camera";

type DialogState = {
  open: boolean;
  type: "confirm" | "success" | "error";
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

export default function CameraCRUD() {
  // =========================
  // DATA STATES
  // =========================

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

  // =========================
  // DIALOG
  // =========================

  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    type: "confirm",
    title: "",
    message: "",
  });

  const closeDialog = () => {
    setDialog((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const selectedCamera =
    cameras.find((camera) => camera.id === selectedId) || null;

  // =========================
  // LOAD CAMERAS
  // =========================

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCameras();
        setCameras(data);
      } catch (error) {
        console.error("Load cameras error:", error);
        toast.error("Failed to load cameras");
      }
    };

    load();
  }, []);

  // =========================
  // FILTERS
  // =========================

  const filteredCameras = cameras.filter((cam) => {
    const query = search.toLowerCase();

    return (
      cam.location?.toLowerCase().includes(query) ||
      cam.ip_address?.toLowerCase().includes(query)
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
      await updateCamera(cameraId, {
        is_active: active,
      });

      setCameras((prev) =>
        prev.map((camera) =>
          camera.id === cameraId
            ? {
                ...camera,
                active,
              }
            : camera,
        ),
      );

      toast.success(
        active
          ? "Camera activated successfully"
          : "Camera deactivated successfully",
      );
    } catch (error) {
      console.error("Failed to update camera active status:", error);

      toast.error("Failed to update camera status");

      throw error;
    }
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const executeSubmit = async (data: CameraFormData) => {
    try {
      const payload = {
        ...data,
        port: Number(data.port),
      };

      if (editing) {
        await updateCamera(editing.id, payload);

        const refreshed = await getCameras();

        setCameras(refreshed);
        setOpen(false);
        setEditing(null);
        setSelectedId(null);

        setDialog({
          open: true,
          type: "success",
          title: "Camera Updated Successfully",
          message: "The camera information has been updated successfully.",
          confirmText: "OK",
          onConfirm: closeDialog,
        });
      } else {
        await createCamera(payload);

        const refreshed = await getCameras();

        setCameras(refreshed);
        setOpen(false);
        setEditing(null);
        setSelectedId(null);

        setDialog({
          open: true,
          type: "success",
          title: "Camera Created Successfully",
          message: "The new camera has been created successfully.",
          confirmText: "OK",
          onConfirm: closeDialog,
        });
      }
    } catch (error: unknown) {
      console.error("Submit error:", error);

      const axiosError = error as AxiosError<{
        detail?: string;
      }>;

      const backendMessage =
        axiosError.response?.data?.detail ||
        "Something went wrong while saving the camera.";

      setDialog({
        open: true,
        type: "error",
        title: "Operation Failed",
        message: backendMessage,
        confirmText: "OK",
        onConfirm: closeDialog,
      });

      throw error;
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (data: CameraFormData) => {
    const isEditing = !!editing;

    setDialog({
      open: true,
      type: "confirm",
      title: isEditing ? "Update Camera?" : "Create Camera?",
      message: isEditing
        ? "Are you sure you want to update this camera?"
        : "Are you sure you want to create this camera?",
      confirmText: isEditing ? "Update" : "Create",
      cancelText: "Cancel",

      onConfirm: () => {
        closeDialog();
        executeSubmit(data);
      },
    });
  };

  // =========================
  // DELETE
  // =========================

  const executeDelete = async () => {
    if (!selectedCamera) return;

    try {
      await deleteCamera(selectedCamera.id);

      const refreshed = await getCameras();

      setCameras(refreshed);
      setSelectedId(null);

      setDialog({
        open: true,
        type: "success",
        title: "Camera Deleted Successfully",
        message: "The camera has been deleted successfully.",
        confirmText: "OK",
        onConfirm: closeDialog,
      });
    } catch (error) {
      console.error("Delete error:", error);

      setDialog({
        open: true,
        type: "error",
        title: "Delete Failed",
        message: "Failed to delete the camera. Please try again.",
        confirmText: "OK",
        onConfirm: closeDialog,
      });
    }
  };

  const handleDelete = () => {
    if (!selectedCamera) return;

    setDialog({
      open: true,
      type: "confirm",
      title: "Delete Camera?",
      message: `Are you sure you want to delete "${selectedCamera.location}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",

      onConfirm: () => {
        closeDialog();
        executeDelete();
      },
    });
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
            onActiveChange={handleActiveChange}
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

      {/* =========================
          CONFIRM / SUCCESS / ERROR
      ========================= */}

      <ConfirmDialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
      />
    </>
  );
}
