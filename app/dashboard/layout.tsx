import AppLayout from "@/shared/layout/AppLayout";
import AppToaster from "@/shared/ui/toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      {children}
      {/* GLOBAL TOASTER */}
      <AppToaster />
    </AppLayout>
  );
}
