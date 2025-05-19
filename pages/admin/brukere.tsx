// pages/admin/brukere.tsx
import dynamic from "next/dynamic";
import Head from "next/head";
import TilbakeKnapp from "@/components/ui/TilbakeKnapp";

const AdminBrukere = dynamic(() => import("@/components/AdminBrukere"), {
  ssr: false,
});

export default function AdminBrukerSide() {
  return (
    <>
      <Head>
        <title>Brukere og profiler | Frilansportalen</title>
      </Head>
      <main className="min-h-screen bg-gray-100 p-6">
        <TilbakeKnapp />
        <AdminBrukere />
      </main>
    </>
  );
}
