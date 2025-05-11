import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Dashboard() {
  const [navn, setNavn] = useState("");
  const [faktura, setFaktura] = useState(0);
  const [rapporter, setRapporter] = useState(0);
  const [kjorebok, setKjorebok] = useState(0);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const profil = await supabase.from("profiler").select("navn").eq("id", id).single();
      if (profil.data?.navn) setNavn(profil.data.navn);

      const [fakt, rap, kjore] = await Promise.all([
        supabase.from("fakturaer").select("id").eq("bruker_id", id),
        supabase.from("rapportarkiv").select("id").eq("bruker_id", id),
        supabase.from("kjorebok").select("id").eq("bruker_id", id),
      ]);

      setFaktura(fakt.data?.length || 0);
      setRapporter(rap.data?.length || 0);
      setKjorebok(kjore.data?.length || 0);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Dashboard | Frilansportalen</title>
      </Head>

      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Velkommen, {navn || "bruker"}!</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm mb-10">
          <Link href="/fakturering" className="bg-white border p-4 rounded shadow-sm hover:bg-gray-50">
            <p className="text-lg font-semibold mb-1">Faktura</p>
            <p>{faktura} sendt · Send ny</p>
          </Link>
          <Link href="/rapportarkiv" className="bg-white border p-4 rounded shadow-sm hover:bg-gray-50">
            <p className="text-lg font-semibold mb-1">Rapportarkiv</p>
            <p>{rapporter} rapporter lagret</p>
          </Link>
          <Link href="/kjorebok" className="bg-white border p-4 rounded shadow-sm hover:bg-gray-50">
            <p className="text-lg font-semibold mb-1">Kjørebok</p>
            <p>{kjorebok} turer registrert</p>
          </Link>
          <Link href="/dokumenter" className="bg-white border p-4 rounded shadow-sm hover:bg-gray-50">
            <p className="text-lg font-semibold mb-1">Mine dokumenter</p>
            <p>Fakturaer, rapporter og kvitteringer</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
