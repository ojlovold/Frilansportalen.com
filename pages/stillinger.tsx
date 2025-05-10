import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Stillinger() {
  const [stillinger, setStillinger] = useState<any[]>([]);
  const [filter, setFilter] = useState({ sted: "", type: "", bransje: "" });

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase.from("stillinger").select("*").order("opprettet_dato", { ascending: false });
      setStillinger(data || []);
    };

    hent();
  }, []);

  const filtrert = stillinger.filter((s) =>
    (!filter.sted || s.sted?.toLowerCase().includes(filter.sted.toLowerCase())) &&
    (!filter.type || s.type === filter.type) &&
    (!filter.bransje || s.bransje?.toLowerCase().includes(filter.bransje.toLowerCase()))
  );

  return (
    <Layout>
      <Head>
        <title>Stillinger | Frilansportalen</title>
      </Head>

      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Ledige stillinger</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
          <input
            type="text"
            placeholder="Sted"
            value={filter.sted}
            onChange={(e) => setFilter({ ...filter, sted: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Alle typer</option>
            <option value="heltid">Heltid</option>
            <option value="deltid">Deltid</option>
            <option value="oppdrag">Oppdrag</option>
          </select>
          <input
            type="text"
            placeholder="Bransje"
            value={filter.bransje}
            onChange={(e) => setFilter({ ...filter, bransje: e.target.value })}
            className="p-2 border rounded"
          />
        </div>

        {filtrert.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen stillinger funnet.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {filtrert.map((s, i) => (
              <li key={i} className="bg-white border p-4 rounded shadow-sm">
                <h2 className="text-lg font-semibold">{s.tittel}</h2>
                <p className="text-xs text-gray-600">{s.sted} · {s.type}</p>
                <p className="mt-1">{s.beskrivelse}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
