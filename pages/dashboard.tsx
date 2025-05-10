import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Dashboard() {
  const [navn, setNavn] = useState("");
  const [antallFakturaer, setAntallFakturaer] = useState(0);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const profil = await supabase.from("profiler").select("navn").eq("id", id).single();
      if (profil.data?.navn) setNavn(profil.data.navn);

      const fakturaer = await supabase.from("fakturaer").select("id").eq("bruker_id", id);
      setAntallFakturaer(fakturaer.data?.length || 0);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Dashboard | Frilansportalen</title>
      </Head>

      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Velkommen, {navn || "bruker"}!</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-10">
          <Link href="/fakturering" className="bg-white border p-4 rounded shadow-sm hover:bg-gray-50">
            <p className="text-lg font-semibold mb-1">Faktura</p>
            <p>{antallFakturaer} sendt · Send ny faktura</p>
          </Link>
          <Link href="/rapportarkiv" className="bg-white border p-4 rounded shadow-sm hover:bg-gray-50">
            <p className="text-lg font-semibold mb-1">Rapportarkiv</p>
            <p>Lagrede PDF-rapporter og årsoppgjør</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
