"use client";

import { useEffect, useMemo, useState } from "react";

import { AxiosError } from "axios";

import { X } from "lucide-react";

import { Plate } from "@/modules/types/plate";
import { Resident } from "@/modules/types/resident";

import { getResidents } from "@/services/resident";

type PlateFormData = {
  plate_number_full: string;
  resident_id?: number;
};

type Props = {
  editing?: Plate | null;
  onClose: () => void;
  onSubmit: (data: PlateFormData) => void | Promise<void>;
};

type FormErrors = {
  numbers?: string;
  letters?: string;
};

type BackendErrorItem = {
  msg?: string;
  message?: string;
};

type BackendErrorResponse = {
  detail?: string | BackendErrorItem[];
  message?: string;
  error?: string;
  data?: {
    message?: string;
  };
};

const getBackendMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<BackendErrorResponse>;

  const responseData = axiosError.response?.data;

  if (Array.isArray(responseData?.detail)) {
    return responseData.detail
      .map((item) => item.msg || item.message || JSON.stringify(item))
      .join(", ");
  }

  if (typeof responseData?.detail === "string") {
    return responseData.detail;
  }

  if (typeof responseData?.message === "string") {
    return responseData.message;
  }

  if (typeof responseData?.error === "string") {
    return responseData.error;
  }

  if (typeof responseData?.data?.message === "string") {
    return responseData.data.message;
  }

  if (axiosError.message) {
    return axiosError.message;
  }

  return "Something went wrong. Please try again.";
};

