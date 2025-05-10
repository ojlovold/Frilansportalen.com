import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Kontakt() {
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [melding, setMelding] = useState("");
  const [sendt, setSendt] = useState(false);

  const send = async () => {
    if (!navn || !epost || !melding) return;

    await supabase.from("varsler").insert({
      bruker_id: "admin", // Bytt ut med admin-ID eller bruk systemkonto
      tekst: `Kontaktmelding fra ${navn} (${epost}): ${melding}`,
      lenke: "/kontakt",
    });

    setNavn("");
    setEpost("");
    setMelding("");
    setSendt(true);
  };

  return (
    <Layout>
      <Head>
        <title>Kontakt oss | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Kontakt oss</h1>

      {sendt ? (
        <p className="text-green-600 text-sm">Takk! Meldingen er sendt.</p>
      ) : (
        <div className="max-w-lg grid gap-4">
          <input
            placeholder="Ditt navn"
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <input
            placeholder="Din e-post"
            value={epost}
            onChange={(e) => setEpost(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <textarea
            placeholder="Din melding..."
            value={melding}
            onChange={(e) => setMelding(e.target.value)}
            className="p-2 border rounded w-full h-28 resize-none"
          />
          <button
            onClick={send}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
          >
            Send melding
          </button>
        </div>
      )}
    </Layout>
  );
}
