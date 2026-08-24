"use client";

import { ThresholdSettings } from "@/modules/types/gateEntry";
import { HiOutlineCog, HiOutlineX, HiOutlineCheckCircle } from "react-icons/hi";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;

  draftSettings: ThresholdSettings;

  setDraftSettings: React.Dispatch<React.SetStateAction<ThresholdSettings>>;

  mediumThreshold: number;
};

export default function TrafficSettingsModal({
  open,
  onClose,
  onSave,
  draftSettings,
  setDraftSettings,
  mediumThreshold,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-2xl border border-border max-w-lg w-full p-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <HiOutlineCog className="w-5 h-5 text-brand" />
              Traffic Settings
            </h2>

            <p className="text-muted-foreground text-xs mt-1">
              Configure traffic levels and colors
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close settings"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* LIGHT */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-foreground font-semibold">Light</h3>

                <p className="text-xs text-muted-foreground">Traffic below Medium</p>
              </div>

              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: draftSettings.colors.light,
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={draftSettings.light}
                onChange={(e) =>
                  setDraftSettings((prev) => ({
                    ...prev,
                    light: Number(e.target.value),
                  }))
                }
                className="flex-1 bg-ink border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:border-brand"
              />

              <input
                type="color"
                value={draftSettings.colors.light}
                onChange={(e) =>
                  setDraftSettings((prev) => ({
                    ...prev,
                    colors: {
                      ...prev.colors,
                      light: e.target.value,
                    },
                  }))
                }
                className="w-12 h-11 rounded-lg bg-ink border border-border cursor-pointer p-1"
              />
            </div>
          </div>

          {/* MEDIUM */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-foreground font-semibold">Medium</h3>

                <p className="text-xs text-muted-foreground">
                  Calculated automatically
                </p>
              </div>

              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: draftSettings.colors.medium,
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-ink border border-border rounded-lg px-4 py-2.5 text-muted-foreground">
                {mediumThreshold}
              </div>

              <input
                type="color"
                value={draftSettings.colors.medium}
                onChange={(e) =>
                  setDraftSettings((prev) => ({
                    ...prev,
                    colors: {
                      ...prev.colors,
                      medium: e.target.value,
                    },
                  }))
                }
                className="w-12 h-11 rounded-lg bg-ink border border-border cursor-pointer p-1"
              />
            </div>
          </div>

          {/* HEAVY */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-foreground font-semibold">Heavy</h3>

                <p className="text-xs text-muted-foreground">
                  Heavy traffic starts from this value
                </p>
              </div>

              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: draftSettings.colors.heavy,
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={draftSettings.heavy}
                onChange={(e) =>
                  setDraftSettings((prev) => ({
                    ...prev,
                    heavy: Number(e.target.value),
                  }))
                }
                className="flex-1 bg-ink border border-border rounded-lg px-4 py-2.5 text-foreground outline-none focus:border-brand"
              />

              <input
                type="color"
                value={draftSettings.colors.heavy}
                onChange={(e) =>
                  setDraftSettings((prev) => ({
                    ...prev,
                    colors: {
                      ...prev.colors,
                      heavy: e.target.value,
                    },
                  }))
                }
                className="w-12 h-11 rounded-lg bg-ink border border-border cursor-pointer p-1"
              />
            </div>
          </div>

          {/* PREVIEW */}
          <div className="bg-slate-900/70 rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-3">Traffic Preview</p>

            <div className="flex items-center gap-3">
              {/* LIGHT */}
              <div
                className="flex-1 text-center py-2 rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: `${draftSettings.colors.light}22`,
                  color: draftSettings.colors.light,
                  border: `1px solid ${draftSettings.colors.light}55`,
                }}
              >
                LIGHT
                <div className="text-xs opacity-70 mt-1">
                  0 - {mediumThreshold - 1}
                </div>
              </div>

              {/* MEDIUM */}
              <div
                className="flex-1 text-center py-2 rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: `${draftSettings.colors.medium}22`,
                  color: draftSettings.colors.medium,
                  border: `1px solid ${draftSettings.colors.medium}55`,
                }}
              >
                MEDIUM
                <div className="text-xs opacity-70 mt-1">
                  {mediumThreshold} - {draftSettings.heavy - 1}
                </div>
              </div>

              {/* HEAVY */}
              <div
                className="flex-1 text-center py-2 rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: `${draftSettings.colors.heavy}22`,
                  color: draftSettings.colors.heavy,
                  border: `1px solid ${draftSettings.colors.heavy}55`,
                }}
              >
                HEAVY
                <div className="text-xs opacity-70 mt-1">
                  {draftSettings.heavy}+
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-card text-muted-foreground border border-border py-3 rounded-xl hover:bg-secondary transition-all"
            >
              Cancel
            </button>

            <button
              onClick={onSave}
              className="flex-1 bg-blue-500/20 text-brand border border-blue-500/30 py-3 rounded-xl hover:bg-blue-500/30 transition-all font-medium flex items-center justify-center gap-2"
            >
              <HiOutlineCheckCircle className="w-5 h-5" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
