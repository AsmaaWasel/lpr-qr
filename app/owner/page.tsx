"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import api from "@/services/api";

import { useRouter } from "next/navigation";
import {
  QrCode,
  Loader2,
  LogOut,
  ShieldCheck,
  User,
  Mail,
  Share2,
  Check,
  Lock,
  Save,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useTranslations } from "next-intl";

type ResidentUser = {
  id: number;
  full_name?: string;
  email?: string;
  building_number?: string;
  flat_number?: string;
};

export default function ResidentPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"qr" | "profile">("qr");
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<ResidentUser | null>(null);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* =========================
     إعدادات اللغة للملف الحالي
  ========================= */
  const [currentLang, setCurrentLang] = useState("en");
  const t = useTranslations("residentPortal");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lang = localStorage.getItem("lang") || "en";
      setCurrentLang(lang);
    }

    const storedUser = localStorage.getItem("resident_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNewEmail(parsedUser.email || "");
    }
  }, []);

  const setLang = (lang: "en" | "ar") => {
    localStorage.setItem("lang", lang);
    document.cookie = `lang=${lang}; path=/`;
    window.location.reload();
  };

  /* =========================
     LOGOUT & QR METHODS
  ========================= */
  const logout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  const generateQR = async () => {
    setLoading(true);
    setCopied(false);

    try {
      const resident_id = localStorage.getItem("resident_id");
      if (!resident_id) {
        router.replace("/login");
        return;
      }

      const res = await api.post("/qr/resident/generate/visitor", {
        resident_id: Number(resident_id),
      });

      setQr(res.data?.qr || JSON.stringify(res.data));
      toast.success(
        t("toast.qrSuccess") || "Visitor QR generated successfully",
      );
    } catch (err) {
      console.error(err);
      toast.error(t("toast.qrError") || "Failed to generate QR");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const canvas = document.getElementById("visitor-qr") as HTMLCanvasElement;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "visitor-qr.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "SmartGate Visitor QR",
            text: "Visitor access QR code",
          });
          toast.success(t("toast.shareSuccess") || "QR shared successfully");
          return;
        } catch (err) {
          console.error(err);
        }
      }

      try {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        toast.success(t("toast.copySuccess") || "QR copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error(err);
        toast.error(t("toast.copyError") || "Copy failed");
      }
    });
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    const resident_id = localStorage.getItem("resident_id");
    if (!resident_id) {
      toast.error(
        t("toast.sessionExpired") || "Session expired. Please re-login.",
      );
      router.replace("/login");
      return;
    }

    if (!newEmail.trim()) {
      toast.error(t("toast.emailEmpty") || "Email address cannot be empty");
      return;
    }

    setUpdateLoading(true);

    try {
      await updateResidentCredentials(Number(resident_id), {
        email: newEmail.trim(),
        password: newPassword.trim() ? newPassword : undefined,
      });

      toast.success(
        t("toast.updateSuccess") || "Credentials updated successfully!",
      );

      if (user) {
        const updatedUser = { ...user, email: newEmail.trim() };
        setUser(updatedUser);
        localStorage.setItem("resident_user", JSON.stringify(updatedUser));
      }

      setNewPassword("");
    } catch (err: unknown) {
      console.error("Update credentials failed:", err);

      let msg =
        t("toast.updateError") || "Failed to update gateway credentials.";

      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.detail || msg;
      }

      toast.error(msg);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050a18] font-sans text-foreground">
      {/* BACKGROUND GRAPHICS */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 transition-transform duration-1000"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a18] via-[#0a1128]/90 to-[#050a18]" />
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[150px]" />

      {/* TOP HEADER BAR */}
      <header className="relative z-20 flex items-center justify-between border-b border-border bg-[#050a18]/60 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <ShieldCheck className="h-5 w-5 text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              SMART<span className="text-brand">GATE</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-sky-300/50">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* أزرار تغيير اللغة وزر تسجيل الخروج */}
        <div className="flex items-center gap-4">
          {/* LANGUAGE SELECTOR */}
          <div className="flex items-center bg-card border border-border rounded-full p-1 gap-1">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 text-[12px] font-bold rounded-full transition-all ${
                currentLang === "en"
                  ? "bg-brand text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>

            <button
              onClick={() => setLang("ar")}
              className={`px-3 py-1 text-[12px] font-bold rounded-full transition-all ${
                currentLang === "ar"
                  ? "bg-brand text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              AR
            </button>
          </div>

          {/* SECURE LOGOUT */}
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold text-danger transition hover:bg-danger-soft active:scale-95"
          >
            <LogOut size={14} />
            {t("logout")}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 lg:px-6">
        {/* QUICK SUMMARY CARD */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-white/[0.02] p-6 backdrop-blur-md sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-400/20 bg-sky-500/5">
              <User className="h-6 w-6 text-brand" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold">
                {user?.full_name || t("summary.defaultName")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("summary.building")}{" "}
                <span className="text-foreground font-medium">
                  {user?.building_number || "-"}
                </span>{" "}
                • {t("summary.flat")}{" "}
                <span className="text-foreground font-medium">
                  {user?.flat_number || "-"}
                </span>
              </p>
            </div>
          </div>

          {/* PORTAL NAVIGATION TABS */}
          <div className="flex rounded-xl bg-black/40 p-1.5 border border-border">
            <button
              onClick={() => setActiveTab("qr")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "qr"
                  ? "bg-brand-strong text-foreground shadow-lg shadow-sky-600/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <QrCode size={14} />
              {t("tabs.qr")}
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "profile"
                  ? "bg-brand-strong text-foreground shadow-lg shadow-sky-600/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <KeyRound size={14} />
              {t("tabs.credentials")}
            </button>
          </div>
        </div>

        {/* WORKSPACE AREA */}
        <div className="min-h-[450px]">
          {activeTab === "qr" ? (
            /* TAB 1: QR MANAGER */
            <div className="grid gap-6 md:grid-cols-5 animate-in fade-in duration-300">
              <div className="flex flex-col justify-center rounded-3xl border border-border bg-white/[0.02] p-6 backdrop-blur-xl md:col-span-3">
                <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <QrCode className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {t("qrTab.title")}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t("qrTab.description")}
                </p>

                <div className="mt-6 space-y-2 rounded-xl bg-sky-950/20 border border-sky-500/10 p-4 text-xs text-sky-300/80">
                  <p>{t("qrTab.rule1")}</p>
                  <p>{t("qrTab.rule2")}</p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={generateQR}
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-strong py-3.5 text-xs font-bold uppercase tracking-widest text-foreground transition hover:bg-brand disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <QrCode size={16} />
                    )}
                    {qr ? t("qrTab.regenerateBtn") : t("qrTab.issueBtn")}
                  </button>

                  {qr && (
                    <button
                      onClick={handleShare}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 py-3.5 text-xs font-bold uppercase tracking-widest text-brand transition hover:bg-sky-400/20"
                    >
                      {copied ? <Check size={16} /> : <Share2 size={16} />}
                      {copied ? t("qrTab.copiedText") : t("qrTab.shareBtn")}
                    </button>
                  )}
                </div>
              </div>

              {/* QR BOX VISUALIZATION */}
              <div className="flex items-center justify-center rounded-3xl border border-border bg-black/40 p-6 md:col-span-2">
                <div className="relative">
                  <div
                    className={`absolute -inset-4 rounded-full bg-sky-500/10 blur-2xl transition-opacity ${qr ? "opacity-100" : "opacity-0"}`}
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
                          {t("qrTab.awaitingProtocol")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: CREDENTIALS & SECURITY PROFILE */
            <div className="mx-auto max-w-xl rounded-3xl border border-border bg-white/[0.02] p-6 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="mb-6">
                <h3 className="text-lg font-bold">{t("profileTab.title")}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("profileTab.description")}
                </p>
              </div>

              <form onSubmit={handleUpdateCredentials} className="space-y-5">
                {/* EMAIL INPUT */}
                <div className="space-y-2">
                  <label className="ml-1 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("profileTab.emailLabel")}
                  </label>
                  <div className="group relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand" />
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full rounded-xl border border-border bg-card py-3.5 pl-10 pr-4 text-sm text-foreground placeholder-slate-600 outline-none transition-all focus:border-sky-400/40 focus:bg-secondary"
                    />
                  </div>
                </div>

                {/* PASSWORD INPUT */}
                <div className="space-y-2">
                  <label className="ml-1 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("profileTab.passwordLabel")}{" "}
                    <span className="text-[10px] text-muted-foreground font-normal">
                      {t("profileTab.passwordHint")}
                    </span>
                  </label>
                  <div className="group relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      minLength={6}
                      className="w-full rounded-xl border border-border bg-card py-3.5 pl-10 pr-4 text-sm text-foreground placeholder-slate-600 outline-none transition-all focus:border-sky-400/40 focus:bg-secondary"
                    />
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-strong py-3.5 text-xs font-bold uppercase tracking-widest text-foreground transition hover:bg-brand disabled:opacity-50 active:scale-[0.99]"
                >
                  {updateLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {t("profileTab.saveBtn")}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-border py-6 text-center text-[10px] text-foreground relative z-10">
        {t("footer") ||
          "© 2026 SmartGate Systems • Resident Core Terminal Infrastructure"}
      </footer>
    </div>
  );
}
