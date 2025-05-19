// pages/admin/brukere.tsx
import dynamic from "next/dynamic";
import AdminWrapper from "@/components/AdminWrapper";

const AdminBrukere = dynamic(() => import("@/components/AdminBrukere"), {
  ssr: false,
});

export default function AdminBrukerSide() {
  return (
    <AdminWrapper title="Brukere og profiler">
      <AdminBrukere />
    </AdminWrapper>
  );
}
