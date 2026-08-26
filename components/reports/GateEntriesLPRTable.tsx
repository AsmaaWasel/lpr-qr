"use client";

import {
  Car,
  User,
  DoorOpen,
  Calendar,
  Image as ImageIcon,
  Hash,
  QrCode,
} from "lucide-react";

type Resident = {
  id: number;
  full_name: string;
};

type GateEntry = {
  id: number;
  entry_type: "entry" | "exit" | "ENTRY" | "EXIT";
  entry_by: "resident" | "plate" | "manual" | "qr" | "QR" | "PLATE" | "MANUAL";
  entry_by_table_id: number | null;
  image_url: string | null;
  plate_number: string | null;
  resident_id: number | null;
  gate_id: number;
  created_at: string;
  resident: Resident | null;
};

type Props = {
  data: GateEntry[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onImageClick: (url: string) => void;
};

export default function GateEntriesTable({
  data,
  selectedId,
  onSelect,
  onImageClick,
}: Props) {
  // =========================
  // Helpers
  // =========================

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEntryTypeBadge = (type: GateEntry["entry_type"]) => {
    const isEntry = type.toLowerCase() === "entry";

    return (
      <span
        className={`
          inline-flex
          items-center
          gap-1.5
          rounded-full
          px-3
          py-1
        text-[20px]
         font-[600]
          ${
            isEntry
              ? "bg-emerald-50 text-ok dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-red-50 text-danger dark:bg-red-500/10 dark:text-red-400"
          }
        `}
      >
        <DoorOpen className="h-3.5 w-3.5" />
        {isEntry ? "ENTRY" : "EXIT"}
      </span>
    );
  };

  const getEntryByBadge = (method: GateEntry["entry_by"]) => {
    const normalized = method.toLowerCase();

    if (normalized === "plate") {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-purple-50
            px-3
            py-1
          text-[20px]
           font-[600]
            text-purple-600
            dark:bg-purple-500/10
            dark:text-purple-400
          "
        >
          <Car className="h-3.5 w-3.5" />
          Plate
        </span>
      );
    }

    if (normalized === "qr") {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-blue-50
            px-3
            py-1
          text-[20px]
           font-[600]
            text-blue-600
            dark:bg-blue-500/10
            dark:text-blue-400
          "
        >
          <QrCode className="h-3.5 w-3.5" />
          QR Code
        </span>
      );
    }

    if (normalized === "resident") {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-emerald-50
            px-3
            py-1
          text-[20px]
           font-[600]
            text-emerald-600
            dark:bg-emerald-500/10
            dark:text-emerald-400
          "
        >
          <User className="h-3.5 w-3.5" />
          LPR
        </span>
      );
    }

    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          bg-orange-50
          px-3
          py-1
        text-[20px]
         font-[600]
          text-orange-600
          dark:bg-orange-500/10
          dark:text-orange-400
        "
      >
        <User className="h-3.5 w-3.5" />
        Manual
      </span>
    );
  };

  // =========================
  // Render
  // =========================

  return (
    <div
      className="
        overflow-hidden
        rounded-[24px]
        bg-card
        shadow-sm
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          {/* =========================
              HEADER
          ========================= */}

          <thead>
            <tr
              className="
                border-b
                border-border
                bg-[#F2F6FB]
                text-left
                text-[#7C93B4]
                dark:bg-slate-800/40
              "
            >
              <th className="px-6 py-4 text-lgfont-[600] uppercase tracking-wide">
                Plate Number
              </th>

              <th className="px-6 py-4 text-lgfont-[600] uppercase tracking-wide">
                Resident
              </th>

              <th className="px-6 py-4 text-lgfont-[600] uppercase tracking-wide">
                Gate
              </th>

              <th className="px-6 py-4 text-lgfont-[600] uppercase tracking-wide">
                Time
              </th>

              <th className="px-6 py-4 text-lgfont-[600] uppercase tracking-wide">
                Image
              </th>
            </tr>
          </thead>

          {/* =========================
              BODY
          ========================= */}

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="
                    px-6
                    py-12
                    text-center
                    text-lg
                    text-muted-foreground
                  "
                >
                  No entries found
                </td>
              </tr>
            ) : (
              data.map((entry) => {
                const isSelected = selectedId === entry.id;

                return (
                  <tr
                    key={entry.id}
                    onClick={() => onSelect(entry.id)}
                    className={`
                      cursor-pointer
                      border-b
                      border-border
                      transition
                      last:border-b-0
                      ${
                        isSelected
                          ? "bg-accent dark:bg-cyan-500/10"
                          : "hover:bg-secondary dark:hover:bg-slate-800/50"
                      }
                    `}
                  >
                    {/* =========================
                        PLATE
                    ========================= */}

                    <td className="px-6 py-4">
                      <span
                        className="
                         text-[20px]
                          font-[600]
                          text-foreground
                          dark:text-white
                        "
                      >
                        {entry.plate_number}
                      </span>
                    </td>

                    {/* =========================
                        RESIDENT
                    ========================= */}

                    <td className="px-6 py-4">
                      <span
                        className="
                         text-[20px]
                          font-[500]
                          text-[#3B5473]
                          dark:text-white
                        "
                      >
                        {entry.resident?.full_name || "-"}
                      </span>
                    </td>

                    {/* =========================
                        GATE
                    ========================= */}

                    <td className="px-6 py-4">
                      <span
                        className="
                         text-[20px]
                          font-[500]
                          text-[#3B5473]
                          dark:text-white
                        "
                      >
                        {entry.gate_id}
                      </span>
                    </td>

                    {/* =========================
                        TIME
                    ========================= */}

                    <td className="px-6 py-4">
                      <span
                        className="
                         text-[20px]
                          font-[500]
                          text-[#3B5473]
                          dark:text-white
                        "
                      >
                        {formatDate(entry.created_at)}
                      </span>
                    </td>

                    {/* =========================
                        IMAGE
                    ========================= */}

                    <td className="px-6 py-4">
                      {entry.image_url ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onImageClick(entry.image_url!);
                          }}
                          className="
                           text-[20px]
                            font-[500]
                            text-[#29C5E8]
                            hover:underline
                          "
                        >
                          View Image
                        </button>
                      ) : (
                        <span className="text-[16px] text-muted-foreground">
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
