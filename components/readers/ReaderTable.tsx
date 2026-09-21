"use client";

import { useState } from "react";
import Link from "next/link";

import { Camera } from "@/modules/types/camera";

import { Check, ExternalLink, Loader2 } from "lucide-react";

type Props = {
  data: Camera[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onActiveChange?: (cameraId: number, active: boolean) => Promise<void>;
};

export default function ReaderTable({
  data,
  selectedId,
  onSelect,
  onActiveChange,
}: Props) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // =========================
  // FILTER DRIVER CAMERAS ONLY
  // =========================
  const driverCameras = data.filter(
    (camera) => camera.camera_type?.toUpperCase() === "DRIVER",
  );

  // =========================
  // TOGGLE ACTIVE
  // =========================
  const handleToggleActive = async (e: React.MouseEvent, camera: Camera) => {
    e.stopPropagation();

    if (!onActiveChange) return;

    try {
      setUpdatingId(camera.id);

      const newActive = !camera.is_active;

      await onActiveChange(camera.id, newActive);
    } catch (error) {
      console.error("Failed to update reader status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* ================= TABLE ================= */}
      <div className="overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            {/* ================= HEADER ================= */}
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
                {/* SELECT */}
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

                {/* LOCATION */}
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
                  LOCATION
                </th>

                {/* READER TYPE */}
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
                  READER TYPE
                </th>

                {/* CAMERA TYPE */}
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
                  CAMERA TYPE
                </th>

                {/* IP */}
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
                  IP
                </th>

                {/* PORT */}
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
                  PORT
                </th>

                {/* URL */}
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
                  URL
                </th>

                {/* ACTIVE */}
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
                  ACTIVE
                </th>

                {/* ACTION */}
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
                  ACTION
                </th>
              </tr>
            </thead>

            {/* ================= BODY ================= */}
            <tbody>
              {driverCameras.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="
                      px-6
                      py-12
                      text-center
                      text-lg
                      text-muted-foreground
                    "
                  >
                    No DRIVER cameras found
                  </td>
                </tr>
              ) : (
                driverCameras.map((camera) => {
                  const isSelected = selectedId === camera.id;
                  const isUpdating = updatingId === camera.id;

                  return (
                    <tr
                      key={camera.id}
                      onClick={() => onSelect(camera.id)}
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
                      {/* ================= SELECT ================= */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(camera.id);
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
                          aria-label={`Select camera ${camera.id}`}
                        >
                          {isSelected && <Check size={13} strokeWidth={3} />}
                        </button>
                      </td>

                      {/* ================= LOCATION ================= */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(camera.id);
                          }}
                          className="
                            text-left
                            text-[16px]
                            font-[600]
                            text-foreground
                            transition-colors
                            hover:text-brand-strong
                            dark:text-white
                            dark:hover:text-brand
                          "
                        >
                          {camera.location || "—"}
                        </button>
                      </td>

                      {/* ================= READER TYPE ================= */}
                      <td className="px-6 py-4">
                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-blue-50
                            px-3
                            py-1
                            text-[15px]
                            font-[600]
                            text-blue-700
                            dark:bg-blue-500/10
                            dark:text-blue-400
                          "
                        >
                          {camera.reader_type || "—"}
                        </span>
                      </td>

                      {/* ================= CAMERA TYPE ================= */}
                      <td className="px-6 py-4">
                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-cyan-50
                            px-3
                            py-1
                            text-[15px]
                            font-[600]
                            text-cyan-700
                            dark:bg-cyan-500/10
                            dark:text-cyan-400
                          "
                        >
                          {camera.camera_type || "—"}
                        </span>
                      </td>

                      {/* ================= IP ================= */}
                      <td className="px-6 py-4">
                        <span
                          className="
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:text-white
                          "
                        >
                          {camera.ip_address || "—"}
                        </span>
                      </td>

                      {/* ================= PORT ================= */}
                      <td className="px-6 py-4">
                        <span
                          className="
                            inline-flex
                            rounded-full
                            px-3
                            py-1
                            text-[16px]
                            font-[500]
                            text-[#3B5473]
                            dark:bg-slate-700
                            dark:text-white
                          "
                        >
                          {camera.port || "—"}
                        </span>
                      </td>

                      {/* ================= URL ================= */}
                      <td className="px-6 py-4">
                        <span
                          className="
                            block
                            max-w-[260px]
                            truncate
                            text-[16px]
                            font-[500]
                            text-[#29C5E8]
                          "
                          title={camera.url || "-"}
                        >
                          {camera.url || "—"}
                        </span>
                      </td>

                      {/* ================= ACTIVE (CIRCLE + TEXT) ================= */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={(e) => handleToggleActive(e, camera)}
                          className={`
                            flex
                            items-center
                            gap-2
                            ${
                              isUpdating
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-pointer"
                            }
                          `}
                          aria-label={`Toggle reader ${camera.id} active status`}
                          aria-pressed={camera.is_active}
                          title={
                            camera.is_active
                              ? "Click to deactivate"
                              : "Click to activate"
                          }
                        >
                          {isUpdating ? (
                            <Loader2
                              size={14}
                              className="animate-spin text-muted-foreground"
                            />
                          ) : (
                            <>
                              {/* الدايرة */}
                              <span
                                className={`
                                  relative
                                  flex
                                  h-3
                                  w-3
                                  rounded-full
                                  ${
                                    camera.is_active
                                      ? "bg-emerald-500"
                                      : "bg-red-500"
                                  }
                                `}
                              >
                                {/* هالة animate-ping */}
                                <span
                                  className={`
                                    absolute
                                    inline-flex
                                    h-full
                                    w-full
                                    rounded-full
                                    opacity-60
                                    animate-ping
                                    ${
                                      camera.is_active
                                        ? "bg-emerald-500"
                                        : "bg-red-500"
                                    }
                                  `}
                                />
                              </span>

                              {/* النص */}
                              <span
                                className={`
                                  text-[16px]
                                  font-[600]
                                  ${
                                    camera.is_active
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-red-600 dark:text-red-400"
                                  }
                                `}
                              >
                                {camera.is_active ? "Active" : "Inactive"}
                              </span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* ================= ACTION ================= */}
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/qr/qr-readers/${camera.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            whitespace-nowrap
                            rounded-lg
                            bg-gradient-to-r
                            from-[#2F80ED]
                            to-[#29C5E8]
                            px-3
                            py-2
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition-all
                            duration-200
                            hover:scale-[1.02]
                            hover:shadow-md
                          "
                        >
                          <ExternalLink size={15} />
                          Open Camera Link
                        </Link>
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
