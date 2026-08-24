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
        .map((p) => extractPhoneNumber(p));

      initialPhoneNumbers = initialPhoneNumbers.filter((p) => p !== "");

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-foreground text-xl font-semibold">
            {editing ? "Edit Resident" : "Add Resident"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            ✕
          </button>
        </div>

        <p className="text-muted-foreground text-sm mb-5">
          Manage resident information
        </p>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              value={form.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="Full Name"
              className="
                w-full
                bg-card
                border
                border-border
                rounded-xl
                px-4
                py-3
                text-foreground
                focus:outline-none
                focus:border-brand
              "
            />
          </div>

          {/* Phone Numbers */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Phone Numbers
            </label>

            {form.phone_numbers.map((phone, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  value={phone || ""}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  placeholder={`Phone Number ${index + 1}`}
                  className="
                      flex-1
                      bg-card
                      border
                      border-border
                      rounded-xl
                      px-4
                      py-3
                      text-foreground
                      focus:outline-none
                      focus:border-brand
                    "
                />

                {form.phone_numbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhoneField(index)}
                    className="
                        px-3
                        py-3
                        rounded-xl
                        bg-danger-soft
                        text-danger
                        hover:bg-danger-soft
                        transition-colors
                      "
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}

                {index === form.phone_numbers.length - 1 && (
                  <button
                    type="button"
                    onClick={addPhoneField}
                    className="
                        px-3
                        py-3
                        rounded-xl
                        bg-sky-500/20
                        text-brand
                        hover:bg-sky-500/30
                        transition-colors
                      "
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* National ID */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              National ID
            </label>

            <input
              value={form.national_id}
              onChange={(e) => handleChange("national_id", e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="National ID"
              className="
                w-full
                bg-card
                border
                border-border
                rounded-xl
                px-4
                py-3
                text-foreground
                focus:outline-none
                focus:border-brand
              "
            />
          </div>

          {/* Building Number */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Building Number
            </label>

            <input
              value={form.building_number}
              onChange={(e) => handleChange("building_number", e.target.value)}
              placeholder="Building Number"
              className="
                w-full
                bg-card
                border
                border-border
                rounded-xl
                px-4
                py-3
                text-foreground
                focus:outline-none
                focus:border-brand
              "
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
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
              className="
                w-full
                bg-card
                border
                border-border
                rounded-xl
                px-4
                py-3
                text-foreground
                focus:outline-none
                focus:border-brand
                text-lg
              "
            >
              <option value="owner">Owner</option>

              <option value="relative">Relative</option>

              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Owner ID */}
          {showOwnerId && (
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Owner ID
              </label>

              <input
                value={form.owner_id}
                onChange={(e) => handleChange("owner_id", e.target.value)}
                type="number"
                placeholder="Owner ID"
                className="
                  w-full
                  bg-card
                  border
                  border-border
                  rounded-xl
                  px-4
                  py-3
                  text-foreground
                  focus:outline-none
                  focus:border-brand
                "
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Notes"
              rows={3}
              className="
                w-full
                bg-card
                border
                border-border
                rounded-xl
                px-4
                py-3
                text-foreground
                focus:outline-none
                focus:border-brand
              "
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="
              px-4
              py-2
              rounded-xl
              bg-card
              text-muted-foreground
              hover:bg-secondary
              text-lg
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="
              px-4
              py-2
              rounded-xl
              bg-brand
              text-foreground
              hover:bg-brand-strong
              text-lg
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
