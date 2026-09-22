"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div
      className="
        min-h-screen
        bg-secondary

      "
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          min-h-screen

          w-full
          lg:pl-[144px]
          lg:pr-4
          lg:py-4
        "
      >
        {/* ===================================================
            TOPBAR
        ==================================================== */}

        <Topbar onMenuClick={() => setMobileNavOpen((open) => !open)} />

        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}

        <main
          className="
            mt-5
            min-w-0
            pb-6
            px-1
            lg:px-0
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
