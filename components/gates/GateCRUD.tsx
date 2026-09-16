"use client";

import { useEffect, useState } from "react";

import GateTable from "./GateTable";
import GateForm from "./GateForm";

import { useToast } from "@/shared/hooks/use-toast";

import { Gate, GateFormData } from "@/modules/types/gate";

import { createGate, deleteGate, getGates, updateGate } from "@/services/gate";

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

export default function GateCRUD() {
  // =========================
  // DATA STATES
  // =========================

  const [gates, setGates] = useState<Gate[]>([]);

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState<Gate | null>(null);

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

  const selectedGate = gates.find((gate) => gate.id === selectedId) || null;

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

  const handleActiveChange = async (gateId: number, active: boolean) => {
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
      console.error("Failed to update gate active status:", error);

      toast.error("Failed to update gate status");

      throw error;
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
          message: "The gate information has been updated successfully.",
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
          message: "The new gate has been created successfully.",
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
        message: "Something went wrong while saving the gate.",
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
        message: "The gate has been deleted successfully.",
        confirmText: "OK",
        onConfirm: closeDialog,
      });
    } catch (error) {
      console.error("Delete error:", error);

      setDialog({
        open: true,
        type: "error",
        title: "Delete Failed",
        message: "Failed to delete the gate. Please try again.",
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
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredGates.length}
          itemLabel="gates"
          onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
        >
          <GateTable
            data={paginatedGates}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId((prev) => (prev === id ? null : id))
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
