"use client";

import { Toaster } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      theme="system"
      closeButton
      duration={3500}
      gap={12}
      visibleToasts={4}
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        info: <Info className="h-5 w-5 text-sky-500" />,
        loading: <Loader2 className="h-5 w-5 animate-spin text-sky-500" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group !rounded-2xl !border !border-border !bg-card !text-foreground !shadow-2xl !px-4 !py-3.5",

          title: "!text-sm !font-bold !text-foreground",

          description: "!mt-1 !text-xs !font-medium !text-muted-foreground",

          success: "!border-emerald-500/20",

          error: "!border-red-500/20",

          warning: "!border-amber-500/20",

          info: "!border-sky-500/20",

          loading: "!border-sky-500/20",

          closeButton:
            "!right-3 !top-3 !rounded-lg !border-border !bg-muted !text-muted-foreground hover:!bg-secondary hover:!text-foreground",
        },
      }}
    />
  );
}
