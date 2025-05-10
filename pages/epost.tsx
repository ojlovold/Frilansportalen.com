import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Epost() {
  const [meldinger, setMeldinger] = useState<any[]>([]);
  const [svar, setSvar] = useState("");
  const [filter, setFilter] = useState("");
  const [valgtId, setValgtId] = useState<string | null>(null);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data } = await supabase
        .from("meldinger")
        .select("*")
        .or(`til.eq.${id},fra.eq.${id}`)
        .order("tidspunkt", { ascending: false });

      if (data) setMeldinger(data);
    };

    hent();
  }, []);

  const sendSvar = async () => {
    const bruker = await supabase.auth.getUser();
    const fra = bruker.data.user?.id;
    if (!fra || !valgtId) return;

    const original = meldinger.find((m) => m.id === valgtId);
    if (!original) return;

    const til = original.fra === fra ? original.til : original.fra;

    const tekstTrimmet = svar.trim();

    await supabase.from("meldinger").insert({
      fra,
      til,
      tekst: tekstTrimmet,
      tidspunkt: new Date().toISOString(),
    });

    // Lag varsling til mottaker
    await supabase.from("varsler").insert({
      bruker_id: til,
      tekst: "Du har fått en ny melding",
      lenke: "/epost",
    });

    setSvar("");
    setValgtId(null);
    window.location.reload();
  };

  const filtrert = meldinger.filter((m) =>
    m.tekst?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Layout>
      <Head>
        <title>E-post | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">E-post</h1>

      <input
        placeholder="Søk i meldinger..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      />

      {filtrert.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen meldinger funnet.</p>
      ) : (
        <ul className="space-y-4 text-sm">
          {filtrert.map((m) => (
            <li key={m.id} className="bg-white border rounded p-4 shadow-sm">
              <p className="text-gray-600 text-xs mb-1">
                {new Date(m.tidspunkt).toLocaleString("no-NO")}
              </p>
              <p>{m.tekst}</p>
              <button
                onClick={() => setValgtId(m.id)}
                className="mt-2 text-xs underline text-blue-600 hover:text-blue-800"
              >
                Svar
              </button>
              {valgtId === m.id && (
                <div className="mt-2">
                  <textarea
                    placeholder="Skriv svar..."
                    value={svar}
                    onChange={(e) => setSvar(e.target.value)}
                    className="w-full border p-2 rounded mb-2"
                  />
                  <button
                    onClick={sendSvar}
                    className="bg-black text-white px-4 py-1 rounded text-xs"
                  >
                    Send
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
