import type { Metadata } from "next";
import { AdminConsole } from "@/components/admin/admin-console";

export const metadata: Metadata = {
  title: "Admin Studio",
  description:
    "Private console for publishing portfolio projects and managing writing.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminConsole />;
}