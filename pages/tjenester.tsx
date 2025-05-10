import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Tjenester() {
  const [tilbydere, setTilbydere] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase
        .from("tjenester")
        .select("navn, tjeneste, sted, beskrivelse")
        .order("opprettet_dato", { ascending: false });

      if (!error && data) {
        setTilbydere(data);
      }
    };
    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Tjenester | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Tjenestetilbydere</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tilbydere.map(({ navn, tjeneste, sted, beskrivelse }, i) => (
          <div key={i} className="border border-black bg-gray-100 rounded-xl p-4">
            <h2 className="text-lg font-semibold">{navn}</h2>
            <p className="text-sm text-gray-600 mt-1">{tjeneste}</p>
            <p className="text-sm text-gray-600">{sted}</p>
            <p className="text-sm text-gray-800 mt-2">{beskrivelse}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/tjenester/ny" className="underline text-sm hover:text-black">
          Legg til ny tjeneste
        </Link>
      </div>
    </Layout>
  );
}
