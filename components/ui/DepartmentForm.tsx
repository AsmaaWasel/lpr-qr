"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Department, DepartmentFormData } from "@/modules/types/department";

type Props = {
  editing?: Department | null;
  onClose: () => void;
  onSubmit: (data: DepartmentFormData) => void | Promise<void>;
};

export default function DepartmentForm({ editing, onClose, onSubmit }: Props) {
  const [name, setName] = useState(editing?.name ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [isActive, setIsActive] = useState(editing?.is_active ?? true);

  // =========================
  // SAVE
  // =========================

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter department name");
      return;
    }

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      is_active: isActive,
    });
  };

  // =========================
  // INPUT STYLE
  // =========================

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
          max-w-[560px]
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          border
          border-border
          bg-card
          p-6
          shadow-2xl
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {editing ? "Edit Department" : "Add Department"}
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {editing
                ? "Update department information"
                : "Add a new department"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
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
            <X size={18} />
          </button>
        </div>

        {/* =========================
            FORM
        ========================== */}

        <div className="space-y-4">
          {/* =========================
              NAME
          ========================== */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Department Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter department name"
              required
              className={inputClassName}
            />
          </div>

          {/* =========================
              DESCRIPTION
          ========================== */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter department description"
              rows={3}
              className={`
                ${inputClassName}
                h-auto
                resize-none
                py-3
              `}
            />
          </div>

          {/* =========================
              ACTIVE STATUS
          ========================== */}
        </div>

        {/* =========================
            ACTIONS
        ========================== */}

        <div className="mt-7 flex justify-end gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              px-5
              py-2.5
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
              px-6
              py-2.5
              text-base
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#0b1f33]
              active:scale-[0.98]
            "
          >
            {editing ? "Update Department" : "Save Department"}
          </button>
        </div>
      </div>
    </div>
  );
}
