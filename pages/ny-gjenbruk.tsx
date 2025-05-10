import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function NyGjenbruk() {
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [sted, setSted] = useState("");
  const [kontakt, setKontakt] = useState("");
  const [melding, setMelding] = useState("");

  const lagre = async () => {
    const { error } = await supabase.from("gjenbruk").insert({
      tittel,
      beskrivelse,
      sted,
      kontakt,
    });

    if (error) {
      setMelding("Feil: " + error.message);
    } else {
      setMelding("Annonsen er publisert!");
      setTittel(""); setBeskrivelse(""); setSted(""); setKontakt("");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Ny gjenbruksannonse | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Legg inn gjenbruksannonse</h1>

        <input
          value={tittel}
          onChange={(e) => setTittel(e.target.value)}
          placeholder="Tittel"
          className="w-full p-2 border rounded mb-3"
        />

        <textarea
          value={beskrivelse}
          onChange={(e) => setBeskrivelse(e.target.value)}
          placeholder="Beskrivelse"
          className="w-full p-2 border rounded mb-3 h-24 resize-none"
        />

        <input
          value={sted}
          onChange={(e) => setSted(e.target.value)}
          placeholder="Sted"
          className="w-full p-2 border rounded mb-3"
        />

        <input
          value={kontakt}
          onChange={(e) => setKontakt(e.target.value)}
          placeholder="Kontaktinformasjon"
          className="w-full p-2 border rounded mb-3"
        />

        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
        >
          Publiser annonse
        </button>

        {melding && <p className="text-sm text-green-600 mt-4">{melding}</p>}
      </div>
    </Layout>
  );
}
