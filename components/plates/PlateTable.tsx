"use client";

import { Plate } from "@/modules/types/plate";
import { useRouter } from "next/navigation";

type Props = {
  data: Plate[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function PlateTable({ data, selectedId, onSelect }: Props) {
  const router = useRouter();

  // =========================
  // FORMAT PLATE NUMBER
  // =========================
  const formatPlateNumber = (plate: string) => {
    if (!plate) return "";

    const clean = plate.replace(/\s/g, "");

    const numbers = clean.match(/\d+/g)?.join("") || "";
    const letters = clean.match(/[^\d]+/g)?.join("") || "";

    const spacedLetters = letters.split("").join(" ");

    if (numbers && letters && /^\d/.test(clean)) {
      return `${numbers} ${spacedLetters}`;
    }

    if (letters && numbers && /^[^\d]/.test(clean)) {
      return `${spacedLetters} ${numbers}`;
    }

    if (!numbers && letters) {
      return spacedLetters;
    }

    if (numbers && !letters) {
      return numbers;
    }

    return clean;
  };

  // =========================
  // OPEN DETAILS
  // =========================
  const handleOpenDetails = (plateId: number) => {
    router.push("/dashboard/residents");
  };

  return (
    <div className="w-full bg-card shadow-sm">
      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          {/* =========================
              THEAD
          ========================= */}
          <thead>
            <tr
              className="
                border-b
                border-border
                bg-[#F2F6FB]
                text-left
                dark:bg-slate-800/40
              "
            >
              {/* Plate Number */}
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
                Resident Name
              </th>

              {/* Actions */}
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
                Actions
              </th>
            </tr>
          </thead>

          {/* =========================
              TBODY
          ========================= */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="
                    px-6
                    py-12
                    text-center
                    text-lg
                    text-muted-foreground
                  "
                >
                  No plates found
                </td>
              </tr>
            ) : (
              data.map((plate) => {
                const isSelected = selectedId === plate.id;

                return (
                  <tr
                    key={plate.id}
                    onClick={() => onSelect(plate.id)}
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
                    {/* =========================
                        PLATE NUMBER
                    ========================= */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* ID */}
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
                          {plate.id}
                        </div>

                        {/* Plate */}
                        <div>
                          <p
                            className="
                              text-[16px]
                              font-bold
                              text-foreground
                              dark:text-white
                            "
                          >
                            {formatPlateNumber(plate.plate_number_full)}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-muted-foreground
                            "
                          >
                            Plate #{plate.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =========================
                        RESIDENT
                    ========================= */}
                    <td className="px-6 py-4">
                      {plate.resident ? (
                        <div>
                          <p
                            className="
                              text-[16px]
                              font-bold
                              text-foreground
                              dark:text-white
                            "
                          >
                            {plate.resident.full_name}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-muted-foreground
                            "
                          >
                            Assigned
                          </p>
                        </div>
                      ) : (
                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-amber-50
                            px-3
                            py-1
                            text-xs
                            font-bold
                            text-warn
                            dark:bg-amber-500/10
                            dark:text-amber-400
                          "
                        >
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* =========================
                        ACTIONS
                    ========================= */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetails(plate.id);
                        }}
                        className="
                          rounded-xl
                          bg-brand
                          px-4
                          py-2
                          text-sm
                          font-bold
                          text-white
                          transition
                          hover:bg-brand-strong
                          active:scale-[0.98]
                        "
                      >
                        Open Details
                      </button>
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
