"use client";

import { HiOutlineUserGroup } from "react-icons/hi";

type Props = {
  gatesCount: number;
  entriesCount: number;
  platesCount: number;
};

export default function QuickStats({
  gatesCount,
  entriesCount,
  platesCount,
}: Props) {
  return (
    <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-5">
      <h3 className="text-foreground font-bold text-lg mb-4 flex items-center gap-2">
        <HiOutlineUserGroup className="w-4 h-4" />
        Quick Stats
      </h3>

      <div className="space-y-3">
        <Stat label="Total Gates" value={gatesCount} />

        <Stat label="Total Entries" value={entriesCount} />

        <Stat label="Total Plates" value={platesCount} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card rounded-xl p-4">
      <div className="text-muted-foreground text-xs uppercase">{label}</div>

      <div className="text-foreground text-sm font-bold mt-1">{value}</div>
    </div>
  );
}
