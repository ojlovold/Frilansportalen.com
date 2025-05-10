import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function RapportArkiv() {
  const [rapporter, setRapporter] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const { data, error } = await supabase
        .from("rapportarkiv")
        .select("*")
        .eq("bruker_id", id)
        .order("opprettet_dato", { ascending: false });

      if (!error && data) setRapporter(data);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Rapportarkiv | Frilansportalen</title>
      </Head>

      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Rapportarkiv</h1>

        <ul className="divide-y border rounded">
          {rapporter.map((r) => (
            <li key={r.id} className="p-4 flex justify-between items-center text-sm">
              <div>
                <p className="font-semibold">{r.navn}</p>
                <p className="text-gray-500">{new Date(r.opprettet_dato).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded text-white text-xs ${
                r.sendt_altinn ? "bg-green-600" : "bg-yellow-500"
              }`}>
                {r.sendt_altinn ? "Sendt" : "Ikke sendt"}
              </span>
            </li>
          ))}

          {rapporter.length === 0 && (
            <li className="p-4 text-gray-500 text-sm text-center">Ingen rapporter funnet.</li>
          )}
        </ul>
      </div>
    </Layout>
  );
}
