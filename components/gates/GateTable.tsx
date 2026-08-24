"use client";

import { Gate } from "@/modules/types/gate";

type Props = {
  data: Gate[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function GatesTable({ data, selectedId, onSelect }: Props) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[24px]
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
                bg-slate-50/70
                text-left
                dark:bg-slate-800/40
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
                Gate Name
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
                IP Address
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
                Description
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
                    text-sm
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
                      last:border-b-0
                      ${
                        isSelected
                          ? "bg-accent dark:bg-cyan-500/10"
                          : "hover:bg-secondary dark:hover:bg-slate-800/50"
                      }
                    `}
                  >
                    {/* Gate */}
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
                          {gate.id}
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
                            {gate.name}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-muted-foreground
                            "
                          >
                            Gate #{gate.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-bold
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
                          text-sm
                          font-medium
                          text-foreground
                          dark:text-white
                        "
                      >
                        {gate.ip}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4">
                      <span
                        className="
                          text-sm
                          text-muted-foreground
                        "
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
