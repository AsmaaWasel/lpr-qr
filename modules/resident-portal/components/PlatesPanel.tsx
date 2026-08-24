"use client";

import { Plate } from "@/modules/types/gateEntry";

type Props = {
  plates: Plate[];
  selectedPlate: Plate | null;
  onSelect: (plate: Plate) => void;
};

export default function PlatesPanel({
  plates,
  selectedPlate,
  onSelect,
}: Props) {
  return (
    <div className="bg-card backdrop-blur-sm rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground font-bold">🚗 Plates</h2>

        <span className="text-xs text-muted-foreground bg-card px-2 py-1 rounded-full">
          {plates.length}
        </span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {plates.map((plate) => (
          <button
            key={plate.id}
            onClick={() => onSelect(plate)}
            className={`w-full text-left p-3 rounded-xl ${
              selectedPlate?.id === plate.id
                ? "bg-secondary text-foreground border border-white/40"
                : "bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            <div className="flex items-center gap-1 flex-wrap">
              {plate.plate_number_full.split("").map((char, index) => {
                const isDigit = /\d/.test(char);

                const isLetter = /[A-Za-z]/.test(char);

                return (
                  <span
                    key={index}
                    className={`
                        font-mono text-sm font-extrabold
                        px-1 py-0.5 rounded
                        ${isDigit ? "text-foreground bg-secondary" : ""}
                        ${isLetter ? "text-brand bg-cyan-400/20" : ""}
                      `}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            <div className="text-[10px] text-muted-foreground mt-2">
              ID: {plate.id}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
