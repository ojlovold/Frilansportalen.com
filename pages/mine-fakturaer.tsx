import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function MineFakturaer() {
  const [fakturaer, setFakturaer] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const { data } = await supabase
        .from("fakturaer")
        .select("*")
        .eq("bruker_id", id)
        .order("opprettet_dato", { ascending: false });

      setFakturaer(data || []);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Mine fakturaer | Frilansportalen</title>
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Fakturaarkiv</h1>

        {fakturaer.length === 0 ? (
          <p className="text-sm text-gray-600">Du har ikke sendt noen fakturaer ennå.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {fakturaer.map((f, i) => (
              <li key={i} className="bg-white border rounded p-4 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">{f.tjeneste}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(f.opprettet_dato).toLocaleDateString("no-NO")} · {f.belop} kr
                  </p>
                </div>
                <a
                  href={`https://<your-supabase-project>.supabase.co/storage/v1/object/public/faktura-filer/${f.filnavn}`}
                  target="_blank"
                  className="text-blue-600 underline text-xs"
                  rel="noreferrer"
                >
                  Last ned
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
