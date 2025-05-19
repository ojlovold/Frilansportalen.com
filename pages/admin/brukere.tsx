// pages/admin/brukere.tsx
import dynamic from "next/dynamic";
import Head from "next/head";
import TilbakeKnapp from "@/components/TilbakeKnapp";

const AdminBrukere = dynamic(() => import("@/components/AdminBrukere"), {
  ssr: false,
});

export default function AdminBrukerSide() {
  return (
    <>
      <Head>
        <title>Brukere og profiler | Frilansportalen</title>
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-6">
        <TilbakeKnapp />
        <h2 className="text-2xl font-bold mb-4">Brukere og profiler</h2>
        <AdminBrukere />
      </main>
    </>
  );
}
