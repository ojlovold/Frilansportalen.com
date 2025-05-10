import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Foresporsler() {
  const [forespørsler, setForespørsler] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data } = await supabase
        .from("foresporsler")
        .select("id, fra, opprettet_dato")
        .eq("til", id)
        .order("opprettet_dato", { ascending: false });

      setForespørsler(data || []);
    };

    hent();
  }, []);

  const godkjenn = async (id: string) => {
    await supabase.from("foresporsler").update({ godkjent: true }).eq("id", id);
    window.location.reload();
  };

  return (
    <Layout>
      <Head>
        <title>Forespørsler | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Forespørsler om profiltilgang</h1>

        {forespørsler.length === 0 ? (
          <p className="text-sm text-gray-600">Du har ingen forespørsler akkurat nå.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {forespørsler.map((f) => (
              <li key={f.id} className="bg-white border rounded p-4 shadow-sm">
                <p className="mb-1">Bruker ID: {f.fra}</p>
                <p className="text-xs text-gray-500">
                  Mottatt: {new Date(f.opprettet_dato).toLocaleString("no-NO")}
                </p>
                <button
                  onClick={() => godkjenn(f.id)}
                  className="mt-2 bg-black text-white px-4 py-1 rounded text-xs hover:bg-gray-800"
                >
                  Godkjenn forespørsel
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
