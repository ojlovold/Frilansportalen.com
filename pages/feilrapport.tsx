import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Feilrapport() {
  const [tekst, setTekst] = useState("");
  const [sendt, setSendt] = useState(false);

  const send = async () => {
    if (!tekst.trim()) return;

    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id || "ukjent";

    await supabase.from("varsler").insert({
      bruker_id: id,
      tekst: `Brukerrapportert feil: ${tekst}`,
      lenke: "/feilrapport",
    });

    setSendt(true);
    setTekst("");
  };

  return (
    <Layout>
      <Head>
        <title>Rapporter en feil | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Rapporter en feil</h1>

        {sendt ? (
          <p className="text-green-700 text-sm">Takk! Meldingen er sendt til administrator.</p>
        ) : (
          <>
            <textarea
              placeholder="Beskriv problemet du opplever..."
              value={tekst}
              onChange={(e) => setTekst(e.target.value)}
              className="w-full h-32 p-2 border rounded mb-4 resize-none"
            />
            <button
              onClick={send}
              className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
            >
              Send inn
            </button>
          </>
        )}
      </div>
    </Layout>
  );
}
