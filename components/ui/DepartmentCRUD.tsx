// /components/departments/DepartmentCRUD.tsx

"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/services/departments";
import DepartmentTable from "./DepartmentTable";
import { CrudShell } from "@/shared/ui/voom";
import DepartmentForm from "./DepartmentForm";
import { Department, DepartmentFormData } from "@/modules/types/department";

export default function DepartmentCRUD() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // UI STATES
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const toast = useToast();

  const selectedDepartment =
    departments.find((d) => d.id === selectedId) || null;

  // =========================
  // LOAD
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch {
        toast.error("Failed to load departments");
      }
    };

    load();
  }, []);

  // =========================
  // FILTERS
  // =========================
  const filteredDepartments = departments.filter((dept) => {
    const searchLower = search.toLowerCase();
    return (
      dept.name?.toLowerCase().includes(searchLower) ||
      dept.description?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredDepartments.length / pageSize);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // =========================
  // STATS
  // =========================
  const totalDepartments = departments.length;
  const activeDepartments = departments.filter((d) => d.is_active).length;
  const inactiveDepartments = departments.filter((d) => !d.is_active).length;

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (data: DepartmentFormData) => {
    try {
      if (editing) {
        await updateDepartment(editing.id, data);
        toast.success("Department updated successfully");
      } else {
        await createDepartment(data);
        toast.success("Department created successfully");
      }

      const refreshed = await getDepartments();
      setDepartments(refreshed);

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
    if (!selectedDepartment) return;

    try {
      await deleteDepartment(selectedDepartment.id);
      toast.success("Department deleted successfully");

      const refreshed = await getDepartments();
      setDepartments(refreshed);
      setSelectedId(null);
    } catch {
      toast.error("Failed to delete department");
    }
  };

  return (
    <>
      <CrudShell
        stats={[
          { label: "Total Departments", value: totalDepartments },
          { label: "Active", value: activeDepartments },
          { label: "Members", value: departments.length },
          { label: "Read Only", value: 0 },
        ]}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search by name or description..."
        addLabel="Add Department"
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
        onEdit={() => {
          if (!selectedDepartment) return;
          setEditing(selectedDepartment);
          setOpen(true);
        }}
        onDelete={handleDelete}
        hasSelected={!!selectedDepartment}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredDepartments.length}
        itemLabel="departments"
        onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
      >
        <DepartmentTable
          data={paginatedDepartments}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
        />
      </CrudShell>

      {open && (
        <DepartmentForm
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
