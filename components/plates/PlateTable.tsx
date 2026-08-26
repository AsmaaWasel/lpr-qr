"use client";

import { Plate } from "@/modules/types/plate";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

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
  const handleOpenDetails = (
    e: React.MouseEvent<HTMLButtonElement>,
    plateId: number,
  ) => {
    e.stopPropagation();

    router.push("/dashboard/residents");
  };

  return (
    <div className="w-full">
      {/* ================= TABLE ================= */}
      <div
        className="
          overflow-hidden
          bg-card
          shadow-sm
        "
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
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

                {/* PLATE NUMBER */}
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
                  PLATE NUMBER
                </th>

                {/* RESIDENT */}
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
                  RESIDENT NAME
                </th>

                {/* ACTIONS */}
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
                  ACTIONS
                </th>
              </tr>
            </thead>

            {/* ================= BODY ================= */}
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
                            onSelect(plate.id);
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
                          aria-label={`Select plate ${plate.id}`}
                        >
                          {isSelected && <Check size={13} strokeWidth={3} />}
                        </button>
                      </td>

                      {/* ================= PLATE NUMBER ================= */}
                      <td className="px-6 py-4">
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
                      </td>

                      {/* ================= RESIDENT ================= */}
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

                      {/* ================= ACTIONS ================= */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={(e) => handleOpenDetails(e, plate.id)}
                          className="
                            inline-flex
                            items-center
                            justify-center
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
    </div>
  );
}
