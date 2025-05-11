import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Profilsøk() {
  const [profiler, setProfiler] = useState<any[]>([]);
  const [maxPris, setMaxPris] = useState<number | null>(null);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("profiler")
        .select("id, navn, rolle, timespris, opprettet_dato")
        .neq("rolle", "admin");

      setProfiler(data || []);
    };

    hent();
  }, []);

  const filtrert = profiler.filter((p) =>
    maxPris ? p.timespris <= maxPris : true
  );

  return (
    <Layout>
      <Head>
        <title>Finn frilansere og jobbsøkere</title>
      </Head>

      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Profiler</h1>

        <div className="mb-6 flex gap-4 items-center">
          <label className="text-sm">
            Makspris (kr/t):
            <input
              type="number"
              value={maxPris || ""}
              onChange={(e) => setMaxPris(e.target.value ? parseInt(e.target.value) : null)}
              className="ml-2 p-1 border rounded w-28"
              placeholder="Eks. 800"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtrert.map((profil, i) => (
            <div key={i} className="bg-white border p-4 rounded shadow-sm text-sm">
              <h2 className="font-semibold text-lg mb-1">{profil.navn}</h2>
              <p className="text-gray-600">Rolle: {profil.rolle}</p>
              {profil.timespris && (
                <p className="text-gray-700">
                  <strong>Timespris:</strong> {profil.timespris} kr/t
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Sist oppdatert: {new Date(profil.opprettet_dato).toLocaleDateString("no-NO")}
              </p>
            </div>
          ))}
        </div>

        {filtrert.length === 0 && (
          <p className="text-gray-500 text-sm mt-6">Ingen profiler matcher valgt filter.</p>
        )}
      </div>
    </Layout>
  );
}
