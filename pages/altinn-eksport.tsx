import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function AltinnEksport() {
  const [fakturaer, setFakturaer] = useState<any[]>([]);
  const [arsoppgjor, setArsoppgjor] = useState<any[]>([]);
  const [mva, setMva] = useState<any[]>([]);

  useEffect(() => {
    const hentData = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data: f } = await supabase
        .from("fakturaer")
        .select("*")
        .eq("opprettet_av", id);

      const { data: a } = await supabase
        .from("arsoppgjor")
        .select("*")
        .eq("bruker_id", id);

      const { data: m } = await supabase
        .from("mva")
        .select("*")
        .eq("bruker_id", id);

      setFakturaer(f || []);
      setArsoppgjor(a || []);
      setMva(m || []);
    };

    hentData();
  }, []);

  const genererEksport = () => {
    const data = {
      fakturaer,
      arsoppgjor,
      mva,
      eksportert: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "altinn-eksport.json";
    a.click();
  };

  return (
    <Layout>
      <Head>
        <title>Altinn-eksport | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Eksport til Altinn</h1>

      <p className="text-sm mb-6">
        Her kan du hente ut en samlet eksport av fakturaer, årsoppgjør og MVA. Filen lagres som en
        strukturet JSON som kan brukes for arkivering eller rapportering.
      </p>

      <button
        onClick={genererEksport}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 text-sm"
      >
        Last ned Altinn-eksport
      </button>
    </Layout>
  );
}
