"use client";

import { useEffect, useRef, useState } from "react";
import { getResidents } from "@/services/resident";

type Props = {
  onSubmit: (data: {
    plate_number_full: string;
    resident_id?: number;
  }) => void | Promise<void>;

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

type FormErrors = {
  letters?: string;
  numbers?: string;
  resident_id?: string;
};

export default function PlateForm({ editing, onClose, onSubmit }: Props) {
  // ================= INITIAL FORM =================

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

  const [errors, setErrors] = useState<FormErrors>({});

  // ================= RESIDENTS =================

  const [searchTerm, setSearchTerm] = useState("");
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null,
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ================= FETCH RESIDENTS =================

  useEffect(() => {
    const loadResidents = async () => {
      try {
        setLoadingResidents(true);

        const data = await getResidents(0, 100);

        setResidents(data);

        if (editing?.resident_id) {
          const found = data.find(
            (resident: Resident) => resident.id === editing.resident_id,
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
        console.error("Failed to load residents:", error);
      } finally {
        setLoadingResidents(false);
      }
    };

    loadResidents();
  }, [editing]);

  // ================= FILTER RESIDENTS =================

  useEffect(() => {
    let cancelled = false;

    const loadResidents = async () => {
      try {
        const data = await getResidents(0, 100);

        if (cancelled) return;

        setResidents(data);

        if (editing?.resident_id) {
          const found = data.find(
            (resident: Resident) => resident.id === editing.resident_id,
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
        if (!cancelled) {
          console.error("Error loading residents:", error);
        }
      }
    };

    loadResidents();

    return () => {
      cancelled = true;
    };
  }, [editing]);

  // ================= CLOSE DROPDOWN =================

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

  // ================= CHANGE FIELD =================

  const handleChange = (field: "numbers" | "letters", value: string) => {
    if (field === "numbers") {
      const cleaned = value.replace(/\D/g, "");

      setForm((prev) => ({
        ...prev,
        numbers: cleaned,
      }));
    }

    if (field === "letters") {
      const cleaned = value
        .replace(/\s/g, "")
        .replace(/[^A-Za-z\u0600-\u06FF]/g, "");

      setForm((prev) => ({
        ...prev,
        letters: cleaned,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  // ================= RESIDENT SEARCH =================

  const handleResidentSearch = (value: string) => {
    setSearchTerm(value);

    setForm((prev) => ({
      ...prev,
      resident_id: undefined,
      resident_name: value,
    }));

    setSelectedResident(null);

    if (value.trim() === "") {
      setShowDropdown(false);
    }
  };

  // ================= SELECT RESIDENT =================

  const handleResidentSelect = (resident: Resident) => {
    setSelectedResident(resident);

    setSearchTerm(resident.full_name);

    setForm((prev) => ({
      ...prev,
      resident_id: resident.id,
      resident_name: resident.full_name,
    }));

    setShowDropdown(false);

    setErrors((prev) => ({
      ...prev,
      resident_id: undefined,
    }));
  };

  // ================= VALIDATION =================

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.numbers.trim()) {
      newErrors.numbers = "Plate numbers are required";
    } else if (form.numbers.length < 1) {
      newErrors.numbers = "Please enter valid plate numbers";
    }

    if (!form.letters.trim()) {
      newErrors.letters = "Plate letters are required";
    }

    return newErrors;
  };

  // ================= SAVE =================

  const handleSave = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitData: {
      plate_number_full: string;
      resident_id?: number;
    } = {
      plate_number_full: form.numbers + form.letters,
    };

    if (form.resident_id) {
      submitData.resident_id = form.resident_id;
    }

    await onSubmit(submitData);
  };

  // ================= PREVIEW =================

  const previewLetters = form.letters
    ? form.letters.split("").reverse().join(" ")
    : "س ج ط";

  // ================= STYLES =================

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

  const errorClassName = "mt-1 text-sm font-medium text-red-500";

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
              {editing ? "Edit Plate" : "Add Plate"}
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {editing
                ? "Update vehicle plate information"
                : "Add a new vehicle plate and assign it to a resident"}
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

        {/* ================= FORM ================= */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* ================= RESIDENT ================= */}

          <div ref={dropdownRef} className="relative space-y-1.5 md:col-span-2">
            <label className="block text-base font-semibold text-foreground">
              Resident
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="Search for resident..."
                value={searchTerm}
                onChange={(e) => handleResidentSearch(e.target.value)}
                onFocus={() => {
                  if (searchTerm.trim() && filteredResidents.length > 0) {
                    setShowDropdown(true);
                  }
                }}
                className={`
                  ${inputClassName}
                  ${
                    errors.resident_id
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                `}
              />

              {loadingResidents && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div
                    className="
                      h-5
                      w-5
                      animate-spin
                      rounded-full
                      border-2
                      border-[#132f49]
                      border-t-transparent
                    "
                  />
                </div>
              )}

              {/* ================= DROPDOWN ================= */}

              {showDropdown && filteredResidents.length > 0 && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    z-50
                    mt-1
                    max-h-60
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
                        hover:bg-muted
                      "
                    >
                      <div className="font-medium">{resident.full_name}</div>

                      <div className="mt-0.5 text-sm text-muted-foreground">
                        ID: {resident.id}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ================= SELECTED RESIDENT ================= */}

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
                  text-emerald-600
                  dark:text-emerald-400
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

            {errors.resident_id && (
              <p className={errorClassName}>{errors.resident_id}</p>
            )}
          </div>

          {/* ================= PLATE LETTERS ================= */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Plate Letters
            </label>

            <input
              type="text"
              dir="rtl"
              value={form.letters.split("").join(" ")}
              onChange={(e) => handleChange("letters", e.target.value)}
              placeholder="ط ج س"
              className={`
                ${inputClassName}
                ${errors.letters ? "border-red-500 focus:border-red-500" : ""}
              `}
            />

            {errors.letters && (
              <p className={errorClassName}>{errors.letters}</p>
            )}
          </div>

          {/* ================= PLATE NUMBERS ================= */}

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-foreground">
              Plate Numbers
            </label>

            <input
              type="text"
              dir="ltr"
              inputMode="numeric"
              value={form.numbers}
              onChange={(e) => handleChange("numbers", e.target.value)}
              placeholder="2594"
              className={`
                ${inputClassName}
                ${errors.numbers ? "border-red-500 focus:border-red-500" : ""}
              `}
            />

            {errors.numbers && (
              <p className={errorClassName}>{errors.numbers}</p>
            )}
          </div>

          {/* ================= PREVIEW ================= */}

          <div
            className="
              md:col-span-2
              rounded-2xl
              border
              border-border
              bg-muted/30
              p-5
            "
          >
            <div className="mb-4">
              <h3 className="text-base font-bold text-foreground">
                Live Plate Preview
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Preview how the vehicle plate will look
              </p>
            </div>

            <div className="flex justify-center">
              <div
                className="
                  relative
                  w-full
                  max-w-2xl
                  overflow-hidden
                  rounded-[10px]
                  border-[3px]
                  border-black
                  bg-[#0057A8]
                  shadow-[0_8px_20px_rgba(0,0,0,0.25)]
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

        {/* ================= ACTIONS ================= */}

        <div className="mt-7 flex justify-end gap-3 border-t border-border pt-5">
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
            {editing ? "Update Plate" : "Save Plate"}
          </button>
        </div>
      </div>
    </div>
  );
}
