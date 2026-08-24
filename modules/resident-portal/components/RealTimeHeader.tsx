"use client";

import { HiOutlineCog, HiOutlineMap } from "react-icons/hi";

type Props = {
  onOpenMap: () => void;
  onOpenSettings: () => void;
};

export default function RealTimeHeader({ onOpenMap, onOpenSettings }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Real-Time Gate Management
        </h1>

        <p className="text-muted-foreground text-sm mt-1">
          Live monitoring and control system
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMap}
          className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg flex items-center gap-2"
        >
          <HiOutlineMap className="w-5 h-5" />
          <span className="text-sm">Map</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg flex items-center gap-2"
        >
          <HiOutlineCog className="w-5 h-5" />

          <span className="text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
}
