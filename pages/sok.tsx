import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";

export default function Sok() {
  const [query, setQuery] = useState("");
  const [resultater, setResultater] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const søk = async () => {
    if (!query) return;
    setLoading(true);

    const [tjenester, stillinger, profiler] = await Promise.all([
      supabase.from("tjenester").select("*").ilike("tjeneste", `%${query}%`),
      supabase.from("stillinger").select("*").ilike("tittel", `%${query}%`),
      supabase.from("profiler").select("*").ilike("navn", `%${query}%`),
    ]);

    setResultater([
      ...(tjenester.data || []).map((r) => ({ type: "Tjeneste", ...r })),
      ...(stillinger.data || []).map((r) => ({ type: "Stilling", ...r })),
      ...(profiler.data || []).map((r) => ({ type: "Profil", ...r })),
    ]);

    setLoading(false);
  };

  return (
    <Layout>
      <Head>
        <title>Søk | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Globalt søk</h1>

      <div className="mb-6 max-w-xl flex gap-4">
        <input
          type="text"
          placeholder="Søk i stillinger, profiler, tjenester..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button
          onClick={søk}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Søk
        </button>
      </div>

      {loading ? (
        <p className="text-sm">Laster søk...</p>
      ) : resultater.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen treff funnet.</p>
      ) : (
        <ul className="text-sm space-y-4">
          {resultater.map((r, i) => (
            <li key={i}>
              <span className="font-semibold">{r.type}</span>:{" "}
              {r.navn || r.tjeneste || r.tittel || "Ukjent"}{" "}
              {r.type === "Profil" && (
                <Link href={`/profil/${r.id}`} className="text-blue-600 underline text-xs ml-2">
                  Vis profil
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
