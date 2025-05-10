import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Utlop() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const { data } = await supabase
        .from("attester")
        .select("*")
        .eq("bruker_id", id)
        .order("utløpsdato", { ascending: true });

      setData(data || []);
    };

    hent();
  }, []);

  const dagerIgjen = (dato: string) => {
    const diff = new Date(dato).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <Layout>
      <Head>
        <title>Utløpsdatoer | Frilansportalen</title>
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Utløpsdatoer</h1>

        {data.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen dokumenter med utløp er registrert.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {data.map((a, i) => (
              <li key={i} className="bg-white border p-4 rounded shadow-sm">
                <p className="font-semibold">{a.tittel}</p>
                <p className="text-xs text-gray-500">
                  Utløper: {new Date(a.utløpsdato).toLocaleDateString("no-NO")}  
                  {" · "}
                  {dagerIgjen(a.utløpsdato)} dager igjen
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
