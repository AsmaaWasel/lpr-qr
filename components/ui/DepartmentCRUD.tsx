// @ts-nocheck
"use client"
// @ts-nocheck

import { useEffect, useState } from "react";

import DepartmentTable from "./DepartmentTable";
import DepartmentForm from "./DepartmentForm";
import SubDepartmentForm from "./SubDepartmentForm";

import { useToast } from "@/shared/hooks/use-toast";

import { Department, DepartmentFormData } from "@/modules/types/department";

import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from "@/services/departments";

import { createSubDepartment } from "@/services/subDepartments";

import { CrudShell } from "@/shared/ui/voom";

export default function DepartmentCRUD() {
  // =========================
  // DATA STATES
  // =========================

  const [departments, setDepartments] = useState<Department[]>([]);

  const [open, setOpen] = useState(false);

  const [subDepartmentOpen, setSubDepartmentOpen] = useState(false);

  const [editing, setEditing] = useState<Department | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // =========================
  // UI STATES
  // =========================

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const toast = useToast();

  const selectedDepartment =
    departments.find((department) => department.id === selectedId) || null;

  // =========================
  // LOAD DEPARTMENTS
  // =========================

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDepartments();

        setDepartments(data);
      } catch (error) {
        console.error("Error loading departments:", error);

        toast.error("Failed to load departments");
      }
    };

    load();
  }, []);

  // =========================
  // FILTERS
  // =========================

  const filteredDepartments = departments.filter((department) => {
    const query = search.toLowerCase().trim();

    return (
      department.name?.toLowerCase().includes(query) ||
      department.description?.toLowerCase().includes(query)
    );
  });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filteredDepartments.length / pageSize);

  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // =========================
  // ADD DEPARTMENT
  // =========================

  const handleAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  // =========================
  // ADD SUB DEPARTMENT
  // =========================

  const handleAddSubDepartment = () => {
    setSubDepartmentOpen(true);
  };

  // =========================
  // EDIT DEPARTMENT
  // =========================

  const handleEdit = () => {
    if (!selectedDepartment) return;

    setEditing(selectedDepartment);

    setOpen(true);
  };

  // =========================
  // SUBMIT DEPARTMENT
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
  // SUBMIT SUB DEPARTMENT
  // =========================

  const handleSubDepartmentSubmit = async (data: {
    name: string;
    description?: string;
    department_id: number;
  }) => {
    try {
      await createSubDepartment(data);

      toast.success("Sub Department created successfully");

      setSubDepartmentOpen(false);

      // Refresh departments in case the table
      // needs the latest department structure.
      const refreshed = await getDepartments();

      setDepartments(refreshed);
    } catch (error) {
      console.error("Sub Department submit error:", error);

      toast.error("Failed to create sub department");
    }
  };

  // =========================
  // DELETE DEPARTMENT
  // =========================

  const handleDelete = async () => {
    if (!selectedDepartment) return;

    try {
      await deleteDepartment(selectedDepartment.id);

      toast.success("Department deleted successfully");

      const refreshed = await getDepartments();

      setDepartments(refreshed);

      setSelectedId(null);

      if (paginatedDepartments.length === 1 && currentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      }
    } catch (error) {
      console.error("Delete error:", error);

      toast.error("Failed to delete department");
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
          searchPlaceholder="Search by name or description..."
          // =========================
          // ADD DEPARTMENT
          // =========================

          addLabel="Add Department"
          onAdd={handleAdd}
          // =========================
          // ADD SUB DEPARTMENT
          // =========================

          secondaryAddLabel="Add Sub Department"
          onSecondaryAdd={handleAddSubDepartment}
          // =========================
          // EDIT
          // =========================

          onEdit={handleEdit}
          // =========================
          // DELETE
          // =========================

          onDelete={handleDelete}
          hasSelected={!!selectedDepartment}
          // =========================
          // PAGINATION
          // =========================

          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredDepartments.length}
          itemLabel="departments"
          onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNext={() =>
            setCurrentPage((page) => Math.min(totalPages || 1, page + 1))
          }
        >
          <DepartmentTable
            data={paginatedDepartments}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId((prev) => (prev === id ? null : id))
            }
          />
        </CrudShell>
      </div>

      {/* =========================
          DEPARTMENT FORM
      ========================= */}

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

      {/* =========================
          SUB DEPARTMENT FORM
      ========================= */}

      {subDepartmentOpen && (
        <SubDepartmentForm
          editing={null}
          departments={departments}
          onClose={() => {
            setSubDepartmentOpen(false);
          }}
          onSubmit={handleSubDepartmentSubmit}
        />
      )}
    </>
  );
}
