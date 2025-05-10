import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function LeggTilStilling() {
  const [tittel, setTittel] = useState("");
  const [sted, setSted] = useState("");
  const [type, setType] = useState("heltid");
  const [bransje, setBransje] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [melding, setMelding] = useState("");

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const { error } = await supabase.from("stillinger").insert({
      opprettet_av: id,
      tittel,
      sted,
      type,
      bransje,
      beskrivelse,
      opprettet_dato: new Date().toISOString(),
    });

    if (error) {
      setMelding("Kunne ikke lagre stillingen.");
    } else {
      setMelding("Stilling publisert!");
      setTittel(""); setSted(""); setBransje(""); setBeskrivelse("");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Legg til stilling | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Publiser stilling</h1>

        <input value={tittel} onChange={(e) => setTittel(e.target.value)} placeholder="Tittel"
          className="w-full p-2 border rounded mb-3" />

        <input value={sted} onChange={(e) => setSted(e.target.value)} placeholder="Sted"
          className="w-full p-2 border rounded mb-3" />

        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded mb-3">
          <option value="heltid">Heltid</option>
          <option value="deltid">Deltid</option>
          <option value="oppdrag">Oppdrag</option>
        </select>

        <input value={bransje} onChange={(e) => setBransje(e.target.value)} placeholder="Bransje"
          className="w-full p-2 border rounded mb-3" />

        <textarea value={beskrivelse} onChange={(e) => setBeskrivelse(e.target.value)} placeholder="Beskrivelse"
          className="w-full p-2 border rounded mb-3 h-32 resize-none" />

        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Publiser stilling
        </button>

        {melding && <p className="text-sm text-green-600 mt-4">{melding}</p>}
      </div>
    </Layout>
  );
}
