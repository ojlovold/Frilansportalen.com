import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Feil() {
  const [melding, setMelding] = useState("");
  const [sendt, setSendt] = useState(false);

  const send = async () => {
    if (!melding) return;
    await supabase.from("varsler").insert({
      bruker_id: "admin", // Placeholder – byttes ut med faktisk admin-ID
      tekst: `Brukerrapportert feil: ${melding}`,
      lenke: "/feil",
    });
    setSendt(true);
    setMelding("");
  };

  return (
    <Layout>
      <Head>
        <title>Feilmelding | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Rapporter en feil</h1>

      {sendt ? (
        <p className="text-green-600 text-sm">Takk! Meldingen er sendt til administrator.</p>
      ) : (
        <div className="max-w-lg space-y-4">
          <textarea
            placeholder="Beskriv feilen du opplevde..."
            value={melding}
            onChange={(e) => setMelding(e.target.value)}
            className="w-full h-32 border p-2 rounded resize-none"
          />
          <button
            onClick={send}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
          >
            Send feilmelding
          </button>
        </div>
      )}
    </Layout>
  );
}
