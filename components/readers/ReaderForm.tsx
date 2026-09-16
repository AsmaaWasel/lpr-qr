"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

import { ReaderFormData } from "@/modules/types/camera";
import { getGates } from "@/services/gate";

// =====================================================
// TYPES
// =====================================================

type Gate = {
  id: number;
  name: string;
};

type Props = {
  editing?: Partial<ReaderFormData> | null;
  onClose: () => void;
  onSubmit: (data: ReaderFormData) => void | Promise<void>;
};

type FormErrors = {
  gate_id?: string;
  reader_type?: string;
  username?: string;
  password?: string;
  ip_address?: string;
  port?: string;
  add_string_to_url?: string;
};

// =====================================================
// COMPONENT
// =====================================================

export default function ReaderForm({ editing, onClose, onSubmit }: Props) {
  // =====================================================
  // GATES
  // =====================================================

  const [gates, setGates] = useState<Gate[]>([]);
  const [loadingGates, setLoadingGates] = useState(true);

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState<ReaderFormData>({
    gate_id: editing?.gate_id ?? 0,
    camera_type: "DRIVER",
    location: editing?.location ?? "",
    username: editing?.username ?? "",
    password: editing?.password ?? "",
    ip_address: editing?.ip_address ?? "",
    port: Number(editing?.port ?? 0),
    notes: editing?.notes ?? "",
    reader_type: editing?.reader_type ?? "",
    add_string_to_url: editing?.add_string_to_url ?? "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // =====================================================
  // GET GATES
  // =====================================================

  useEffect(() => {
    const fetchGates = async () => {
      try {
        setLoadingGates(true);

        const response = await getGates();

        console.log("Gates API response:", response);

        // API ممكن يرجع:
        // [
        //   { id: 1, name: "Gate 1" }
        // ]
        //
        // أو:
        // { data: [...] }
        //
        // أو:
        // { gates: [...] }

        let gatesData: Gate[] = [];

        if (Array.isArray(response)) {
          gatesData = response;
        } else if (
          response &&
          typeof response === "object" &&
          "data" in response &&
          Array.isArray((response as any).data)
        ) {
          gatesData = (response as any).data;
        } else if (
          response &&
          typeof response === "object" &&
          "gates" in response &&
          Array.isArray((response as any).gates)
        ) {
          gatesData = (response as any).gates;
        }

        // Normalize data
        const normalizedGates = gatesData
          .map((gate: any) => ({
            id: Number(gate.id),
            name: String(gate.name ?? ""),
          }))
          .filter((gate) => gate.id > 0 && gate.name.trim() !== "");

        console.log("Normalized gates:", normalizedGates);

        setGates(normalizedGates);

        // =================================================
        // EDIT MODE
        // Set location based on selected gate
        // =================================================

        if (editing?.gate_id) {
          const selectedGate = normalizedGates.find(
            (gate) => gate.id === Number(editing.gate_id),
          );

          if (selectedGate) {
            setForm((prev) => ({
              ...prev,
              gate_id: selectedGate.id,
              location: selectedGate.name,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch gates:", error);
        setGates([]);
      } finally {
        setLoadingGates(false);
      }
    };

    fetchGates();
  }, [editing?.gate_id]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = <K extends keyof ReaderFormData>(
    key: K,
    value: ReaderFormData[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  // =====================================================
  // GATE CHANGE
  // =====================================================

  const handleGateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gateId = Number(e.target.value);

    const selectedGate = gates.find((gate) => gate.id === gateId);

    setForm((prev) => ({
      ...prev,
      gate_id: gateId,
      location: selectedGate?.name ?? "",
    }));

    setErrors((prev) => ({
      ...prev,
      gate_id: undefined,
    }));
  };

  // =====================================================
  // READER TYPE
  // =====================================================

  const isCamera = form.reader_type === "CAMERA";

  // =====================================================
  // INPUT STYLE
  // =====================================================

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

  // =====================================================
  // LABEL STYLE
  // =====================================================

  const labelClassName = `
    block
    text-sm
    font-semibold
    text-foreground
  `;

  const errorClassName = `
    mt-1
    text-sm
    font-medium
    text-red-500
  `;

  // =====================================================
  // VALIDATE IP
  // =====================================================

  const isValidIp = (ip: string) => {
    const parts = ip.trim().split(".");

    if (parts.length !== 4) {
      return false;
    }

    return parts.every((part) => {
      if (!/^\d+$/.test(part)) {
        return false;
      }

      const number = Number(part);

      return number >= 0 && number <= 255;
    });
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Gate
    if (!form.gate_id || form.gate_id <= 0) {
      newErrors.gate_id = "Please select a gate";
    } else {
      const gateExists = gates.some((gate) => gate.id === Number(form.gate_id));

      if (!gateExists) {
        newErrors.gate_id = "Please select a valid gate";
      }
    }

    // Reader Type
    if (!form.reader_type?.trim()) {
      newErrors.reader_type = "Please select reader type";
    } else if (
      form.reader_type !== "CAMERA" &&
      form.reader_type !== "QRREADER"
    ) {
      newErrors.reader_type = "Invalid reader type";
    }

    // IP Address
    if (!form.ip_address?.trim()) {
      newErrors.ip_address = "IP address is required";
    } else if (!isValidIp(form.ip_address)) {
      newErrors.ip_address = "Please enter a valid IP address";
    }

    // Port
    if (!form.port || Number(form.port) <= 0) {
      newErrors.port = "Port is required";
    } else if (Number(form.port) < 1 || Number(form.port) > 65535) {
      newErrors.port = "Port must be between 1 and 65535";
    }

    // Camera validation
    if (isCamera) {
      // Username
      if (!form.username?.trim()) {
        newErrors.username = "Camera username is required";
      } else if (form.username.trim().length < 2) {
        newErrors.username = "Username must be at least 2 characters";
      }

      // Password
      if (!form.password?.trim()) {
        newErrors.password = "Camera password is required";
      } else if (form.password.length < 4) {
        newErrors.password = "Password must be at least 4 characters";
      }
    }

    return newErrors;
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const selectedGate = gates.find((gate) => gate.id === Number(form.gate_id));

    if (!selectedGate) {
      setErrors({
        gate_id: "Please select a valid gate",
      });

      return;
    }

    const submitData = {
      ...form,

      // ثابت دائمًا
      camera_type: "DRIVER",

      gate_id: selectedGate.id,
      location: selectedGate.name,
      port: Number(form.port),
    };

    console.log("Submitting reader:", submitData);

    await onSubmit(submitData as ReaderFormData);
  };

  // =====================================================
  // RENDER
  // =====================================================

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
          max-w-[900px]
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
        {/* HEADER */}

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {editing ? "Edit Reader" : "Add Reader"}
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {editing
                ? "Update reader information"
                : "Add a new camera or QR reader"}
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

        {/* FORM */}

        <div
          className="
            grid
            grid-cols-1
            gap-x-5
            gap-y-5
            md:grid-cols-2
          "
        >
          {/* GATE */}

          <div className="space-y-1.5">
            <label className={labelClassName}>Gate</label>

            <select
              value={form.gate_id || ""}
              onChange={handleGateChange}
              disabled={loadingGates}
              className={`
                ${inputClassName}
                ${errors.gate_id ? "border-red-500 focus:border-red-500" : ""}
                ${loadingGates ? "cursor-not-allowed opacity-60" : ""}
              `}
            >
              <option value="">
                {loadingGates
                  ? "Loading gates..."
                  : gates.length === 0
                    ? "No gates available"
                    : "Select gate"}
              </option>

              {!loadingGates &&
                gates.map((gate) => (
                  <option key={gate.id} value={gate.id}>
                    {gate.name}
                  </option>
                ))}
            </select>

            {loadingGates && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 size={13} className="animate-spin" />
                Loading gates...
              </div>
            )}

            {!loadingGates && gates.length === 0 && (
              <p className={errorClassName}>No gates available</p>
            )}

            {errors.gate_id && (
              <p className={errorClassName}>{errors.gate_id}</p>
            )}
          </div>

          {/* READER TYPE */}

          <div className="space-y-1.5">
            <label className={labelClassName}>Reader Type</label>

            <select
              value={form.reader_type}
              onChange={(e) => handleChange("reader_type", e.target.value)}
              className={`
                ${inputClassName}
                ${
                  errors.reader_type
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              `}
            >
              <option value="">Select reader type</option>

              <option value="CAMERA">Camera</option>

              <option value="QRREADER">QR Reader</option>
            </select>

            {errors.reader_type && (
              <p className={errorClassName}>{errors.reader_type}</p>
            )}
          </div>

          {/* USERNAME */}

          {isCamera && (
            <div className="space-y-1.5">
              <label className={labelClassName}>Username</label>

              <input
                type="text"
                placeholder="Enter camera username"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className={`
                  ${inputClassName}
                  ${
                    errors.username ? "border-red-500 focus:border-red-500" : ""
                  }
                `}
              />

              {errors.username && (
                <p className={errorClassName}>{errors.username}</p>
              )}
            </div>
          )}

          {/* PASSWORD */}

          {isCamera && (
            <div className="space-y-1.5">
              <label className={labelClassName}>Password</label>

              <input
                type="password"
                placeholder="Enter camera password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`
                  ${inputClassName}
                  ${
                    errors.password ? "border-red-500 focus:border-red-500" : ""
                  }
                `}
              />

              {errors.password && (
                <p className={errorClassName}>{errors.password}</p>
              )}
            </div>
          )}

          {/* IP ADDRESS */}

          <div className="space-y-1.5">
            <label className={labelClassName}>IP Address</label>

            <input
              type="text"
              value={form.ip_address}
              onChange={(e) => handleChange("ip_address", e.target.value)}
              placeholder="Enter IP address (e.g., 10.20.1.11)"
              className={`
                ${inputClassName}
                ${
                  errors.ip_address ? "border-red-500 focus:border-red-500" : ""
                }
              `}
            />

            {errors.ip_address && (
              <p className={errorClassName}>{errors.ip_address}</p>
            )}
          </div>

          {/* PORT */}

          <div className="space-y-1.5">
            <label className={labelClassName}>Port</label>

            <input
              type="number"
              min={1}
              max={65535}
              value={form.port || ""}
              onChange={(e) => handleChange("port", Number(e.target.value))}
              placeholder="Enter port number (e.g., 8080)"
              className={`
                ${inputClassName}
                ${errors.port ? "border-red-500 focus:border-red-500" : ""}
              `}
            />

            {errors.port && <p className={errorClassName}>{errors.port}</p>}
          </div>

          {/* ADD SUB URL */}

          <div className="space-y-1.5">
            <label className={labelClassName}>Add SubURL</label>

            <input
              type="text"
              value={form.add_string_to_url}
              onChange={(e) =>
                handleChange("add_string_to_url", e.target.value)
              }
              placeholder="Enter string to append to URL (e.g., /stream)"
              className={inputClassName}
            />
          </div>

          {/* NOTES */}

          <div className="space-y-1.5 md:col-span-2">
            <label className={labelClassName}>Notes</label>

            <textarea
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Add notes about this reader"
              rows={3}
              className={`
                ${inputClassName}
                h-auto
                resize-none
                py-3
              `}
            />
          </div>
        </div>

        {/* ACTIONS */}

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
            {editing ? "Update Reader" : "Save Reader"}
          </button>
        </div>
      </div>
    </div>
  );
}
