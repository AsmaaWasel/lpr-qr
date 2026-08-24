"use client";

import { useState } from "react";
import { QrCode, Loader2, CalendarDays } from "lucide-react";
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

type QRFormProps = {
  onGenerate: (data: QRFormData) => void;
  loading: boolean;
  error: string | null;
};

export type QRFormData = {
  buildingNumber: string;
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

  const [buildingNumber, setBuildingNumber] = useState("");
  const [residentId, setResidentId] = useState("");
  const [maxUses, setMaxUses] = useState(1);
  const [visitorFullName, setVisitorFullName] = useState("");
  const [visitorNationalId, setVisitorNationalId] = useState("");
  const [visitorPhoneNumber, setVisitorPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();

  // =====================================================
  // TODAY
  // =====================================================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleMaxUsesChange = (value: number) => {
    if (Number.isNaN(value)) return;

    setMaxUses(Math.max(1, value));
  };

  const handleSubmit = () => {
    onGenerate({
      buildingNumber,
      residentId,
      maxUses,
      visitorFullName,
      visitorNationalId,
      visitorPhoneNumber,
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* =====================================================
            BUILDING NUMBER
        ===================================================== */}

        <div>
          <label className="block text-foreground text-lg font-medium mb-2">
            Building Number
          </label>

          <input
            type="text"
            value={buildingNumber}
            onChange={(e) => setBuildingNumber(e.target.value)}
            placeholder="Building Number"
            className={inputClassName}
          />
        </div>

        {/* =====================================================
            RESIDENT ID
        ===================================================== */}

        <div>
          <label className="block text-foreground text-lg font-medium mb-2">
            Resident ID
          </label>

          <input
            type="number"
            value={residentId}
            onChange={(e) => setResidentId(e.target.value)}
            placeholder="Resident ID"
            className={inputClassName}
          />
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
            {/* Minus */}

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

            {/* Input */}

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

            {/* Plus */}

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
            value={visitorNationalId}
            onChange={(e) => setVisitorNationalId(e.target.value)}
            placeholder="National ID"
            className={inputClassName}
          />
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
            value={visitorPhoneNumber}
            onChange={(e) => setVisitorPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className={inputClassName}
          />
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
                  if (date < today) return true;

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
      </div>

      {/* =====================================================
          GENERATE BUTTON
      ===================================================== */}

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
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
