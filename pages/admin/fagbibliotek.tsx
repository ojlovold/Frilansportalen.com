import Head from "next/head";
import Dashboard from "@/components/Dashboard";
import FagbibliotekAdmin from "@/components/fag/FagbibliotekAdmin";

export default function AdminFagbibliotek() {
  return (
    <Dashboard>
      <Head>
        <title>Fagbibliotek Admin | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <FagbibliotekAdmin />
      </div>
    </Dashboard>
  );
}
