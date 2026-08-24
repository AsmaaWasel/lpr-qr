"use client";

import { Loader2, QrCode, Share2, Check } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

interface ResidentQrTabProps {
  qr?: string; // ✅ بدل string | null
  loading: boolean;
  copied: boolean;
  onGenerate: () => void;
  onShare: () => void;
}

export default function ResidentQrTab({
  qr,
  loading,
  copied,
  onGenerate,
  onShare,
}: ResidentQrTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-5 animate-in fade-in duration-300">
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center rounded-3xl border border-border bg-white/[0.02] p-6 backdrop-blur-xl md:col-span-3">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10">
          <QrCode className="h-6 w-6 text-brand" />
        </div>

        <h3 className="text-lg font-bold text-foreground">Visitor QR Access</h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Generate a temporary QR code for your visitor.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onGenerate}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-strong py-3.5 text-xs font-bold uppercase tracking-widest text-foreground transition hover:bg-brand disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <QrCode size={16} />
            )}

            {qr ? "REGENERATE QR" : "GENERATE QR"}
          </button>

          {qr && (
            <button
              onClick={onShare}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 py-3.5 text-xs font-bold uppercase tracking-widest text-brand transition hover:bg-sky-400/20"
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              {copied ? "COPIED!" : "SHARE QR"}
            </button>
          )}
        </div>
      </div>

      {/* QR BOX */}
      <div className="flex items-center justify-center rounded-3xl border border-border bg-black/40 p-6 md:col-span-2">
        <div className="relative">
          <div
            className={`absolute -inset-4 rounded-full bg-sky-500/10 blur-2xl transition-opacity ${
              qr ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="relative flex h-[260px] w-[260px] items-center justify-center rounded-2xl border border-dashed border-border bg-white/[0.01]">
            {qr ? (
              <div className="rounded-xl bg-card p-4 shadow-[0_0_30px_rgba(56,189,248,0.15)] animate-in zoom-in-95 duration-300">
                <QRCodeCanvas value={qr} size={200} id="visitor-qr" />
              </div>
            ) : (
              <div className="text-center opacity-40">
                <QrCode className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Awaiting QR
                  <br />
                  Generation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
