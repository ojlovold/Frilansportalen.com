import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";

export default function Favoritter() {
  const [favoritter, setFavoritter] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data } = await supabase
        .from("favoritter")
        .select("*")
        .eq("bruker_id", id)
        .order("lagret", { ascending: false });

      setFavoritter(data || []);
    };

    hent();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Mine favoritter | Frilansportalen</title>
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Lagrede annonser</h1>

        {favoritter.length === 0 ? (
          <p className="text-sm text-gray-600">Du har ikke lagret noen annonser ennå.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {favoritter.map((f) => (
              <li key={f.id} className="bg-white border p-4 rounded shadow-sm">
                <p className="font-semibold">{f.tittel}</p>
                <p className="text-xs text-gray-600">{f.type} · {f.kilde}</p>
                <Link
                  href={f.lenke}
                  className="text-blue-600 underline text-xs hover:text-blue-800"
                  target="_blank"
                >
                  Gå til annonse
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
