import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Tilgang() {
  const [valg, setValg] = useState("alle");
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data } = await supabase.from("profiler").select("synlig_for").eq("id", id).single();
      if (data?.synlig_for) setValg(data.synlig_for);
    };

    hent();
  }, []);

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const { error } = await supabase.from("profiler").update({ synlig_for: valg }).eq("id", id);
    if (error) {
      setMelding("Feil under lagring.");
    } else {
      setMelding("Innstilling lagret.");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Profiltilgang | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Hvem kan se profilen min?</h1>

        <select
          value={valg}
          onChange={(e) => setValg(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="alle">Alle</option>
          <option value="arbeidsgivere">Kun arbeidsgivere</option>
          <option value="frilansere">Kun frilansere</option>
          <option value="jobbsøkere">Kun jobbsøkere</option>
          <option value="ingen">Ingen (skjul helt)</option>
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
