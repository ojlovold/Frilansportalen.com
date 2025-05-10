import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import AccessibilityPanel from "../components/AccessibilityPanel";

export default function Stillinger() {
  const [alle, setAlle] = useState<any[]>([]);
  const [resultat, setResultat] = useState<any[]>([]);
  const [sted, setSted] = useState("");
  const [type, setType] = useState("");
  const [kategori, setKategori] = useState("");
  const [dato, setDato] = useState("");

  useEffect(() => {
    const hentStillinger = async () => {
      const { data } = await supabase.from("stillinger").select("*").order("opprettet", { ascending: false });
      setAlle(data || []);
      setResultat(data || []);
    };

    hentStillinger();
  }, []);

  useEffect(() => {
    let filtrert = [...alle];

    if (sted) filtrert = filtrert.filter((s) => s.sted?.toLowerCase().includes(sted.toLowerCase()));
    if (type) filtrert = filtrert.filter((s) => s.type === type);
    if (kategori) filtrert = filtrert.filter((s) => s.kategori === kategori);

    if (dato) {
      const nå = new Date();
      filtrert = filtrert.filter((s) => {
        const publisert = new Date(s.opprettet);
        const diffDager = (nå.getTime() - publisert.getTime()) / (1000 * 60 * 60 * 24);
        if (dato === "24t") return diffDager <= 1;
        if (dato === "uke") return diffDager <= 7;
        if (dato === "måned") return diffDager <= 30;
        return true;
      });
    }

    setResultat(filtrert);
  }, [sted, type, kategori, dato, alle]);

  return (
    <Layout>
      <Head>
        <title>Ledige stillinger | Frilansportalen</title>
      </Head>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtrering */}
        <aside className="w-full lg:w-64 border border-black rounded-xl bg-gray-50 p-4 text-sm">
          <h2 className="font-semibold text-lg mb-4">Filtrer stillinger</h2>

          <label className="block mb-3">
            <span className="block mb-1">Sted</span>
            <input
              type="text"
              value={sted}
              onChange={(e) => setSted(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="F.eks. Oslo"
            />
          </label>

          <label className="block mb-3">
            <span className="block mb-1">Stillingstype</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Alle</option>
              <option value="Heltid">Heltid</option>
              <option value="Deltid">Deltid</option>
              <option value="Oppdrag">Oppdrag</option>
            </select>
          </label>

          <label className="block mb-3">
            <span className="block mb-1">Bransje</span>
            <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Alle</option>
              <option value="IT">IT</option>
              <option value="Bygg">Bygg</option>
              <option value="Kreativ">Kreativ</option>
              <option value="Annet">Annet</option>
            </select>
          </label>

          <label className="block">
            <span className="block mb-1">Publisert</span>
            <select value={dato} onChange={(e) => setDato(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Alle</option>
              <option value="24t">Siste 24 timer</option>
              <option value="uke">Siste uke</option>
              <option value="måned">Siste måned</option>
            </select>
          </label>
        </aside>

        {/* Stillingsvisning */}
        <main className="flex-1 grid gap-6">
          <h1 className="text-2xl font-bold mb-2">Ledige stillinger</h1>

          {resultat.length === 0 ? (
            <p className="text-sm text-gray-600">Ingen stillinger funnet med disse kriteriene.</p>
          ) : (
            resultat.map((s, i) => {
              const annonsetekst = `${s.tittel}. Lokasjon: ${s.sted}. Type: ${s.type}. Bransje: ${s.kategori}. Beskrivelse: ${s.beskrivelse || ""}`;
              return (
                <div key={i} className="border border-black bg-white rounded-xl p-4 shadow space-y-2">
                  <h2 className="text-lg font-semibold">{s.tittel}</h2>
                  <p className="text-sm text-gray-700">
                    {s.sted} • {s.type} • {s.kategori}
                  </p>
                  <p className="text-xs text-gray-500">Publisert: {new Date(s.opprettet).toLocaleDateString()}</p>

                  <AccessibilityPanel tekst={annonsetekst} />
                </div>
              );
            })
          )}
        </main>
      </div>
    </Layout>
  );
}
