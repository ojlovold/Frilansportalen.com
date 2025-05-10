import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Styring() {
  const [annonser, setAnnonser] = useState<any[]>([]);
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase.from("gjenbruk").select("*").order("opprettet_dato", { ascending: false });
      setAnnonser(data || []);
    };

    hent();
  }, []);

  const slett = async (id: string) => {
    const bekreft = confirm("Slett denne annonsen?");
    if (!bekreft) return;

    const { error } = await supabase.from("gjenbruk").delete().eq("id", id);
    if (error) {
      setMelding("Feil under sletting.");
    } else {
      setMelding("Annonse slettet.");
      setAnnonser((a) => a.filter((x) => x.id !== id));
    }
  };

  return (
    <Layout>
      <Head>
        <title>Styring | Gjenbruksannonser | Frilansportalen</title>
      </Head>

      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Administrer gjenbruksannonser</h1>

        {melding && <p className="text-sm text-green-600 mb-4">{melding}</p>}

        {annonser.length === 0 ? (
          <p className="text-sm text-gray-600">Ingen annonser publisert ennå.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {annonser.map((a) => (
              <li key={a.id} className="bg-white border p-4 rounded shadow-sm">
                <h2 className="text-lg font-semibold">{a.tittel}</h2>
                <p className="text-xs text-gray-500 mb-1">{a.sted} · {new Date(a.opprettet_dato).toLocaleDateString("no-NO")}</p>
                <p>{a.beskrivelse}</p>
                <button
                  onClick={() => slett(a.id)}
                  className="mt-2 text-xs text-red-700 underline"
                >
                  Slett annonse
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
