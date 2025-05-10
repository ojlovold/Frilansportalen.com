import Head from "next/head";
import Layout from "../../components/Layout";
import { supabase } from "../../utils/supabaseClient";
import { useState } from "react";

export default function Lukk() {
  const [utført, setUtført] = useState(false);

  const stopp = async () => {
    const bekreft = confirm("Er du sikker på at du vil deaktivere hele portalen?");
    if (!bekreft) return;

    await supabase.from("backupstatus").insert({
      status: "stoppet",
      detaljer: "Portalen er manuelt deaktivert av eier.",
    });

    setUtført(true);
  };

  return (
    <Layout>
      <Head>
        <title>Lukk plattformen | Admin</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Stopp Frilansportalen</h1>

      <p className="text-sm mb-4 max-w-md">
        Denne funksjonen lar deg midlertidig deaktivere hele portalen. Dette bør kun gjøres ved alvorlige feil eller teknisk vedlikehold.
      </p>

      {utført ? (
        <p className="text-green-600 text-sm">Portalen er nå satt til inaktiv.</p>
      ) : (
        <button
          onClick={stopp}
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 text-sm"
        >
          Deaktiver portalen midlertidig
        </button>
      )}
    </Layout>
  );
}
