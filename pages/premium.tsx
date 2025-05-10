import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Premium() {
  const [status, setStatus] = useState("");

  const aktiver = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const { error } = await supabase
      .from("profiler")
      .update({ premium: true })
      .eq("id", id);

    if (error) {
      setStatus("Det oppstod en feil.");
    } else {
      setStatus("Premium aktivert! Du har nå tilgang til ekstra funksjoner.");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Premium | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Oppgrader til Premium</h1>

        <ul className="list-disc list-inside mb-6 text-sm text-gray-700">
          <li>AI-veiledning i stillinger og søknader</li>
          <li>Tilgang til fagbibliotek</li>
          <li>Automatiske søkefiltre tilpasset din CV</li>
          <li>Høyere synlighet i søkeresultater</li>
        </ul>

        <button
          onClick={aktiver}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Aktiver premium (100 kr/år)
        </button>

        {status && <p className="text-sm text-green-600 mt-4">{status}</p>}
      </div>
    </Layout>
  );
}
