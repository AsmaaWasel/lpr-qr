"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Department, DepartmentFormData } from "@/modules/types/department";

type SubDepartment = {
  id: number;
  name: string;
  description?: string;
  department_id: number;
};

type SubDepartmentFormData = {
  name: string;
  description: string;
  department_id: number;
};

type Props = {
  editing?: SubDepartment | null;
  departments: Department[];
  onClose: () => void;
  onSubmit: (data: SubDepartmentFormData) => void | Promise<void>;
};

export default function SubDepartmentForm({
  editing,
  departments,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState(editing?.name ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [departmentId, setDepartmentId] = useState<number | "">(
    editing?.department_id ?? "",
  );

  // ================= UPDATE FORM WHEN EDITING CHANGES =================

  useEffect(() => {
    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
    setDepartmentId(editing?.department_id ?? "");
  }, [editing]);

  // ================= SAVE =================

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter sub department name");
      return;
    }

    if (!departmentId) {
      alert("Please select a department");
      return;
    }

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      department_id: Number(departmentId),
    });
  };

  // ================= STYLES =================

  const inputClassName = `
    w-full
    h-12
    rounded-xl
    border
    border-border
    bg-background
    px-4
    text-base
    font-medium
    text-foreground
    outline-none
    transition
    placeholder:text-muted-foreground
    focus:outline-none
    focus:ring-2
    focus:ring-[#132f49]/10
    focus:border-[#132f49]
    dark:focus:ring-white/10
    dark:focus:border-white/30
  `;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >
      <div
        className="
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          border
          border-border
          bg-card
          p-7
          shadow-2xl
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}

        <div className="mb-7 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {editing ? "Edit Sub Department" : "Add Sub Department"}
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {editing
                ? "Update sub department information"
                : "Add a new sub department"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-muted
              text-muted-foreground
              transition
              hover:bg-secondary
              hover:text-foreground
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================= FORM ================= */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* ================= SUB DEPARTMENT NAME ================= */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Sub Department Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter sub department name"
              required
              className={inputClassName}
            />
          </div>

          {/* ================= DEPARTMENT ================= */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Department
            </label>

            <select
              value={departmentId}
              onChange={(e) =>
                setDepartmentId(e.target.value ? Number(e.target.value) : "")
              }
              required
              className={inputClassName}
            >
              <option value="">Select department</option>

              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          {/* ================= DESCRIPTION ================= */}

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-base font-semibold text-foreground">
              Description
            </label>

            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter sub department description"
              className={`
                ${inputClassName}
                resize-none
                py-3
              `}
            />
          </div>
        </div>

        {/* ================= ACTIONS ================= */}

        <div
          className="
            mt-7
            flex
            justify-end
            gap-3
            border-t
            border-border
            pt-5
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              px-6
              py-3
              text-base
              font-semibold
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="
              rounded-xl
              bg-[#132f49]
              px-7
              py-3
              text-base
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#0b1f33]
              active:scale-[0.98]
            "
          >
            {editing ? "Update Sub Department" : "Save Sub Department"}
          </button>
        </div>
      </div>
    </div>
  );
}
