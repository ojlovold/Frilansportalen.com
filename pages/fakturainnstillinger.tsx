import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import SuccessBox from "../components/SuccessBox";

export default function FakturaInnstillinger() {
  const [kontonr, setKontonr] = useState("");
  const [referanse, setReferanse] = useState("");
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      const { data } = await supabase.from("profiler").select("kontonr, fakturareferanse").eq("id", id).single();
      if (data) {
        setKontonr(data.kontonr || "");
        setReferanse(data.fakturareferanse || "");
      }
    };
    hent();
  }, []);

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    const { error } = await supabase
      .from("profiler")
      .update({ kontonr, fakturareferanse: referanse })
      .eq("id", id);
    setMelding(error ? "Feil under lagring" : "Fakturainnstillinger lagret");
  };

  return (
    <Layout>
      <Head><title>Fakturainnstillinger</title></Head>
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Fakturainnstillinger</h1>

        <input value={kontonr} onChange={(e) => setKontonr(e.target.value)} placeholder="Kontonummer" className="w-full p-2 border rounded mb-4" />
        <input value={referanse} onChange={(e) => setReferanse(e.target.value)} placeholder="Referanse" className="w-full p-2 border rounded mb-4" />
        <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800">Lagre</button>

        <SuccessBox melding={melding} />
      </div>
    </Layout>
  );
}
