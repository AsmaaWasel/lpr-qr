import { redirect } from "next/navigation";

export default function QRPage() {
  redirect("/dashboard/qr/qr-generator");
}
