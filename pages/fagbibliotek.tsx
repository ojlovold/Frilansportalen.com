import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";

export default function Fagbibliotek() {
  const [artikler, setArtikler] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase.from("fagbibliotek").select("*").order("opprettet_dato", { ascending: false });
      setArtikler(data || []);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Fagbibliotek | Frilansportalen</title>
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Fagbibliotek</h1>

        {artikler.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen faginnhold er publisert ennå.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {artikler.map((a, i) => (
              <li key={i} className="bg-white border rounded p-4 shadow-sm">
                <p className="font-semibold">{a.tittel}</p>
                <p className="text-gray-600 text-xs mb-1">{new Date(a.opprettet_dato).toLocaleDateString("no-NO")}</p>
                <p>{a.beskrivelse}</p>
                {a.fil && (
                  <Link href={a.fil} target="_blank" className="text-xs underline text-blue-600 hover:text-blue-800">
                    Last ned
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
