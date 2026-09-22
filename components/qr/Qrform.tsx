"use client";

import { useEffect, useState } from "react";

import { QrCode, Loader2, CalendarDays } from "lucide-react";

import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { getResidents } from "@/services/resident";

// =====================================================
// TYPES
// =====================================================

type Resident = {
  id: number;
  full_name: string;
  phone_number: string;
  type: string;
  national_id?: number;
};

type QRFormProps = {
  onGenerate: (data: QRFormData) => void;
  loading: boolean;
  error: string | null;
};

export type QRFormData = {
  residentId: string;
  maxUses: number;
  visitorFullName: string;
  visitorNationalId: string;
  visitorPhoneNumber: string;
  startDate: Date | undefined;
  expiryDate: Date | undefined;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function QRForm({ onGenerate, loading, error }: QRFormProps) {
  // =====================================================
  // FORM STATES
  // =====================================================

  const [residentId, setResidentId] = useState("");

  const [maxUses, setMaxUses] = useState(1);

  const [visitorFullName, setVisitorFullName] = useState("");

  const [visitorNationalId, setVisitorNationalId] = useState("");

  const [visitorPhoneNumber, setVisitorPhoneNumber] = useState("");

  const [startDate, setStartDate] = useState<Date | undefined>();

  const [expiryDate, setExpiryDate] = useState<Date | undefined>();

  // =====================================================
  // VALIDATION STATES
  // =====================================================

  const [phoneTouched, setPhoneTouched] = useState(false);

  const [nationalIdTouched, setNationalIdTouched] = useState(false);

  // =====================================================
  // RESIDENT STATES
  // =====================================================

  const [residents, setResidents] = useState<Resident[]>([]);

  const [residentSearch, setResidentSearch] = useState("");

  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null,
  );

  const [showResidentDropdown, setShowResidentDropdown] = useState(false);

  const [loadingResidents, setLoadingResidents] = useState(false);

  // =====================================================
  // TODAY
  // =====================================================

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  // =====================================================
  // FETCH RESIDENTS
  // =====================================================

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        setLoadingResidents(true);

        const data = await getResidents(0, 100);

        setResidents(data);
      } catch (error) {
        console.error("Failed to fetch residents:", error);
      } finally {
        setLoadingResidents(false);
      }
    };

    fetchResidents();
  }, []);

  // =====================================================
  // FILTER RESIDENTS
  // =====================================================

  const filteredResidents = residents.filter((resident) =>
    resident.full_name.toLowerCase().includes(residentSearch.toLowerCase()),
  );

  // =====================================================
  // RESIDENT SEARCH
  // =====================================================

  const handleResidentSearch = (value: string) => {
    setResidentSearch(value);

    setSelectedResident(null);

    setResidentId("");

    setShowResidentDropdown(value.trim().length > 0);
  };

  // =====================================================
  // SELECT RESIDENT
  // =====================================================

  const handleResidentSelect = (resident: Resident) => {
    setSelectedResident(resident);

    setResidentId(String(resident.id));

    setResidentSearch(resident.full_name);

    setShowResidentDropdown(false);
  };

  // =====================================================
  // CLEAR RESIDENT
  // =====================================================

  const handleClearResident = () => {
    setSelectedResident(null);

    setResidentId("");

    setResidentSearch("");

    setShowResidentDropdown(false);
  };

  // =====================================================
  // MAX USES
  // =====================================================

  const handleMaxUsesChange = (value: number) => {
    if (Number.isNaN(value)) return;

    setMaxUses(Math.max(1, value));
  };

  // =====================================================
  // PHONE VALIDATION
  // =====================================================

  const isPhoneValid = /^01\d{9}$/.test(visitorPhoneNumber);

  const phoneError = (() => {
    if (!phoneTouched) return "";

    if (!visitorPhoneNumber) {
      return "Phone number is required.";
    }

    if (!/^\d+$/.test(visitorPhoneNumber)) {
      return "Phone number must contain numbers only.";
    }

    if (!visitorPhoneNumber.startsWith("01")) {
      return "Phone number must start with 01.";
    }

    if (visitorPhoneNumber.length !== 11) {
      return "Phone number must be exactly 11 digits.";
    }

    return "";
  })();

  // =====================================================
  // NATIONAL ID VALIDATION
  // =====================================================

  const isNationalIdValid = /^\d{14}$/.test(visitorNationalId);

  const nationalIdError = (() => {
    if (!nationalIdTouched) return "";

    if (!visitorNationalId) {
      return "National ID is required.";
    }

    if (!/^\d+$/.test(visitorNationalId)) {
      return "National ID must contain numbers only.";
    }

    if (visitorNationalId.length !== 14) {
      return "National ID must be exactly 14 digits.";
    }

    return "";
  })();

  // =====================================================
  // DATE HELPERS
  // =====================================================

  /**
   * When selecting a date:
   * - Keep the selected date
   * - Preserve existing time if available
   * - Otherwise use current time
   */
  const createDateWithTime = (selectedDate: Date, existingDate?: Date) => {
    const newDate = new Date(selectedDate);

    if (existingDate) {
      newDate.setHours(
        existingDate.getHours(),
        existingDate.getMinutes(),
        0,
        0,
      );
    } else {
      const now = new Date();

      newDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
    }

    return newDate;
  };

  // =====================================================
  // START DATE
  // =====================================================

  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) {
      setStartDate(undefined);
      return;
    }

    const newDate = createDateWithTime(date, startDate);

    setStartDate(newDate);

    if (expiryDate && expiryDate < newDate) {
      setExpiryDate(undefined);
    }
  };

  // =====================================================
  // START TIME
  // =====================================================

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    if (!value) return;

    const [hours, minutes] = value.split(":").map(Number);

    const newDate = startDate ? new Date(startDate) : new Date();

    newDate.setHours(hours, minutes, 0, 0);

    setStartDate(newDate);

    if (expiryDate && expiryDate < newDate) {
      setExpiryDate(undefined);
    }
  };

  // =====================================================
  // EXPIRY DATE
  // =====================================================

  const handleExpiryDateSelect = (date: Date | undefined) => {
    if (!date) {
      setExpiryDate(undefined);
      return;
    }

    const newDate = createDateWithTime(date, expiryDate);

    setExpiryDate(newDate);
  };

  // =====================================================
  // EXPIRY TIME
  // =====================================================

  const handleExpiryTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    if (!value) return;

    const [hours, minutes] = value.split(":").map(Number);

    const newDate = expiryDate ? new Date(expiryDate) : new Date();

    newDate.setHours(hours, minutes, 0, 0);

    setExpiryDate(newDate);
  };

  // =====================================================
  // DATE/TIME VALIDATION
  // =====================================================

  const isDateTimeValid = !!startDate && !!expiryDate && expiryDate > startDate;

  // =====================================================
  // FORM VALIDATION
  // =====================================================

  const isFormValid =
    residentId.trim() !== "" &&
    visitorFullName.trim() !== "" &&
    isPhoneValid &&
    isNationalIdValid &&
    !!startDate &&
    !!expiryDate &&
    isDateTimeValid;

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = () => {
    setPhoneTouched(true);

    setNationalIdTouched(true);

    if (!residentId) return;

    if (!visitorFullName.trim()) return;

    if (!isPhoneValid) return;

    if (!isNationalIdValid) return;

    if (!startDate || !expiryDate) return;

    if (expiryDate <= startDate) return;

    onGenerate({
      residentId,
      maxUses,
      visitorFullName: visitorFullName.trim(),
      visitorNationalId: visitorNationalId.trim(),
      visitorPhoneNumber: visitorPhoneNumber.trim(),
      startDate,
      expiryDate,
    });
  };

  // =====================================================
  // CALENDAR STYLES
  // =====================================================

  const calendarClassNames = {
    months: "text-foreground",

    month: "space-y-4",

    caption: "flex justify-center pt-1 relative items-center text-foreground",

    caption_label: "text-foreground text-base font-semibold",

    nav: "space-x-1 flex items-center",

    button_previous:
      "h-7 w-7 bg-transparent p-0 text-foreground hover:bg-muted rounded-md",

    button_next:
      "h-7 w-7 bg-transparent p-0 text-foreground hover:bg-muted rounded-md",

    month_grid: "w-full border-collapse",

    weekdays: "flex",

    weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",

    week: "flex w-full mt-2",

    day: `
      h-9
      w-9
      p-0
      font-normal
      text-foreground
      hover:bg-brand/20
      hover:text-foreground
      rounded-md
    `,

    day_button: `
      h-9
      w-9
      p-0
      font-normal
      text-foreground
      hover:bg-brand
      hover:text-[#132f49]
      rounded-md
    `,

    selected:
      "bg-brand text-[#132f49] hover:bg-brand hover:text-[#132f49] focus:bg-brand focus:text-[#132f49]",

    today: "bg-muted text-foreground font-bold",

    outside: "text-muted-foreground opacity-50",

    disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
  };

  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClassName = `
    w-full
    bg-background
    border
    border-border
    rounded-xl
    px-4
    py-3
    text-foreground
    placeholder:text-muted-foreground
    outline-none
    focus:border-brand
    focus:ring-2
    focus:ring-brand/10
    transition
  `;

  // =====================================================
  // DATE BUTTON CLASS
  // =====================================================

  const dateButtonClassName = `
    w-full
    flex
    items-center
    justify-between
    bg-background
    border
    border-border
    rounded-xl
    px-4
    py-3
    text-foreground
    hover:border-brand
    focus:border-brand
    transition
  `;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        bg-card
        border
        border-border
        rounded-2xl
        p-6
      "
    >
      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="
            bg-danger-soft
            border
            border-red-500/30
            text-danger
            rounded-xl
            px-4
            py-3
            text-lg
            mb-6
          "
        >
          {error}
        </div>
      )}

      {/* =====================================================
          FORM HEADER
      ===================================================== */}

      <div className="mb-6">
        <h2 className="text-foreground text-2xl font-extrabold">
          Visitor Information
        </h2>

        <p className="text-muted-foreground mt-1 text-xl">
          Enter all information to generate the QR code.
        </p>
      </div>

      {/* =====================================================
          FIELDS GRID
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-4
        "
      >
        {/* =====================================================
            RESIDENT NAME
        ===================================================== */}

        <div className="relative">
          <label className="block text-foreground text-lg font-medium mb-2">
            Resident Name
          </label>

          <div className="relative">
            <input
              type="text"
              value={residentSearch}
              onChange={(e) => handleResidentSearch(e.target.value)}
              onFocus={() => {
                if (
                  residentSearch.trim() &&
                  filteredResidents.length > 0 &&
                  !selectedResident
                ) {
                  setShowResidentDropdown(true);
                }
              }}
              placeholder="Search resident..."
              className={inputClassName}
            />

            {loadingResidents && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 size={20} className="animate-spin text-brand" />
              </div>
            )}

            {/* CLEAR SELECTED RESIDENT */}

            {selectedResident && !loadingResidents && (
              <button
                type="button"
                onClick={handleClearResident}
                className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-muted-foreground
                    hover:text-foreground
                  "
              >
                ✕
              </button>
            )}

            {/* RESIDENT DROPDOWN */}

            {showResidentDropdown &&
              !selectedResident &&
              filteredResidents.length > 0 && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-full
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
                          hover:bg-secondary
                        "
                    >
                      <div className="font-semibold">{resident.full_name}</div>

                      {resident.phone_number && (
                        <div className="text-sm text-muted-foreground">
                          {resident.phone_number}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

            {/* NO RESULTS */}

            {showResidentDropdown &&
              !selectedResident &&
              !loadingResidents &&
              residentSearch.trim() &&
              filteredResidents.length === 0 && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-full
                    z-50
                    mt-1
                    rounded-xl
                    border
                    border-border
                    bg-card
                    px-4
                    py-3
                    text-sm
                    text-muted-foreground
                    shadow-2xl
                  "
                >
                  No residents found
                </div>
              )}
          </div>

          {/* SELECTED RESIDENT */}

          {selectedResident && (
            <div
              className="
                mt-2
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-emerald-500/20
                bg-emerald-500/10
                px-3
                py-2
                text-sm
                text-emerald-600
              "
            >
              <span>✓</span>

              <span className="font-semibold">
                {selectedResident.full_name}
              </span>

              <span className="text-muted-foreground">selected</span>
            </div>
          )}
        </div>

        {/* =====================================================
            MAX USES
        ===================================================== */}

        <div>
          <label className="mb-2 block text-lg font-medium text-foreground">
            Max Uses
          </label>

          <div
            className="
              flex
              h-12
              w-full
              items-center
              overflow-hidden
              rounded-xl
              border
              border-border
              bg-background
              transition
              focus-within:border-brand
              focus-within:ring-2
              focus-within:ring-brand/10
            "
          >
            <button
              type="button"
              onClick={() => handleMaxUsesChange(maxUses - 1)}
              disabled={maxUses <= 1}
              className="
                flex
                h-full
                w-12
                shrink-0
                items-center
                justify-center
                bg-muted
                text-xl
                font-semibold
                text-foreground
                transition
                hover:bg-accent
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              −
            </button>

            <input
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) => handleMaxUsesChange(Number(e.target.value))}
              className="
                h-full
                min-w-0
                flex-1
                border-0
                bg-transparent
                px-4
                text-center
                text-base
                font-semibold
                text-foreground
                outline-none
                focus:ring-0
              "
            />

            <button
              type="button"
              onClick={() => handleMaxUsesChange(maxUses + 1)}
              className="
                flex
                h-full
                w-12
                shrink-0
                items-center
                justify-center
                bg-brand
                text-xl
                font-bold
                text-[#132f49]
                transition
                hover:bg-brand-strong
                active:scale-95
              "
            >
              +
            </button>
          </div>
        </div>

        {/* =====================================================
            VISITOR FULL NAME
        ===================================================== */}

        <div>
          <label className="block text-foreground text-lg font-medium mb-2">
            Visitor Full Name
          </label>

          <input
            type="text"
            value={visitorFullName}
            onChange={(e) => setVisitorFullName(e.target.value)}
            placeholder="Visitor Full Name"
            className={inputClassName}
          />
        </div>

        {/* =====================================================
            NATIONAL ID
        ===================================================== */}

        <div>
          <label className="block text-foreground text-lg font-medium mb-2">
            Visitor National ID
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={14}
            value={visitorNationalId}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 14);

              setVisitorNationalId(value);
            }}
            onBlur={() => setNationalIdTouched(true)}
            placeholder="National ID"
            className={`${inputClassName} ${
              nationalIdError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : ""
            }`}
          />

          {nationalIdError && (
            <p className="mt-2 text-sm text-danger">{nationalIdError}</p>
          )}
        </div>

        {/* =====================================================
            PHONE
        ===================================================== */}

        <div>
          <label className="block text-foreground text-lg font-medium mb-2">
            Visitor Phone Number
          </label>

          <input
            type="tel"
            inputMode="numeric"
            maxLength={11}
            value={visitorPhoneNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 11);

              setVisitorPhoneNumber(value);
            }}
            onBlur={() => setPhoneTouched(true)}
            placeholder="Phone Number"
            className={`${inputClassName} ${
              phoneError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : ""
            }`}
          />

          {phoneError && (
            <p className="mt-2 text-sm text-danger">{phoneError}</p>
          )}
        </div>

        {/* =====================================================
            START DATE & TIME
        ===================================================== */}

        <div>
          <label className="block text-foreground text-lg font-medium mb-2">
            Start Date & Time
          </label>

          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className={dateButtonClassName}>
                <span
                  className={
                    startDate ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {startDate
                    ? format(startDate, "dd/MM/yyyy hh:mm a")
                    : "Select start date & time"}
                </span>

                <CalendarDays size={20} className="text-brand" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="
                w-auto
                p-4
                bg-card
                border-border
                text-foreground
              "
            >
              {/* CALENDAR */}

              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateSelect}
                disabled={(date) => date < today}
                classNames={calendarClassNames}
              />

              {/* TIME */}

              <div className="mt-4 border-t border-border pt-4">
                <label className="block text-sm font-medium mb-2">
                  Start Time
                </label>

                <input
                  type="time"
                  value={startDate ? format(startDate, "HH:mm") : ""}
                  onChange={handleStartTimeChange}
                  className={inputClassName}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* =====================================================
            EXPIRY DATE & TIME
        ===================================================== */}

        <div>
          <label className="block text-foreground text-lg font-medium mb-2">
            Expiry Date & Time
          </label>

          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className={dateButtonClassName}>
                <span
                  className={
                    expiryDate ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {expiryDate
                    ? format(expiryDate, "dd/MM/yyyy hh:mm a")
                    : "Select expiry date & time"}
                </span>

                <CalendarDays size={20} className="text-brand" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="
                w-auto
                p-4
                bg-card
                border-border
                text-foreground
              "
            >
              {/* CALENDAR */}

              <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={handleExpiryDateSelect}
                disabled={(date) => {
                  if (date < today) {
                    return true;
                  }

                  if (startDate) {
                    const startDay = new Date(startDate);

                    startDay.setHours(0, 0, 0, 0);

                    if (date < startDay) {
                      return true;
                    }
                  }

                  return false;
                }}
                classNames={calendarClassNames}
              />

              {/* TIME */}

              <div className="mt-4 border-t border-border pt-4">
                <label className="block text-sm font-medium mb-2">
                  Expiry Time
                </label>

                <input
                  type="time"
                  value={expiryDate ? format(expiryDate, "HH:mm") : ""}
                  min={
                    startDate &&
                    expiryDate &&
                    startDate.toDateString() === expiryDate.toDateString()
                      ? format(startDate, "HH:mm")
                      : undefined
                  }
                  onChange={handleExpiryTimeChange}
                  className={`${inputClassName} ${
                    expiryDate && startDate && expiryDate <= startDate
                      ? "border-red-500"
                      : ""
                  }`}
                />

                {expiryDate && startDate && expiryDate <= startDate && (
                  <p className="mt-2 text-sm text-danger">
                    Expiry date and time must be after the start date and time.
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* =====================================================
          GENERATE BUTTON
      ===================================================== */}

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          className="
            flex
            items-center
            justify-center
            gap-2
            bg-brand
            hover:bg-brand-strong
            active:bg-brand-strong
            disabled:opacity-60
            disabled:cursor-not-allowed
            text-[#132f49]
            px-7
            py-3
            rounded-xl
            shadow-xl
            text-lg
            shadow-brand/20
            transition
            font-bold
          "
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <QrCode size={18} />
              Generate QR
            </>
          )}
        </button>
      </div>
    </div>
  );
}
