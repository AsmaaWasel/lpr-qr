"use client";

import { HiOutlineX } from "react-icons/hi";

type TrafficSettingsData = {
  light: number;
  heavy: number;
  colors: {
    light: string;
    medium: string;
    heavy: string;
  };
};

type TrafficSettingsProps = {
  open: boolean;
  settings: TrafficSettingsData;

  onChange: (field: keyof TrafficSettingsData, value: number) => void;

  onColorChange: (
    field: keyof TrafficSettingsData["colors"],
    value: string,
  ) => void;

  onSave: () => void;
  onClose: () => void;
};

export default function TrafficSettings({
  open,
  settings,
  onChange,
  onColorChange,
  onSave,
  onClose,
}: TrafficSettingsProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Traffic Settings
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Configure congestion thresholds and colors
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-5">
          {/* Thresholds */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Congestion Thresholds
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Light */}
              <div>
                <label className="mb-2 block text-sm text-muted-foreground">
                  Light traffic
                </label>

                <input
                  type="number"
                  min={0}
                  value={settings.light}
                  onChange={(e) => onChange("light", Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Heavy */}
              <div>
                <label className="mb-2 block text-sm text-muted-foreground">
                  Heavy traffic
                </label>

                <input
                  type="number"
                  min={1}
                  value={settings.heavy}
                  onChange={(e) => onChange("heavy", Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              0 - {settings.light - 1} = Light, {settings.light} -{" "}
              {settings.heavy - 1} = Medium, {settings.heavy}+ = Heavy
            </p>
          </div>

          {/* Colors */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Traffic Colors
            </h3>

            <div className="space-y-3">
              {/* Light */}
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm text-foreground">Light</span>

                <input
                  type="color"
                  value={settings.colors.light}
                  onChange={(e) => onColorChange("light", e.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border-0 bg-transparent"
                />
              </div>

              {/* Medium */}
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm text-foreground">Medium</span>

                <input
                  type="color"
                  value={settings.colors.medium}
                  onChange={(e) => onColorChange("medium", e.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border-0 bg-transparent"
                />
              </div>

              {/* Heavy */}
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm text-foreground">Heavy</span>

                <input
                  type="color"
                  value={settings.colors.heavy}
                  onChange={(e) => onColorChange("heavy", e.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border-0 bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
