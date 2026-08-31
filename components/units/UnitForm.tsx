
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Unit,
  UnitFormData,
  UnitType,
} from "@/modules/types/units";

type Building = {
  id: number;
  name: string;
};

type Props = {
  editing?: Unit | null;
  buildings: Building[];
  onClose: () => void;
  onSubmit: (data: UnitFormData) => void | Promise<void>;
};

type FormErrors = {
  name?: string;
  type?: string;
  description?: string;
  parent_id?: string;
};

export default function UnitForm({
  editing,
  buildings,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState(editing?.name ?? "");

  const [type, setType] = useState<UnitType>(
    editing?.type ?? "VILLA"
  );

  const [description, setDescription] = useState(
    editing?.description ?? ""
  );

  const [parentId, setParentId] = useState(
    editing?.parent_id != null
      ? String(editing.parent_id)
      : ""
  );

  const [errors, setErrors] = useState<FormErrors>({});

  // =========================
  // VALIDATION
  // =========================

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    // =========================
    // NAME
    // =========================

    if (!trimmedName) {
      newErrors.name = "Unit name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name =
        "Unit name must be at least 2 characters";
    } else if (trimmedName.length > 100) {
      newErrors.name =
        "Unit name must not exceed 100 characters";
    }

    // =========================
    // TYPE
    // =========================

    if (
      type !== "BUILDING" &&
      type !== "APARTMENT" &&
      type !== "VILLA"
    ) {
      newErrors.type = "Please select a valid unit type";
    }

    // =========================
    // DESCRIPTION
    // =========================

    if (trimmedDescription.length > 500) {
      newErrors.description =
        "Description must not exceed 500 characters";
    }

    // =========================
    // PARENT BUILDING
    // Only required for APARTMENT
    // =========================

    if (type === "APARTMENT") {
      if (!parentId) {
        newErrors.parent_id =
          "Please select a building";
      } else {
        const parsedParentId = Number(parentId);

        const buildingExists = buildings.some(
          (building) => building.id === parsedParentId
        );

        if (!buildingExists) {
          newErrors.parent_id =
            "Please select a valid building";
        }
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = async () => {
    if (!validateForm()) return;

    await onSubmit({
      name: name.trim(),
      type,
      description: description.trim(),

      // Parent only exists for apartments
      parent_id:
        type === "APARTMENT" && parentId
          ? Number(parentId)
          : null,
    });
  };

  // =========================
  // TYPE CHANGE
  // =========================

  const handleTypeChange = (
    newType: UnitType
  ) => {
    setType(newType);

    // Parent is only valid for apartments
    if (newType !== "APARTMENT") {
      setParentId("");
    }

    setErrors((prev) => ({
      ...prev,
      type: undefined,
      parent_id: undefined,
    }));
  };

  // =========================
  // INPUT STYLES
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

  const errorInputClassName = `
    border-red-500
    focus:border-red-500
    focus:ring-red-500/10
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
        md:p-8
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >
      <div
        className="
          w-full
          max-w-[850px]
          max-h-[92vh]
          overflow-y-auto
          rounded-3xl
          border
          border-border
          bg-card
          p-7
          md:p-9
          shadow-2xl
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {editing ? "Edit Unit" : "Add Unit"}
            </h2>

            <p className="mt-2 text-sm md:text-base font-medium text-muted-foreground">
              {editing
                ? "Update unit information"
                : "Add a new system unit"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              shrink-0
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
            <X size={20} />
          </button>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <div className="space-y-6">

          {/* =========================
              NAME + TYPE
          ========================= */}

          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-5">

            {/* NAME */}

            <div className="space-y-2">
              <label className="block text-base font-semibold text-foreground">
                Unit Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);

                  if (errors.name) {
                    setErrors((prev) => ({
                      ...prev,
                      name: undefined,
                    }));
                  }
                }}
                placeholder="Building A / Apartment 101 / Villa 1"
                maxLength={100}
                className={`${inputClassName} ${
                  errors.name
                    ? errorInputClassName
                    : ""
                }`}
              />

              {errors.name && (
                <p className="text-sm font-medium text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* TYPE */}

            <div className="space-y-2">
              <label className="block text-base font-semibold text-foreground">
                Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  handleTypeChange(
                    e.target.value as UnitType
                  )
                }
                className={`${inputClassName} ${
                  errors.type
                    ? errorInputClassName
                    : ""
                }`}
              >
                <option value="BUILDING">
                  BUILDING
                </option>

                <option value="APARTMENT">
                  APARTMENT
                </option>

                <option value="VILLA">
                  VILLA
                </option>
              </select>

              {errors.type && (
                <p className="text-sm font-medium text-red-500">
                  {errors.type}
                </p>
              )}
            </div>
          </div>

          {/* =========================
              PARENT BUILDING
              APARTMENT ONLY
          ========================= */}

          {type === "APARTMENT" && (
            <div className="space-y-2">
              <label className="block text-base font-semibold text-foreground">
                Building
              </label>

              <select
                value={parentId}
                onChange={(e) => {
                  setParentId(e.target.value);

                  if (errors.parent_id) {
                    setErrors((prev) => ({
                      ...prev,
                      parent_id: undefined,
                    }));
                  }
                }}
                className={`${inputClassName} ${
                  errors.parent_id
                    ? errorInputClassName
                    : ""
                }`}
              >
                <option value="">
                  Select a building
                </option>

                {buildings.map((building) => (
                  <option
                    key={building.id}
                    value={building.id}
                  >
                    {building.name}
                  </option>
                ))}
              </select>

              {errors.parent_id && (
                <p className="text-sm font-medium text-red-500">
                  {errors.parent_id}
                </p>
              )}
            </div>
          )}

          {/* =========================
              DESCRIPTION
          ========================= */}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-base font-semibold text-foreground">
                Description
              </label>

              <span
                className={`text-xs font-medium ${
                  description.length > 500
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {description.length}/500
              </span>
            </div>

            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);

                if (errors.description) {
                  setErrors((prev) => ({
                    ...prev,
                    description: undefined,
                  }));
                }
              }}
              placeholder="Unit description"
              maxLength={500}
              rows={4}
              className={`
                ${inputClassName}
                h-auto
                min-h-[120px]
                resize-none
                py-3
                ${
                  errors.description
                    ? errorInputClassName
                    : ""
                }
              `}
            />

            {errors.description && (
              <p className="text-sm font-medium text-red-500">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* =========================
            ACTIONS
        ========================= */}

        <div className="mt-8 flex justify-end gap-3 border-t border-border pt-6">

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
            {editing ? "Update Unit" : "Save Unit"}
          </button>
        </div>
      </div>
    </div>
  );
}

