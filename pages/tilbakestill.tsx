import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Tilbakestill() {
  const [passord, setPassord] = useState("");
  const [melding, setMelding] = useState("");

  const endrePassord = async () => {
    const { error } = await supabase.auth.updateUser({ password: passord });
    if (error) {
      setMelding("Feil: " + error.message);
    } else {
      setMelding("Passord endret! Du kan nå logge inn.");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Tilbakestill passord | Frilansportalen</title>
      </Head>

      <div className="max-w-sm mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Tilbakestill passord</h1>
        <input
          type="password"
          placeholder="Nytt passord"
          value={passord}
          onChange={(e) => setPassord(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={endrePassord}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Endre passord
        </button>
        {melding && <p className="mt-4 text-sm text-center text-green-700">{melding}</p>}
      </div>
    </Layout>
  );
}
