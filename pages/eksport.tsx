import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Eksport() {
  const [klar, setKlar] = useState(false);
  const [jsonBlob, setJsonBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const tabeller = [
        "profiler",
        "fakturaer",
        "kontrakter",
        "cv",
        "meldinger",
        "tjenester",
        "arsoppgjor",
        "mva",
        "varsler",
        "anbud",
      ];

      const resultat: any = {};

      for (const t of tabeller) {
        const { data } = await supabase.from(t).select("*").eq("opprettet_av", id);
        resultat[t] = data;
      }

      const blob = new Blob([JSON.stringify(resultat, null, 2)], {
        type: "application/json",
      });

      setJsonBlob(blob);
      setKlar(true);
    };

    hent();
  }, []);

  const lastNed = () => {
    if (!jsonBlob) return;
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mine_data.json";
    a.click();
  };

  return (
    <Layout>
      <Head>
        <title>Dataeksport | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Eksporter dine data</h1>

      <p className="text-sm max-w-lg mb-6">
        Her kan du laste ned en kopi av all informasjon Frilansportalen har lagret om deg. Dette
        inkluderer fakturaer, dokumenter, meldinger og profilopplysninger.
      </p>

      {klar ? (
        <button
          onClick={lastNed}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Last ned JSON-fil
        </button>
      ) : (
        <p className="text-sm text-gray-600">Forbereder datafil...</p>
      )}
    </Layout>
  );
}
