"use client";

import { useEffect, useState } from "react";

import { AxiosError } from "axios";

import PlateTable from "./PlateTable";
import PlateForm from "./PlateForm";

import { useToast } from "@/shared/hooks/use-toast";

import {
  createPlate,
  deletePlate,
  getPlates,
  updatePlate,
} from "@/services/plate";

import { Plate } from "@/modules/types/plate";

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

export default function PlateCRUD() {
  // =========================
  // DATA STATES
  // =========================

  const [plates, setPlates] = useState<Plate[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Plate | null>(null);
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

  // =========================
  // SELECTED PLATE
  // =========================

  const selectedPlate = plates.find((plate) => plate.id === selectedId) || null;

  // =========================
  // LOAD PLATES
  // =========================

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPlates();
        setPlates(data);
      } catch (error) {
        console.error("Failed to load plates:", error);
        toast.error("Failed to load plates");
      }
    };

    load();
  }, []);

  // =========================
  // FILTERS
  // =========================

  const filteredPlates = plates.filter((plate) => {
    const query = search.toLowerCase();

    return plate.plate_number_full?.toLowerCase().includes(query);
  });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filteredPlates.length / pageSize);

  const paginatedPlates = filteredPlates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // =========================
  // CREATE / UPDATE
  // =========================

  const executeSubmit = async (data: {
    plate_number_full: string;
    resident_id?: number;
  }) => {
    try {
      if (editing) {
        await updatePlate(editing.id, data);

        const refreshed = await getPlates();

        setPlates(refreshed);
        setOpen(false);
        setEditing(null);
        setSelectedId(null);

        setDialog({
          open: true,
          type: "success",
          title: "Plate Updated Successfully",
          message: "The plate information has been updated successfully.",
          confirmText: "OK",
          onConfirm: closeDialog,
        });
      } else {
        await createPlate(data);

        const refreshed = await getPlates();

        setPlates(refreshed);
        setOpen(false);
        setEditing(null);
        setSelectedId(null);

        setDialog({
          open: true,
          type: "success",
          title: "Plate Created Successfully",
          message: "The new plate has been created successfully.",
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
        "Something went wrong while saving the plate.";

      setDialog({
        open: true,
        type: "error",
        title: "Operation Failed",
        message: backendMessage,
        confirmText: "OK",
        onConfirm: closeDialog,
      });
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (data: {
    plate_number_full: string;
    resident_id?: number;
  }) => {
    const isEditing = !!editing;

    setDialog({
      open: true,
      type: "confirm",
      title: isEditing ? "Update Plate?" : "Create Plate?",
      message: isEditing
        ? "Are you sure you want to update this plate?"
        : "Are you sure you want to create this plate?",
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
    if (!selectedPlate) return;

    try {
      await deletePlate(selectedPlate.id);

      const refreshed = await getPlates();

      setPlates(refreshed);
      setSelectedId(null);

      // لو الصفحة الحالية أصبحت فاضية
      if (currentPage > 1 && (currentPage - 1) * pageSize >= refreshed.length) {
        setCurrentPage((page) => Math.max(1, page - 1));
      }

      setDialog({
        open: true,
        type: "success",
        title: "Plate Deleted Successfully",
        message: "The plate has been deleted successfully.",
        confirmText: "OK",
        onConfirm: closeDialog,
      });
    } catch (error: unknown) {
      console.error("Delete error:", error);

      const axiosError = error as AxiosError<{
        detail?: string;
      }>;

      const backendMessage =
        axiosError.response?.data?.detail ||
        "Failed to delete the plate. Please try again.";

      setDialog({
        open: true,
        type: "error",
        title: "Delete Failed",
        message: backendMessage,
        confirmText: "OK",
        onConfirm: closeDialog,
      });
    }
  };

  const handleDelete = () => {
    if (!selectedPlate) return;

    setDialog({
      open: true,
      type: "confirm",
      title: "Delete Plate?",
      message: `Are you sure you want to delete "${selectedPlate.plate_number_full}"? This action cannot be undone.`,
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
            PLATE CRUD
        ========================= */}

        <CrudShell
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search by plate number..."
          addLabel="Add Plate"
          onAdd={() => {
            setEditing(null);
            setOpen(true);
          }}
          onEdit={() => {
            if (!selectedPlate) return;

            setEditing(selectedPlate);
            setOpen(true);
          }}
          onDelete={handleDelete}
          hasSelected={!!selectedPlate}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPlates.length}
          itemLabel="plates"
          onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNext={() =>
            setCurrentPage((page) => Math.min(totalPages || 1, page + 1))
          }
        >
          <PlateTable
            data={paginatedPlates}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId((prev) => (prev === id ? null : id))
            }
          />
        </CrudShell>
      </div>

      {/* =========================
          PLATE FORM
      ========================= */}

      {open && (
        <PlateForm
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
