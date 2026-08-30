"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Gate, GateFormData } from "@/modules/types/gate";

type Props = {
  editing?: Gate | null;
  onClose: () => void;
  onSubmit: (data: GateFormData) => void | Promise<void>;
};

type FormErrors = {
  name?: string;
  type?: string;
  ip?: string;
  desc?: string;
};

export default function GateForm({ editing, onClose, onSubmit }: Props) {
  const [name, setName] = useState(editing?.name ?? "");
  const [type, setType] = useState<"ENTRY" | "EXIT">(editing?.type ?? "ENTRY");
  const [desc, setDesc] = useState(editing?.desc ?? "");
  const [ip, setIp] = useState(editing?.ip ?? "");

  const [errors, setErrors] = useState<FormErrors>({});

  // =========================
  // VALIDATION
  // =========================
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const trimmedName = name.trim();
    const trimmedIp = ip.trim();
    const trimmedDesc = desc.trim();

    // Gate Name
    if (!trimmedName) {
      newErrors.name = "Gate name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Gate name must be at least 2 characters";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Gate name must not exceed 100 characters";
    }

    // Type
    if (type !== "ENTRY" && type !== "EXIT") {
      newErrors.type = "Please select a valid gate type";
    }

    // IPv4
    const ipRegex =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

    if (!trimmedIp) {
      newErrors.ip = "IP address is required";
    } else if (!ipRegex.test(trimmedIp)) {
      newErrors.ip = "Please enter a valid IPv4 address";
    }

    // Description
    if (trimmedDesc.length > 500) {
      newErrors.desc = "Description must not exceed 500 characters";
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
      desc: desc.trim(),
      ip: ip.trim(),
    });
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
        {/* HEADER */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {editing ? "Edit Gate" : "Add Gate"}
            </h2>

            <p className="mt-2 text-sm md:text-base font-medium text-muted-foreground">
              {editing ? "Update gate information" : "Add a new system gate"}
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

        {/* FORM */}
        <div className="space-y-6">
          {/* Gate Name + Type */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-5">
            {/* Gate Name */}
            <div className="space-y-2">
              <label className="block text-base font-semibold text-foreground">
                Gate Name
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
                placeholder="Gate-5 - Main Entrance"
                maxLength={100}
                className={`${inputClassName} ${
                  errors.name ? errorInputClassName : ""
                }`}
              />

              {errors.name && (
                <p className="text-sm font-medium text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="block text-base font-semibold text-foreground">
                Type
              </label>

              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as "ENTRY" | "EXIT");

                  if (errors.type) {
                    setErrors((prev) => ({
                      ...prev,
                      type: undefined,
                    }));
                  }
                }}
                className={`${inputClassName} ${
                  errors.type ? errorInputClassName : ""
                }`}
              >
                <option value="ENTRY">ENTRY</option>
                <option value="EXIT">EXIT</option>
              </select>

              {errors.type && (
                <p className="text-sm font-medium text-red-500">
                  {errors.type}
                </p>
              )}
            </div>
          </div>

          {/* IP Address */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-foreground">
              IP Address
            </label>

            <input
              type="text"
              value={ip}
              onChange={(e) => {
                setIp(e.target.value);

                if (errors.ip) {
                  setErrors((prev) => ({
                    ...prev,
                    ip: undefined,
                  }));
                }
              }}
              placeholder="Enter IP address (e.g., 10.20.1.11)"
              maxLength={15}
              inputMode="decimal"
              className={`${inputClassName} ${
                errors.ip ? errorInputClassName : ""
              }`}
            />

            {errors.ip && (
              <p className="text-sm font-medium text-red-500">{errors.ip}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-base font-semibold text-foreground">
                Description
              </label>

              <span
                className={`text-xs font-medium ${
                  desc.length > 500 ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                {desc.length}/500
              </span>
            </div>

            <textarea
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);

                if (errors.desc) {
                  setErrors((prev) => ({
                    ...prev,
                    desc: undefined,
                  }));
                }
              }}
              placeholder="Primary residents entry"
              maxLength={500}
              rows={4}
              className={`
                ${inputClassName}
                h-auto
                min-h-[120px]
                resize-none
                py-3
                ${errors.desc ? errorInputClassName : ""}
              `}
            />

            {errors.desc && (
              <p className="text-sm font-medium text-red-500">{errors.desc}</p>
            )}
          </div>
        </div>

        {/* ACTIONS */}
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
            {editing ? "Update Gate" : "Save Gate"}
          </button>
        </div>
      </div>
    </div>
  );
}
