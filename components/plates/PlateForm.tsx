"use client";

import { useState, useEffect, useRef } from "react";
import { getResidents } from "@/services/resident";

type Props = {
  onSubmit: (data: { plate_number_full: string; resident_id?: number }) => void;

  editing?: {
    id: number;
    plate_number_full: string;
    resident_id?: number;
  } | null;

  onClose: () => void;
};

type Resident = {
  id: number;
  full_name: string;
  phone_number: string;
  type: string;
  national_id?: number;
};

export default function PlateForm({ onSubmit, editing, onClose }: Props) {
  const initial = (() => {
    const plate = editing?.plate_number_full ?? "";

    const cleaned = plate.replace(/\s/g, "");

    return {
      numbers: cleaned.match(/^\d+/)?.[0] || "",
      letters: cleaned.replace(/^\d+/, ""),
      resident_id: editing?.resident_id ?? undefined,
      resident_name: "",
    };
  })();

  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  // Resident search states
  const [searchTerm, setSearchTerm] = useState("");
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null,
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load residents on mount
  useEffect(() => {
    const loadResidents = async () => {
      try {
        setLoadingResidents(true);
        const data = await getResidents(0, 100);
        setResidents(data);

        // If editing and has resident_id, find and set the resident
        if (editing?.resident_id) {
          const found = data.find(
            (r: Resident) => r.id === editing.resident_id,
          );
          if (found) {
            setSelectedResident(found);
            setSearchTerm(found.full_name);
            setForm((prev) => ({
              ...prev,
              resident_id: found.id,
              resident_name: found.full_name,
            }));
          }
        }
      } catch (error) {
        console.error("Error loading residents:", error);
      } finally {
        setLoadingResidents(false);
      }
    };

    loadResidents();
  }, [editing]);

  // Filter residents based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredResidents([]);
      setShowDropdown(false);
      return;
    }

    const filtered = residents.filter((resident) =>
      resident.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredResidents(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchTerm, residents]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNumbersChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    setForm((prev) => ({
      ...prev,
      numbers: cleaned,
    }));

    setError("");
  };

  const handleLettersChange = (value: string) => {
    const cleaned = value
      .replace(/\s/g, "")
      .replace(/[^A-Za-z\u0600-\u06FF]/g, "");

    setForm((prev) => ({
      ...prev,
      letters: cleaned,
    }));

    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const handleResidentSelect = (resident: Resident) => {
    setSelectedResident(resident);
    setSearchTerm(resident.full_name);
    setForm((prev) => ({
      ...prev,
      resident_id: resident.id,
      resident_name: resident.full_name,
    }));
    setShowDropdown(false);
    setError("");
  };

  const handleResidentSearch = (value: string) => {
    setSearchTerm(value);
    setForm((prev) => ({
      ...prev,
      resident_id: undefined,
      resident_name: value,
    }));

    // If search is cleared, clear selected resident
    if (value.trim() === "") {
      setSelectedResident(null);
    }
  };

  const validate = () => {
    if (!form.letters) {
      setError("Plate letters are required");
      return false;
    }

    if (!form.numbers) {
      setError("Plate numbers are required");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData: { plate_number_full: string; resident_id?: number } = {
      plate_number_full: form.numbers + form.letters,
    };

    // Only send resident_id if a resident is selected
    if (form.resident_id) {
      submitData.resident_id = form.resident_id;
    }

    onSubmit(submitData);
  };

  const previewLetters = form.letters
    ? form.letters.split("").reverse().join(" ")
    : "س ج ط";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {editing ? "Edit Plate" : "Add Plate"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage vehicle plate information
          </p>
        </div>

        <div className="space-y-4">
          {/* RESIDENT NAME - Autocomplete */}
          <div className="space-y-2" ref={dropdownRef}>
            <label className="text-sm text-muted-foreground">Resident Name</label>

            <div className="relative">
              <input
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => handleResidentSearch(e.target.value)}
                onFocus={() => {
                  if (
                    searchTerm.trim() !== "" &&
                    filteredResidents.length > 0
                  ) {
                    setShowDropdown(true);
                  }
                }}
                placeholder="Search for resident..."
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition focus:border-brand"
              />

              {loadingResidents && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent"></div>
                </div>
              )}

              {/* Dropdown */}
              {showDropdown && filteredResidents.length > 0 && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-secondary shadow-2xl">
                  {filteredResidents.map((resident) => (
                    <button
                      key={resident.id}
                      onClick={() => handleResidentSelect(resident)}
                      className="w-full px-4 py-3 text-left text-foreground transition hover:bg-secondary"
                    >
                      <div className="font-medium">{resident.full_name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedResident && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-ok border border-emerald-500/20">
                <span>✅ Selected:</span>
                <span className="font-medium">
                  {selectedResident.full_name}
                </span>
                <span className="text-muted-foreground">
                  (ID: {selectedResident.id})
                </span>
                <button
                  onClick={() => {
                    setSelectedResident(null);
                    setSearchTerm("");
                    setForm((prev) => ({
                      ...prev,
                      resident_id: undefined,
                      resident_name: "",
                    }));
                  }}
                  className="ml-auto text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* LETTERS FIRST */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Plate Letters</label>

            <input
              dir="rtl"
              value={form.letters.split("").join(" ")}
              onChange={(e) => handleLettersChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ط ج س"
              className={`w-full rounded-xl border px-4 py-3 bg-card text-foreground outline-none transition
              ${
                error
                  ? "border-red-500"
                  : "border-border focus:border-brand"
              }`}
            />
          </div>

          {/* NUMBERS SECOND */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Plate Numbers</label>

            <input
              dir="ltr"
              inputMode="numeric"
              value={form.numbers}
              onChange={(e) => handleNumbersChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="2594"
              className={`w-full rounded-xl border px-4 py-3 bg-card text-foreground outline-none transition
              ${
                error
                  ? "border-red-500"
                  : "border-border focus:border-brand"
              }`}
            />
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          {/* PREVIEW */}
          <div className="pt-6">
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              Live Plate Preview
            </p>

            <div className="mx-auto w-full max-w-md">
              <div
                className="
        relative
        overflow-hidden
        rounded-[10px]
        border-[3px]
        border-black
       bg-[#0057A8]
        shadow-[0_8px_20px_rgba(0,0,0,0.35)]
      "
                style={{ aspectRatio: "4.7 / 1" }}
              >
                <div className="flex h-full flex-col">
                  {/* Top: Egypt bar (blue) */}
                  <div
                    className="
            flex
            h-[34%]
            w-full
            items-center
            justify-center
            gap-2
            border-b-[3px]
            border-black
            bg-[#0057A8]
            text-foreground
          "
                  >
                    <span
                      dir="rtl"
                      className="text-base font-black leading-none"
                    >
                      مصر
                    </span>

                    <div
                      className="h-3 w-6 shrink-0 rounded-[1px] shadow-sm"
                      style={{
                        background:
                          "linear-gradient(to bottom,#CE1126 33%,white 33%,white 66%,black 66%)",
                      }}
                    />

                    <span className="text-xs font-bold tracking-widest leading-none">
                      EGYPT
                    </span>
                  </div>

                  {/* Bottom: Numbers (left) | Letters (right) */}
                  <div className="flex flex-1 items-stretch bg-card">
                    {/* Numbers */}
                    <div
                      className="
              flex
              flex-1
              items-center
              justify-center
              border-r-[3px]
              border-black
            "
                    >
                      <span
                        dir="ltr"
                        className="
                text-[clamp(28px,9vw,52px)]
                leading-none
                font-black
                tracking-wider
                text-black
              "
                      >
                        {form.numbers || "2594"}
                      </span>
                    </div>

                    {/* Letters */}
                    <div
                      className="
              flex
              flex-1
              items-center
              justify-center
            "
                    >
                      <span
                        dir="rtl"
                        className="
                text-[clamp(28px,9vw,52px)]
                leading-none
                font-black
                tracking-wider
                text-black
              "
                      >
                        {previewLetters}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metal bottom strip */}
                <div
                  className="absolute bottom-0 left-0 h-1.5 w-full"
                  style={{
                    background: "linear-gradient(90deg,#777,#ddd,#777)",
                  }}
                />

                {/* corner screws */}
                <div className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-400/70" />
                <div className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-400/70" />
                <div className="absolute left-1.5 bottom-1.5 h-1.5 w-1.5 rounded-full bg-slate-400/70" />
                <div className="absolute right-1.5 bottom-1.5 h-1.5 w-1.5 rounded-full bg-slate-400/70" />
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-card px-4 py-2 text-muted-foreground hover:bg-secondary"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-brand px-5 py-2 text-foreground hover:bg-brand"
          >
            {editing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
