// CameraTable.tsx
"use client";

import { Camera } from "@/modules/types/camera";
import { Table } from "lucide-react";
import { usePathname } from "next/navigation";

type Props = {
  data: Camera[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function CameraTable({ data, selectedId, onSelect }: Props) {
  const pathname = usePathname();

  return (
    <div
      className="
        overflow-hidden
       
        bg-card
        shadow-sm
      "
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr
              className="
                border-b
                border-border
                bg-[#F2F6FB]
                text-left
                dark:bg-slate-800/40
                text-[#7C93B4]
              
              "
            >
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
                camera ID
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
                URL
              </th>
            </tr>
          </thead>

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
                    {/* LOCATION */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p
                            className="
                    text-[16px]
                    font-bold
                    text-foreground
                    dark:text-white
                  "
                          >
                            {camera.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* IP */}
                    <td className="px-6 py-4">
                      <span
                        className="
                text-[16px]
                font-[500]
                text-[#3B5473]
                dark:text-white
              "
                      >
                        {camera.ip_address || "-"}
                      </span>
                    </td>

                    {/* PORT */}
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
                dark:text-white
                dark:bg-slate-700
                
                
              "
                      >
                        {camera.port || "-"}
                      </span>
                    </td>

                    {/* CAMERA ID */}
                    <td className="px-6 py-4">
                      <span
                        className="
                text-[16px]
                font-[500]
                text-[#3B5473]
                dark:text-white
              "
                      >
                        {camera.id}
                      </span>
                    </td>

                    {/* URL */}
                    <td className="px-6 py-4">
                      <span
                        className="
                block
                max-w-[280px]
                truncate
                text-[16px]
                font-[500]
                text-[#29C5E8]
              "
                        title={camera.url || "-"}
                      >
                        {camera.url || "-"}
                      </span>
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
