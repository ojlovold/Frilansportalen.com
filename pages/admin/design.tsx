// pages/admin/design.tsx
import dynamic from "next/dynamic";
import Head from "next/head";

const AdminDashboard = dynamic(() => import("@/components/AdminDashboard"), {
  ssr: false,
});

export default function AdminDesign() {
  return (
    <>
      <Head>
        <title>Design og konfigurasjon | Frilansportalen</title>
      </Head>
      <main className="min-h-screen bg-gray-100 p-6">
        <AdminDashboard />
      </main>
    </>
  );
}
