// pages/admin/design.tsx
import dynamic from "next/dynamic";
import AdminWrapper from "@/components/AdminWrapper";

const AdminDashboard = dynamic(() => import("@/components/AdminDashboard"), {
  ssr: false,
});

export default function AdminDesign() {
  return (
    <AdminWrapper title="Farger og logo">
      <AdminDashboard />
    </AdminWrapper>
  );
}
