// /components/departments/DepartmentForm.tsx

"use client";

import { DepartmentFormData } from "@/modules/types/department";
import { useState } from "react";

type Props = {
  editing?: Partial<DepartmentFormData> | null;
  onClose: () => void;
  onSubmit: (data: DepartmentFormData) => void;
};

export default function DepartmentForm({ editing, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<DepartmentFormData>({
    name: editing?.name ?? "",
    description: editing?.description ?? "",
    is_active: editing?.is_active ?? true,
  });

  const handleChange = (
    key: keyof DepartmentFormData,
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!form.name.trim()) {
      alert("Department name is required");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-xl w-[500px] space-y-4">
        <h2 className="text-xl font-bold text-foreground">
          {editing ? "Edit Department" : "Add Department"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-foreground text-base font-medium">Name *</label>
            <input
              placeholder="Enter department name"
              className="w-full p-2.5 rounded bg-black/30 text-foreground text-base placeholder:text-muted-foreground border border-border focus:border-brand outline-none"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-foreground text-base font-medium">
              Description
            </label>
            <textarea
              placeholder="Enter department description"
              className="w-full p-2.5 rounded bg-black/30 text-foreground text-base placeholder:text-muted-foreground border border-border focus:border-brand outline-none min-h-[80px] resize-y"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-foreground text-base font-medium px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-brand hover:bg-brand px-5 py-2 rounded text-foreground text-base font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
