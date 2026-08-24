"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Resident } from "@/modules/types/resident";
import { toggleResidentStatus } from "@/services/resident";

import {
  Check,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react";

type Props = {
  data: Resident[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onStatusChange?: (residentId: number, newStatus: Resident["status"]) => void;
  onEdit?: (resident: Resident) => void;
  onDelete?: (resident: Resident) => void;
  onView?: (resident: Resident) => void;
};

export default function ResidentTable({
  data,
  selectedId,
  onSelect,
  onStatusChange,
  onEdit,
  onDelete,
  onView,
}: Props) {
  const router = useRouter();

  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // =========================================================
  // TYPE COLOR
  // =========================================================

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "owner":
        return `
          bg-purple-50
          text-purple-600
          dark:bg-purple-500/10
          dark:text-purple-400
        `;

      case "tenant":
        return `
          bg-accent
          text-brand-strong
          dark:bg-cyan-500/10
          dark:text-cyan-400
        `;

      case "family":
        return `
          bg-pink-50
          text-pink-600
          dark:bg-pink-500/10
          dark:text-pink-400
        `;

      case "guest":
        return `
          bg-orange-50
          text-orange-600
          dark:bg-orange-500/10
          dark:text-orange-400
        `;

      default:
        return `
          bg-secondary
          text-foreground
          dark:bg-slate-700
          dark:text-slate-200
        `;
    }
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "allowed":
        return `
          bg-emerald-100
          text-emerald-700
          dark:bg-emerald-500/20
          dark:text-emerald-400
        `;

      case "notAllowed":
        return `
          bg-rose-100
          text-rose-700
          dark:bg-rose-500/20
          dark:text-rose-400
        `;

      case "pending":
        return `
          bg-accent
          text-brand-strong
          dark:bg-blue-500/20
          dark:text-blue-400
        `;

      case "restricted":
        return `
          bg-amber-100
          text-amber-700
          dark:bg-amber-500/20
          dark:text-amber-400
        `;

      case "blocked":
        return `
          bg-red-100
          text-red-700
          dark:bg-red-500/20
          dark:text-red-400
        `;

      default:
        return `
          bg-secondary
          text-foreground
          dark:bg-slate-700
          dark:text-slate-200
        `;
    }
  };

  // =========================================================
  // FORMAT PHONE NUMBERS
  // =========================================================

  const formatPhoneNumbers = (resident: Resident) => {
    if (
      Array.isArray(resident.phone_numbers) &&
      resident.phone_numbers.length > 0
    ) {
      const phones = resident.phone_numbers
        .map((phone) => {
          if (phone && typeof phone === "object" && "phone_number" in phone) {
            return String(phone.phone_number ?? "").trim();
          }

          if (typeof phone === "string" || typeof phone === "number") {
            return String(phone).trim();
          }

          return "";
        })
        .filter(Boolean);

      if (phones.length > 0) {
        return phones.join(" - ");
      }
    }

    if (resident.phone_number !== null && resident.phone_number !== undefined) {
      const phone = String(resident.phone_number).trim();

      if (phone) {
        return phone;
      }
    }

    return "—";
  };

  // =========================================================
  // FORMAT PLATE NUMBERS
  // =========================================================

  const formatPlateNumbers = (resident: Resident) => {
    if (
      Array.isArray(resident.plate_numbers) &&
      resident.plate_numbers.length > 0
    ) {
      const plates = resident.plate_numbers
        .map((plate) => {
          if (
            plate &&
            typeof plate === "object" &&
            "plate_number_full" in plate
          ) {
            let plateNumber = String(plate.plate_number_full ?? "").trim();

            const numbers = plateNumber.match(/^\d+/)?.[0] || "";
            const letters = plateNumber.replace(/^\d+/, "");

            if (letters) {
              const spacedLetters = letters.split("").join(" ");
              plateNumber = `${spacedLetters} ${numbers}`;
            }

            return plateNumber;
          }

          if (typeof plate === "string" || typeof plate === "number") {
            let plateNumber = String(plate).trim();

            const numbers = plateNumber.match(/^\d+/)?.[0] || "";
            const letters = plateNumber.replace(/^\d+/, "");

            if (letters) {
              const spacedLetters = letters.split("").join(" ");
              plateNumber = `${spacedLetters} ${numbers}`;
            }

            return plateNumber;
          }

          return "";
        })
        .filter(Boolean);

      if (plates.length > 0) {
        return plates;
      }
    }

    return [];
  };

  // =========================================================
  // TOGGLE STATUS
  // =========================================================

  const handleToggleStatus = async (resident: Resident) => {
    if (loadingId === resident.id) return;

    setLoadingId(resident.id);
    setError(null);

    try {
      const newStatus = resident.status === "allowed" ? false : true;

      const result = await toggleResidentStatus(resident.id, newStatus);

      if (onStatusChange) {
        onStatusChange(resident.id, result.status);
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);

      setError(`Failed to update status for ${resident.full_name}`);

      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoadingId(null);
    }
  };

  // =========================================================
  // NAVIGATE TO PLATES
  // =========================================================

  const handleNavigateToPlates = (e: React.MouseEvent, residentId: number) => {
    e.stopPropagation();

    router.push(`/dashboard/lpr/plates?residentId=${residentId}`);
  };

  // =========================================================
  // NAVIGATE TO RESIDENT
  // =========================================================

  const handleNavigateToResident = (residentId: number) => {
    router.push(`/dashboard/residents/${residentId}`);
  };

  // =========================================================
  // TOGGLE MENU
  // =========================================================

  const toggleMenu = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="w-full space-y-3">
      {/* ERROR */}

      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-danger-soft
            px-4
            py-3
            text-sm
            font-medium
            text-danger
            dark:border-red-500/20
            dark:bg-red-500/10
            dark:text-red-400
          "
        >
          {error}
        </div>
      )}

      {/* TABLE */}

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
            {/* HEADER */}

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
                <th
                  className="
                    w-[55px]
                    px-6
                    py-4
                    text-lg
                    font-bold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                >
                  <span className="sr-only">Select</span>
                </th>

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
                  Full Name
                </th>

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
                  Phone
                </th>

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
                  National ID
                </th>

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
                  Plate Numbers
                </th>

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
                  Status
                </th>

                <th
                  className="
                    w-[70px]
                    px-6
                    py-4
                    text-lg
                    font-bold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                >
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            {/* BODY */}

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
                    No residents found
                  </td>
                </tr>
              ) : (
                data.map((resident) => {
                  const isSelected = selectedId === resident.id;

                  const isLoading = loadingId === resident.id;

                  const isAllowed = resident.status === "allowed";

                  const plates = formatPlateNumbers(resident);

                  const isMenuOpen = openMenuId === resident.id;

                  return (
                    <tr
                      key={resident.id}
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
                      onClick={() => onSelect(resident.id)}
                    >
                      {/* SELECT */}

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(resident.id);
                          }}
                          className={`
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded
                            border-2
                            transition

                            ${
                              isSelected
                                ? `
                                  border-brand
                                  bg-brand
                                  text-white
                                  hover:bg-brand-strong
                                `
                                : `
                                  border-slate-300
                                  bg-card
                                  hover:border-brand
                                  dark:border-slate-600
                                `
                            }
                          `}
                          aria-label={`Select ${resident.full_name}`}
                        >
                          {isSelected && <Check size={13} strokeWidth={3} />}
                        </button>
                      </td>

                      {/* FULL NAME */}

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateToResident(resident.id);
                          }}
                          className="
                            text-left
                            text-sm
                            font-bold
                            text-foreground
                            transition-colors
                            hover:text-brand-strong
                            dark:text-white
                            dark:hover:text-brand
                          "
                        >
                          {resident.full_name}
                        </button>
                      </td>

                      {/* PHONE */}

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          font-medium
                          text-foreground
                          dark:text-white
                        "
                      >
                        {formatPhoneNumbers(resident)}
                      </td>

                      {/* NATIONAL ID */}

                      <td className="px-6 py-4">
                        <span
                          className="
                            whitespace-nowrap
                            font-mono
                            text-sm
                            font-medium
                            text-foreground
                            dark:text-white
                          "
                        >
                          {resident.national_id ?? "—"}
                        </span>
                      </td>

                      {/* TYPE */}

                      <td className="px-6 py-4">
                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-bold
                            uppercase
                            ${getTypeColor(resident.type)}
                          `}
                        >
                          {resident.type}
                        </span>
                      </td>

                      {/* PLATES */}

                      <td className="px-6 py-4">
                        {plates.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {plates.map((plate, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={(e) =>
                                  handleNavigateToPlates(e, resident.id)
                                }
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-full
                                    border
                                    border-emerald-200
                                    bg-emerald-50
                                    px-3
                                    py-1
                                    font-mono
                                    text-xs
                                    font-semibold
                                    text-ok
                                    transition-all
                                    hover:border-emerald-300
                                    hover:bg-emerald-100
                                    hover:text-emerald-700
                                    dark:border-emerald-500/20
                                    dark:bg-emerald-500/10
                                    dark:text-emerald-400
                                    dark:hover:bg-emerald-500/20
                                  "
                                dir="ltr"
                              >
                                <span className="text-[10px]">🚗</span>

                                <span>{plate}</span>

                                <ExternalLink
                                  className="
                                      h-3
                                      w-3
                                      opacity-0
                                      transition-opacity
                                      group-hover:opacity-100
                                    "
                                />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span
                            className="
                              text-sm
                              text-muted-foreground
                            "
                          >
                            —
                          </span>
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(resident);
                          }}
                          disabled={isLoading}
                          className={`
                            inline-flex
                            min-w-[100px]
                            items-center
                            justify-center
                            gap-1.5
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-bold
                            transition-all

                            ${getStatusBadgeStyle(resident.status)}

                            ${
                              isLoading
                                ? "cursor-not-allowed opacity-50"
                                : "hover:scale-[1.02] active:scale-[0.98]"
                            }
                          `}
                        >
                          {isLoading ? (
                            <>
                              <Loader2
                                className="
                                  h-3.5
                                  w-3.5
                                  animate-spin
                                "
                              />

                              <span>...</span>
                            </>
                          ) : (
                            <>
                              {isAllowed ? (
                                <CheckCircle className="h-3.5 w-3.5" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
                              )}

                              <span className="capitalize">
                                {resident.status}
                              </span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(resident.id);
                            }}
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              text-muted-foreground
                              transition-colors
                              hover:bg-secondary
                              hover:text-foreground
                              dark:hover:bg-slate-700
                            "
                            aria-label="Open actions menu"
                          >
                            <MoreVertical size={17} />
                          </button>

                          {isMenuOpen && (
                            <>
                              {/* Overlay */}

                              <div
                                className="
                                  fixed
                                  inset-0
                                  z-10
                                "
                                onClick={() => setOpenMenuId(null)}
                              />

                              {/* Menu */}

                              <div
                                className="
                                  absolute
                                  right-0
                                  z-20
                                  mt-1
                                  w-44
                                  origin-top-right
                                  rounded-xl
                                  border
                                  border-border
                                  bg-card
                                  py-1
                                  shadow-lg
                                "
                              >
                                {onView && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onView(resident);
                                      setOpenMenuId(null);
                                    }}
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-2.5
                                      px-4
                                      py-2.5
                                      text-sm
                                      font-medium
                                      text-foreground
                                      transition-colors
                                      hover:bg-secondary
                                      dark:hover:bg-slate-700/50
                                    "
                                  >
                                    <Eye size={15} />
                                    View Details
                                  </button>
                                )}

                                {onEdit && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onEdit(resident);
                                      setOpenMenuId(null);
                                    }}
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-2.5
                                      px-4
                                      py-2.5
                                      text-sm
                                      font-medium
                                      text-foreground
                                      transition-colors
                                      hover:bg-secondary
                                      dark:hover:bg-slate-700/50
                                    "
                                  >
                                    <Pencil size={15} />
                                    Edit
                                  </button>
                                )}

                                {onDelete && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onDelete(resident);
                                      setOpenMenuId(null);
                                    }}
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-2.5
                                      border-t
                                      border-border
                                      px-4
                                      py-2.5
                                      text-sm
                                      font-medium
                                      text-danger
                                      transition-colors
                                      hover:bg-danger-soft
                                      dark:text-rose-400
                                      dark:hover:bg-rose-500/10
                                    "
                                  >
                                    <Trash2 size={15} />
                                    Delete
                                  </button>
                                )}
                              </div>
                            </>
                          )}
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
    </div>
  );
}
