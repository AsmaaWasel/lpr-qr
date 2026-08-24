"use client";

import { useEffect, useState } from "react";

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
  // SUBMIT
  // =========================

  const handleSubmit = async (data: { plate_number_full: string }) => {
    try {
      if (editing) {
        await updatePlate(editing.id, data);

        toast.success("Plate updated successfully");
      } else {
        await createPlate(data);

        toast.success("Plate created successfully");
      }

      const refreshed = await getPlates();

      setPlates(refreshed);
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
    if (!selectedPlate) return;

    try {
      await deletePlate(selectedPlate.id);

      toast.success("Plate deleted successfully");

      const refreshed = await getPlates();

      setPlates(refreshed);
      setSelectedId(null);

      // لو الصفحة الحالية أصبحت فاضية
      if (currentPage > 1 && (currentPage - 1) * pageSize >= refreshed.length) {
        setCurrentPage((page) => Math.max(1, page - 1));
      }
    } catch (error) {
      console.error("Delete error:", error);

      toast.error("Failed to delete plate");
    }
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
    </>
  );
}
