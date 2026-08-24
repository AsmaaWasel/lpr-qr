"use client";

import { User } from "lucide-react";

type ResidentUser = {
  full_name?: string;
  building_number?: string;
  flat_number?: string;
};

type Props = {
  user: ResidentUser | null;
  activeTab: "qr" | "profile";
  onChangeTab: (tab: "qr" | "profile") => void;
};

export default function ResidentSummaryCard({ user }: Props) {
  return (
    <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-white/[0.02] p-6 backdrop-blur-md sm:flex-row">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-400/20 bg-sky-500/5">
          <User className="h-6 w-6 text-brand" />
        </div>

        <div>
          <h2 className="text-xl font-bold">{user?.full_name || "Name"}</h2>

          <p className="text-xs text-muted-foreground">
            Building{" "}
            <span className="text-foreground">{user?.building_number || "-"}</span>
            {" • "}
            Flat <span className="text-foreground">{user?.flat_number || "-"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
