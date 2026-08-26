"use client";

import Image from "next/image";
import { HiOutlineCog } from "react-icons/hi";

type Props = {
  openMap: () => void;
  openSettings: () => void;
};

export default function LiveDemoHeader({ openMap, openSettings }: Props) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div />

      <div className="flex items-center gap-6">
        {/* Map */}
        <button
          type="button"
          onClick={openMap}
          aria-label="Map"
          className="
            flex
            items-center
            gap-2
            rounded-lg
            p-2
            text-muted-foreground
            transition-colors
            hover:bg-secondary
            hover:text-foreground
          "
        >
          <Image
            src="/map.png"
            alt="Map"
            width={20}
            height={20}
            className="h-5 w-5"
          />

          <span
            className="
              text-lg
              font-medium
              text-muted-foreground
              transition-colors
              hover:text-foreground
            "
          >
            Map
          </span>
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={openSettings}
          aria-label="Settings"
          className="
            flex
            items-center
            gap-2
            rounded-lg
            p-2
            text-muted-foreground
            transition-colors
            hover:bg-secondary
            hover:text-foreground
          "
        >
          <HiOutlineCog className="h-5 w-5" />

          <span
            className="
              text-lg
              font-medium
              text-muted-foreground
              transition-colors
              hover:text-foreground
            "
          >
            Settings
          </span>
        </button>
      </div>
    </div>
  );
}