export default function PlateForm({ editing, onClose, onSubmit }: Props) {
  /*
   * Values coming from the selected plate.
   * These are derived from `editing`, so we don't
   * need a useEffect + setState for them.
   */
  const initialValues = useMemo(() => {
    if (!editing) {
      return {
        numbers: "",
        letters: "",
        residentId: undefined as number | undefined,
      };
    }

    const plate = editing.plate_number_full || "";

    const numberPart = plate.match(/^\d+/)?.[0] || "";

    const lettersPart = plate.replace(/^\d+/, "");

    return {
      numbers: numberPart,
      letters: lettersPart.split("").reverse().join(""),
      residentId: editing.resident_id ?? undefined,
    };
  }, [editing]);

  const [numbers, setNumbers] = useState(initialValues.numbers);

  const [letters, setLetters] = useState(initialValues.letters);

  const [residentId, setResidentId] = useState<number | undefined>(
    initialValues.residentId,
  );

  const [residents, setResidents] = useState<Resident[]>([]);

  const [residentSearch, setResidentSearch] = useState("");

  const [showResidents, setShowResidents] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const [submitting, setSubmitting] = useState(false);

  const [backendMessage, setBackendMessage] = useState("");

  const [backendMessageType, setBackendMessageType] = useState<
    "success" | "error" | ""
  >("");

  /*
   * Load residents.
   * This effect is valid because it synchronizes
   * with an external API.
   */
  useEffect(() => {
    let mounted = true;

    const loadResidents = async () => {
      try {
        const data = await getResidents(0, 100);

        if (mounted) {
          setResidents(data);
        }
      } catch (error: unknown) {
        console.error("Failed to load residents:", error);
      }
    };

    loadResidents();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * When editing changes, the form needs to be
   * initialized with the selected plate.
   *
   * We intentionally don't use useEffect here
   * because that would trigger synchronous
   * setState calls inside an effect.
   *
   * If your PlateCRUD keeps the same component
   * mounted while changing editing, the parent
   * should provide a key based on the editing id.
   */

  const selectedResident = residents.find(
    (resident) => resident.id === residentId,
  );

  const filteredResidents = residents.filter((resident) => {
    const search = residentSearch.toLowerCase();

    return (
      String(resident.id).includes(search) ||
      resident.name?.toLowerCase().includes(search) ||
      resident.phone?.toLowerCase().includes(search)
    );
  });

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!numbers.trim()) {
      newErrors.numbers = "Please enter plate numbers.";
    }

    if (!letters.trim()) {
      newErrors.letters = "Please enter plate letters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setBackendMessage("");
    setBackendMessageType("");

    if (!validate()) {
      return;
    }

    const plateNumber = `${numbers.trim()}${letters
      .trim()
      .split("")
      .reverse()
      .join("")}`;

    const submitData: PlateFormData = {
      plate_number_full: plateNumber,
      ...(residentId !== undefined
        ? {
            resident_id: residentId,
          }
        : {}),
    };

    try {
      setSubmitting(true);

      await onSubmit(submitData);

      setBackendMessage(
        editing ? "Plate updated successfully." : "Plate created successfully.",
      );

      setBackendMessageType("success");
    } catch (error: unknown) {
      console.error("PLATE SAVE ERROR:", error);

      const axiosError = error as AxiosError<BackendErrorResponse>;

      console.error("STATUS:", axiosError.response?.status);

      console.error("DATA:", axiosError.response?.data);

      const message = getBackendMessage(error);

      setBackendMessage(message);
      setBackendMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-[#0B1220]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-[#0B1B30] dark:text-white">
            {editing ? "Edit Plate" : "Add Plate"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Plate Preview */}
          <div className="flex justify-center">
            <div className="flex h-20 w-64 overflow-hidden rounded-xl border-2 border-gray-300 bg-white shadow-md">
              <div className="flex w-12 flex-col items-center justify-center border-r border-gray-300 bg-[#0B1B30] text-xs font-semibold text-white">
                <span>EG</span>

                <span className="mt-1">🇪🇬</span>
              </div>

              <div className="flex flex-1 items-center justify-center">
                <span className="text-3xl font-bold tracking-[0.3em] text-black">
                  {numbers || "0000"}
                </span>

                <span className="mx-2 text-2xl font-bold text-gray-400">|</span>

                <span
                  dir="rtl"
                  className="text-2xl font-bold tracking-[0.2em] text-black"
                >
                  {letters || "س ج ط"}
                </span>
              </div>
            </div>
          </div>

          {/* Numbers */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0B1B30] dark:text-white">
              Plate Numbers
            </label>

            <input
              value={numbers}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");

                setNumbers(value);

                if (errors.numbers) {
                  setErrors((prev) => ({
                    ...prev,
                    numbers: undefined,
                  }));
                }
              }}
              placeholder="2594"
              inputMode="numeric"
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#0B1B30] outline-none transition placeholder:text-gray-400 dark:bg-[#111827] dark:text-white ${
                errors.numbers
                  ? "border-red-500"
                  : "border-gray-200 focus:border-[#29C5E8] dark:border-white/10"
              }`}
            />

            {errors.numbers && (
              <p className="text-sm text-red-500">{errors.numbers}</p>
            )}
          </div>

          {/* Letters */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0B1B30] dark:text-white">
              Plate Letters
            </label>

            <input
              value={letters}
              onChange={(event) => {
                const value = event.target.value.replace(/\s/g, "").slice(0, 3);

                setLetters(value);

                if (errors.letters) {
                  setErrors((prev) => ({
                    ...prev,
                    letters: undefined,
                  }));
                }
              }}
              placeholder="طجس"
              dir="rtl"
              className={`w-full rounded-xl border bg-white px-4 py-3 text-center text-lg text-[#0B1B30] outline-none transition placeholder:text-gray-400 dark:bg-[#111827] dark:text-white ${
                errors.letters
                  ? "border-red-500"
                  : "border-gray-200 focus:border-[#29C5E8] dark:border-white/10"
              }`}
            />

            {errors.letters && (
              <p className="text-sm text-red-500">{errors.letters}</p>
            )}
          </div>

          {/* Resident */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0B1B30] dark:text-white">
              Resident
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowResidents((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-[#0B1B30] transition hover:border-[#29C5E8] dark:border-white/10 dark:bg-[#111827] dark:text-white"
              >
                <span>
                  {selectedResident ? selectedResident.name : "Select resident"}
                </span>

                <span className="text-gray-400">▾</span>
              </button>

              {showResidents && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#111827]">
                  <div className="p-2">
                    <input
                      value={residentSearch}
                      onChange={(event) =>
                        setResidentSearch(event.target.value)
                      }
                      placeholder="Search resident..."
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#29C5E8] dark:border-white/10 dark:bg-[#0B1220] dark:text-white"
                    />
                  </div>

                  <div className="max-h-52 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setResidentId(undefined);

                        setShowResidents(false);

                        setResidentSearch("");
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      No resident
                    </button>

                    {filteredResidents.map((resident) => (
                      <button
                        key={resident.id}
                        type="button"
                        onClick={() => {
                          setResidentId(resident.id);

                          setShowResidents(false);

                          setResidentSearch("");
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition hover:bg-gray-50 dark:hover:bg-white/5 ${
                          resident.id === residentId
                            ? "bg-[#29C5E8]/10 text-[#29C5E8]"
                            : "text-[#0B1B30] dark:text-white"
                        }`}
                      >
                        <div className="font-medium">{resident.name}</div>

                        <div className="mt-1 text-xs text-gray-500">
                          {resident.phone}
                        </div>
                      </button>
                    ))}

                    {filteredResidents.length === 0 && (
                      <div className="px-4 py-4 text-center text-sm text-gray-500">
                        No residents found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Backend Message */}
          {backendMessage && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                backendMessageType === "error"
                  ? "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                  : "border-green-200 bg-green-50 text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400"
              }`}
            >
              {backendMessage}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-[#16324F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d4164] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : editing
                  ? "Update Plate"
                  : "Create Plate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
