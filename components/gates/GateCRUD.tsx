"use client";

import { useEffect, useState } from "react";

import GateTable from "./GateTable";
import GateForm from "./GateForm";

import { useToast } from "@/shared/hooks/use-toast";

import { Gate, GateFormData } from "@/modules/types/gate";

import { createGate, deleteGate, getGates, updateGate } from "@/services/gate";

import { CrudShell, StatRow } from "@/shared/ui/voom";

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

  const selectedGate = gates.find((gate) => gate.id === selectedId) || null;

  // =========================
  // LOAD GATES
  // =========================

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGates();

        setGates(data);
      } catch {
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
      // gate.description?.toLowerCase().includes(query)
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
  // SUBMIT
  // =========================

  const handleSubmit = async (data: GateFormData) => {
    try {
      if (editing) {
        await updateGate(editing.id, data);

        toast.success("Gate updated successfully");
      } else {
        await createGate(data);

        toast.success("Gate created successfully");
      }

      const refreshed = await getGates();

      setGates(refreshed);

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
    if (!selectedGate) return;

    try {
      await deleteGate(selectedGate.id);

      toast.success("Gate deleted successfully");

      const refreshed = await getGates();

      setGates(refreshed);

      setSelectedId(null);
    } catch (error) {
      console.error("Delete error:", error);

      toast.error("Failed to delete gate");
    }
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
          searchPlaceholder="Search by Gate Name , Type and IP"
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
    </>
  );
}
