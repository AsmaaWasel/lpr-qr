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

import { GateEntry } from "@/services/gateEntry";

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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEntryTypeBadge = (type: GateEntry["entry_type"]) => {
    const isEntry = type.toUpperCase() === "ENTRY";

    return (
      <span
        className={`
          inline-flex
          items-center
          gap-1.5
          rounded-full
          px-3
          py-1
          text-[16px]
          font-[600]
          ${
            isEntry
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
          }
        `}
      >
        <DoorOpen className="h-4 w-4" />

        {isEntry ? "ENTRY" : "EXIT"}
      </span>
    );
  };

  const getEntryByBadge = (method: GateEntry["entry_by"]) => {
    const normalized = method.toUpperCase();

    if (normalized === "NORMAL") {
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
            text-[16px]
            font-[600]
            text-purple-600
            dark:bg-purple-500/10
            dark:text-purple-400
          "
        >
          <Car className="h-4 w-4" />
          Normal
        </span>
      );
    }

    if (normalized === "PLATE") {
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
            text-[16px]
            font-[600]
            text-purple-600
            dark:bg-purple-500/10
            dark:text-purple-400
          "
        >
          <Car className="h-4 w-4" />
          Plate
        </span>
      );
    }

    if (normalized === "QR") {
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
            text-[16px]
            font-[600]
            text-blue-600
            dark:bg-blue-500/10
            dark:text-blue-400
          "
        >
          <QrCode className="h-4 w-4" />
          QR Code
        </span>
      );
    }

    if (normalized === "RESIDENT") {
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
            text-[16px]
            font-[600]
            text-emerald-600
            dark:bg-emerald-500/10
            dark:text-emerald-400
          "
        >
          <User className="h-4 w-4" />
          Resident
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
          text-[16px]
          font-[600]
          text-orange-600
          dark:bg-orange-500/10
          dark:text-orange-400
        "
      >
        <User className="h-4 w-4" />
        {method}
      </span>
    );
  };

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
              {/* <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                ID
              </th> */}

              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Plate Number
              </th>

              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Type
              </th>

              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Entry By
              </th>

              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Resident
              </th>

              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Gate
              </th>

              <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Time
              </th>

              {/* <th className="px-6 py-4 text-lg font-[600] uppercase tracking-wide">
                Image
              </th> */}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
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
                    {/* ID */}
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-[#29C5E8]" />

                        <span className="text-[18px] font-[600] text-[#3B5473] dark:text-white">
                          {entry.id}
                        </span>
                      </div>
                    </td> */}

                    {/* PLATE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-[#29C5E8]" />

                        <span className="text-[20px] font-[600] text-foreground dark:text-white">
                          {entry.plate_number || "-"}
                        </span>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="px-6 py-4">
                      {getEntryTypeBadge(entry.entry_type)}
                    </td>

                    {/* ENTRY BY */}
                    <td className="px-6 py-4">
                      {getEntryByBadge(entry.entry_by)}
                    </td>

                    {/* RESIDENT */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#29C5E8]" />

                        <span className="text-[20px] font-[500] text-[#3B5473] dark:text-white">
                          {entry.resident?.full_name || "-"}
                        </span>
                      </div>
                    </td>

                    {/* GATE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DoorOpen className="h-4 w-4 text-[#29C5E8]" />

                        <span className="text-[20px] font-[500] text-[#3B5473] dark:text-white">
                          Gate {entry.gate_id}
                        </span>
                      </div>
                    </td>

                    {/* TIME */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#29C5E8]" />

                        <span className="whitespace-nowrap text-[18px] font-[500] text-[#3B5473] dark:text-white">
                          {formatDate(entry.created_at)}
                        </span>
                      </div>
                    </td>

                    {/* IMAGE */}
                    {/* <td className="px-6 py-4">
                      {entry.image_url ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onImageClick(entry.image_url!);
                          }}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            text-[18px]
                            font-[500]
                            text-[#29C5E8]
                            hover:underline
                          "
                        >
                          <ImageIcon className="h-5 w-5" />
                          View Image
                        </button>
                      ) : (
                        <span className="text-[16px] text-muted-foreground">
                          -
                        </span>
                      )}
                    </td> */}
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
