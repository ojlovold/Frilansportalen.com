import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Kjorebok() {
  const [tur, setTur] = useState({ fra: "", til: "", km: 0 });
  const [logg, setLogg] = useState<any[]>([]);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const { data } = await supabase
        .from("kjorebok")
        .select("*")
        .eq("bruker_id", id)
        .order("dato", { ascending: false });

      setLogg(data || []);
    };

    hent();
  }, []);

  const leggTil = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id || !tur.fra || !tur.til || !tur.km) return;

    await supabase.from("kjorebok").insert({
      bruker_id: id,
      fra: tur.fra,
      til: tur.til,
      km: tur.km,
      sats: 4.23,
      dato: new Date().toISOString(),
    });

    setTur({ fra: "", til: "", km: 0 });
    window.location.reload();
  };

  useEffect(() => {
    const total = logg.reduce((acc, t) => acc + (t.km * (t.sats || 0)), 0);
    setSum(total);
  }, [logg]);

  return (
    <Layout>
      <Head>
        <title>Kjørebok | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Kjørebok</h1>

        <input
          value={tur.fra}
          onChange={(e) => setTur({ ...tur, fra: e.target.value })}
          placeholder="Fra"
          className="w-full p-2 border rounded mb-3"
        />
        <input
          value={tur.til}
          onChange={(e) => setTur({ ...tur, til: e.target.value })}
          placeholder="Til"
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="number"
          value={tur.km}
          onChange={(e) => setTur({ ...tur, km: parseFloat(e.target.value) })}
          placeholder="Kilometer"
          className="w-full p-2 border rounded mb-3"
        />

        <button
          onClick={leggTil}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
        >
          Legg til tur
        </button>

        <h2 className="text-lg font-semibold mt-8 mb-3">Logg</h2>

        <ul className="text-sm space-y-2">
          {logg.map((t, i) => (
            <li key={i} className="bg-white border p-3 rounded shadow-sm">
              {t.fra} → {t.til} ({t.km} km) · {new Date(t.dato).toLocaleDateString("no-NO")}  
              · {Math.round(t.km * (t.sats || 0))} kr
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm">
          Total godtgjørelse: <strong>{sum.toFixed(2)} kr</strong>
        </p>
      </div>
    </Layout>
  );
}
