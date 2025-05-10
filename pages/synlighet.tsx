import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Synlighet() {
  const [godkjente, setGodkjente] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data } = await supabase
        .from("foresporsler")
        .select("fra, opprettet_dato")
        .eq("til", id)
        .eq("godkjent", true);

      setGodkjente(data || []);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Godkjent tilgang | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Hvem har tilgang til profilen min?</h1>

        {godkjente.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen har fått individuell tilgang ennå.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {godkjente.map((g, i) => (
              <li key={i} className="bg-white border p-4 rounded shadow-sm">
                <p>Bruker-ID: {g.fra}</p>
                <p className="text-xs text-gray-500">
                  Godkjent: {new Date(g.opprettet_dato).toLocaleString("no-NO")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
