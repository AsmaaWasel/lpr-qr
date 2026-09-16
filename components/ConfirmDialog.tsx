"use client";

import { AlertTriangle, CheckCircle2, X, XCircle } from "lucide-react";

type DialogType = "confirm" | "success" | "error";

type Props = {
  open: boolean;
  type: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function ConfirmDialog({
  open,
  type,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  const isConfirm = type === "confirm";
  const isSuccess = type === "success";
  const isError = type === "error";

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-[460px]
          rounded-2xl
          border
          border-border
          bg-card
          p-7
          shadow-2xl
        "
      >
        {/* ICON */}
        <div className="flex justify-center">
          {isConfirm && (
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-amber-500/10
                text-amber-500
              "
            >
              <AlertTriangle size={28} />
            </div>
          )}

          {isSuccess && (
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-emerald-500/10
                text-emerald-500
              "
            >
              <CheckCircle2 size={28} />
            </div>
          )}

          {isError && (
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-red-500/10
                text-red-500
              "
            >
              <XCircle size={28} />
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="mt-5 text-center">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {message}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-7 flex justify-center gap-3">
          {isConfirm && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="
                min-w-[110px]
                rounded-xl
                border
                border-border
                px-5
                py-3
                text-sm
                font-semibold
                text-muted-foreground
                transition
                hover:bg-muted
                hover:text-foreground
              "
            >
              {cancelText}
            </button>
          )}

          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className={`
                min-w-[110px]
                rounded-xl
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                active:scale-[0.98]
                ${
                  isError
                    ? "bg-red-500 hover:bg-red-600"
                    : isSuccess
                      ? "bg-[#132f49] hover:bg-[#0b1f33]"
                      : "bg-[#132f49] hover:bg-[#0b1f33]"
                }
              `}
            >
              {confirmText}
            </button>
          )}
        </div>

        {/* CLOSE FOR SUCCESS / ERROR */}
        {!isConfirm && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="
              absolute
              sr-only
            "
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
