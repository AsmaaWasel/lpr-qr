"use client";

import Sidebar from "../../components/Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
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

      <Sidebar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          min-h-screen

          lg:pl-[144px]
          lg:pr-4
          lg:py-4
        "
      >
        {/* ===================================================
            TOPBAR
        ==================================================== */}

        <Topbar />

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
