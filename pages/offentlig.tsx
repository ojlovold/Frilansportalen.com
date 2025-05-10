import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Offentlig() {
  const [offentlig, setOffentlig] = useState(true);
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data } = await supabase.from("profiler").select("offentlig").eq("id", id).single();
      if (data?.offentlig !== undefined) setOffentlig(data.offentlig);
    };

    hent();
  }, []);

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const { error } = await supabase.from("profiler").update({ offentlig }).eq("id", id);
    if (error) {
      setMelding("Feil under lagring.");
    } else {
      setMelding("Synlighet oppdatert.");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Offentlig profil | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Offentlig profil</h1>

        <label className="flex items-center mb-4 text-sm">
          <input
            type="checkbox"
            checked={offentlig}
            onChange={(e) => setOffentlig(e.target.checked)}
            className="mr-2"
          />
          Gjør profilen min synlig for andre brukere
        </label>

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
