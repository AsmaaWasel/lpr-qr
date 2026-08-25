"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Gate, GateFormData } from "@/modules/types/gate";

type Props = {
  editing?: Gate | null;
  onClose: () => void;
  onSubmit: (data: GateFormData) => void | Promise<void>;
};

export default function GateForm({ editing, onClose, onSubmit }: Props) {
  const [name, setName] = useState(editing?.name ?? "");
  const [type, setType] = useState<"ENTRY" | "EXIT">(editing?.type ?? "ENTRY");
  const [desc, setDesc] = useState(editing?.desc ?? "");
  const [ip, setIp] = useState(editing?.ip ?? "");

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter gate name");
      return;
    }

    if (!ip.trim()) {
      alert("Please enter IP address");
      return;
    }

    await onSubmit({
      name: name.trim(),
      type,
      desc: desc.trim(),
      ip: ip.trim(),
    });
  };

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
                onChange={(e) => setName(e.target.value)}
                placeholder="Gate-5 - Main Entrance"
                required
                className={inputClassName}
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="block text-base font-semibold text-foreground">
                Type
              </label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value as "ENTRY" | "EXIT")}
                className={inputClassName}
              >
                <option value="ENTRY">ENTRY</option>
                <option value="EXIT">EXIT</option>
              </select>
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
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP address (e.g., 10.20.1.11)"
              required
              className={inputClassName}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-foreground">
              Description
            </label>

            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Primary residents entry"
              rows={4}
              className={`
                ${inputClassName}
                h-auto
                min-h-[120px]
                resize-none
                py-3
              `}
            />
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
