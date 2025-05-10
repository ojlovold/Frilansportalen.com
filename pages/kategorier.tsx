import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Kategorier() {
  const [liste, setListe] = useState<any[]>([]);
  const [ny, setNy] = useState("");
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase.from("kategorier").select("*").order("tittel");
      setListe(data || []);
    };
    hent();
  }, []);

  const leggTil = async () => {
    if (!ny.trim()) return;
    const { error } = await supabase.from("kategorier").insert({ tittel: ny.trim() });
    if (error) {
      setMelding("Kunne ikke legge til.");
    } else {
      setMelding("Lagt til!");
      setNy("");
      window.location.reload();
    }
  };

  return (
    <Layout>
      <Head>
        <title>Kategorier | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Kategorier og yrker</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Foreslå ny kategori eller yrkestittel"
            value={ny}
            onChange={(e) => setNy(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={leggTil}
            className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
          >
            Legg til
          </button>
          {melding && <p className="text-sm text-green-600 mt-2">{melding}</p>}
        </div>

        <ul className="text-sm bg-white border rounded p-4 space-y-2">
          {liste.map((k, i) => (
            <li key={i}>{k.tittel}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
