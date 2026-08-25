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
  // =========================
  // INITIAL FORM
  // =========================

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

  // =========================
  // RESIDENT SEARCH
  // =========================

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

  // =========================
  // LOAD RESIDENTS
  // =========================

  useEffect(() => {
    const loadResidents = async () => {
      try {
        setLoadingResidents(true);

        const data = await getResidents(0, 100);

        setResidents(data);

        // If editing and has resident_id
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

  // =========================
  // FILTER RESIDENTS
  // =========================

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

  // =========================
  // CLOSE DROPDOWN OUTSIDE
  // =========================

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // NUMBERS CHANGE
  // =========================

  const handleNumbersChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    setForm((prev) => ({
      ...prev,
      numbers: cleaned,
    }));

    setError("");
  };

  // =========================
  // LETTERS CHANGE
  // =========================

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

  // =========================
  // PREVENT SPACE
  // =========================

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  // =========================
  // SELECT RESIDENT
  // =========================

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

  // =========================
  // RESIDENT SEARCH
  // =========================

  const handleResidentSearch = (value: string) => {
    setSearchTerm(value);

    setForm((prev) => ({
      ...prev,
      resident_id: undefined,
      resident_name: value,
    }));

    if (value.trim() === "") {
      setSelectedResident(null);
    }
  };

  // =========================
  // VALIDATE
  // =========================

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

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData: {
      plate_number_full: string;
      resident_id?: number;
    } = {
      plate_number_full: form.numbers + form.letters,
    };

    // Only send resident_id if selected
    if (form.resident_id) {
      submitData.resident_id = form.resident_id;
    }

    onSubmit(submitData);
  };

  // =========================
  // PREVIEW
  // =========================

  const previewLetters = form.letters
    ? form.letters.split("").reverse().join(" ")
    : "س ج ط";

  // =========================
  // RENDER
  // =========================

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-5xl
          max-h-[92vh]
          overflow-y-auto
          rounded-3xl
          border
          border-border
          bg-card
          p-7
          shadow-2xl
        "
      >
        {/* ================= HEADER ================= */}

        <div
          className="
            mb-7
            flex
            items-start
            justify-between
            border-b
            border-border
            pb-5
          "
        >
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {editing ? "Edit Plate" : "Add Plate"}
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Manage vehicle plate information
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
            ✕
          </button>
        </div>

        {/* ================= MAIN CONTENT ================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-[1fr_420px]
          "
        >
          {/* ================= LEFT SIDE ================= */}

          <div className="space-y-5">
            {/* Resident */}

            <div className="space-y-2" ref={dropdownRef}>
              <label className="block text-sm font-semibold text-foreground">
                Resident Name
              </label>

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
                  className="
                    h-12
                    w-full
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
                    focus:border-brand
                    focus:ring-2
                    focus:ring-brand/10
                  "
                />

                {loadingResidents && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div
                      className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-brand
                        border-t-transparent
                      "
                    />
                  </div>
                )}

                {/* Dropdown */}

                {showDropdown && filteredResidents.length > 0 && (
                  <div
                    className="
                        absolute
                        z-50
                        mt-1
                        max-h-60
                        w-full
                        overflow-y-auto
                        rounded-xl
                        border
                        border-border
                        bg-card
                        shadow-2xl
                      "
                  >
                    {filteredResidents.map((resident) => (
                      <button
                        key={resident.id}
                        type="button"
                        onClick={() => handleResidentSelect(resident)}
                        className="
                            w-full
                            px-4
                            py-3
                            text-left
                            text-foreground
                            transition
                            hover:bg-secondary
                          "
                      >
                        <div className="font-medium">{resident.full_name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Resident */}

              {selectedResident && (
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-emerald-500/20
                    bg-emerald-500/10
                    px-3
                    py-2.5
                    text-sm
                    text-ok
                  "
                >
                  <span>✓ Selected:</span>

                  <span className="font-semibold">
                    {selectedResident.full_name}
                  </span>

                  <span className="text-muted-foreground">
                    (ID: {selectedResident.id})
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedResident(null);
                      setSearchTerm("");

                      setForm((prev) => ({
                        ...prev,
                        resident_id: undefined,
                        resident_name: "",
                      }));
                    }}
                    className="
                      ml-auto
                      text-muted-foreground
                      hover:text-foreground
                    "
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* ================= PLATE INPUTS ================= */}

            <div
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
              "
            >
              {/* Letters */}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Plate Letters
                </label>

                <input
                  dir="rtl"
                  value={form.letters.split("").join(" ")}
                  onChange={(e) => handleLettersChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="ط ج س"
                  className={`
                    h-12
                    w-full
                    rounded-xl
                    border
                    bg-background
                    px-4
                    text-base
                    font-medium
                    text-foreground
                    outline-none
                    transition
                    ${
                      error
                        ? "border-red-500"
                        : "border-border focus:border-brand"
                    }
                  `}
                />
              </div>

              {/* Numbers */}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Plate Numbers
                </label>

                <input
                  dir="ltr"
                  inputMode="numeric"
                  value={form.numbers}
                  onChange={(e) => handleNumbersChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="2594"
                  className={`
                    h-12
                    w-full
                    rounded-xl
                    border
                    bg-background
                    px-4
                    text-base
                    font-medium
                    text-foreground
                    outline-none
                    transition
                    ${
                      error
                        ? "border-red-500"
                        : "border-border focus:border-brand"
                    }
                  `}
                />
              </div>
            </div>

            {/* Error */}

            {error && (
              <p className="text-sm font-medium text-danger">{error}</p>
            )}
          </div>

          {/* ================= RIGHT SIDE - PREVIEW ================= */}

          <div
            className="
              flex
              flex-col
              rounded-2xl
              border
              border-border
              bg-muted/30
              p-6
            "
          >
            <div className="mb-5">
              <h3 className="text-base font-bold text-foreground">
                Live Plate Preview
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Preview how the vehicle plate will look
              </p>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="w-full">
                {/* ================= PLATE ================= */}

                <div
                  className="
                    relative
                    mx-auto
                    w-full
                    overflow-hidden
                    rounded-[10px]
                    border-[3px]
                    border-black
                    bg-[#0057A8]
                    shadow-[0_8px_20px_rgba(0,0,0,0.35)]
                  "
                  style={{
                    aspectRatio: "4.7 / 1",
                  }}
                >
                  <div className="flex h-full flex-col">
                    {/* Egypt Bar */}

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
                      "
                    >
                      <span
                        dir="rtl"
                        className="
                          text-base
                          font-black
                          leading-none
                          text-white
                        "
                      >
                        مصر
                      </span>

                      <div
                        className="
                          h-3
                          w-6
                          shrink-0
                          rounded-[1px]
                          shadow-sm
                        "
                        style={{
                          background:
                            "linear-gradient(to bottom,#CE1126 33%,white 33%,white 66%,black 66%)",
                        }}
                      />

                      <span
                        className="
                          text-xs
                          font-bold
                          tracking-widest
                          leading-none
                          text-white
                        "
                      >
                        EGYPT
                      </span>
                    </div>

                    {/* Plate Content */}

                    <div className="flex flex-1 items-stretch bg-white">
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
                            text-[clamp(28px,5vw,52px)]
                            font-black
                            leading-none
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
                            text-[clamp(28px,5vw,52px)]
                            font-black
                            leading-none
                            tracking-wider
                            text-black
                          "
                        >
                          {previewLetters}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metal Strip */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-1.5
                      w-full
                    "
                    style={{
                      background: "linear-gradient(90deg,#777,#ddd,#777)",
                    }}
                  />

                  {/* Screws */}

                  <div className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-400/70" />

                  <div className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-400/70" />

                  <div className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-slate-400/70" />

                  <div className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-slate-400/70" />
                </div>
              </div>
            </div>
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
              bg-muted
              px-6
              py-2.5
              text-sm
              font-semibold
              text-muted-foreground
              transition
              hover:bg-secondary
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
              bg-brand
              px-7
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-brand-strong
              active:scale-[0.98]
            "
          >
            {editing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
