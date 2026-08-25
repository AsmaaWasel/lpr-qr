"use client";

import { Gate } from "@/modules/types/gate";

type Props = {
  data: Gate[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function GatesTable({ data, selectedId, onSelect }: Props) {
  return (
    <div className="w-full bg-card shadow-sm">
      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
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
              {/* Gate Name */}
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
                GATE NAME
              </th>

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
                TYPE
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

              {/* Description */}
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
                DESCRIPTION
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="
                    px-6
                    py-12
                    text-center
                    text-lg
                    text-muted-foreground
                  "
                >
                  No gates found
                </td>
              </tr>
            ) : (
              data.map((gate) => {
                const isSelected = selectedId === gate.id;

                return (
                  <tr
                    key={gate.id}
                    onClick={() => onSelect(gate.id)}
                    className={`
                      cursor-pointer
                      border-b
                      border-border
                      transition
                      ${
                        isSelected
                          ? "bg-accent dark:bg-cyan-500/10"
                          : "hover:bg-secondary dark:hover:bg-slate-800/50"
                      }
                    `}
                  >
                    {/* GATE NAME */}
                    <td className="px-6 py-4">
                      <p
                        className="
                          text-[16px]
                          font-bold
                          text-foreground
                          dark:text-white
                        "
                      >
                        {gate.name}
                      </p>
                    </td>

                    {/* TYPE */}
                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
                          py-1
                          text-[16px]
                          font-[500]
                          ${
                            gate.type === "ENTRY"
                              ? "bg-emerald-50 text-ok dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-amber-50 text-warn dark:bg-amber-500/10 dark:text-amber-400"
                          }
                        `}
                      >
                        {gate.type}
                      </span>
                    </td>

                    {/* IP */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          text-[16px]
                          font-[500]
                          text-[#29C5E8]
                          dark:text-white
                        "
                      >
                        {gate.ip || "-"}
                      </span>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          block
                          max-w-[350px]
                          truncate
                          text-[16px]
                          font-[500]
                          text-[#3B5473]
                          dark:text-white
                        "
                        title={gate.desc || "-"}
                      >
                        {gate.desc || "-"}
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
