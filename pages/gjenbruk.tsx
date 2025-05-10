import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Gjenbruk() {
  const [annonser, setAnnonser] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("gjenbruk")
        .select("*")
        .order("opprettet_dato", { ascending: false });

      setAnnonser(data || []);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Gjenbruk | Frilansportalen</title>
      </Head>

      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Gjenbruksportalen</h1>

        {annonser.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen gjenbruksannonser er publisert ennå.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {annonser.map((a) => (
              <li key={a.id} className="bg-white border rounded p-4 shadow-sm">
                <h2 className="font-semibold text-lg">{a.tittel}</h2>
                <p className="text-xs text-gray-500 mb-1">
                  {new Date(a.opprettet_dato).toLocaleString("no-NO")} · {a.sted}
                </p>
                <p>{a.beskrivelse}</p>
                {a.kontakt && (
                  <p className="text-xs text-gray-600 mt-2">Kontakt: {a.kontakt}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
