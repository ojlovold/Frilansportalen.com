import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Anbud() {
  const [anbud, setAnbud] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const { data } = await supabase
        .from("anbud")
        .select("*")
        .eq("bruker_id", id)
        .order("opprettet_dato", { ascending: false });

      setAnbud(data || []);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Anbud | Frilansportalen</title>
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Mine anbud</h1>

        {anbud.length === 0 ? (
          <p className="text-sm text-gray-600">Du har ikke registrert noen anbud ennå.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {anbud.map((a, i) => (
              <li key={i} className="bg-white border rounded p-4 shadow-sm">
                <p className="font-semibold text-lg mb-1">{a.tittel}</p>
                <p>Estimert pris: {a.pris} kr</p>
                <p className="text-xs text-gray-500">{new Date(a.opprettet_dato).toLocaleDateString("no-NO")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
