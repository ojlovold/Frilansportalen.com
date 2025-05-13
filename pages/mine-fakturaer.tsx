import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

type Faktura = {
  id: string;
  bruker_id: string;
  tjeneste: string;
  belop: number;
  opprettet_dato: string;
  filnavn: string;
};

export default function MineFakturaer() {
  const [fakturaer, setFakturaer] = useState<Faktura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hent = async () => {
      const { data: brukerData } = await supabase.auth.getUser();
      const id = brukerData?.user?.id;
      if (!id) return;

      const { data, error } = await supabase
        .from("fakturaer")
        .select("*")
        .eq("bruker_id", id)
        .order("opprettet_dato", { ascending: false });

      if (!error && data) {
        setFakturaer(data as Faktura[]);
      }
      setLoading(false);
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

        {loading ? (
          <p>Laster...</p>
        ) : fakturaer.length === 0 ? (
          <p className="text-sm text-gray-600">Du har ikke sendt noen fakturaer ennå.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {fakturaer.map((f) => (
              <li key={f.id} className="bg-white border rounded p-4 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">{f.tjeneste}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(f.opprettet_dato).toLocaleDateString("no-NO")} · {f.belop} kr
                  </p>
                </div>
                <a
                  href={`https://<your-supabase-project>.supabase.co/storage/v1/object/public/faktura-filer/${f.filnavn}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-xs"
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
