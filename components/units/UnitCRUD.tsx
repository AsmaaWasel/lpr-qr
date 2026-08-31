"use client";

import { useEffect, useState } from "react";

import { CrudShell } from "@/shared/ui/voom";
import { Unit, UnitFormData } from "@/modules/types/units";
import UnitTable from "./UnitTable";
import UnitForm from "./UnitForm";
import { useToast } from "@/shared/hooks/use-toast";
import { createUnit, deleteUnit, getUnits, updateUnit } from "@/services/units";

export default function UnitCRUD() {
  // =========================
  // DATA STATES
  // =========================

  const [units, setUnits] = useState<Unit[]>([]);

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState<Unit | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // =========================
  // UI STATES
  // =========================

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const toast = useToast();

  const selectedUnit = units.find((unit) => unit.id === selectedId) || null;

  // =========================
  // LOAD UNITS
  // =========================

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUnits();

        setUnits(data);
      } catch (error) {
        console.error("Load units error:", error);

        toast.error("Failed to load units");
      }
    };

    load();
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredUnits = units.filter((unit) => {
    const query = search.toLowerCase().trim();

    return (
      unit.name?.toLowerCase().includes(query) ||
      unit.type?.toLowerCase().includes(query) ||
      unit.description?.toLowerCase().includes(query) ||
      String(unit.parent_id ?? "").includes(query)
    );
  });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filteredUnits.length / pageSize);

  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (data: UnitFormData) => {
    try {
      if (editing) {
        await updateUnit(editing.id, data);

        toast.success("Unit updated successfully");
      } else {
        await createUnit(data);

        toast.success("Unit created successfully");
      }

      const refreshed = await getUnits();

      setUnits(refreshed);

      setOpen(false);

      setEditing(null);

      setSelectedId(null);
    } catch (error) {
      console.error("Submit unit error:", error);

      toast.error("Something went wrong");
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async () => {
    if (!selectedUnit) return;

    try {
      await deleteUnit(selectedUnit.id);

      toast.success("Unit deleted successfully");

      const refreshed = await getUnits();

      setUnits(refreshed);

      setSelectedId(null);
    } catch (error) {
      console.error("Delete unit error:", error);

      toast.error("Failed to delete unit");
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <>
      <div className="space-y-4">
        <CrudShell
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search by Unit Name, Type and Parent ID"
          addLabel="Add Unit"
          onAdd={() => {
            setEditing(null);
            setOpen(true);
          }}
          onEdit={() => {
            if (!selectedUnit) return;

            setEditing(selectedUnit);
            setOpen(true);
          }}
          onDelete={handleDelete}
          hasSelected={!!selectedUnit}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUnits.length}
          itemLabel="units"
          onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
        >
          <UnitTable
            data={paginatedUnits}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId((prev) => (prev === id ? null : id))
            }
          />
        </CrudShell>
      </div>

      {open && (
        <UnitForm
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
