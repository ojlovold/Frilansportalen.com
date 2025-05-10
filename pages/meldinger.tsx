import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Meldinger() {
  const [meldinger, setMeldinger] = useState<any[]>([]);
  const [ny, setNy] = useState("");
  const [valgtId, setValgtId] = useState<string | null>(null);
  const [hurtigsvar, setHurtigsvar] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const { data: meldingerData } = await supabase
        .from("meldinger")
        .select("*")
        .or(`fra.eq.${id},til.eq.${id}`)
        .order("tidspunkt", { ascending: false });

      setMeldinger(meldingerData || []);

      const { data: svar } = await supabase
        .from("hurtigsvar")
        .select("*")
        .eq("bruker_id", id)
        .order("opprettet_dato", { ascending: false });

      setHurtigsvar(svar || []);
    };

    hent();
  }, []);

  const send = async (tekst: string) => {
    const bruker = await supabase.auth.getUser();
    const fra = bruker.data.user?.id;
    if (!fra || !valgtId) return;

    const original = meldinger.find((m) => m.id === valgtId);
    if (!original) return;

    const til = original.fra === fra ? original.til : original.fra;

    await supabase.from("meldinger").insert({
      fra,
      til,
      tekst,
      tidspunkt: new Date().toISOString(),
    });

    await supabase.from("varsler").insert({
      bruker_id: til,
      tekst: "Du har fått en ny melding",
      lenke: "/meldinger",
    });

    setNy("");
    setValgtId(null);
    window.location.reload();
  };

  return (
    <Layout>
      <Head>
        <title>Meldinger | Frilansportalen</title>
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Meldinger</h1>

        {meldinger.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen meldinger ennå.</p>
        ) : (
          <ul className="space-y-4 text-sm mb-6">
            {meldinger.map((m) => (
              <li key={m.id} className="bg-white border rounded p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">
                  {new Date(m.tidspunkt).toLocaleString("no-NO")}
                </p>
                <p className="mb-2">{m.tekst}</p>
                <button
                  onClick={() => setValgtId(m.id)}
                  className="text-xs underline text-blue-600 hover:text-blue-800"
                >
                  Svar
                </button>
              </li>
            ))}
          </ul>
        )}

        {valgtId && (
          <div className="mb-8">
            <textarea
              placeholder="Skriv svar..."
              value={ny}
              onChange={(e) => setNy(e.target.value)}
              className="w-full p-2 border rounded mb-2 h-24"
            />
            <button
              onClick={() => send(ny)}
              className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
            >
              Send svar
            </button>
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-1">Eller bruk et hurtigsvar:</p>
              <div className="flex flex-wrap gap-2">
                {hurtigsvar.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => send(h.tekst)}
                    className="bg-gray-100 border px-3 py-1 rounded text-xs hover:bg-gray-200"
                  >
                    {h.tekst}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
