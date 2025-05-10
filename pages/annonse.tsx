import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Annonser() {
  const [annonser, setAnnonser] = useState<any[]>([]);
  const [kategori, setKategori] = useState("alle");

  useEffect(() => {
    const hent = async () => {
      const [stillinger, gjenbruk] = await Promise.all([
        supabase.from("stillinger").select("id, tittel, sted, type, bransje, opprettet_dato, 'stilling'::text as kategori"),
        supabase.from("gjenbruk").select("id, tittel, sted, '' as type, '' as bransje, opprettet_dato, 'gjenbruk'::text as kategori"),
      ]);

      setAnnonser([
        ...(stillinger.data || []),
        ...(gjenbruk.data || []),
      ]);
    };

    hent();
  }, []);

  const filtrert = kategori === "alle"
    ? annonser
    : annonser.filter((a) => a.kategori === kategori);

  return (
    <Layout>
      <Head>
        <title>Alle annonser | Frilansportalen</title>
      </Head>

      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Alle annonser</h1>

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="mb-6 p-2 border rounded"
        >
          <option value="alle">Alle kategorier</option>
          <option value="stilling">Stillinger</option>
          <option value="gjenbruk">Gjenbruk</option>
        </select>

        {filtrert.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen annonser funnet.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {filtrert.map((a, i) => (
              <li key={i} className="bg-white border p-4 rounded shadow-sm">
                <h2 className="text-lg font-semibold">{a.tittel}</h2>
                <p className="text-xs text-gray-600">
                  {a.sted} · {a.bransje || a.kategori} · {new Date(a.opprettet_dato).toLocaleDateString("no-NO")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
