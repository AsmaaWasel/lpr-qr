"use client";

import { LogOut, ShieldCheck } from "lucide-react";

type Props = {
  currentLang: string;
  onChangeLang: (lang: "en" | "ar") => void;
  onLogout: () => void;
};

export default function ResidentHeader({
  currentLang,
  onChangeLang,
  onLogout,
}: Props) {
  return (
    <header className="relative z-20 flex items-center justify-between border-b border-border bg-[#050a18]/60 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10">
          <ShieldCheck className="h-5 w-5 text-brand" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            SMART<span className="text-brand">GATE</span>
          </h1>

          <p className="text-[10px] uppercase tracking-widest text-sky-300/50">
            RESIDENT PORTAL
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-border bg-card p-1">
          <button
            onClick={() => onChangeLang("en")}
            className={`rounded-full px-3 py-1 text-xs ${
              currentLang === "en" ? "bg-brand text-foreground" : "text-muted-foreground"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => onChangeLang("ar")}
            className={`rounded-full px-3 py-1 text-xs ${
              currentLang === "ar" ? "bg-brand text-foreground" : "text-muted-foreground"
            }`}
          >
            AR
          </button>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-danger"
        >
          <LogOut size={14} />
          LOGOUT
        </button>
      </div>
    </header>
  );
}
