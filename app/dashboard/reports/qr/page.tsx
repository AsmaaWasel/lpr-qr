// app/dashboard/visitor-logs/page.tsx

import VisitorLogsManager from "@/modules/sharedComponents/qr/VisitorLogsManager";

export default function VisitorLogsPage() {
  return (
    <div className="p-6">
      <VisitorLogsManager />
    </div>
  );
}
