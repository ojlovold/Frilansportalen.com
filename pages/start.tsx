import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Startside() {
  const [publisert, setPublisert] = useState(false);

  const publiser = async () => {
    const bekreft = confirm("Publisere Frilansportalen?");
    if (!bekreft) return;

    const { data } = await supabase.from("systemstatus").select("id").limit(1).single();
    if (!data?.id) return;

    await supabase
      .from("systemstatus")
      .update({ publisert: true, sist_endret: new Date().toISOString() })
      .eq("id", data.id);

    setPublisert(true);
  };

  return (
    <Layout>
      <Head>
        <title>Publiser Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-6">Klar for publisering</h1>

        {publisert ? (
          <p className="text-green-600">Frilansportalen er nå publisert!</p>
        ) : (
          <button
            onClick={publiser}
            className="bg-black text-white px-6 py-3 rounded text-sm hover:bg-gray-800"
          >
            Publiser Frilansportalen
          </button>
        )}
      </div>
    </Layout>
  );
}
