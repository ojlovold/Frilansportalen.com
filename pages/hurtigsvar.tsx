import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Hurtigsvar() {
  const [liste, setListe] = useState<any[]>([]);
  const [nytt, setNytt] = useState("");
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const { data } = await supabase
        .from("hurtigsvar")
        .select("*")
        .eq("bruker_id", id)
        .order("opprettet_dato", { ascending: false });

      setListe(data || []);
    };

    hent();
  }, []);

  const leggTil = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!nytt.trim() || !id) return;

    const { error } = await supabase.from("hurtigsvar").insert({
      bruker_id: id,
      tekst: nytt,
    });

    if (error) {
      setMelding("Feil ved lagring.");
    } else {
      setMelding("Hurtigsvar lagret.");
      setNytt("");
      window.location.reload();
    }
  };

  return (
    <Layout>
      <Head>
        <title>Hurtigsvar | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Mine hurtigsvar</h1>

        <textarea
          value={nytt}
          onChange={(e) => setNytt(e.target.value)}
          placeholder="Skriv nytt hurtigsvar..."
          className="w-full h-24 p-2 border rounded mb-3 resize-none"
        />
        <button
          onClick={leggTil}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
        >
          Legg til hurtigsvar
        </button>

        {melding && <p className="text-sm text-green-600 mt-2">{melding}</p>}

        <ul className="mt-6 space-y-3 text-sm">
          {liste.map((s: any, i: number) => (
            <li key={i} className="bg-white border p-3 rounded shadow-sm">{s.tekst}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
