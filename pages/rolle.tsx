import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Rolle() {
  const [rolle, setRolle] = useState("");
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data } = await supabase.from("profiler").select("rolle").eq("id", id).single();
      if (data?.rolle) setRolle(data.rolle);
    };

    hent();
  }, []);

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const { error } = await supabase.from("profiler").update({ rolle }).eq("id", id);
    if (error) {
      setMelding("Feil under lagring.");
    } else {
      setMelding("Rolle lagret.");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Velg rolle | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Hvilken rolle har du?</h1>

        <select
          value={rolle}
          onChange={(e) => setRolle(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Velg rolle</option>
          <option value="frilanser">Frilanser</option>
          <option value="jobbsøker">Jobbsøker</option>
        </select>

        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
        >
          Lagre
        </button>

        {melding && <p className="text-green-600 text-sm mt-4">{melding}</p>}
      </div>
    </Layout>
  );
}
