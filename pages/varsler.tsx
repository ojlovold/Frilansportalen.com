import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Varsler() {
  const [varsler, setVarsler] = useState<any[]>([]);
  const [laster, setLaster] = useState(true);

  useEffect(() => {
    const hentVarsler = async () => {
      const { data, error } = await supabase
        .from("varsler")
        .select("*")
        .eq("bruker_id", (await supabase.auth.getUser()).data.user?.id)
        .order("opprettet_dato", { ascending: false });

      if (!error && data) setVarsler(data);
      setLaster(false);
    };

    hentVarsler();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Varsler | Frilansportalen</title>
        <meta name="description" content="Dine varsler og systemmeldinger i Frilansportalen" />
      </Head>

      <main className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Varsler</h1>

        {laster ? (
          <p>Laster varsler...</p>
        ) : varsler.length === 0 ? (
          <p>Du har ingen varsler akkurat nå.</p>
        ) : (
          <ul className="space-y-4">
            {varsler.map((v) => (
              <li key={v.id} className="bg-white border rounded p-4 shadow-sm">
                <p className="text-sm text-gray-600">{new Date(v.opprettet_dato).toLocaleString("no-NO")}</p>
                <p className="text-base mt-1">{v.tekst}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </Layout>
  );
}
