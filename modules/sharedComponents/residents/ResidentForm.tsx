"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

type ResidentFormData = {
  full_name: string;
  phone_numbers: string[];
  phone_number: string;
  type: string;
  owner_id?: number;
  notes: string;
  national_id?: number;
  building_number: string;
};

type Props = {
  onSubmit: (data: ResidentFormData) => Promise<void>;

  editing?: {
    id: number;
    full_name: string;
    phone_numbers: string[] | any[];
    phone_number?: string;
    type: "owner" | "relative" | "staff";
    owner_id?: number;
    notes: string;
    national_id?: number;
    building_number?: string | number;
  } | null;

  onClose: () => void;
};

export default function ResidentForm({ onSubmit, editing, onClose }: Props) {
  const [form, setForm] = useState(() => {
    const extractPhoneNumber = (value: any): string => {
      if (!value) return "";

      if (typeof value === "string") return value;

      if (typeof value === "number") {
        return String(value);
      }

      if (typeof value === "object") {
        return String(
          value.number ||
            value.value ||
            value.phone ||
            value.phone_number ||
            value.phoneNumber ||
            "",
        );
      }

      return String(value);
    };

    let initialPhoneNumbers: string[] = [""];

    if (
      editing?.phone_numbers &&
      Array.isArray(editing.phone_numbers) &&
      editing.phone_numbers.length > 0
    ) {
      initialPhoneNumbers = editing.phone_numbers
        .filter((p) => p !== null && p !== undefined)
        .map((p) => extractPhoneNumber(p))
        .filter((p) => p !== "");

      if (initialPhoneNumbers.length === 0) {
        initialPhoneNumbers = [""];
      }
    } else if (editing?.phone_number) {
      initialPhoneNumbers = [extractPhoneNumber(editing.phone_number)];
    }

    return {
      full_name: editing?.full_name ?? "",
      phone_numbers: initialPhoneNumbers,
      type: editing?.type ?? "owner",
      owner_id: editing?.owner_id?.toString() ?? "",
      notes: editing?.notes ?? "",
      national_id: editing?.national_id?.toString() ?? "",
      building_number: editing?.building_number?.toString() ?? "",
    };
  });

  const handleChange = (key: keyof typeof form, value: string | string[]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhoneNumbers = [...form.phone_numbers];

    newPhoneNumbers[index] = value;

    handleChange("phone_numbers", newPhoneNumbers);
  };

  const addPhoneField = () => {
    setForm((prev) => ({
      ...prev,
      phone_numbers: [...prev.phone_numbers, ""],
    }));
  };

  const removePhoneField = (index: number) => {
    if (form.phone_numbers.length <= 1) {
      return;
    }

    const newPhoneNumbers = form.phone_numbers.filter((_, i) => i !== index);

    handleChange("phone_numbers", newPhoneNumbers);
  };

  const handleSubmit = async () => {
    const phoneNumbers = form.phone_numbers
      .filter((phone) => phone !== null && phone !== undefined)
      .map((phone) => String(phone).trim())
      .filter((phone) => phone !== "");

    if (!form.full_name?.trim()) {
      return;
    }

    if (phoneNumbers.length === 0) {
      return;
    }

    const submitData: ResidentFormData = {
      full_name: form.full_name.trim(),

      phone_numbers: phoneNumbers,

      phone_number: phoneNumbers[0],

      type: form.type,

      notes: form.notes || "",

      building_number: form.building_number.trim(),

      ...(form.national_id !== "" &&
      form.national_id !== undefined &&
      form.national_id !== null
        ? {
            national_id: Number(form.national_id),
          }
        : {}),

      ...(form.type !== "owner" &&
      form.owner_id !== "" &&
      form.owner_id !== undefined &&
      form.owner_id !== null
        ? {
            owner_id: Number(form.owner_id),
          }
        : {}),
    };

    await onSubmit(submitData);
  };

  const showOwnerId = form.type !== "owner";

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
              {editing ? "Edit Resident" : "Add Resident"}
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {editing
                ? "Update resident information"
                : "Add a new resident and manage their information"}
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
              text-lg
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
          {/* FULL NAME */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter full name"
              value={form.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              className={inputClassName}
            />
          </div>

          {/* NATIONAL ID */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              National ID
            </label>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter national ID"
              value={form.national_id}
              onChange={(e) => handleChange("national_id", e.target.value)}
              className={inputClassName}
            />
          </div>

          {/* PHONE NUMBERS */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Phone Numbers
            </label>

            <div className="space-y-2">
              {form.phone_numbers.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    inputMode="tel"
                    placeholder={`Phone Number ${index + 1}`}
                    value={phone || ""}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    className={inputClassName}
                  />

                  {/* REMOVE */}

                  {form.phone_numbers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhoneField(index)}
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-danger-soft
                        text-danger
                        transition
                        hover:bg-red-500/10
                      "
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}

                  {/* ADD */}

                  {index === form.phone_numbers.length - 1 && (
                    <button
                      type="button"
                      onClick={addPhoneField}
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-sky-500/20
                        text-brand
                        transition
                        hover:bg-sky-500/30
                      "
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* BUILDING NUMBER */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Building Number
            </label>

            <input
              type="text"
              placeholder="Enter building number"
              value={form.building_number}
              onChange={(e) => handleChange("building_number", e.target.value)}
              className={inputClassName}
            />
          </div>

          {/* TYPE */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Type
            </label>

            <select
              value={form.type}
              onChange={(e) => {
                handleChange("type", e.target.value);

                if (e.target.value === "owner") {
                  handleChange("owner_id", "");
                }
              }}
              className={`${inputClassName} cursor-pointer`}
            >
              <option value="owner">Owner</option>
              <option value="relative">Relative</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* OWNER ID */}

          {showOwnerId && (
            <div className="space-y-1.5">
              <label className="block text-base font-semibold text-foreground">
                Owner ID
              </label>

              <input
                type="number"
                placeholder="Enter owner ID"
                value={form.owner_id}
                onChange={(e) => handleChange("owner_id", e.target.value)}
                className={inputClassName}
              />
            </div>
          )}

          {/* NOTES */}

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-base font-semibold text-foreground">
              Notes
            </label>

            <textarea
              placeholder="Enter notes"
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={4}
              className={`
                ${inputClassName}
                h-auto
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
            onClick={handleSubmit}
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
            {editing ? "Update Resident" : "Save Resident"}
          </button>
        </div>
      </div>
    </div>
  );
}
