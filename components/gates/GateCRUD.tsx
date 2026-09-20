"use client";

import { useEffect, useState } from "react";

import GateTable from "./GateTable";
import GateForm from "./GateForm";

import { useToast } from "@/shared/hooks/use-toast";

import { Gate, GateFormData } from "@/modules/types/gate";

import {
  createGate,
  deleteGate,
  getGates,
  updateGate,
} from "@/services/gate";

import {
  getUnassignedCameras,
  updateCamera,
} from "@/services/cameras";

import { CrudShell } from "@/shared/ui/voom";

import ConfirmDialog from "../ConfirmDialog";

type DialogState = {
  open: boolean;
  type: "confirm" | "success" | "error";
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

type UnassignedCamera = {
  id: number;
  location?: string;
  ip_address?: string;
  port?: number;
  url?: string;
  camera_type?: string;
  reader_type?: string;
};

export default function GateCRUD() {
  // =========================
  // DATA STATES
  // =========================

  const [gates, setGates] = useState<Gate[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Gate | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // =========================
  // ASSIGN CAMERA STATES
  // =========================

  const [assignOpen, setAssignOpen] = useState(false);

  const [unassignedCameras, setUnassignedCameras] = useState<
    UnassignedCamera[]
  >([]);

  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(
    null,
  );

  const [loadingCameras, setLoadingCameras] = useState(false);
  const [assigningCamera, setAssigningCamera] = useState(false);

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

  const selectedGate =
    gates.find((gate) => gate.id === selectedId) || null;

  // =========================
  // LOAD GATES
  // =========================

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGates();

        setGates(data);
      } catch (error) {
        console.error("Load gates error:", error);

        toast.error("Failed to load gates");
      }
    };

    load();
  }, []);

  // =========================
  // FILTERS
  // =========================

  const filteredGates = gates.filter((gate) => {
    const query = search.toLowerCase();

    return (
      gate.name?.toLowerCase().includes(query) ||
      gate.type?.toLowerCase().includes(query) ||
      gate.ip?.toLowerCase().includes(query)
    );
  });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filteredGates.length / pageSize);

  const paginatedGates = filteredGates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // =========================
  // ACTIVE / INACTIVE
  // =========================

  const handleActiveChange = async (
    gateId: number,
    active: boolean,
  ) => {
    try {
      await updateGate(gateId, {
        active,
      });

      setGates((prev) =>
        prev.map((gate) =>
          gate.id === gateId
            ? {
                ...gate,
                active,
              }
            : gate,
        ),
      );

      toast.success(
        active
          ? "Gate activated successfully"
          : "Gate deactivated successfully",
      );
    } catch (error) {
      console.error(
        "Failed to update gate active status:",
        error,
      );

      toast.error("Failed to update gate status");

      throw error;
    }
  };

  // =========================
  // ASSIGN CAMERA
  // =========================

  const handleOpenAssignCamera = async () => {
    if (!selectedGate) return;

    setAssignOpen(true);
    setSelectedCameraId(null);
    setUnassignedCameras([]);
    setLoadingCameras(true);

    try {
      const cameras = await getUnassignedCameras();

      setUnassignedCameras(cameras);
    } catch (error) {
      console.error(
        "Failed to load unassigned cameras:",
        error,
      );

      setAssignOpen(false);

      setDialog({
        open: true,
        type: "error",
        title: "Failed to Load Cameras",
        message:
          "Failed to load unassigned cameras. Please try again.",
        confirmText: "OK",
        onConfirm: closeDialog,
      });
    } finally {
      setLoadingCameras(false);
    }
  };

  // =========================
  // EXECUTE CAMERA ASSIGN
  // =========================

  const executeAssignCamera = async () => {
    if (!selectedGate || selectedCameraId === null) {
      return;
    }

    try {
      setAssigningCamera(true);

      await updateCamera(selectedCameraId, {
        gate_id: selectedGate.id,
      });

      const refreshed = await getGates();

      setGates(refreshed);

      setAssignOpen(false);
      setSelectedCameraId(null);
      setUnassignedCameras([]);

      setDialog({
        open: true,
        type: "success",
        title: "Camera Assigned Successfully",
        message: `The camera has been assigned to "${selectedGate.name}" successfully.`,
        confirmText: "OK",
        onConfirm: closeDialog,
      });
    } catch (error) {
      console.error(
        "Failed to assign camera:",
        error,
      );

      setDialog({
        open: true,
        type: "error",
        title: "Assignment Failed",
        message:
          "Failed to assign the camera to this gate. Please try again.",
        confirmText: "OK",
        onConfirm: closeDialog,
      });
    } finally {
      setAssigningCamera(false);
    }
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const executeSubmit = async (data: GateFormData) => {
    try {
      if (editing) {
        await updateGate(editing.id, data);

        const refreshed = await getGates();

        setGates(refreshed);
        setOpen(false);
        setEditing(null);
        setSelectedId(null);

        setDialog({
          open: true,
          type: "success",
          title: "Gate Updated Successfully",
          message:
            "The gate information has been updated successfully.",
          confirmText: "OK",
          onConfirm: closeDialog,
        });
      } else {
        await createGate(data);

        const refreshed = await getGates();

        setGates(refreshed);
        setOpen(false);
        setEditing(null);
        setSelectedId(null);

        setDialog({
          open: true,
          type: "success",
          title: "Gate Created Successfully",
          message:
            "The new gate has been created successfully.",
          confirmText: "OK",
          onConfirm: closeDialog,
        });
      }
    } catch (error) {
      console.error("Submit error:", error);

      setDialog({
        open: true,
        type: "error",
        title: "Operation Failed",
        message:
          "Something went wrong while saving the gate.",
        confirmText: "OK",
        onConfirm: closeDialog,
      });

      throw error;
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (data: GateFormData) => {
    const isEditing = !!editing;

    setDialog({
      open: true,
      type: "confirm",
      title: isEditing ? "Update Gate?" : "Create Gate?",
      message: isEditing
        ? "Are you sure you want to update this gate?"
        : "Are you sure you want to create this gate?",
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
    if (!selectedGate) return;

    try {
      await deleteGate(selectedGate.id);

      const refreshed = await getGates();

      setGates(refreshed);
      setSelectedId(null);

      setDialog({
        open: true,
        type: "success",
        title: "Gate Deleted Successfully",
        message:
          "The gate has been deleted successfully.",
        confirmText: "OK",
        onConfirm: closeDialog,
      });
    } catch (error) {
      console.error("Delete error:", error);

      setDialog({
        open: true,
        type: "error",
        title: "Delete Failed",
        message:
          "Failed to delete the gate. Please try again.",
        confirmText: "OK",
        onConfirm: closeDialog,
      });
    }
  };

  const handleDelete = () => {
    if (!selectedGate) return;

    setDialog({
      open: true,
      type: "confirm",
      title: "Delete Gate?",
      message: `Are you sure you want to delete "${selectedGate.name}"? This action cannot be undone.`,
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
            GATE CRUD
        ========================= */}

        <CrudShell
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search by Gate Name, Type and IP"
          addLabel="Add Gate"
          onAdd={() => {
            setEditing(null);
            setOpen(true);
          }}
          onEdit={() => {
            if (!selectedGate) return;

            setEditing(selectedGate);
            setOpen(true);
          }}
          onDelete={handleDelete}
          hasSelected={!!selectedGate}
          extraActions={
            <button
              type="button"
              disabled={!selectedGate}
              onClick={handleOpenAssignCamera}
              className="h-10 rounded-lg border border-[#16324F] bg-white px-4 text-sm font-medium text-[#16324F] transition hover:bg-[#16324F] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Assign Camera to Gate
            </button>
          }
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredGates.length}
          itemLabel="gates"
          onPrevious={() =>
            setCurrentPage((p) => Math.max(1, p - 1))
          }
          onNext={() =>
            setCurrentPage((p) =>
              Math.min(totalPages || 1, p + 1),
            )
          }
        >
          <GateTable
            data={paginatedGates}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId((prev) =>
                prev === id ? null : id,
              )
            }
            onActiveChange={handleActiveChange}
          />
        </CrudShell>
      </div>

      {/* =========================
          GATE FORM
      ========================= */}

      {open && (
        <GateForm
          editing={editing}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* =========================
          ASSIGN CAMERA MODAL
      ========================= */}

      {assignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            {/* Header */}

            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-[#0B1B30]">
                Assign Camera to Gate
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select a camera to assign to{" "}
                <span className="font-semibold text-[#16324F]">
                  {selectedGate?.name}
                </span>
              </p>
            </div>

            {/* Cameras */}

            <div className="max-h-[400px] overflow-y-auto px-6 py-5">
              {loadingCameras ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-gray-500">
                    Loading available cameras...
                  </p>
                </div>
              ) : unassignedCameras.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 px-5 py-10 text-center">
                  <p className="text-sm text-gray-500">
                    No unassigned cameras available.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {unassignedCameras.map((camera) => {
                    const isSelected =
                      selectedCameraId === camera.id;

                    return (
                      <button
                        key={camera.id}
                        type="button"
                        onClick={() =>
                          setSelectedCameraId(camera.id)
                        }
                        className={`w-full rounded-lg border p-4 text-left transition ${
                          isSelected
                            ? "border-[#16324F] bg-[#16324F]/5"
                            : "border-gray-200 hover:border-[#16324F]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-medium text-[#0B1B30]">
                              Camera #{camera.id}
                            </p>

                            {camera.location && (
                              <p className="mt-1 text-sm text-gray-500">
                                {camera.location}
                              </p>
                            )}

                            {camera.ip_address && (
                              <p className="mt-1 text-xs text-gray-400">
                                {camera.ip_address}
                                {camera.port
                                  ? `:${camera.port}`
                                  : ""}
                              </p>
                            )}

                            {(camera.camera_type ||
                              camera.reader_type) && (
                              <div className="mt-2 flex gap-2">
                                {camera.camera_type && (
                                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                    {camera.camera_type}
                                  </span>
                                )}

                                {camera.reader_type && (
                                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                    {camera.reader_type}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-[#16324F] bg-[#16324F]"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                disabled={assigningCamera}
                onClick={() => {
                  setAssignOpen(false);
                  setSelectedCameraId(null);
                }}
                className="h-10 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  selectedCameraId === null ||
                  loadingCameras ||
                  assigningCamera
                }
                onClick={executeAssignCamera}
                className="h-10 rounded-lg bg-[#16324F] px-5 text-sm font-medium text-white transition hover:bg-[#0f263d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assigningCamera ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
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