"use client";

import { useState } from "react";

import { QrCode, Loader2, CalendarDays, Clock } from "lucide-react";

import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// =====================================================
// TYPES
// =====================================================

export type QRResidentFormData = {
  max_uses: number;
  start_at: string;
  expiry_date: string;
  visitor_national_id: string;
  visitor_phone_number: string;
  visitor_full_name: string;
};

type QRResidentFormProps = {
  onGenerate: (data: QRResidentFormData) => Promise<void> | void;
  loading: boolean;
  error: string | null;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function QRResidentForm({
  onGenerate,
  loading,
  error,
}: QRResidentFormProps) {
  // =====================================================
  // FORM STATES
  // =====================================================

  const [maxUses, setMaxUses] = useState(1);

  const [visitorFullName, setVisitorFullName] = useState("");

  const [visitorNationalId, setVisitorNationalId] = useState("");

  const [visitorPhoneNumber, setVisitorPhoneNumber] = useState("");

  const [startDate, setStartDate] = useState<Date | undefined>();

  const [expiryDate, setExpiryDate] = useState<Date | undefined>();

  const [startTime, setStartTime] = useState("00:00");

  const [expiryTime, setExpiryTime] = useState("23:59");

  // =====================================================
  // VALIDATION STATES
  // =====================================================

  const [phoneTouched, setPhoneTouched] = useState(false);

  const [nationalIdTouched, setNationalIdTouched] = useState(false);

  // =====================================================
  // TODAY
  // =====================================================

  const today = new Date();

  today.setHours(0, 0, 0, 0);

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
  // COMBINE DATE + TIME
  // =====================================================

  const combineDateAndTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);

    const result = new Date(date);

    result.setHours(hours, minutes, 0, 0);

    return result;
  };

  // =====================================================
  // DATE/TIME VALIDATION
  // =====================================================

  const isDateTimeValid = () => {
    if (!startDate || !expiryDate) return false;

    const startDateTime = combineDateAndTime(startDate, startTime);

    const expiryDateTime = combineDateAndTime(expiryDate, expiryTime);

    return expiryDateTime > startDateTime;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async () => {
    setPhoneTouched(true);
    setNationalIdTouched(true);

    if (!visitorFullName.trim()) return;

    if (!isPhoneValid) return;

    if (!isNationalIdValid) return;

    if (!startDate || !expiryDate) return;

    const startDateTime = combineDateAndTime(startDate, startTime);

    const expiryDateTime = combineDateAndTime(expiryDate, expiryTime);

    if (expiryDateTime <= startDateTime) {
      return;
    }

    const data: QRResidentFormData = {
      max_uses: maxUses,

      start_at: startDateTime.toISOString(),

      expiry_date: expiryDateTime.toISOString(),

      visitor_national_id: visitorNationalId.trim(),

      visitor_phone_number: visitorPhoneNumber.trim(),

      visitor_full_name: visitorFullName.trim(),
    };

    await onGenerate(data);
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
  // TIME INPUT CLASS
  // =====================================================

  const timeInputClassName = `
    w-full
    bg-background
    border
    border-border
    rounded-xl
    px-4
    py-3
    text-foreground
    outline-none
    focus:border-brand
    focus:ring-2
    focus:ring-brand/10
    transition
    [color-scheme:light]
    dark:[color-scheme:dark]
  `;

  // =====================================================
  // EXPIRY TIME VALIDATION
  // =====================================================

  const expiryTimeIsInvalid =
    startDate &&
    expiryDate &&
    startDate.toDateString() === expiryDate.toDateString() &&
    expiryTime <= startTime;

  // =====================================================
  // FORM VALID
  // =====================================================

  const isFormValid =
    visitorFullName.trim() !== "" &&
    isPhoneValid &&
    isNationalIdValid &&
    !!startDate &&
    !!expiryDate &&
    isDateTimeValid();

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
          HEADER
      ===================================================== */}

      <div className="mb-6">
        <h2 className="text-foreground text-2xl font-extrabold">
          Visitor Information
        </h2>

        <p className="text-muted-foreground mt-1 text-xl">
          Enter visitor information to generate a QR code.
        </p>
      </div>

      {/* =====================================================
          FIELDS
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
            START DATE
        ===================================================== */}

        <div>
          <label className="block text-foreground text-lg font-medium mb-2">
            Start Date
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
                    ? format(startDate, "dd/MM/yyyy")
                    : "Select start date"}
                </span>

                <CalendarDays size={20} className="text-brand" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="
                w-auto
                p-0
                bg-card
                border-border
                text-foreground
              "
            >
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);

                  if (date && expiryDate && expiryDate < date) {
                    setExpiryDate(undefined);
                  }
                }}
                disabled={(date) => date < today}
                classNames={calendarClassNames}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* =====================================================
            START TIME
        ===================================================== */}

        <div>
          <label className="block text-foreground text-lg font-medium mb-2">
            Start Time
          </label>

          <div className="relative">
            <input
              type="time"
              value={startTime}
              onChange={(e) => {
                const newTime = e.target.value;

                setStartTime(newTime);

                if (
                  startDate &&
                  expiryDate &&
                  startDate.toDateString() === expiryDate.toDateString() &&
                  newTime >= expiryTime
                ) {
                  setExpiryTime(newTime);
                }
              }}
              className={timeInputClassName}
            />

            <Clock
              size={20}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-brand
                pointer-events-none
              "
            />
          </div>
        </div>

        {/* =====================================================
            EXPIRY DATE
        ===================================================== */}

        <div>
          <label className="block text-foreground text-lg font-medium mb-2">
            Expiry Date
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
                    ? format(expiryDate, "dd/MM/yyyy")
                    : "Select expiry date"}
                </span>

                <CalendarDays size={20} className="text-brand" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="
                w-auto
                p-0
                bg-card
                border-border
                text-foreground
              "
            >
              <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={setExpiryDate}
                disabled={(date) => {
                  if (date < today) {
                    return true;
                  }

                  if (startDate && date < startDate) {
                    return true;
                  }

                  return false;
                }}
                classNames={calendarClassNames}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* =====================================================
            EXPIRY TIME
        ===================================================== */}

        <div>
          <label className="block text-foreground text-lg font-medium mb-2">
            Expiry Time
          </label>

          <div className="relative">
            <input
              type="time"
              value={expiryTime}
              min={
                startDate &&
                expiryDate &&
                startDate.toDateString() === expiryDate.toDateString()
                  ? startTime
                  : undefined
              }
              onChange={(e) => setExpiryTime(e.target.value)}
              className={`${timeInputClassName} ${
                expiryTimeIsInvalid
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  : ""
              }`}
            />

            <Clock
              size={20}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-brand
                pointer-events-none
              "
            />
          </div>

          {expiryTimeIsInvalid && (
            <p className="mt-2 text-sm text-danger">
              Expiry time must be after the start time.
            </p>
          )}
        </div>
      </div>

      {/* =====================================================
          DATE/TIME SUMMARY
      ===================================================== */}

      {startDate && expiryDate && (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-border
            bg-muted/40
            px-4
            py-3
          "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Start */}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Starts</p>

              <p className="text-foreground font-semibold">
                {format(startDate, "dd/MM/yyyy")} {startTime}
              </p>
            </div>

            {/* Expiry */}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Expires</p>

              <p className="text-foreground font-semibold">
                {format(expiryDate, "dd/MM/yyyy")} {expiryTime}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          GENERATE
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
