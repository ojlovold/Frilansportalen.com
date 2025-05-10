import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";

export default function Profiler() {
  const [profiler, setProfiler] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [rolle, setRolle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("profiler")
        .select("id, navn, bilde, rolle, synlig_for")
        .order("navn", { ascending: true });

      const synlige = (data || []).filter((p) =>
        ["alle", "frilanser", "jobbsøker"].includes(p.synlig_for || "alle")
      );

      setProfiler(synlige);
      setLoading(false);
    };

    hent();
  }, []);

  const filtrert = profiler.filter((p) => {
    const navnMatch = p.navn?.toLowerCase().includes(filter.toLowerCase());
    const rolleMatch = !rolle || p.rolle === rolle;
    return navnMatch && rolleMatch;
  });

  return (
    <Layout>
      <Head>
        <title>Brukere | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Brukeroversikt</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 text-sm">
        <input
          type="text"
          placeholder="Søk på navn..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />
        <select
          value={rolle}
          onChange={(e) => setRolle(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        >
          <option value="">Alle roller</option>
          <option value="frilanser">Frilansere</option>
          <option value="jobbsøker">Jobbsøkere</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm">Laster brukere...</p>
      ) : filtrert.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen profiler funnet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrert.map(({ id, navn, bilde, rolle }) => (
            <Link
              key={id}
              href={`/profil/${id}`}
              className="bg-white border border-black rounded p-4 text-sm flex items-center gap-4 hover:bg-gray-50"
            >
              <img
                src={bilde || "/placeholder.png"}
                alt={navn || "Ukjent"}
                className="w-12 h-12 rounded-full object-cover bg-gray-200"
              />
              <div>
                <p className="font-semibold">{navn}</p>
                <p className="text-xs text-gray-600 capitalize">{rolle}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
