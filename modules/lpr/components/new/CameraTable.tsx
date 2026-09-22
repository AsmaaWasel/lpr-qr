// CameraTable.tsx
"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Camera } from "@/modules/types/camera";

type Props = {
  data: Camera[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function CameraTable({ data, selectedId, onSelect }: Props) {
  const pathname = usePathname();

  // ================================
  // Determine Base Path
  // ================================

  const getBasePath = () => {
    if (pathname.startsWith("/dashboard/lpr")) {
      return "/dashboard/lpr";
    }

    if (pathname.startsWith("/dashboard/qr")) {
      return "/dashboard/qr";
    }

    return "/dashboard/lpr";
  };

  const basePath = getBasePath();

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-[24px]
        border
        border-border
        bg-card
        shadow-sm

      "
    >
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[950px]">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <TableHeader>
            <TableRow
              className="
                border-0
                bg-secondary
                hover:bg-secondary

                dark:bg-slate-800/60
                dark:hover:bg-slate-800/60
              "
            >
              {/* Selection */}
              <TableHead className="w-[65px] px-6 py-4">
                <span className="sr-only">Select</span>
              </TableHead>

              {/* Location */}
              <TableHead className="px-6 py-4">
                <span
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-muted-foreground
                  "
                >
                  Location
                </span>
              </TableHead>

              {/* IP */}
              <TableHead className="px-6 py-4">
                <span
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-muted-foreground
                  "
                >
                  IP Address
                </span>
              </TableHead>

              {/* Port */}
              <TableHead className="px-6 py-4">
                <span
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-muted-foreground
                  "
                >
                  Port
                </span>
              </TableHead>

              {/* Gate */}
              <TableHead className="px-6 py-4">
                <span
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-muted-foreground
                  "
                >
                  Gate ID
                </span>
              </TableHead>

              {/* URL */}
              <TableHead className="px-6 py-4">
                <span
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-muted-foreground
                  "
                >
                  URL
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* ================================================= */}
          {/* BODY */}
          {/* ================================================= */}

          <TableBody>
            {data.map((cam) => {
              const selected = selectedId === cam.id;

              return (
                <TableRow
                  key={cam.id}
                  onClick={() => onSelect(cam.id)}
                  className={`
                    cursor-pointer
                    border-t
                    border-border
                    transition-colors

                    hover:bg-secondary

                    dark:hover:bg-slate-800/60

                    ${selected ? "bg-cyan-50/60 dark:bg-cyan-500/10" : ""}
                  `}
                >
                  {/* ================================================= */}
                  {/* CHECKBOX */}
                  {/* ================================================= */}

                  <TableCell className="px-6 py-5">
                    <div
                      className={`
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        border
                        transition-all

                        ${
                          selected
                            ? `
                              border-brand
                              bg-brand
                              text-white
                            `
                            : `
                              border-slate-300
                              bg-card

                              dark:border-slate-600

                            `
                        }
                      `}
                    >
                      {selected && <Check size={13} strokeWidth={3} />}
                    </div>
                  </TableCell>

                  {/* ================================================= */}
                  {/* LOCATION */}
                  {/* ================================================= */}

                  <TableCell className="px-6 py-5">
                    <div className="flex flex-col">
                      <span
                        className="
                          text-sm
                          font-bold
                          text-foreground

                          dark:text-white
                        "
                      >
                        {cam.location}
                      </span>

                      <span
                        className="
                          mt-1
                          text-xs
                          font-medium
                          text-muted-foreground
                        "
                      >
                        Camera #{cam.id}
                      </span>
                    </div>
                  </TableCell>

                  {/* ================================================= */}
                  {/* IP ADDRESS */}
                  {/* ================================================= */}

                  <TableCell className="px-6 py-5">
                    <span
                      className="
                        whitespace-nowrap
                        text-sm
                        font-semibold
                        text-brand
                      "
                    >
                      {cam.ip_address}
                    </span>
                  </TableCell>

                  {/* ================================================= */}
                  {/* PORT */}
                  {/* ================================================= */}

                  <TableCell className="px-6 py-5">
                    <span
                      className="
                        inline-flex
                        rounded-lg
                        bg-secondary
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-foreground

                      "
                    >
                      {cam.port}
                    </span>
                  </TableCell>

                  {/* ================================================= */}
                  {/* GATE ID */}
                  {/* ================================================= */}

                  <TableCell className="px-6 py-5">
                    <span
                      className="
                        inline-flex
                        rounded-lg
                        bg-accent
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-brand

                        dark:bg-blue-500/10

                      "
                    >
                      Gate #{cam.gate_id}
                    </span>
                  </TableCell>

                  {/* ================================================= */}
                  {/* URL */}
                  {/* ================================================= */}

                  <TableCell className="max-w-[350px] px-6 py-5">
                    {cam.url ? (
                      <Link
                        href={`${basePath}/cameras/${cam.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="
                          block
                          max-w-[320px]
                          truncate
                          text-sm
                          font-semibold
                          text-brand
                          underline-offset-4
                          transition-colors
                          hover:text-brand-strong
                          hover:underline

                          dark:hover:text-brand
                        "
                        title={cam.url}
                      >
                        {cam.url}
                      </Link>
                    ) : (
                      <span
                        className="
                          text-sm
                          font-medium
                          text-muted-foreground
                        "
                      >
                        No URL
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {/* ================================================= */}
            {/* EMPTY STATE */}
            {/* ================================================= */}

            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="
                    h-40
                    text-center
                    text-sm
                    font-medium
                    text-muted-foreground
                  "
                >
                  No cameras found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
