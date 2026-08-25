"use client";

import Link from "next/link";
import {
  Eye,
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
          text-xs
          font-bold
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
            text-xs
            font-bold
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
            text-xs
            font-bold
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
            text-xs
            font-bold
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
          text-xs
          font-bold
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
        <table className="w-full min-w-[1100px]">
          {/* ================= HEADER ================= */}

          <thead>
            <tr
              className="
                border-b
                border-border
                bg-slate-50/70
                text-left
                dark:bg-slate-800/40
              "
            >
              {/* Type */}

              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Type
              </th>

              {/* Method */}

              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Method
              </th>

              {/* Plate */}

              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Plate Number
              </th>

              {/* Resident */}

              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Resident
              </th>

              {/* Gate */}

              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Gate ID
              </th>

              {/* Image */}

              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Image
              </th>

              {/* Date */}

              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Date & Time
              </th>

              {/* Action */}

              <th
                className="
                  px-6
                  py-4
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Action
              </th>
            </tr>
          </thead>

          {/* ================= BODY ================= */}

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="
                    px-6
                    py-12
                    text-center
                    text-sm
                    text-muted-foreground
                  "
                >
                  <div className="flex flex-col items-center gap-3">
                    <DoorOpen className="h-10 w-10 text-muted-foreground" />

                    <p className="text-lg font-medium">No gate entries found</p>

                    <p className="text-lg text-muted-foreground">
                      Try adjusting your filters
                    </p>
                  </div>
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
                    {/* ================= TYPE ================= */}

                    <td className="px-6 py-4">
                      {getEntryTypeBadge(entry.entry_type)}
                    </td>

                    {/* ================= METHOD ================= */}

                    <td className="px-6 py-4">
                      {getEntryByBadge(entry.entry_by)}
                    </td>

                    {/* ================= PLATE ================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-accent
                            dark:bg-cyan-500/10
                          "
                        >
                          <Car
                            className="
                              h-4
                              w-4
                              text-brand-strong
                            "
                          />
                        </div>

                        <div>
                          <p
                            className="
                              font-mono
                              text-sm
                              font-bold
                              text-foreground
                              dark:text-white
                            "
                          >
                            {entry.plate_number || "N/A"}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-muted-foreground
                            "
                          >
                            Plate Number
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ================= RESIDENT ================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-accent
                            dark:bg-cyan-500/10
                          "
                        >
                          <User
                            className="
                              h-4
                              w-4
                              text-brand-strong
                            "
                          />
                        </div>

                        <div>
                          <p
                            className="
                              text-sm
                              font-bold
                              text-foreground
                              dark:text-white
                            "
                          >
                            {entry.resident?.full_name || "Unknown"}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-muted-foreground
                            "
                          >
                            {entry.resident_id
                              ? `Resident #${entry.resident_id}`
                              : "Guest"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ================= GATE ================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-accent
                            text-sm
                            font-bold
                            text-brand-strong
                            dark:bg-cyan-500/10
                          "
                        >
                          <Hash className="h-4 w-4" />
                        </div>

                        <div>
                          <p
                            className="
                              text-sm
                              font-bold
                              text-foreground
                              dark:text-white
                            "
                          >
                            Gate {entry.gate_id}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-muted-foreground
                            "
                          >
                            ID #{entry.gate_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ================= IMAGE ================= */}

                    <td className="px-6 py-4">
                      {entry.image_url ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onImageClick(entry.image_url!);
                          }}
                          className="
                            group
                            relative
                            h-12
                            w-12
                            overflow-hidden
                            rounded-xl
                            border
                            border-border
                            bg-secondary
                          "
                        >
                          <img
                            src={entry.image_url}
                            alt="Gate entry"
                            className="
                              h-full
                              w-full
                              object-cover
                              transition
                              group-hover:scale-110
                            "
                          />
                        </button>
                      ) : (
                        <div
                          className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-secondary
                            dark:bg-slate-800/50
                          "
                        >
                          <ImageIcon
                            className="
                              h-5
                              w-5
                              text-muted-foreground
                            "
                          />
                        </div>
                      )}
                    </td>

                    {/* ================= DATE ================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-accent
                            dark:bg-cyan-500/10
                          "
                        >
                          <Calendar
                            className="
                              h-4
                              w-4
                              text-brand-strong
                            "
                          />
                        </div>

                        <div>
                          <p
                            className="
                              whitespace-nowrap
                              text-sm
                              font-medium
                              text-foreground
                              dark:text-white
                            "
                          >
                            {formatDate(entry.created_at)}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-muted-foreground
                            "
                          >
                            Gate activity
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ================= ACTION ================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <Link
                          href={`/dashboard/gate-entries/${entry.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-accent
                            transition
                            hover:bg-secondary
                            dark:bg-cyan-500/10
                            dark:hover:bg-cyan-500/20
                          "
                          title="View details"
                        >
                          <Eye
                            className="
                              h-4
                              w-4
                              text-brand-strong
                            "
                          />
                        </Link>
                      </div>
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
