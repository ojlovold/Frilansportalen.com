// pages/admin/design.tsx
import dynamic from "next/dynamic";
import Head from "next/head";
import TilbakeKnapp from "@/components/TilbakeKnapp";

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
        <TilbakeKnapp />
        <h2 className="text-2xl font-bold mb-4">Design, farger og logo</h2>
        <AdminDashboard />
      </main>
    </>
  );
}
