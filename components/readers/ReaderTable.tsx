"use client";

import Link from "next/link";

import { Camera } from "@/modules/types/camera";

import { Check, ExternalLink } from "lucide-react";

type Props = {
  data: Camera[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function ReaderTable({ data, selectedId, onSelect }: Props) {
  return (
    <div className="w-full">
      {/* ================= TABLE ================= */}
      <div className="overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
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
                    No cameras found
                  </td>
                </tr>
              ) : (
                data.map((camera) => {
                  const isSelected = selectedId === camera.id;

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
